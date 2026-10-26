import type { GrupoDeAtalhos } from '@/ui/atalhos';
import '@/ui/styles/atalhos.css';

/**
 * Os atalhos de teclado em lista de definição: a tecla é o termo, o que ela
 * faz é a descrição. Fica igual em Ajustes e na folha do `?`, e o nível do
 * título muda conforme o lugar para não quebrar a ordem dos cabeçalhos.
 */
export function ListaDeAtalhos({
  grupos,
  nivel,
}: {
  grupos: readonly GrupoDeAtalhos[];
  nivel: 3 | 4;
}) {
  const Titulo = nivel === 3 ? 'h3' : 'h4';

  return (
    <>
      {grupos.map((grupo) => (
        <section className="teclas-grupo" key={grupo.id}>
          <Titulo className="rotulo teclas-grupo__titulo">{grupo.titulo}</Titulo>
          <dl className="teclas">
            {grupo.teclas.map(([tecla, acao]) => (
              <div className="teclas__linha" key={tecla}>
                <dt>
                  <kbd className="tecla">{tecla}</kbd>
                </dt>
                <dd>{acao}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </>
  );
}
