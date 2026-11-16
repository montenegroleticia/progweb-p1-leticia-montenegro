# Testes da API — Projeto 1 (S3)

API: Clínica API (agendamento de consultas) · entidades: **Paciente** e **Consulta** (1 paciente → N consultas) · servidor: `npm run dev` em http://localhost:3000

Rode **nesta ordem** com o servidor recém-iniciado (a memória zera a cada reinício, e os ids dependem da ordem).

| # | Método | URL | Body | Status obtido | Observação |
|---|---|---|---|---|---|
| 1 | GET | / | — | 200 | health check |
| 2 | POST | /pacientes | {"nome":"Maria Souza","email":"maria@email.com","telefone":"(83) 99999-0001"} | 201 | cria o paciente 1 |
| 3 | POST | /pacientes | {"nome":"João Lima","email":"joao@email.com"} | 201 | cria o paciente 2 (telefone opcional) |
| 4 | GET | /pacientes | — | 200 | lista com 2 |
| 5 | GET | /pacientes/1 | — | 200 | |
| 6 | GET | /pacientes/99 | — | 404 | paciente inexistente |
| 7 | POST | /pacientes | {"nome":"Maria Dup","email":"maria@email.com"} | 409 | regra: e-mail único |
| 8 | POST | /pacientes | {"nome":"Sem Email"} | 400 | regra: nome e e-mail obrigatórios |
| 9 | PUT | /pacientes/2 | {"email":"maria@email.com"} | 409 | regra: e-mail único também na edição |
| 10 | PUT | /pacientes/1 | {"telefone":"(83) 98888-0002"} | 200 | atualiza o telefone |
| 11 | POST | /consultas | {"pacienteId":1,"dataHora":"2026-12-01T14:30","motivo":"Consulta de rotina"} | 201 | status padrão "agendada" |
| 12 | POST | /consultas | {"pacienteId":999,"dataHora":"2026-12-01T14:30","motivo":"Retorno"} | 422 | regra: o paciente precisa existir |
| 13 | POST | /consultas | {"pacienteId":1,"dataHora":"2026-12-02T09:00","motivo":"Retorno","status":"remarcada"} | 400 | regra: status ∈ agendada, confirmada, cancelada |
| 14 | POST | /consultas | {"pacienteId":1,"dataHora":"amanha","motivo":"Retorno"} | 400 | regra: dataHora precisa ser uma data válida |
| 15 | GET | /consultas?pacienteId=1 | — | 200 | filtro 1:N (lista com 1) |
| 16 | PUT | /consultas/1 | {"status":"confirmada"} | 200 | confirma a consulta |
| 17 | GET | /consultas/99 | — | 404 | consulta inexistente |
| 18 | DELETE | /pacientes/1 | — | 409 | regra: paciente com consultas não pode ser removido |
| 19 | DELETE | /consultas/1 | — | 204 | |
| 20 | DELETE | /pacientes/1 | — | 204 | agora sem consultas, pode remover |
| 21 | GET | /pacientes/1 | — | 404 | confirma a remoção |

## Regras de negócio por service

- **pacienteService:** `nome` e `email` obrigatórios (400); `email` único na criação e na edição (409); paciente com consultas não pode ser removido (409).
- **consultaService:** `pacienteId`, `dataHora` e `motivo` obrigatórios (400); `dataHora` precisa ser uma data válida (400); `status` dentro da lista (400); o paciente precisa existir (422).

> O `Medico` da modelagem fica para uma próxima etapa; hoje a consulta liga só ao paciente.
