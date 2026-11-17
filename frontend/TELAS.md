# Telas do Projeto 1 (S4)

Front: `npx http-server -p 5500 -c-1` em `frontend/` · API: `npm run dev` em `backend/` · abrir http://localhost:5500

Domínio: agendamento de consultas em uma clínica · entidades: **Paciente** (pai) e **Consulta** (filho, escolhe o paciente em um `<select>`).

## Os quatro estados de cada lista

| Lista | Estado | Como provocar | O que aparece |
|---|---|---|---|
| Pacientes | carregando | DevTools → Network → throttling **3G** → F5 | spinner "Carregando pacientes…" |
| Pacientes | vazio | API recém-iniciada → F5 | "Nenhum paciente ainda. Cadastre o primeiro no formulário." |
| Pacientes | erro | Ctrl+C na API → F5 | "Não consegui falar com a API. Ela está rodando?" + botão **Tentar de novo** |
| Pacientes | sucesso | cadastrar Maria Souza, maria@email.com | tabela com 1 linha |
| Consultas | carregando | throttling 3G → F5 | spinner "Carregando consultas…" |
| Consultas | vazio | sem consultas | "Nenhuma consulta ainda. Cadastre um paciente e agende a primeira." |
| Consultas | erro | Ctrl+C na API → F5 | "Não consegui falar com a API. Ela está rodando?" + botão **Tentar de novo** |
| Consultas | sucesso | escolher Maria Souza no `<select>`, 01/12/2026 14:30, "Consulta de rotina" | tabela mostra o **nome** do paciente, `01/12/2026, 14:30` e o selo "Agendada" |

## Erros de regra

| Origem | Como provocar | O que aparece (aviso vermelho) |
|---|---|---|
| backend · 409 | cadastrar outro paciente com o e-mail `maria@email.com` | "Já existe um paciente com este e-mail" (o formulário continua preenchido) |
| backend · 409 | editar o João e trocar o e-mail para `maria@email.com` | "Já existe um paciente com este e-mail" |
| backend · 409 | remover a Maria enquanto ela tem uma consulta | "Paciente possui consultas e não pode ser removido" |
| front (sem requisição) | e-mail `maria` | "E-mail inválido." |
| front (sem requisição) | agendar sem escolher paciente | "Selecione o paciente." |

## Outros testes feitos

- **XSS:** paciente com nome `<b onmouseover=alert(1)>X</b>` aparece como texto na tabela e no `<select>`; nenhuma tag é criada.
- **Editar:** a linha em edição fica amarela e o botão vira "Salvar alterações"; ao editar uma consulta, o formulário volta preenchido (paciente, data, motivo, status).
- **Remover:** `confirm()` antes; cancelar não envia nada; confirmar envia `DELETE` → 204.
- **CORS:** na aba Network, cada `POST`/`PUT`/`DELETE` é precedido de um `OPTIONS` respondido pelo middleware `cors` do backend.

## Camadas

- api: `js/api.js` · config: `js/config.js`
- services: `js/services/pacienteService.js`, `js/services/consultaService.js` (limpam e validam antes de enviar)
- state: `js/state/store.js` (um store por lista)
- ui: `js/ui/pacienteView.js`, `js/ui/consultaView.js`, `js/ui/aviso.js`
- `js/main.js` liga tudo; não tem `fetch` nem `document.`
