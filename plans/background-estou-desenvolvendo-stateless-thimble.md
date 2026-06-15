# Plano — Melhorias de fluxo de navegação/segurança (Learn&Go)

## Context

A plataforma Learn&Go (TCC) tem o fluxo de autenticação inteiramente mockado via
`localStorage.userRole` (`useRole`), mas o roteamento (`src/app/routes.ts`) mapeia
todas as rotas diretamente para componentes, **sem nenhuma proteção**. Isso gera 3
problemas de fluxo que o usuário pediu para corrigir:

1. **Rotas desprotegidas** — qualquer pessoa abre `/dashboard/*` direto pela URL sem
   estar logada; e um **aluno** consegue abrir páginas exclusivas de professor
   (`/dashboard/create-course`, `/dashboard/availability`) digitando a URL, mesmo
   que os pills de navegação as escondam.
2. **Sem redirect inverso** — quem já está logado e visita `/` ou `/register`
   continua vendo as telas de login/registro em vez de ir ao dashboard.
3. **Sem página 404** — URLs inválidas não têm tratamento.

Objetivo: tornar o fluxo coerente e à prova de URL-hacking, sem mexer no visual das
páginas existentes nem em backend (continua tudo mock).

## Escopo aprovado pelo usuário
Apenas itens **1, 2 e 3**. NÃO implementar busca global funcional nem unificação de
identidade (Alex Silva hardcoded) — ficam para depois.

## Abordagem

### 1. Helper de autenticação central
Criar `src/app/hooks/useAuth.ts` (ou adicionar a `useRole.ts`) com funções puras que
leem o `localStorage` — reaproveitando a mesma chave `userRole` já usada por
`useRole` (`src/app/hooks/useRole.ts:5`) e `Login` (`src/app/components/Login.tsx:22`):

```ts
export const isAuthenticated = () => !!localStorage.getItem("userRole");
export const getRole = () => localStorage.getItem("userRole") as "aluno" | "professor" | null;
```

### 2. Componentes de guarda de rota
Criar `src/app/components/RouteGuards.tsx` com 3 wrappers usando `Navigate` do
`react-router` (já é a lib de rotas do projeto):

- **`RequireAuth`** — se `!isAuthenticated()`, `<Navigate to="/" replace />`; senão
  renderiza `children`.
- **`RequireRole`** (`role: "professor" | "aluno"`) — primeiro exige auth; se o papel
  não bater, redireciona para `/dashboard` (`<Navigate to="/dashboard" replace />`).
  Usado nas rotas só-de-professor.
- **`RedirectIfAuth`** — se `isAuthenticated()`, `<Navigate to="/dashboard" replace />`;
  senão renderiza `children`. Usado em `/` e `/register`.

> Observação: as páginas de dashboard renderizam seu próprio `DashboardLayout`
> internamente (as rotas não usam layout-route). Os guards apenas envolvem o
> Component, sem alterar o layout.

### 3. Atualizar `src/app/routes.ts`
- Trocar `Component:` por `element:` (com JSX) nas rotas que precisam de guarda, ou
  manter `Component` criando pequenos wrappers. Recomendado migrar para `element`
  para poder compor os guards. Mapa:
  - `/` → `<RedirectIfAuth><Login/></RedirectIfAuth>`
  - `/register` → `<RedirectIfAuth><Register/></RedirectIfAuth>`
  - Todas as `/dashboard*` → envolver com `<RequireAuth>…</RequireAuth>`
  - `/dashboard/create-course` e `/dashboard/availability` → envolver com
    `<RequireRole role="professor">…</RequireRole>`
- Adicionar rota catch-all `{ path: "*", element: <NotFound /> }`.

### 4. Página 404
Criar `src/app/components/NotFound.tsx` no mesmo estilo visual do projeto (paleta
zinc, primary `#006FEE`, fonte Inter, ícone lucide-react, componentes do
`nextui-shim` como `Button`). Conteúdo: código 404, mensagem amigável e botão
"Voltar ao início" que navega para `/dashboard` se autenticado, senão `/`.

## Arquivos
- Novo: `src/app/hooks/useAuth.ts` (ou edição em `src/app/hooks/useRole.ts`)
- Novo: `src/app/components/RouteGuards.tsx`
- Novo: `src/app/components/NotFound.tsx`
- Editado: `src/app/routes.ts`

## Verificação (manual, no preview)
1. **Não logado**: abrir `/dashboard`, `/dashboard/courses`, `/dashboard/profile` →
   deve redirecionar para `/` (login).
2. **Login como aluno** (`aluno@gmail.com`/`123`): abrir `/dashboard/create-course`
   e `/dashboard/availability` pela URL → redireciona para `/dashboard`. Demais
   páginas de aluno abrem normalmente.
3. **Login como professor** (`professor@gmail.com`/`123`): `/dashboard/create-course`
   e `/dashboard/availability` abrem normalmente.
4. **Já logado**: visitar `/` ou `/register` → redireciona para `/dashboard`.
5. **URL inválida** (ex.: `/xyz`) → mostra página 404 com botão de retorno.
6. **Logout** pelo menu de perfil → volta a `/` e `/dashboard` passa a redirecionar.
