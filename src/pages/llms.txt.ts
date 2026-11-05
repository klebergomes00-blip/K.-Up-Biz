// src/pages/llms.txt.ts — Resumo do site para assistentes de IA (padrão llms.txt)
import type { APIRoute } from 'astro';
import { EMPRESA } from '../config/empresa';
import { SERVICOS } from '../config/servicos';
import { SEGMENTOS, segmentoUrl } from '../config/segmentos';
import { GUIAS, guiaUrl } from '../config/guias';
import { CIDADES, cidadeUrl } from '../config/cidades';

export const GET: APIRoute = ({ site }) => {
  const b = (site?.href || '').replace(/\/$/, '');
  const l = (nome: string, path: string, desc?: string) => `- [${nome}](${b}${path})${desc ? `: ${desc}` : ''}`;
  const txt = [
    `# ${EMPRESA.nomeFantasia}`,
    '',
    `> ${EMPRESA.nomeFantasia} (Kleber Up Business) cria sites e landing pages, otimiza o Perfil da Empresa no Google (Google Meu Negócio) e faz gestão de tráfego pago (Google Ads, Instagram e Facebook). Fica em ${EMPRESA.cidadeUf} e atende empresas de todo o Brasil de forma online. O atendimento é feito diretamente por ${EMPRESA.responsavelCurto}, do primeiro contato à entrega.`,
    '',
    `Contato: WhatsApp ${EMPRESA.whatsappLabel} · ${EMPRESA.email} · Instagram ${EMPRESA.instagramHandle}`,
    '',
    '## Serviços',
    ...SERVICOS.map((s) => l(s.nome, s.slug, s.resumo)),
    '',
    '## Sites por segmento',
    ...SEGMENTOS.map((s) => l(`Sites para ${s.curto}`, segmentoUrl(s))),
    '',
    '## Guias',
    ...GUIAS.map((g) => l(g.titulo, guiaUrl(g))),
    '',
    '## Atendimento',
    l('Atendimento online em todo o Brasil', '/atendimento-online'),
    ...CIDADES.map((c) => l(`${c.nome} – ${c.uf}`, cidadeUrl(c))),
    '',
    '## Sobre',
    l('Sobre a K. Up Biz', '/sobre'),
    l('Projetos realizados', '/cases'),
    ''
  ].join('\n');
  return new Response(txt, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
