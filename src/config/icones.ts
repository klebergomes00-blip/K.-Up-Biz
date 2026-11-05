// src/config/icones.ts — Ícone (traço fino, 24×24) e rótulo de cada segmento.
// Usados no orbe da hero das páginas /sites-para-*, nos cards de /segmentos e na home.

export interface IconeSegmento {
  rotulo: string;  // palavra curta exibida em itálico sob o ícone
  svg: string;     // conteúdo interno de um <svg viewBox="0 0 24 24">
}

export const ICONES_SEGMENTO: Record<string, IconeSegmento> = {
  dentistas: {
    rotulo: 'Odontologia',
    svg: '<path d="M7 3c-2.2 0-3.5 1.8-3.5 4 0 2 .8 3.4 1.3 5 .6 2 .7 4.6 1.2 6.6.3 1.3.9 2.4 1.9 2.4 1.3 0 1.6-1.6 1.9-3.1.3-1.4.6-2.9 2.2-2.9s1.9 1.5 2.2 2.9c.3 1.5.6 3.1 1.9 3.1 1 0 1.6-1.1 1.9-2.4.5-2 .6-4.6 1.2-6.6.5-1.6 1.3-3 1.3-5 0-2.2-1.3-4-3.5-4-1.8 0-2.8 1-5 1S8.8 3 7 3z"/>'
  },
  oftalmologistas: {
    rotulo: 'Oftalmologia',
    svg: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'
  },
  'clinicas-medicas': {
    rotulo: 'Medicina',
    svg: '<path d="M5 3H4v5a5 5 0 0 0 10 0V3h-1"/><path d="M9 13v1.5a5.5 5.5 0 0 0 11 0V12"/><circle cx="20" cy="10" r="2"/>'
  },
  'clinicas-de-estetica': {
    rotulo: 'Estética',
    svg: '<path d="M12 3l1.8 4.7 4.7 1.8-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M19 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/><path d="M5 15l.6 1.4 1.4.6-1.4.6L5 19l-.6-1.4L3 17l1.4-.6z"/>'
  },
  psicologos: {
    rotulo: 'Psicologia',
    svg: '<path d="M21 11.5a8.4 8.4 0 0 1-12.3 7.4L3 21l2.1-5.6A8.4 8.4 0 1 1 21 11.5z"/><path d="M12 14.5s-3-1.8-3-3.8a1.6 1.6 0 0 1 3-.8 1.6 1.6 0 0 1 3 .8c0 2-3 3.8-3 3.8z"/>'
  },
  fisioterapeutas: {
    rotulo: 'Fisioterapia',
    svg: '<circle cx="12" cy="4.5" r="2"/><path d="M4 8l8 2 8-2"/><path d="M12 10v5"/><path d="M12 15l-4 6M12 15l4 6"/>'
  },
  nutricionistas: {
    rotulo: 'Nutrição',
    svg: '<path d="M12 7c-1.5-1-5-1.5-6.5 1.5S5 16 7 19c1.2 1.8 2.8 2.4 5 1.3 2.2 1.1 3.8.5 5-1.3 2-3 2.5-7.5 1-10.5S13.5 6 12 7z"/><path d="M12 7c0-2 1-3.5 3-4"/>'
  },
  veterinarios: {
    rotulo: 'Veterinária',
    svg: '<circle cx="5.5" cy="10" r="1.8"/><circle cx="9.5" cy="5.5" r="1.8"/><circle cx="14.5" cy="5.5" r="1.8"/><circle cx="18.5" cy="10" r="1.8"/><path d="M12 12c-2.5 0-5 3-5 5.5 0 1.6 1.2 2.5 2.6 2.5 1 0 1.6-.5 2.4-.5s1.4.5 2.4.5c1.4 0 2.6-.9 2.6-2.5 0-2.5-2.5-5.5-5-5.5z"/>'
  },
  advogados: {
    rotulo: 'Advocacia',
    svg: '<path d="M12 3v18M7 21h10M5 7h14"/><path d="M5 7l-3 7a3 3 0 0 0 6 0z"/><path d="M19 7l-3 7a3 3 0 0 0 6 0z"/>'
  },
  contadores: {
    rotulo: 'Contabilidade',
    svg: '<rect x="5" y="2" width="14" height="20" rx="2"/><rect x="8" y="5" width="8" height="4" rx=".5"/><path d="M8 13h2M14 13h2M8 17h2M14 17h2"/>'
  },
  engenheiros: {
    rotulo: 'Engenharia',
    svg: '<path d="M4 17a8 8 0 0 1 16 0"/><path d="M2.5 17h19v2.5h-19z"/><path d="M10 9.5V6h4v3.5"/>'
  },
  arquitetos: {
    rotulo: 'Arquitetura',
    svg: '<path d="M12 2.5V5"/><circle cx="12" cy="6.5" r="1.5"/><path d="M11 8l-5 13M13 8l5 13"/><path d="M7.5 16.5h9"/>'
  },
  'corretores-de-imoveis': {
    rotulo: 'Imóveis',
    svg: '<path d="M3 11l9-7 9 7"/><path d="M5 9.5V20h14V9.5"/><path d="M10 20v-6h4v6"/>'
  },
  'energia-solar': {
    rotulo: 'Energia solar',
    svg: '<circle cx="7" cy="5" r="2"/><path d="M7 1.5v.5M3.5 5H4M10 5h.5M4.5 2.5l.4.4M9.5 2.5l-.4.4"/><path d="M5 21l3-9h13l-3 9z"/><path d="M12.3 12l-3 9M16.7 12l-3 9M6.5 16.5h13"/>'
  },
  marcenarias: {
    rotulo: 'Marcenaria',
    svg: '<path d="M9.5 6.5 13 3l5.5 2.5 2 2-2 2-3-1-2.5 2.5z"/><path d="M12.5 9.5l-8 8a1.5 1.5 0 0 0 2 2l8-8"/>'
  },
  restaurantes: {
    rotulo: 'Gastronomia',
    svg: '<path d="M7 3v7a2 2 0 0 0 4 0V3M9 3v18"/><path d="M17 21V3c-2 1.5-3 4-3 7 0 1.5 1 2.5 3 2.5"/>'
  },
  construtoras: {
    rotulo: 'Construção',
    svg: '<path d="M4 21V7l8-4v18"/><path d="M12 9h8v12"/><path d="M2 21h20"/><path d="M7 9h2M7 13h2M7 17h2M15 13h2M15 17h2"/>'
  },
  'oficinas-mecanicas': {
    rotulo: 'Mecânica',
    svg: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z"/>'
  },
  academias: {
    rotulo: 'Fitness',
    svg: '<path d="M6 6.5v11M3 9.5v5M18 6.5v11M21 9.5v5M6 12h12"/>'
  },
  'saloes-e-barbearias': {
    rotulo: 'Beleza',
    svg: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.4 7.8 20 18M8.4 16.2 20 6"/>'
  }
};

