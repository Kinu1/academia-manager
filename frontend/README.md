# Academia Manager Frontend

Dashboard em React para a `AcademiaManager.Api`.

O frontend implementa a camada de apresentação da aplicação, com autenticação, proteção de rotas, formulários tipados, consultas HTTP e módulos de CRUD integrados ao backend.

## Responsabilidades

- autenticação e persistência de sessão no cliente
- consumo da API REST por meio de um cliente HTTP centralizado
- validação de formulários antes do envio
- proteção de telas por autenticação e papel
- exibição de estados de loading, erro, vazio e sucesso
- navegação e composição de telas por feature

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
- MSW e Playwright instalados para as próximas fases de testes

## Arquitetura

O frontend está organizado por domínio funcional.

- `src/app`: inicialização da aplicação, providers globais, layouts e roteamento
- `src/features`: módulos como `auth`, `students`, `plans`, `trainings` e `payments`
- `src/shared`: componentes reutilizáveis, cliente HTTP, hooks, helpers e configurações compartilhadas
- `docs`: contrato da API, arquitetura, escopo e decisões de implementação

Padrões principais:

- organização orientada a features
- cliente HTTP centralizado
- estado remoto com TanStack Query
- estado de autenticação com Redux Toolkit
- formulários com React Hook Form + Zod
- componentes reutilizáveis em `shared/ui`

## Requisitos

- Node.js 24+
- `AcademiaManager.Api` rodando em `http://localhost:5123`

Diretório esperado do backend neste workspace:

```txt
..\backend
```

## Instalação

```powershell
Copy-Item .env.example .env
npm install
npm run dev
```

Conteúdo esperado do `.env`:

```text
VITE_API_BASE_URL=http://localhost:5123
```

## Integração com o backend

- a base URL da API é controlada por `VITE_API_BASE_URL`
- o frontend consome endpoints REST expostos pela `AcademiaManager.Api`
- a autenticação usa `accessToken` e `refreshToken`
- as rotas protegidas dependem do estado autenticado e do papel retornado pela API
- os erros de API são normalizados antes de chegar às telas

URL padrão do frontend:

```txt
http://localhost:5173
```

## Fluxo recomendado

1. Suba o backend primeiro em `http://localhost:5123`.
2. Rode `npm run dev`.
3. Acesse `http://localhost:5173`.
4. Use o Swagger do backend para validar contratos e payloads.

## Execução local

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
- `npm run build`: gera a build de produção
- `npm run lint`: valida o código com ESLint
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
- `src/features`: módulos de domínio como auth, students, plans, trainings e payments
- `src/shared`: cliente HTTP, utilitários e componentes reutilizáveis

## Funcionalidades implementadas

- Estrutura inicial com Vite, React e TypeScript
- Configuração do Tailwind CSS
- Cliente de API com header JWT e nova tentativa após refresh
- Estado de sessão de autenticação com Redux
- Páginas de login e cadastro
- Layout protegido do dashboard
- Chamadas para métricas do dashboard
- CRUD de planos, alunos, treinos e pagamentos
- Controle de permissões por papel
- Filtros e ordenação por URL em partes da aplicação
- Testes unitários e de comportamento para fluxos principais

## Validação técnica

```powershell
npm run lint
npm run build
npm run test
```

## Observações técnicas

- o frontend depende da disponibilidade do backend em `http://localhost:5123`
- o contrato principal de referência está em `docs/api-contract.md`
- o fluxo de autenticação é um dos pontos centrais da aplicação e deve permanecer isolado em módulos compartilhados
