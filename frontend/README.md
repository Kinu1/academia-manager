# Academia Manager Frontend

Dashboard em React para a `AcademiaManager.Api`.

O frontend implementa a camada de apresentacao da aplicacao, com autenticacao, protecao de rotas, formularios tipados, consultas HTTP e modulos de CRUD integrados ao backend.

## Responsabilidades

- autenticacao e persistencia de sessao no cliente
- consumo da API REST via cliente HTTP centralizado
- validacao de formularios antes do envio
- protecao de telas por autenticacao e papel
- exibicao de estados de loading, erro, vazio e sucesso
- navegacao e composicao de telas por feature

## Stack

- React 19 + TypeScript
- Vite
- React Router
- TanStack Query
- Axios
- Redux Toolkit
- React Hook Form + Zod
- Tailwind CSS
- Vitest + Testing Library
- MSW e Playwright instalados para as proximas fases de testes

## Arquitetura

O frontend esta organizado por dominio funcional.

- `src/app`: inicializacao da aplicacao, providers globais, layouts e roteamento
- `src/features`: modulos como `auth`, `students`, `plans`, `trainings` e `payments`
- `src/shared`: componentes reutilizaveis, cliente HTTP, hooks, helpers e configuracoes comuns
- `docs`: contrato da API, arquitetura, escopo e decisoes de implementacao

Padroes principais:

- feature-first organization
- cliente HTTP centralizado
- estado remoto com TanStack Query
- estado de autenticacao com Redux Toolkit
- formularios com React Hook Form + Zod
- componentes reutilizaveis em `shared/ui`

## Requisitos

- Node.js 24+
- `AcademiaManager.Api` rodando em `http://localhost:5123`

Diretorio esperado do backend neste workspace:

```txt
..\backend
```

## Instalacao

```powershell
Copy-Item .env.example .env
npm install
npm run dev
```

Conteudo esperado do `.env`:

```text
VITE_API_BASE_URL=http://localhost:5123
```

## Integracao com o backend

- a base URL da API e controlada por `VITE_API_BASE_URL`
- o frontend consome endpoints REST expostos pela `AcademiaManager.Api`
- autenticacao usa `accessToken` e `refreshToken`
- rotas protegidas dependem do estado autenticado e do papel retornado pela API
- erros de API sao normalizados antes de chegar nas telas

URL padrao do frontend:

```txt
http://localhost:5173
```

## Fluxo recomendado

1. Suba o backend primeiro em `http://localhost:5123`.
2. Rode `npm run dev`.
3. Acesse `http://localhost:5173`.
4. Use o Swagger do backend para validar contratos e payloads.

## Execucao local

```powershell
Copy-Item .env.example .env
npm install
npm run dev
```

## Scripts

```powershell
npm run dev
npm run build
npm run lint
npm run test
npm run format
```

## Scripts principais

- `npm run dev`: inicia o servidor Vite
- `npm run build`: gera build de producao
- `npm run lint`: valida o codigo com ESLint
- `npm run test`: executa os testes com Vitest
- `npm run format`: formata os arquivos com Prettier

## Estrutura relevante

```txt
src/
  app/
  features/
  shared/
docs/
```

- `src/app`: providers, layout e roteamento
- `src/features`: modulos de dominio como auth, students, plans, trainings e payments
- `src/shared`: cliente HTTP, utilitarios e componentes reutilizaveis

## Funcionalidades implementadas

- Estrutura inicial com Vite, React e TypeScript
- Configuracao do Tailwind CSS
- Cliente de API com header JWT e nova tentativa apos refresh
- Estado de sessao de autenticacao com Redux
- Paginas de login e cadastro
- Layout protegido do dashboard
- Chamadas para metricas do dashboard
- CRUD de planos, alunos, treinos e pagamentos
- Controle de permissoes por papel
- Filtros e ordenacao por URL em partes da aplicacao
- Testes unitarios e de comportamento para fluxos principais

## Validacao tecnica

```powershell
npm run lint
npm run build
npm run test
```

## Observacoes tecnicas

- o frontend depende da disponibilidade do backend em `http://localhost:5123`
- o contrato principal de referencia esta em `docs/api-contract.md`
- o fluxo de autenticacao e um dos pontos centrais da aplicacao e deve permanecer isolado em modulos compartilhados
