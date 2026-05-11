# Academia Manager API

API em ASP.NET Core para autenticacao e gestao de alunos, planos, treinos e pagamentos da aplicacao Academia Manager.

O backend expone uma API REST consumida pelo frontend do mesmo workspace e concentra regras de negocio, persistencia, autenticacao e composicao da aplicacao.

## Responsabilidades

- autenticacao com JWT
- gerenciamento de alunos, planos, treinos e pagamentos
- validacao de entrada
- persistencia em PostgreSQL
- exposicao de endpoints HTTP e contrato OpenAPI
- execucao de migrations e testes

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

### Camadas

- `AcademiaManager.Api`: controllers, middleware, bootstrap e configuracao HTTP
- `AcademiaManager.Application`: servicos de aplicacao, DTOs, interfaces e validacoes
- `AcademiaManager.Domain`: entidades, enums e value objects
- `AcademiaManager.Infrastructure`: acesso ao banco, autenticacao JWT, repositorios e migrations

Esse desenho separa regra de negocio, detalhes de infraestrutura e entrega HTTP.

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

## Pipeline de inicializacao

Na subida da API:

- configuracao e carregada
- autenticacao JWT e registrada
- banco e provider sao resolvidos
- migrations sao aplicadas no startup
- endpoints e middlewares sao expostos

## Rodar localmente

```powershell
dotnet run --project src\AcademiaManager.Api --urls http://localhost:5123
```

## Endpoints e observabilidade local

- API: `http://localhost:5123`
- Health check: `http://localhost:5123/health`
- Swagger: `http://localhost:5123/swagger`
- OpenAPI JSON: `http://localhost:5123/swagger/v1/swagger.json`

O Swagger deve ser usado como referencia local para payloads, respostas e testes manuais.

## Build e testes

```powershell
dotnet build AcademiaManagerApi.sln
dotnet test AcademiaManagerApi.sln
```

## Fluxo de dados

- controllers recebem a requisicao
- DTOs e validadores processam entrada
- servicos de aplicacao orquestram casos de uso
- repositorios e `AppDbContext` persistem dados
- a resposta volta em formato consistente para o frontend

## Migrations

```powershell
dotnet ef database update --project src\AcademiaManager.Infrastructure --startup-project src\AcademiaManager.Api
```

## Observacoes

- A API nao deve iniciar em producao sem `Jwt:Secret` valido.
- O provider padrao atual e PostgreSQL.
- O frontend deste workspace espera a API em `http://localhost:5123`.
- O backend ja possui testes unitarios e estrutura pronta para evolucao de testes de integracao.
