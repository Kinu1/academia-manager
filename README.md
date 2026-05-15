# Academia Manager

Aplicação organizada como um monorepo, com frontend e backend separados na mesma raiz.

O projeto implementa um dashboard web para operações de academia, com autenticação baseada em JWT, consumo de API REST e módulos de gestão de alunos, planos, treinos e pagamentos.

## Estrutura

```txt
AcademiaManager/
  frontend/  # React + Vite + TypeScript
  backend/   # ASP.NET Core + EF Core + PostgreSQL
```

## Arquitetura

O repositório está dividido em duas aplicações independentes:

- `frontend/`: SPA em React responsável por autenticação, navegação, formulários, tabelas, filtros e consumo da API.
- `backend/`: API em ASP.NET Core organizada em camadas para regras de negócio, persistência, autenticação e exposição HTTP.

### Frontend

- Build tool: Vite
- UI: React 19 + TypeScript
- Roteamento: React Router
- Estado sincronizado com o servidor: TanStack Query
- Estado de sessão: Redux Toolkit
- Formulários e validação: React Hook Form + Zod
- Estilização: Tailwind CSS
- Testes: Vitest + Testing Library

Organização principal:

- `frontend/src/app`: bootstrap da aplicação, providers, layouts e roteamento
- `frontend/src/features`: módulos por domínio, como `auth`, `students`, `plans`, `trainings` e `payments`
- `frontend/src/shared`: cliente HTTP, utilitários, componentes reutilizáveis e configurações comuns
- `frontend/docs`: documentação de contrato, arquitetura e escopo funcional

### Backend

- Runtime: ASP.NET Core
- Persistência: Entity Framework Core
- Banco: PostgreSQL
- Autenticação: JWT Bearer
- Testes: xUnit

Organização principal:

- `backend/src/AcademiaManager.Api`: endpoints HTTP, middlewares e composição da aplicação
- `backend/src/AcademiaManager.Application`: casos de uso, contratos e validações
- `backend/src/AcademiaManager.Domain`: entidades, enums e value objects
- `backend/src/AcademiaManager.Infrastructure`: acesso a dados, autenticação JWT, repositórios e migrations
- `backend/tests`: testes unitários e de integração

## Stack

- Frontend: React, TypeScript, Vite, React Router, TanStack Query, React Hook Form, Zod, Redux Toolkit, Tailwind CSS, Vitest
- Backend: ASP.NET Core, Entity Framework Core, PostgreSQL, JWT, xUnit

## Pré-requisitos

- Node.js 24+
- .NET SDK 9
- PostgreSQL acessível ao backend

## Fluxo de integração

- O frontend consome a API por meio de `VITE_API_BASE_URL`.
- O backend expõe Swagger e contrato OpenAPI em ambiente local.
- O fluxo de autenticação usa `accessToken` e `refreshToken`.
- O frontend aplica proteção de rotas e restrição por papel com base nas respostas da API.

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

3. Acesse a aplicação no navegador:

```txt
http://localhost:5173
```

## Endpoints locais

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5123`
- Swagger: `http://localhost:5123/swagger`
- OpenAPI JSON: `http://localhost:5123/swagger/v1/swagger.json`

## Conta de teste

Para testar o painel administrativo em ambiente local:

```txt
Nome: admin
E-mail: admin@teste.com
Senha: admin
Perfil: Admin
```

## Configuração

### Frontend

Arquivo `.env` esperado em `frontend/`:

```text
VITE_API_BASE_URL=http://localhost:5123
```

### Backend

O backend exige configuração de conexão com o banco e segredo JWT. Exemplo com `user-secrets`:

```powershell
cd backend
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "<connection-string>" --project src\AcademiaManager.Api
dotnet user-secrets set "Jwt:Secret" "<segredo-com-pelo-menos-32-caracteres>" --project src\AcademiaManager.Api
```

## Validação técnica

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

- Autenticação com login, cadastro, refresh de token e proteção de rotas
- Dashboard com métricas e componentes de resumo
- CRUD de planos
- CRUD de alunos
- CRUD de treinos
- CRUD de pagamentos
- Controle de permissão por papel
- Filtros, ordenação e sincronização parcial do estado com a URL em módulos do frontend
- Validações no frontend e no backend

## Observações técnicas

- O frontend usa `VITE_API_BASE_URL=http://localhost:5123`.
- O backend exige `Jwt:Secret` com pelo menos 32 caracteres.
- Segredos e arquivos locais não devem ser versionados.
- O repositório foi reorganizado como monorepo, mantendo frontend e backend sob a mesma raiz para facilitar o desenvolvimento e a publicação.
