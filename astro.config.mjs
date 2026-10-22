// @ts-check
import { defineConfig } from 'astro/config';

// Endereço público do site.
// Domínio oficial. A variável SITE_URL (se existir na Vercel) tem prioridade.
const site = process.env.SITE_URL || 'https://kupbiz.com.br';

// https://astro.build/config
export default defineConfig({
  site,
  // URLs sem barra no final (ex.: /termos-de-uso), iguais aos links internos,
  // ao sitemap e às canônicas. A Vercel serve o .html sem extensão (cleanUrls).
  trailingSlash: 'never',
  build: { format: 'file' }
});
