/** Ícones SVG inline. Sem fonte de ícones, sem requisição de rede. */

export interface IconProps {
  size?: number;
  className?: string;
}

interface GlyphProps extends IconProps {
  children: React.ReactNode;
  /** Ícones preenchidos desligam o traço. */
  filled?: boolean;
}

function Glyph({ size = 20, className, children, filled = false }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...(className ? { className } : {})}
    >
      {children}
    </svg>
  );
}

export const IconDado = (props: IconProps) => (
  <Glyph {...props}>
    <path d="M12 2.6 21 7.8v8.4L12 21.4 3 16.2V7.8z" />
    <path d="M12 2.6v18.8M3 7.8l9 5.2 9-5.2" />
  </Glyph>
);

export const IconHistorico = (props: IconProps) => (
  <Glyph {...props}>
    <path d="M3.2 12a8.8 8.8 0 1 0 2.6-6.2" />
    <path d="M3 4.5V9h4.5" />
    <path d="M12 7.6V12l3 1.8" />
  </Glyph>
);

export const IconAtalhos = (props: IconProps) => (
  <Glyph {...props}>
    <path d="M13 2.8 4.4 13.4h6l-1.4 7.8 8.6-10.6h-6z" />
  </Glyph>
);

export const IconAjustes = (props: IconProps) => (
  <Glyph {...props}>
    <circle cx="12" cy="12" r="3.1" />
    <path d="M19.6 14.6a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.84 2.84l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 0 1-4 0v-.12a1.7 1.7 0 0 0-1.1-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.84-2.84l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 0 1 0-4h.12a1.7 1.7 0 0 0 1.56-1.1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.84-2.84l.06.06a1.7 1.7 0 0 0 1.87.34H9a1.7 1.7 0 0 0 1.03-1.56V3a2 2 0 0 1 4 0v.12a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.84 2.84l-.06.06a1.7 1.7 0 0 0-.34 1.87V9a1.7 1.7 0 0 0 1.56 1.03H21a2 2 0 0 1 0 4h-.12a1.7 1.7 0 0 0-1.56 1.03z" />
  </Glyph>
);

export const IconFechar = (props: IconProps) => (
  <Glyph {...props}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Glyph>
);

export const IconRolar = (props: IconProps) => (
  <Glyph {...props}>
    <path d="M12 2.6 21 7.8v8.4L12 21.4 3 16.2V7.8z" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
  </Glyph>
);

export const IconRepetir = (props: IconProps) => (
  <Glyph {...props}>
    <path d="M20.5 11a8.5 8.5 0 1 0-.9 5" />
    <path d="M21 3.5V9h-5.5" />
  </Glyph>
);

export const IconVantagem = (props: IconProps) => (
  <Glyph {...props}>
    <path d="M12 19V5M6 11l6-6 6 6" />
  </Glyph>
);

export const IconDesvantagem = (props: IconProps) => (
  <Glyph {...props}>
    <path d="M12 5v14M18 13l-6 6-6-6" />
  </Glyph>
);

export const IconOlho = (props: IconProps) => (
  <Glyph {...props}>
    <path d="M2.2 12S5.8 5.4 12 5.4 21.8 12 21.8 12 18.2 18.6 12 18.6 2.2 12 2.2 12z" />
    <circle cx="12" cy="12" r="2.7" />
  </Glyph>
);

export const IconOlhoFechado = (props: IconProps) => (
  <Glyph {...props}>
    <path d="M9.9 5.7A9.6 9.6 0 0 1 12 5.4c6.2 0 9.8 6.6 9.8 6.6a17 17 0 0 1-2.8 3.7M6.3 7.4A16.7 16.7 0 0 0 2.2 12S5.8 18.6 12 18.6a9.4 9.4 0 0 0 3.6-.7" />
    <path d="M10.1 10.2a2.7 2.7 0 0 0 3.8 3.8M3 3l18 18" />
  </Glyph>
);

