import { useMemo, useState } from 'react';
import {
  ataqueComArma,
  danoDaArma,
  proficiencia,
  rolagemDeConjuracao,
  rolagemDeReacao,
  testeDeAtributo,
  DADOS_DE_DANO,
  type Arma,
  type DadoDeDano,
  type Ficha,
  type OpcoesDeTeste,
} from '@/daggerheart/ficha';
import { useSrd } from '@/ui/hooks/useSrd';
import { EscolhasDoSrd } from './EscolhasDoSrd';
import { CartasDeDominio } from './CartasDeDominio';
import { AVISO_DPCGL, FONTE_DOS_DADOS, NAO_AFILIADO } from '@/daggerheart/srd/licenca';
import {
  DIFICULDADES,
  ESPERANCA_MAXIMA,
  LEMBRETES,
  TRAITS,
  lerDesfecho,
  pontosDeVidaPorDano,
  tierDoNivel,
  type TraitId,
} from '@/daggerheart/regras';
import { selectFichaAtiva, useAionStore } from '@/state/store';
import { audio } from '@/audio/sfx';
import { uid } from '@/state/ids';
import {
  IconAlerta,
  IconDesvantagem,
  IconLixeira,
  IconMais,
  IconVantagem,
} from './Icons';
import '@/ui/styles/ficha.css';

/** Trilha de caixinhas marcáveis: Vida, Estresse, Armadura. */
function Trilha({
  rotulo,
  total,
  marcados,
  cor,
  aoMudar,
}: {
  rotulo: string;
  total: number;
  marcados: number;
  cor: string;
  aoMudar: (valor: number) => void;
}) {
  const caixas = Array.from({ length: Math.max(0, Math.min(total, 20)) }, (_, i) => i);

  return (
    <div className="trilha">
      <div className="trilha__topo">
        <span className="rotulo">{rotulo}</span>
        <span className="trilha__contagem mono">
          {marcados}/{total}
        </span>
      </div>
      <div className="trilha__caixas" role="group" aria-label={rotulo}>
        {caixas.map((indice) => (
          <button
            key={indice}
            type="button"
            className="trilha__caixa"
            data-marcada={indice < marcados ? 'sim' : undefined}
            style={{ '--cor-trilha': cor } as React.CSSProperties}
            // Clicar na última marcada desmarca; nas outras, marca até ali.
            onClick={() => aoMudar(indice + 1 === marcados ? indice : indice + 1)}
            aria-label={`${rotulo} ${indice + 1}`}
            aria-pressed={indice < marcados}
          />
        ))}
      </div>
    </div>
  );
}

