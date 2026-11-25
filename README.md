# Clínica · Agendamentos

Sistema para uma clínica organizar seus pacientes e as consultas de cada um: cadastro, agendamento, confirmação e cancelamento.
Projeto 1 da disciplina Programação Web (UEPB, 2026.2) · Prof. Rodrigo Alves Costa.

- **Aplicação:** _(link da Vercel — etapa 6)_
- **API:** _(link do Render — etapa 5)_
- **Vídeo de apresentação:** _(link — etapa 8)_

> A API está no plano grátis do Render: o primeiro acesso pode levar cerca de
> um minuto, e os dados voltam aos de exemplo a cada reinício do serviço.

## Tecnologias

- Backend: Node.js 22+, Express 5, SQLite (`node:sqlite`, SQL puro)
- Frontend: HTML, CSS, Bootstrap 5, JavaScript puro (ES Modules, `fetch`)

## Como rodar localmente

Pré-requisito: Node.js 22 ou superior.

```bash
# 1. API
cd backend
npm install
cp .env.example .env
npm run dev                      # http://localhost:3000

# 2. Frontend (em outro terminal)
cd frontend
npx http-server -p 5500 -c-1     # http://localhost:5500
```

Na primeira execução, o `backend/banco.db` é criado com três pacientes e três consultas de exemplo (dados fictícios).

### Variáveis de ambiente (`backend/.env`)

| Variável | Padrão | Para que serve |
|---|---|---|
| `PORT` | `3000` | porta da API |
| `DB_FILE` | `banco.db` | arquivo do SQLite |
| `CORS_ORIGIN` | `http://localhost:5500,http://127.0.0.1:5500` | origens do front liberadas no CORS (separadas por vírgula) |

## Rotas da API

| Método | Rota | O que faz | Respostas |
|---|---|---|---|
| GET | / | Health check (nome da API e rotas) | 200 |
| GET | /pacientes | Lista os pacientes | 200 |
| POST | /pacientes | Cadastra um paciente | 201, 400, 409 |
| GET | /pacientes/:id | Busca um paciente | 200, 404 |
| PUT | /pacientes/:id | Atualiza um paciente | 200, 404, 409 |
| DELETE | /pacientes/:id | Remove um paciente | 204, 404, 409 |
| GET | /consultas | Lista as consultas (`?pacienteId=1` filtra por paciente) | 200 |
| POST | /consultas | Agenda uma consulta | 201, 400, 422 |
| GET | /consultas/:id | Busca uma consulta | 200, 404 |
| PUT | /consultas/:id | Atualiza uma consulta (ex.: confirmar, cancelar) | 200, 400, 404, 422 |
| DELETE | /consultas/:id | Remove uma consulta | 204, 404 |

Erros seguem o formato `{ "erro": "mensagem" }`. Exemplos de requisições e respostas em [backend/TESTES.md](backend/TESTES.md).

## Regras de negócio

- Paciente: `nome` e `email` são obrigatórios → **400**.
- Paciente: o `email` é único, ao cadastrar e ao editar → **409**.
- Paciente com consultas não pode ser removido → **409** (o banco também barra, pela chave estrangeira).
- Consulta: `pacienteId`, `dataHora` e `motivo` são obrigatórios → **400**.
- Consulta: `dataHora` precisa ser uma data válida → **400**.
- Consulta: `status` precisa ser `agendada`, `confirmada` ou `cancelada` → **400** (o banco também barra, com `CHECK`).
- Consulta: o paciente informado precisa existir → **422**.

## Estrutura

```
backend/
  src/
    routes/        mapeia URL → controller
    controllers/   lê a requisição, chama o service, responde
    services/      regras de negócio
    models/        acesso ao banco (SQL com ?)
    middleware/    logger e tratamento de erros
    utils/         fábrica de erros com status
    db.js          conexão, schema e dados de exemplo do SQLite
  TESTES.md        requisições de teste (S3)
frontend/
  index.html       estrutura + Bootstrap
  js/
    api.js         camada HTTP (fetch)
    services/      regras da tela (limpar e validar)
    state/         estado da aplicação (store)
    ui/            desenho da tela e eventos
    main.js        liga as camadas
  TELAS.md         os quatro estados de cada lista (S4)
MODELAGEM.md       modelagem de classes (S2)
s1/ … s4/          exercícios das semanas (POO, smells, banco-api, banco-frontend)
```

## Autora

Letícia Montenegro · UEPB
