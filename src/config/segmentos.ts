// src/config/segmentos.ts — Páginas "Sites para ..." (uma por segmento).
// Cada segmento tem conteúdo próprio: dores, o que o site precisa ter,
// regras de publicidade do conselho (quando houver) e perguntas do público.

export interface Segmento {
  slug: string;            // usado em /sites-para-{slug}
  nome: string;            // nome do público (título da página)
  curto: string;           // forma curta, minúscula, para frases
  grupo: 'saude' | 'profissionais' | 'negocios';
  description: string;     // meta description (até ~155 caracteres)
  lead: string;
  dores: string[];         // o que costuma dar errado hoje
  secoes: { t: string; d: string }[]; // o que o site desse segmento precisa ter
  regras?: string;         // publicidade profissional
  google: string;          // dica de Google / anúncios específica do segmento
  faq: { q: string; a: string }[];
  caseKey?: string;        // projeto real do portfólio
  whatsapp: string;
}

export const GRUPOS = {
  saude: 'Saúde',
  profissionais: 'Profissionais liberais',
  negocios: 'Negócios locais'
} as const;

const REGRA_GERAL = (conselho: string) =>
  `O site mostra o seu registro profissional e segue as normas de publicidade do ${conselho}: informação clara, sem promessa de resultado e sem sensacionalismo. A validação final dos textos é sempre sua.`;

