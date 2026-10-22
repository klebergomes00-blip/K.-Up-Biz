// src/config/servicos.ts — Os três serviços: endereço, nomes e mensagem do WhatsApp.
// Usado nas páginas de serviço, no rodapé, no sitemap e nos links da página inicial.

export const SERVICOS = [
  {
    id: 'web',
    slug: '/criacao-de-sites',
    nome: 'Criação de Sites',
    nomeCurto: 'Sites',
    resumo: 'Sites e landing pages com a cara da sua marca, rápidos no celular e com WhatsApp integrado.',
    whatsapp: 'Olá, Kleber! Vi a página de Criação de Sites e quero conversar sobre um site para o meu negócio.'
  },
  {
    id: 'local',
    slug: '/google-meu-negocio',
    nome: 'Google Meu Negócio',
    nomeCurto: 'Google',
    resumo: 'Otimização do Perfil da Empresa no Google para ser encontrado na Busca e no Maps.',
    whatsapp: 'Olá, Kleber! Vi a página do Google Meu Negócio e quero melhorar o perfil da minha empresa.'
  },
  {
    id: 'reach',
    slug: '/gestao-de-trafego-pago',
    nome: 'Gestão de Tráfego Pago',
    nomeCurto: 'Tráfego pago',
    resumo: 'Anúncios no Google, Instagram e Facebook planejados para o seu objetivo e orçamento.',
    whatsapp: 'Olá, Kleber! Vi a página de Gestão de Tráfego Pago e quero conversar sobre anúncios para o meu negócio.'
  }
] as const;

export type ServicoId = (typeof SERVICOS)[number]['id'];
export const servico = (id: ServicoId) => SERVICOS.find((s) => s.id === id)!;
