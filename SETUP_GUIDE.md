# 📚 Plano de Estudos - Setup Completo do Banco de Dados

## ✅ O que foi criado

### Estrutura de Banco de Dados

**Tabelas Auxiliares (lookup tables):**
- `fases` - Fase 1, 2, 3
- `areas` - Áreas de estudo (Análise de Dados, etc)
- `conteudos` - Tópicos dentro de cada área
- `topicos` - Tópicos detalhados específicos

**Tabelas Principais:**
- `metas` - Suas metas de estudo (horas por semana, datas, etc)
- `registros` - Seu histórico de estudos (data, horárias, observações, etc)

### Arquivos Criados

```
projeto/
├── sql/
│   ├── schema.sql              # SQL para criar as tabelas
│   └── insert-data.sql         # SQL para popular dados
├── src/
│   ├── contexts/
│   │   └── ThemeContext.jsx    # Gerenciador de tema claro/escuro
│   ├── components/
│   │   └── Sidebar.jsx         # Sidebar com navegação
│   ├── pages/
│   │   ├── VisaoGeral.jsx      # Dashboard
│   │   ├── Metas.jsx           # Página de metas
│   │   ├── Registros.jsx       # Página de registros
│   │   └── AdminSeed.jsx       # Página para popular BD
│   ├── services/
│   │   └── seedDatabase.js     # Funções para popular BD
│   ├── lib/
│   │   └── supabaseClient.js   # Cliente Supabase configurado
│   └── data/
│       ├── estruturaCompleta.json    # Todos os dados em JSON
│       └── seedData.js              # Dados estruturados
├── DATABASE_SETUP.md            # Documentação completa
└── App.jsx                      # App com rotas
```

## 🚀 Como Usar

### Passo 1: Criar o Schema no Supabase

1. Acesse [https://supabase.com](https://supabase.com) e faça login
2. Abra seu projeto
3. Vá para **SQL Editor** (ícone <>) 
4. Clique em **New Query**
5. Copie todo o conteúdo de `sql/schema.sql`
6. Cole na query
7. Clique em **Run** (ou Ctrl+Enter)

### Passo 2: Popular o Banco (Escolha uma opção)

#### Opção A: Interface Web (Recomendado) ⭐
1. No navegador, acesse: `http://localhost:5174/admin-seed`
2. Clique em "Executar Seed"
3. Pronto! Banco populado com sucesso ✅

#### Opção B: Manualmente no Supabase
1. Volte para Supabase SQL Editor
2. Clique em **New Query**
3. Copie todo o conteúdo de `sql/insert-data.sql`
4. Cole e execute

#### Opção C: Copy-paste no banco
Você pode copiar e colar os dados em cada tabela manualmente via interface do Supabase.

### Passo 3: Verificar Conexão

1. Certifique-se que seu `.env` tem:
```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-aqui
```

2. Acesse as páginas:
   - [Visão Geral](http://localhost:5174/visao-geral)
   - [Metas](http://localhost:5174/metas)
   - [Registros](http://localhost:5174/registros)

## 📊 Estrutura de Dados Detalhada

### Tabela: metas
```sql
{
  id: UUID,
  fase_id: integer (FK),
  area_id: integer (FK),
  horas_meta_semana: decimal,
  data_inicio: date,
  data_fim: date,
  created_at: timestamp,
  updated_at: timestamp
}
```

### Tabela: registros
```sql
{
  id: UUID,
  data: date,
  fase_id: integer (FK),
  area_id: integer (FK),
  conteudo_id: integer (FK),
  topico_id: integer (FK),
  horas: decimal,
  observacao: text,
  created_at: timestamp,
  updated_at: timestamp
}
```

## 🎯 Opções Pré-configuradas

### Fases
- Fase 1
- Fase 2
- Fase 3

### Algumas Áreas (14 no total)
- Análise de Dados
- Arquitetura de Software
- Cálculo (Mínimo Essencial)
- Imobiliário
- Desenvolvimento Backend
- Estatística Aplicada
- Financeiro Empresarial
- IA Aplicada
- Jurídico Imobiliário
- Matemática Elementar
- Operação de Locação
- Python e SQL
- System Design
- Álgebra Linear

### Conteúdos Específicos (exemplos)
- APIs de LLM
- APIs e Integrações
- Agentes e RAG
- Automação No-code/Low-code
- E muito mais (+40 opções)

## 🔒 Segurança e Permissões

Se a interface disser que precisa de permissões, configure no Supabase:

1. Vá para **Authentication** > **Policies**
2. Para cada tabela, clique em **Add Policy**
3. Escolha **Enable read access for all**, **Enable insert for authenticated users**, etc

Ou execute no SQL Editor:
```sql
ALTER TABLE fases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON fases FOR SELECT USING (true);

ALTER TABLE areas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON areas FOR SELECT USING (true);

ALTER TABLE conteudos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON conteudos FOR SELECT USING (true);

ALTER TABLE topicos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON topicos FOR SELECT USING (true);
```

## 💡 Próximos Passos

Após popular o banco:

1. Criar componentes de form para **Nova Meta**
2. Criar componentes de form para **Novo Registro**
3. Integrar com Supabase para buscar dados
4. Adicionar gráficos e estatísticas
5. Implementar autenticação completa
6. Deploy em produção

## ❓ Troubleshooting

### "Erro de conexão com Supabase"
- Verifique o `.env`
- Certifique-se que as chaves estão corretas
- Confira se o projeto no Supabase está ativo

### "Tabela não encontrada"
- Execute novamente o `sql/schema.sql`
- Verifique se o SQL foi executado sem erros

### "Dados não aparecem depois do seed"
- Verifique as políticas de RLS
- Confira se os dados foram inseridos: em SQL Editor, execute `SELECT * FROM fases;`

---

🎉 **Pronto!** Seu banco está configurado e pronto para começar a registrar seus estudos!
