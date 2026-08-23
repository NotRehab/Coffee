# NOTrehabCoffee

NOTrehabCoffee is the super-luxe coffee sub-brand of notrehab.com, presented as a quiet editorial storefront for premium coffee and considered brewing objects.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/notrehab-coffee` — the presentation-first NOTrehabCoffee storefront.
- `artifacts/notrehab-coffee/src/App.tsx` — hero ritual, product collection, cart flow, and brand copy.
- `artifacts/notrehab-coffee/src/index.css` — typography, palette, motion, packaging material studies, and responsive styling.

## Architecture decisions

- The storefront is intentionally presentation-first and currently uses local product/cart state so the brand experience can be refined before commerce infrastructure is introduced.
- The bean ritual is the signature interaction: four quiet moments unlock the collection instead of exposing the shop immediately.
- Packaging language combines pressed paper, warm wood, clear glass, and coffee brown while keeping the overall experience restrained.

## Product

- A quiet luxury homepage for NOTrehabCoffee.
- Four-click bean ritual that reveals the coffee collection.
- Premium coffee bag presentation with a local add-to-bag flow.
- Editorial sections for the brewing ritual, coffee origin, packaging studies, notes, and email dispatch.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
