# shadcn-ui/ui Parity Tasks

Snapshot date: 2026-06-11.

Upstream `upstream-ui/main`: `1994caba0b2140d4d5aa765bb9d7d4412d6aaabb` (`shadcn` CLI 4.11.0).

Local: `main` at `3992ed61d` (`shadcn-svelte` CLI 1.3.0).

Rules: audit local code before porting; a task is complete only when local code or docs exist, generated output is rebuilt, and verification commands are recorded. Use the classification legend from `upstream-audit-tasks.md` (`present`, `present-in-fork`, `needs-work`, `blocked-upstream`, `needs-repro`, `support-signal`, `not-applicable`, `partial`).

## Refresh Commands

- [ ] `git fetch upstream-ui main` and update the snapshot commit above if it moved.
- [ ] Re-diff component inventories: `git ls-tree upstream-ui/main:apps/v4/registry/bases/base/ui --name-only` vs `ls docs/src/lib/registry/ui`.
- [ ] Re-diff CLI commands: `git ls-tree -r upstream-ui/main:packages/shadcn/src/commands --name-only` vs `find packages/cli/src/commands -type f`.
- [ ] Re-diff docs content: `git ls-tree -r upstream-ui/main:apps/v4/content/docs --name-only` vs `ls -R docs/content`.

## Phase 1: Registry Engine Foundation

- [x] Add the `registries` map to `components.json` schema and config loading.
  - Upstream reference: `packages/shadcn/src/registry/namespaces.ts`, `config.ts`, `context.ts`.
  - Expected local files: `packages/cli/src/utils/get-config.ts`, `packages/cli/src/utils/registry/schema.ts`, `packages/registry/src/schemas.ts`, `docs/static/schema/registry.json`.
  - Implemented in local config/schema files plus `docs/static/schema.json`.
  - Verification: `pnpm -F shadcn-svelte exec vitest test/utils/get-config.test.ts test/utils/registry.test.ts test/utils/registry-search.test.ts --run`, `pnpm -F shadcn-svelte check`, `pnpm -F shadcn-svelte build`, `pnpm -F @shadcn-svelte/registry check`, `pnpm -F @shadcn-svelte/registry build`.
- [x] Implement `@namespace/item` address resolution on top of the existing `address.ts`.
  - Upstream reference: `packages/shadcn/src/registry/namespaces.ts`, `parser.ts`, `resolver.ts`.
  - Verification: `pnpm -F shadcn-svelte exec vitest test/utils/registry.test.ts --run`.
- [x] Implement per-registry auth: header templates and env var expansion.
  - Upstream reference: `packages/shadcn/src/registry/env.ts`, `fetcher.ts`.
  - Verification: `pnpm -F shadcn-svelte exec vitest test/utils/registry.test.ts --run`.
- [x] Port the registry search and item-listing API client.
  - Upstream reference: `packages/shadcn/src/registry/api.ts`, `search.ts`.
  - Verification: `pnpm -F shadcn-svelte exec vitest test/utils/registry-search.test.ts --run`, `pnpm -F shadcn-svelte exec tsx -e 'import { searchRegistries, buildUrlFromRegistryConfig } from "./src/utils/registry/index.ts"; console.log(typeof searchRegistries, buildUrlFromRegistryConfig("button", "https://example.com/{name}.json"))'`.
- [x] Document the `registries` map in `docs/content/components-json.md` and remove the "not supported yet" caveat written during the previous audit (discussion 2525).
  - Verification: `pnpm -F docs build:content`, `pnpm -F docs build:search`, `pnpm -F docs check`.

## Phase 2: Agent Surface

