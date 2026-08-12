import { useEffect, useState } from 'react';
import { carregarSrd, type Srd } from '@/daggerheart/srd';

/**
 * Carrega o SRD sob demanda.
 *
 * São ~230 KB que só interessam a quem abre a ficha, então ficam em um
 * chunk à parte e só entram quando o painel monta. O `carregarSrd` memoriza
 * o resultado, então abrir e fechar o painel não recarrega nada.
 */
export function useSrd(): { srd: Srd | null; carregando: boolean; erro: string | null } {
  const [srd, setSrd] = useState<Srd | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let vivo = true;

    carregarSrd()
      .then((dados) => {
        if (vivo) setSrd(dados);
      })
      .catch(() => {
        if (vivo) setErro('Não consegui carregar os dados do Daggerheart.');
      });

    return () => {
      vivo = false;
    };
  }, []);

  return { srd, carregando: srd === null && erro === null, erro };
}
