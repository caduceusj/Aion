/**
 * Cliente da mesa compartilhada.
 *
 * WebSocket cru, com reconexão em recuo exponencial. Não guarda estado de
 * jogo: só entrega e recebe mensagens, e quem decide o que fazer com elas é
 * o store. Assim a rede continua sendo uma folha da arquitetura.
 */

import type {
  ConexaoDaMesa,
  EstadoDaRede,
  MensagemCliente,
  MensagemServidor,
  OuvintesDaRede,
  RolagemCompartilhada,
} from './types';
import type { DiceSkin } from '@/state/types';

const RECONEXAO_INICIAL_MS = 800;
const RECONEXAO_MAXIMA_MS = 20000;
const PULSO_MS = 25000;

interface Sessao {
  url: string;
  sala: string;
  nome: string;
  skin: DiceSkin;
  mestre: boolean;
}

export function criarConexao(ouvintes: OuvintesDaRede = {}): ConexaoDaMesa {
  let socket: WebSocket | null = null;
  let sessao: Sessao | null = null;
  let estadoAtual: EstadoDaRede = 'desconectado';
  let tentativas = 0;
  let reconexao: ReturnType<typeof setTimeout> | null = null;
  let pulso: ReturnType<typeof setInterval> | null = null;
  /** Distingue "caiu a conexão" de "o usuário mandou sair". */
  let encerradoPeloUsuario = false;

  function definirEstado(estado: EstadoDaRede, erro?: string): void {
    if (estadoAtual === estado && !erro) return;
    estadoAtual = estado;
    ouvintes.onEstado?.(estado, erro);
  }

  function limparTimers(): void {
    if (reconexao) clearTimeout(reconexao);
    if (pulso) clearInterval(pulso);
    reconexao = null;
    pulso = null;
  }

  function enviar(mensagem: MensagemCliente): void {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    try {
      socket.send(JSON.stringify(mensagem));
    } catch {
      // Conexão caindo no meio do envio: o reconnect resolve.
    }
  }

  function agendarReconexao(): void {
    if (encerradoPeloUsuario || !sessao) return;

    tentativas += 1;
    const espera = Math.min(
      RECONEXAO_INICIAL_MS * 2 ** (tentativas - 1),
      RECONEXAO_MAXIMA_MS,
    );

    definirEstado('reconectando');
    reconexao = setTimeout(() => {
      if (sessao) abrir(sessao);
    }, espera);
  }

  function tratarMensagem(bruto: string): void {
    let mensagem: MensagemServidor;
    try {
      mensagem = JSON.parse(bruto) as MensagemServidor;
    } catch {
      return;
    }

    switch (mensagem.tipo) {
      case 'bem-vindo':
        tentativas = 0;
        definirEstado('conectado');
        ouvintes.onPresenca?.(mensagem.participantes, mensagem.suaId);
        ouvintes.onMedo?.(mensagem.medo);
        break;

      case 'presenca':
        ouvintes.onPresenca?.(mensagem.participantes, '');
        break;

      case 'rolagem':
        ouvintes.onRolagem?.(mensagem.carga, mensagem.de);
        break;

      case 'revelar':
        ouvintes.onRevelar?.(mensagem.rolagemId);
        break;

      case 'medo':
        ouvintes.onMedo?.(mensagem.valor);
        break;

      case 'erro':
        definirEstado('erro', mensagem.mensagem);
        break;
    }
  }

  function abrir(alvo: Sessao): void {
    limparTimers();

    try {
      socket = new WebSocket(alvo.url);
    } catch {
      definirEstado('erro', 'Endereço da mesa inválido.');
      return;
    }

    definirEstado(tentativas === 0 ? 'conectando' : 'reconectando');

    socket.onopen = () => {
      enviar({
        tipo: 'entrar',
        sala: alvo.sala,
        nome: alvo.nome,
        skin: alvo.skin,
        mestre: alvo.mestre,
      });
      pulso = setInterval(() => enviar({ tipo: 'pulso' }), PULSO_MS);
    };

    socket.onmessage = (evento) => {
      if (typeof evento.data === 'string') tratarMensagem(evento.data);
    };

    socket.onclose = () => {
      limparTimers();
      socket = null;
      if (encerradoPeloUsuario) {
        definirEstado('desconectado');
        return;
      }
      agendarReconexao();
    };

    socket.onerror = () => {
      // O onclose vem logo depois e cuida da reconexão; aqui só registramos
      // a causa para a interface poder mostrar algo útil.
      if (tentativas === 0) {
        definirEstado('erro', 'Não consegui falar com a mesa.');
      }
    };
  }

  return {
    conectar(opcoes) {
      encerradoPeloUsuario = false;
      tentativas = 0;
      sessao = { ...opcoes };

      if (socket) {
        socket.onclose = null;
        socket.close();
        socket = null;
      }

      abrir(sessao);
    },

    desconectar() {
      encerradoPeloUsuario = true;
      sessao = null;
      limparTimers();
      if (socket) {
        socket.close();
        socket = null;
      }
      definirEstado('desconectado');
    },

    enviarRolagem(carga: RolagemCompartilhada) {
      enviar({ tipo: 'rolagem', carga });
    },

    enviarRevelar(rolagemId: string) {
      enviar({ tipo: 'revelar', rolagemId });
    },

    enviarMedo(valor: number) {
      enviar({ tipo: 'medo', valor });
    },

    estado() {
      return estadoAtual;
    },
  };
}

/** Endereço padrão do relay, com os parâmetros da URL tendo prioridade. */
export function urlPadraoDoRelay(): string {
  if (typeof window === 'undefined') return 'ws://localhost:8787';

  const parametro = new URLSearchParams(window.location.search).get('relay');
  if (parametro) return parametro;

  // Servido pelo mesmo host? Tenta o relay ao lado, no caminho /mesa.
  const { protocol, hostname } = window.location;
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    const ws = protocol === 'https:' ? 'wss:' : 'ws:';
    return `${ws}//${window.location.host}/mesa`;
  }

  return 'ws://localhost:8787';
}

/** Código de sala vindo da URL, para entrar por link. */
export function salaDaUrl(): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get('sala');
}