export const SEGMENTOS: Segmento[] = [
  // ------------------------------------------------------------------ SAÚDE
  {
    slug: 'dentistas',
    nome: 'Dentistas e clínicas odontológicas',
    curto: 'dentistas',
    grupo: 'saude',
    description: 'Site para dentista e clínica odontológica: tratamentos explicados, equipe com CRO, agendamento pelo WhatsApp e regras do CFO respeitadas.',
    lead: 'Um site que explica cada tratamento em linguagem simples, mostra a equipe e o consultório e leva o paciente direto para o agendamento no WhatsApp.',
    dores: [
      'Pacientes perguntam no WhatsApp o que já poderia estar explicado no site.',
      'O consultório depende só do Instagram, que não aparece quando alguém pesquisa “dentista perto de mim”.',
      'Tratamentos de maior valor, como implantes e alinhadores, não têm uma página própria que tire as dúvidas.'
    ],
    secoes: [
      { t: 'Uma página para cada tratamento', d: 'Implante, ortodontia, clareamento, lentes, endodontia: cada um com indicação, etapas e perguntas comuns.' },
      { t: 'Equipe e CRO', d: 'Apresentação de cada profissional com especialidade e número de registro, o que transmite confiança.' },
      { t: 'Consultório e estrutura', d: 'Fotos reais do espaço e dos equipamentos, endereço, estacionamento e acessibilidade.' },
      { t: 'Agendamento rápido', d: 'Botão de WhatsApp com a mensagem já escrita, por tratamento, em todas as páginas.' },
      { t: 'Convênios e formas de pagamento', d: 'Lista clara do que é aceito, reduzindo perguntas repetidas.' }
    ],
    regras: 'A publicidade odontológica segue a Resolução CFO nº 196/2019, que define o que pode ser divulgado, inclusive em que condições usar imagens de antes e depois. O site é montado respeitando essas regras e mostra o CRO do responsável técnico; a validação final dos textos é sempre sua.',
    google: 'Para clínica odontológica, o Perfil da Empresa no Google com categoria correta (ex.: Dentista, Clínica odontológica) e avaliações de pacientes costuma ser a principal porta de entrada nas buscas “perto de mim”. O site complementa o perfil com os detalhes de cada tratamento.',
    faq: [
      { q: 'Posso mostrar fotos de antes e depois no site da clínica?', a: 'A Resolução CFO nº 196/2019 trata desse tema e estabelece condições para a divulgação. O site é preparado para seguir essas regras, e a decisão sobre quais casos publicar é sua, com autorização do paciente.' },
      { q: 'O site pode ter agendamento online?', a: 'Sim. O mais comum é o agendamento pelo WhatsApp, com a mensagem já preenchida com o tratamento de interesse. Se a clínica usa um sistema de agenda online, o site pode levar até ele.' },
      { q: 'Vale fazer uma página para cada tratamento?', a: 'Sim. Quem pesquisa “implante dentário” quer informação sobre implante, não sobre a clínica inteira. Páginas específicas respondem melhor e ajudam a aparecer nessas buscas.' }
    ],
    whatsapp: 'Olá, Kleber! Tenho um consultório odontológico e quero conversar sobre um site.'
  },
  {
    slug: 'oftalmologistas',
    nome: 'Oftalmologistas e clínicas de olhos',
    curto: 'oftalmologistas',
    grupo: 'saude',
    description: 'Site para oftalmologista e clínica de olhos: consultas, exames e cirurgias explicados, CRM e RQE, agendamento e regras do CFM.',
    lead: 'Exames, consultas e cirurgias explicados com clareza, para o paciente chegar à clínica sabendo o que esperar e agendar sem precisar ligar.',
    dores: [
      'Pacientes não sabem a diferença entre os exames e ligam só para perguntar.',
      'Cirurgias como catarata e refrativa geram muitas dúvidas que o site não responde.',
      'Informações de convênio e preparo para exames ficam espalhadas em mensagens.'
    ],
    secoes: [
      { t: 'Exames e preparo', d: 'Mapeamento de retina, topografia, campo visual: o que é, para que serve e como se preparar.' },
      { t: 'Cirurgias', d: 'Páginas para catarata, cirurgia refrativa e outras, com etapas, recuperação e perguntas frequentes.' },
      { t: 'Médicos com CRM e RQE', d: 'Formação, especialidade e registro de cada oftalmologista.' },
      { t: 'Convênios e unidades', d: 'Convênios aceitos, endereços, horários e como chegar.' },
      { t: 'Agendamento', d: 'WhatsApp com mensagem pronta para consulta, exame ou avaliação cirúrgica.' }
    ],
    regras: 'A publicidade médica segue a Resolução CFM nº 2.336/2023, que define o que pode ser divulgado e em que condições. O site mostra CRM e RQE dos médicos e é montado respeitando essas regras; a validação final dos textos é sempre sua.',
    google: 'Buscas como “oftalmologista perto de mim” e “exame de vista” têm forte intenção local: o Perfil da Empresa no Google bem configurado, somado a uma página por exame no site, cobre as duas pontas.',
    faq: [
      { q: 'O site precisa mostrar o CRM e o RQE?', a: 'Sim, a identificação do médico com registro é parte das regras de publicidade médica e também aumenta a confiança do paciente.' },
      { q: 'Dá para explicar o preparo de cada exame no site?', a: 'Sim, e é uma das partes mais úteis: o paciente chega preparado e a recepção responde menos perguntas repetidas.' },
      { q: 'O site pode divulgar valores de cirurgia?', a: 'A forma de divulgar preços e condições segue as regras do CFM. Na prática, a maioria das clínicas prefere informar que o valor é passado após a avaliação.' }
    ],
    whatsapp: 'Olá, Kleber! Tenho uma clínica de oftalmologia e quero conversar sobre um site.'
  },
  {
    slug: 'clinicas-medicas',
    nome: 'Clínicas médicas',
    curto: 'clínicas médicas',
    grupo: 'saude',
    description: 'Site para clínica médica: especialidades, corpo clínico com CRM, convênios e agendamento pelo WhatsApp, seguindo a Resolução CFM 2.336/2023.',
    lead: 'Um site que organiza especialidades, médicos e convênios em um só lugar e facilita o agendamento para o paciente certo, no médico certo.',
    dores: [
      'A clínica tem várias especialidades, mas o paciente não encontra qual médico procurar.',
      'A recepção vive respondendo convênio, horário e endereço.',
      'Cada médico divulga por conta própria e a marca da clínica fica fraca.'
    ],
    secoes: [
      { t: 'Especialidades', d: 'Uma página por especialidade, com os médicos que atendem e o que é tratado.' },
      { t: 'Corpo clínico', d: 'Perfil de cada médico com CRM, RQE e formação.' },
      { t: 'Convênios e exames', d: 'O que é atendido por convênio e por particular, e os exames realizados na clínica.' },
      { t: 'Agendamento por especialidade', d: 'Botões de WhatsApp que já informam a especialidade desejada.' },
      { t: 'Localização', d: 'Endereço, mapa, estacionamento e horários de funcionamento.' }
    ],
    regras: 'A publicidade médica segue a Resolução CFM nº 2.336/2023. O site identifica o diretor técnico e os médicos com CRM e é montado respeitando essas regras; a validação final dos textos é sempre sua.',
    google: 'Clínicas com várias especialidades se beneficiam de páginas separadas: quem pesquisa “cardiologista” e quem pesquisa “dermatologista” encontra a página certa, em vez de cair na página inicial.',
    faq: [
      { q: 'Cada médico pode ter sua própria página?', a: 'Sim, e é recomendado: o paciente conhece o profissional antes da consulta e o Google entende melhor quem atende o quê.' },
      { q: 'O site pode mostrar os convênios aceitos?', a: 'Sim. Uma lista atualizada de convênios é uma das informações mais procuradas e reduz ligações para a recepção.' },
      { q: 'Quem valida o conteúdo médico do site?', a: 'Você e o corpo clínico. Eu estruturo e escrevo os textos de apresentação, e as informações técnicas são sempre revisadas pelos médicos.' }
    ],
    whatsapp: 'Olá, Kleber! Tenho uma clínica médica e quero conversar sobre um site.'
  },
  {
    slug: 'clinicas-de-estetica',
    nome: 'Clínicas de estética',
    curto: 'clínicas de estética',
    grupo: 'saude',
    description: 'Site para clínica de estética: procedimentos explicados, ambiente, profissionais e agendamento pelo WhatsApp. Veja um projeto real.',
    lead: 'Um site elegante, que transmite cuidado e confiança, explica cada procedimento e transforma a visita em agendamento.',
    dores: [
      'O Instagram mostra fotos, mas não explica procedimentos, cuidados e contraindicações.',
      'Clientes comparam clínicas e escolhem a que parece mais profissional.',
      'Perguntas sobre valores e pacotes tomam tempo no WhatsApp.'
    ],
    secoes: [
      { t: 'Procedimentos', d: 'Página para cada procedimento: indicação, como é feito, cuidados e perguntas comuns.' },
      { t: 'Ambiente e equipe', d: 'Fotos do espaço e apresentação dos profissionais, com formação e registro.' },
      { t: 'Protocolos e pacotes', d: 'Explicação de como funcionam as sessões e os pacotes, sem promessas de resultado.' },
      { t: 'Agendamento', d: 'WhatsApp com a mensagem pronta para avaliação.' },
      { t: 'Identidade visual', d: 'Design alinhado à marca da clínica, com o refinamento que o público espera.' }
    ],
    regras: 'Procedimentos realizados por médicos seguem a Resolução CFM nº 2.336/2023; os realizados por outros profissionais seguem as regras dos respectivos conselhos. O site evita promessas de resultado e mostra quem é o responsável técnico; a validação final dos textos é sempre sua.',
    google: 'No segmento de estética, a busca costuma ser por procedimento e cidade (ex.: “harmonização facial em Brasília”). Uma página por procedimento ajuda a aparecer nessas buscas e nos anúncios do Google.',
    faq: [
      { q: 'Vocês já fizeram site para clínica de estética?', a: 'Sim. O site da Level Up Aesthetics foi desenvolvido pela K. Up Biz e você pode vê-lo na seção de projetos.' },
      { q: 'Posso divulgar preços dos procedimentos?', a: 'Depende do profissional e do conselho que regula o procedimento. Muitas clínicas preferem informar valores após a avaliação.' },
      { q: 'O site pode ter uma galeria de resultados?', a: 'Só dentro das regras do conselho responsável pelo procedimento e com autorização dos pacientes. O site é preparado para isso quando permitido.' }
    ],
    caseKey: 'level-up-aesthetics',
    whatsapp: 'Olá, Kleber! Tenho uma clínica de estética e quero conversar sobre um site.'
  },
  {
    slug: 'psicologos',
    nome: 'Psicólogos',
    curto: 'psicólogos',
    grupo: 'saude',
    description: 'Site para psicólogo: abordagem, formação e CRP, atendimento online e presencial, primeiro contato discreto pelo WhatsApp.',
    lead: 'Um site acolhedor e discreto, que apresenta sua abordagem e formação e facilita o primeiro contato de quem está buscando ajuda.',
    dores: [
      'Quem procura terapia quer entender a abordagem antes de entrar em contato.',
      'Muitos pacientes buscam atendimento online e não sabem se você atende assim.',
      'Perfis em plataformas genéricas não mostram sua forma de trabalhar.'
    ],
    secoes: [
      { t: 'Sobre você e sua abordagem', d: 'Formação, CRP e uma explicação simples de como você trabalha.' },
      { t: 'Para quem é o atendimento', d: 'Públicos e demandas atendidas: adultos, adolescentes, casais.' },
      { t: 'Online e presencial', d: 'Como funciona cada modalidade, duração da sessão e frequência.' },
      { t: 'Primeiro contato', d: 'WhatsApp com mensagem neutra e discreta, sem exigir que a pessoa explique o motivo.' },
      { t: 'Conteúdo educativo', d: 'Textos que respondem dúvidas comuns sobre terapia, ótimos para aparecer no Google.' }
    ],
    regras: REGRA_GERAL('Conselho Federal de Psicologia (CFP)'),
    google: 'Para psicólogos que atendem online, o site permite alcançar pacientes de qualquer cidade; para o presencial, o Perfil da Empresa no Google ajuda quem procura “psicólogo perto de mim”.',
    faq: [
      { q: 'O site pode deixar claro que atendo online?', a: 'Sim, com uma seção explicando como funciona a sessão online, o que é necessário e como agendar.' },
      { q: 'O primeiro contato pode ser discreto?', a: 'Sim. A mensagem do WhatsApp é neutra, e a pessoa não precisa explicar o motivo da busca para entrar em contato.' },
      { q: 'Vale escrever artigos no site?', a: 'Sim. Textos que respondem dúvidas comuns sobre terapia ajudam o paciente e fazem o site aparecer em mais buscas.' }
    ],
    whatsapp: 'Olá, Kleber! Sou psicólogo(a) e quero conversar sobre um site.'
  },
  {
    slug: 'fisioterapeutas',
    nome: 'Fisioterapeutas e clínicas de fisioterapia',
    curto: 'fisioterapeutas',
    grupo: 'saude',
    description: 'Site para fisioterapeuta e clínica de fisioterapia: tratamentos, especialidades, CREFITO, convênios e agendamento pelo WhatsApp.',
    lead: 'Tratamentos e especialidades explicados de forma clara, para o paciente entender como a fisioterapia pode ajudar e agendar a avaliação.',
    dores: [
      'O paciente chega com indicação médica, mas não sabe qual clínica escolher.',
      'Especialidades como pilates clínico, RPG e fisioterapia esportiva não aparecem nas buscas.',
      'Dúvidas sobre convênio e atendimento domiciliar chegam todos os dias.'
    ],
    secoes: [
      { t: 'Especialidades', d: 'Ortopédica, esportiva, neurológica, pélvica, pilates clínico: cada uma com sua página.' },
      { t: 'Equipe com CREFITO', d: 'Formação e registro de cada fisioterapeuta.' },
      { t: 'Atendimento domiciliar', d: 'Se você atende em casa, uma seção explicando regiões e como funciona.' },
      { t: 'Convênios', d: 'O que é aceito e como funciona com pedido médico.' },
      { t: 'Agendamento de avaliação', d: 'WhatsApp com mensagem pronta para a primeira avaliação.' }
    ],
    regras: REGRA_GERAL('COFFITO'),
    google: 'Buscas por especialidade (“fisioterapia pélvica”, “pilates clínico”) costumam ter menos concorrência que “fisioterapia”, e páginas específicas ajudam a aparecer nelas.',
    faq: [
      { q: 'Vale ter uma página para cada especialidade?', a: 'Sim. Quem pesquisa por pilates clínico quer saber de pilates clínico. Páginas específicas respondem melhor e aparecem em mais buscas.' },
      { q: 'O site pode mostrar que atendo em domicílio?', a: 'Sim, com uma seção explicando bairros ou cidades atendidas, como agendar e o que é necessário.' },
      { q: 'Posso mostrar os convênios aceitos?', a: 'Sim, e é recomendado: é uma das perguntas mais comuns antes do agendamento.' }
    ],
    whatsapp: 'Olá, Kleber! Sou fisioterapeuta e quero conversar sobre um site.'
  },
  {
    slug: 'nutricionistas',
    nome: 'Nutricionistas',
    curto: 'nutricionistas',
    grupo: 'saude',
    description: 'Site para nutricionista: áreas de atuação, CRN, consulta online e presencial, acompanhamento e agendamento pelo WhatsApp.',
    lead: 'Um site que mostra sua área de atuação, como funciona o acompanhamento e facilita o agendamento, online ou presencial.',
    dores: [
      'Pacientes não entendem a diferença entre consulta e acompanhamento.',
      'Sua especialidade (esportiva, clínica, materno-infantil) se perde em perfis genéricos.',
      'Consultas online poderiam atender pessoas de outras cidades, mas ninguém sabe que você atende assim.'
    ],
    secoes: [
      { t: 'Áreas de atuação', d: 'Esportiva, clínica, emagrecimento, materno-infantil: o foco do seu trabalho.' },
      { t: 'Como funciona', d: 'Primeira consulta, retornos, plano alimentar e acompanhamento.' },
      { t: 'Online e presencial', d: 'Como é a consulta online e o que o paciente precisa ter em mãos.' },
      { t: 'Sobre você e CRN', d: 'Formação, especializações e registro.' },
      { t: 'Agendamento', d: 'WhatsApp com a mensagem pronta para a primeira consulta.' }
    ],
    regras: REGRA_GERAL('Conselho Federal de Nutricionistas (CFN)'),
    google: 'Nutricionistas que atendem online podem usar o site para alcançar todo o Brasil, enquanto o Perfil da Empresa no Google ajuda no atendimento presencial da região.',
    faq: [
      { q: 'O site ajuda a conseguir pacientes de outras cidades?', a: 'Sim, se você atende online. Com uma página explicando a consulta online, o site pode aparecer para pessoas de qualquer lugar.' },
      { q: 'Posso mostrar resultados de pacientes?', a: 'A divulgação de casos segue as regras do seu conselho. O site é montado sem promessas de resultado e você decide o que publicar.' },
      { q: 'O site pode ter receitas e dicas?', a: 'Sim. Conteúdo útil ajuda o site a aparecer no Google e mostra seu conhecimento.' }
    ],
    whatsapp: 'Olá, Kleber! Sou nutricionista e quero conversar sobre um site.'
  },
  {
    slug: 'veterinarios',
    nome: 'Clínicas veterinárias',
    curto: 'clínicas veterinárias',
    grupo: 'saude',
    description: 'Site para clínica veterinária e pet shop: serviços, plantão, equipe com CRMV, vacinas, exames e contato rápido pelo WhatsApp.',
    lead: 'Serviços, horários e plantão sempre claros, para o tutor encontrar a clínica rápido, inclusive nas horas de urgência.',
    dores: [
      'Em emergências, o tutor precisa saber na hora se a clínica atende e qual o telefone.',
      'Serviços como banho, tosa, vacinas e exames ficam misturados e confusos.',
      'A clínica não aparece quando alguém pesquisa “veterinário perto de mim”.'
    ],
    secoes: [
      { t: 'Plantão e horários em destaque', d: 'Se há atendimento 24 horas ou plantão, isso aparece no topo do site.' },
      { t: 'Serviços', d: 'Consultas, vacinas, cirurgias, exames, banho e tosa, cada um explicado.' },
      { t: 'Equipe com CRMV', d: 'Veterinários com registro e áreas de atuação.' },
      { t: 'Estrutura', d: 'Fotos reais da clínica, internação e centro cirúrgico.' },
      { t: 'Contato rápido', d: 'WhatsApp e telefone fáceis de tocar no celular.' }
    ],
    regras: REGRA_GERAL('Conselho Federal de Medicina Veterinária (CFMV)'),
    google: 'Para clínicas veterinárias, horário correto no Perfil da Empresa no Google é essencial: é a primeira coisa que o tutor confere em uma urgência.',
    faq: [
      { q: 'Dá para destacar o atendimento de emergência?', a: 'Sim. Plantão e telefone de emergência ficam visíveis logo no topo, inclusive no celular.' },
      { q: 'O site pode ter banho e tosa junto com a clínica?', a: 'Sim, separados em seções para o tutor encontrar rápido o que procura.' },
      { q: 'Como aparecer nas buscas por veterinário perto de mim?', a: 'O Perfil da Empresa no Google bem configurado é o principal fator. O site reforça as informações e mostra os serviços em detalhe.' }
    ],
    whatsapp: 'Olá, Kleber! Tenho uma clínica veterinária e quero conversar sobre um site.'
  },

  // ------------------------------------------------------- PROFISSIONAIS
  {
    slug: 'advogados',
    nome: 'Advogados e escritórios de advocacia',
    curto: 'advogados',
    grupo: 'profissionais',
    description: 'Site para advogado e escritório de advocacia: áreas de atuação, equipe com OAB e conteúdo informativo, seguindo o Provimento 205/2021.',
    lead: 'Um site sóbrio e informativo, que apresenta suas áreas de atuação e sua equipe e facilita o contato de quem precisa de orientação jurídica.',
    dores: [
      'Clientes chegam sem saber se o escritório atua na área do problema deles.',
      'Muitos escritórios têm só um cartão de visitas digital, sem conteúdo.',
      'O marketing jurídico tem regras próprias, e muitos sites as ignoram.'
    ],
    secoes: [
      { t: 'Áreas de atuação', d: 'Uma página por área: trabalhista, família, previdenciário, empresarial e outras.' },
      { t: 'Equipe com OAB', d: 'Apresentação dos advogados com número de inscrição e formação.' },
      { t: 'Conteúdo informativo', d: 'Artigos que explicam direitos e procedimentos, sem captar clientela de forma indevida.' },
      { t: 'Contato', d: 'WhatsApp e formulário com linguagem sóbria.' },
      { t: 'Escritório', d: 'Endereço, horários e atendimento online, se houver.' }
    ],
    regras: 'A publicidade na advocacia segue o Provimento nº 205/2021 do Conselho Federal da OAB, que admite o marketing jurídico de caráter informativo e veda a captação indevida e a mercantilização. O site é montado nesse tom, mostra a inscrição na OAB e evita promessas de resultado; a validação final dos textos é sempre sua.',
    google: 'Buscas por área e cidade (ex.: “advogado trabalhista em Brasília”) são as mais valiosas. Páginas separadas por área de atuação ajudam a aparecer nelas.',
    faq: [
      { q: 'Advogado pode ter site e anunciar no Google?', a: 'O Provimento nº 205/2021 admite o marketing jurídico informativo, inclusive na internet, com limites. O site e os anúncios são planejados para respeitar essas regras.' },
      { q: 'Vale ter uma página para cada área do direito?', a: 'Sim. Quem tem uma questão trabalhista procura advogado trabalhista. Páginas por área respondem melhor a essa busca.' },
      { q: 'Posso escrever artigos no site?', a: 'Sim. Conteúdo informativo é justamente o tipo de divulgação admitida e ajuda o site a aparecer no Google.' }
    ],
    whatsapp: 'Olá, Kleber! Sou advogado(a) e quero conversar sobre um site para o escritório.'
  },
  {
    slug: 'contadores',
    nome: 'Contadores e escritórios de contabilidade',
    curto: 'contadores',
    grupo: 'profissionais',
    description: 'Site para contador e escritório de contabilidade: serviços para MEI e empresas, abertura de empresa, CRC e contato pelo WhatsApp.',
    lead: 'Um site que explica seus serviços para MEI, pequenas empresas e profissionais liberais e transforma dúvidas em novos clientes.',
    dores: [
      'Empreendedores pesquisam “como abrir empresa” e encontram concorrentes, não você.',
      'Os serviços do escritório não estão claros para quem nunca contratou um contador.',
      'Muita gente troca de contador por falta de atendimento, e não sabe que você atende diferente.'
    ],
    secoes: [
      { t: 'Serviços por público', d: 'MEI, Simples Nacional, profissionais liberais, empresas maiores.' },
      { t: 'Abertura de empresa', d: 'Passo a passo e o que o cliente precisa providenciar.' },
      { t: 'Troca de contador', d: 'Como funciona a migração, sem complicação.' },
      { t: 'Equipe com CRC', d: 'Responsável técnico e registro.' },
      { t: 'Contato', d: 'WhatsApp com mensagem pronta por tipo de serviço.' }
    ],
    regras: REGRA_GERAL('Conselho Federal de Contabilidade (CFC)'),
    google: 'Conteúdos como “como abrir empresa” e “quando deixar de ser MEI” atraem empreendedores no momento exato em que precisam de um contador.',
    faq: [
      { q: 'O site ajuda a conseguir clientes de outras cidades?', a: 'Sim. Contabilidade pode ser feita online, e o site permite alcançar empresas de qualquer lugar do Brasil.' },
      { q: 'Vale ter conteúdo sobre MEI e abertura de empresa?', a: 'Sim. São buscas muito comuns de quem está prestes a contratar um contador.' },
      { q: 'Posso mostrar preços dos planos?', a: 'Pode, se fizer sentido para o seu escritório. Muitos preferem mostrar a partir de quanto e fechar o valor na conversa.' }
    ],
    whatsapp: 'Olá, Kleber! Tenho um escritório de contabilidade e quero conversar sobre um site.'
  },
  {
    slug: 'engenheiros',
    nome: 'Engenheiros e escritórios de engenharia',
    curto: 'engenheiros',
    grupo: 'profissionais',
    description: 'Site para engenheiro e escritório de engenharia: projetos, laudos, regularização, portfólio de obras, CREA e contato pelo WhatsApp.',
    lead: 'Um site técnico e confiável, que apresenta seus serviços, seu portfólio de projetos e facilita o pedido de orçamento.',
    dores: [
      'Clientes não sabem se precisam de projeto, laudo ou regularização.',
      'Os trabalhos entregues ficam só em pastas, sem um portfólio para mostrar.',
      'Orçamentos chegam sem as informações mínimas para avaliar o serviço.'
    ],
    secoes: [
      { t: 'Serviços', d: 'Projetos, laudos, ART, regularização de imóveis, acompanhamento de obras.' },
      { t: 'Portfólio de projetos', d: 'Trabalhos realizados com fotos, local e tipo de serviço.' },
      { t: 'Responsável técnico com CREA', d: 'Formação, especialidade e registro.' },
      { t: 'Pedido de orçamento', d: 'O que o cliente deve enviar para agilizar a proposta.' },
      { t: 'Contato', d: 'WhatsApp com mensagem pronta por tipo de serviço.' }
    ],
    regras: REGRA_GERAL('sistema CONFEA/CREA'),
    google: 'Serviços como “laudo técnico” e “regularização de imóvel” têm busca forte na cidade. Páginas específicas ajudam a aparecer para quem já sabe o que precisa.',
    faq: [
      { q: 'Posso mostrar obras e projetos que fiz?', a: 'Sim, com autorização dos clientes. Um portfólio organizado é um dos maiores argumentos de venda para engenharia.' },
      { q: 'O site pode explicar quando é preciso ART ou laudo?', a: 'Sim. Conteúdo que responde essas dúvidas atrai exatamente quem está prestes a contratar.' },
      { q: 'Dá para receber pedidos de orçamento pelo site?', a: 'Sim, pelo WhatsApp, com orientação do que enviar (fotos, plantas, endereço) para agilizar a proposta.' }
    ],
    whatsapp: 'Olá, Kleber! Sou engenheiro(a) e quero conversar sobre um site.'
  },
  {
    slug: 'arquitetos',
    nome: 'Arquitetos e escritórios de arquitetura',
    curto: 'arquitetos',
    grupo: 'profissionais',
    description: 'Site para arquiteto e escritório de arquitetura: portfólio visual de projetos, etapas do trabalho, CAU e contato pelo WhatsApp.',
    lead: 'Um portfólio à altura dos seus projetos, que mostra seu estilo, explica como você trabalha e leva o cliente ao primeiro contato.',
    dores: [
      'Projetos bonitos ficam escondidos em um feed que mistura tudo.',
      'Clientes não entendem as etapas e o que está incluso em um projeto.',
      'Sem site próprio, o escritório parece menor do que é.'
    ],
    secoes: [
      { t: 'Portfólio visual', d: 'Projetos organizados por tipo (residencial, comercial, interiores) com boas fotos.' },
      { t: 'Como funciona', d: 'Briefing, estudo preliminar, anteprojeto, executivo e acompanhamento.' },
      { t: 'Serviços', d: 'Arquitetura, interiores, reforma, consultoria.' },
      { t: 'Sobre o escritório e CAU', d: 'Formação, estilo e registro.' },
      { t: 'Contato', d: 'WhatsApp com mensagem pronta por tipo de projeto.' }
    ],
    regras: REGRA_GERAL('Conselho de Arquitetura e Urbanismo (CAU)'),
    google: 'Para arquitetura, imagens bem otimizadas e páginas por tipo de projeto ajudam o site a aparecer também na busca de imagens do Google.',
    faq: [
      { q: 'O site carrega rápido mesmo com muitas fotos?', a: 'Sim. As imagens são otimizadas em formatos modernos (WebP e AVIF) para manter a qualidade e a velocidade.' },
      { q: 'Posso atualizar o portfólio depois?', a: 'Sim. O site é preparado para receber novos projetos com facilidade.' },
      { q: 'Vale explicar as etapas do projeto no site?', a: 'Sim. Clientes que entendem o processo chegam mais preparados e valorizam mais o trabalho.' }
    ],
    whatsapp: 'Olá, Kleber! Sou arquiteto(a) e quero conversar sobre um site.'
  },
  {
    slug: 'corretores-de-imoveis',
    nome: 'Corretores de imóveis e imobiliárias',
    curto: 'corretores de imóveis',
    grupo: 'profissionais',
    description: 'Site para corretor de imóveis e imobiliária: imóveis em destaque, captação de proprietários, CRECI e contato pelo WhatsApp. Veja um projeto real.',
    lead: 'Um site que valoriza cada imóvel, transmite autoridade e leva interessados direto para a conversa no WhatsApp.',
    dores: [
      'Imóveis ficam perdidos entre portais e grupos, sem uma vitrine própria.',
      'Proprietários escolhem o corretor que parece mais profissional.',
      'Leads chegam sem saber qual imóvel queriam.'
    ],
    secoes: [
      { t: 'Imóveis em destaque', d: 'Fotos, características e localização de cada imóvel.' },
      { t: 'Captação de proprietários', d: 'Uma seção para quem quer vender ou alugar com você.' },
      { t: 'Sobre o corretor e CRECI', d: 'Experiência, região de atuação e registro.' },
      { t: 'WhatsApp por imóvel', d: 'A mensagem já informa qual imóvel interessou.' },
      { t: 'Regiões e bairros', d: 'Conteúdo sobre as regiões em que você atua.' }
    ],
    regras: REGRA_GERAL('sistema COFECI/CRECI'),
    google: 'Anúncios no Google e no Instagram levando para a página de cada imóvel costumam gerar contatos mais qualificados do que levar para a página inicial.',
    faq: [
      { q: 'Vocês já fizeram site para corretor?', a: 'Sim. O site do corretor Fernando Junior foi desenvolvido pela K. Up Biz e está na seção de projetos.' },
      { q: 'O site precisa estar ligado a um portal imobiliário?', a: 'Não necessariamente. O site pode ter seus próprios imóveis em destaque e levar o interessado direto para o seu WhatsApp.' },
      { q: 'Dá para anunciar um imóvel específico?', a: 'Sim. Cada imóvel pode ter sua página, ideal para usar em anúncios.' }
    ],
    caseKey: 'fernando-junior',
    whatsapp: 'Olá, Kleber! Sou corretor(a) de imóveis e quero conversar sobre um site.'
  },

  // ------------------------------------------------------------ NEGÓCIOS
  {
    slug: 'energia-solar',
    nome: 'Empresas de energia solar',
    curto: 'empresas de energia solar',
    grupo: 'negocios',
    description: 'Site para empresa de energia solar: como funciona, simulação de economia, projetos instalados e orçamento pelo WhatsApp.',
    lead: 'Um site que explica a energia solar sem complicação, mostra os projetos instalados e leva o cliente a pedir orçamento com a conta de luz em mãos.',
    dores: [
      'O cliente ainda tem dúvidas básicas sobre como funciona e quanto economiza.',
      'O mercado é concorrido e muitas empresas parecem iguais.',
      'Orçamentos chegam sem a informação essencial: o consumo de energia.'
    ],
    secoes: [
      { t: 'Como funciona', d: 'Placas, inversor, homologação e compensação na conta, em linguagem simples.' },
      { t: 'Para quem é', d: 'Residencial, comercial, rural e agronegócio.' },
      { t: 'Projetos instalados', d: 'Fotos e dados reais das instalações, com autorização dos clientes.' },
      { t: 'Pedido de orçamento', d: 'Orientação para enviar a conta de luz pelo WhatsApp.' },
      { t: 'Financiamento e garantia', d: 'Como funcionam as condições de pagamento e as garantias dos equipamentos.' }
    ],
    google: 'Energia solar tem forte busca por cidade e por público (“energia solar para fazenda”, “energia solar comercial”). Páginas específicas e anúncios bem segmentados geram orçamentos mais qualificados.',
    faq: [
      { q: 'O site pode ter um simulador de economia?', a: 'Sim, é possível incluir uma estimativa simples. O valor exato depende da análise do consumo, por isso o orçamento final vem pelo WhatsApp.' },
      { q: 'Vale mostrar as instalações feitas?', a: 'Sim. Fotos reais de projetos instalados são um dos maiores argumentos de confiança nesse mercado.' },
      { q: 'Dá para atender o agronegócio no mesmo site?', a: 'Sim, com uma página própria para o produtor rural, que tem dúvidas e necessidades diferentes.' }
    ],
    whatsapp: 'Olá, Kleber! Tenho uma empresa de energia solar e quero conversar sobre um site.'
  },
  {
    slug: 'marcenarias',
    nome: 'Marcenarias e móveis planejados',
    curto: 'marcenarias',
    grupo: 'negocios',
    description: 'Site para marcenaria e móveis planejados: portfólio de ambientes, materiais, etapas do projeto e orçamento pelo WhatsApp.',
    lead: 'Um portfólio que valoriza cada ambiente entregue e transforma a admiração pelo trabalho em pedido de orçamento.',
    dores: [
      'O trabalho é bonito, mas fica escondido em fotos soltas no celular.',
      'O cliente compara só preço porque não entende a diferença de material e acabamento.',
      'Pedidos de orçamento chegam sem medidas ou fotos do ambiente.'
    ],
    secoes: [
      { t: 'Portfólio por ambiente', d: 'Cozinhas, quartos, closets, home office, comércio.' },
      { t: 'Materiais e acabamentos', d: 'MDF, ferragens, acabamentos: o que faz diferença na durabilidade.' },
      { t: 'Como funciona', d: 'Medição, projeto, aprovação, produção e montagem.' },
      { t: 'Pedido de orçamento', d: 'Orientação do que enviar: medidas, fotos e referências.' },
      { t: 'Área de atendimento', d: 'Cidades onde a marcenaria entrega e monta.' }
    ],
    google: 'Buscas como “móveis planejados” e “marcenaria perto de mim” são locais: o Perfil da Empresa no Google com fotos dos trabalhos, somado ao portfólio do site, é a combinação mais forte.',
    faq: [
      { q: 'O site precisa de muitas fotos?', a: 'Quanto mais trabalhos reais, melhor. As imagens são otimizadas para o site continuar rápido.' },
      { q: 'Dá para receber pedidos de orçamento com medidas?', a: 'Sim. O site orienta o cliente a enviar medidas e fotos pelo WhatsApp, agilizando a proposta.' },
      { q: 'Vale explicar materiais no site?', a: 'Sim. Clientes que entendem a diferença entre materiais comparam qualidade, não só preço.' }
    ],
    whatsapp: 'Olá, Kleber! Tenho uma marcenaria e quero conversar sobre um site.'
  },
  {
    slug: 'restaurantes',
    nome: 'Restaurantes, lanchonetes e hamburguerias',
    curto: 'restaurantes',
    grupo: 'negocios',
    description: 'Site para restaurante e hamburgueria: cardápio digital, fotos que dão fome, horários, delivery e pedido pelo WhatsApp. Veja um projeto real.',
    lead: 'Um cardápio digital que dá vontade de pedir, com horários, localização e pedido pelo WhatsApp a um toque.',
    dores: [
      'O cardápio só existe em PDF ou em foto, difícil de ler no celular.',
      'Clientes perguntam horário e taxa de entrega o tempo todo.',
      'Aplicativos de entrega ficam com parte de cada pedido.'
    ],
    secoes: [
      { t: 'Cardápio digital', d: 'Pratos com fotos, descrição e preços, fácil de atualizar.' },
      { t: 'Pedido pelo WhatsApp', d: 'Botão de pedido direto, sem taxa de aplicativo.' },
      { t: 'Horários e delivery', d: 'Funcionamento, áreas de entrega e retirada.' },
      { t: 'Ambiente', d: 'Fotos do salão para quem quer ir pessoalmente.' },
      { t: 'Localização', d: 'Mapa e como chegar.' }
    ],
    google: 'Para restaurantes, o Perfil da Empresa no Google com horário certo, fotos e cardápio é decisivo. O site entra como cardápio completo e canal de pedido direto.',
    faq: [
      { q: 'Vocês já fizeram site para hamburgueria?', a: 'Sim. O site da Styvy Burguer foi desenvolvido pela K. Up Biz e você pode vê-lo na seção de projetos.' },
      { q: 'O cardápio é fácil de atualizar?', a: 'Sim. Preços e pratos podem ser alterados sem refazer o site.' },
      { q: 'Dá para receber pedidos sem aplicativo?', a: 'Sim, pelo WhatsApp, o que evita a comissão dos aplicativos de entrega.' }
    ],
    caseKey: 'styvy-burguer',
    whatsapp: 'Olá, Kleber! Tenho um restaurante/hamburgueria e quero conversar sobre um site.'
  },
  {
    slug: 'construtoras',
    nome: 'Construtoras e empresas de reforma',
    curto: 'construtoras',
    grupo: 'negocios',
    description: 'Site para construtora e empresa de reforma: obras entregues, serviços, etapas, garantias e orçamento pelo WhatsApp.',
    lead: 'Um site que mostra as obras entregues, explica como você trabalha e transmite a segurança que o cliente precisa para fechar.',
    dores: [
      'Contratar uma obra é uma decisão de risco, e o cliente quer provas de trabalho.',
      'O histórico de obras não está organizado em lugar nenhum.',
      'O cliente não entende etapas, prazos e o que está incluso.'
    ],
    secoes: [
      { t: 'Obras entregues', d: 'Fotos de antes, durante e depois, com tipo de obra e local.' },
      { t: 'Serviços', d: 'Construção, reforma, acabamento, projetos.' },
      { t: 'Como trabalhamos', d: 'Visita, orçamento, cronograma, execução e entrega.' },
      { t: 'Responsável técnico', d: 'Engenheiro ou arquiteto responsável, com registro.' },
      { t: 'Orçamento', d: 'WhatsApp com orientação do que enviar.' }
    ],
    google: 'Buscas como “reforma de apartamento” e “construtora em [cidade]” têm alto valor. Páginas por tipo de obra e um portfólio forte aumentam a confiança antes do primeiro contato.',
    faq: [
      { q: 'Vale mostrar fotos de obras em andamento?', a: 'Sim. Mostrar o processo transmite organização e cuidado, e não só o resultado final.' },
      { q: 'O site pode explicar prazos e etapas?', a: 'Sim. Um cliente que entende o processo confia mais e negocia melhor.' },
      { q: 'Dá para separar construção e reforma?', a: 'Sim, em páginas diferentes, porque são públicos e buscas diferentes.' }
    ],
    whatsapp: 'Olá, Kleber! Tenho uma construtora/empresa de reformas e quero conversar sobre um site.'
  },
  {
    slug: 'oficinas-mecanicas',
    nome: 'Oficinas mecânicas e centros automotivos',
    curto: 'oficinas mecânicas',
    grupo: 'negocios',
    description: 'Site para oficina mecânica e centro automotivo: serviços, marcas atendidas, estrutura, garantia e agendamento pelo WhatsApp.',
    lead: 'Um site que mostra seus serviços, sua estrutura e a confiança que o motorista procura antes de deixar o carro.',
    dores: [
      'O motorista tem receio de oficina e procura sinais de confiança antes de ir.',
      'Serviços especializados (injeção, câmbio, ar-condicionado) não aparecem nas buscas.',
      'Clientes ligam só para saber se a oficina atende a marca do carro.'
    ],
    secoes: [
      { t: 'Serviços', d: 'Revisão, freios, suspensão, injeção, câmbio, ar-condicionado, cada um explicado.' },
      { t: 'Marcas e veículos atendidos', d: 'Carros, utilitários, diesel: o que você atende.' },
      { t: 'Estrutura e equipamentos', d: 'Fotos reais da oficina e do scanner/diagnóstico.' },
      { t: 'Garantia', d: 'Como funciona a garantia dos serviços.' },
      { t: 'Agendamento', d: 'WhatsApp com a mensagem já informando o serviço.' }
    ],
    google: 'Oficinas dependem muito do Google Maps e das avaliações. O site reforça a confiança e permite anunciar serviços específicos, como “conserto de câmbio automático”.',
    faq: [
      { q: 'Vale ter páginas para cada serviço?', a: 'Sim. Quem pesquisa um serviço específico quer saber se você faz aquele serviço, e uma página própria responde isso.' },
      { q: 'Como aumentar as avaliações no Google?', a: 'Pedindo aos clientes satisfeitos logo após a entrega do carro, com o link direto de avaliação. Nunca em troca de desconto.' },
      { q: 'O site pode mostrar o orçamento antes?', a: 'Valores dependem do diagnóstico. O site orienta o cliente a agendar a avaliação pelo WhatsApp.' }
    ],
    whatsapp: 'Olá, Kleber! Tenho uma oficina mecânica e quero conversar sobre um site.'
  },
  {
    slug: 'academias',
    nome: 'Academias e estúdios de treino',
    curto: 'academias',
    grupo: 'negocios',
    description: 'Site para academia, estúdio de pilates e crossfit: modalidades, horários, planos, estrutura e aula experimental pelo WhatsApp.',
    lead: 'Um site com modalidades, horários e planos claros, que convida para uma aula experimental com um toque.',
    dores: [
      'Os horários mudam e o cliente não encontra a grade atualizada.',
      'Quem nunca treinou fica inseguro e não sabe por onde começar.',
      'Planos e valores geram dezenas de mensagens repetidas.'
    ],
    secoes: [
      { t: 'Modalidades', d: 'Musculação, funcional, pilates, lutas: cada uma com sua página.' },
      { t: 'Grade de horários', d: 'Horários fáceis de ver e de atualizar.' },
      { t: 'Planos', d: 'Opções de plano e o que está incluso.' },
      { t: 'Estrutura e equipe', d: 'Fotos reais do espaço e professores com CREF.' },
      { t: 'Aula experimental', d: 'WhatsApp com mensagem pronta para agendar.' }
    ],
    regras: REGRA_GERAL('sistema CONFEF/CREF'),
    google: 'Academias têm busca muito local e sazonal (início de ano, verão). Anúncios por modalidade e região próxima costumam ter bom retorno.',
    faq: [
      { q: 'Dá para atualizar a grade de horários facilmente?', a: 'Sim. A grade é preparada para ser alterada sem refazer o site.' },
      { q: 'Vale mostrar os preços dos planos?', a: 'Depende da estratégia da academia. Muitas mostram a partir de quanto e convidam para a aula experimental.' },
      { q: 'Cada modalidade precisa de uma página?', a: 'É o ideal. Quem procura pilates ou crossfit quer encontrar exatamente essa modalidade.' }
    ],
    whatsapp: 'Olá, Kleber! Tenho uma academia/estúdio e quero conversar sobre um site.'
  },
  {
    slug: 'saloes-e-barbearias',
    nome: 'Salões de beleza e barbearias',
    curto: 'salões e barbearias',
    grupo: 'negocios',
    description: 'Site para salão de beleza e barbearia: serviços e preços, profissionais, trabalhos realizados, horários e agendamento pelo WhatsApp.',
    lead: 'Serviços, profissionais e trabalhos em um só lugar, com agendamento pelo WhatsApp sem precisar ligar.',
    dores: [
      'O cliente quer ver trabalhos e preços antes de marcar.',
      'Agendamentos por mensagem tomam tempo durante o atendimento.',
      'O salão não aparece quando alguém pesquisa “barbearia perto de mim”.'
    ],
    secoes: [
      { t: 'Serviços e valores', d: 'Cortes, coloração, barba, tratamentos, com valores ou faixas de preço.' },
      { t: 'Profissionais', d: 'Cada profissional com especialidades e trabalhos.' },
      { t: 'Galeria de trabalhos', d: 'Fotos reais, organizadas por tipo de serviço.' },
      { t: 'Agendamento', d: 'WhatsApp ou link do sistema de agenda, se você usa um.' },
      { t: 'Horários e localização', d: 'Funcionamento, endereço e estacionamento.' }
    ],
    google: 'Para salões e barbearias, fotos recentes e avaliações no Perfil da Empresa no Google fazem muita diferença. O site amplia isso com a galeria e os serviços completos.',
    faq: [
      { q: 'O site pode ligar com meu sistema de agendamento?', a: 'Sim. Se você usa um aplicativo de agenda, o site leva o cliente até ele; se não, o agendamento é pelo WhatsApp.' },
      { q: 'Vale mostrar os preços?', a: 'Para salões e barbearias, mostrar valores ou faixas de preço costuma ajudar o cliente a decidir mais rápido.' },
      { q: 'Dá para ter uma galeria por profissional?', a: 'Sim, o que ajuda o cliente a escolher com quem quer agendar.' }
    ],
    whatsapp: 'Olá, Kleber! Tenho um salão/barbearia e quero conversar sobre um site.'
  }
];

export const segmento = (slug: string) => SEGMENTOS.find((s) => s.slug === slug);
export const segmentoUrl = (s: Segmento) => `/sites-para-${s.slug}`;