export const iconeSegmento = (slug: string) => ICONES_SEGMENTO[slug];

// Ícone do orbe na hero de cada guia
export const ICONES_GUIA: Record<string, IconeSegmento> = {
  'quanto-custa-um-site': {
    rotulo: 'Investimento',
    svg: '<path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/>'
  },
  'site-ou-instagram': {
    rotulo: 'Presença digital',
    svg: '<rect x="2" y="4" width="14" height="10" rx="1.5"/><path d="M6 18h6M9 14v4"/><rect x="16" y="8" width="6" height="12" rx="1.5"/><path d="M18.5 17.5h1"/>'
  },
  'landing-page-ou-site': {
    rotulo: 'Estrutura',
    svg: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>'
  },
  'como-aparecer-no-google-maps': {
    rotulo: 'Google Maps',
    svg: '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>'
  },
  'quanto-investir-em-trafego-pago': {
    rotulo: 'Tráfego pago',
    svg: '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 6-6"/><path d="M16 8h4v4"/>'
  },
  'por-que-minha-empresa-nao-aparece-no-google': {
    rotulo: 'Visibilidade',
    svg: '<circle cx="11" cy="11" r="7"/><path d="M20.5 20.5 16 16"/><path d="M11 8v3.5M11 14.2v.1"/>'
  }
};

export const iconeGuia = (slug: string) => ICONES_GUIA[slug];
