# shadcn-svelte-lab Upstream Comparison Plan

## Purpose

Track how `shadcn-svelte-lab` compares with `shadcn-ui/ui` (the upstream React project) without presenting this lab as a replacement for either upstream project. The previous audit cycle (`upstream-audit-plan.md`) tracked `huntabyte/shadcn-svelte`; this plan tracks the React original directly via the `upstream-ui` remote. For each upstream feature the question is: is it already present here, does it need a Svelte adaptation, or is it intentionally not applicable to a Bits UI based ecosystem?

## Baseline

- Snapshot date: 2026-06-11
- Upstream remote: `upstream-ui` -> `https://github.com/shadcn-ui/ui.git`
- Upstream `upstream-ui/main`: `ea9d371a2dda3365a382ff361f96b55daeeab88d`
- Upstream CLI: `shadcn` `4.11.0` (`packages/shadcn`)
- Local branch: `main`
- Local project: `shadcn-svelte-lab`
- Inherited CLI package: `shadcn-svelte` `1.3.0` (`packages/cli`)
- Current Bits UI baseline: `2.18.1`

## Verified Coverage (do not redo)

These were verified against the upstream tree at the snapshot commit. Re-verify only when refreshing the snapshot.

- UI components: all 55 upstream `registry/bases/base/ui` components exist under `docs/src/lib/registry/ui/`, including the newer Spinner, Kbd, Button Group, Empty, Field, Item, Input Group, Native Select, Direction, and Combobox. Local extras (`data-table`, `form`, `range-calendar`) are intentional Svelte additions.
- Blocks: all 28 `new-york-v4` blocks exist locally. The internal create-page previews from `bases/base/blocks` (`preview` and `preview-02`) now have local Svelte equivalents under `docs/src/lib/registry/examples/create/`.
- Charts: all 70 chart items exist locally.
- Hooks: `is-mobile.svelte.ts` covers upstream `use-mobile.ts`.
- Styles: all 8 style sheets (`luma`, `lyra`, `maia`, `mira`, `nova`, `rhea`, `sera`, `vega`) match upstream `registry/styles/`.
- Docs site infrastructure: `(view)` preview routes, `api/block`, `api/search.json`, `og`, `registry` routes, llms.txt generation (`docs/scripts/build-llms.ts`), FlexSearch-based search, changelog collection.
- GitHub registries: `owner/repo/item#ref` installs, source registry `include`, `registry validate`, schema, and docs (ported during the previous audit cycle).
- Skill: `skills/shadcn-svelte/` mirrors the upstream skill layout with Svelte-specific Bits UI guidance.
- Dependency baseline: docs, starter templates, `registry-template`, the repro template, the lockfiles, generated styled registry payloads, and legacy flat registry metadata are aligned to Bits UI `2.18.1`.

## Gap Inventory

### A. CLI command coverage (`packages/cli` vs `packages/shadcn` 4.11.0)

Completed locally:

- Registry engine foundation: `registries` map, `@namespace/item`, per-registry auth, search catalogs, and directory namespace fallback.
- Agent-facing commands: `search`, `view`, `info`, `docs`, `mcp`, `apply`, `preset`, `registry add`, visible `update`, `eject`, `migrate`, top-level `build`, and the deprecated `registry mcp` alias.
- Agent ecosystem files: `.cursor-plugin/plugin.json`, `skills/shadcn-svelte/mcp.md`, `skills/shadcn-svelte/registry.md`, and `skills/shadcn-svelte/rules/bits-ui.md`.

Remaining command gaps: none. The optional SvelteKit fixture-based e2e package is complete.

### B. Registry platform

- Registry directory: implemented as a Svelte-compatible curated directory, currently seeded with `@ofkm`. Local files: `packages/cli/src/utils/registry/directory.ts`, `docs/static/registry/directory.json`, and `docs/content/directory.md`.
- Registry docs: `api-reference`, `authentication`, `namespace`, `mcp`, and `registry-index` exist locally and have been updated for directory namespaces.
- Upstream `open-in-v0` remains not applicable because it is React and v0 specific.

### C. MCP and agent ecosystem

- `shadcn-svelte-lab mcp` server exists and exposes init, search, view, docs, add-command generation, project info, project registries, and audit checklist tools.
- Root `mcp` and `skills` docs pages exist.
- Skill sync is complete for the Svelte agent surface.
- `.cursor-plugin/plugin.json` exists.

### D. Docs content coverage (`docs/content/` vs `apps/v4/content/docs/`)

