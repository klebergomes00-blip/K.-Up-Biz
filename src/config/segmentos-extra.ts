// src/config/segmentos-extra.ts — Conteúdo aprofundado de cada segmento.
// Complementa segmentos.ts com textos que só fazem sentido para aquela área:
// como o cliente decide, as dúvidas que o site deve responder, os erros mais
// comuns e perguntas extras. Nada aqui usa números de mercado ou promessas.

export interface SegmentoExtra {
  decideTitulo: string;                    // título da seção "como o cliente decide"
  decide: string;                          // parágrafo próprio do segmento
  duvidas: { q: string; onde: string }[];  // dúvida do cliente → onde o site responde
  erros: { t: string; d: string }[];       // erros comuns nos sites do segmento
  nota: string;                            // observação técnica própria do segmento
  regras?: string;                         // texto próprio sobre o conselho (substitui o genérico)
  faq: { q: string; a: string }[];         // perguntas extras
}

export const SEGMENTOS_EXTRA: Record<string, SegmentoExtra> = {
  // ------------------------------------------------------------------ SAÚDE
  dentistas: {
    decideTitulo: 'Como o paciente escolhe um dentista',
    decide: 'Quem procura dentista quase sempre está com uma necessidade definida: uma dor, um dente quebrado, vontade de alinhar o sorriso ou de trocar uma prótese. Antes de marcar, a pessoa compara dois ou três consultórios pelo celular, olha as avaliações e tenta descobrir se aquele profissional faz o tratamento de que ela precisa. O site que responde isso em poucos segundos sai na frente.',
    duvidas: [
      { q: '“Esse dentista faz implante?”', onde: 'Página própria do tratamento, com indicação, etapas e tempo médio informado por você.' },
      { q: '“Atende criança?”', onde: 'Página de odontopediatria ou um bloco claro na página de tratamentos.' },
      { q: '“Aceita meu convênio?”', onde: 'Lista de convênios e formas de pagamento, fácil de achar no menu.' },
      { q: '“Tem horário à noite ou no sábado?”', onde: 'Horários no topo e no rodapé, iguais aos do Perfil da Empresa no Google.' }
    ],
    erros: [
      { t: 'Uma única página “Tratamentos”', d: 'Listar tudo em um parágrafo não ajuda quem pesquisou por um tratamento específico, nem o Google a entender o que a clínica faz.' },
      { t: 'Fotos de banco de imagens', d: 'Sorrisos genéricos passam menos confiança do que fotos reais da equipe e do consultório.' },
      { t: 'Telefone fixo como único contato', d: 'A maior parte dos pacientes prefere escrever no WhatsApp, inclusive fora do horário comercial.' }
    ],
    nota: 'No site da clínica odontológica, cada página de tratamento recebe título e descrição próprios para o Google, botão de WhatsApp com a mensagem daquele tratamento e imagens leves, que abrem rápido no 4G.',
    faq: [
      { q: 'Dá para ter uma página de urgência odontológica?', a: 'Sim. Se a clínica atende urgências, uma página direta com horário, endereço e botão de WhatsApp ajuda quem está com dor a decidir rápido.' },
      { q: 'O site pode apresentar mais de um dentista?', a: 'Pode. Cada profissional ganha um bloco ou uma página com especialidade e CRO, o que também ajuda quem pesquisa pelo nome do dentista.' }
    ]
  },

  oftalmologistas: {
    decideTitulo: 'Como o paciente escolhe um oftalmologista',
    decide: 'Na oftalmologia, a pessoa chega com perguntas bem práticas: se o exame pedido é feito ali, se precisa de acompanhante, se o convênio cobre e em qual unidade há vaga. Em cirurgias como catarata e refrativa, a decisão é mais demorada e muitas vezes envolve a família, que lê tudo com calma antes de ligar.',
    duvidas: [
      { q: '“Esse exame precisa dilatar a pupila?”', onde: 'Página de cada exame com preparo, duração e se é preciso ir acompanhado.' },
      { q: '“Como é a recuperação da cirurgia de catarata?”', onde: 'Página da cirurgia com etapas e cuidados, em texto revisado pelo médico.' },
      { q: '“Quem é o médico que vai me atender?”', onde: 'Corpo clínico com CRM, RQE e área de atuação de cada um.' },
      { q: '“Em qual unidade faço esse exame?”', onde: 'Página de unidades com endereço, mapa e o que é realizado em cada uma.' }
    ],
    erros: [
      { t: 'Não informar o preparo dos exames', d: 'O paciente chega sem acompanhante ou dirigindo, e o exame precisa ser remarcado.' },
      { t: 'Letras pequenas e pouco contraste', d: 'Boa parte do público tem dificuldade para enxergar; o site precisa ser confortável de ler.' },
      { t: 'Misturar clínica e ótica na mesma página', d: 'São buscas e intenções diferentes. Separar deixa cada assunto mais claro.' }
    ],
    nota: 'No site de oftalmologia, o cuidado com a leitura vem primeiro: fontes maiores, bom contraste e botões grandes, além de páginas separadas para exames, cirurgias e unidades.',
    faq: [
      { q: 'O site pode ter uma página para lentes de contato?', a: 'Sim. Adaptação de lentes costuma gerar muitas dúvidas e funciona bem como página própria, com as orientações definidas pelo médico.' },
      { q: 'Dá para o paciente escolher a unidade ao agendar?', a: 'Dá. O botão de WhatsApp pode levar uma mensagem diferente para cada unidade, o que organiza o atendimento da recepção.' }
    ]
  },

  'clinicas-medicas': {
    decideTitulo: 'Como o paciente escolhe uma clínica',
    decide: 'Em clínica com várias especialidades, o paciente raramente procura “a clínica”: ele procura um cardiologista, um pediatra ou um lugar que faça determinado exame. Depois confere se o convênio é aceito e qual o horário mais próximo. Por isso o site precisa funcionar bem para quem entra direto na página de uma especialidade, sem passar pela inicial.',
    duvidas: [
      { q: '“Tem pediatra nessa clínica?”', onde: 'Página de cada especialidade, com os médicos que atendem e os dias de atendimento.' },
      { q: '“Aceita meu plano?”', onde: 'Lista de convênios atualizada, com a observação de que a cobertura depende do plano.' },
      { q: '“Faz o exame aqui mesmo?”', onde: 'Página de exames, indicando quais são feitos na clínica.' },
      { q: '“Como chego e onde estaciono?”', onde: 'Localização com mapa, referências e informações de acesso.' }
    ],
    erros: [
      { t: 'Lista de médicos sem especialidade clara', d: 'O paciente não sabe o nome do médico; ele procura pela especialidade.' },
      { t: 'Convênios desatualizados', d: 'Gera ligações desnecessárias e frustração na recepção. A lista precisa ser fácil de alterar.' },
      { t: 'Um único botão “Agendar” para tudo', d: 'A recepção recebe mensagens sem contexto. O ideal é o botão já informar a especialidade.' }
    ],
    nota: 'No site da clínica médica, cada especialidade tem página e botão de agendamento próprios, o corpo clínico aparece com CRM e RQE e a lista de convênios fica em um lugar só, simples de atualizar.',
    faq: [
      { q: 'O site pode crescer quando entrar uma nova especialidade?', a: 'Sim. A estrutura já fica preparada para receber novas páginas de especialidade e novos médicos sem refazer o site.' },
      { q: 'Dá para divulgar check-ups e pacotes de exames?', a: 'Dá para apresentar o que está incluído e para quem é indicado. Valores e condições seguem o que a clínica decidir divulgar, dentro das regras do CFM.' }
    ]
  },

  'clinicas-de-estetica': {
    decideTitulo: 'Como a cliente escolhe uma clínica de estética',
    decide: 'Em estética, a decisão passa muito pela confiança e pela aparência do lugar. A cliente vê o procedimento no Instagram, mas antes de marcar quer saber quem aplica, como é o ambiente, quanto tempo leva e quais os cuidados depois. Um site bonito e organizado funciona como a recepção da clínica: mostra o padrão do atendimento antes da primeira visita.',
    duvidas: [
      { q: '“Quem faz esse procedimento?”', onde: 'Apresentação da equipe com formação e registro profissional de cada um.' },
      { q: '“Dói? Quanto tempo dura a sessão?”', onde: 'Página do procedimento com etapas, duração e cuidados, nas palavras do responsável.' },
      { q: '“Como é a clínica por dentro?”', onde: 'Fotos reais do ambiente e das salas de atendimento.' },
      { q: '“Tem pacote ou protocolo?”', onde: 'Página de protocolos, explicando o que cada um inclui.' }
    ],
    erros: [
      { t: 'Depender só do Instagram', d: 'O feed não organiza os procedimentos nem aparece quando alguém pesquisa no Google pelo tratamento.' },
      { t: 'Prometer resultado', d: 'Além de gerar expectativa irreal, pode contrariar as regras de publicidade do conselho do profissional.' },
      { t: 'Site lento por causa das fotos', d: 'Imagens pesadas fazem a cliente desistir antes de a página abrir.' }
    ],
    nota: 'No site da clínica de estética, a identidade visual é tratada como parte do serviço: cores, tipografia e fotos seguem o padrão da marca, e cada procedimento tem página e botão de agendamento próprios.',
    faq: [
      { q: 'O site pode ter uma página para cada procedimento?', a: 'Sim, e é o recomendado. Quem pesquisa por um procedimento específico quer chegar direto nas informações dele.' },
      { q: 'Dá para vender pacotes pelo site?', a: 'O mais comum é apresentar o pacote e fechar pelo WhatsApp, o que mantém o atendimento pessoal. Se você quiser pagamento online, avaliamos a melhor forma no seu caso.' }
    ]
  },

  psicologos: {
    decideTitulo: 'Como a pessoa escolhe um psicólogo',
    decide: 'Procurar terapia é uma decisão delicada, e muita gente pesquisa por semanas antes do primeiro contato. A pessoa quer saber se aquele profissional atende o tipo de questão que ela vive, como funciona a sessão, se é online e, principalmente, se vai se sentir à vontade. O texto do site precisa soar como você fala: acolhedor, direto e sem termos técnicos demais.',
    duvidas: [
      { q: '“Esse psicólogo atende ansiedade?”', onde: 'Página “Para quem é o atendimento”, escrita em linguagem simples.' },
      { q: '“Como funciona a primeira sessão?”', onde: 'Bloco explicando duração, frequência e o que esperar do primeiro encontro.' },
      { q: '“Atende online? Em qual plataforma?”', onde: 'Página de atendimento online, com as orientações práticas.' },
      { q: '“Qual é a abordagem?”', onde: 'Página “Sobre”, explicando sua linha de trabalho sem jargão.' }
    ],
    erros: [
      { t: 'Texto frio e acadêmico', d: 'Currículo extenso e termos técnicos afastam quem está fragilizado e só quer saber se pode ser ajudado.' },
      { t: 'Formulário longo no primeiro contato', d: 'Pedir muitos dados logo de início inibe. Um botão discreto de WhatsApp resolve.' },
      { t: 'Não dizer se atende online', d: 'Hoje é uma das primeiras coisas que a pessoa procura saber.' }
    ],
    nota: 'No site de psicologia, o tom dos textos e a discrição pesam mais do que efeitos visuais: páginas leves, contato simples e nenhuma coleta de informação sensível por formulário.',
    regras: 'A divulgação dos serviços de psicologia é orientada pelo Código de Ética Profissional do Psicólogo, do Conselho Federal de Psicologia. O site apresenta seu nome e seu número de CRP, não faz promessa de resultado e, por respeito ao sigilo, não usa depoimentos nem histórias de pacientes. A conferência final de cada texto é sempre sua.',
    faq: [
      { q: 'O site precisa mostrar meu CRP?', a: 'Sim. O número de registro aparece junto ao seu nome, o que identifica você como profissional habilitado e passa segurança a quem está procurando ajuda.' },
      { q: 'Posso ter páginas separadas para adultos, casais e adolescentes?', a: 'Pode, e ajuda bastante: cada público procura com palavras diferentes e quer se reconhecer no texto.' }
    ]
  },

  fisioterapeutas: {
    decideTitulo: 'Como o paciente escolhe um fisioterapeuta',
    decide: 'O paciente de fisioterapia costuma chegar com um encaminhamento médico ou com uma dor que não passa. Ele pesquisa pela condição (“fisioterapia para hérnia de disco”, “pilates para gestante”) e quer saber se a clínica trata aquilo, quantas sessões costuma levar segundo a avaliação e se atende pelo convênio ou em casa.',
    duvidas: [
      { q: '“Trata dor na coluna?”', onde: 'Página da especialidade (ortopédica, neurológica, pélvica, respiratória…).' },
      { q: '“Atende em casa?”', onde: 'Página de atendimento domiciliar, com as regiões atendidas.' },
      { q: '“Tem pilates?”', onde: 'Página própria do pilates, com horários e como funciona a aula experimental.' },
      { q: '“Como é a primeira avaliação?”', onde: 'Bloco explicando o que acontece na avaliação e o que levar.' }
    ],
    erros: [
      { t: 'Falar só “fisioterapia em geral”', d: 'Quem tem uma condição específica procura quem trabalha com ela.' },
      { t: 'Esconder a área de atendimento domiciliar', d: 'O paciente desiste se não descobre rápido se a clínica vai até o bairro dele.' },
      { t: 'Não mostrar o espaço', d: 'Fotos da sala e dos equipamentos ajudam a entender a estrutura antes da visita.' }
    ],
    nota: 'No site de fisioterapia, as especialidades viram páginas separadas e o botão de WhatsApp já informa se o interesse é em clínica, pilates ou atendimento domiciliar.',
    regras: 'A fisioterapia tem código de ética próprio, do COFFITO. Seguindo esse código, o site identifica quem atende com o número do CREFITO, descreve os tratamentos de forma informativa e não garante resultado nem número de sessões. Fotos de pacientes só entram com autorização, e os textos passam pela sua revisão.',
    faq: [
      { q: 'O site pode ter uma página só para pilates?', a: 'Sim. Pilates tem um público próprio, que muitas vezes não está em tratamento, e funciona melhor com página e chamada separadas.' },
      { q: 'Dá para explicar a diferença entre as especialidades?', a: 'Dá, e é um conteúdo que os pacientes valorizam: em poucas linhas, cada página explica para quem aquela especialidade é indicada.' }
    ]
  },

  nutricionistas: {
    decideTitulo: 'Como o paciente escolhe um nutricionista',
    decide: 'Quem procura nutricionista tem um objetivo em mente: emagrecer com saúde, ganhar massa, cuidar de uma condição clínica, alimentar melhor os filhos. A pessoa quer encontrar um profissional que trabalhe exatamente com esse objetivo e entender como é o acompanhamento, se há retorno, se o plano é individual e se dá para fazer tudo online.',
    duvidas: [
      { q: '“Atende nutrição esportiva?”', onde: 'Página de cada área de atuação: esportiva, clínica, materno-infantil, comportamental.' },
      { q: '“Como funciona a consulta online?”', onde: 'Página explicando as etapas, da anamnese ao retorno.' },
      { q: '“O plano alimentar é individual?”', onde: 'Bloco “Como funciona o acompanhamento”.' },
      { q: '“Quanto tempo dura o acompanhamento?”', onde: 'Explicação dos formatos de acompanhamento que você oferece.' }
    ],
    erros: [
      { t: 'Prometer perda de peso em prazo fixo', d: 'Cria expectativa irreal e não combina com a conduta profissional esperada.' },
      { t: 'Não separar as áreas de atuação', d: 'O atleta e a gestante procuram coisas diferentes e precisam se reconhecer no site.' },
      { t: 'Deixar o conteúdo só nas redes sociais', d: 'Receitas e orientações publicadas no site continuam sendo encontradas no Google por muito tempo.' }
    ],
    nota: 'No site de nutrição, cada área de atuação ganha página própria e o atendimento online é explicado passo a passo, o que permite receber pacientes de qualquer cidade.',
    regras: 'O Código de Ética e de Conduta do Nutricionista, do Conselho Federal de Nutricionistas, traz regras específicas para a divulgação do trabalho, inclusive sobre uso de imagens e promessa de resultado. O site exibe o seu CRN, e antes de publicar você confere cada texto e cada imagem com o que o código permite.',
    faq: [
      { q: 'Posso ter um blog de receitas no site?', a: 'Pode. Receitas e orientações práticas atraem visitas pelo Google e mostram o seu jeito de trabalhar antes da consulta.' },
      { q: 'O site pode explicar os planos de acompanhamento?', a: 'Sim. Explicar o que cada formato inclui (consulta, retorno, suporte) reduz dúvidas no WhatsApp. Divulgar ou não os valores é uma decisão sua.' }
    ]
  },

  veterinarios: {
    decideTitulo: 'Como o tutor escolhe uma clínica veterinária',
    decide: 'Na veterinária existem dois momentos bem diferentes. Na emergência, o tutor procura no celular quem está aberto agora e mais perto, e decide em segundos. Na rotina (vacinas, consultas, banho e tosa), ele compara com calma, olha as avaliações e a estrutura. O site precisa atender os dois: informação urgente no topo e detalhes para quem quer conhecer a clínica.',
    duvidas: [
      { q: '“Tem veterinário aberto agora?”', onde: 'Horário e plantão em destaque no topo, com botão de ligar e de WhatsApp.' },
      { q: '“Atende gato? E animais silvestres?”', onde: 'Página de serviços informando as espécies atendidas.' },
      { q: '“Faz exame e cirurgia no local?”', onde: 'Página de estrutura: internação, exames, centro cirúrgico.' },
      { q: '“Tem banho e tosa?”', onde: 'Página própria do pet shop ou da estética animal.' }
    ],
    erros: [
      { t: 'Esconder o horário de plantão', d: 'Em uma emergência, ninguém vai procurar essa informação no fim da página.' },
      { t: 'Horário diferente no site e no Google', d: 'O tutor chega e encontra a clínica fechada. As informações precisam ser as mesmas.' },
      { t: 'Não mostrar a equipe', d: 'Tutores confiam em quem conhecem; apresentar os veterinários com CRMV faz diferença.' }
    ],
    nota: 'No site da clínica veterinária, horário, plantão e botão de contato ficam fixos no topo em qualquer página, pensando em quem acessa do celular em um momento de urgência.',
    regras: 'A divulgação de serviços veterinários segue as normas do Conselho Federal de Medicina Veterinária. O site identifica a clínica e o responsável técnico com o número do CRMV, descreve consultas, exames e cirurgias sem prometer cura e deixa claro o que é atendimento clínico e o que é serviço de pet shop.',
    faq: [
      { q: 'O site pode ter uma página de vacinação?', a: 'Sim. O calendário de vacinas, definido pelo veterinário, é um dos conteúdos mais procurados por tutores de filhotes.' },
      { q: 'Dá para separar a clínica do pet shop no site?', a: 'Dá. Cada área fica com página, fotos e botão de contato próprios, sem confundir o tutor.' }
    ]
  },

  // ---------------------------------------------------------- PROFISSIONAIS
  advogados: {
    decideTitulo: 'Como o cliente escolhe um advogado',
    decide: 'Quem procura advogado está diante de um problema concreto: uma demissão, um divórcio, uma dívida, um benefício negado. A pessoa pesquisa pelo problema, não pelo nome do escritório, e lê com atenção para entender se aquele profissional atua naquela área. O site que explica o assunto com clareza, sem prometer resultado, é o que transmite seriedade.',
    duvidas: [
      { q: '“Esse escritório cuida de causa trabalhista?”', onde: 'Página de cada área de atuação, explicando os casos mais comuns.' },
      { q: '“Como funciona um inventário?”', onde: 'Artigos informativos escritos ou revisados por você.' },
      { q: '“Quem são os advogados?”', onde: 'Página da equipe com nome e número de inscrição na OAB.' },
      { q: '“Atende online ou só presencial?”', onde: 'Página de contato, informando as formas de atendimento.' }
    ],
    erros: [
      { t: 'Prometer resultado ou falar em “causa ganha”', d: 'Contraria as regras de publicidade da OAB e passa uma imagem pouco séria.' },
      { t: 'Listar todas as áreas em uma linha', d: 'Sem uma página por área, o site não aparece para quem pesquisa um assunto específico.' },
      { t: 'Linguagem jurídica demais', d: 'O cliente não é advogado. Quanto mais simples a explicação, mais confiança ela gera.' }
    ],
    nota: 'No site de advocacia, o tom é sóbrio e informativo: páginas por área de atuação, artigos de orientação e identificação dos profissionais com OAB, sem chamadas apelativas.',
    faq: [
      { q: 'O site pode ter um botão de WhatsApp?', a: 'Pode. O contato pelo WhatsApp é um canal de atendimento como outro qualquer; o cuidado está no conteúdo do site, que deve ser informativo e discreto.' },
      { q: 'Posso ter uma página para cada tipo de caso?', a: 'Sim. Páginas como “rescisão indireta” ou “pensão alimentícia”, com conteúdo explicativo, respondem exatamente o que o cliente pesquisou.' }
    ]
  },

  contadores: {
    decideTitulo: 'Como o empresário escolhe um contador',
    decide: 'O empresário procura contador em três situações: vai abrir uma empresa, está insatisfeito com o contador atual ou cresceu e precisa de mais suporte. Em todas elas ele quer saber o que está incluído no serviço, como é o atendimento no dia a dia e se o escritório entende do ramo dele. Clareza conta mais do que uma lista longa de serviços.',
    duvidas: [
      { q: '“Como abro um CNPJ?”', onde: 'Página de abertura de empresa, com o passo a passo e os documentos.' },
      { q: '“Vale sair do MEI?”', onde: 'Conteúdo explicativo, escrito pelo escritório, sobre a mudança de porte.' },
      { q: '“Como troco de contador?”', onde: 'Página explicando que a transição é feita pelo novo escritório.' },
      { q: '“Atende prestador de serviço? E comércio?”', onde: 'Páginas por tipo de cliente: MEI, prestadores, comércio, profissionais de saúde.' }
    ],
    erros: [
      { t: 'Lista de serviços sem explicação', d: '“Fiscal, contábil, pessoal” não diz nada para quem não é da área.' },
      { t: 'Não falar da troca de contador', d: 'Muitos empresários adiam a mudança por achar que é trabalhosa. Explicar o processo remove essa barreira.' },
      { t: 'Site sem conteúdo', d: 'Dúvidas sobre impostos e abertura de empresa são muito pesquisadas e trazem visitas qualificadas.' }
    ],
    nota: 'No site do escritório contábil, os serviços são organizados pelo tipo de cliente, e não pelo departamento interno, com um formulário simples para pedir proposta.',
    regras: 'O Código de Ética Profissional do Contador, do Conselho Federal de Contabilidade, trata da forma como os serviços contábeis podem ser divulgados. Por isso o site apresenta os serviços, a equipe com CRC e conteúdo de orientação, sem comparações com outros escritórios e sem promessas sobre economia de impostos.',
    faq: [
      { q: 'O site pode atender clientes de todo o Brasil?', a: 'Sim. Com atendimento digital, o site pode deixar claro que o escritório atende empresas de qualquer cidade.' },
      { q: 'Dá para ter uma área de dúvidas frequentes sobre impostos?', a: 'Dá, e é um dos conteúdos que mais ajudam: as respostas, escritas por você, tiram dúvidas e mostram o conhecimento do escritório.' }
    ]
  },

  engenheiros: {
    decideTitulo: 'Como o cliente contrata um engenheiro',
    decide: 'Na engenharia, o cliente geralmente chega com uma exigência: um laudo pedido pelo condomínio, um projeto para aprovar na prefeitura, uma regularização, uma obra que precisa de responsável técnico. Ele quer confirmar que o profissional é habilitado, ver trabalhos parecidos e pedir orçamento sem burocracia.',
    duvidas: [
      { q: '“Quem emite laudo de vistoria?”', onde: 'Página de laudos e vistorias, explicando quando são exigidos.' },
      { q: '“Preciso de projeto para reformar?”', onde: 'Página de projetos e regularização, com as situações mais comuns.' },
      { q: '“Esse engenheiro tem CREA?”', onde: 'Identificação do responsável técnico com número de registro.' },
      { q: '“Já fez obra parecida com a minha?”', onde: 'Portfólio organizado por tipo de serviço.' }
    ],
    erros: [
      { t: 'Explicar tudo em linguagem técnica', d: 'Síndicos e proprietários precisam entender o serviço para conseguir contratar.' },
      { t: 'Portfólio só com fotos, sem contexto', d: 'Uma linha dizendo o que foi feito em cada obra vale mais do que dez imagens soltas.' },
      { t: 'Pedido de orçamento sem informações', d: 'Sem saber tipo de serviço e cidade, o retorno ao cliente fica lento.' }
    ],
    nota: 'No site de engenharia, cada serviço técnico tem página própria e o pedido de orçamento já pergunta tipo de serviço, cidade e prazo, para você responder com mais agilidade.',
    regras: 'Serviços de engenharia exigem profissional habilitado no sistema Confea/Crea. O site identifica o responsável técnico com o número do CREA e, onde faz sentido, explica em que situações o serviço envolve Anotação de Responsabilidade Técnica (ART). Todas as informações técnicas são conferidas por você antes da publicação.',
    faq: [
      { q: 'O site pode atender empresas e pessoas físicas?', a: 'Pode. O ideal é separar as páginas: laudos e regularizações para condomínios e empresas, projetos e obras para proprietários.' },
      { q: 'Dá para ter páginas por especialidade?', a: 'Dá. Civil, elétrica, segurança do trabalho e outras áreas têm públicos e buscas diferentes, e funcionam melhor em páginas separadas.' }
    ]
  },

  arquitetos: {
    decideTitulo: 'Como o cliente escolhe um arquiteto',
    decide: 'Arquitetura se escolhe pelo olhar. O cliente salva referências, compara estilos e só entra em contato quando se identifica com o trabalho. Depois vêm as dúvidas práticas: o que está incluído no projeto, se o escritório acompanha a obra, se atende a cidade dele. O site precisa primeiro encantar com imagens e, em seguida, explicar o processo com clareza.',
    duvidas: [
      { q: '“Esse escritório faz projeto de interiores?”', onde: 'Página de serviços, separando arquitetura, interiores, reforma e consultoria.' },
      { q: '“O que está incluído no projeto?”', onde: 'Página “Como funciona”, com as entregas de cada etapa.' },
      { q: '“O arquiteto acompanha a obra?”', onde: 'Bloco sobre acompanhamento e gerenciamento de obra.' },
      { q: '“Tem projetos parecidos com o que eu quero?”', onde: 'Portfólio filtrado por tipo: residencial, comercial, interiores.' }
    ],
    erros: [
      { t: 'Portfólio sem organização', d: 'Misturar casa, loja e apartamento na mesma galeria dificulta para o cliente encontrar o que procura.' },
      { t: 'Fotos sem crédito e sem descrição', d: 'Cada projeto merece uma ficha curta: local, área, o que foi pedido e a solução adotada.' },
      { t: 'Imagens enormes que travam a página', d: 'O portfólio precisa impressionar sem demorar para abrir, principalmente no celular.' }
    ],
    nota: 'No site de arquitetura, o portfólio é o centro: cada projeto tem galeria em alta qualidade, ficha com as informações da obra e imagens preparadas para abrir rápido.',
    regras: 'O exercício da arquitetura é regulado pelo Conselho de Arquitetura e Urbanismo. O site traz o seu nome ou o do escritório com o número de registro no CAU, credita corretamente a autoria dos projetos e das fotografias e pode explicar em que momento entra o Registro de Responsabilidade Técnica (RRT). Os textos são validados por você.',
    faq: [
      { q: 'Cada projeto pode ter uma página própria?', a: 'Sim. Uma página por projeto, com fotos, ficha técnica e um texto curto, valoriza o trabalho e ajuda o site a aparecer na busca de imagens.' },
      { q: 'O site pode mostrar projetos em 3D além de obras prontas?', a: 'Pode. Imagens renderizadas mostram o seu estilo mesmo em projetos ainda não executados; basta identificar o que é imagem 3D e o que é foto.' }
    ]
  },

  'corretores-de-imoveis': {
    decideTitulo: 'Como o cliente escolhe um corretor',
    decide: 'No mercado imobiliário existem dois clientes: quem quer comprar ou alugar e o proprietário que quer vender. O comprador chega pelo imóvel, não pelo corretor, e quer fotos boas, localização e resposta rápida. O proprietário quer saber como o imóvel dele será divulgado. Um bom site conversa com os dois.',
    duvidas: [
      { q: '“Tem casa à venda nesse bairro?”', onde: 'Páginas por região ou bairro, com os imóveis disponíveis.' },
      { q: '“Quanto custa e o que tem perto?”', onde: 'Página do imóvel com as informações combinadas com o proprietário.' },
      { q: '“Como anuncio meu imóvel com você?”', onde: 'Página de captação, explicando como funciona a divulgação.' },
      { q: '“Esse corretor é credenciado?”', onde: 'Página “Sobre”, com o número do CRECI.' }
    ],
    erros: [
      { t: 'Depender só dos portais', d: 'Nos portais, seu imóvel aparece ao lado dos concorrentes; no site, o contato é só seu.' },
      { t: 'Imóveis vendidos ainda no ar', d: 'Passa a impressão de site abandonado. A atualização precisa ser simples.' },
      { t: 'Um botão de contato genérico', d: 'O corretor precisa saber de qual imóvel o cliente está falando logo na primeira mensagem.' }
    ],
    nota: 'No site do corretor, cada imóvel tem página com fotos otimizadas e um botão de WhatsApp que já informa o código ou o nome do imóvel.',
    regras: 'A intermediação de imóveis é atividade de corretor inscrito no CRECI. O site exibe o seu número de CRECI (e o da imobiliária, quando houver), e os anúncios trazem apenas informações conferidas com o proprietário, como valores, metragem e situação do imóvel.',
    faq: [
      { q: 'Dá para ter páginas por bairro?', a: 'Dá, e ajuda a aparecer em buscas como “apartamento à venda no bairro tal”. Cada página reúne os imóveis e um texto sobre a região.' },
      { q: 'O site serve para lançamentos?', a: 'Serve. Um lançamento funciona bem em uma landing page própria, com plantas, localização e formulário de interesse, ideal para receber visitas de anúncios.' }
    ]
  },

  // ---------------------------------------------------------- NEGÓCIOS LOCAIS
  'energia-solar': {
    decideTitulo: 'Como o cliente decide por energia solar',
    decide: 'Energia solar é uma compra pensada. O cliente quer entender quanto vai economizar, em quanto tempo o investimento se paga e se a empresa vai estar ali para dar assistência depois. Ele pede orçamento em mais de um lugar e compara. O site ajuda quando explica o processo sem exagero e mostra instalações feitas de verdade.',
    duvidas: [
      { q: '“Quanto vou economizar na conta de luz?”', onde: 'Página explicando como a economia é calculada a partir da sua conta.' },
      { q: '“Funciona em dia nublado? E à noite?”', onde: 'Página “Como funciona”, com as dúvidas mais comuns.' },
      { q: '“Tem financiamento?”', onde: 'Página de formas de pagamento, com as opções que você trabalha.' },
      { q: '“Quem instala e dá garantia?”', onde: 'Página da empresa, com equipe, responsável técnico e garantias.' }
    ],
    erros: [
      { t: 'Prometer um percentual fixo de economia', d: 'A economia depende do consumo, do telhado e da tarifa. O correto é calcular caso a caso.' },
      { t: 'Não mostrar instalações reais', d: 'Fotos de obras próprias, com cidade e tipo de cliente, valem mais do que imagens de catálogo.' },
      { t: 'Formulário sem pedir a conta de luz', d: 'Sem o consumo, o orçamento vira estimativa e o retorno demora.' }
    ],
    nota: 'No site de energia solar, o pedido de orçamento já solicita o valor médio da conta e o tipo de imóvel, e as páginas são separadas para residência, comércio e propriedade rural.',
    faq: [
      { q: 'Vale ter uma página para cada cidade atendida?', a: 'Vale quando você realmente atende a cidade e tem algo próprio a dizer sobre ela, como instalações feitas na região.' },
      { q: 'O site pode explicar a manutenção do sistema?', a: 'Pode. Explicar limpeza, monitoramento e assistência mostra que a empresa acompanha o cliente depois da instalação.' }
    ]
  },

  marcenarias: {
    decideTitulo: 'Como o cliente escolhe uma marcenaria',
    decide: 'Quem procura móveis planejados quer ver para crer. O cliente pesquisa referências, compara acabamentos e pede orçamento em duas ou três marcenarias. Ele repara na qualidade das fotos, nos detalhes de ferragens e puxadores e na clareza sobre prazo e montagem. O site funciona como um showroom aberto o dia todo.',
    duvidas: [
      { q: '“Faz cozinha planejada?”', onde: 'Portfólio por ambiente: cozinha, quarto, banheiro, sala, escritório.' },
      { q: '“Qual material é usado?”', onde: 'Página de materiais e acabamentos, com as opções que você oferece.' },
      { q: '“Quanto tempo leva para ficar pronto?”', onde: 'Página “Como funciona”, da medição à montagem.' },
      { q: '“Atende minha cidade?”', onde: 'Área de atendimento informada com clareza.' }
    ],
    erros: [
      { t: 'Fotos escuras ou tortas', d: 'A foto é o produto. Imagens bem iluminadas valorizam o móvel e a marcenaria.' },
      { t: 'Galeria única com tudo misturado', d: 'Quem quer uma cozinha não quer rolar por vinte guarda-roupas.' },
      { t: 'Não explicar o processo', d: 'O cliente quer saber quando mede, quando aprova o projeto e quando monta.' }
    ],
    nota: 'No site da marcenaria, as fotos são organizadas por ambiente e preparadas para abrir rápido, e o pedido de orçamento permite informar o ambiente e as medidas aproximadas.',
    faq: [
      { q: 'O site pode mostrar projetos em 3D?', a: 'Pode. Mostrar o projeto em 3D ao lado da foto do móvel pronto é uma ótima forma de provar que o resultado segue o combinado.' },
      { q: 'Dá para atender arquitetos e construtoras pelo site?', a: 'Dá. Uma página voltada a profissionais explica como funciona a parceria e separa esse contato do cliente final.' }
    ]
  },

  restaurantes: {
    decideTitulo: 'Como o cliente escolhe onde comer',
    decide: 'A decisão sobre onde comer é rápida e quase sempre acontece no celular, com fome. O cliente quer ver o cardápio com preço, saber se está aberto, se entrega no bairro dele e como pede. Se precisar baixar um arquivo ou procurar o cardápio em destaques do Instagram, ele vai para o concorrente.',
    duvidas: [
      { q: '“Qual é o cardápio e quanto custa?”', onde: 'Cardápio digital em página leve, com fotos e preços.' },
      { q: '“Está aberto agora?”', onde: 'Horário no topo da página, igual ao do Google.' },
      { q: '“Entrega no meu bairro?”', onde: 'Página de delivery com bairros atendidos e taxa, se você divulgar.' },
      { q: '“Dá para reservar mesa?”', onde: 'Botão de reserva pelo WhatsApp, com a mensagem pronta.' }
    ],
    erros: [
      { t: 'Cardápio em PDF', d: 'É difícil de ler no celular, demora para abrir e o Google não consegue aproveitar.' },
      { t: 'Preços desatualizados', d: 'Gera discussão no caixa. O cardápio precisa ser simples de alterar.' },
      { t: 'Depender só de aplicativo de entrega', d: 'O pedido direto pelo WhatsApp mantém o contato com o cliente e evita a comissão do aplicativo.' }
    ],
    nota: 'No site do restaurante, o cardápio é uma página comum, que abre rápido, com fotos leves e um botão de pedido pelo WhatsApp sempre visível.',
    faq: [
      { q: 'O site pode ter cardápio com fotos de todos os pratos?', a: 'Pode. Fotos reais dos pratos ajudam muito na escolha; as imagens são preparadas para não deixar a página lenta.' },
      { q: 'Dá para divulgar o prato do dia ou promoções?', a: 'Dá. Um bloco de destaque na página inicial pode ser atualizado sempre que houver novidade.' }
    ]
  },

  construtoras: {
    decideTitulo: 'Como o cliente contrata uma construtora',
    decide: 'Construir ou reformar envolve um valor alto e muita insegurança. O cliente tem medo de atraso, de estouro de orçamento e de ficar sem resposta no meio da obra. Antes de pedir uma proposta, ele procura sinais de seriedade: obras entregues, responsável técnico identificado e um processo de trabalho explicado.',
    duvidas: [
      { q: '“Essa empresa já fez obra parecida?”', onde: 'Página de obras entregues, organizada por tipo.' },
      { q: '“Faz reforma ou só construção?”', onde: 'Páginas separadas para construção, reforma e ampliação.' },
      { q: '“Como é o acompanhamento da obra?”', onde: 'Página “Como trabalhamos”, com as etapas e a forma de comunicação.' },
      { q: '“Quem é o responsável técnico?”', onde: 'Identificação do engenheiro ou arquiteto com registro profissional.' }
    ],
    erros: [
      { t: 'Site só com imagens ilustrativas', d: 'Obras reais, mesmo simples, convencem mais do que perspectivas de catálogo.' },
      { t: 'Não explicar como é feito o orçamento', d: 'O cliente quer saber o que entra na proposta e o que depende de visita técnica.' },
      { t: 'Contato sem perguntar o tipo de obra', d: 'Sem saber se é construção, reforma ou ampliação, o primeiro atendimento se arrasta.' }
    ],
    nota: 'No site da construtora, cada obra entregue tem página com fotos e descrição do que foi feito, e o pedido de orçamento já identifica o tipo de obra e a cidade.',
    faq: [
      { q: 'Dá para mostrar o antes e depois de reformas?', a: 'Dá, e costuma ser o conteúdo que mais convence. As fotos entram com a autorização do cliente.' },
      { q: 'O site pode ter páginas por tipo de obra?', a: 'Pode. Residencial, comercial e reforma têm clientes e dúvidas diferentes, e cada um merece a sua página.' }
    ]
  },

  'oficinas-mecanicas': {
    decideTitulo: 'Como o motorista escolhe uma oficina',
    decide: 'Deixar o carro em uma oficina é uma questão de confiança. O motorista teme pagar por um serviço desnecessário e ficar dias sem o veículo. Ele procura no Google Maps, lê as avaliações com atenção e quer saber se a oficina atende a marca do carro dele e se o orçamento é passado antes de começar.',
    duvidas: [
      { q: '“Faz revisão do meu modelo?”', onde: 'Página de marcas e veículos atendidos.' },
      { q: '“Conserta ar-condicionado? E câmbio automático?”', onde: 'Página de cada serviço, explicando os sinais de problema.' },
      { q: '“O orçamento é passado antes?”', onde: 'Bloco explicando como funciona o diagnóstico e a aprovação.' },
      { q: '“Tem garantia do serviço?”', onde: 'Página de garantia, com as condições que você oferece.' }
    ],
    erros: [
      { t: 'Não listar os serviços', d: '“Mecânica em geral” não aparece para quem pesquisa “troca de embreagem”.' },
      { t: 'Ignorar as avaliações do Google', d: 'Para oficina, elas pesam muito. Responder a todas mostra cuidado.' },
      { t: 'Não mostrar a oficina', d: 'Fotos do espaço organizado e dos equipamentos passam segurança.' }
    ],
    nota: 'No site da oficina, cada serviço tem página própria e o botão de WhatsApp já pede modelo e ano do veículo, para você orientar o cliente logo na primeira mensagem.',
    faq: [
      { q: 'O site pode explicar os sinais de cada problema?', a: 'Pode. Conteúdos como “barulho ao frear” ou “carro falhando” respondem buscas reais e trazem o motorista para a oficina.' },
      { q: 'Dá para divulgar serviços para frotas?', a: 'Dá. Uma página voltada a empresas explica como funciona o atendimento de frota e separa esse contato do cliente particular.' }
    ]
  },

  academias: {
    decideTitulo: 'Como o aluno escolhe uma academia',
    decide: 'O aluno escolhe a academia pela conveniência: perto de casa ou do trabalho, com horário que encaixa na rotina e uma modalidade de que ele goste. Ele quer ver a estrutura, conferir a grade de aulas e, de preferência, experimentar antes de fechar o plano. Quanto menos ele precisar perguntar, mais fácil a decisão.',
    duvidas: [
      { q: '“Tem aula de manhã cedo?”', onde: 'Grade de horários atualizada, por modalidade.' },
      { q: '“Quais modalidades têm?”', onde: 'Página de cada modalidade: musculação, funcional, lutas, dança, natação.' },
      { q: '“Posso fazer uma aula experimental?”', onde: 'Botão de agendamento da aula experimental pelo WhatsApp.' },
      { q: '“Como é a academia por dentro?”', onde: 'Fotos reais da estrutura, dos equipamentos e dos vestiários.' }
    ],
    erros: [
      { t: 'Grade de horários desatualizada', d: 'O aluno chega para uma aula que mudou de horário. A grade precisa ser fácil de editar.' },
      { t: 'Só fotos de banco de imagens', d: 'O aluno quer ver a academia de verdade, não modelos em um lugar que não existe.' },
      { t: 'Esconder a aula experimental', d: 'É o principal convite para quem ainda está decidindo.' }
    ],
    nota: 'No site da academia, a grade de horários é simples de atualizar e o convite para a aula experimental aparece em todas as páginas de modalidade.',
    regras: 'Academias contam com responsável técnico registrado no CREF. O site identifica os profissionais de educação física com o número de registro e apresenta as modalidades sem prometer resultado estético ou emagrecimento em prazo determinado.',
    faq: [
      { q: 'O site pode apresentar os professores?', a: 'Pode. Mostrar a equipe com nome, especialidade e CREF aproxima o aluno e valoriza os profissionais.' },
      { q: 'Dá para ter uma página para personal trainer?', a: 'Dá. Se a academia oferece acompanhamento individual, uma página própria explica como funciona e para quem é indicado.' }
    ]
  },

  'saloes-e-barbearias': {
    decideTitulo: 'Como o cliente escolhe um salão ou barbearia',
    decide: 'Em beleza, o cliente escolhe pelo resultado que vê. Ele olha fotos de cortes, cores e unhas, procura um profissional específico e quer marcar sem precisar ligar. Preço e horário disponíveis ajudam a decidir na hora. O site reúne tudo isso em um só lugar e aparece no Google quando alguém procura um salão perto.',
    duvidas: [
      { q: '“Quanto custa o corte? E a progressiva?”', onde: 'Tabela de serviços, com os valores que você decidir divulgar.' },
      { q: '“Quem faz mechas nesse salão?”', onde: 'Página de profissionais, com a especialidade de cada um.' },
      { q: '“Tem horário hoje?”', onde: 'Botão de agendamento pelo WhatsApp ou pelo seu sistema de agenda.' },
      { q: '“Como ficam os trabalhos?”', onde: 'Galeria de fotos reais, organizada por tipo de serviço.' }
    ],
    erros: [
      { t: 'Galeria desorganizada', d: 'Cortes, cores e unhas misturados dificultam para o cliente achar a referência que procura.' },
      { t: 'Horário errado no Google', d: 'O cliente vai até o salão e encontra fechado. Site e perfil precisam mostrar o mesmo horário.' },
      { t: 'Agendamento só por ligação', d: 'Muita gente marca fora do horário comercial, pelo celular.' }
    ],
    nota: 'No site do salão ou da barbearia, a galeria é organizada por serviço, cada profissional pode ter seu próprio espaço e o botão de agendamento fica sempre à mão.',
    faq: [
      { q: 'O site pode vender pacotes e dia da noiva?', a: 'Pode. Serviços especiais ganham uma página própria, explicando o que está incluído e como reservar a data.' },
      { q: 'Dá para divulgar produtos vendidos no salão?', a: 'Dá. Uma página de produtos mostra as marcas com que você trabalha, com contato pelo WhatsApp para reservar.' }
    ]
  }
};

export const extraSegmento = (slug: string) => SEGMENTOS_EXTRA[slug];
