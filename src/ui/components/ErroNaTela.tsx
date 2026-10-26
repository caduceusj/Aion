import { Component, type ErrorInfo, type ReactNode } from 'react';
import { clearStoredState } from '@/state/persistence';
import '@/ui/styles/erro.css';

interface Props {
  children: ReactNode;
}

interface Estado {
  erro: Error | null;
  /** Primeiro toque em "apagar" só pede confirmação: o segundo é que apaga. */
  confirmandoApagar: boolean;
}

/**
 * A rede de segurança: se qualquer tela quebrar ao desenhar, a pessoa vê isto
 * em vez de uma página em branco.
 *
 * Em branco ela não sabe se é um defeito, se o aparelho travou ou se o app
 * simplesmente não abre. Aqui sabe: o que aconteceu, que os dados estão
 * guardados, e o que tentar — recarregar primeiro, e só em último caso apagar
 * o que o Aion guardou (com um segundo toque de confirmação, porque este é o
 * único botão do app que não tem "desfazer").
 */
export class ErroNaTela extends Component<Props, Estado> {
  override state: Estado = { erro: null, confirmandoApagar: false };

  static getDerivedStateFromError(erro: Error): Partial<Estado> {
    return { erro };
  }

  override componentDidCatch(erro: Error, info: ErrorInfo): void {
    console.error('O Aion parou de desenhar a tela:', erro, info.componentStack);
  }

  private recarregar = (): void => {
    window.location.reload();
  };

  private apagarERecarregar = (): void => {
    if (!this.state.confirmandoApagar) {
      this.setState({ confirmandoApagar: true });
      return;
    }
    clearStoredState();
    window.location.reload();
  };

  override render(): ReactNode {
    const { erro, confirmandoApagar } = this.state;
    if (!erro) return this.props.children;

    return (
      <main className="erro-na-tela" role="alert">
        <h1 className="erro-na-tela__titulo">Algo deu errado</h1>
        <p className="erro-na-tela__texto">
          O Aion parou de repente. Suas rolagens, fichas e atalhos ficam guardados neste
          aparelho — recarregar costuma resolver.
        </p>

        <button type="button" className="erro-na-tela__recarregar" onClick={this.recarregar} autoFocus>
          Recarregar
        </button>

        <details className="erro-na-tela__detalhes">
          <summary>Detalhes para quem for consertar</summary>
          <pre>{erro.message || String(erro)}</pre>
        </details>

        <div className="erro-na-tela__ultimo-recurso">
          <p>
            Se recarregar não resolver, o que o Aion guardou pode estar corrompido. Apagar
            traz o app de volta ao começo — e leva junto o histórico, as fichas e os
            atalhos.
          </p>
          <button
            type="button"
            className="erro-na-tela__apagar"
            data-confirma={confirmandoApagar ? 'sim' : undefined}
            onClick={this.apagarERecarregar}
          >
            {confirmandoApagar ? 'Toque de novo para apagar tudo' : 'Apagar os dados e recarregar'}
          </button>
        </div>
      </main>
    );
  }
}
