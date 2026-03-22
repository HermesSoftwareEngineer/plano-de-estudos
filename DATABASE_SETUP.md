# Setup do Banco de Dados - Plano de Estudos

## Passo 1: Executar o Schema SQL no Supabase

1. Acesse seu projeto no [Supabase Dashboard](https://supabase.com)
2. Vá para **SQL Editor** > **New Query**
3. Copie e cole o conteúdo de `sql/schema.sql`
4. Clique em **Run** ou use `Ctrl+Enter`

Isso irá criar:
- Tabelas auxiliares: `fases`, `áreas`, `conteúdos`, `tópicos`
- Tabelas principais: `metas`, `registros`
- Índices para melhor performance

## Passo 2: Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

## Passo 3: Executar Seed (Opcional)

Você pode popular o banco com os dados pré-configurados de duas formas:

### Opção A: Via Interface Web (Recomendado)
1. Acesse http://localhost:5174/admin-seed
2. Clique em "Executar Seed"

### Opção B: Manualmente no Supabase

Copie e execute os SQLs em `scripts/insert-data.sql` um de cada vez, ou em batch.

## Estrutura de Dados

### Tabelas Auxiliares
Estas tabelas contêm as opções pré-configuradas:

- **fases**: Fase 1, 2, 3
- **áreas**: Análise de Dados, Arquitetura de Software, etc.
- **conteúdos**: APIs de LLM, APIs e Integrações, etc.
- **tópicos**: Tópicos específicos para cada conteúdo

### Tabelas Principais

**Metas**
```
id (UUID)
fase_id (FK)
area_id (FK)
horas_meta_semana (DECIMAL)
data_inicio (DATE)
data_fim (DATE)
created_at, updated_at
```

**Registros**
```
id (UUID)
data (DATE)
fase_id (FK)
area_id (FK)
conteudo_id (FK)
topico_id (FK)
horas (DECIMAL)
observacao (TEXT)
created_at, updated_at
```

## Permissões no Supabase

Se necessário, configure as políticas RLS:

1. Vá para **Authentication** > **Policies**
2. Para tabelas auxiliares: `Enable read access` para todos
3. Para tabelas principais: `Enable all access` para usuários autenticados

---

Para mais informações, consulte a [documentação do Supabase](https://supabase.com/docs)
