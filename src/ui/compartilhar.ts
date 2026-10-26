import { avisar } from '@/ui/avisos';

/**
 * Copia o endereço da página aberta — o Códice escreve o verbete no hash, então
 * o link já aponta para ele.
 *
 * O Códice nasceu para ser mandado no grupo ("olha o verbete da Casa Keaton");
 * copiar o endereço da barra, no celular, é um gesto que quase ninguém acha.
 * Aqui é um botão, e o resultado — deu ou não deu — aparece num aviso, porque
 * um botão de copiar que não confirma deixa a pessoa colando no vazio.
 */
export async function copiarLink(nome: string): Promise<void> {
  const endereco = window.location.href;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(endereco);
      avisar(`Link de “${nome}” copiado.`);
      return;
    }
  } catch {
    // Permissão negada ou página sem contexto seguro: cai no aviso de baixo.
  }
  avisar('Não consegui copiar sozinho. O endereço está na barra do navegador.');
}
