// @vitest-environment jsdom
/**
 * O almanaque como o leitor o usa.
 *
 * `calendario.test.ts` garante que os números fecham; este arquivo garante
 * que as três telas concordam entre si. A razão de existir é uma só: antes
 * cada tela guardava o seu próprio mês, e escolher Lereal na folha não levava
 * a lugar nenhum no céu. Estes testes seguram o cursor compartilhado, a
 * distância certa em cada ano e o teclado da matriz.
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { CodexCalendario } from '@/ui/components/CodexCalendario';
import { esquecer } from './memoria';

// O almanaque lembra onde estava entre uma visita e a outra. Sem esquecer, o
// fim de um teste viraria o começo do seguinte.
beforeEach(esquecer);
afterEach(cleanup);

const abrir = () => render(<CodexCalendario aoNavegar={() => {}} />);
const aba = (nome: string) => screen.getByRole('tab', { name: nome });
const pontoDeVista = () => within(screen.getByRole('group', { name: 'Olhando de qual continente' }));
const mes = (nome: string) => screen.getByRole('button', { name: new RegExp(`^${nome}`) });

describe('o casco do almanaque', () => {
  it('abre na folha de Equiral, vista de Valoran, com três abas de verdade', () => {
    abrir();
    expect(screen.getAllByRole('tab').map((t) => t.textContent)).toEqual(['O Ano', 'O Céu', 'A Corvisseia']);
    expect(aba('O Ano').getAttribute('aria-selected')).toBe('true');
    expect(screen.getByRole('tabpanel').getAttribute('aria-labelledby')).toBe('almanaque-aba-ano');
    expect(screen.getByRole('heading', { name: 'Equiral' })).toBeTruthy();
    expect(pontoDeVista().getByRole('button', { name: 'Valoran', pressed: true })).toBeTruthy();
    expect(pontoDeVista().getAllByRole('button')).toHaveLength(6);
  });

  it('as setas andam entre as abas', () => {
    abrir();
    fireEvent.keyDown(aba('O Ano'), { key: 'ArrowRight' });
    expect(aba('O Céu').getAttribute('aria-selected')).toBe('true');
    fireEvent.keyDown(aba('O Céu'), { key: 'ArrowLeft' });
    fireEvent.keyDown(aba('O Ano'), { key: 'ArrowLeft' });
    expect(aba('A Corvisseia').getAttribute('aria-selected')).toBe('true');
  });
});

describe('o cursor compartilhado', () => {
  it('a folha mostra o salto do ano escolhido, não sempre o do ano 1', () => {
    abrir();
    fireEvent.click(mes('Lereal'));
    expect(screen.getByLabelText(/O salto de Lereal/).textContent).toContain('2,40 UA');

    fireEvent.click(within(screen.getByRole('group', { name: 'Ano da Corvisseia' })).getByText('3'));
    const cartao = screen.getByLabelText(/O salto de Lereal/);
    expect(cartao.textContent).toContain('0,46 UA');
    expect(cartao.textContent).toContain('ano 3');
  });

  it('"Ver no céu" abre o céu no mês que a folha mostrava', () => {
    abrir();
    fireEvent.click(mes('Lereal'));
    fireEvent.click(screen.getByRole('button', { name: 'Ver no céu' }));
    expect(aba('O Céu').getAttribute('aria-selected')).toBe('true');
    // Corvus parte no dia 20 de Lereal, rumo a Ukanten.
    expect(screen.getByRole('tabpanel').textContent).toContain('20 de Lereal');
    expect(screen.getByRole('tabpanel').textContent).toContain('rumo a Ukanten');
  });

  it('o ponto de vista escolhido no casco chega às três telas', () => {
    abrir();
    fireEvent.click(pontoDeVista().getByRole('button', { name: 'Fentor' }));
    // folha: a lua de Equiral está sobre Valoran, então de Fentor é noite escura
    expect(document.querySelector('.folha__lua')?.getAttribute('title')).toContain('De Fentor, é noite escura');
    expect(document.querySelector('.folha__lua')?.getAttribute('data-aqui')).toBeNull();
    fireEvent.click(aba('A Corvisseia'));
    // matriz: os trechos que tocam Fentor ganham marca
    const marcados = screen.getAllByRole('rowheader').filter((c) => c.getAttribute('data-toca') === 'sim');
    expect(marcados.map((c) => c.textContent)).toEqual([
      expect.stringContaining('Vrednost'),
      expect.stringContaining('Fentor'),
    ]);
  });
});

describe('a Corvisseia', () => {
  const celula = (mes: number) => document.getElementById(`celula-${mes}`) as HTMLElement;

  it('a matriz tem as 36 células, cada uma com nome completo para quem a ouve', () => {
    abrir();
    fireEvent.click(aba('A Corvisseia'));
    const celulas = screen.getAllByRole('button', { name: /volta \d, mês \d+:/ });
    expect(celulas).toHaveLength(36);
    expect(celula(27).getAttribute('aria-label')).toBe(
      'Vrednost para Fentor, volta 5, mês 27: 2,49 UA, 411 quilômetros por segundo, pulo intenso',
    );
  });

  it('escolher uma célula mostra o trecho por inteiro', () => {
    abrir();
    fireEvent.click(aba('A Corvisseia'));
    fireEvent.click(celula(27));
    const detalhe = screen.getByLabelText('O trecho do mês 27');
    expect(detalhe.textContent).toContain('Vrednost');
    expect(detalhe.textContent).toContain('2,49');
    expect(detalhe.textContent).toContain('411');
    expect(detalhe.textContent).toContain('Intenso');
    expect(celula(27).getAttribute('aria-pressed')).toBe('true');
  });

  it('só a célula escolhida está na ordem de tabulação, e as setas a levam', () => {
    abrir();
    fireEvent.click(aba('A Corvisseia'));
    fireEvent.click(celula(27));
    expect(celula(27).tabIndex).toBe(0);
    expect(celula(26).tabIndex).toBe(-1);

    fireEvent.keyDown(celula(27), { key: 'ArrowLeft' });
    expect(celula(21).getAttribute('aria-pressed')).toBe('true'); // volta 4, mesmo trecho
    fireEvent.keyDown(celula(21), { key: 'ArrowDown' });
    expect(celula(22).getAttribute('aria-pressed')).toBe('true'); // próximo trecho, mesma volta
    fireEvent.keyDown(celula(22), { key: 'End' });
    expect(celula(34).getAttribute('aria-pressed')).toBe('true'); // última volta
    fireEvent.keyDown(celula(34), { key: 'ArrowRight' });
    expect(celula(34).getAttribute('aria-pressed')).toBe('true'); // não passa do fim
  });

  it('o ritmo e a matriz escolhem o mesmo mês', () => {
    abrir();
    fireEvent.click(aba('A Corvisseia'));
    fireEvent.click(document.getElementById('ritmo-11') as HTMLElement);
    expect(celula(11).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByLabelText('O trecho do mês 11').textContent).toContain('0,25');
  });

  it('os quatro números levam ao trecho que citam', () => {
    abrir();
    fireEvent.click(aba('A Corvisseia'));
    fireEvent.click(screen.getByRole('button', { name: /O trecho mais veloz/ }));
    expect(celula(27).getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: /O mais manso/ }));
    expect(celula(11).getAttribute('aria-pressed')).toBe('true');
  });

  it('"Ver a folha" volta à folha daquele mês, no ano certo', () => {
    abrir();
    fireEvent.click(aba('A Corvisseia'));
    fireEvent.click(celula(28)); // Lereal, ano 3
    fireEvent.click(screen.getByRole('button', { name: 'Ver a folha' }));
    expect(aba('O Ano').getAttribute('aria-selected')).toBe('true');
    expect(screen.getByLabelText(/O salto de Lereal/).textContent).toContain('ano 3');
  });

  it('"Tocar este trecho" abre o céu já rodando', () => {
    abrir();
    fireEvent.click(aba('A Corvisseia'));
    fireEvent.click(celula(27));
    fireEvent.click(screen.getByRole('button', { name: /Tocar este trecho/ }));
    expect(aba('O Céu').getAttribute('aria-selected')).toBe('true');
    expect(screen.getByRole('button', { name: /Pausar/ }).getAttribute('aria-pressed')).toBe('true');
  });
});

describe('o céu', () => {
  it('a régua é um controle deslizante de verdade, com o dia por extenso', () => {
    abrir();
    fireEvent.click(aba('O Céu'));
    const regua = screen.getByRole('slider', { name: 'Dia da Corvisseia' });
    expect(regua.getAttribute('max')).toBe('1080');
    expect(regua.getAttribute('aria-valuetext')).toContain('de Equiral');
    fireEvent.change(regua, { target: { value: '900' } });
    expect(regua.getAttribute('aria-valuetext')).toContain('Dia 901');
  });

  it('clicar num continente o escolhe como ponto de vista', () => {
    abrir();
    fireEvent.click(aba('O Céu'));
    fireEvent.click(screen.getByRole('button', { name: /^Fentor \(C2\), voltado para/, pressed: false }));
    expect(screen.getByRole('button', { name: /^Fentor \(C2\), voltado para/, pressed: true })).toBeTruthy();
    // o mesmo gesto acende o chip do casco: é um estado só, em dois lugares
    expect(pontoDeVista().getByRole('button', { name: 'Fentor', pressed: true })).toBeTruthy();
  });
});
