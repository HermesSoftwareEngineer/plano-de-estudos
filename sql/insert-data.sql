-- Inserir Fases
INSERT INTO fases (nome) VALUES
  ('Fase 1'),
  ('Fase 2'),
  ('Fase 3')
ON CONFLICT DO NOTHING;

-- Inserir Áreas (aqui estou usando referencias por nome, ajuste os fase_id conforme necessário)
INSERT INTO areas (fase_id, nome) VALUES
  (1, 'Análise de Dados'),
  (2, 'Arquitetura de Software'),
  (3, 'Cálculo (Mínimo Essencial)'),
  (NULL, 'Imobiliário'),
  (NULL, 'Desenvolvimento Backend'),
  (NULL, 'Estatística Aplicada'),
  (NULL, 'Financeiro Empresarial'),
  (NULL, 'IA Aplicada'),
  (NULL, 'Jurídico Imobiliário'),
  (NULL, 'Matemática Elementar'),
  (NULL, 'Operação de Locação'),
  (NULL, 'Python e SQL'),
  (NULL, 'System Design'),
  (NULL, 'Álgebra Linear')
ON CONFLICT DO NOTHING;

-- Inserir Conteúdos (principais)
INSERT INTO conteudos (area_id, nome) VALUES
  ((SELECT id FROM areas WHERE nome = 'Análise de Dados'), 'APIs de LLM'),
  ((SELECT id FROM areas WHERE nome = 'Arquitetura de Software'), 'APIs e Integrações'),
  ((SELECT id FROM areas WHERE nome = 'Cálculo (Mínimo Essencial)'), 'Agentes e RAG'),
  ((SELECT id FROM areas WHERE nome = 'Desenvolvimento Backend'), 'Automação No-code/Low-code'),
  ((SELECT id FROM areas WHERE nome = 'Desenvolvimento Backend'), 'Autenticação JWT e controle de acesso'),
  ((SELECT id FROM areas WHERE nome = 'Estatística Aplicada'), 'Autovalores e Autovetores'),
  ((SELECT id FROM areas WHERE nome = 'Jurídico Imobiliário'), 'Ação de despejo — amigável vs judicial'),
  ((SELECT id FROM areas WHERE nome = 'Desenvolvimento Backend'), 'Banco de Dados em Escala'),
  ((SELECT id FROM areas WHERE nome = 'Desenvolvimento Backend'), 'Banco relacional vs NoSQL'),
  ((SELECT id FROM areas WHERE nome = 'Financeiro Empresarial'), 'Benchmark de taxa de administração'),
  ((SELECT id FROM areas WHERE nome = 'Jurídico Imobiliário'), 'Benfeitorias'),
  ((SELECT id FROM areas WHERE nome = 'Desenvolvimento Backend'), 'Billing e planos'),
  ((SELECT id FROM areas WHERE nome = 'Financeiro Empresarial'), 'CAC de imóvel'),
  ((SELECT id FROM areas WHERE nome = 'Desenvolvimento Backend'), 'Cache — Redis'),
  ((SELECT id FROM areas WHERE nome = 'Financeiro Empresarial'), 'Capital de giro'),
  ((SELECT id FROM areas WHERE nome = 'Python e SQL'), 'Carga em banco de dados'),
  ((SELECT id FROM areas WHERE nome = 'Imobiliário'), 'Cases de referência'),
  ((SELECT id FROM areas WHERE nome = 'Operação de Locação'), 'Churn de contratos'),
  ((SELECT id FROM areas WHERE nome = 'Desenvolvimento Backend'), 'Clean code'),
  ((SELECT id FROM areas WHERE nome = 'IA Aplicada'), 'Consumir API OpenAI/Anthropic'),
  ((SELECT id FROM areas WHERE nome = 'Estatística Aplicada'), 'Correlação de Pearson'),
  ((SELECT id FROM areas WHERE nome = 'Python e SQL'), 'Criação de rotas REST'),
  ((SELECT id FROM areas WHERE nome = 'Jurídico Imobiliário'), 'Código de ética do corretor'),
  ((SELECT id FROM areas WHERE nome = 'Desenvolvimento Backend'), 'Deploy em VPS'),
  ((SELECT id FROM areas WHERE nome = 'Estatística Aplicada'), 'Desvio padrão e variância'),
  ((SELECT id FROM areas WHERE nome = 'Jurídico Imobiliário'), 'Direitos e deveres do locador'),
  ((SELECT id FROM areas WHERE nome = 'Jurídico Imobiliário'), 'Direitos e deveres do locatário'),
  ((SELECT id FROM areas WHERE nome = 'Estatística Aplicada'), 'Distribuição normal'),
  ((SELECT id FROM areas WHERE nome = 'Estatística Aplicada'), 'Distribuições binomial e Poisson'),
  ((SELECT id FROM areas WHERE nome = 'Desenvolvimento Backend'), 'Docker'),
  ((SELECT id FROM areas WHERE nome = 'Python e SQL'), 'Documentação automática Swagger'),
  ((SELECT id FROM areas WHERE nome = 'Matemática Elementar'), 'Domínio e imagem de funções'),
  ((SELECT id FROM areas WHERE nome = 'IA Aplicada'), 'Embeddings e banco de vetores'),
  ((SELECT id FROM areas WHERE nome = 'Imobiliário'), 'Estratégias de prospecção'),
  ((SELECT id FROM areas WHERE nome = 'Python e SQL'), 'Estrutura de projeto Python'),
  ((SELECT id FROM areas WHERE nome = 'System Design'), 'Extração de dados'),
  ((SELECT id FROM areas WHERE nome = 'Desenvolvimento Backend'), 'Filas de mensagem'),
  ((SELECT id FROM areas WHERE nome = 'Financeiro Empresarial'), 'Fluxo de caixa'),
  ((SELECT id FROM areas WHERE nome = 'Imobiliário'), 'Fotografia e anúncio')
ON CONFLICT DO NOTHING;

-- Inserir alguns Tópicos de exemplo
INSERT INTO topicos (conteudo_id, nome) VALUES
  ((SELECT id FROM conteudos WHERE nome = 'APIs de LLM' LIMIT 1), 'API REST — boas práticas de design'),
  ((SELECT id FROM conteudos WHERE nome = 'APIs e Integrações' LIMIT 1), 'Análise de crédito — Serasa, SPC'),
  ((SELECT id FROM conteudos WHERE nome = 'Agentes e RAG' LIMIT 1), 'Análise de demanda por bairro'),
  ((SELECT id FROM conteudos WHERE nome = 'Automação No-code/Low-code' LIMIT 1), 'Aplicações: entropia'),
  ((SELECT id FROM conteudos WHERE nome = 'Autenticação JWT e controle de acesso' LIMIT 1), 'Autenticação JWT'),
  ((SELECT id FROM conteudos WHERE nome = 'Autovalores e Autovetores' LIMIT 1), 'Autovalores'),
  ((SELECT id FROM conteudos WHERE nome = 'Banco de Dados em Escala' LIMIT 1), 'Escalabilidade em BD'),
  ((SELECT id FROM conteudos WHERE nome = 'Clean code' LIMIT 1), 'Nomes e funções pequenas')
ON CONFLICT DO NOTHING;

-- Verificar dados inseridos
SELECT COUNT(*) as total_fases FROM fases;
SELECT COUNT(*) as total_areas FROM areas;
SELECT COUNT(*) as total_conteudos FROM conteudos;
SELECT COUNT(*) as total_topicos FROM topicos;
