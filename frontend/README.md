# Academia Manager Frontend

Dashboard em React para a `AcademiaManager.Api`.

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

URL padrao do frontend:

```txt
http://localhost:5173
```

## Fluxo recomendado

1. Suba o backend primeiro em `http://localhost:5123`.
2. Rode `npm run dev`.
3. Acesse `http://localhost:5173`.
4. Use o Swagger do backend para validar contratos e payloads.

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

## Status atual

Implementado:

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

## Validacao

```powershell
npm run build
npm run test
```
