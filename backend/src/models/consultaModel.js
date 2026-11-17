import { db } from '../db.js';

// No banco: snake_case (paciente_id, data_hora). No JSON da API: camelCase
// (pacienteId, dataHora). O AS traduz aqui, na única camada que conhece o banco.
const COLUNAS = `id, paciente_id AS pacienteId, data_hora AS dataHora,
  motivo, status`;

export const consultaModel = {
  listar() {
    return db.prepare(`SELECT ${COLUNAS} FROM consultas ORDER BY id`).all();
  },

  listarPorPaciente(pacienteId) {
    return db
      .prepare(`SELECT ${COLUNAS} FROM consultas WHERE paciente_id = ? ORDER BY id`)
      .all(pacienteId);
  },

  buscarPorId(id) {
    return db
      .prepare(`SELECT ${COLUNAS} FROM consultas WHERE id = ?`)
      .get(id) ?? null;
  },

  inserir({ pacienteId, dataHora, motivo, status }) {
    const r = db
      .prepare(`INSERT INTO consultas (paciente_id, data_hora, motivo, status)
                VALUES (?, ?, ?, ?)`)
      .run(Number(pacienteId), dataHora, motivo, status);
    return this.buscarPorId(r.lastInsertRowid);
  },

  atualizar(id, dados) {
    const atual = this.buscarPorId(id);
    if (!atual) return null;
    const novo = { ...atual, ...dados };
    db.prepare(`UPDATE consultas SET paciente_id = ?, data_hora = ?, motivo = ?, status = ?
                WHERE id = ?`)
      .run(Number(novo.pacienteId), novo.dataHora, novo.motivo, novo.status, id);
    return this.buscarPorId(id);
  },

  remover(id) {
    const r = db.prepare('DELETE FROM consultas WHERE id = ?').run(id);
    return r.changes > 0;
  },
};
