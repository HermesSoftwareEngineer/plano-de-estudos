-- Tabelas auxiliares
CREATE TABLE IF NOT EXISTS fases (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS areas (
  id SERIAL PRIMARY KEY,
  fase_id INTEGER REFERENCES fases(id),
  nome VARCHAR(100) NOT NULL,
  UNIQUE(fase_id, nome)
);

CREATE TABLE IF NOT EXISTS conteudos (
  id SERIAL PRIMARY KEY,
  area_id INTEGER REFERENCES areas(id),
  nome VARCHAR(100) NOT NULL,
  UNIQUE(area_id, nome)
);

CREATE TABLE IF NOT EXISTS topicos (
  id SERIAL PRIMARY KEY,
  conteudo_id INTEGER REFERENCES conteudos(id),
  nome VARCHAR(255) NOT NULL,
  UNIQUE(conteudo_id, nome)
);

-- Tabelas principais
CREATE TABLE IF NOT EXISTS metas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fase_id INTEGER REFERENCES fases(id),
  area_id INTEGER REFERENCES areas(id),
  horas_meta_semana DECIMAL(5, 2) NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS registros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data DATE NOT NULL,
  fase_id INTEGER REFERENCES fases(id),
  area_id INTEGER REFERENCES areas(id),
  conteudo_id INTEGER REFERENCES conteudos(id),
  topico_id INTEGER REFERENCES topicos(id),
  horas DECIMAL(5, 2) NOT NULL,
  observacao TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_metas_fase ON metas(fase_id);
CREATE INDEX IF NOT EXISTS idx_metas_area ON metas(area_id);
CREATE INDEX IF NOT EXISTS idx_registros_data ON registros(data);
CREATE INDEX IF NOT EXISTS idx_registros_fase ON registros(fase_id);
CREATE INDEX IF NOT EXISTS idx_registros_area ON registros(area_id);
