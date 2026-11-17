import { db } from '../db.js';

// Mesmo contrato da S3 (listar, buscarPorId, buscarPorEmail, inserir,
// atualizar, remover). Só o "como" mudou: o array virou tabela.
export const pacienteModel = {
  listar() {
    return db.prepare('SELECT * FROM pacientes ORDER BY id').all();
  },

  buscarPorId(id) {
    return db.prepare('SELECT * FROM pacientes WHERE id = ?').get(id) ?? null;
  },

  buscarPorEmail(email) {
    return db.prepare('SELECT * FROM pacientes WHERE email = ?').get(email) ?? null;
  },

  inserir({ nome, email, telefone }) {
    const r = db
      .prepare('INSERT INTO pacientes (nome, email, telefone) VALUES (?, ?, ?)')
      .run(nome, email, telefone ?? null);
    return this.buscarPorId(r.lastInsertRowid);
  },

  atualizar(id, dados) {
    const atual = this.buscarPorId(id);
    if (!atual) return null;
    const novo = { ...atual, ...dados };
    db.prepare('UPDATE pacientes SET nome = ?, email = ?, telefone = ? WHERE id = ?')
      .run(novo.nome, novo.email, novo.telefone ?? null, id); // o id nunca muda
    return this.buscarPorId(id);
  },

  remover(id) {
    const r = db.prepare('DELETE FROM pacientes WHERE id = ?').run(id);
    return r.changes > 0; // true = removeu
  },
};
