# Academia Manager API

API em ASP.NET Core para autenticação e gestão de alunos, planos, treinos e pagamentos da aplicação Academia Manager.

O backend expõe uma API REST consumida pelo frontend do mesmo workspace e concentra regras de negócio, persistência, autenticação e composição da aplicação.

## Responsabilidades

- autenticação com JWT
- gerenciamento de alunos, planos, treinos e pagamentos
- validação de entrada
- persistência em PostgreSQL
- exposição de endpoints HTTP e contrato OpenAPI
- execução de migrations e testes

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

- `AcademiaManager.Api`: controllers, middleware, bootstrap e configuração HTTP
- `AcademiaManager.Application`: serviços de aplicação, DTOs, interfaces e validações
- `AcademiaManager.Domain`: entidades, enums e value objects
- `AcademiaManager.Infrastructure`: acesso ao banco, autenticação JWT, repositórios e migrations

Essa organização separa as regras de negócio, os detalhes de infraestrutura e a camada de entrega HTTP.

## Supabase PostgreSQL

O backend usa PostgreSQL via Npgsql/EF Core. Não coloque a senha do Supabase em `appsettings.json`.

## Pré-requisitos

- .NET SDK 9
- banco PostgreSQL acessível
- `Jwt:Secret` com pelo menos 32 caracteres

## Configuração local recomendada

```powershell
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=aws-0-sa-east-1.pooler.supabase.com;Port=6543;Database=postgres;Username=postgres.<project-ref>;Password=<password>;Ssl Mode=Require;Trust Server Certificate=true" --project src\AcademiaManager.Api
dotnet user-secrets set "Jwt:Secret" "<minimo-32-caracteres-aleatorios>" --project src\AcademiaManager.Api
```

Em produção, use variáveis de ambiente:

```text
ConnectionStrings__DefaultConnection=Host=...;Port=6543;Database=postgres;Username=postgres.<project-ref>;Password=...;Ssl Mode=Require;Trust Server Certificate=true
Jwt__Secret=<minimo-32-caracteres-aleatorios>
Database__Provider=Postgres
```

## Pipeline de inicialização

Durante a inicialização da API:

- a configuração é carregada
- a autenticação JWT é registrada
- o banco e o provider são resolvidos
- as migrations são aplicadas no startup
- os endpoints e middlewares são expostos

## Rodar localmente

```powershell
dotnet run --project src\AcademiaManager.Api --urls http://localhost:5123
```

## Endpoints e observabilidade local

- API: `http://localhost:5123`
- Health check: `http://localhost:5123/health`
- Swagger: `http://localhost:5123/swagger`
- OpenAPI JSON: `http://localhost:5123/swagger/v1/swagger.json`

O Swagger deve ser usado como referência local para payloads, respostas e testes manuais.

## Build e testes

```powershell
dotnet build AcademiaManagerApi.sln
dotnet test AcademiaManagerApi.sln
```

## Fluxo de dados

- os controllers recebem a requisição
- DTOs e validadores processam a entrada
- os serviços de aplicação orquestram os casos de uso
- os repositórios e o `AppDbContext` persistem os dados
- a resposta volta em formato consistente para o frontend

## Migrations

```powershell
dotnet ef database update --project src\AcademiaManager.Infrastructure --startup-project src\AcademiaManager.Api
```

## Observações

- A API não deve iniciar em produção sem `Jwt:Secret` válido.
- O provider padrão atual é PostgreSQL.
- O frontend deste workspace espera a API em `http://localhost:5123`.
- O backend já possui testes unitários e estrutura pronta para a evolução dos testes de integração.