- [x] Add `search` command.
  - Upstream reference: `packages/shadcn/src/commands/search.ts` (flags: `-q`, `-l`, `-o`, `--json`).
  - Verification: `pnpm -F shadcn-svelte exec vitest test/commands/search.test.ts test/utils/registry-search.test.ts --run`, `pnpm -F shadcn-svelte check`, `pnpm -F shadcn-svelte build`, `pnpm -F docs build:content`, `pnpm -F docs build:search`, `pnpm -F docs check`, `node packages/cli/dist/index.mjs search http://127.0.0.1:8123/registry/index.json --query button --limit 2 --json` with `python3 -m http.server 8123 --directory docs/static`.
- [x] Add `view` command.
  - Upstream reference: `packages/shadcn/src/commands/view.ts`.
  - Verification: `pnpm -F shadcn-svelte exec vitest test/commands/search.test.ts test/commands/view.test.ts test/utils/registry.test.ts test/utils/registry-search.test.ts --run`, `pnpm -F shadcn-svelte check`, `pnpm -F shadcn-svelte build`, `pnpm -F docs build:content`, `pnpm -F docs build:search`, `pnpm -F docs check`, `node packages/cli/dist/index.mjs view http://127.0.0.1:8123/registry/button.json` with `python3 -m http.server 8123 --directory docs/static`.
- [x] Add `info` command.
  - Upstream reference: `packages/shadcn/src/commands/info.ts` (`--json`).
  - Verification: `pnpm -F shadcn-svelte exec vitest test/commands/info.test.ts test/commands/search.test.ts test/commands/view.test.ts test/utils/registry.test.ts test/utils/registry-search.test.ts --run`, `pnpm -F shadcn-svelte check`, `pnpm -F shadcn-svelte build`, `pnpm -F docs build:content`, `pnpm -F docs build:search`, `pnpm -F docs check`, `node packages/cli/dist/index.mjs info --cwd packages/cli/test/fixtures/config-vite --json`.
- [x] Add `docs` command returning component docs, API references, and usage examples.
  - Upstream reference: `packages/shadcn/src/commands/docs.ts`.
  - Note: local registry index does not include upstream-style `meta.links`; the command verifies items from the registry index and returns documentation, registry item, registry index, and llms.txt links.
  - Verification: `pnpm -F shadcn-svelte exec vitest test/commands/docs.test.ts test/commands/info.test.ts test/commands/search.test.ts test/commands/view.test.ts test/utils/registry.test.ts test/utils/registry-search.test.ts --run`, `pnpm -F shadcn-svelte check`, `pnpm -F shadcn-svelte build`, `pnpm -F docs build:content`, `pnpm -F docs build:search`, `pnpm -F docs check`, `REGISTRY_URL=http://127.0.0.1:8123/registry node packages/cli/dist/index.mjs docs button --cwd packages/cli/test/fixtures/config-vite --json` with `python3 -m http.server 8123 --directory docs/static`.
- [x] Add `mcp` command exposing init, search, view, docs, and add as MCP tools.
  - Upstream reference: `packages/shadcn/src/commands/mcp.ts`.
  - Note: local MCP exposes init and add as command-generation tools, and reuses the existing search, view, docs, and info command helpers for registry reads.
  - Verification: `pnpm -F shadcn-svelte exec vitest test/mcp/tools.test.ts test/commands/docs.test.ts test/commands/info.test.ts test/commands/search.test.ts test/commands/view.test.ts test/utils/registry.test.ts test/utils/registry-search.test.ts --run`, `pnpm -F shadcn-svelte check`, `pnpm -F shadcn-svelte build`, `pnpm -F docs build:registry`, `pnpm -F docs build:content`, `pnpm -F docs build:search`, `pnpm -F docs check`.
  - MCP client smoke test: `pnpm -F shadcn-svelte exec node --input-type=module -e '...'` launched `node /Users/hprincivil/Projects/shadcn-svelte/packages/cli/dist/index.mjs mcp --cwd /Users/hprincivil/Projects/shadcn-svelte/packages/cli/test/fixtures/config-full` over `StdioClientTransport` and returned `get_add_command_for_items`, `get_audit_checklist`, `get_component_docs`, `get_init_command`, `get_project_info`, `get_project_registries`, `list_items_in_registries`, `search_items_in_registries`, `view_items_in_registries`.
