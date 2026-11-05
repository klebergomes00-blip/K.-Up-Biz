// src/config/cidades.ts — Páginas da região (com conteúdo local próprio)
// e a lista de capitais da página de atendimento nacional.

export interface Cidade {
  slug: string;
  nome: string;
  uf: string;
  description: string;
  lead: string;
  contexto: string;                 // parágrafo próprio da cidade
  dicas: { t: string; d: string }[]; // dicas locais de Google/anúncios
  faq: { q: string; a: string }[];
}

export const CIDADES: Cidade[] = [
  {
    slug: 'brasilia',
    nome: 'Brasília',
    uf: 'DF',
    description: 'Criação de sites, Google Meu Negócio e tráfego pago para empresas de Brasília e do DF. Atendimento online, direto com quem faz o projeto.',
    lead: 'Sites, Perfil da Empresa no Google e anúncios para empresas do Plano Piloto e das demais regiões administrativas do DF, com atendimento online.',
    contexto: 'O Distrito Federal é dividido em regiões administrativas, e boa parte das buscas locais usa o nome da região: “dentista na Asa Sul”, “advogado em Taguatinga”, “academia em Águas Claras”. Um site e um perfil pensados para o DF levam isso em conta desde o começo.',
    dicas: [
      { t: 'Fale a língua das regiões', d: 'Mencione no site as regiões administrativas que você realmente atende (ex.: Asa Norte, Sudoeste, Guará). É assim que o seu cliente pesquisa.' },
      { t: 'Área de atendimento no Google', d: 'Se você atende no local do cliente, configure a área de atendimento do Perfil da Empresa com as regiões do DF onde de fato atua.' },
      { t: 'Anúncios por raio ou região', d: 'No Google Ads, segmentar por regiões próximas costuma concentrar a verba em quem pode virar cliente, em vez de espalhar pelo DF inteiro.' }
    ],
    faq: [
      { q: 'Vocês atendem empresas de Brasília?', a: 'Sim. O atendimento é online, por WhatsApp e videochamada, do primeiro contato à entrega.' },
      { q: 'Vale citar as regiões administrativas no site?', a: 'Sim, quando você realmente atende nelas. Muitas buscas no DF usam o nome da região, e não só “Brasília”.' },
      { q: 'O site ajuda a aparecer no Google Maps no DF?', a: 'O Maps depende principalmente do Perfil da Empresa no Google. O site reforça as informações do perfil e aumenta a confiança de quem pesquisa.' }
    ]
  },
  {
    slug: 'formosa',
    nome: 'Formosa',
    uf: 'GO',
    description: 'Criação de sites, Google Meu Negócio e tráfego pago para empresas de Formosa – GO. Atendimento online, direto com quem faz o projeto.',
    lead: 'Sites, Perfil da Empresa no Google e anúncios para empresas de Formosa – GO e região, com atendimento online.',
    contexto: 'Existem outras cidades com “Formosa” no nome em diferentes estados. Para o Google e para os clientes, deixar claro que a empresa é de Formosa, em Goiás, evita confusão nas buscas e nos mapas.',
    dicas: [
      { t: 'Use sempre “Formosa – GO”', d: 'No site, no Perfil da Empresa e nos anúncios, informe a cidade com o estado. Isso ajuda o Google a associar sua empresa ao lugar certo.' },
      { t: 'Clientes da região', d: 'Se você atende cidades vizinhas, cite-as no site e no perfil, desde que realmente atenda nelas.' },
      { t: 'Anúncios com região definida', d: 'Defina no Google Ads a cidade e o entorno que você atende, para não pagar por cliques de outras “Formosas”.' }
    ],
    faq: [
      { q: 'Vocês atendem empresas de Formosa?', a: 'Sim. O atendimento é online, por WhatsApp e videochamada, do primeiro contato à entrega.' },
      { q: 'Por que colocar o estado junto com o nome da cidade?', a: 'Porque há outras cidades com “Formosa” no nome no Brasil. Informar “Formosa – GO” deixa claro para o Google e para o cliente onde você está.' },
      { q: 'Uma empresa de Formosa pode atender clientes do DF?', a: 'Pode, e o site e o perfil podem deixar isso claro, desde que você realmente atenda nessas regiões.' }
    ]
  },
  {
    slug: 'unai',
    nome: 'Unaí',
    uf: 'MG',
    description: 'Criação de sites, Google Meu Negócio e tráfego pago para empresas de Unaí – MG. Atendimento online, direto com quem faz o projeto.',
    lead: 'Sites, Perfil da Empresa no Google e anúncios para empresas de Unaí – MG e região, com atendimento online.',
    contexto: 'Unaí é um polo do agronegócio no noroeste de Minas, e muitas empresas da cidade atendem produtores rurais além do público urbano. Um bom site separa esses públicos e fala com cada um do jeito certo.',
    dicas: [
      { t: 'Páginas para o produtor rural', d: 'Se sua empresa atende o agro (energia solar, máquinas, consultoria, veterinária), crie páginas específicas para esse público.' },
      { t: 'Cidade e estado', d: 'Use “Unaí – MG” no site e no perfil para o Google associar sua empresa à região certa.' },
      { t: 'Anúncios por região', d: 'Segmente os anúncios para Unaí e as cidades vizinhas que você atende, concentrando a verba em quem pode virar cliente.' }
    ],
    faq: [
      { q: 'Vocês atendem empresas de Unaí?', a: 'Sim. O atendimento é online, por WhatsApp e videochamada, do primeiro contato à entrega.' },
      { q: 'Vale ter uma página só para o agronegócio?', a: 'Sim, se você atende produtores rurais. As dúvidas e o vocabulário desse público são diferentes do cliente urbano.' },
      { q: 'O site precisa ter o endereço da empresa?', a: 'Se você recebe clientes no local, sim. Endereço igual no site e no Perfil da Empresa no Google reforça a confiança.' }
    ]
  },
  {
    slug: 'cabeceiras',
    nome: 'Cabeceiras',
    uf: 'GO',
    description: 'Criação de sites, Google Meu Negócio e tráfego pago em Cabeceiras – GO, cidade da K. Up Biz. Atendimento direto com quem faz o projeto.',
    lead: 'A K. Up Biz é de Cabeceiras – GO. Daqui, cria sites, cuida do Perfil da Empresa no Google e gerencia anúncios para empresas da cidade e de todo o Brasil.',
    contexto: 'Em cidades menores, poucas empresas cuidam bem da presença no Google. Isso é uma oportunidade: um Perfil da Empresa completo, com fotos reais e avaliações, e um site simples e bem feito já fazem o negócio se destacar.',
    dicas: [
      { t: 'Comece pelo Perfil da Empresa no Google', d: 'Em cidades pequenas, um perfil completo e verificado costuma aparecer rápido nas buscas locais.' },
      { t: 'Atenda a região', d: 'Se você atende clientes de cidades vizinhas, mencione essas cidades no site e no perfil, desde que realmente atenda nelas.' },
      { t: 'Anúncios com verba enxuta', d: 'Com público menor, campanhas locais podem começar com verba pequena e ser ajustadas conforme os resultados.' }
    ],
    faq: [
      { q: 'A K. Up Biz é de Cabeceiras?', a: 'Sim, a K. Up Biz fica em Cabeceiras – GO e atende empresas da cidade e de todo o Brasil.' },
      { q: 'Empresa de cidade pequena precisa de site?', a: 'Precisa de presença no Google. Para muitos negócios, um Perfil da Empresa bem feito e uma landing page já resolvem.' },
      { q: 'Como conseguir avaliações no Google?', a: 'Pedindo aos clientes reais, logo depois do atendimento, com o link direto do perfil. Nunca em troca de desconto.' }
    ]
  }
];

export const cidadeUrl = (c: Cidade) => `/criacao-de-sites-em-${c.slug}`;

export const CAPITAIS = [
  'Aracaju (SE)', 'Belém (PA)', 'Belo Horizonte (MG)', 'Boa Vista (RR)', 'Brasília (DF)', 'Campo Grande (MS)',
  'Cuiabá (MT)', 'Curitiba (PR)', 'Florianópolis (SC)', 'Fortaleza (CE)', 'Goiânia (GO)', 'João Pessoa (PB)',
  'Macapá (AP)', 'Maceió (AL)', 'Manaus (AM)', 'Natal (RN)', 'Palmas (TO)', 'Porto Alegre (RS)',
  'Porto Velho (RO)', 'Recife (PE)', 'Rio Branco (AC)', 'Rio de Janeiro (RJ)', 'Salvador (BA)', 'São Luís (MA)',
  'São Paulo (SP)', 'Teresina (PI)', 'Vitória (ES)'
];
