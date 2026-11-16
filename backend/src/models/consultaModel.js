// "Banco de dados" em memória: um array. Na S5 vira SQLite.
let consultas = [];
let proximoId = 1;

export const consultaModel = {
  listar() {
    return consultas;
  },

  listarPorPaciente(pacienteId) {
    return consultas.filter((c) => c.pacienteId === pacienteId);
  },

  buscarPorId(id) {
    return consultas.find((c) => c.id === id) ?? null;
  },

  inserir({ pacienteId, dataHora, motivo, status }) {
    const nova = {
      id: proximoId++,
      pacienteId: Number(pacienteId),
      dataHora,
      motivo,
      status,
    };
    consultas.push(nova);
    return nova;
  },

  atualizar(id, dados) {
    const i = consultas.findIndex((c) => c.id === id);
    if (i === -1) return null;
    consultas[i] = { ...consultas[i], ...dados, id }; // o id nunca muda
    return consultas[i];
  },

  remover(id) {
    const antes = consultas.length;
    consultas = consultas.filter((c) => c.id !== id);
    return consultas.length < antes; // true = removeu
  },
};
