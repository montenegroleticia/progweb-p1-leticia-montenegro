import { api } from '../api.js';

// Regras do lado do front: limpar e validar ANTES de gastar uma requisição.
// O backend valida de novo (e só ele sabe se o e-mail já existe: 409).
function preparar({ nome, email, telefone }) {
  const dados = {
    nome: (nome ?? '').trim(),
    email: (email ?? '').trim().toLowerCase(),
    telefone: (telefone ?? '').trim() || null,
  };
  if (!dados.nome) throw new Error('Informe o nome.');
  if (!dados.email) throw new Error('Informe o e-mail.');
  if (!/^\S+@\S+\.\S+$/.test(dados.email)) throw new Error('E-mail inválido.');
  return dados;
}

export const pacienteService = {
  listar() {
    return api.get('/pacientes');
  },

  async criar(dados) {
    return api.post('/pacientes', preparar(dados));
  },

  async atualizar(id, dados) {
    return api.put(`/pacientes/${id}`, preparar(dados));
  },

  remover(id) {
    return api.delete(`/pacientes/${id}`);
  },
};
