// src/config/empresa.ts — Dados oficiais da empresa usados no rodapé e nas páginas legais.
// Altere aqui e tudo no site é atualizado.

export const EMPRESA = {
  nomeFantasia: 'K. Up Biz',
  responsavel: 'Kleber Gomes Silva',
  // Nome exibido no rodapé
  responsavelCurto: 'Kleber Gomes',
  tipo: 'pessoa física',
  endereco: 'Rua Nicolau Gomes, nº 10 – Pq. São João',
  cidadeUf: 'Cabeceiras – GO',
  email: 'kleberupbusiness@gmail.com',
  whatsapp: '5561996229988',
  whatsappLabel: '(61) 99622-9988',
  instagramUrl: 'https://www.instagram.com/k.upbiz/',
  instagramHandle: '@k.upbiz',
  // Data da última revisão das políticas (atualize sempre que mudar o texto)
  atualizacaoPoliticas: '21 de outubro de 2026'
};

// Link direto para o WhatsApp (usado em assuntos que não são vendas: dados pessoais, reembolso).
export const waDireto = (msg: string) =>
  `https://wa.me/${EMPRESA.whatsapp}?text=${encodeURIComponent(msg)}`;

// Link de contato comercial: passa pela página /whatsapp, que registra o contato
// (Google Ads / Analytics) e abre a conversa na hora.
export const waLink = (msg: string) => `/whatsapp?m=${encodeURIComponent(msg)}`;