- [x] Add `registry mcp` command for registry-author workflows.
  - Upstream reference: `packages/shadcn/src/commands/registry/mcp.ts`.
  - Note: implemented as a deprecated alias that points users to `shadcn-svelte mcp`, matching the upstream deprecation direction.
  - Verification: covered by `pnpm -F shadcn-svelte check` and `pnpm -F shadcn-svelte build`.
- [x] Sync the skill: add `skills/shadcn-svelte/mcp.md` and `skills/shadcn-svelte/registry.md`; decide whether a `rules/bits-ui.md` replaces upstream `rules/base-vs-radix.md`.
  - Note: added `rules/bits-ui.md` as the Svelte-specific disposition for upstream `rules/base-vs-radix.md`; shadcn-svelte has a single Bits UI primitive layer instead of React base/radix modes.
  - Verification: `pnpm exec prettier --check skills/shadcn-svelte`.
- [x] Add `.cursor-plugin/plugin.json`.
  - Upstream reference: `.cursor-plugin/plugin.json`.
  - Verification: `node -e 'JSON.parse(require("fs").readFileSync(".cursor-plugin/plugin.json", "utf8")); console.log("plugin json ok")'`.

## Phase 3: Docs Parity

- [x] Registry docs: add `docs/content/registry/authentication.md`.
  - Verification: `pnpm -F docs build:content`, `pnpm -F docs build:search`, `pnpm -F docs check`.
- [x] Registry docs: add `docs/content/registry/namespace.md`.
  - Verification: `pnpm -F docs build:content`, `pnpm -F docs build:search`, `pnpm -F docs check`.
- [x] Registry docs: add `docs/content/registry/api-reference.md`.
  - Verification: `pnpm -F docs build:content`, `pnpm -F docs build:search`, `pnpm -F docs check`.
- [x] Registry docs: add `docs/content/registry/mcp.md`.
  - Verification: `pnpm -F docs build:content`, `pnpm -F docs build:search`, `pnpm -F docs check`.
- [x] Registry docs: add `docs/content/registry/registry-index.md`.
  - Verification: `pnpm -F docs build:content`, `pnpm -F docs build:search`, `pnpm -F docs check`.
- [x] Record `not-applicable` disposition for upstream `registry/open-in-v0.mdx`.
  - Disposition: `not-applicable`; v0 integration is React and v0 specific, does not map to shadcn-svelte registry installation or MCP workflows.
- [x] Root docs: add `mcp` page.
  - Verification: `pnpm -F docs build:content`, `pnpm -F docs build:search`, `pnpm -F docs check`.
- [x] Root docs: add `skills` page.
  - Verification: `pnpm -F docs build:content`, `pnpm -F docs build:search`, `pnpm -F docs check`.
- [x] Root docs: add `monorepo` page (coordinate with Phase 5 templates).
  - Note: documented the current manual workspace setup and recorded that monorepo template scaffolds remain Phase 5 work.
  - Verification: `pnpm -F docs build:content`, `pnpm -F docs build:search`, `pnpm -F docs check`.
- [x] Root docs: adapt `package-imports` page to Svelte aliasing.
  - Verification: `pnpm -F docs build:content`, `pnpm -F docs build:search`, `pnpm -F docs check`.
- [x] Root docs: add `new` (latest additions) page.
  - Verification: `pnpm -F docs build:content`, `pnpm -F docs build:search`, `pnpm -F docs check`.
- [x] Forms section: create `docs/content/forms/` with `index`, `sveltekit`, `formsnap`; evaluate `tanstack-form` and `formisch` Svelte adapters and add pages if they hold up.
  - Note: added Svelte-specific pages for Formsnap, TanStack Form, and Formisch. TanStack Form was verified against the official `@tanstack/svelte-form` docs; Formisch was verified against the official `@formisch/svelte` docs.
  - Verification: `pnpm -F docs build:content`, `pnpm -F docs build:search`, `pnpm -F docs check`.
