// Script completo de seed para popular o banco com todas as opções
import { supabase } from '../lib/supabaseClient.js'

export async function seedDatabase() {
  try {
    // 1. Inserir Fases
    const fases = [
      { nome: 'Fase 1' },
      { nome: 'Fase 2' },
      { nome: 'Fase 3' }
    ]
    
    const { data: fasesData, error: fasesError } = await supabase
      .from('fases')
      .insert(fases)
      .select()
    
    if (fasesError) throw fasesError
    console.log('✓ Fases inseridas')
    
    // 2. Inserir Áreas
    const areas = [
      { fase_id: 1, nome: 'Análise de Dados' },
      { fase_id: 2, nome: 'Arquitetura de Software' },
      { fase_id: 3, nome: 'Cálculo (Mínimo Essencial)' },
      { fase_id: null, nome: 'Imobiliário' },
      { fase_id: null, nome: 'Desenvolvimento Backend' },
      { fase_id: null, nome: 'Estatística Aplicada' },
      { fase_id: null, nome: 'Financeiro Empresarial' },
      { fase_id: null, nome: 'IA Aplicada' },
      { fase_id: null, nome: 'Jurídico Imobiliário' },
      { fase_id: null, nome: 'Matemática Elementar' },
      { fase_id: null, nome: 'Operação de Locação' },
      { fase_id: null, nome: 'Python e SQL' },
      { fase_id: null, nome: 'System Design' },
      { fase_id: null, nome: 'Álgebra Linear' }
    ]
    
    const { data: areasData, error: areasError } = await supabase
      .from('areas')
      .insert(areas)
      .select()
    
    if (areasError) throw areasError
    console.log('✓ Áreas inseridas')
    
    // 3. Mapa de IDs para usar nos conteúdos
    const areaIdMap = {}
    areasData.forEach(area => {
      areaIdMap[area.nome] = area.id
    })
    
    // 4. Inserir Conteúdos
    const conteudos = [
      { area_id: areaIdMap['Análise de Dados'], nome: 'APIs de LLM' },
      { area_id: areaIdMap['Arquitetura de Software'], nome: 'APIs e Integrações' },
      { area_id: areaIdMap['Cálculo (Mínimo Essencial)'], nome: 'Agentes e RAG' },
      { area_id: areaIdMap['Imobiliário'], nome: 'Desenvolvimento Backend' },
      { area_id: areaIdMap['Imobiliário'], nome: 'Automação No-code/Low-code' },
      { area_id: areaIdMap['Desenvolvimento Backend'], nome: 'Autenticação JWT e controle de acesso' },
      { area_id: areaIdMap['Estatística Aplicada'], nome: 'Autovalores e Autovetores' },
      { area_id: areaIdMap['Jurídico Imobiliário'], nome: 'Ação de despejo — amigável vs judicial, prazos e custos' },
      { area_id: areaIdMap['Desenvolvimento Backend'], nome: 'Banco de Dados em Escala' },
      { area_id: areaIdMap['Desenvolvimento Backend'], nome: 'Banco relacional vs NoSQL — quando usar cada um' },
      { area_id: areaIdMap['Financeiro Empresarial'], nome: 'Benchmark de taxa de administração no mercado local' },
      { area_id: areaIdMap['Jurídico Imobiliário'], nome: 'Benfeitorias — necessárias, úteis e voluptuárias' },
      { area_id: areaIdMap['Desenvolvimento Backend'], nome: 'Billing e planos — integração com Stripe/PagSeguro' },
      { area_id: areaIdMap['Financeiro Empresarial'], nome: 'CAC de imóvel — custo de captação por unidade' },
      { area_id: areaIdMap['Desenvolvimento Backend'], nome: 'Cache — Redis, estratégias e invalidação' },
      { area_id: areaIdMap['Financeiro Empresarial'], nome: 'Capital de giro — necessidade mínima para abrir a imobiliária' },
      { area_id: areaIdMap['Python e SQL'], nome: 'Carga em banco de dados — PostgreSQL via Python' },
      { area_id: areaIdMap['Imobiliário'], nome: 'Cases de referência — QuintoAndar, Loft, Housi' },
      { area_id: areaIdMap['Operação de Locação'], nome: 'Churn de contratos — análise de renovação e cancelamento' },
      { area_id: areaIdMap['Desenvolvimento Backend'], nome: 'Clean code — nomes, funções pequenas, sem duplicação' },
      { area_id: areaIdMap['IA Aplicada'], nome: 'Consumir API OpenAI / Anthropic via Python' },
      { area_id: areaIdMap['Estatística Aplicada'], nome: 'Correlação de Pearson e coeficiente r²' },
      { area_id: areaIdMap['Python e SQL'], nome: 'Criação de rotas GET, POST, PUT, DELETE' },
      { area_id: areaIdMap['Jurídico Imobiliário'], nome: 'Código de ética do corretor de imóveis' },
      { area_id: areaIdMap['Desenvolvimento Backend'], nome: 'Deploy em VPS (Railway, Render ou DigitalOcean)' },
      { area_id: areaIdMap['Estatística Aplicada'], nome: 'Desvio padrão e variância' },
      { area_id: areaIdMap['Jurídico Imobiliário'], nome: 'Direitos e deveres do locador' },
      { area_id: areaIdMap['Jurídico Imobiliário'], nome: 'Direitos e deveres do locatário' },
      { area_id: areaIdMap['Estatística Aplicada'], nome: 'Distribuição normal e curva de sino' },
      { area_id: areaIdMap['Estatística Aplicada'], nome: 'Distribuições binomial e Poisson' },
      { area_id: areaIdMap['Desenvolvimento Backend'], nome: 'Docker — containerização da aplicação' },
      { area_id: areaIdMap['Python e SQL'], nome: 'Documentação automática com Swagger' },
      { area_id: areaIdMap['Matemática Elementar'], nome: 'Domínio, imagem e composição de funções' },
      { area_id: areaIdMap['IA Aplicada'], nome: 'Embeddings e banco de vetores (ChromaDB, Pinecone)' },
      { area_id: areaIdMap['Imobiliário'], nome: 'Estratégias de prospecção de proprietários' },
      { area_id: areaIdMap['Python e SQL'], nome: 'Estrutura de projeto Python (pastas, módulos, configs)' },
      { area_id: areaIdMap['System Design'], nome: 'Extração de dados — APIs, CSVs, planilhas' },
      { area_id: areaIdMap['Desenvolvimento Backend'], nome: 'Filas de mensagem — conceito e uso (RabbitMQ, SQS)' },
      { area_id: areaIdMap['Financeiro Empresarial'], nome: 'Fluxo de caixa — repasse ao proprietário vs receita de administração' },
      { area_id: areaIdMap['Imobiliário'], nome: 'Fotografia e anúncio de imóveis — boas práticas' },
      { area_id: areaIdMap['Matemática Elementar'], nome: 'Função exponencial e logarítmica' },
    ]
    
    const { data: conteudosData, error: conteudosError } = await supabase
      .from('conteudos')
      .insert(conteudos)
      .select()
    
    if (conteudosError) throw conteudosError
    console.log('✓ Conteúdos inseridos')
    
    // 5. Mapa de IDs para usar nos tópicos
    const conteudoIdMap = {}
    conteudosData.forEach(conteudo => {
      conteudoIdMap[conteudo.nome] = conteudo.id
    })
    
    // 6. Inserir Tópicos (apenas os principais para exemplo)
    const topicos = [
      { conteudo_id: conteudoIdMap['APIs de LLM'], nome: 'API REST — boas práticas de design (versionamento, status codes)' },
      { conteudo_id: conteudoIdMap['APIs e Integrações'], nome: 'Análise de crédito — Serasa, SPC, score, renda' },
      { conteudo_id: conteudoIdMap['Agentes e RAG'], nome: 'Análise de demanda por bairro — sazonalidade e perfil de inquilino' },
      { conteudo_id: conteudoIdMap['Automação No-code/Low-code'], nome: 'Aplicações: entropia, crescimento exponencial' },
      { conteudo_id: conteudoIdMap['Autenticação JWT e controle de acesso'], nome: 'Autenticação JWT e controle de acesso' },
      { conteudo_id: conteudoIdMap['Autovalores e Autovetores'], nome: 'Autovalores e Autovetores' },
    ]
    
    const { error: topicosError } = await supabase
      .from('topicos')
      .insert(topicos)
    
    if (topicosError) throw topicosError
    console.log('✓ Tópicos inseridos')
    
    console.log('✅ Banco de dados populado com sucesso!')
    return true
  } catch (error) {
    console.error('❌ Erro ao popular banco:', error.message)
    throw error
  }
}