export const IconFixar = (props: IconProps) => (
  <Glyph {...props}>
    <path d="m12 2.8 2.7 5.9 6.4.8-4.7 4.4 1.2 6.3L12 17.1l-5.6 3.1 1.2-6.3-4.7-4.4 6.4-.8z" />
  </Glyph>
);

export const IconFixado = (props: IconProps) => (
  <Glyph {...props} filled>
    <path d="m12 2.8 2.7 5.9 6.4.8-4.7 4.4 1.2 6.3L12 17.1l-5.6 3.1 1.2-6.3-4.7-4.4 6.4-.8z" />
  </Glyph>
);

export const IconLixeira = (props: IconProps) => (
  <Glyph {...props}>
    <path d="M4 6.6h16M9.4 6.6V4.8a1.4 1.4 0 0 1 1.4-1.4h2.4a1.4 1.4 0 0 1 1.4 1.4v1.8" />
    <path d="M6.4 6.6 7.3 19a1.6 1.6 0 0 0 1.6 1.5h6.2a1.6 1.6 0 0 0 1.6-1.5l.9-12.4" />
    <path d="M10.4 10.4v6M13.6 10.4v6" />
  </Glyph>
);

export const IconMais = (props: IconProps) => (
  <Glyph {...props}>
    <path d="M12 5v14M5 12h14" />
  </Glyph>
);

export const IconLapis = (props: IconProps) => (
  <Glyph {...props}>
    <path d="M16.4 3.6a2.2 2.2 0 0 1 3.1 3.1L7.6 18.6 3 20l1.4-4.6z" />
    <path d="m15 5 4 4" />
  </Glyph>
);

export const IconCheck = (props: IconProps) => (
  <Glyph {...props}>
    <path d="m4.5 12.5 5 5 10-11" />
  </Glyph>
);

export const IconAlerta = (props: IconProps) => (
  <Glyph {...props}>
    <path d="M12 3.4 22 20H2z" />
    <path d="M12 9.6v4.2M12 17.2h.01" />
  </Glyph>
);

export const IconCopiar = (props: IconProps) => (
  <Glyph {...props}>
    <rect x="9" y="9" width="11.4" height="11.4" rx="2" />
    <path d="M5.6 15H4.6a1.6 1.6 0 0 1-1.6-1.6V4.6A1.6 1.6 0 0 1 4.6 3h8.8A1.6 1.6 0 0 1 15 4.6v1" />
  </Glyph>
);

export const IconCima = (props: IconProps) => (
  <Glyph {...props}>
    <path d="m6 14 6-6 6 6" />
  </Glyph>
);

export const IconBaixo = (props: IconProps) => (
  <Glyph {...props}>
    <path d="m6 10 6 6 6-6" />
  </Glyph>
);

export const IconAjuda = (props: IconProps) => (
  <Glyph {...props}>
    <circle cx="12" cy="12" r="9.2" />
    <path d="M9.4 9.3a2.7 2.7 0 0 1 5.2.9c0 1.8-2.6 2.7-2.6 2.7M12 17.1h.01" />
  </Glyph>
);

/**
 * Silhueta de cada poliedro, usada nos botões de dado rápido e nas
 * pastilhas do detalhamento. São aproximações estilizadas — o que importa é
 * que cada dado tenha um contorno reconhecível à distância.
 */
