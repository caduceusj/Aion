/**
 * Som do Aion, inteiramente sintetizado em WebAudio.
 *
 * Nenhum arquivo é carregado: um dado batendo é ruído filtrado com envelope
 * curto, e o crítico é um arpejo. Sai mais leve que baixar amostras e
 * mantém o app funcionando offline.
 */

import type { AionAudio } from './types';

/** Vozes simultâneas de impacto. Acima disso, o som vira ruído branco. */
const MAX_IMPACT_VOICES = 6;

type AudioContextConstructor = new () => AudioContext;

function getAudioContextClass(): AudioContextConstructor | null {
  if (typeof window === 'undefined') return null;
  const candidate =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: AudioContextConstructor }).webkitAudioContext;
  return candidate ?? null;
}

function createNoiseBuffer(ctx: AudioContext, seconds: number): AudioBuffer {
  const length = Math.max(1, Math.floor(ctx.sampleRate * seconds));
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
  return buffer;
}

/**
 * Resposta ao impulso gerada em código: ruído com decaimento exponencial.
 * Dá a sensação de sala sem carregar um arquivo de reverb.
 */
function createImpulseResponse(ctx: AudioContext, seconds = 1.2, decay = 3.2): AudioBuffer {
  const length = Math.max(1, Math.floor(ctx.sampleRate * seconds));
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);

  for (let channel = 0; channel < 2; channel += 1) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** decay;
    }
  }

  return buffer;
}

/** Cada poliedro tem seu timbre: quanto mais faces, mais grave o baque. */
const SHAPE_TONE: Record<string, number> = {
  d4: 1500,
  d6: 1150,
  d8: 1000,
  d10: 900,
  d12: 820,
  d20: 700,
  d100: 900,
  dF: 1150,
};

