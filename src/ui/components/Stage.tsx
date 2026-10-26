import { useEffect, useRef, useState } from 'react';
import type { DiceStage } from '@/state/types';
import { createInertStage } from '@/three/inerte';
import { audio } from '@/audio/sfx';
import { useAionStore } from '@/state/store';
import { avisar } from '@/ui/avisos';
import { carregarPalco } from '@/ui/carregamento';
import '@/ui/styles/stage.css';

/**
 * Ponte entre o store e a cena 3D.
 *
 * O React não dirige a animação — ele entrega o que arremessar, espera as
 * faces voltarem e devolve essas faces ao store. O laço de render vive
 * inteiro em `src/three/stage.ts`.
 */
export function Stage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<DiceStage | null>(null);
  /** Últimos pedidos já executados — o StrictMode monta duas vezes em dev. */
  const handledRef = useRef<string | null>(null);
  /** O aparelho não abriu WebGL: a mesa vira feltro pintado, e a pessoa é avisada. */
  const [semWebgl, setSemWebgl] = useState(false);
  /**
   * O palco existe (ou é o inerte). O pacote do 3D vem sob demanda, então há um
   * intervalo em que a mesa está de pé e o palco não: quem rolou nele espera.
   */
  const [pronto, setPronto] = useState(false);

  // Mesma regra que o store usa para decidir se enfileira uma requisição.
  const physics3d = useAionStore(
    (state) => state.settings.physics3d && !state.settings.reducedMotion,
  );
  const pendingRequest = useAionStore((state) => state.pendingRequest);
  const pendingExibicao = useAionStore((state) => state.pendingExibicao);
  const rollSpeed = useAionStore((state) => state.settings.rollSpeed);
  const sound = useAionStore((state) => state.settings.sound);
  const haptics = useAionStore((state) => state.settings.haptics);

  // Refs para as preferências: o palco é criado uma vez só, e os callbacks
  // dele não devem capturar valores velhos.
  const soundRef = useRef(sound);
  const hapticsRef = useRef(haptics);
  soundRef.current = sound;
  hapticsRef.current = haptics;

  /** Som e vibração da revelação, já sabendo o que saiu. */
  function anunciar(): void {
    const critical = useAionStore.getState().lastResult?.critical ?? null;

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
  }

  useEffect(() => {
    if (!physics3d) return undefined;

    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let cancelado = false;
    let stage: DiceStage | null = null;
    let semPacote = false;

    // O three e a física não vêm no pacote do menu (ver carregamento.ts). Se
    // não chegarem — sem rede, ou cache velho de um deploy antigo —, a mesa cai
    // no palco inerte, como num aparelho sem WebGL: as rolagens valem do mesmo
    // jeito, só não há dado a ver.
    void carregarPalco()
      .then(({ createDiceStage }): DiceStage | null => {
        // A pessoa já saiu da mesa (ou desligou o 3D) enquanto o pacote vinha:
        // nem se cria o palco, para não haver dois sobre o mesmo canvas.
        if (cancelado) return null;
        return createDiceStage(canvas, {
          onImpact(intensity, shape) {
            if (soundRef.current) audio.impact(intensity, shape);
          },
        });
      })
      .catch((erro: unknown): DiceStage => {
        semPacote = true;
        console.warn('Aion: o palco 3D não carregou.', erro);
        return createInertStage();
      })
      .then((criado) => {
        if (!criado) return;
        if (cancelado) {
          criado.dispose();
          return;
        }

        stage = criado;
        stageRef.current = criado;
        criado.resize();

        if (criado.inerte) {
          // Sem isto, o canvas ficava vazio e preto, e quem jogava achava que o
          // app tinha quebrado. As rolagens seguem valendo — só não há dado a ver.
          setSemWebgl(true);
          avisar(
            semPacote
              ? 'Os dados 3D não carregaram, então a mesa ficou simples. Recarregar a página pode resolver; as rolagens valem do mesmo jeito.'
              : 'Este aparelho não abriu os dados 3D, então a mesa ficou simples. As rolagens valem do mesmo jeito.',
          );
        }

        setPronto(true);
      });

    const container = containerRef.current;
    const observer = new ResizeObserver(() => stage?.resize());
    if (container) observer.observe(container);

    return () => {
      cancelado = true;
      observer.disconnect();
      stage?.dispose();
      stageRef.current = null;
      setPronto(false);
    };
  }, [physics3d]);

  useEffect(() => {
    stageRef.current?.setSpeed(rollSpeed);
  }, [rollSpeed]);

  // ------------------------------------------------------------ arremesso
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !pendingRequest) return;
    if (handledRef.current === pendingRequest.id) return;

    handledRef.current = pendingRequest.id;
    if (soundRef.current) audio.throwDice(pendingRequest.dados.length);

    void stage.arremessar(pendingRequest).then((faces) => {
      const store = useAionStore.getState();
      store.concluirArremesso(pendingRequest.id, faces);

      // O resultado já existe: agora dá para esmaecer o que foi descartado
      // e anunciar o que saiu.
      const descartados = store.indicesDescartados(pendingRequest.id);
      if (descartados.length > 0) stage.esmaecer(descartados);
      anunciar();
    });
    // `pronto`: uma rolagem feita enquanto o pacote do 3D ainda vinha espera por
    // ele aqui, e sai quando o palco aparece.
  }, [pendingRequest, pronto]);

  // ------------------------------------------ rolagem de outro aparelho
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !pendingExibicao) return;
    if (handledRef.current === pendingExibicao.id) return;

    handledRef.current = pendingExibicao.id;
    if (soundRef.current) audio.throwDice(pendingExibicao.dados.length);

    void stage.exibir(pendingExibicao).then(() => {
      const store = useAionStore.getState();
      const descartados = store.indicesDescartados(pendingExibicao.id);
      if (descartados.length > 0) stage.esmaecer(descartados);
      store.onStageSettled();
      anunciar();
    });
  }, [pendingExibicao, pronto]);

  return (
    <div className="palco" ref={containerRef}>
      {physics3d && !semWebgl ? (
        <>
          {/* O feltro pintado cobre o intervalo até o 3D chegar: sem ele a mesa
              abriria num preto que muda de repente. Quando o palco aparece, os
              dois se cruzam — o feltro some enquanto o canvas surge. */}
          <div
            className={`palco__estatico palco__estatico--espera${pronto ? ' palco__estatico--saindo' : ''}`}
            aria-hidden="true"
          />
          <canvas
            className="palco__canvas"
            ref={canvasRef}
            data-pronto={pronto ? 'sim' : undefined}
            aria-hidden="true"
          />
        </>
      ) : (
        <div className="palco__estatico" aria-hidden="true" />
      )}
      <div className="palco__vinheta" aria-hidden="true" />
    </div>
  );
}
