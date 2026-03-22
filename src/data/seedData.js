// Estrutura de dados para popular as tabelas
export const seedData = {
  fases: [
    { id: 1, nome: 'Fase 1' },
    { id: 2, nome: 'Fase 2' },
    { id: 3, nome: 'Fase 3' }
  ],
  areas: [
    { faseId: 1, nome: 'Análise de Dados' },
    { faseId: 2, nome: 'Arquitetura de Software' },
    { faseId: 3, nome: 'Cálculo (Mínimo Essencial)' },
    { faseId: null, nome: 'Imobiliário' },
    { faseId: null, nome: 'Desenvolvimento Backend' },
    { faseId: null, nome: 'Estatística Aplicada' },
    { faseId: null, nome: 'Financeiro Empresarial' },
    { faseId: null, nome: 'IA Aplicada' },
    { faseId: null, nome: 'Jurídico Imobiliário' },
    { faseId: null, nome: 'Matemática Elementar' },
    { faseId: null, nome: 'Operação de Locação' },
    { faseId: null, nome: 'Python e SQL' },
    { faseId: null, nome: 'System Design' },
    { faseId: null, nome: 'Álgebra Linear' }
  ],
  conteudos: [
    // Fase 1 - Análise de Dados
    { areaId: 1, nome: 'APIs de LLM' },
    // Fase 2 - Arquitetura de Software
    { areaId: 2, nome: 'APIs e Integrações' },
    // Fase 3 - Cálculo
    { areaId: 3, nome: 'Agentes e RAG' },
    // Geral
    { areaId: 4, nome: 'Automação No-code/Low-code' },
    { areaId: 5, nome: 'Autenticação JWT e controle de acesso' },
    { areaId: 6, nome: 'Autovalores e Autovetores' },
    { areaId: 7, nome: 'Ação de despejo — amigável vs judicial, prazos e custos' },
    { areaId: 3, nome: 'Análise de demanda por bairro — sazonalidade e perfil de inquilino' },
    { areaId: 3, nome: 'Aplicações: entropia, crescimento exponencial' },
    // ... adicionar todos os outros
  ],
  topicos: [
    // APIs de LLM
    { conteudoId: 1, nome: 'API REST — boas práticas de design (versionamento, status codes)' },
    // APIs e Integrações
    { conteudoId: 2, nome: 'Análise de crédito — Serasa, SPC, score, renda' },
    // Agentes e RAG
    { conteudoId: 3, nome: 'Análise de demanda por bairro — sazonalidade e perfil de inquilino' },
    // ... adicionar todos os outros
  ]
}
