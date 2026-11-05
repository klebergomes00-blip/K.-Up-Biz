// src/pages/robots.txt.ts — Instruções para buscadores e robôs de IA
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const base = (site?.href || '').replace(/\/$/, '');
  const ia = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended'];
  const txt = [
    '# Buscadores e assistentes de IA podem ler todo o site',
    'User-agent: *',
    'Allow: /',
    '',
    ...ia.flatMap((b) => [`User-agent: ${b}`, 'Allow: /', '']),
    `Sitemap: ${base}/sitemap.xml`,
    ''
  ].join('\n');
  return new Response(txt, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