export function createAudio(): AionAudio {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let reverbSend: GainNode | null = null;
  let noise: AudioBuffer | null = null;

  let volume = 0.7;
  let enabled = true;
  let impactVoices = 0;
  let failed = false;

  /** Cria o contexto na primeira necessidade — nunca no import. */
  function ensure(): AudioContext | null {
    if (failed) return null;
    if (ctx) return ctx;

    const AudioCtor = getAudioContextClass();
    if (!AudioCtor) {
      failed = true;
      return null;
    }

    try {
      ctx = new AudioCtor();

      // Compressor no fim da cadeia: dez dados batendo juntos não estouram.
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.value = -18;
      compressor.knee.value = 22;
      compressor.ratio.value = 8;
      compressor.attack.value = 0.003;
      compressor.release.value = 0.18;
      compressor.connect(ctx.destination);

      master = ctx.createGain();
      master.gain.value = enabled ? volume : 0;
      master.connect(compressor);

      const convolver = ctx.createConvolver();
      convolver.buffer = createImpulseResponse(ctx);
      convolver.connect(master);

      reverbSend = ctx.createGain();
      reverbSend.gain.value = 0.18;
      reverbSend.connect(convolver);

      noise = createNoiseBuffer(ctx, 1);
      return ctx;
    } catch {
      failed = true;
      ctx = null;
      return null;
    }
  }

  function now(): number {
    return ctx ? ctx.currentTime : 0;
  }

  /** Liga uma voz ao master e ao envio de reverb. */
  function connectOut(node: AudioNode, reverbAmount = 1): void {
    if (master) node.connect(master);
    if (reverbSend && reverbAmount > 0) {
      const send = ctx?.createGain();
      if (send) {
        send.gain.value = reverbAmount;
        node.connect(send);
        send.connect(reverbSend);
      }
    }
  }

  function playNoise(
    start: number,
    duration: number,
    gain: number,
    frequency: number,
    q: number,
    reverbAmount = 0.6,
  ): void {
    if (!ctx || !noise) return;

    const source = ctx.createBufferSource();
    source.buffer = noise;
    source.playbackRate.value = 0.8 + Math.random() * 0.5;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = frequency;
    filter.Q.value = q;

    const envelope = ctx.createGain();
    envelope.gain.setValueAtTime(0, start);
    envelope.gain.linearRampToValueAtTime(gain, start + 0.004);
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    source.connect(filter);
    filter.connect(envelope);
    connectOut(envelope, reverbAmount);

    source.start(start);
    source.stop(start + duration + 0.02);
  }

  function playTone(
    start: number,
    duration: number,
    frequency: number,
    gain: number,
    type: OscillatorType = 'sine',
    reverbAmount = 0.8,
  ): void {
    if (!ctx) return;

    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, start);

    const envelope = ctx.createGain();
    envelope.gain.setValueAtTime(0, start);
    envelope.gain.linearRampToValueAtTime(gain, start + 0.012);
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    osc.connect(envelope);
    connectOut(envelope, reverbAmount);

    osc.start(start);
    osc.stop(start + duration + 0.02);
  }

  return {
    unlock(): void {
      const context = ensure();
      if (context && context.state === 'suspended') void context.resume();
    },

    throwDice(count: number): void {
      if (!enabled || !ensure()) return;
      const start = now();
      const shakes = Math.min(3 + Math.floor(count / 3), 7);
      for (let i = 0; i < shakes; i += 1) {
        playNoise(start + i * 0.035, 0.09, 0.16, 2200 + Math.random() * 1400, 1.4, 0.3);
      }
    },

    impact(intensity: number, shape: string): void {
      if (!enabled || !ensure()) return;
      if (impactVoices >= MAX_IMPACT_VOICES) return;

      impactVoices += 1;
      window.setTimeout(() => {
        impactVoices = Math.max(0, impactVoices - 1);
      }, 140);

      const level = Math.max(0, Math.min(1, intensity));
      const base = SHAPE_TONE[shape] ?? 950;
      // Variação de tom para dez impactos seguidos não soarem iguais.
      const tone = base * (0.82 + Math.random() * 0.4);
      const start = now();

      playNoise(start, 0.07 + level * 0.05, 0.1 + level * 0.28, tone, 2.2, 0.5);
      playTone(start, 0.05 + level * 0.04, tone * 0.45, 0.04 + level * 0.1, 'triangle', 0.4);
    },

    critical(): void {
      if (!enabled || !ensure()) return;
      const start = now();

      // Arpejo ascendente em quinta e oitava justas, com brilho por cima.
      const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
      notes.forEach((frequency, index) => {
        const at = start + index * 0.075;
        playTone(at, 0.62 - index * 0.05, frequency, 0.16, 'triangle', 1);
        playTone(at, 0.32, frequency * 2, 0.045, 'sine', 1);
      });

      playNoise(start + 0.05, 0.55, 0.05, 6500, 0.8, 1);
    },

    fumble(): void {
      if (!enabled || !ensure()) return;
      const start = now();

      // Duas vozes graves em segunda menor, caindo — dissonância clássica.
      for (const [frequency, detune] of [
        [110, 1],
        [116.5, 1],
      ] as const) {
        if (!ctx) break;
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(frequency * detune, start);
        osc.frequency.exponentialRampToValueAtTime(frequency * 0.55, start + 0.6);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(900, start);
        filter.frequency.exponentialRampToValueAtTime(180, start + 0.6);

        const envelope = ctx.createGain();
        envelope.gain.setValueAtTime(0, start);
        envelope.gain.linearRampToValueAtTime(0.19, start + 0.02);
        envelope.gain.exponentialRampToValueAtTime(0.0001, start + 0.62);

        osc.connect(filter);
        filter.connect(envelope);
        connectOut(envelope, 0.9);
        osc.start(start);
        osc.stop(start + 0.66);
      }

      playNoise(start, 0.3, 0.12, 140, 1.1, 0.7);
    },

    reveal(): void {
      if (!enabled || !ensure()) return;
      const start = now();
      playTone(start, 0.16, 1244.5, 0.08, 'sine', 0.6);
      playTone(start + 0.05, 0.2, 1661.2, 0.05, 'sine', 0.6);
    },

    click(): void {
      if (!enabled || !ensure()) return;
      playNoise(now(), 0.03, 0.09, 3200, 3, 0.1);
    },

    setVolume(next: number): void {
      volume = Math.max(0, Math.min(1, next));
      if (master && ctx) {
        master.gain.setTargetAtTime(enabled ? volume : 0, ctx.currentTime, 0.02);
      }
    },

    setEnabled(next: boolean): void {
      enabled = next;
      if (master && ctx) {
        master.gain.setTargetAtTime(enabled ? volume : 0, ctx.currentTime, 0.02);
      }
    },

    dispose(): void {
      if (ctx) void ctx.close().catch(() => undefined);
      ctx = null;
      master = null;
      reverbSend = null;
      noise = null;
    },
  };
}

let singleton: AionAudio | null = null;

/**
 * Instância única e preguiçosa. Importar este módulo em ambiente sem DOM é
 * seguro: nada é criado até o primeiro método ser chamado, e sem
 * AudioContext todos eles viram no-op silencioso.
 */
export const audio: AionAudio = {
  unlock: () => resolveAudio().unlock(),
  throwDice: (count) => resolveAudio().throwDice(count),
  impact: (intensity, shape) => resolveAudio().impact(intensity, shape),
  critical: () => resolveAudio().critical(),
  fumble: () => resolveAudio().fumble(),
  reveal: () => resolveAudio().reveal(),
  click: () => resolveAudio().click(),
  setVolume: (value) => resolveAudio().setVolume(value),
  setEnabled: (value) => resolveAudio().setEnabled(value),
  dispose: () => {
    singleton?.dispose();
    singleton = null;
  },
};

function resolveAudio(): AionAudio {
  singleton ??= createAudio();
  return singleton;
}
