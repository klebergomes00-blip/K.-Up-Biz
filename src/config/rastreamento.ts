// src/config/rastreamento.ts — Ferramentas de medição e anúncios.
//
// Enquanto todos os IDs estiverem vazios, o site NÃO carrega nenhum rastreador
// e o banner de cookies NÃO aparece (não há cookies não essenciais).
//
// Quando for anunciar, preencha o ID da ferramenta correspondente:
// o banner passa a aparecer e o script só é carregado depois que o
// visitante aceitar a categoria correspondente.

export const RASTREAMENTO = {
  // Google Analytics 4 — formato "G-XXXXXXXXXX" (categoria: medição)
  googleAnalytics: '',
  // Tag de conversão do Google Ads — formato "AW-XXXXXXXXX" (categoria: marketing)
  googleAds: '',
  // Pixel da Meta (Facebook/Instagram) — apenas números (categoria: marketing)
  metaPixel: ''
};

export const rastreamentoAtivo = Object.values(RASTREAMENTO).some((v) => v.trim() !== '');
