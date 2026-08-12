/**
 * Contrato da mesa compartilhada.
 *
 * A rolagem NÃO trafega como resultado pronto: vão só a expressão e a
 * semente, e cada aparelho reexecuta o motor. Como o motor é determinístico,
 * todos chegam ao mesmo resultado — e, de quebra, a física roda nativamente
 * em cada tela, em vez de alguém receber um número já rolado.
 */

import type { DiceSkin } from '@/state/types';

export type EstadoDaRede =
  | 'desconectado'
  | 'conectando'
  | 'conectado'
  | 'reconectando'
  | 'erro';

export interface Participante {
  id: string;
  nome: string;
  skin: DiceSkin;
  /** O Mestre pode ocultar rolagens e mexer no Medo. */
  mestre: boolean;
}

/** Tudo que outro aparelho precisa para reproduzir uma rolagem. */
export interface RolagemCompartilhada {
  /** Mesmo id da entrada de histórico, para o "revelar" achar a rolagem. */
  id: string;
  expressao: string;
  semente: string;
  /** Epoch ms de quem rolou — mantém o histórico na mesma ordem em todos. */
  momento: number;
  personagem: string | null;
  skin: DiceSkin;
  atalho: string | null;
  oculta: boolean;
}

export type MensagemCliente =
  | { tipo: 'entrar'; sala: string; nome: string; skin: DiceSkin; mestre: boolean }
  | { tipo: 'rolagem'; carga: RolagemCompartilhada }
  | { tipo: 'revelar'; rolagemId: string }
  | { tipo: 'medo'; valor: number }
  | { tipo: 'pulso' };

export type MensagemServidor =
  | {
      tipo: 'bem-vindo';
      suaId: string;
      sala: string;
      participantes: Participante[];
      medo: number;
    }
  | { tipo: 'presenca'; participantes: Participante[] }
  | { tipo: 'rolagem'; de: string; carga: RolagemCompartilhada }
  | { tipo: 'revelar'; de: string; rolagemId: string }
  | { tipo: 'medo'; valor: number }
  | { tipo: 'erro'; mensagem: string };

/** Callbacks que o resto do app registra na conexão. */
export interface OuvintesDaRede {
  onEstado?: (estado: EstadoDaRede, erro?: string) => void;
  onPresenca?: (participantes: Participante[], suaId: string) => void;
  onRolagem?: (carga: RolagemCompartilhada, de: string) => void;
  onRevelar?: (rolagemId: string) => void;
  onMedo?: (valor: number) => void;
}

export interface ConexaoDaMesa {
  conectar(opcoes: {
    url: string;
    sala: string;
    nome: string;
    skin: DiceSkin;
    mestre: boolean;
  }): void;
  desconectar(): void;
  enviarRolagem(carga: RolagemCompartilhada): void;
  enviarRevelar(rolagemId: string): void;
  enviarMedo(valor: number): void;
  estado(): EstadoDaRede;
}

/**
 * Alfabeto sem caracteres que se confundem lidos em voz alta ou por foto:
 * nada de O/0, I/1, S/5.
 */
const ALFABETO = 'ABCDEFGHJKLMNPQRTUVWXYZ23456789';

export function gerarCodigoDeSala(tamanho = 4): string {
  const valores = new Uint32Array(tamanho);
  const cripto = typeof globalThis !== 'undefined' ? globalThis.crypto : undefined;

  if (cripto && typeof cripto.getRandomValues === 'function') {
    cripto.getRandomValues(valores);
  } else {
    for (let i = 0; i < tamanho; i += 1) {
      valores[i] = Math.floor(Math.random() * 0xffffffff);
    }
  }

  let codigo = '';
  for (let i = 0; i < tamanho; i += 1) {
    codigo += ALFABETO[(valores[i] ?? 0) % ALFABETO.length];
  }
  return codigo;
}

/**
 * Normaliza o que o usuário digitou: maiúsculas, sem espaços nem pontuação.
 *
 * De propósito não tenta adivinhar letra trocada. O alfabeto já evita os
 * pares que se confundem; corrigir "O" para alguma outra letra acertaria às
 * vezes e estragaria um código válido nas outras.
 */
export function normalizarCodigo(bruto: string): string {
  return bruto
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 8);
}
