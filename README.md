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
- MSW e Playwright instalados para as próximas fases de testes

## Requisitos

- Node.js 24+
- `AcademiaManager.Api` rodando em `http://localhost:5123`

Caminho local do backend usado durante o planejamento:

```txt
C:\Users\pedro\AcademiaManagerApi
```

## Instalação

```bash
npm install
cp .env.example .env
npm run dev
```

URL padrão do frontend:

```txt
http://localhost:5173
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run test
npm run format
```

## Status Atual

Implementado:

- Estrutura inicial com Vite, React e TypeScript
- Configuração do Tailwind CSS
- Cliente de API com header JWT e nova tentativa após refresh
- Estado de sessão de autenticação com Redux
- Páginas de login e cadastro
- Layout protegido do dashboard
- Chamadas para métricas do dashboard
- CRUD de planos com listagem, criação, edição e exclusão
- Proteções de escrita de planos somente para Admin
- CRUD de alunos com listagem, criação, edição e exclusão
- Seletor de plano do aluno e proteções de escrita para Admin/Trainer
- CRUD de treinos com listagem, criação, edição e exclusão
- Seletor de aluno no treino e conversão de data/hora local para UTC
- Primitivos básicos de UI
- Primeiros testes de validação e permissões

Próxima etapa:

- CRUD de pagamentos com seletor de aluno e permissões somente para Admin.
