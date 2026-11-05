// src/config/guias.ts — Guias que respondem às perguntas mais buscadas
// (formato pensado para o Google e para respostas de IA: resposta rápida no topo,
// seções com subtítulos claros, perguntas frequentes e autor identificado).

export interface Guia {
  slug: string;
  titulo: string;          // H1 e título da página
  title: string;           // <title>
  description: string;
  resumo: string;          // resposta rápida (GEO)
  publicado: string;       // AAAA-MM-DD
  corpo: string;           // HTML do artigo
  faq: { q: string; a: string }[];
  relacionados: { href: string; nome: string }[];
}

export const GUIAS: Guia[] = [
  {
    slug: 'quanto-custa-um-site',
    titulo: 'Quanto custa um site profissional em 2026?',
    title: 'Quanto custa um site em 2026? O que define o preço | K. Up Biz',
    description: 'Entenda o que define o preço de um site profissional em 2026: tipo de site, número de páginas, textos, design, funcionalidades e custos anuais.',
    resumo: 'Não existe um preço único. O valor de um site depende do tipo (landing page, site institucional ou loja virtual), do número de páginas, de quem produz textos e fotos, do nível de personalização do design e das funcionalidades. Além do projeto, há custos recorrentes: domínio (anual), hospedagem e, se você quiser, manutenção.',
    publicado: '2026-11-05',
    corpo: `
<h2>O que define o preço de um site</h2>
<p>Dois sites que parecem iguais podem ter preços muito diferentes. O que muda é o trabalho por trás de cada um. Estes são os fatores que mais pesam:</p>
<ul>
  <li><strong>Tipo de site:</strong> uma landing page (página única) é mais simples que um site institucional com várias páginas, que por sua vez é mais simples que uma loja virtual.</li>
  <li><strong>Número de páginas:</strong> cada página de serviço, de especialidade ou de produto precisa de estrutura, texto e revisão.</li>
  <li><strong>Textos e fotos:</strong> se você já tem os textos e boas fotos, o trabalho é menor. Se o profissional precisa escrever e organizar o conteúdo, o projeto cresce.</li>
  <li><strong>Design:</strong> um modelo pronto adaptado à sua marca custa menos que um design criado do zero, com animações e identidade própria.</li>
  <li><strong>Funcionalidades:</strong> agendamento, área do cliente, integração com sistemas, catálogo ou pagamento online aumentam o escopo.</li>
  <li><strong>Prazo:</strong> projetos urgentes exigem mais dedicação no mesmo período.</li>
</ul>

<h2>Tipos de site e para quem cada um serve</h2>
<div class="sv-table-wrap"><table class="sv-table">
  <thead><tr><th>Tipo</th><th>Para quem</th><th>Complexidade</th></tr></thead>
  <tbody>
    <tr><td>Landing page</td><td>Quem quer divulgar um serviço ou receber contatos de anúncios</td><td>Menor</td></tr>
    <tr><td>Site institucional</td><td>Empresas e profissionais que precisam apresentar vários serviços</td><td>Média</td></tr>
    <tr><td>Site com conteúdo (blog/guias)</td><td>Quem quer aparecer em mais buscas no Google ao longo do tempo</td><td>Média a alta</td></tr>
    <tr><td>Loja virtual</td><td>Quem vende produtos com pagamento online</td><td>Alta</td></tr>
  </tbody>
</table></div>

<h2>Custos que continuam depois que o site fica pronto</h2>
<ul>
  <li><strong>Domínio:</strong> o endereço do site (ex.: suaempresa.com.br). Domínios .com.br são registrados no Registro.br e renovados todo ano.</li>
  <li><strong>Hospedagem:</strong> onde o site fica no ar. Sites estáticos e rápidos podem usar hospedagens de custo baixo; sistemas mais pesados exigem planos maiores.</li>
  <li><strong>Manutenção:</strong> atualizações de conteúdo, novas páginas e ajustes. Pode ser contratada por mês ou sob demanda.</li>
</ul>

<h2>Barato que sai caro: o que evitar</h2>
<p>Um site lento no celular, sem domínio próprio ou com botões que não funcionam afasta clientes. Antes de comparar só o preço, confira se o orçamento inclui:</p>
<ul>
  <li>versão para celular bem feita (a maioria das visitas vem do celular);</li>
  <li>domínio próprio em seu nome;</li>
  <li>estrutura básica para o Google: títulos, descrições e páginas que podem ser encontradas;</li>
  <li>botão de WhatsApp ou contato visível em todas as páginas;</li>
  <li>quem será o dono do domínio e dos acessos ao final do projeto.</li>
</ul>

<h2>Como pedir um orçamento certeiro</h2>
<p>Quanto mais claro o pedido, mais justo o orçamento. Antes de pedir, separe:</p>
<ol>
  <li>o objetivo do site (receber contatos, apresentar serviços, vender);</li>
  <li>a lista de páginas que você imagina;</li>
  <li>o que você já tem pronto: logo, textos, fotos, domínio;</li>
  <li>dois ou três sites de referência de que você gosta;</li>
  <li>o prazo desejado.</li>
</ol>
<p>Na K. Up Biz, o orçamento é feito depois de uma conversa pelo WhatsApp, justamente porque cada projeto tem um escopo diferente. Veja como funciona a <a href="/criacao-de-sites">criação de sites</a>.</p>
`,
    faq: [
      { q: 'Existe site grátis?', a: 'Existem plataformas com planos gratuitos, mas normalmente sem domínio próprio e com limitações de design e desempenho. Para uma empresa, o domínio próprio e um site rápido transmitem muito mais confiança.' },
      { q: 'Site feito do zero é sempre melhor?', a: 'Não necessariamente. Um modelo bem adaptado à sua marca pode atender muito bem e ser entregue mais rápido. O design do zero faz sentido quando a marca precisa se diferenciar mais.' },
      { q: 'Quanto tempo leva para fazer um site?', a: 'Depende do escopo e da entrega dos materiais (textos, fotos, logo). Uma landing page é mais rápida que um site com várias páginas. O prazo é definido na proposta.' }
    ],
    relacionados: [
      { href: '/criacao-de-sites', nome: 'Criação de sites' },
      { href: '/guias/landing-page-ou-site', nome: 'Landing page ou site?' },
      { href: '/guias/site-ou-instagram', nome: 'Site ou só Instagram?' }
    ]
  },
  {
    slug: 'site-ou-instagram',
    titulo: 'Site ou só Instagram: o que minha empresa precisa?',
    title: 'Site ou só Instagram? Qual a empresa precisa ter | K. Up Biz',
    description: 'Instagram é ótimo para relacionamento; o site é o que aparece no Google e pertence a você. Veja as diferenças e quando ter os dois.',
    resumo: 'O ideal é ter os dois, com papéis diferentes. O Instagram cria relacionamento com quem já te segue; o site aparece para quem pesquisa no Google, organiza todas as informações em um só lugar e pertence a você, sem depender do algoritmo de uma rede social.',
    publicado: '2026-11-05',
    corpo: `
<h2>Para que serve o Instagram</h2>
<p>O Instagram é excelente para mostrar o dia a dia, criar proximidade e manter a marca na lembrança de quem já te segue. O problema é que ele depende do algoritmo: um post pode ser visto por muitas pessoas hoje e por poucas amanhã.</p>
<p>Outro ponto: quem não te conhece raramente procura um serviço pesquisando dentro do Instagram. Quando alguém precisa de um dentista, de um advogado ou de uma marcenaria, a busca costuma começar no Google.</p>

<h2>Para que serve o site</h2>
<ul>
  <li><strong>Aparecer no Google</strong> para quem está procurando o que você oferece, inclusive quem ainda não te conhece.</li>
  <li><strong>Organizar as informações:</strong> serviços, preços ou faixas de preço, perguntas frequentes, localização e contato, tudo em um só lugar.</li>
  <li><strong>Ser seu:</strong> o domínio e o conteúdo pertencem à empresa. Se uma rede social mudar as regras ou a conta tiver problema, o site continua no ar.</li>
  <li><strong>Funcionar com anúncios:</strong> campanhas no Google levam para páginas específicas, que convertem melhor que um perfil genérico.</li>
</ul>

<h2>Comparação rápida</h2>
<div class="sv-table-wrap"><table class="sv-table">
  <thead><tr><th></th><th>Instagram</th><th>Site</th></tr></thead>
  <tbody>
    <tr><td>Aparece no Google para quem pesquisa o serviço</td><td>Raramente</td><td>Sim</td></tr>
    <tr><td>Depende de algoritmo</td><td>Sim</td><td>Não</td></tr>
    <tr><td>Organiza muitas informações</td><td>Limitado</td><td>Sim</td></tr>
    <tr><td>Relacionamento e dia a dia</td><td>Excelente</td><td>Limitado</td></tr>
    <tr><td>Pertence à empresa</td><td>Não (é da plataforma)</td><td>Sim</td></tr>
  </tbody>
</table></div>

<h2>Como usar os dois juntos</h2>
<ol>
  <li>Coloque o link do site na bio do Instagram.</li>
  <li>Use os posts para despertar interesse e o site para explicar e converter.</li>
  <li>Ligue o site ao Perfil da Empresa no Google, que aparece nas buscas e no Maps.</li>
  <li>Use o WhatsApp como canal de conversa nos dois.</li>
</ol>
<p>Quer entender como fica um site para o seu tipo de negócio? Veja os <a href="/segmentos">sites por segmento</a>.</p>
`,
    faq: [
      { q: 'Linktree substitui um site?', a: 'Não. Uma página de links ajuda a organizar os perfis, mas não aparece no Google para buscas por serviço e não explica o que você faz.' },
      { q: 'Uma empresa pequena precisa de site?', a: 'Precisa de um lugar próprio e confiável na internet. Para muitos negócios pequenos, uma landing page bem feita já resolve.' },
      { q: 'Posso começar só com o Perfil da Empresa no Google?', a: 'É um ótimo começo para negócios locais. O site complementa o perfil com detalhes que não cabem nele.' }
    ],
    relacionados: [
      { href: '/criacao-de-sites', nome: 'Criação de sites' },
      { href: '/guias/como-aparecer-no-google-maps', nome: 'Como aparecer no Google Maps' },
      { href: '/guias/quanto-custa-um-site', nome: 'Quanto custa um site' }
    ]
  },
  {
    slug: 'landing-page-ou-site',
    titulo: 'Landing page ou site: qual escolher?',
    title: 'Landing page ou site institucional? Qual escolher | K. Up Biz',
    description: 'Landing page é uma página única com um objetivo; site institucional apresenta a empresa inteira. Veja quando usar cada um e quando ter os dois.',
    resumo: 'Escolha uma landing page quando o objetivo é um só, como divulgar um serviço ou receber contatos de anúncios. Escolha um site institucional quando precisa apresentar vários serviços e aparecer em mais buscas no Google. Muitas empresas usam os dois: o site como base e landing pages para campanhas.',
    publicado: '2026-11-05',
    corpo: `
<h2>O que é uma landing page</h2>
<p>Landing page é uma página única, focada em um objetivo: fazer a pessoa pedir um orçamento, chamar no WhatsApp ou se inscrever. Ela tem poucas distrações, um texto direto e um botão de ação repetido ao longo da página.</p>

<h2>O que é um site institucional</h2>
<p>Um site institucional apresenta a empresa como um todo: quem é, quais serviços oferece, para quem, onde atende e como entrar em contato. Ele tem várias páginas, o que permite aparecer no Google para buscas diferentes.</p>

<h2>Quando escolher cada um</h2>
<div class="sv-table-wrap"><table class="sv-table">
  <thead><tr><th>Situação</th><th>Melhor opção</th></tr></thead>
  <tbody>
    <tr><td>Vou anunciar um serviço específico no Google ou no Instagram</td><td>Landing page</td></tr>
    <tr><td>Preciso de presença online rápida e simples</td><td>Landing page</td></tr>
    <tr><td>Ofereço vários serviços ou especialidades</td><td>Site institucional</td></tr>
    <tr><td>Quero aparecer em várias buscas no Google ao longo do tempo</td><td>Site institucional</td></tr>
    <tr><td>Já tenho site e vou lançar uma campanha</td><td>Landing page dentro do site</td></tr>
  </tbody>
</table></div>

<h2>O que uma boa landing page precisa ter</h2>
<ul>
  <li>Título que diz exatamente o que você oferece e para quem;</li>
  <li>benefícios claros, não só características;</li>
  <li>provas: fotos reais, projetos, avaliações;</li>
  <li>respostas às principais dúvidas;</li>
  <li>um único botão de ação, repetido em pontos estratégicos;</li>
  <li>carregamento rápido no celular, porque cada segundo a mais afasta visitantes de anúncios.</li>
</ul>

<h2>E se eu quiser os dois?</h2>
<p>É a combinação mais comum. O site institucional é a base que aparece no Google; as landing pages ficam dentro do mesmo domínio e servem para campanhas de <a href="/gestao-de-trafego-pago">tráfego pago</a>. Veja a <a href="/criacao-de-sites">criação de sites e landing pages</a>.</p>
`,
    faq: [
      { q: 'Landing page aparece no Google?', a: 'Pode aparecer, mas como tem uma página só, aparece para menos buscas que um site com várias páginas. Ela brilha mesmo em campanhas de anúncios.' },
      { q: 'Posso transformar a landing page em site depois?', a: 'Sim. É comum começar com uma landing page e ampliar para um site com mais páginas, mantendo o mesmo domínio.' },
      { q: 'Preciso de uma landing page para cada anúncio?', a: 'Não para cada anúncio, mas de preferência uma para cada serviço ou oferta anunciada, para a mensagem do anúncio bater com a página.' }
    ],
    relacionados: [
      { href: '/criacao-de-sites', nome: 'Criação de sites e landing pages' },
      { href: '/gestao-de-trafego-pago', nome: 'Gestão de tráfego pago' },
      { href: '/guias/quanto-custa-um-site', nome: 'Quanto custa um site' }
    ]
  },
  {
    slug: 'como-aparecer-no-google-maps',
    titulo: 'Como aparecer no Google Maps: passo a passo',
    title: 'Como aparecer no Google Maps: passo a passo | K. Up Biz',
    description: 'Passo a passo para colocar sua empresa no Google Maps com o Perfil da Empresa no Google: cadastro, verificação, categoria, fotos e avaliações.',
    resumo: 'Para aparecer no Google Maps, a empresa precisa de um Perfil da Empresa no Google verificado, com categoria correta, informações completas e atualizadas, fotos reais e avaliações de clientes. A posição depende principalmente da relevância para a busca, da distância de quem pesquisa e da reputação da empresa.',
    publicado: '2026-11-05',
    corpo: `
<h2>1. Confira se sua empresa pode ter um perfil</h2>
<p>O Google aceita no Perfil da Empresa negócios que têm contato presencial com os clientes no horário informado, seja recebendo no endereço, seja indo até o cliente. Negócios que atendem somente online não estão entre os aceitos pelas diretrizes do Google.</p>

<h2>2. Crie e verifique o perfil</h2>
<p>O cadastro é feito em google.com/business, com a conta Google da empresa. A verificação pode ser por vídeo, telefone, e-mail ou outro método que o Google indicar. Sem verificação, o perfil não aparece de forma completa.</p>

<h2>3. Escolha a categoria certa</h2>
<p>A categoria principal é um dos sinais mais importantes. Escolha a que descreve melhor o seu negócio (ex.: “Dentista”, e não “Clínica de saúde”) e use categorias secundárias para os serviços complementares.</p>

<h2>4. Preencha tudo, com informações iguais às do site</h2>
<ul>
  <li>nome exatamente igual ao da marca, sem palavras-chave extras (isso é contra as regras);</li>
  <li>endereço ou área de atendimento;</li>
  <li>telefone, WhatsApp e site;</li>
  <li>horários, incluindo feriados;</li>
  <li>serviços e descrição.</li>
</ul>

<h2>5. Fotos reais</h2>
<p>Fachada (quando há atendimento no local), ambiente interno, equipe e trabalhos realizados. Fotos reais e recentes transmitem confiança e mantêm o perfil ativo.</p>

<h2>6. Avaliações</h2>
<p>Peça avaliações aos clientes reais logo depois do atendimento, com o link direto do perfil, e responda todas, positivas e negativas. Nunca ofereça desconto em troca de avaliação nem peça a quem não foi cliente: isso viola as regras e pode derrubar o perfil.</p>

<h2>7. Mantenha o perfil vivo</h2>
<p>Publique atualizações, adicione fotos novas e atualize horários especiais. Um perfil cuidado sinaliza ao Google e aos clientes que a empresa está ativa.</p>

<h2>Por que um concorrente aparece antes?</h2>
<p>O Google considera principalmente <strong>relevância</strong> (o quanto o perfil combina com a busca), <strong>distância</strong> (de quem pesquisa até a empresa) e <strong>destaque</strong> (avaliações, reputação e presença na internet, incluindo o site). Não dá para controlar a distância, mas dá para melhorar muito a relevância e o destaque.</p>
<p>Quer ajuda com isso? Veja a <a href="/google-meu-negocio">otimização do Google Meu Negócio</a>.</p>
`,
    faq: [
      { q: 'Google Meu Negócio é a mesma coisa que Perfil da Empresa no Google?', a: 'Sim. Google Meu Negócio era o nome antigo; hoje o Google chama de Perfil da Empresa no Google.' },
      { q: 'É possível pagar para ficar em primeiro no Maps?', a: 'A posição orgânica não é vendida. Existem anúncios que aparecem em destaque no Maps, mas eles são identificados como anúncio.' },
      { q: 'Posso esconder meu endereço?', a: 'Sim, se você atende os clientes no local deles. Nesse caso, o perfil mostra uma área de atendimento em vez do endereço.' }
    ],
    relacionados: [
      { href: '/google-meu-negocio', nome: 'Otimização do Google Meu Negócio' },
      { href: '/guias/por-que-minha-empresa-nao-aparece-no-google', nome: 'Por que minha empresa não aparece no Google' },
      { href: '/guias/site-ou-instagram', nome: 'Site ou só Instagram?' }
    ]
  },
  {
    slug: 'quanto-investir-em-trafego-pago',
    titulo: 'Quanto investir em tráfego pago para começar?',
    title: 'Quanto investir em tráfego pago para começar | K. Up Biz',
    description: 'Como definir o investimento inicial em Google Ads e anúncios no Instagram: verba x gestão, período de teste, custo por contato e quando aumentar.',
    resumo: 'Não existe um valor mínimo universal. O investimento deve ser suficiente para gerar dados em um período de teste (normalmente algumas semanas), considerando quanto custa um clique no seu mercado e quanto vale um cliente para você. Lembre que a verba de anúncios (paga ao Google ou à Meta) é separada do valor do serviço de gestão.',
    publicado: '2026-11-05',
    corpo: `
<h2>Verba de anúncio e gestão são coisas diferentes</h2>
<p>Em tráfego pago existem dois custos: a <strong>verba</strong>, paga diretamente às plataformas (Google, Meta), e a <strong>gestão</strong>, que é o trabalho de planejar, criar, acompanhar e ajustar as campanhas. Ao comparar orçamentos, confira sempre o que está incluso em cada um.</p>

<h2>Comece pelo valor de um cliente</h2>
<p>Antes de pensar na verba, responda:</p>
<ul>
  <li>Quanto vale, em média, um cliente novo para você (no primeiro serviço e ao longo do tempo)?</li>
  <li>De cada 10 pessoas que chamam no WhatsApp, quantas fecham?</li>
</ul>
<p>Com isso, você descobre quanto pode pagar por um contato e ainda ter lucro. Esse número é a sua referência para avaliar se a campanha está funcionando.</p>

<h2>O que influencia o custo</h2>
<ul>
  <li><strong>Concorrência:</strong> mercados disputados (advocacia, saúde, imóveis) costumam ter cliques mais caros.</li>
  <li><strong>Região:</strong> anunciar para o Brasil inteiro espalha a verba; uma região menor concentra o investimento.</li>
  <li><strong>Qualidade da página:</strong> uma página rápida e relevante ao anúncio melhora o desempenho.</li>
  <li><strong>Segmentação e palavras-chave:</strong> termos mais específicos costumam trazer contatos mais qualificados.</li>
</ul>

<h2>Como montar o período de teste</h2>
<ol>
  <li>Defina um objetivo único: contatos no WhatsApp, ligações ou pedidos de orçamento.</li>
  <li>Configure a medição antes de começar (conversões no Google Ads e no Analytics).</li>
  <li>Escolha uma verba diária que você consiga manter por algumas semanas sem aperto.</li>
  <li>Evite mexer na campanha nos primeiros dias, enquanto a plataforma aprende.</li>
  <li>Depois, avalie o custo por contato e a taxa de fechamento, e só então decida aumentar, manter ou ajustar.</li>
</ol>

<h2>Google ou Instagram?</h2>
<p>O Google alcança quem já está procurando o serviço (alta intenção). O Instagram e o Facebook apresentam a sua empresa para quem tem o perfil do seu cliente, mesmo sem estar procurando agora. Para muitos negócios locais, começar pelo Google traz contatos mais rápidos; a Meta ajuda a construir demanda.</p>
<p>Veja como funciona a <a href="/gestao-de-trafego-pago">gestão de tráfego pago</a>.</p>
`,
    faq: [
      { q: 'Existe resultado garantido em tráfego pago?', a: 'Não. Nenhum profissional sério garante resultado. O que existe é método: medir, testar e ajustar com base nos dados.' },
      { q: 'Posso pausar os anúncios quando quiser?', a: 'Sim. As campanhas podem ser pausadas a qualquer momento nas plataformas.' },
      { q: 'Preciso de site para anunciar?', a: 'Não obrigatoriamente, mas uma página rápida e específica para o anúncio costuma melhorar muito os resultados e permite medir os contatos.' }
    ],
    relacionados: [
      { href: '/gestao-de-trafego-pago', nome: 'Gestão de tráfego pago' },
      { href: '/guias/landing-page-ou-site', nome: 'Landing page ou site?' },
      { href: '/guias/quanto-custa-um-site', nome: 'Quanto custa um site' }
    ]
  },
  {
    slug: 'por-que-minha-empresa-nao-aparece-no-google',
    titulo: 'Por que minha empresa não aparece no Google?',
    title: 'Por que minha empresa não aparece no Google? | K. Up Biz',
    description: 'As causas mais comuns para uma empresa não aparecer no Google e no Maps, e o que fazer: perfil não verificado, site não indexado, categoria errada e mais.',
    resumo: 'Os motivos mais comuns são: não ter Perfil da Empresa no Google (ou ele não estar verificado), categoria ou informações incorretas, poucas avaliações, site inexistente ou não indexado e páginas que não falam do serviço que as pessoas pesquisam. A maioria tem solução com ajustes no perfil e no site.',
    publicado: '2026-11-05',
    corpo: `
<h2>Primeiro: o que você pesquisou?</h2>
<p>Pesquisar o nome da sua empresa e pesquisar o seu serviço são coisas diferentes. Aparecer pelo nome é o básico; aparecer quando alguém pesquisa o serviço (ex.: “dentista em Formosa”) depende de relevância, distância e reputação.</p>

<h2>Causas no Perfil da Empresa no Google</h2>
<ul>
  <li><strong>Perfil inexistente ou não verificado:</strong> sem verificação, o perfil não aparece completo.</li>
  <li><strong>Categoria errada:</strong> uma categoria genérica faz o perfil não aparecer para buscas específicas.</li>
  <li><strong>Informações incompletas ou diferentes do site:</strong> horários, telefone e endereço inconsistentes reduzem a confiança.</li>
  <li><strong>Poucas avaliações:</strong> concorrentes com mais avaliações recentes tendem a ter mais destaque.</li>
  <li><strong>Perfil suspenso:</strong> acontece quando há violação das diretrizes, como palavras-chave no nome.</li>
</ul>

<h2>Causas no site</h2>
<ul>
  <li><strong>Site não indexado:</strong> o Google ainda não encontrou ou não incluiu as páginas. Dá para conferir no Google Search Console.</li>
  <li><strong>Nenhuma página sobre o serviço:</strong> se o site não tem uma página falando de “implante dentário”, dificilmente aparecerá nessa busca.</li>
  <li><strong>Site lento ou ruim no celular:</strong> prejudica a experiência e o desempenho.</li>
  <li><strong>Bloqueios técnicos:</strong> configurações que impedem a indexação (como “noindex” esquecido).</li>
</ul>

<h2>Como verificar rapidamente</h2>
<ol>
  <li>Pesquise no Google <code>site:seudominio.com.br</code> para ver quais páginas estão indexadas.</li>
  <li>Abra o seu perfil no Google Maps e confira se aparece como verificado e com as informações certas.</li>
  <li>Cadastre o site no Google Search Console e envie o sitemap.</li>
  <li>Compare seu perfil com o dos concorrentes que aparecem: categoria, fotos e avaliações.</li>
</ol>

<h2>Quanto tempo leva para aparecer?</h2>
<p>Depois de corrigir os problemas, o Google precisa rastrear e reavaliar o site e o perfil. Isso pode levar de dias a algumas semanas. Ninguém pode garantir uma posição específica.</p>
<p>Se quiser uma análise do seu caso, veja a <a href="/google-meu-negocio">otimização do Google Meu Negócio</a> e a <a href="/criacao-de-sites">criação de sites</a>.</p>
`,
    faq: [
      { q: 'Pagar anúncio ajuda a aparecer no orgânico?', a: 'Não. Os anúncios aparecem em espaços identificados como anúncio, mas não melhoram a posição orgânica.' },
      { q: 'Meu site é novo. É normal não aparecer?', a: 'Sim, sites novos levam um tempo para serem rastreados e indexados. Cadastrar o site no Search Console e enviar o sitemap ajuda o Google a encontrá-lo.' },
      { q: 'Trocar de site faz perder posição?', a: 'Pode fazer, se os endereços das páginas mudarem sem redirecionamento. Com redirecionamentos corretos, o impacto é minimizado.' }
    ],
    relacionados: [
      { href: '/guias/como-aparecer-no-google-maps', nome: 'Como aparecer no Google Maps' },
      { href: '/google-meu-negocio', nome: 'Otimização do Google Meu Negócio' },
      { href: '/criacao-de-sites', nome: 'Criação de sites' }
    ]
  }
];

export const guiaUrl = (g: Guia) => `/guias/${g.slug}`;
