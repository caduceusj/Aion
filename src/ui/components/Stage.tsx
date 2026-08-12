import { useEffect, useRef } from 'react';
import type { DiceStage } from '@/state/types';
import { createDiceStage } from '@/three/stage';
import { audio } from '@/audio/sfx';
import { useAionStore } from '@/state/store';
import '@/ui/styles/stage.css';

/**
 * Ponte entre o store e a cena 3D.
 *
 * O React não dirige a animação — ele só entrega requisições de rolagem ao
 * palco e escuta o assentamento. O laço de render vive inteiro em
 * `src/three/stage.ts`.
 */
export function Stage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<DiceStage | null>(null);
  /** Última requisição já executada — o StrictMode monta duas vezes em dev. */
  const handledRef = useRef<string | null>(null);

  // Mesma regra que o store usa para decidir se enfileira uma requisição.
  const physics3d = useAionStore(
    (state) => state.settings.physics3d && !state.settings.reducedMotion,
  );
  const pendingRequest = useAionStore((state) => state.pendingRequest);
  const rollSpeed = useAionStore((state) => state.settings.rollSpeed);
  const sound = useAionStore((state) => state.settings.sound);
  const haptics = useAionStore((state) => state.settings.haptics);

  // Refs para as preferências: o palco é criado uma vez só, e os callbacks
  // dele não devem capturar valores velhos.
  const soundRef = useRef(sound);
  const hapticsRef = useRef(haptics);
  soundRef.current = sound;
  hapticsRef.current = haptics;

  useEffect(() => {
    if (!physics3d) return undefined;

    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const stage = createDiceStage(canvas, {
      onImpact(intensity, shape) {
        if (soundRef.current) audio.impact(intensity, shape);
      },
      onSettled() {
        const store = useAionStore.getState();
        store.onStageSettled();

        const critical = store.lastResult?.critical ?? null;
        if (soundRef.current) {
          if (critical === 'max') audio.critical();
          else if (critical === 'min') audio.fumble();
          else audio.reveal();
        }

        if (hapticsRef.current && typeof navigator !== 'undefined' && navigator.vibrate) {
          if (critical === 'max') navigator.vibrate([24, 40, 24, 40, 60]);
          else if (critical === 'min') navigator.vibrate([90]);
          else navigator.vibrate(18);
        }
      },
    });

    stageRef.current = stage;
    stage.resize();

    const container = containerRef.current;
    const observer = new ResizeObserver(() => stage.resize());
    if (container) observer.observe(container);

    return () => {
      observer.disconnect();
      stage.dispose();
      stageRef.current = null;
    };
  }, [physics3d]);

  useEffect(() => {
    stageRef.current?.setSpeed(rollSpeed);
  }, [rollSpeed]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !pendingRequest) return;
    if (handledRef.current === pendingRequest.id) return;

    handledRef.current = pendingRequest.id;
    if (soundRef.current) audio.throwDice(pendingRequest.result.dice.length);
    void stage.roll(pendingRequest);
  }, [pendingRequest]);

  return (
    <div className="palco" ref={containerRef}>
      {physics3d ? (
        <canvas className="palco__canvas" ref={canvasRef} aria-hidden="true" />
      ) : (
        <div className="palco__estatico" aria-hidden="true" />
      )}
      <div className="palco__vinheta" aria-hidden="true" />
    </div>
  );
}
