import {
  PULOS,
  VELOCIDADE_DO_PULO_INTENSO,
  VELOCIDADE_DO_PULO_NORMAL,
  VELOCIDADE_ORBITAL_DA_TERRA,
  type PuloId,
} from '@/codex/calendario';
import { variaveis } from './comum';

/** O topo da escala, em km/s: um pouco acima do trecho mais veloz da tabela (411). */
const TOPO = 450;

const em = (v: number): string => `${(v / TOPO) * 100}%`;

/**
 * O velocímetro de um trecho.
 *
 * Uma faixa de 0 a 450 km/s dividida onde o pulo muda de nome: abaixo de 82
 * km/s Corvus quase não se move, a partir de 247 o trecho é intenso. O
 * ponteiro mostra onde a velocidade do trecho cai, e a marca da Terra dá a
 * única régua que todo leitor tem de cabeça — 30 km/s é a velocidade com
 * que o nosso planeta anda em torno do Sol, e o resto da faixa é quanto
 * Corvus passa disso.
 */
export function Velocimetro({ kms, pulo }: { kms: number; pulo: PuloId }) {
  return (
    <div
      className="velocimetro"
      role="img"
      aria-label={`${Math.round(kms)} quilômetros por segundo, pulo ${PULOS[pulo].rotulo.toLowerCase()}. Os limites são ${Math.round(VELOCIDADE_DO_PULO_NORMAL)} e ${Math.round(VELOCIDADE_DO_PULO_INTENSO)}.`}
    >
      <span className="velocimetro__terra" style={{ left: em(VELOCIDADE_ORBITAL_DA_TERRA) }}>
        <i />
        Terra
      </span>

      <div className="velocimetro__faixa">
        <i data-pulo="sem-pulo" data-ativa={pulo === 'sem-pulo' ? 'sim' : undefined} style={{ width: em(VELOCIDADE_DO_PULO_NORMAL) }} />
        <i
          data-pulo="normal"
          data-ativa={pulo === 'normal' ? 'sim' : undefined}
          style={{ width: em(VELOCIDADE_DO_PULO_INTENSO - VELOCIDADE_DO_PULO_NORMAL) }}
        />
        <i data-pulo="intenso" data-ativa={pulo === 'intenso' ? 'sim' : undefined} style={{ width: em(TOPO - VELOCIDADE_DO_PULO_INTENSO) }} />
        <b className="velocimetro__ponteiro" style={variaveis({ '--v': kms / TOPO })} />
      </div>

      <div className="velocimetro__graduacao" aria-hidden="true">
        <span style={{ left: '0%' }}>0</span>
        <span style={{ left: em(VELOCIDADE_DO_PULO_NORMAL) }}>{Math.round(VELOCIDADE_DO_PULO_NORMAL)}</span>
        <span style={{ left: em(VELOCIDADE_DO_PULO_INTENSO) }}>{Math.round(VELOCIDADE_DO_PULO_INTENSO)}</span>
        <span style={{ left: '100%' }}>{TOPO} km/s</span>
      </div>
    </div>
  );
}
