/**
 * Relay da mesa compartilhada do Aion.
 *
 * Repassa mensagens entre os aparelhos de uma mesma sala e mais nada. Não
 * guarda histórico, não valida rolagem e não sabe o resultado de dado
 * nenhum — as rolagens trafegam como expressão + semente, e cada aparelho
 * reexecuta o motor por conta própria.
 *
 * O único estado que ele mantém é o que precisa ser igual para todos: quem
 * está na sala e o contador de Medo do Mestre.
 *
 *   node server/relay.mjs            # porta 8787
 *   PORT=9000 node server/relay.mjs
 */

import { WebSocketServer } from 'ws';
import { randomUUID } from 'node:crypto';

const PORT = Number.parseInt(process.env.PORT ?? '8787', 10);
const MAX_POR_SALA = 12;
const MAX_MENSAGEM = 8 * 1024;
const TAMANHO_MAXIMO_SALA = 8;

/** @type {Map<string, { participantes: Map<string, any>, medo: number }>} */
const salas = new Map();

const servidor = new WebSocketServer({ port: PORT });

function salaDe(codigo) {
  let sala = salas.get(codigo);
  if (!sala) {
    sala = { participantes: new Map(), medo: 0 };
    salas.set(codigo, sala);
  }
  return sala;
}

function listaDeParticipantes(sala) {
  return [...sala.participantes.values()].map((p) => ({
    id: p.id,
    nome: p.nome,
    skin: p.skin,
    mestre: p.mestre,
  }));
}

function enviar(socket, mensagem) {
  if (socket.readyState !== socket.OPEN) return;
  try {
    socket.send(JSON.stringify(mensagem));
  } catch {
    // Cliente saindo no meio do envio — o close cuida da limpeza.
  }
}

function transmitir(sala, mensagem, exceto = null) {
  for (const participante of sala.participantes.values()) {
    if (participante.id === exceto) continue;
    enviar(participante.socket, mensagem);
  }
}

function anunciarPresenca(sala) {
  transmitir(sala, { tipo: 'presenca', participantes: listaDeParticipantes(sala) });
}

function textoCurto(valor, limite) {
  return typeof valor === 'string' ? valor.slice(0, limite) : '';
}

servidor.on('connection', (socket) => {
  /** @type {{ id: string, codigo: string } | null} */
  let sessao = null;

  socket.on('message', (bruto) => {
    if (bruto.length > MAX_MENSAGEM) return;

    let mensagem;
    try {
      mensagem = JSON.parse(bruto.toString());
    } catch {
      return;
    }
    if (!mensagem || typeof mensagem.tipo !== 'string') return;

    if (mensagem.tipo === 'entrar') {
      const codigo = textoCurto(mensagem.sala, TAMANHO_MAXIMO_SALA)
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '');

      if (codigo.length < 3) {
        enviar(socket, { tipo: 'erro', mensagem: 'Código de sala inválido.' });
        return;
      }

      const sala = salaDe(codigo);
      if (sala.participantes.size >= MAX_POR_SALA) {
        enviar(socket, { tipo: 'erro', mensagem: 'Esta mesa já está cheia.' });
        return;
      }

      const id = randomUUID();
      sessao = { id, codigo };

      sala.participantes.set(id, {
        id,
        socket,
        nome: textoCurto(mensagem.nome, 40) || 'Convidado',
        skin: textoCurto(mensagem.skin, 20) || 'ambar',
        mestre: mensagem.mestre === true,
      });

      enviar(socket, {
        tipo: 'bem-vindo',
        suaId: id,
        sala: codigo,
        participantes: listaDeParticipantes(sala),
        medo: sala.medo,
      });
      anunciarPresenca(sala);
      console.log(`[${codigo}] entrou ${id} (${sala.participantes.size} na mesa)`);
      return;
    }

    if (!sessao) return;
    const sala = salas.get(sessao.codigo);
    if (!sala) return;

    switch (mensagem.tipo) {
      case 'rolagem': {
        const carga = mensagem.carga;
        if (!carga || typeof carga.expressao !== 'string' || typeof carga.semente !== 'string') {
          return;
        }
        transmitir(sala, { tipo: 'rolagem', de: sessao.id, carga }, sessao.id);
        break;
      }

      case 'revelar': {
        if (typeof mensagem.rolagemId !== 'string') return;
        transmitir(
          sala,
          { tipo: 'revelar', de: sessao.id, rolagemId: mensagem.rolagemId },
          sessao.id,
        );
        break;
      }

      case 'medo': {
        const valor = Number(mensagem.valor);
        if (!Number.isFinite(valor)) return;
        sala.medo = Math.max(0, Math.min(99, Math.floor(valor)));
        transmitir(sala, { tipo: 'medo', valor: sala.medo });
        break;
      }

      case 'pulso':
        break;

      default:
        break;
    }
  });

  socket.on('close', () => {
    if (!sessao) return;
    const sala = salas.get(sessao.codigo);
    if (!sala) return;

    sala.participantes.delete(sessao.id);
    console.log(`[${sessao.codigo}] saiu ${sessao.id} (${sala.participantes.size} restantes)`);

    if (sala.participantes.size === 0) {
      // Sala vazia não precisa sobreviver: o histórico vive nos aparelhos.
      salas.delete(sessao.codigo);
    } else {
      anunciarPresenca(sala);
    }
  });

  socket.on('error', () => {
    // Erro de socket individual não pode derrubar o relay inteiro.
  });
});

console.log(`Aion — relay da mesa ouvindo em ws://localhost:${PORT}`);
console.log('Para outros aparelhos, use o IP da sua máquina na mesma rede.');
