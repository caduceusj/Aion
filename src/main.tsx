import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/ui/styles/tokens.css';
import '@/ui/styles/base.css';
import { App } from './App';
import { ErroNaTela } from '@/ui/components/ErroNaTela';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Elemento #root não encontrado no documento.');
}

createRoot(container).render(
  <StrictMode>
    <ErroNaTela>
      <App />
    </ErroNaTela>
  </StrictMode>,
);
