# shadcn-ui/ui Parity Plan

## Purpose

Bridge the remaining gap between `shadcn-ui/ui` (the upstream React project) and this fork (`aihxp/shadcn-svelte`). The previous audit cycle (`upstream-audit-plan.md`) tracked `huntabyte/shadcn-svelte`; this plan tracks the React original directly via the `upstream-ui` remote. For each upstream feature the question is: is it already present here, does it need a Svelte port, or is it intentionally not applicable to a Bits UI based ecosystem?

## Baseline

- Snapshot date: 2026-06-11
- Upstream remote: `upstream-ui` -> `https://github.com/shadcn-ui/ui.git`
- Upstream `upstream-ui/main`: `ea9d371a2dda3365a382ff361f96b55daeeab88d`
- Upstream CLI: `shadcn` `4.11.0` (`packages/shadcn`)
- Local branch: `main`
- Local CLI: `shadcn-svelte` `1.3.0` (`packages/cli`)

## Verified Parity (do not redo)

These were verified against the upstream tree at the snapshot commit. Re-verify only when refreshing the snapshot.

- UI components: all 55 upstream `registry/bases/base/ui` components exist under `docs/src/lib/registry/ui/`, including the newer Spinner, Kbd, Button Group, Empty, Field, Item, Input Group, Native Select, Direction, and Combobox. Local extras (`data-table`, `form`, `range-calendar`) are intentional Svelte additions.
- Blocks: all 28 `new-york-v4` blocks exist locally. The internal create-page previews from `bases/base/blocks` (`preview` and `preview-02`) now have local Svelte equivalents under `docs/src/lib/registry/examples/create/`.
- Charts: all 70 chart items exist locally.
- Hooks: `is-mobile.svelte.ts` covers upstream `use-mobile.ts`.
- Styles: all 8 style sheets (`luma`, `lyra`, `maia`, `mira`, `nova`, `rhea`, `sera`, `vega`) match upstream `registry/styles/`.
- Docs site infrastructure: `(view)` preview routes, `api/block`, `api/search.json`, `og`, `registry` routes, llms.txt generation (`docs/scripts/build-llms.ts`), FlexSearch-based search, changelog collection.
- GitHub registries: `owner/repo/item#ref` installs, source registry `include`, `registry validate`, schema, and docs (ported during the previous audit cycle).
- Skill: `skills/shadcn-svelte/` mirrors the upstream skill layout with Svelte-specific Bits UI guidance.

## Gap Inventory

### A. CLI command parity (`packages/cli` vs `packages/shadcn` 4.11.0)

Completed locally:

- Registry engine foundation: `registries` map, `@namespace/item`, per-registry auth, search catalogs, and directory namespace fallback.
- Agent-facing commands: `search`, `view`, `info`, `docs`, `mcp`, and the deprecated `registry mcp` alias.
- Agent ecosystem files: `.cursor-plugin/plugin.json`, `skills/shadcn-svelte/mcp.md`, `skills/shadcn-svelte/registry.md`, and `skills/shadcn-svelte/rules/bits-ui.md`.

Remaining command gaps:

| Command             | Upstream description                                | Notes for the Svelte port                                                                                                         |
| ------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `diff`              | check for component updates                         | Local has a hidden `update` command that applies updates; decide whether to add `diff` semantics or unhide and document `update`. |
| `apply`             | apply a preset (theme, font) to an existing project | Local preset utilities exist (`packages/cli/src/preset/`); no command wiring.                                                     |
| `preset`            | decode, resolve, and open preset codes              | Same foundation as `apply`.                                                                                                       |
| `eject`             | inline tailwind.css and remove shadcn dependency    | Confirm the Svelte equivalent semantics before porting.                                                                           |
| `migrate`           | run codemod migrations                              | Migration runner with `--list`.                                                                                                   |
| `build` (top level) | build registry JSON                                 | Local equivalent exists as `registry build`; consider a top-level alias for command-line compatibility.                           |

### B. Registry platform

- Registry directory: implemented as a Svelte-compatible curated directory, currently seeded with `@ofkm`. Local files: `packages/cli/src/utils/registry/directory.ts`, `docs/static/registry/directory.json`, and `docs/content/directory.md`.
- Registry docs: `api-reference`, `authentication`, `namespace`, `mcp`, and `registry-index` exist locally and have been updated for directory namespaces.
- Upstream `open-in-v0` remains not applicable because it is React and v0 specific.

### C. MCP and agent ecosystem

- `shadcn-svelte mcp` server exists and exposes init, search, view, docs, add-command generation, project info, project registries, and audit checklist tools.
- Root `mcp` and `skills` docs pages exist.
- Skill sync is complete for the Svelte agent surface.
- `.cursor-plugin/plugin.json` exists.

### D. Docs content parity (`docs/content/` vs `apps/v4/content/docs/`)

