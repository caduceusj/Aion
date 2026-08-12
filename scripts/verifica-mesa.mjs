/**
 * Verificação de ponta a ponta da mesa compartilhada.
 *
 * Sobe o relay de verdade, conecta dois clientes WebSocket de verdade e
 * confere a propriedade que sustenta a mesa inteira: como só a expressão e
 * a semente trafegam, o segundo aparelho precisa chegar exatamente ao mesmo
 * resultado que o primeiro.
 *
 *   node scripts/verifica-mesa.mjs
 */

import { WebSocket } from 'ws';
import { spawn } from 'node:child_process';
import { build } from 'esbuild';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const PORTA = process.env.PORT ?? '8791';
const URL = `ws://localhost:${PORTA}`;
const SALA = 'TEST';

const espera = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// O motor é TypeScript; empacota para conseguir usá-lo aqui.
const pasta = await mkdtemp(join(tmpdir(), 'aion-mesa-'));
const bundle = join(pasta, 'engine.mjs');
await build({
  entryPoints: ['src/engine/index.ts'],
  bundle: true,
  format: 'esm',
  outfile: bundle,
  logLevel: 'error',
});
const { roll } = await import(bundle);

const relay = spawn('node', ['server/relay.mjs'], {
  env: { ...process.env, PORT: PORTA },
});
relay.stdout.on('data', (dados) => process.stdout.write(`  [relay] ${dados}`));
await espera(900);

const falhas = [];
function checa(condicao, mensagem) {
  if (!condicao) falhas.push(mensagem);
  console.log(`  ${condicao ? 'ok  ' : 'FALHA'}  ${mensagem}`);
}

function cliente(nome, mestre = false) {
  const ws = new WebSocket(URL);
  const recebidas = [];
  ws.on('message', (dados) => recebidas.push(JSON.parse(dados.toString())));
  return new Promise((resolve) => {
    ws.on('open', () => {
      ws.send(JSON.stringify({ tipo: 'entrar', sala: SALA, nome, skin: 'ambar', mestre }));
      setTimeout(() => resolve({ ws, recebidas, nome }), 300);
    });
  });
}

try {
  const a = await cliente('Vess');
  const b = await cliente('Mestre', true);
  await espera(300);

  checa(
    a.recebidas.find((m) => m.tipo === 'bem-vindo')?.sala === SALA,
    'quem entra recebe a sala de volta',
  );

  const presenca = a.recebidas.filter((m) => m.tipo === 'presenca').pop();
  checa(presenca?.participantes.length === 2, 'os dois se enxergam na mesa');
  checa(presenca?.participantes.some((p) => p.mestre), 'o Mestre aparece marcado');

  // O teste central: A rola, B recebe só expressão + semente.
  const original = roll('dd+2[Ataque]');
  a.ws.send(
    JSON.stringify({
      tipo: 'rolagem',
      carga: {
        id: 'h1',
        expressao: original.expression,
        semente: original.seed,
        momento: original.timestamp,
        personagem: 'Vess',
        skin: 'ambar',
        atalho: null,
        oculta: false,
      },
    }),
  );
  await espera(350);

  const recebida = b.recebidas.find((m) => m.tipo === 'rolagem');
  checa(!!recebida, 'a rolagem chega no outro aparelho');
  checa(
    !a.recebidas.some((m) => m.tipo === 'rolagem'),
    'quem rolou não recebe a própria rolagem de volta',
  );

  if (recebida) {
    const reproduzida = roll(recebida.carga.expressao, { seed: recebida.carga.semente });
    checa(
      reproduzida.total === original.total,
      `o total bate dos dois lados (${reproduzida.total})`,
    );
    checa(
      JSON.stringify(reproduzida.duality) === JSON.stringify(original.duality),
      `a dualidade bate (Esperança ${original.duality.hope} / Medo ${original.duality.fear})`,
    );
    checa(
      JSON.stringify(reproduzida.dice.map((d) => d.value)) ===
        JSON.stringify(original.dice.map((d) => d.value)),
      'cada dado individual bate',
    );
  }

  b.ws.send(JSON.stringify({ tipo: 'medo', valor: 3 }));
  await espera(300);
  checa(
    a.recebidas.filter((m) => m.tipo === 'medo').pop()?.valor === 3,
    'o Medo do Mestre é o mesmo para todos',
  );

  b.ws.send(JSON.stringify({ tipo: 'revelar', rolagemId: 'h1' }));
  await espera(300);
  checa(
    a.recebidas.some((m) => m.tipo === 'revelar' && m.rolagemId === 'h1'),
    'revelar uma rolagem oculta propaga',
  );

  b.ws.close();
  await espera(400);
  checa(
    a.recebidas.filter((m) => m.tipo === 'presenca').pop()?.participantes.length === 1,
    'a presença cai quando alguém sai',
  );

  const ruim = new WebSocket(URL);
  await new Promise((resolve) => ruim.on('open', resolve));
  const erros = [];
  ruim.on('message', (dados) => erros.push(JSON.parse(dados.toString())));
  ruim.send(
    JSON.stringify({ tipo: 'entrar', sala: 'X', nome: 'n', skin: 'ambar', mestre: false }),
  );
  await espera(300);
  checa(erros.some((m) => m.tipo === 'erro'), 'código de sala curto demais é recusado');

  a.ws.close();
  ruim.close();
} finally {
  relay.kill();
  await rm(pasta, { recursive: true, force: true });
}

console.log(falhas.length === 0 ? '\nMesa compartilhada: tudo certo.' : `\n${falhas.length} falha(s).`);
process.exit(falhas.length === 0 ? 0 : 1);