export function GlifoDado({
  kind,
  size = 24,
  className,
}: IconProps & { kind: string }) {
  const paths: Record<string, string> = {
    d4: 'M12 3 21 19H3z',
    d6: 'M5 5h14v14H5z',
    d8: 'M12 2.5 20.5 12 12 21.5 3.5 12z',
    d10: 'M12 2.5 20.5 9.5 17 20H7L3.5 9.5z',
    d12: 'M12 2.4 19.6 7v9.4L12 21.6 4.4 16.4V7z',
    d20: 'M12 2.6 21 7.8v8.4L12 21.4 3 16.2V7.8z',
    d100: 'M12 2.5 20.5 9.5 17 20H7L3.5 9.5z',
    dF: 'M5 5h14v14H5z',
  };

  const inner: Record<string, string> = {
    d8: 'M3.5 12h17M12 2.5v19',
    d10: 'M12 2.5v9.3M3.5 9.5 12 11.8l8.5-2.3M7 20l5-8.2 5 8.2',
    d12: 'M12 7.6 8 10.4l1.5 4.6h5l1.5-4.6z',
    d20: 'M12 2.6v18.8M3 7.8l9 5.2 9-5.2M3 16.2l9-3.2 9 3.2',
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
      {...(className ? { className } : {})}
    >
      <path d={paths[kind] ?? paths.d20 ?? ''} />
      {inner[kind] ? <path d={inner[kind] ?? ''} opacity={0.45} /> : null}
    </svg>
  );
}

export const IconFicha = (props: IconProps) => (
  <Glyph {...props}>
    <path d="M6.5 3.2h11a1.6 1.6 0 0 1 1.6 1.6v14.4a1.6 1.6 0 0 1-1.6 1.6h-11a1.6 1.6 0 0 1-1.6-1.6V4.8a1.6 1.6 0 0 1 1.6-1.6z" />
    <path d="M8.4 7.6h7.2M8.4 11.4h7.2M8.4 15.2h4.4" />
  </Glyph>
);

export const IconMesa = (props: IconProps) => (
  <Glyph {...props}>
    <circle cx="12" cy="12" r="3.2" />
    <circle cx="12" cy="3.9" r="1.7" />
    <circle cx="12" cy="20.1" r="1.7" />
    <circle cx="4.9" cy="7.9" r="1.7" />
    <circle cx="19.1" cy="7.9" r="1.7" />
    <circle cx="4.9" cy="16.1" r="1.7" />
    <circle cx="19.1" cy="16.1" r="1.7" />
  </Glyph>
);

export const IconLivro = (props: IconProps) => (
  <Glyph {...props}>
    <path d="M4 4.6h5.2a2.8 2.8 0 0 1 2.8 2.8v12a2.2 2.2 0 0 0-2.2-2.2H4z" />
    <path d="M20 4.6h-5.2a2.8 2.8 0 0 0-2.8 2.8v12a2.2 2.2 0 0 1 2.2-2.2H20z" />
  </Glyph>
);

export const IconBusca = (props: IconProps) => (
  <Glyph {...props}>
    <circle cx="10.8" cy="10.8" r="6.2" />
    <path d="M15.4 15.4 20 20" />
  </Glyph>
);

export const IconMenos = (props: IconProps) => (
  <Glyph {...props}>
    <path d="M5 12h14" />
  </Glyph>
);

export const IconAlvo = (props: IconProps) => (
  <Glyph {...props}>
    <path d="M4 8.4V5.6A1.6 1.6 0 0 1 5.6 4h2.8M15.6 4h2.8A1.6 1.6 0 0 1 20 5.6v2.8M20 15.6v2.8a1.6 1.6 0 0 1-1.6 1.6h-2.8M8.4 20H5.6A1.6 1.6 0 0 1 4 18.4v-2.8" />
  </Glyph>
);

export const IconMapa = (props: IconProps) => (
  <Glyph {...props}>
    <path d="M9 4.4 3.8 6.6v13L9 17.4l6 2.2 5.2-2.2v-13L15 6.6z" />
    <path d="M9 4.4v13M15 6.6v13" />
  </Glyph>
);

export const IconIndice = (props: IconProps) => (
  <Glyph {...props}>
    <path d="M4 6.4h16M4 12h16M4 17.6h10" />
  </Glyph>
);

export const IconCasa = (props: IconProps) => (
  <Glyph {...props}>
    <path d="M4 10.4 12 4l8 6.4V19a1.4 1.4 0 0 1-1.4 1.4H5.4A1.4 1.4 0 0 1 4 19z" />
    <path d="M9.6 20.4v-6h4.8v6" />
  </Glyph>
);
