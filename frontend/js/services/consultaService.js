import { api } from '../api.js';

const STATUS = ['agendada', 'confirmada', 'cancelada'];

function preparar({ pacienteId, dataHora, motivo, status }) {
  const dados = {
    pacienteId: Number(pacienteId), // o <select> só entrega string
    dataHora: (dataHora ?? '').trim(),
    motivo: (motivo ?? '').trim(),
    status,
  };
  if (!dados.pacienteId) throw new Error('Selecione o paciente.');
  if (!dados.dataHora) throw new Error('Informe a data e o horário.');
  if (!dados.motivo) throw new Error('Informe o motivo da consulta.');
  if (!STATUS.includes(dados.status)) throw new Error('Status inválido.');
  return dados;
}

export const consultaService = {
  listar() {
    return api.get('/consultas');
  },

  async criar(dados) {
    return api.post('/consultas', preparar(dados));
  },

  async atualizar(id, dados) {
    return api.put(`/consultas/${id}`, preparar(dados));
  },

  remover(id) {
    return api.delete(`/consultas/${id}`);
  },
};
