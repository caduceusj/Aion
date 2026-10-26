import { lazy, Suspense, useState } from 'react';
import { useAionStore } from '@/state/store';
import { carregarCodice, codiceCarregado } from '@/ui/carregamento';
import { IconLivro } from '@/ui/components/Icons';
import '@/ui/styles/carregando.css';

const CodiceSobDemanda = lazy(() => carregarCodice().then((modulo) => ({ default: modulo.Codex })));

/**
 * O que aparece enquanto o pacote do Códice não chegou.
 *
 * É também o destino do foco da troca de tela (`data-foco-da-vista`): quem usa
 * leitor de tela ouve "Abrindo o Códice…" em vez de cair num <body> vazio. Os
 * primeiros instantes são invisíveis (ver carregando.css) — o pacote
 * pré-carregado chega antes disso, e uma tela que pisca e some é pior que nenhuma.
 */
function Abrindo() {
  const sairDoCodice = useAionStore((state) => state.sairDoCodice);

  return (
    <main className="abrindo" tabIndex={-1} data-foco-da-vista aria-busy="true">
      <IconLivro size={36} className="abrindo__glifo" />
      <p className="abrindo__texto" role="status">
        Abrindo o Códice…
      </p>
      {/* Numa rede lenta a espera dura; quem não quer esperar não fica preso. */}
      <button type="button" className="abrindo__voltar" onClick={sairDoCodice}>
        Voltar
      </button>
    </main>
  );
}

/**
 * A tela do Códice, que vive em pacote próprio.
 *
 * O acervo, o atlas e o almanaque pesam mais que o resto do app e não servem ao
 * menu nem à Mesa: só vêm quando alguém abre o Códice — ou antes, no ócio do
 * navegador (`precarregarNoOcio`), e então o pedido já está atendido.
 *
 * Decide uma vez, ao entrar: com o pacote à mão monta direto, sem um quadro de
 * espera; sem ele, passa pela espera. A escolha não muda enquanto a tela está
 * aberta — se mudasse a cada render, o Códice remontaria no meio da leitura e
 * perderia a pilha de navegação e a busca.
 */
export function VistaDoCodice() {
  const [jaCarregado] = useState(codiceCarregado);

  if (jaCarregado) {
    const Codice = jaCarregado;
    return <Codice />;
  }

  return (
    <Suspense fallback={<Abrindo />}>
      <CodiceSobDemanda />
    </Suspense>
  );
}
