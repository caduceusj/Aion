import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/ui/styles/tokens.css';
import '@/ui/styles/base.css';
import { App } from './App';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Elemento #root não encontrado no documento.');
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
