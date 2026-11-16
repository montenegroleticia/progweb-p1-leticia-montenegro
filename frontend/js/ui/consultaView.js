// Camada de UI das consultas. Mesmo molde da pacienteView, com um <select> a mais.
const el = {
  form: document.querySelector('#form-consulta'),
  paciente: document.querySelector('#con-paciente'),
  salvar: document.querySelector('#con-salvar'),
  cancelar: document.querySelector('#con-cancelar'),
  carregando: document.querySelector('#consultas-carregando'),
  erro: document.querySelector('#consultas-erro'),
  erroMsg: document.querySelector('#consultas-erro-msg'),
  recarregar: document.querySelector('#consultas-recarregar'),
  vazio: document.querySelector('#consultas-vazio'),
  sucesso: document.querySelector('#consultas-sucesso'),
  linhas: document.querySelector('#consultas-linhas'),
};

const dataHoraBR = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
const STATUS = {
  agendada: { texto: 'Agendada', classe: 'text-bg-secondary' },
  confirmada: { texto: 'Confirmada', classe: 'text-bg-success' },
  cancelada: { texto: 'Cancelada', classe: 'text-bg-danger' },
};

// id → nome, para mostrar o paciente sem outra requisição
let nomeDoPaciente = new Map();

function celula(texto, classe = '') {
  const td = document.createElement('td');
  td.textContent = texto;
  td.className = classe;
  return td;
}

function botao(texto, acao, id, classe) {
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = texto;
  b.className = `btn btn-sm ${classe}`;
  b.dataset.acao = acao;
  b.dataset.id = id;
  return b;
}

function formatarDataHora(dataHora) {
  const data = new Date(dataHora);
  return Number.isNaN(data.getTime()) ? dataHora : dataHoraBR.format(data);
}

function selo(status) {
  const info = STATUS[status] ?? { texto: status, classe: 'text-bg-light' };
  const span = document.createElement('span');
  span.className = `badge ${info.classe}`;
  span.textContent = info.texto;
  return span;
}

function linha(consulta, editandoId) {
  const tr = document.createElement('tr');
  if (consulta.id === editandoId) tr.className = 'editando';

  const paciente = nomeDoPaciente.get(consulta.pacienteId) ?? `paciente #${consulta.pacienteId}`;

  const situacao = celula('');
  situacao.append(selo(consulta.status));

  const acoes = celula('', 'text-end text-nowrap');
  acoes.append(
    botao('Editar', 'editar', consulta.id, 'btn-outline-primary me-1'),
    botao('Remover', 'remover', consulta.id, 'btn-outline-danger'),
  );

  tr.append(
    celula(consulta.id),
    celula(paciente),
    celula(formatarDataHora(consulta.dataHora), 'numero text-nowrap'),
    celula(consulta.motivo),
    situacao,
    acoes,
  );
  return tr;
}

export const consultaView = {
  // Preenche o <select> com os pacientes que existem agora
  preencherPacientes(pacientes) {
    nomeDoPaciente = new Map(pacientes.map((p) => [p.id, p.nome]));
    const escolhido = el.paciente.value;

    const opcoes = pacientes.map((p) => new Option(`${p.nome} (#${p.id})`, p.id));
    el.paciente.replaceChildren(new Option('Selecione…', ''), ...opcoes);

    // mantém a escolha, se o paciente ainda existir
    if (nomeDoPaciente.has(Number(escolhido))) el.paciente.value = escolhido;
  },

  render({ status, consultas, erro, editandoId, salvando }) {
    el.carregando.classList.toggle('d-none', status !== 'carregando');
    el.erro.classList.toggle('d-none', status !== 'erro');
    el.vazio.classList.toggle('d-none', status !== 'vazio');
    el.sucesso.classList.toggle('d-none', status !== 'sucesso');

    el.erroMsg.textContent = erro ?? '';
    el.linhas.replaceChildren(...consultas.map((c) => linha(c, editandoId)));

    el.salvar.disabled = salvando;
    el.salvar.textContent = salvando
      ? 'Salvando…'
      : editandoId ? 'Salvar alterações' : 'Agendar consulta';
    el.cancelar.classList.toggle('d-none', !editandoId);
  },

  preencherForm(consulta) {
    el.form.pacienteId.value = consulta.pacienteId;
    el.form.dataHora.value = consulta.dataHora.slice(0, 16); // formato do datetime-local
    el.form.motivo.value = consulta.motivo;
    el.form.status.value = consulta.status;
    el.form.motivo.focus();
  },

  limparForm() {
    el.form.reset();
  },

  aoEnviar(fn) {
    el.form.addEventListener('submit', (evento) => {
      evento.preventDefault();
      fn(Object.fromEntries(new FormData(el.form)));
    });
  },

  aoCancelar(fn) {
    el.cancelar.addEventListener('click', fn);
  },

  aoRecarregar(fn) {
    el.recarregar.addEventListener('click', fn);
  },

  aoClicarNaLista({ editar, remover }) {
    el.linhas.addEventListener('click', (evento) => {
      const alvo = evento.target.closest('button[data-acao]');
      if (!alvo) return;
      const id = Number(alvo.dataset.id);
      if (alvo.dataset.acao === 'editar') editar(id);
      if (alvo.dataset.acao === 'remover') remover(id);
    });
  },
};
