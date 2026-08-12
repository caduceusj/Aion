import { useMemo, useState } from 'react';
import type { Ficha } from '@/daggerheart/ficha';
import {
  DOMINIOS,
  dominiosDoPersonagem,
  subclassesDaClasse,
  type Bloco,
  type Caracteristica,
  type Srd,
} from '@/daggerheart/srd';
import { TRAIT_BY_ID } from '@/daggerheart/regras';
import { IconCheck } from './Icons';

/** Renderiza os blocos do SRD sem inventar formatação. */
export function Blocos({ blocos }: { blocos: Bloco[] }) {
  return (
    <>
      {blocos.map((bloco, indice) =>
        bloco.tipo === 'paragrafo' ? (
          // eslint-disable-next-line react/no-array-index-key
          <p className="srd__paragrafo" key={indice}>
            {bloco.texto}
          </p>
        ) : (
          // eslint-disable-next-line react/no-array-index-key
          <ul className="srd__lista" key={indice}>
            {bloco.itens.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ),
      )}
    </>
  );
}

export function Caracteristicas({
  titulo,
  itens,
}: {
  titulo?: string;
  itens: Caracteristica[];
}) {
  if (itens.length === 0) return null;

  return (
    <div className="srd__caracteristicas">
      {titulo ? <span className="srd__grupo">{titulo}</span> : null}
      {itens.map((item, indice) => (
        // eslint-disable-next-line react/no-array-index-key
        <div className="srd__caracteristica" key={`${item.nome}-${indice}`}>
          {item.nome ? <strong className="srd__nome">{item.nome}</strong> : null}
          <Blocos blocos={item.blocos} />
        </div>
      ))}
    </div>
  );
}

interface Props {
  ficha: Ficha;
  srd: Srd;
  aoMudar: (patch: Partial<Ficha>) => void;
}

/**
 * Escolhas de classe, subclasse, ancestralidade e comunidade.
 *
 * Ao trocar de classe, oferece aplicar os PV e a Evasão iniciais dela em vez
 * de sobrescrever de imediato: a ficha pode já estar em jogo com valores
 * ajustados, e apagá-los sem avisar seria pior que dar um pouco mais de
 * trabalho.
 */
export function EscolhasDoSrd({ ficha, srd, aoMudar }: Props) {
  const [aberto, setAberto] = useState<string | null>(null);

  const classe = srd.classes.find((item) => item.id === ficha.classeId) ?? null;
  const subclasses = useMemo(
    () => subclassesDaClasse(srd, ficha.classeId),
    [srd, ficha.classeId],
  );
  const subclasse = subclasses.find((item) => item.id === ficha.subclasseId) ?? null;
  const ancestralidade =
    srd.ancestralidades.find((item) => item.id === ficha.ancestralidadeId) ?? null;
  const comunidade = srd.comunidades.find((item) => item.id === ficha.comunidadeId) ?? null;

  const dominios = dominiosDoPersonagem(srd, ficha.classeId, ficha.subclasseId);

  const precisaAplicar =
    classe !== null &&
    (ficha.pontosDeVidaTotal !== classe.pontosDeVidaIniciais ||
      ficha.evasao !== classe.evasaoInicial);

  const alternar = (chave: string): void =>
    setAberto((atual) => (atual === chave ? null : chave));

  return (
    <div className="srd">
      <div className="srd__escolhas">
        <label className="srd__campo">
          <span className="rotulo">Classe</span>
          <select
            value={ficha.classeId ?? ''}
            onChange={(evento) => {
              const id = evento.target.value || null;
              const nova = srd.classes.find((item) => item.id === id);
              aoMudar({
                classeId: id,
                // Trocar de classe invalida a subclasse anterior.
                subclasseId: null,
                classe: nova?.nome ?? '',
              });
            }}
          >
            <option value="">—</option>
            {srd.classes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nome}
              </option>
            ))}
          </select>
        </label>

        <label className="srd__campo">
          <span className="rotulo">Subclasse</span>
          <select
            value={ficha.subclasseId ?? ''}
            disabled={subclasses.length === 0}
            onChange={(evento) => aoMudar({ subclasseId: evento.target.value || null })}
          >
            <option value="">—</option>
            {subclasses.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nome}
              </option>
            ))}
          </select>
        </label>

        <label className="srd__campo">
          <span className="rotulo">Ancestralidade</span>
          <select
            value={ficha.ancestralidadeId ?? ''}
            onChange={(evento) => {
              const id = evento.target.value || null;
              const nova = srd.ancestralidades.find((item) => item.id === id);
              aoMudar({ ancestralidadeId: id, ancestralidade: nova?.nome ?? '' });
            }}
          >
            <option value="">—</option>
            {srd.ancestralidades.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nome}
              </option>
            ))}
          </select>
        </label>

        <label className="srd__campo">
          <span className="rotulo">Comunidade</span>
          <select
            value={ficha.comunidadeId ?? ''}
            onChange={(evento) => {
              const id = evento.target.value || null;
              const nova = srd.comunidades.find((item) => item.id === id);
              aoMudar({ comunidadeId: id, comunidade: nova?.nome ?? '' });
            }}
          >
            <option value="">—</option>
            {srd.comunidades.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nome}
              </option>
            ))}
          </select>
        </label>
      </div>

      {dominios.length > 0 ? (
        <div className="srd__dominios">
          <span className="rotulo">Domínios</span>
          <div className="srd__chips">
            {dominios.map((dominio) => (
              <span
                className="srd__dominio"
                key={dominio}
                style={{ '--cor-dominio': DOMINIOS[dominio].cor } as React.CSSProperties}
              >
                {DOMINIOS[dominio].nome}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {classe && precisaAplicar ? (
        <button
          type="button"
          className="srd__aplicar"
          onClick={() =>
            aoMudar({
              pontosDeVidaTotal: classe.pontosDeVidaIniciais,
              evasao: classe.evasaoInicial,
            })
          }
        >
          <IconCheck size={15} />
          <span>
            Aplicar da classe: {classe.pontosDeVidaIniciais} PV e Evasão{' '}
            {classe.evasaoInicial}
          </span>
        </button>
      ) : null}

      {subclasse?.atributoDeConjuracao ? (
        <p className="srd__nota">
          Conjuração usa{' '}
          <strong>{TRAIT_BY_ID[subclasse.atributoDeConjuracao]?.nome}</strong> — o botão
          aparece junto dos atributos.
        </p>
      ) : null}

      {/* Cada escolha abre o texto original do SRD, em inglês. */}
      <div className="srd__detalhes">
        {[
          { chave: 'classe', rotulo: classe?.nome, conteudo: classe },
          { chave: 'subclasse', rotulo: subclasse?.nome, conteudo: subclasse },
          { chave: 'ancestralidade', rotulo: ancestralidade?.nome, conteudo: ancestralidade },
          { chave: 'comunidade', rotulo: comunidade?.nome, conteudo: comunidade },
        ]
          .filter((item) => item.conteudo !== null && item.conteudo !== undefined)
          .map((item) => (
            <div className="srd__bloco" key={item.chave}>
              <button
                type="button"
                className="srd__cabecalho"
                onClick={() => alternar(item.chave)}
                aria-expanded={aberto === item.chave}
              >
                <span className="srd__bloco-titulo">{item.rotulo}</span>
                <span className="srd__seta" aria-hidden="true">
                  {aberto === item.chave ? '−' : '+'}
                </span>
              </button>

              {aberto === item.chave ? (
                <div className="srd__corpo">
                  {item.chave === 'classe' && classe ? (
                    <>
                      <Blocos blocos={classe.descricao} />
                      {classe.itens.length > 0 ? (
                        <p className="srd__paragrafo srd__itens">
                          <em>Itens iniciais:</em> {classe.itens.join(' · ')}
                        </p>
                      ) : null}
                      {classe.caracteristicaDeEsperanca ? (
                        <Caracteristicas
                          titulo="Hope Feature"
                          itens={[classe.caracteristicaDeEsperanca]}
                        />
                      ) : null}
                      <Caracteristicas titulo="Class Features" itens={classe.caracteristicas} />
                    </>
                  ) : null}

                  {item.chave === 'subclasse' && subclasse ? (
                    <>
                      <Caracteristicas titulo="Foundation" itens={subclasse.fundacao} />
                      <Caracteristicas
                        titulo="Specialization"
                        itens={subclasse.especializacao}
                      />
                      <Caracteristicas titulo="Mastery" itens={subclasse.maestria} />
                    </>
                  ) : null}

                  {item.chave === 'ancestralidade' && ancestralidade ? (
                    <>
                      <Blocos blocos={ancestralidade.descricao} />
                      <Caracteristicas itens={ancestralidade.caracteristicas} />
                    </>
                  ) : null}

                  {item.chave === 'comunidade' && comunidade ? (
                    <>
                      <Blocos blocos={comunidade.descricao} />
                      {comunidade.personalidades.length > 0 ? (
                        <p className="srd__paragrafo srd__itens">
                          <em>Personalidades:</em> {comunidade.personalidades.join(', ')}
                        </p>
                      ) : null}
                      <Caracteristicas itens={comunidade.caracteristicas} />
                    </>
                  ) : null}
                </div>
              ) : null}
            </div>
          ))}
      </div>
    </div>
  );
}
