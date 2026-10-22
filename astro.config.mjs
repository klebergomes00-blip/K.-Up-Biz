// @ts-check
import { defineConfig } from 'astro/config';

// Endereço público do site.
// Na Vercel ele é detectado sozinho (domínio de produção do projeto).
// Para forçar um domínio, crie a variável de ambiente SITE_URL na Vercel (ex.: https://kupbiz.com.br).
const vercelDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const site = process.env.SITE_URL || (vercelDomain ? `https://${vercelDomain}` : 'http://localhost:4321');

// https://astro.build/config
export default defineConfig({
  site,
  // URLs sem barra no final (ex.: /termos-de-uso), iguais aos links internos,
  // ao sitemap e às canônicas. A Vercel serve o .html sem extensão (cleanUrls).
  trailingSlash: 'never',
  build: { format: 'file' }
});
