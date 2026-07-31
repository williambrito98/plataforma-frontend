# AGENTS.md — plataforma-frontend

Instruções para agentes de IA que trabalham neste repositório.

## Visão geral

Frontend da **plataforma de controle de automações/robôs**. O sistema permite listar automações e controlá-las por completo: executar, parar, cancelar e retomar — experiência similar a Jenkins ou CircleCI.

Este repositório contém **apenas o frontend**. O backend expõe uma API REST consumida via Axios.

## Setup local

```bash
pnpm install
pnpm dev      # servidor de desenvolvimento (Vite)
pnpm build    # typecheck + build de produção
pnpm lint     # ESLint
pnpm preview  # preview do build
```

Variáveis de ambiente ficam em `.env.local` com prefixo `VITE_*`:

```env
VITE_API_URL=http://localhost:8080/api  # [A DEFINIR] URL base da API
```

> **Não modifique** arquivos `.env`, `.env.local` ou secrets sem pedir ao usuário antes.

## Stack

| Camada | Tecnologia |
|--------|------------|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Roteamento | TanStack Router (file-based em `src/routes/`) |
| Dados do servidor | TanStack React Query |
| Estado local/UI | Zustand |
| HTTP | Axios (`credentials: 'include'` para cookies) |
| UI | shadcn/ui (Base UI + Tailwind CSS 4) |
| Ícones | Lucide React |
| Formulários | react-hook-form + Zod |
| Toasts | Sonner |
| Pacotes | **pnpm** (obrigatório) |

## Idioma

Escreva **tudo em português (BR)**:

- Textos de UI
- Comentários no código
- Mensagens de commit (quando solicitados)
- Documentação

Identificadores de código (variáveis, funções, tipos) podem seguir convenções técnicas em inglês quando fizer sentido (`AutomationStatus`, `useAutomations`).

## Estrutura de pastas

Organização **híbrida**: rotas em `routes/`, lógica de domínio em `features/`.

```
src/
├── app/
│   └── providers/       # Providers globais (Router, Query, Toaster)
├── components/
│   └── ui/              # Componentes shadcn/ui (não editar manualmente sem necessidade)
├── features/            # Módulos por domínio [A CRIAR conforme crescer]
│   └── automations/
│       ├── api/         # Chamadas Axios + tipos de request/response
│       ├── hooks/       # useQuery, useMutation específicos
│       ├── components/  # Componentes da feature
│       └── types/       # Tipos do domínio
├── hooks/               # Hooks compartilhados
├── lib/
│   ├── utils.ts         # cn(), helpers
│   └── query-client.ts  # Instância do QueryClient
├── routes/              # Rotas TanStack Router (file-based)
│   ├── __root.tsx
│   ├── index.tsx
│   └── design-system/   # Showcase de componentes
├── app.css              # Tokens e variáveis Tailwind
└── main.tsx
```

### Aliases de importação

```typescript
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
```

Configurados em `tsconfig.app.json` e `vite.config.ts` (`@/` → `src/`).

## Convenções de código

### Rotas (TanStack Router)

- Arquivos de rota em `src/routes/` com **kebab-case**: `badges-alerts.tsx`
- Exportar via `export const Route = createFileRoute(...)`
- `routeTree.gen.ts` é gerado automaticamente — **não editar manualmente**

### Componentes UI

- Usar **exclusivamente shadcn/ui** para componentes base
- Adicionar novos via CLI: `pnpm dlx shadcn@latest add <componente>`
- Não criar do zero o que já existe no shadcn
- Customizações visuais via tokens em `src/app.css` e classes Tailwind
- Páginas de showcase/documentação visual ficam em `src/routes/design-system/`

### Estado

| Tipo | Ferramenta | Exemplo |
|------|------------|---------|
| Dados do servidor (listagens, detalhes, mutations) | React Query | `useQuery`, `useMutation` |
| Estado de UI (filtros, modais, seleção) | Zustand | store por feature |
| Formulários | react-hook-form + Zod | schemas em `features/*/schemas/` |

### Formulários e validação

```typescript
// Padrão: react-hook-form + Zod
const schema = z.object({ nome: z.string().min(1, "Nome obrigatório") });
// Erros inline nos campos + toast global (Sonner) para falhas de API
```

### Tratamento de erros

- **Erros de validação**: inline nos campos do formulário
- **Erros de API**: toast via Sonner (`<Toaster />` já configurado em `AppProvider`)
- Mensagens em português, claras e acionáveis

### HTTP / API

- Cliente Axios centralizado em `src/lib/api-client.ts` [A CRIAR]
- Sempre enviar `withCredentials: true` (cookie httpOnly de autenticação)
- Base URL via `import.meta.env.VITE_API_URL`
- Tipos de request/response colocados junto à feature (`features/*/api/`)
- Endpoints principais previstos [A DEFINIR]:
  - `GET /automations` — listagem
  - `GET /automations/:id` — detalhe
  - `POST /automations/:id/run` — executar
  - `POST /automations/:id/stop` — parar
  - `POST /automations/:id/cancel` — cancelar
  - `POST /automations/:id/resume` — retomar

> **Não altere contratos de API** (paths, payloads, tipos) sem alinhar com o usuário ou a documentação do backend.

### Autenticação

- Token JWT (ou similar) armazenado em **cookie httpOnly** pelo backend
- Frontend não manipula o token diretamente
- Requisições Axios com `credentials: 'include'`
- Fluxo de login [A DEFINIR]

### Domínio — automações

Terminologia e status [A DEFINIR com o time]:

| Conceito | Nome sugerido |
|----------|---------------|
| Entidade principal | Automação |
| Status possíveis | `idle`, `running`, `paused`, `failed`, `cancelled` [A DEFINIR] |
| Logs em tempo real | WebSocket / SSE / polling [A DEFINIR] |

## O que fazer

- Seguir a estrutura híbrida `routes/` + `features/`
- Reutilizar componentes shadcn existentes antes de criar novos
- Manter diffs mínimos e focados na tarefa
- Usar React Query para todo dado que vem do servidor
- Validar formulários com Zod
- Escrever em português (BR)
- Consultar páginas em `/design-system` como referência visual

## O que NÃO fazer (sem pedir antes)

- Criar commits ou push
- Adicionar dependências npm
- Trocar biblioteca de UI (shadcn, MUI, etc.)
- Alterar contratos de API
- Modificar `.env`, `.env.local` ou secrets
- Adicionar testes (projeto ainda não tem suite de testes)
- Editar `routeTree.gen.ts` manualmente
- Refatorações amplas não solicitadas

## Testes

Projeto **sem testes por enquanto**. Não adicionar Vitest, Testing Library ou E2E até o usuário solicitar.

## Deploy

[A DEFINIR] — ambiente de hospedagem, branch principal (`main`), pipeline CI/CD.

## Referências úteis

- [TanStack Router — file-based routing](https://tanstack.com/router)
- [TanStack Query](https://tanstack.com/query)
- [shadcn/ui](https://ui.shadcn.com)
- Documentação da API backend [A DEFINIR — link OpenAPI/Swagger ou repo]