- [x] RTL section: create `docs/content/rtl/` with `index`, `sveltekit`, `vite`, `astro`, building on the Direction component docs.
  - Note: local CLI has no `rtl` config key or `migrate rtl` command yet, so docs cover DirectionProvider and manual logical-class migration.
  - Verification: `pnpm -F docs build:content`, `pnpm -F docs build:search`, `pnpm -F docs check`.
- [x] Add `docs/src/routes/rss.xml/+server.ts` fed by the changelog collection.
  - Verification: `pnpm -F docs build:content`, `pnpm -F docs build:search`, `pnpm -F docs check`.
- All docs tasks verify with: `pnpm -F docs build:content`, `pnpm -F docs build:search`, `pnpm -F docs check`.

## Phase 4: Registry Directory

- [ ] Decide directory curation policy: mirror framework-agnostic upstream entries vs Svelte-ecosystem-only.
- [ ] Add `directory.json` (or equivalent) and the loader.
  - Upstream reference: `apps/v4/registry/directory.json`.
- [ ] Add the `directory` docs page.
  - Upstream reference: `apps/v4/content/docs/(root)/directory.mdx`.
- [ ] Wire directory entries into `search` and MCP namespace resolution.

## Phase 5: Templates

- [ ] Add `templates/sveltekit-app`.
- [ ] Add `templates/sveltekit-monorepo`.
- [ ] Add `templates/vite-app`.
- [ ] Add `templates/vite-monorepo`.
- [ ] Add `templates/astro-app`.
- [ ] Add `templates/astro-monorepo`.
- [ ] Port `scripts/sync-templates.sh` or document the local sync workflow.
- [ ] Link templates from the `monorepo` docs page and create flow.
- Verification per template: scaffold, run the template's own `check` and `build`, then `shadcn-svelte add button` against it.

## Phase 6: Site Residuals

- [ ] Port create page `menu-picker.svelte` and `project-form.svelte`; finish the `create/+page.svelte` mobile layout rewrite.
- [ ] Port the `(styles)/sera/` demo route tree and example images.
  - Upstream reference: `apps/v4/app/(app)/(styles)/sera`.
- [ ] Port `preview` and `preview-02` blocks from `registry/bases/base/blocks`.
- [ ] Evaluate and port `docs/src/hooks.server.ts`, `docs/src/lib/components/setup-cards.svelte`, `docs/src/lib/types/block.ts` (confirm each is still needed by the routes being ported before copying).
- Verification: `pnpm -F docs build:registry`, `pnpm -F docs build:content`, `pnpm -F docs check`, `pnpm -F docs build:svelte`.

## Phase 7: Long Tail

- [ ] Wire `apply` command on top of `packages/cli/src/preset/`.
- [ ] Wire `preset` command group (decode, url, open, resolve).
- [ ] Decide `diff` vs unhiding and documenting the existing `update` command; implement the decision.
- [ ] Evaluate `eject` semantics for the Svelte stack; implement or record `not-applicable`.
- [ ] Add `migrate` runner; include an RTL migration to close the remaining `partial` on issue 2512.
- [ ] Add top-level `build` alias for `registry build` (command-line compatibility with upstream).
- [ ] Stretch: fixture-based e2e package mirroring `packages/tests` with SvelteKit fixtures.

## Not Applicable (record only)

- [ ] Record disposition: `registry/bases/{base,radix}` multi-primitive architecture (Bits UI is the single primitive layer here); add a watch note for schema changes in `bases.ts` and `config.ts`.
- [ ] Record disposition: `react-19.mdx`, `react-hook-form.mdx`, `_v0.mdx`, `_blocks.mdx`.
