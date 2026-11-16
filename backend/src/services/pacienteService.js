import { pacienteModel } from '../models/pacienteModel.js';
import { consultaModel } from '../models/consultaModel.js';
import { erro } from '../utils/erro.js';

export const pacienteService = {
  listar() {
    return pacienteModel.listar();
  },

  buscarPorId(id) {
    const paciente = pacienteModel.buscarPorId(id);
    if (!paciente) throw erro(404, 'Paciente não encontrado');
    return paciente;
  },

  criar({ nome, email, telefone } = {}) {
    // Regra 1: nome e email são obrigatórios
    if (!nome || !email) throw erro(400, 'Campos "nome" e "email" são obrigatórios');
    // Regra 2: email é único
    if (pacienteModel.buscarPorEmail(email)) throw erro(409, 'Já existe um paciente com este e-mail');
    return pacienteModel.inserir({ nome, email, telefone });
  },

  atualizar(id, dados = {}) {
    this.buscarPorId(id); // 404 se não existe
    // Regra 2 também vale na edição: o email não pode ser de outro paciente
    if (dados.email) {
      const dono = pacienteModel.buscarPorEmail(dados.email);
      if (dono && dono.id !== id) throw erro(409, 'Já existe um paciente com este e-mail');
    }
    return pacienteModel.atualizar(id, dados);
  },

  remover(id) {
    this.buscarPorId(id); // 404 se não existe
    // Regra 3: paciente com consultas não pode ser removido
    if (consultaModel.listarPorPaciente(id).length > 0) {
      throw erro(409, 'Paciente possui consultas e não pode ser removido');
    }
    pacienteModel.remover(id);
  },
};
