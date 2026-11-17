// Ponto de entrada: liga store, service e view. Nenhuma regra mora aqui.
import { criarStore } from './state/store.js';
import { pacienteService } from './services/pacienteService.js';
import { pacienteView } from './ui/pacienteView.js';
import { consultaService } from './services/consultaService.js';
import { consultaView } from './ui/consultaView.js';
import { aviso } from './ui/aviso.js';

// ===================== PACIENTES =====================
const pacientes = criarStore({
  status: 'carregando', // 'carregando' | 'erro' | 'vazio' | 'sucesso'
  pacientes: [],
  erro: null,
  editandoId: null,
  salvando: false,
});

// Toda vez que o estado mudar, a view redesenha.
pacientes.assinar(pacienteView.render);

async function carregarPacientes() {
  pacientes.set({ status: 'carregando', erro: null });
  try {
    const lista = await pacienteService.listar();
    pacientes.set({ status: lista.length ? 'sucesso' : 'vazio', pacientes: lista });
  } catch (e) {
    pacientes.set({ status: 'erro', erro: e.message });
  }
}

async function salvarPaciente(dados) {
  const { editandoId } = pacientes.get();
  aviso.limpar();
  pacientes.set({ salvando: true });
  try {
    if (editandoId) await pacienteService.atualizar(editandoId, dados);
    else await pacienteService.criar(dados);

    aviso.sucesso(editandoId ? 'Paciente atualizado.' : 'Paciente cadastrado.');
    pacienteView.limparForm();
    pacientes.set({ editandoId: null });
    await carregarPacientes();
  } catch (e) {
    aviso.erro(e.message); // o formulário fica como está, para corrigir
  } finally {
    pacientes.set({ salvando: false });
  }
}

function editarPaciente(id) {
  const paciente = pacientes.get().pacientes.find((p) => p.id === id);
  pacienteView.preencherForm(paciente);
  pacientes.set({ editandoId: id });
}

function cancelarEdicaoPaciente() {
  pacienteView.limparForm();
  pacientes.set({ editandoId: null });
}

async function removerPaciente(id) {
  if (!confirm(`Remover o paciente #${id}?`)) return;
  aviso.limpar();
  try {
    await pacienteService.remover(id);
    aviso.sucesso('Paciente removido.');
    if (pacientes.get().editandoId === id) cancelarEdicaoPaciente();
    await carregarPacientes();
  } catch (e) {
    aviso.erro(e.message); // ex.: 409 "Paciente possui consultas…"
  }
}

pacienteView.aoEnviar(salvarPaciente);
pacienteView.aoCancelar(cancelarEdicaoPaciente);
pacienteView.aoRecarregar(carregarPacientes);
pacienteView.aoClicarNaLista({ editar: editarPaciente, remover: removerPaciente });

// ===================== CONSULTAS =====================
const consultas = criarStore({
  status: 'carregando',
  consultas: [],
  erro: null,
  editandoId: null,
  salvando: false,
});

consultas.assinar(consultaView.render);

// As consultas dependem dos pacientes: mudou a lista de pacientes,
// refaz o <select> e redesenha os nomes na tabela de consultas.
pacientes.assinar((estado) => {
  consultaView.preencherPacientes(estado.pacientes);
  consultaView.render(consultas.get());
});

async function carregarConsultas() {
  consultas.set({ status: 'carregando', erro: null });
  try {
    const lista = await consultaService.listar();
    consultas.set({ status: lista.length ? 'sucesso' : 'vazio', consultas: lista });
  } catch (e) {
    consultas.set({ status: 'erro', erro: e.message });
  }
}

async function salvarConsulta(dados) {
  const { editandoId } = consultas.get();
  aviso.limpar();
  consultas.set({ salvando: true });
  try {
    if (editandoId) await consultaService.atualizar(editandoId, dados);
    else await consultaService.criar(dados);

    aviso.sucesso(editandoId ? 'Consulta atualizada.' : 'Consulta agendada.');
    consultaView.limparForm();
    consultas.set({ editandoId: null });
    await carregarConsultas();
  } catch (e) {
    aviso.erro(e.message);
  } finally {
    consultas.set({ salvando: false });
  }
}

function editarConsulta(id) {
  const consulta = consultas.get().consultas.find((c) => c.id === id);
  consultaView.preencherForm(consulta);
  consultas.set({ editandoId: id });
}

function cancelarEdicaoConsulta() {
  consultaView.limparForm();
  consultas.set({ editandoId: null });
}

async function removerConsulta(id) {
  if (!confirm(`Remover a consulta #${id}?`)) return;
  aviso.limpar();
  try {
    await consultaService.remover(id);
    aviso.sucesso('Consulta removida.');
    if (consultas.get().editandoId === id) cancelarEdicaoConsulta();
    await carregarConsultas();
  } catch (e) {
    aviso.erro(e.message);
  }
}

consultaView.aoEnviar(salvarConsulta);
consultaView.aoCancelar(cancelarEdicaoConsulta);
consultaView.aoRecarregar(carregarConsultas);
consultaView.aoClicarNaLista({ editar: editarConsulta, remover: removerConsulta });

// ===================== INÍCIO =====================
carregarPacientes();
carregarConsultas();
