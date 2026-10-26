import { useEffect, useState } from 'react';

function vale(consulta: string): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia(consulta).matches
  );
}

/** Se uma media query vale agora — e se continua valendo quando a janela muda. */
export function useMediaQuery(consulta: string): boolean {
  const [valendo, setValendo] = useState(() => vale(consulta));

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;
    const media = window.matchMedia(consulta);
    const aplicar = (): void => setValendo(media.matches);
    aplicar();
    media.addEventListener('change', aplicar);
    return () => media.removeEventListener('change', aplicar);
  }, [consulta]);

  return valendo;
}