function CampoNumero({
  rotulo,
  valor,
  aoMudar,
  min = -99,
  max = 99,
}: {
  rotulo: string;
  valor: number;
  aoMudar: (valor: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <label className="campo-num">
      <span className="rotulo">{rotulo}</span>
      <input
        type="number"
        className="campo-num__input mono"
        value={valor}
        min={min}
        max={max}
        onChange={(evento) => {
          const bruto = Number(evento.target.value);
          if (Number.isFinite(bruto)) aoMudar(Math.max(min, Math.min(max, bruto)));
        }}
      />
    </label>
  );
}

export function FichaPanel() {
  const ficha = useAionStore(selectFichaAtiva);
  const fichas = useAionStore((s) => s.fichas);
  const atualizarFicha = useAionStore((s) => s.atualizarFicha);
  const adicionarFicha = useAionStore((s) => s.adicionarFicha);
  const removerFicha = useAionStore((s) => s.removerFicha);
  const definirFichaAtiva = useAionStore((s) => s.definirFichaAtiva);
  const rolarDaFicha = useAionStore((s) => s.rolarDaFicha);
  const som = useAionStore((s) => s.settings.sound);
  const ultimo = useAionStore((s) => s.lastResult);

  const [vantagem, setVantagem] = useState(false);
  const [desvantagem, setDesvantagem] = useState(false);
  const [experienciaId, setExperienciaId] = useState<string | null>(null);
  const [dificuldade, setDificuldade] = useState<number | null>(null);
  const [editando, setEditando] = useState(false);
  const [danoRecebido, setDanoRecebido] = useState('');

  const { srd, carregando: srdCarregando } = useSrd();

  const opcoes: OpcoesDeTeste = useMemo(
    () => ({ vantagem, desvantagem, experienciaId }),
    [vantagem, desvantagem, experienciaId],
  );

  if (!ficha) {
    return (
      <div className="ficha">
        <header className="ficha__topo">
          <h2 className="ficha__titulo">Ficha</h2>
        </header>
        <div className="ficha__vazio">
          <p>Nenhuma ficha ainda.</p>
          <button type="button" className="ficha__botao-principal" onClick={() => adicionarFicha()}>
            <IconMais size={16} />
            <span>Criar ficha</span>
          </button>
        </div>
      </div>
    );
  }

  const patch = (dados: Partial<Ficha>): void => atualizarFicha(ficha.id, dados);

  const rolar = (expressao: string, rotulo: string): void => {
    if (som) audio.click();
    rolarDaFicha(expressao, rotulo);
    // A situação vale para a rolagem que a pediu, não para as próximas.
    setVantagem(false);
    setDesvantagem(false);
    setExperienciaId(null);
  };

  const prof = proficiencia(ficha);

  // Qual atributo conjura depende da subclasse, e isso vem do SRD.
  const atributoDeConjuracao =
    srd?.subclasses.find((item) => item.id === ficha.subclasseId)?.atributoDeConjuracao ??
    null;

  // Lê o desfecho da última rolagem de dualidade contra a Dificuldade
  // escolhida — é a leitura que a mesa faz em voz alta.
  const desfecho =
    ultimo?.duality != null
      ? lerDesfecho(ultimo.total, ultimo.duality.hope, ultimo.duality.fear, dificuldade)
      : null;

  const dano = Number.parseInt(danoRecebido, 10);
  const faixaDeDano = Number.isFinite(dano)
    ? pontosDeVidaPorDano(dano, ficha.limiarMaior, ficha.limiarSevero)
    : null;

  return (
    <div className="ficha">
      <header className="ficha__topo">
        <div className="ficha__identidade">
          {fichas.length > 1 ? (
            <select
              className="ficha__seletor"
              value={ficha.id}
              onChange={(evento) => definirFichaAtiva(evento.target.value)}
              aria-label="Ficha ativa"
            >
              {fichas.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nome}
                </option>
              ))}
            </select>
          ) : (
            <h2 className="ficha__titulo">{ficha.nome}</h2>
          )}
          <span className="ficha__linha-classe">
            Nível {ficha.nivel} · Tier {tierDoNivel(ficha.nivel)} · Proficiência {prof}
          </span>
        </div>
        <button
          type="button"
          className="ficha__editar"
          onClick={() => setEditando((v) => !v)}
          aria-pressed={editando}
        >
          {editando ? 'Pronto' : 'Editar'}
        </button>
      </header>

      <div className="ficha__corpo">
        {/* ------------------------------------------------ situação */}
        <section className="ficha__secao">
          <h3 className="rotulo ficha__secao-titulo">Situação da rolagem</h3>
          <div className="situacao">
            <button
              type="button"
              className="situacao__botao"
              data-ativo={vantagem ? 'sim' : undefined}
              onClick={() => setVantagem((v) => !v)}
              aria-pressed={vantagem}
            >
              <IconVantagem size={15} />
              <span>Vantagem</span>
            </button>
            <button
              type="button"
              className="situacao__botao"
              data-ativo={desvantagem ? 'sim' : undefined}
              onClick={() => setDesvantagem((v) => !v)}
              aria-pressed={desvantagem}
            >
              <IconDesvantagem size={15} />
              <span>Desvantagem</span>
            </button>
          </div>
          {vantagem && desvantagem ? (
            <p className="situacao__aviso">
              <IconAlerta size={14} />
              <span>Uma cancela a outra — vai rolar sem nenhuma.</span>
            </p>
          ) : null}

          {ficha.experiencias.length > 0 ? (
            <div className="situacao__experiencias">
              <span className="rotulo">Experiência (gasta 1 Esperança)</span>
              <div className="situacao__chips">
                {ficha.experiencias.map((exp) => (
                  <button
                    key={exp.id}
                    type="button"
                    className="situacao__chip"
                    data-ativo={experienciaId === exp.id ? 'sim' : undefined}
                    onClick={() =>
                      setExperienciaId((atual) => (atual === exp.id ? null : exp.id))
                    }
                    aria-pressed={experienciaId === exp.id}
                  >
                    {exp.nome} +{exp.bonus}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </section>

        {/* ------------------------------------------------ atributos */}
        <section className="ficha__secao">
          <h3 className="rotulo ficha__secao-titulo">Atributos — toque para rolar</h3>
          <div className="atributos">
            {TRAITS.map((trait) => {
              const valor = ficha.atributos[trait.id] ?? 0;
              const rolagem = testeDeAtributo(ficha, trait.id, opcoes);
              return (
                <div className="atributo" key={trait.id}>
                  <button
                    type="button"
                    className="atributo__botao"
                    onClick={() => rolar(rolagem.expressao, rolagem.rotulo)}
                    title={`${trait.usa} — ${rolagem.expressao}`}
                  >
                    <span className="atributo__valor mono">
                      {valor >= 0 ? `+${valor}` : valor}
                    </span>
                    <span className="atributo__nome">{trait.nome}</span>
                    <span className="atributo__usa">{trait.usa}</span>
                  </button>
                  {editando ? (
                    <input
                      type="number"
                      className="atributo__editor mono"
                      value={valor}
                      min={-5}
                      max={9}
                      onChange={(evento) =>
                        patch({
                          atributos: {
                            ...ficha.atributos,
                            [trait.id as TraitId]: Number(evento.target.value) || 0,
                          },
                        })
                      }
                      aria-label={`Modificador de ${trait.nome}`}
                    />
                  ) : (
                    <button
                      type="button"
                      className="atributo__reacao"
                      onClick={() => {
                        const reacao = rolagemDeReacao(ficha, trait.id, opcoes);
                        rolar(reacao.expressao, reacao.rotulo);
                      }}
                      title="Rolagem de reação (não gera Esperança nem Medo)"
                    >
                      Reação
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ----------------------------------------------- conjuração */}
        {atributoDeConjuracao ? (
          <section className="ficha__secao">
            <h3 className="rotulo ficha__secao-titulo">Conjuração</h3>
            <button
              type="button"
              className="conjuracao"
              onClick={() => {
                const magia = rolagemDeConjuracao(ficha, atributoDeConjuracao, opcoes);
                rolar(magia.expressao, magia.rotulo);
              }}
            >
              <span className="conjuracao__valor mono">
                {(ficha.atributos[atributoDeConjuracao] ?? 0) >= 0 ? '+' : ''}
                {ficha.atributos[atributoDeConjuracao] ?? 0}
              </span>
              <span className="conjuracao__texto">
                Rolagem de Conjuração
                <span className="conjuracao__atributo">
                  usa {TRAITS.find((t) => t.id === atributoDeConjuracao)?.nome}
                </span>
              </span>
            </button>
          </section>
        ) : null}

        {/* ------------------------------------------------ desfecho */}
        <section className="ficha__secao">
          <h3 className="rotulo ficha__secao-titulo">Dificuldade</h3>
          <div className="dificuldades">
            <button
              type="button"
              className="dificuldade"
              data-ativo={dificuldade === null ? 'sim' : undefined}
              onClick={() => setDificuldade(null)}
            >
              —
            </button>
            {DIFICULDADES.map((faixa) => (
              <button
                key={faixa.valor}
                type="button"
                className="dificuldade"
                data-ativo={dificuldade === faixa.valor ? 'sim' : undefined}
                onClick={() => setDificuldade(faixa.valor)}
                title={`${faixa.rotulo} — ${faixa.quando}`}
              >
                {faixa.valor}
              </button>
            ))}
          </div>

          {ultimo?.duality ? (
            <div className="desfecho" data-tipo={desfecho?.id}>
              <span className="desfecho__par mono">
                Esperança {ultimo.duality.hope} · Medo {ultimo.duality.fear} · total{' '}
                {ultimo.total}
              </span>
              {desfecho ? (
                <>
                  <strong className="desfecho__rotulo">{desfecho.rotulo}</strong>
                  <span className="desfecho__efeito">{desfecho.efeito}</span>
                </>
              ) : (
                <span className="desfecho__efeito">
                  Escolha uma Dificuldade para saber se foi sucesso ou falha.
                </span>
              )}
            </div>
          ) : null}
        </section>

        {/* ------------------------------------------------ armas */}
        <section className="ficha__secao">
          <div className="ficha__secao-cabecalho">
            <h3 className="rotulo ficha__secao-titulo">Armas</h3>
            {editando ? (
              <button
                type="button"
                className="ficha__mini"
                onClick={() =>
                  patch({
                    armas: [
                      ...ficha.armas,
                      {
                        id: uid('arm'),
                        nome: 'Nova arma',
                        atributo: 'forca',
                        dado: 'd6',
                        bonus: 0,
                        tipo: 'fisico',
                        alcance: '',
                      },
                    ],
                  })
                }
              >
                <IconMais size={14} />
              </button>
            ) : null}
          </div>

          {ficha.armas.length === 0 ? (
            <p className="ficha__nota">Nenhuma arma. Entre em Editar para adicionar.</p>
          ) : null}

          <div className="armas">
            {ficha.armas.map((arma) => {
              const ataque = ataqueComArma(ficha, arma, opcoes);
              const normal = danoDaArma(ficha, arma);
              const critico = danoDaArma(ficha, arma, { critico: true });

              return (
                <div className="arma" key={arma.id}>
                  {editando ? (
                    <EditorDeArma
                      arma={arma}
                      aoMudar={(dados) =>
                        patch({
                          armas: ficha.armas.map((item) =>
                            item.id === arma.id ? { ...item, ...dados } : item,
                          ),
                        })
                      }
                      aoRemover={() =>
                        patch({ armas: ficha.armas.filter((item) => item.id !== arma.id) })
                      }
                    />
                  ) : (
                    <>
                      <div className="arma__cabecalho">
                        <span className="arma__nome">{arma.nome}</span>
                        <span className="arma__meta mono">
                          {prof}
                          {arma.dado}
                          {arma.bonus >= 0 ? `+${arma.bonus}` : arma.bonus}
                          {arma.alcance ? ` · ${arma.alcance}` : ''}
                        </span>
                      </div>
                      <div className="arma__acoes">
                        <button
                          type="button"
                          className="arma__acao arma__acao--ataque"
                          onClick={() => rolar(ataque.expressao, ataque.rotulo)}
                          title={ataque.expressao}
                        >
                          Ataque
                        </button>
                        <button
                          type="button"
                          className="arma__acao"
                          onClick={() => rolar(normal.expressao, normal.rotulo)}
                          title={normal.expressao}
                        >
                          Dano
                        </button>
                        <button
                          type="button"
                          className="arma__acao arma__acao--critico"
                          onClick={() => rolar(critico.expressao, critico.rotulo)}
                          title={critico.expressao}
                        >
                          Crítico
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ------------------------------------------------ trilhas */}
        <section className="ficha__secao">
          <h3 className="rotulo ficha__secao-titulo">Estado</h3>

          <div className="esperanca">
            <span className="rotulo">Esperança</span>
            <div className="esperanca__pontos">
              {Array.from({ length: ESPERANCA_MAXIMA }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  className="esperanca__ponto"
                  data-cheio={i < ficha.esperanca ? 'sim' : undefined}
                  onClick={() =>
                    patch({ esperanca: i + 1 === ficha.esperanca ? i : i + 1 })
                  }
                  aria-label={`Esperança ${i + 1}`}
                  aria-pressed={i < ficha.esperanca}
                />
              ))}
            </div>
          </div>

          <Trilha
            rotulo="Pontos de Vida"
            total={ficha.pontosDeVidaTotal}
            marcados={ficha.pontosDeVidaMarcados}
            cor="var(--crit-fail)"
            aoMudar={(valor) => patch({ pontosDeVidaMarcados: valor })}
          />
          <Trilha
            rotulo="Estresse"
            total={ficha.estresseTotal}
            marcados={ficha.estresseMarcado}
            cor="var(--amber-300)"
            aoMudar={(valor) => patch({ estresseMarcado: valor })}
          />
          <Trilha
            rotulo="Armadura"
            total={ficha.armaduraTotal}
            marcados={ficha.armaduraMarcada}
            cor="var(--rune-300)"
            aoMudar={(valor) => patch({ armaduraMarcada: valor })}
          />

          <div className="limiares">
            <span className="rotulo">Levei dano</span>
            <div className="limiares__linha">
              <input
                className="limiares__campo mono"
                inputMode="numeric"
                value={danoRecebido}
                onChange={(evento) => setDanoRecebido(evento.target.value)}
                placeholder="0"
                aria-label="Dano recebido"
              />
              {faixaDeDano ? (
                <span className="limiares__leitura">
                  {faixaDeDano.rotulo} — marque {faixaDeDano.pontosDeVida}{' '}
                  {faixaDeDano.pontosDeVida === 1 ? 'Ponto de Vida' : 'Pontos de Vida'}
                </span>
              ) : (
                <span className="limiares__leitura limiares__leitura--fraca">
                  Maior {ficha.limiarMaior} · Severo {ficha.limiarSevero}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ edição */}
        {editando ? (
          <section className="ficha__secao">
            <h3 className="rotulo ficha__secao-titulo">Dados da ficha</h3>
            <label className="campo-texto">
              <span className="rotulo">Nome</span>
              <input
                className="campo-texto__input"
                value={ficha.nome}
                maxLength={40}
                onChange={(evento) => patch({ nome: evento.target.value })}
              />
            </label>
            <div className="ficha__grade">
              <CampoNumero
                rotulo="Nível"
                valor={ficha.nivel}
                min={1}
                max={10}
                aoMudar={(v) => patch({ nivel: v })}
              />
              <CampoNumero
                rotulo="Evasão"
                valor={ficha.evasao}
                min={0}
                aoMudar={(v) => patch({ evasao: v })}
              />
              <CampoNumero
                rotulo="Limiar maior"
                valor={ficha.limiarMaior}
                min={0}
                aoMudar={(v) => patch({ limiarMaior: v })}
              />
              <CampoNumero
                rotulo="Limiar severo"
                valor={ficha.limiarSevero}
                min={0}
                aoMudar={(v) => patch({ limiarSevero: v })}
              />
              <CampoNumero
                rotulo="Vida total"
                valor={ficha.pontosDeVidaTotal}
                min={1}
                max={20}
                aoMudar={(v) => patch({ pontosDeVidaTotal: v })}
              />
              <CampoNumero
                rotulo="Estresse total"
                valor={ficha.estresseTotal}
                min={1}
                max={20}
                aoMudar={(v) => patch({ estresseTotal: v })}
              />
              <CampoNumero
                rotulo="Armadura total"
                valor={ficha.armaduraTotal}
                min={0}
                max={20}
                aoMudar={(v) => patch({ armaduraTotal: v })}
              />
              <CampoNumero
                rotulo="Proficiência"
                valor={ficha.proficienciaManual ?? prof}
                min={1}
                max={6}
                aoMudar={(v) => patch({ proficienciaManual: v })}
              />
            </div>
            <p className="ficha__nota">
              A proficiência sai do nível automaticamente. Mexer aqui fixa um valor —
              deixe como está se a sua mesa segue a tabela padrão.
            </p>

            <div className="ficha__secao-cabecalho">
              <span className="rotulo">Experiências</span>
              <button
                type="button"
                className="ficha__mini"
                onClick={() =>
                  patch({
                    experiencias: [
                      ...ficha.experiencias,
                      { id: uid('exp'), nome: 'Nova experiência', bonus: 2 },
                    ],
                  })
                }
              >
                <IconMais size={14} />
              </button>
            </div>
            {ficha.experiencias.map((exp) => (
              <div className="exp-editor" key={exp.id}>
                <input
                  className="exp-editor__nome"
                  value={exp.nome}
                  maxLength={40}
                  onChange={(evento) =>
                    patch({
                      experiencias: ficha.experiencias.map((item) =>
                        item.id === exp.id ? { ...item, nome: evento.target.value } : item,
                      ),
                    })
                  }
                  aria-label="Nome da experiência"
                />
                <input
                  type="number"
                  className="exp-editor__bonus mono"
                  value={exp.bonus}
                  onChange={(evento) =>
                    patch({
                      experiencias: ficha.experiencias.map((item) =>
                        item.id === exp.id
                          ? { ...item, bonus: Number(evento.target.value) || 0 }
                          : item,
                      ),
                    })
                  }
                  aria-label="Bônus da experiência"
                />
                <button
                  type="button"
                  className="ficha__mini ficha__mini--perigo"
                  onClick={() =>
                    patch({
                      experiencias: ficha.experiencias.filter((item) => item.id !== exp.id),
                    })
                  }
                  aria-label={`Remover ${exp.nome}`}
                >
                  <IconLixeira size={14} />
                </button>
              </div>
            ))}

            <div className="ficha__rodape-edicao">
              <button type="button" className="ficha__mini" onClick={() => adicionarFicha()}>
                <IconMais size={14} />
                <span>Nova ficha</span>
              </button>
              {fichas.length > 1 ? (
                <button
                  type="button"
                  className="ficha__mini ficha__mini--perigo"
                  onClick={() => removerFicha(ficha.id)}
                >
                  <IconLixeira size={14} />
                  <span>Remover esta</span>
                </button>
              ) : null}
            </div>
          </section>
        ) : null}

        {/* ------------------------------------------------ personagem */}
        <section className="ficha__secao">
          <h3 className="rotulo ficha__secao-titulo">Personagem</h3>
          {srdCarregando ? (
            <p className="ficha__nota">Carregando o material do Daggerheart…</p>
          ) : srd ? (
            <EscolhasDoSrd ficha={ficha} srd={srd} aoMudar={patch} />
          ) : (
            <p className="ficha__nota">
              Não consegui carregar o material do Daggerheart. A ficha continua
              funcionando: preencha os campos à mão em Editar.
            </p>
          )}
        </section>

        {/* --------------------------------------------------- cartas */}
        {srd ? (
          <section className="ficha__secao">
            <h3 className="rotulo ficha__secao-titulo">Cartas de domínio</h3>
            <CartasDeDominio ficha={ficha} srd={srd} aoMudar={patch} />
          </section>
        ) : null}

        {/* ------------------------------------------------ lembretes */}
        <section className="ficha__secao">
          <h3 className="rotulo ficha__secao-titulo">Lembretes</h3>
          <dl className="lembretes">
            {LEMBRETES.map((lembrete) => (
              <div className="lembrete" key={lembrete.titulo}>
                <dt>{lembrete.titulo}</dt>
                <dd>{lembrete.texto}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* A DPCGL exige este aviso onde o conteúdo do SRD é exibido. */}
        <footer className="ficha__licenca">
          <p>{AVISO_DPCGL}</p>
          <p>
            {NAO_AFILIADO} Dados de{' '}
            <a href={FONTE_DOS_DADOS.url} target="_blank" rel="noreferrer noopener">
              {FONTE_DOS_DADOS.repositorio}
            </a>
            , cópia de {FONTE_DOS_DADOS.baixadoEm}. O texto das regras aparece no
            original em inglês, sem tradução.
          </p>
        </footer>
      </div>
    </div>
  );
}

function EditorDeArma({
  arma,
  aoMudar,
  aoRemover,
}: {
  arma: Arma;
  aoMudar: (dados: Partial<Arma>) => void;
  aoRemover: () => void;
}) {
  return (
    <div className="arma-editor">
      <input
        className="arma-editor__nome"
        value={arma.nome}
        maxLength={40}
        onChange={(evento) => aoMudar({ nome: evento.target.value })}
        aria-label="Nome da arma"
      />
      <div className="arma-editor__linha">
        <select
          className="arma-editor__campo"
          value={arma.atributo}
          onChange={(evento) => aoMudar({ atributo: evento.target.value as TraitId })}
          aria-label="Atributo do ataque"
        >
          {TRAITS.map((trait) => (
            <option key={trait.id} value={trait.id}>
              {trait.nome}
            </option>
          ))}
        </select>
        <select
          className="arma-editor__campo"
          value={arma.dado}
          onChange={(evento) => aoMudar({ dado: evento.target.value as DadoDeDano })}
          aria-label="Dado de dano"
        >
          {DADOS_DE_DANO.map((dado) => (
            <option key={dado} value={dado}>
              {dado}
            </option>
          ))}
        </select>
        <input
          type="number"
          className="arma-editor__campo mono"
          value={arma.bonus}
          onChange={(evento) => aoMudar({ bonus: Number(evento.target.value) || 0 })}
          aria-label="Bônus de dano"
        />
        <button
          type="button"
          className="ficha__mini ficha__mini--perigo"
          onClick={aoRemover}
          aria-label={`Remover ${arma.nome}`}
        >
          <IconLixeira size={14} />
        </button>
      </div>
      <input
        className="arma-editor__nome"
        value={arma.alcance}
        maxLength={30}
        placeholder="Alcance (corpo a corpo, longe…)"
        onChange={(evento) => aoMudar({ alcance: evento.target.value })}
        aria-label="Alcance"
      />
    </div>
  );
}
