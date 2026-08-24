/**
 * Heráldica de Valoran.
 *
 * Os escudos das oito casas, os glifos das eras, dos heróis e das relíquias
 * vieram do documento original do usuário — "The Annals of Valoran" — e estão
 * reproduzidos traço por traço, para o códice ter a mesma mão que o códice
 * impresso. Os sete restantes (a estrela dos Doze, o templo, a mão da Horda,
 * as montanhas, o porto, o vazio astral e a serpente imperial) foram
 * desenhados no mesmo vocabulário: linha fina, ouro, sem preenchimento salvo
 * onde o original preenche.
 *
 * Nada aqui é imagem: é SVG inline, então acompanha a cor do texto e não
 * custa nenhuma requisição.
 */

import type { ReactNode } from 'react';
import type { BrasaoId } from '../tipos';

interface Desenho {
  viewBox: string;
  traco: string;
  desenho: ReactNode;
}

const BRASOES: Record<BrasaoId, Desenho> = {
  'herrys': {
    viewBox: '0 0 100 120',
    traco: '3',
    desenho: (
      <>
        <path d="M50 6 L92 22 V54 C92 88 74 104 50 114 C26 104 8 88 8 54 V22 Z"/>
        <path d="M34 62 L30 42 L42 52 L50 36 L58 52 L70 42 L66 62 Z" fill="currentColor" stroke="none"/>
        <path d="M28 74 C40 66 46 66 52 72 M52 72 C58 66 66 66 74 74" strokeWidth="2.6"/>
        <circle cx="30" cy="40" r="2.4" fill="currentColor" stroke="none"/><circle cx="50" cy="34" r="2.4" fill="currentColor" stroke="none"/><circle cx="70" cy="40" r="2.4" fill="currentColor" stroke="none"/>
      </>
    ),
  },
  'draco': {
    viewBox: '0 0 100 120',
    traco: '3',
    desenho: (
      <>
        <path d="M50 6 L92 22 V54 C92 88 74 104 50 114 C26 104 8 88 8 54 V22 Z"/>
        <path d="M28 46 C34 28 50 22 56 28 M72 46 C66 28 50 22 44 28" strokeWidth="2.6"/>
        <path d="M30 60 Q50 44 70 60 Q50 76 30 60Z" strokeWidth="2.6"/>
        <path d="M50 48 Q55 60 50 72 Q45 60 50 48Z" fill="currentColor" stroke="none"/>
      </>
    ),
  },
  'bellias': {
    viewBox: '0 0 100 120',
    traco: '3',
    desenho: (
      <>
        <path d="M50 6 L92 22 V54 C92 88 74 104 50 114 C26 104 8 88 8 54 V22 Z"/>
        <path d="M50 30 L58 44 L50 50 L42 44 Z" fill="currentColor" stroke="none"/>
        <path d="M50 50 V88" strokeWidth="3"/>
        <path d="M40 62 H60" strokeWidth="3"/>
      </>
    ),
  },
  'sturm': {
    viewBox: '0 0 100 120',
    traco: '3',
    desenho: (
      <>
        <path d="M50 6 L92 22 V54 C92 88 74 104 50 114 C26 104 8 88 8 54 V22 Z"/>
        <path d="M56 28 L38 58 L50 58 L44 86 L66 52 L54 52 Z" fill="currentColor" stroke="none"/>
      </>
    ),
  },
  'deallus': {
    viewBox: '0 0 100 120',
    traco: '3',
    desenho: (
      <>
        <path d="M50 6 L92 22 V54 C92 88 74 104 50 114 C26 104 8 88 8 54 V22 Z"/>
        <path d="M28 44 Q38 36 48 44 T68 44 T72 44" strokeWidth="2.6"/>
        <path d="M28 56 Q38 48 48 56 T68 56 T72 56" strokeWidth="2.6"/>
        <path d="M28 68 Q38 60 48 68 T68 68 T72 68" strokeWidth="2.6"/>
      </>
    ),
  },
  'vinco': {
    viewBox: '0 0 100 120',
    traco: '3',
    desenho: (
      <>
        <path d="M50 6 L92 22 V54 C92 88 74 104 50 114 C26 104 8 88 8 54 V22 Z"/>
        <g fill="#cb4a4c" stroke="none">
        <rect x="42" y="40" width="16" height="30" rx="7"/>
        <rect x="34" y="46" width="6" height="20" rx="3"/><rect x="42" y="34" width="6" height="24" rx="3"/><rect x="52" y="34" width="6" height="24" rx="3"/><rect x="60" y="46" width="6" height="20" rx="3"/>
        </g>
      </>
    ),
  },
  'orhys': {
    viewBox: '0 0 100 120',
    traco: '3',
    desenho: (
      <>
        <path d="M50 6 L92 22 V54 C92 88 74 104 50 114 C26 104 8 88 8 54 V22 Z"/>
        <path d="M50 32 V72" strokeWidth="2.6"/><circle cx="50" cy="30" r="3" fill="currentColor" stroke="none"/>
        <path d="M30 40 H70" strokeWidth="2.6"/>
        <path d="M30 40 L22 56 H38 Z" strokeWidth="2.2"/><path d="M70 40 L62 56 H78 Z" strokeWidth="2.2"/>
        <rect x="40" y="72" width="20" height="5" rx="2" fill="currentColor" stroke="none"/>
      </>
    ),
  },
  'keaton': {
    viewBox: '0 0 100 120',
    traco: '3',
    desenho: (
      <>
        <path d="M50 6 L92 22 V54 C92 88 74 104 50 114 C26 104 8 88 8 54 V22 Z"/>
        <circle cx="50" cy="50" r="10" fill="currentColor" stroke="none"/>
        <path d="M46 58 L44 78 H56 L54 58 Z" fill="currentColor" stroke="none"/>
      </>
    ),
  },
  'dragao': {
    viewBox: '0 0 100 100',
    traco: '3.4',
    desenho: (
      <>
        <path d="M18 42 C24 20 42 12 50 18 M82 42 C76 20 58 12 50 18"/>
        <path d="M22 60 Q50 40 78 60 Q50 80 22 60Z"/>
        <path d="M50 46 Q56 60 50 74 Q44 60 50 46Z" fill="currentColor" stroke="none"/>
        <path d="M30 78 l-5 10 M50 82 l0 12 M70 78 l5 10" stroke="#cb4a4c" strokeWidth="3"/>
      </>
    ),
  },
  'sol': {
    viewBox: '0 0 100 100',
    traco: '3.2',
    desenho: (
      <>
        <circle cx="50" cy="50" r="17"/>
        <g strokeWidth="3"><line x1="50" y1="10" x2="50" y2="24"/><line x1="50" y1="76" x2="50" y2="90"/><line x1="10" y1="50" x2="24" y2="50"/><line x1="76" y1="50" x2="90" y2="50"/><line x1="22" y1="22" x2="32" y2="32"/><line x1="68" y1="68" x2="78" y2="78"/><line x1="22" y1="78" x2="32" y2="68"/><line x1="68" y1="32" x2="78" y2="22"/></g>
      </>
    ),
  },
  'eclipse': {
    viewBox: '0 0 100 100',
    traco: '3.4',
    desenho: (
      <>
        <path d="M24 72 L16 38 L34 54 L50 28 L66 54 L84 38 L76 72 Z"/>
        <circle cx="16" cy="36" r="3" fill="currentColor" stroke="none"/><circle cx="50" cy="26" r="3" fill="currentColor" stroke="none"/><circle cx="84" cy="36" r="3" fill="currentColor" stroke="none"/>
        <path d="M40 20 L54 46 L44 50 L60 78" stroke="#cb4a4c" strokeWidth="4"/>
      </>
    ),
  },
  'aurora': {
    viewBox: '0 0 100 100',
    traco: '3',
    desenho: (
      <>
        <circle cx="50" cy="50" r="15"/>
        <g strokeWidth="2.6"><line x1="50" y1="12" x2="50" y2="24"/><line x1="50" y1="76" x2="50" y2="88"/><line x1="12" y1="50" x2="24" y2="50"/><line x1="76" y1="50" x2="88" y2="50"/><line x1="23" y1="23" x2="31" y2="31"/><line x1="69" y1="69" x2="77" y2="77"/><line x1="23" y1="77" x2="31" y2="69"/><line x1="69" y1="31" x2="77" y2="23"/></g>
        <path d="M50 41 L53 48 L61 48 L55 53 L57 61 L50 56 L43 61 L45 53 L39 48 L47 48 Z" fill="currentColor" stroke="none"/>
      </>
    ),
  },
  'fumaca': {
    viewBox: '0 0 100 100',
    traco: '3.2',
    desenho: (
      <>
        <path d="M22 28 C44 32 60 48 64 72 M22 28 C38 40 46 54 48 70 M22 28 C52 28 72 44 78 72 M22 28 C30 46 32 60 34 74"/>
      </>
    ),
  },
  'coroa': {
    viewBox: '0 0 100 100',
    traco: '3.2',
    desenho: (
      <>
        <path d="M28 66 L22 40 L38 54 L50 32 L62 54 L78 40 L72 66 Z" fill="currentColor" stroke="none"/><rect x="28" y="70" width="44" height="6" rx="2" fill="currentColor" stroke="none"/><circle cx="22" cy="38" r="3" fill="currentColor" stroke="none"/><circle cx="50" cy="30" r="3" fill="currentColor" stroke="none"/><circle cx="78" cy="38" r="3" fill="currentColor" stroke="none"/>
      </>
    ),
  },
  'martelo': {
    viewBox: '0 0 100 100',
    traco: '3.2',
    desenho: (
      <>
        <path d="M14 76 L38 34 L50 52 L62 34 L86 76 Z"/><path d="M32 76 L50 48 L68 76"/><path d="M46 20 L54 20 L52 32 L48 32 Z" fill="currentColor" stroke="none"/>
      </>
    ),
  },
  'folha': {
    viewBox: '0 0 100 100',
    traco: '3',
    desenho: (
      <>
        <path d="M50 16 C34 34 34 58 50 84 C66 58 66 34 50 16 Z"/><path d="M50 24 L50 78"/><path d="M50 40 C42 44 36 44 30 40 M50 52 C58 56 64 56 70 52"/>
      </>
    ),
  },
  'lamina': {
    viewBox: '0 0 100 120',
    traco: '3.4',
    desenho: (
      <>
        <path d="M50 8 L50 84"/><path d="M50 84 L42 72 M50 84 L58 72" /><path d="M32 30 L68 30" strokeWidth="4"/><circle cx="50" cy="94" r="5" fill="currentColor" stroke="none"/><path d="M46 18 L50 8 L54 18" />
      </>
    ),
  },
  'lanca': {
    viewBox: '0 0 100 120',
    traco: '3.2',
    desenho: (
      <>
        <path d="M50 10 L58 30 L50 40 L42 30 Z" fill="currentColor" stroke="none"/><path d="M50 40 L50 104" /><path d="M38 52 L62 52" /><g stroke="#cb4a4c" strokeWidth="2.4"><path d="M28 22 L34 30 M72 22 L66 30 M22 44 L32 46 M78 44 L68 46"/></g>
      </>
    ),
  },
  'nau': {
    viewBox: '0 0 100 120',
    traco: '3',
    desenho: (
      <>
        <path d="M22 74 Q50 92 78 74 L70 88 Q50 100 30 88 Z" fill="currentColor" stroke="none"/><path d="M50 20 L50 74"/><path d="M50 28 L78 44 L50 52 Z"/><path d="M50 40 L28 52 L50 58"/><circle cx="63" cy="40" r="3"/>
      </>
    ),
  },
  'cascata': {
    viewBox: '0 0 100 120',
    traco: '2.6',
    desenho: (
      <>
        <path d="M26 14 H74"/><g strokeWidth="2.4"><path d="M32 16 V96"/><path d="M44 16 V104"/><path d="M56 16 V100"/><path d="M68 16 V96"/></g><path d="M22 108 Q50 118 78 108" strokeWidth="3"/>
      </>
    ),
  },
  'cidadela': {
    viewBox: '0 0 100 120',
    traco: '2.8',
    desenho: (
      <>
        <path d="M28 104 V44 L50 24 L72 44 V104"/><path d="M40 104 V72 H60 V104"/><path d="M40 52 H48 M52 52 H60"/><path d="M50 24 L50 12"/>
      </>
    ),
  },
  'serpente': {
    viewBox: '0 0 100 120',
    traco: '2.8',
    desenho: (
      <>
        <path d="M20 40 C40 60 60 60 80 40 M20 40 C30 30 44 34 50 44 C56 34 70 30 80 40"/><path d="M50 44 C48 66 40 84 26 96 M50 44 C52 66 60 84 74 96"/><circle cx="50" cy="70" r="3" fill="currentColor" stroke="none"/>
      </>
    ),
  },
  'asa': {
    viewBox: '0 0 240 140',
    traco: '2.6',
    desenho: (
      <>
        <path d="M40 118 C60 84 96 60 150 52 C120 66 100 84 92 108 M40 118 C68 96 104 78 158 72 C132 84 114 98 106 116 M40 118 C80 108 120 96 170 92 C148 100 130 110 122 122 M40 118 C96 116 140 112 186 112"/>
        <path d="M40 118 C34 96 36 74 46 56" strokeWidth="3"/>
      </>
    ),
  },
  'estrela': {
    viewBox: '0 0 100 100',
    traco: '3',
    desenho: (
      <>
        <circle cx="50" cy="50" r="13"/>
<g strokeWidth="2.2">
        <line x1="50" y1="8" x2="50" y2="26"/><line x1="50" y1="74" x2="50" y2="92"/>
        <line x1="8" y1="50" x2="26" y2="50"/><line x1="74" y1="50" x2="92" y2="50"/>
        <line x1="20" y1="20" x2="32" y2="32"/><line x1="68" y1="68" x2="80" y2="80"/>
        <line x1="20" y1="80" x2="32" y2="68"/><line x1="68" y1="32" x2="80" y2="20"/>
        <line x1="29" y1="11" x2="36" y2="27"/><line x1="64" y1="73" x2="71" y2="89"/>
        <line x1="11" y1="71" x2="27" y2="64"/><line x1="73" y1="36" x2="89" y2="29"/>
</g>
<path d="M50 40 L53 47 L61 47 L55 52 L57 60 L50 55 L43 60 L45 52 L39 47 L47 47 Z" fill="currentColor" stroke="none"/>
      </>
    ),
  },
  'templo': {
    viewBox: '0 0 100 100',
    traco: '3',
    desenho: (
      <>
        <path d="M16 40 L50 18 L84 40 Z"/>
<path d="M12 44 H88" strokeWidth="3.4"/>
<g strokeWidth="2.6"><path d="M24 48 V78"/><path d="M40 48 V78"/><path d="M60 48 V78"/><path d="M76 48 V78"/></g>
<path d="M14 82 H86" strokeWidth="3.4"/>
<path d="M50 26 L52 32 L58 32 L53 36 L55 42 L50 38 L45 42 L47 36 L42 32 L48 32 Z" fill="currentColor" stroke="none"/>
      </>
    ),
  },
  'mao': {
    viewBox: '0 0 100 100',
    traco: '3',
    desenho: (
      <>
        <g fill="#cb4a4c" stroke="none">
        <rect x="40" y="42" width="20" height="34" rx="9"/>
        <rect x="28" y="48" width="8" height="24" rx="4"/>
        <rect x="39" y="30" width="8" height="30" rx="4"/>
        <rect x="53" y="30" width="8" height="30" rx="4"/>
        <rect x="64" y="48" width="8" height="24" rx="4"/>
</g>
<path d="M32 84 Q50 92 68 84" strokeWidth="2.4"/>
      </>
    ),
  },
  'montanha': {
    viewBox: '0 0 100 100',
    traco: '3',
    desenho: (
      <>
        <path d="M8 82 L32 34 L48 60 L60 40 L92 82 Z"/>
<path d="M24 82 L32 52 L40 66"/>
<path d="M26 44 L32 34 L38 44" fill="currentColor" stroke="none"/>
<path d="M54 50 L60 40 L66 50" fill="currentColor" stroke="none"/>
      </>
    ),
  },
  'porto': {
    viewBox: '0 0 100 100',
    traco: '3',
    desenho: (
      <>
        <path d="M50 20 V70"/>
<circle cx="50" cy="16" r="5"/>
<path d="M34 32 H66" strokeWidth="2.6"/>
<path d="M26 58 C26 78 38 86 50 86 C62 86 74 78 74 58" strokeWidth="2.8"/>
<g stroke="rgba(108,127,176,.85)" strokeWidth="2.2">
        <path d="M10 92 Q22 84 34 92 T58 92 T82 92 T94 92"/>
</g>
      </>
    ),
  },
  'vazio': {
    viewBox: '0 0 100 100',
    traco: '3',
    desenho: (
      <>
        <circle cx="50" cy="50" r="30" strokeDasharray="3 6"/>
<circle cx="50" cy="50" r="18" strokeDasharray="2 5" opacity=".7"/>
<circle cx="50" cy="50" r="6" fill="currentColor" stroke="none" opacity=".55"/>
<g stroke="rgba(108,127,176,.8)" strokeWidth="1.8" fill="none">
        <path d="M6 34 Q26 28 44 36"/><path d="M56 64 Q74 72 94 66"/>
</g>
      </>
    ),
  },
  'serpente-imperial': {
    viewBox: '0 0 100 100',
    traco: '3',
    desenho: (
      <>
        <circle cx="72" cy="26" r="12" stroke="#cb4a4c" strokeWidth="2.6"/>
<path d="M18 78 C18 60 34 56 44 62 C54 68 62 62 60 52 C58 42 44 42 38 50"/>
<path d="M18 78 C34 84 52 84 68 76"/>
<path d="M34 48 L28 40 M42 46 L40 36"/>
<circle cx="36" cy="52" r="2.4" fill="currentColor" stroke="none"/>
      </>
    ),
  },
};

export interface BrasaoProps {
  id: BrasaoId;
  size?: number;
  className?: string;
}

/** Um brasão. A cor vem do `currentColor` de quem o contém. */
export function Brasao({ id, size = 64, className }: BrasaoProps) {
  const brasao = BRASOES[id];
  const [, , largura = 100, altura = 100] = brasao.viewBox.split(' ').map(Number);
  // Cabe na caixa em vez de escalar pela largura: assim o escudo alto de uma
  // casa e a asa larga do imperador ocupam o mesmo peso na página.
  const fator = size / Math.max(largura, altura);

  return (
    <svg
      width={Math.round(largura * fator)}
      height={Math.round(altura * fator)}
      viewBox={brasao.viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={brasao.traco}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...(className ? { className } : {})}
    >
      {brasao.desenho}
    </svg>
  );
}
