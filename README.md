# Academia Manager

Aplicacao organizada como monorepo com frontend e backend separados na mesma pasta.

O projeto implementa um dashboard web para operacoes de academia com autenticacao baseada em JWT, consumo de API REST e modulos de gestao para alunos, planos, treinos e pagamentos.

## Estrutura

```txt
AcademiaManager/
  frontend/  # React + Vite + TypeScript
  backend/   # ASP.NET Core + EF Core + PostgreSQL
```

## Arquitetura

O repositorio esta dividido em duas aplicacoes independentes:

- `frontend/`: SPA em React responsavel por autenticacao, navegacao, formularios, tabelas, filtros e consumo da API
- `backend/`: API em ASP.NET Core com separacao em camadas para regras de negocio, persistencia, autenticacao e exposicao HTTP

### Frontend

- Build tool: Vite
- UI: React 19 + TypeScript
- Roteamento: React Router
- Estado assinado ao servidor: TanStack Query
- Estado de sessao: Redux Toolkit
- Formularios e validacao: React Hook Form + Zod
- Estilizacao: Tailwind CSS
- Testes: Vitest + Testing Library

Organizacao principal:

- `frontend/src/app`: bootstrap da aplicacao, providers, layouts e roteamento
- `frontend/src/features`: modulos por dominio como `auth`, `students`, `plans`, `trainings` e `payments`
- `frontend/src/shared`: cliente HTTP, utilitarios, componentes reutilizaveis e configuracoes comuns
- `frontend/docs`: documentacao de contrato, arquitetura e escopo funcional

### Backend

- Runtime: ASP.NET Core
- Persistencia: Entity Framework Core
- Banco: PostgreSQL
- Autenticacao: JWT Bearer
- Testes: xUnit

Organizacao principal:

- `backend/src/AcademiaManager.Api`: endpoints HTTP, middlewares e composicao da aplicacao
- `backend/src/AcademiaManager.Application`: casos de uso, contratos e validacoes
- `backend/src/AcademiaManager.Domain`: entidades, enums e value objects
- `backend/src/AcademiaManager.Infrastructure`: acesso a dados, autenticacao JWT, repositorios e migrations
- `backend/tests`: testes unitarios e de integracao

## Stack

- Frontend: React, TypeScript, Vite, React Router, TanStack Query, React Hook Form, Zod, Redux Toolkit, Tailwind CSS, Vitest
- Backend: ASP.NET Core, Entity Framework Core, PostgreSQL, JWT, xUnit

## Pre-requisitos

- Node.js 24+
- .NET SDK 9
- PostgreSQL acessivel para o backend

## Fluxo de integracao

- O frontend consome a API via `VITE_API_BASE_URL`
- O backend expoe Swagger e contrato OpenAPI em ambiente local
- O fluxo de autenticacao usa `accessToken` e `refreshToken`
- O frontend aplica protecao de rotas e restricao por papel conforme as respostas da API

## Como rodar localmente

1. Inicie o backend:

```powershell
cd backend
dotnet run --project src\AcademiaManager.Api --urls http://localhost:5123
```

2. Em outro terminal, inicie o frontend:

```powershell
cd frontend
Copy-Item .env.example .env
npm install
npm run dev
```

3. Acesse a aplicacao no navegador:

```txt
http://localhost:5173
```

## Endpoints locais

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5123`
- Swagger: `http://localhost:5123/swagger`
- OpenAPI JSON: `http://localhost:5123/swagger/v1/swagger.json`

## Configuracao

### Frontend

Arquivo `.env` esperado em `frontend/`:

```text
VITE_API_BASE_URL=http://localhost:5123
```

### Backend

O backend exige configuracao de conexao com banco e segredo JWT. Exemplo com `user-secrets`:

```powershell
cd backend
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "<connection-string>" --project src\AcademiaManager.Api
dotnet user-secrets set "Jwt:Secret" "<segredo-com-pelo-menos-32-caracteres>" --project src\AcademiaManager.Api
```

## Validacao tecnica

Frontend:

```powershell
cd frontend
npm run lint
npm run build
npm run test
```

Backend:

```powershell
cd backend
dotnet build AcademiaManagerApi.sln
dotnet test AcademiaManagerApi.sln
```

## Funcionalidades implementadas

- Autenticacao com login, cadastro, refresh de token e protecao de rotas
- Dashboard com metricas e componentes de resumo
- CRUD de planos
- CRUD de alunos
- CRUD de treinos
- CRUD de pagamentos
- Controle de permissao por papel
- Filtros, ordenacao e sincronizacao parcial de estado com URL em modulos do frontend
- Validacoes no frontend e no backend

## Observacoes tecnicas

- O frontend usa `VITE_API_BASE_URL=http://localhost:5123`.
- O backend exige `Jwt:Secret` com pelo menos 32 caracteres.
- Segredos e arquivos locais nao devem ser versionados.
- O repositorio foi reorganizado como monorepo, mantendo frontend e backend sob a mesma raiz para facilitar desenvolvimento e publicacao.
