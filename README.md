# Academia Manager

Aplicacao organizada como monorepo com frontend e backend separados na mesma pasta.

## Estrutura

```txt
AcademiaManager/
  frontend/  # React + Vite + TypeScript
  backend/   # ASP.NET Core + EF Core + PostgreSQL
```

## Stack

- Frontend: React, TypeScript, Vite, React Router, TanStack Query, React Hook Form, Zod, Redux Toolkit, Tailwind CSS, Vitest
- Backend: ASP.NET Core, Entity Framework Core, PostgreSQL, JWT, xUnit

## Pre-requisitos

- Node.js 24+
- .NET SDK 9
- PostgreSQL acessivel para o backend

## Como rodar

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

## Endpoints locais

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5123`
- Swagger: `http://localhost:5123/swagger`
- OpenAPI JSON: `http://localhost:5123/swagger/v1/swagger.json`

## Validacao

Frontend:

```powershell
cd frontend
npm run build
npm run test
```

Backend:

```powershell
cd backend
dotnet build AcademiaManagerApi.sln
dotnet test AcademiaManagerApi.sln
```

## Observacoes

- O frontend usa `VITE_API_BASE_URL=http://localhost:5123`.
- O backend exige `Jwt:Secret` com pelo menos 32 caracteres.
- Segredos e arquivos locais nao devem ser versionados.
