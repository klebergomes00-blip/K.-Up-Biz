// src/pages/sitemap.xml.ts — Mapa do site para o Google (gerado no build)
import type { APIRoute } from 'astro';

import { SERVICOS } from '../config/servicos';
import { SEGMENTOS, segmentoUrl } from '../config/segmentos';
import { GUIAS, guiaUrl } from '../config/guias';
import { CIDADES, cidadeUrl } from '../config/cidades';

const paginas = [
  { path: '/', prioridade: '1.0' },
  ...SERVICOS.map((s) => ({ path: s.slug, prioridade: '0.9' })),
  { path: '/segmentos', prioridade: '0.8' },
  ...SEGMENTOS.map((s) => ({ path: segmentoUrl(s), prioridade: '0.8' })),
  { path: '/guias', prioridade: '0.7' },
  ...GUIAS.map((g) => ({ path: guiaUrl(g), prioridade: '0.7' })),
  { path: '/atendimento-online', prioridade: '0.7' },
  ...CIDADES.map((c) => ({ path: cidadeUrl(c), prioridade: '0.6' })),
  { path: '/cases', prioridade: '0.6' },
  { path: '/sobre', prioridade: '0.6' },
  { path: '/politica-de-privacidade', prioridade: '0.3' },
  { path: '/termos-de-uso', prioridade: '0.3' },
  { path: '/politica-de-cookies', prioridade: '0.3' },
  { path: '/trocas-e-reembolso', prioridade: '0.3' }
];

export const GET: APIRoute = ({ site }) => {
  const base = (site?.href || '').replace(/\/$/, '');
  const hoje = new Date().toISOString().slice(0, 10);
  const urls = paginas
    .map((p) => `  <url><loc>${base}${p.path}</loc><lastmod>${hoje}</lastmod><priority>${p.prioridade}</priority></url>`)
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
