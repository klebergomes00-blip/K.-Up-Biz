// src/config/imagens.ts — Versões das imagens do portfólio (AVIF + WebP, 800px e 1584px).
// O navegador escolhe sozinho o formato mais leve que suporta e o tamanho certo para a tela.
export const portfolioSrcset = (key: string) => ({
  avif: `/imagens/portfolio/${key}-800.avif 800w, /imagens/portfolio/${key}.avif 1584w`,
  webp: `/imagens/portfolio/${key}-800.webp 800w, /imagens/portfolio/${key}.webp 1584w`,
  src: `/imagens/portfolio/${key}.webp`
});
