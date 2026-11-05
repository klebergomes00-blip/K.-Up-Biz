// src/config/portfolio.ts — Projetos reais do portfólio (com autorização dos clientes).
export const PROJETOS = [
  {
    key: 'fernando-junior',
    nome: 'Fernando Junior',
    segmento: 'Corretor de imóveis',
    descricao: 'Uma experiência imobiliária cinematográfica, criada para valorizar propriedades e transmitir sofisticação.',
    url: 'https://fernandocorretor-six.vercel.app/',
    segmentoSlug: 'corretores-de-imoveis'
  },
  {
    key: 'level-up-agency',
    nome: 'Level Up Agency',
    segmento: 'Marketing e presença digital',
    descricao: 'Design e posicionamento reunidos para apresentar soluções de presença digital.',
    url: 'https://level-up-agency-astro.vercel.app/',
    segmentoSlug: ''
  },
  {
    key: 'level-up-aesthetics',
    nome: 'Level Up Aesthetics',
    segmento: 'Clínica de estética',
    descricao: 'Uma experiência digital elegante que transmite cuidado, confiança e beleza natural.',
    url: 'https://clinicaestetica-xi.vercel.app/',
    segmentoSlug: 'clinicas-de-estetica'
  },
  {
    key: 'styvy-burguer',
    nome: 'Styvy Burguer',
    segmento: 'Hamburgueria',
    descricao: 'Uma narrativa visual que transforma ingredientes, brasa e sabor em desejo.',
    url: 'https://styviburguer.vercel.app/',
    segmentoSlug: 'restaurantes'
  }
] as const;
export const projeto = (key?: string) => PROJETOS.find((p) => p.key === key);
