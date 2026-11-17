import { DatabaseSync } from 'node:sqlite';

// O banco inteiro é um arquivo. Se não existir, o SQLite cria.
const arquivo = process.env.DB_FILE ?? 'banco.db';
export const db = new DatabaseSync(arquivo);

// No SQLite a checagem de chave estrangeira vem desligada.
// Tem de ligar a cada conexão.
db.exec('PRAGMA foreign_keys = ON;');

// O schema. IF NOT EXISTS: este arquivo roda toda vez que o servidor sobe.
// A tabela "pai" (pacientes) vem primeiro, porque consultas a referencia.
db.exec(`
  CREATE TABLE IF NOT EXISTS pacientes (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    nome     TEXT NOT NULL,
    email    TEXT NOT NULL UNIQUE,
    telefone TEXT
  );

  CREATE TABLE IF NOT EXISTS consultas (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    paciente_id INTEGER NOT NULL REFERENCES pacientes(id),
    data_hora   TEXT NOT NULL,
    motivo      TEXT NOT NULL,
    status      TEXT NOT NULL DEFAULT 'agendada'
                CHECK (status IN ('agendada', 'confirmada', 'cancelada'))
  );
`);

// Dados de exemplo (fictícios): só entram se o banco estiver vazio.
// No Render grátis o arquivo some a cada reinício; assim a demo nunca abre vazia.
const { total } = db.prepare('SELECT COUNT(*) AS total FROM pacientes').get();
if (total === 0) {
  const inserirPaciente = db.prepare(
    'INSERT INTO pacientes (nome, email, telefone) VALUES (?, ?, ?)',
  );
  const inserirConsulta = db.prepare(
    'INSERT INTO consultas (paciente_id, data_hora, motivo, status) VALUES (?, ?, ?, ?)',
  );

  const ana = inserirPaciente.run('Ana Exemplo', 'ana@exemplo.com', '(83) 90000-0001').lastInsertRowid;
  const bruno = inserirPaciente.run('Bruno Exemplo', 'bruno@exemplo.com', null).lastInsertRowid;
  inserirPaciente.run('Carla Exemplo', 'carla@exemplo.com', '(83) 90000-0003');

  inserirConsulta.run(ana, '2026-12-01T09:00', 'Consulta de rotina', 'confirmada');
  inserirConsulta.run(ana, '2026-12-15T14:30', 'Retorno com exames', 'agendada');
  inserirConsulta.run(bruno, '2026-12-03T10:00', 'Dor nas costas', 'agendada');
}
