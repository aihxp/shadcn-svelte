---
name: shadcn-svelte-lab
description: Guidance for using shadcn-svelte-lab components, registries, docs, and CLI commands.
---

# shadcn-svelte-lab

Use this repository when working with shadcn-svelte-lab components, registry items, documentation, or CLI behavior.

## Read First

- Follow the repository instructions in `AGENTS.md` when present.
- Use `skills/shadcn-svelte/SKILL.md` for the full component, registry, CLI, styling, and forms guidance.
- Prefer existing registry source under `docs/src/lib/registry` over inventing new component APIs.
- Regenerate registry output with `pnpm -F docs build:registry` after component source changes.
- Run focused package checks before shipping code or docs changes.

## Common Paths

- Component source: `docs/src/lib/registry/ui`
- Component examples: `docs/src/lib/registry/examples`
- Component docs: `docs/content/components`
- CLI source: `packages/cli/src`
- Registry schemas: `packages/cli/src/utils/registry/schema.ts`, `packages/registry/src/schemas.ts`, and `docs/static/schema/registry.json`

## CLI Usage

- Add a shipped component with `pnpm dlx @aihxp/shadcn-svelte-lab@latest add button`.
- Add a custom registry item by passing the full item URL to `add`.
- Use `--proxy` only for HTTP proxy servers.
