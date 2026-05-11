# Academia Manager API

API em ASP.NET Core para autenticacao e gestao de alunos, planos, treinos e pagamentos da aplicacao Academia Manager.

## Stack

- ASP.NET Core
- Entity Framework Core
- PostgreSQL
- JWT Bearer Authentication
- xUnit

## Estrutura

```txt
backend/
  src/
    AcademiaManager.Api/
    AcademiaManager.Application/
    AcademiaManager.Domain/
    AcademiaManager.Infrastructure/
  tests/
```

## Supabase PostgreSQL

O backend usa PostgreSQL via Npgsql/EF Core. Nao coloque senha do Supabase em `appsettings.json`.

## Pre-requisitos

- .NET SDK 9
- Banco PostgreSQL acessivel
- `Jwt:Secret` com pelo menos 32 caracteres

## Configuracao local recomendada

```powershell
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=aws-0-sa-east-1.pooler.supabase.com;Port=6543;Database=postgres;Username=postgres.<project-ref>;Password=<password>;Ssl Mode=Require;Trust Server Certificate=true" --project src\AcademiaManager.Api
dotnet user-secrets set "Jwt:Secret" "<minimo-32-caracteres-aleatorios>" --project src\AcademiaManager.Api
```

Em producao, use variaveis de ambiente:

```text
ConnectionStrings__DefaultConnection=Host=...;Port=6543;Database=postgres;Username=postgres.<project-ref>;Password=...;Ssl Mode=Require;Trust Server Certificate=true
Jwt__Secret=<minimo-32-caracteres-aleatorios>
Database__Provider=Postgres
```

## Rodar localmente

```powershell
dotnet run --project src\AcademiaManager.Api --urls http://localhost:5123
```

## Build e testes

```powershell
dotnet build AcademiaManagerApi.sln
dotnet test AcademiaManagerApi.sln
```

## Migrations

```powershell
dotnet ef database update --project src\AcademiaManager.Infrastructure --startup-project src\AcademiaManager.Api
```

## Endpoints locais

- API: `http://localhost:5123`
- Health check: `http://localhost:5123/health`
- Swagger: `http://localhost:5123/swagger`
- OpenAPI JSON: `http://localhost:5123/swagger/v1/swagger.json`

## Observacoes

- A API nao deve iniciar em producao sem `Jwt:Secret` valido.
- O provider padrao atual e PostgreSQL.
- O frontend deste workspace espera a API em `http://localhost:5123`.