- Forms section exists with SvelteKit, Formsnap, TanStack Form, and Formisch coverage.
- RTL section exists with SvelteKit, Vite, and Astro coverage. The CLI now includes `migrate rtl`, which rewrites common physical Tailwind utilities to logical utilities and writes `rtl: true` to `components.json`.
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

- `registry/bases/{base,radix}` multi-primitive architecture: upstream now builds every component twice (Base UI and Radix). This lab has a single primitive layer (Bits UI), so the architecture itself does not port. Watch for schema and `components.json` changes leaking out of it (`bases.ts`, `config.ts`, `eject`, `apply`) that affect cross-ecosystem registry compatibility.
- `packages/tests` fixture-based e2e suite: complete. The suite covers SvelteKit app and monorepo component installs, `migrate rtl`, and top-level registry `build` against a local static registry server.
- React-specific docs (`react-19`, `react-hook-form`, `open-in-v0`, `_v0`): record dispositions, do not port.
- Historical carry-over files from the older Svelte audit (`docs/src/hooks.server.ts`, `docs/src/lib/components/setup-cards.svelte`, `docs/src/lib/types/block.ts`): record as not applicable for the current site. They do not exist in the current `upstream-ui/main` tree, local cookie state is handled by `docs/src/routes/(app)/+layout.server.ts`, install setup cards are covered by `docs/src/lib/components/install-cards.svelte`, and block typing is covered by `docs/src/lib/blocks.ts` plus `docs/src/routes/api/block/[block]/+server.ts`.

### H. Dependency refresh watch

- Bits UI `2.18.1` is the current released baseline for this lab.
- Bits UI main includes an unreleased runtime fix for `AlertDialog.Cancel` passing `disabled` to its internal button. This lab bridges that locally by rendering `AlertDialog.Cancel` through the primitive `child` snippet and passing `disabled` into the local Button wrapper.
- The legacy root registry under `docs/static/registry/*.json` is not the install surface used by the CLI, but its dependency metadata is still kept on the Bits UI baseline to avoid stale public JSON. The public `/registry` route redirects to `/registry/styles/vega/index.json`, which is the current default styled registry.

## Execution Order

Phases are ordered by leverage; each phase is independently shippable.

1. Phase 1, registry engine foundation: complete.
2. Phase 2, agent surface: complete.
3. Phase 3, docs coverage: complete.
4. Phase 4, directory: complete with a curated Svelte-compatible policy.
5. Phase 5, templates: complete. Six Svelte templates, sync workflow docs, monorepo docs wiring, and create flow links are in place.
6. Phase 6, site residuals: complete. Create page components, the Sera showcase, preview blocks, and historical carry-over file dispositions are recorded.
7. Phase 7, long tail: complete. `apply`, `preset`, `registry add`, visible `update`, `eject`, `migrate`, top-level `build`, and the optional e2e fixture package are complete.

## Priority Rules

1. Features that unblock agents and third-party registries (namespaces, search, MCP) come first; they are the widest ecosystem gap and everything else consumes them.
2. Docs for a feature ship in the same phase as the feature.
3. Pure React-platform features get a recorded `not-applicable` disposition instead of silent omission.
4. Site polish (create page, demos, RSS) trails functional coverage.

## Verification Expectations

- CLI changes: focused vitest files first (`pnpm -F @aihxp/shadcn-svelte-lab exec vitest <file>`), then `pnpm -F @aihxp/shadcn-svelte-lab check` and `pnpm -F @aihxp/shadcn-svelte-lab build`.
- Registry or schema changes: `pnpm -F @aihxp/shadcn-svelte-lab-registry build`, regenerate with `pnpm -F docs build:registry`, inspect the JSON diff.
- Docs changes: `pnpm -F docs build:content`, `pnpm -F docs build:search`, `pnpm -F docs check`.
- MCP server: exercise over stdio with an MCP client (Claude Code `claude mcp add` or the inspector) and record the tool list output.
- Templates: scaffold each template, run its own `check` and `build`, and run `shadcn-svelte-lab add button` against it.

## Review Cadence

- Refresh the snapshot with `git fetch upstream-ui main` before each working session; update the baseline commit here when it moves.
- Diff inventories with `git ls-tree upstream-ui/main:<path>` against the local trees rather than relying on memory; upstream moves fast.
- Re-check Workstream G watch items when upstream changes `packages/shadcn/src/registry/config.ts`, `bases.ts`, or the registry item schema.
- Re-check Workstream H when Bits UI publishes a newer release or when `docs/static/registry/**/*.json` dependency metadata changes.
- Track work in `shadcn-svelte-lab-tasks.md` using the same evidence-based completion rules as the previous audit cycle: a task is done only when code or docs exist locally, generated output is rebuilt, and verification commands are recorded.