- Forms section exists with SvelteKit, Formsnap, TanStack Form, and Formisch coverage.
- RTL section exists with SvelteKit, Vite, and Astro coverage. The CLI migration piece remains under `migrate`.
- Root pages now include `mcp`, `skills`, `directory`, `monorepo`, `package-imports`, and `new`.
- RSS route exists at `docs/src/routes/rss.xml/+server.ts`.
- React-specific docs (`react-19`, `react-hook-form`, `open-in-v0`, `_v0`) remain not applicable.

### E. Templates

Upstream ships 10 starter templates under `templates/` (next, astro, vite, react-router, start; each in app and monorepo variants) plus `scripts/sync-templates.sh`. Local has only `registry-template/`. Svelte target set:

- `sveltekit-app`, `sveltekit-monorepo`
- `vite-app`, `vite-monorepo` (Svelte via Vite)
- `astro-app`, `astro-monorepo`

Wire these into the `monorepo` docs page (Workstream D) and the create flow where relevant.

### F. Site Residuals

Carried over from the previous audit cycle. Completed in this phase:

- `docs/src/routes/(app)/(layout)/(create)/components/menu-picker.svelte`
- `docs/src/routes/(app)/(layout)/(create)/components/project-form.svelte`
- Local create route mobile layout rewrite
- Svelte `/sera` showcase route and upstream Sera light/dark screenshot set
- `preview` and `preview-02` blocks (internal create previews), including `preview-02` album and catalog toolbar cards

After evaluation, there are no remaining site residuals from this phase.

### G. Not applicable, watch only

- `registry/bases/{base,radix}` multi-primitive architecture: upstream now builds every component twice (Base UI and Radix). This fork has a single primitive layer (Bits UI), so the architecture itself does not port. Watch for schema and `components.json` changes leaking out of it (`bases.ts`, `config.ts`, `eject`, `apply`) that affect cross-ecosystem registry compatibility.
- `packages/tests` fixture-based e2e suite: optional hardening; a SvelteKit fixture equivalent is listed as a stretch task.
- React-specific docs (`react-19`, `react-hook-form`, `open-in-v0`, `_v0`): record dispositions, do not port.
- Historical carry-over files from the older Svelte audit (`docs/src/hooks.server.ts`, `docs/src/lib/components/setup-cards.svelte`, `docs/src/lib/types/block.ts`): record as not applicable for the current site. They do not exist in the current `upstream-ui/main` tree, local cookie state is handled by `docs/src/routes/(app)/+layout.server.ts`, install setup cards are covered by `docs/src/lib/components/install-cards.svelte`, and block typing is covered by `docs/src/lib/blocks.ts` plus `docs/src/routes/api/block/[block]/+server.ts`.

## Execution Order

Phases are ordered by leverage; each phase is independently shippable.

1. Phase 1, registry engine foundation: complete.
2. Phase 2, agent surface: complete.
3. Phase 3, docs parity: complete.
4. Phase 4, directory: complete with a curated Svelte-compatible policy.
5. Phase 5, templates: complete. Six Svelte templates, sync workflow docs, monorepo docs wiring, and create flow links are in place.
6. Phase 6, site residuals: complete. Create page components, the Sera showcase, preview blocks, and historical carry-over file dispositions are recorded.
7. Phase 7, long tail: `apply` and `preset` commands, `eject`, `migrate` (including the RTL migration from issue 2512), `diff` or unhidden `update`, top-level `build` alias, optional e2e fixture package.

## Priority Rules

1. Features that unblock agents and third-party registries (namespaces, search, MCP) come first; they are the widest ecosystem gap and everything else consumes them.
2. Docs for a feature ship in the same phase as the feature.
3. Pure React-platform features get a recorded `not-applicable` disposition instead of silent omission.
4. Site polish (create page, demos, RSS) trails functional parity.

## Verification Expectations

- CLI changes: focused vitest files first (`pnpm -F shadcn-svelte exec vitest <file>`), then `pnpm -F shadcn-svelte check` and `pnpm -F shadcn-svelte build`.
- Registry or schema changes: `pnpm -F @shadcn-svelte/registry build`, regenerate with `pnpm -F docs build:registry`, inspect the JSON diff.
- Docs changes: `pnpm -F docs build:content`, `pnpm -F docs build:search`, `pnpm -F docs check`.
- MCP server: exercise over stdio with an MCP client (Claude Code `claude mcp add` or the inspector) and record the tool list output.
- Templates: scaffold each template, run its own `check` and `build`, and run `shadcn-svelte add button` against it.

## Review Cadence

- Refresh the snapshot with `git fetch upstream-ui main` before each working session; update the baseline commit here when it moves.
- Diff inventories with `git ls-tree upstream-ui/main:<path>` against the local trees rather than relying on memory; upstream moves fast.
- Re-check Workstream G watch items when upstream changes `packages/shadcn/src/registry/config.ts`, `bases.ts`, or the registry item schema.
- Track work in `shadcn-ui-parity-tasks.md` using the same evidence-based completion rules as the previous audit cycle: a task is done only when code or docs exist locally, generated output is rebuilt, and verification commands are recorded.
