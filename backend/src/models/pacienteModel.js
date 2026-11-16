// "Banco de dados" em memória: um array. Na S5 vira SQLite.
let pacientes = [];
let proximoId = 1;

export const pacienteModel = {
  listar() {
    return pacientes;
  },

  buscarPorId(id) {
    return pacientes.find((p) => p.id === id) ?? null;
  },

  buscarPorEmail(email) {
    return pacientes.find((p) => p.email === email) ?? null;
  },

  inserir({ nome, email, telefone }) {
    const novo = { id: proximoId++, nome, email, telefone: telefone ?? null };
    pacientes.push(novo);
    return novo;
  },

  atualizar(id, dados) {
    const i = pacientes.findIndex((p) => p.id === id);
    if (i === -1) return null;
    pacientes[i] = { ...pacientes[i], ...dados, id }; // o id nunca muda
    return pacientes[i];
  },

  remover(id) {
    const antes = pacientes.length;
    pacientes = pacientes.filter((p) => p.id !== id);
    return pacientes.length < antes; // true = removeu
  },
};
