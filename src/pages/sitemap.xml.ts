// src/pages/sitemap.xml.ts — Mapa do site para o Google (gerado no build)
import type { APIRoute } from 'astro';

import { SERVICOS } from '../config/servicos';

const paginas = [
  { path: '/', prioridade: '1.0' },
  ...SERVICOS.map((s) => ({ path: s.slug, prioridade: '0.9' })),
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

