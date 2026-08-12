import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  hue: number;
}

const DURATION_MS = 1600;

/**
 * Partículas de crítico, desenhadas à mão em canvas.
 *
 * Sem biblioteca: são poucas dezenas de pontos com gravidade. O efeito se
 * apaga sozinho e cancela o rAF ao desmontar.
 */
export function CriticalFx({ kind }: { kind: 'acerto' | 'falha' }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    ctx.scale(dpr, dpr);

    const centerX = width / 2;
    const centerY = height / 2;
    const success = kind === 'acerto';
    const count = success ? 90 : 60;

    const particles: Particle[] = Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = success ? 1.6 + Math.random() * 4.4 : 0.8 + Math.random() * 2.2;
      return {
        x: centerX + (Math.random() - 0.5) * 60,
        y: centerY + (Math.random() - 0.5) * 40,
        vx: Math.cos(angle) * speed,
        // Fagulhas sobem; fragmentos caem.
        vy: success ? Math.sin(angle) * speed - 2.2 : Math.abs(Math.sin(angle)) * speed + 0.6,
        life: 1,
        size: success ? 1.4 + Math.random() * 2.6 : 1.8 + Math.random() * 3.4,
        hue: success ? 38 + Math.random() * 18 : 6 + Math.random() * 12,
      };
    });

    const start = performance.now();
    let frame = 0;

    const draw = (now: number): void => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / DURATION_MS, 1);
      ctx.clearRect(0, 0, width, height);

      // Anel de luz expandindo a partir do centro.
      if (success && progress < 0.55) {
        const ringProgress = progress / 0.55;
        const radius = 40 + ringProgress * Math.max(width, height) * 0.42;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 209, 102, ${(1 - ringProgress) * 0.5})`;
        ctx.lineWidth = 2.5 * (1 - ringProgress) + 0.5;
        ctx.stroke();
      }

      for (const particle of particles) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += success ? 0.09 : 0.16;
        particle.vx *= 0.99;
        particle.life = 1 - progress;

        if (particle.life <= 0) continue;

        const alpha = particle.life * particle.life;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2);
        ctx.fillStyle = success
          ? `hsla(${particle.hue}, 92%, ${62 + particle.life * 18}%, ${alpha})`
          : `hsla(${particle.hue}, 68%, ${34 + particle.life * 14}%, ${alpha})`;
        ctx.fill();
      }

      if (progress < 1) frame = requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, width, height);
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [kind]);

  return <canvas className="critico-fx" ref={canvasRef} aria-hidden="true" />;
}
