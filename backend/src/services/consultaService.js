import { consultaModel } from '../models/consultaModel.js';
import { pacienteModel } from '../models/pacienteModel.js';
import { erro } from '../utils/erro.js';

const STATUS = ['agendada', 'confirmada', 'cancelada'];

function validarStatus(status) {
  if (!STATUS.includes(status)) throw erro(400, `Status deve ser um de: ${STATUS.join(', ')}`);
}

function validarDataHora(dataHora) {
  if (Number.isNaN(Date.parse(dataHora))) {
    throw erro(400, 'Campo "dataHora" deve ser uma data válida (ex.: 2026-12-01T14:30)');
  }
}

function validarPaciente(pacienteId) {
  if (!pacienteModel.buscarPorId(Number(pacienteId))) throw erro(422, 'Paciente informado não existe');
}

export const consultaService = {
  listar(pacienteId) {
    if (pacienteId) return consultaModel.listarPorPaciente(Number(pacienteId));
    return consultaModel.listar();
  },

  buscarPorId(id) {
    const consulta = consultaModel.buscarPorId(id);
    if (!consulta) throw erro(404, 'Consulta não encontrada');
    return consulta;
  },

  criar({ pacienteId, dataHora, motivo, status = 'agendada' } = {}) {
    // Regra 1: campos obrigatórios
    if (!pacienteId || !dataHora || !motivo) {
      throw erro(400, 'Campos "pacienteId", "dataHora" e "motivo" são obrigatórios');
    }
    // Regra 2: data e status válidos
    validarDataHora(dataHora);
    validarStatus(status);
    // Regra 3: o paciente precisa existir
    validarPaciente(pacienteId);
    return consultaModel.inserir({ pacienteId, dataHora, motivo, status });
  },

  atualizar(id, dados = {}) {
    this.buscarPorId(id); // 404 se não existe
    if (dados.dataHora !== undefined) validarDataHora(dados.dataHora);
    if (dados.status !== undefined) validarStatus(dados.status);
    if (dados.pacienteId !== undefined) {
      validarPaciente(dados.pacienteId);
      dados = { ...dados, pacienteId: Number(dados.pacienteId) };
    }
    return consultaModel.atualizar(id, dados);
  },

  remover(id) {
    const removida = consultaModel.remover(id);
    if (!removida) throw erro(404, 'Consulta não encontrada');
  },
};
