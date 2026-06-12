# shadcn-svelte-lab Upstream Comparison Tasks

Snapshot date: 2026-06-11.

Upstream `upstream-ui/main`: `ea9d371a2dda3365a382ff361f96b55daeeab88d` (`shadcn` CLI 4.11.0).

Local: `main` (`shadcn-svelte-lab`, inherited `shadcn-svelte` CLI 1.3.0).

Rules: audit local code before porting; a task is complete only when local code or docs exist, generated output is rebuilt, and verification commands are recorded. Use the classification legend from `upstream-audit-tasks.md` (`present`, `present-in-fork`, `needs-work`, `blocked-upstream`, `needs-repro`, `support-signal`, `not-applicable`, `partial`).

## Refresh Commands

- [x] `git fetch upstream-ui main` and update the snapshot commit above if it moved.
  - Verification: `git fetch upstream-ui main`, `git rev-parse upstream-ui/main`.
- [x] Re-diff component inventories: `git ls-tree upstream-ui/main:apps/v4/registry/bases/base/ui --name-only` vs `ls docs/src/lib/registry/ui`.
  - Result: no missing upstream base UI components after normalizing React `.tsx` files to local component directories. Local extras remain `data-table`, `form`, and `range-calendar`.
- [x] Re-diff CLI commands: `git ls-tree -r upstream-ui/main:packages/shadcn/src/commands --name-only` vs `find packages/cli/src/commands -type f`.
  - Result after adding `migrate` and the top-level `build` alias: no required upstream command gaps remain. Local extras are `init/preflight`, `registry/deps-resolver`, and visible `update`; `index` is the local command barrel file.
- [x] Re-diff docs content: `git ls-tree -r upstream-ui/main:apps/v4/content/docs --name-only` vs `ls -R docs/content`.
  - Result after `.mdx` to `.md` normalization: 188 upstream-only docs paths and 72 local-only docs paths remain. The upstream-only set is dominated by React-specific, base/radix split, and historical changelog pages already covered by Phase 3 dispositions; local-only docs include Svelte installation, migration, Formsnap, and RTL pages.

## Dependency Refresh: Bits UI

- [x] Verify the current Bits UI release.
  - Result: latest npm and GitHub release is `bits-ui@2.18.1`; Bits UI main had one runtime-relevant unreleased fix for `AlertDialog.Cancel` disabled button passthrough when checked.
  - Verification: `npm view bits-ui version dist-tags --json`, `gh api repos/huntabyte/bits-ui/compare/bits-ui@2.18.1...main`.
- [x] Update local Bits UI declarations and lockfile resolution.
  - Implemented: `docs/package.json`, `registry-template/package.json`, the repro manifest, and SvelteKit, Vite, and Astro template package manifests now declare `bits-ui` `^2.18.1`.
  - Verification: `pnpm install`, `pnpm why bits-ui --recursive`, `pnpm --dir repro install --lockfile-only --ignore-workspace --ignore-scripts`.
- [x] Regenerate styled registry payloads with the new dependency metadata.
  - Implemented: `docs/static/registry/styles/*/*.json` generated payloads now use `bits-ui@^2.18.1`.
  - Verification: `pnpm -F docs build:registry`.
- [x] Bridge the unreleased `AlertDialog.Cancel` disabled passthrough fix locally.
  - Implemented: `docs/src/lib/registry/ui/alert-dialog/alert-dialog-cancel.svelte` now renders through the Bits UI `child` snippet and passes `disabled` to the local Button wrapper.
  - Verification: `pnpm check`, `pnpm test:e2e`, `pnpm build`.
- [x] Redirect the public registry root to the current default styled registry.
  - Decision: the CLI install surface already uses `/registry/styles/<style>`. The legacy root registry files are not the install surface, so `/registry` now redirects to `/registry/styles/vega/index.json`; the legacy root registry dependency metadata is still refreshed to avoid stale public JSON.
  - Verification: `pnpm -F @shadcn-svelte/e2e-tests test`.
- [x] Add a regression guard for future dependency drift.
  - Implemented: `packages/tests/src/dependency-baseline.test.ts` checks Bits UI manifest declarations, lockfile resolution, public registry metadata, the AlertDialog disabled bridge, and the `/registry` redirect.
  - Verification: `pnpm -F @shadcn-svelte/e2e-tests typecheck`, `pnpm test:e2e`, `rg "2\\.14\\.4|2\\.16\\.3|2\\.11\\.4" -n --glob '!node_modules' --glob '!docs/src/__registry__'`.

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

## Phase 3: Docs Coverage

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
  - Note: monorepo docs now link the SvelteKit, Vite, and Astro template starters added in Phase 5.
  - Verification: `pnpm -F docs build:content`, `pnpm -F docs build:search`, `pnpm -F docs check`.
- [x] Root docs: adapt `package-imports` page to Svelte aliasing.
  - Verification: `pnpm -F docs build:content`, `pnpm -F docs build:search`, `pnpm -F docs check`.
- [x] Root docs: add `new` (latest additions) page.
  - Verification: `pnpm -F docs build:content`, `pnpm -F docs build:search`, `pnpm -F docs check`.
- [x] Forms section: create `docs/content/forms/` with `index`, `sveltekit`, `formsnap`; evaluate `tanstack-form` and `formisch` Svelte adapters and add pages if they hold up.
  - Note: added Svelte-specific pages for Formsnap, TanStack Form, and Formisch. TanStack Form was verified against the official `@tanstack/svelte-form` docs; Formisch was verified against the official `@formisch/svelte` docs.
  - Verification: `pnpm -F docs build:content`, `pnpm -F docs build:search`, `pnpm -F docs check`.
- [x] RTL section: create `docs/content/rtl/` with `index`, `sveltekit`, `vite`, `astro`, building on the Direction component docs.
  - Note: local CLI now has an `rtl` config key and `migrate rtl` command. Docs cover DirectionProvider, the migration command, and manual review for physical side behavior.
  - Verification: `pnpm -F docs build:content`, `pnpm -F docs build:search`, `pnpm -F docs check`.
- [x] Add `docs/src/routes/rss.xml/+server.ts` fed by the changelog collection.
  - Verification: `pnpm -F docs build:content`, `pnpm -F docs build:search`, `pnpm -F docs check`.
- All docs tasks verify with: `pnpm -F docs build:content`, `pnpm -F docs build:search`, `pnpm -F docs check`.

## Phase 4: Registry Directory

- [x] Decide directory curation policy: mirror framework-agnostic upstream entries vs Svelte-ecosystem-only.
  - Decision: curate Svelte-compatible registries only. The upstream directory contains many React, Next.js, Radix, and Base UI registries that would install unusable payloads in Svelte projects. Entries must expose Svelte registry items and a searchable catalog.
  - Evidence: upstream `ea9d371a2` updated `apps/v4/registry/directory.json`; `@ofkm` was verified with `curl -fsSL https://shadcn.ofkm.dev/r/index.json` and `curl -fsSL https://shadcn.ofkm.dev/r/status-badge.json`.
- [x] Add `directory.json` (or equivalent) and the loader.
  - Upstream reference: `apps/v4/registry/directory.json`.
  - Implemented: `packages/cli/src/utils/registry/directory.ts` and `docs/static/registry/directory.json`.
  - Verification: `pnpm -F shadcn-svelte exec vitest test/utils/registry.test.ts test/utils/registry-search.test.ts --run`.
- [x] Add the `directory` docs page.
  - Upstream reference: `apps/v4/content/docs/(root)/directory.mdx`.
  - Implemented: `docs/content/directory.md` and sidebar nav entry.
  - Verification: `pnpm -F docs build:content`, `pnpm -F docs build:search`, `pnpm -F docs check`.
- [x] Wire directory entries into `search` and MCP namespace resolution.
  - Implemented: namespace catalog and item resolution now fall back to curated directory entries when a registry is not configured locally; explicit user config still wins. MCP inherits this through shared search and view helpers.
  - Verification: `pnpm -F shadcn-svelte exec vitest test/mcp/tools.test.ts test/commands/search.test.ts test/utils/registry.test.ts test/utils/registry-search.test.ts --run`, `pnpm -F shadcn-svelte check`, `pnpm -F shadcn-svelte build`, `node packages/cli/dist/index.mjs search @ofkm --query badge --limit 1 --json`.

## Phase 5: Templates

- [x] Add `templates/sveltekit-app`.
  - Verification: copied to a temporary directory, `pnpm install --no-lockfile`, `pnpm check`, `pnpm build`, `REGISTRY_URL=http://127.0.0.1:8124/registry node packages/cli/dist/index.mjs add button --cwd <tmp>/sveltekit-app --yes --overwrite --no-deps --skip-preflight`.
- [x] Add `templates/sveltekit-monorepo`.
  - Verification: copied to a temporary directory, `pnpm install --no-lockfile`, `pnpm check`, `pnpm build`, `REGISTRY_URL=http://127.0.0.1:8124/registry node packages/cli/dist/index.mjs add button --cwd <tmp>/sveltekit-monorepo/apps/web --yes --overwrite --no-deps --skip-preflight`.
- [x] Add `templates/vite-app`.
  - Verification: copied to a temporary directory, `pnpm install --no-lockfile`, `pnpm check`, `pnpm build`, `REGISTRY_URL=http://127.0.0.1:8124/registry node packages/cli/dist/index.mjs add button --cwd <tmp>/vite-app --yes --overwrite --no-deps --skip-preflight`.
- [x] Add `templates/vite-monorepo`.
  - Verification: copied to a temporary directory, `pnpm install --no-lockfile`, `pnpm check`, `pnpm build`, `REGISTRY_URL=http://127.0.0.1:8124/registry node packages/cli/dist/index.mjs add button --cwd <tmp>/vite-monorepo/apps/web --yes --overwrite --no-deps --skip-preflight`.
- [x] Add `templates/astro-app`.
  - Verification: copied to a temporary directory, `pnpm install --no-lockfile`, `pnpm check`, `pnpm build`, `REGISTRY_URL=http://127.0.0.1:8124/registry node packages/cli/dist/index.mjs add button --cwd <tmp>/astro-app --yes --overwrite --no-deps --skip-preflight`.
- [x] Add `templates/astro-monorepo`.
  - Verification: copied to a temporary directory, `pnpm install --no-lockfile`, `pnpm check`, `pnpm build`, `REGISTRY_URL=http://127.0.0.1:8124/registry node packages/cli/dist/index.mjs add button --cwd <tmp>/astro-monorepo/apps/web --yes --overwrite --no-deps --skip-preflight`.
- [x] Port `scripts/sync-templates.sh` or document the local sync workflow.
  - Decision: documented the Svelte-native sync workflow in `templates/README.md` instead of porting upstream's React template copy script.
  - Verification: `pnpm exec prettier --write templates`, full template smoke loop above.
- [x] Link templates from the `monorepo` docs page and create flow.
  - Implemented: `docs/content/monorepo.md`, `docs/content/new.md`, and the create Get Code dialog template links.
  - Verification: `pnpm -F docs build:content`, `pnpm -F docs build:search`, `pnpm -F docs check`.

## Phase 6: Site Residuals

- [x] Port create page `menu-picker.svelte` and `project-form.svelte`; finish the local create route mobile layout rewrite.
  - Implemented: `docs/src/routes/(app)/(layout)/(create)/components/menu-picker.svelte`, `docs/src/routes/(app)/(layout)/(create)/components/project-form.svelte`, and responsive updates in `create/+layout.svelte` and `customizer.svelte`.
  - Removed: stale initialize dialog/context flow after replacing it with the upstream-style get-code dialog.
  - Verification: `pnpm -F docs check`, Playwright desktop and mobile visual pass at `/create/preview-02`, `pnpm -F docs build:registry`, `pnpm -F docs build:content`, `pnpm -F docs check`, `pnpm -F docs build:svelte`.
- [x] Port the `(styles)/sera/` demo route tree and example images.
  - Upstream reference: `apps/v4/app/(app)/(styles)/sera`.
  - Implemented: Svelte `/sera` route under `docs/src/routes/(app)/(layout)/(styles)/sera/`, route-local preview components, and the upstream Sera light/dark image set under `docs/static/img/styles/`.
  - Decision: used the upstream screenshot previews instead of copying the React-only lazy preview internals; this keeps the public Sera showcase available in the Svelte site while avoiding a parallel React demo port.
  - Verification: Playwright desktop and mobile visual pass at `/sera`, `pnpm -F docs build:registry`, `pnpm -F docs build:content`, `pnpm -F docs check`, `pnpm -F docs build:svelte`, `pnpm -F docs build:search`.
- [x] Port `preview` and `preview-02` blocks from `registry/bases/base/blocks`.
  - Implemented: `album-card.svelte` and `catalog-toolbar.svelte` under `docs/src/lib/registry/examples/create/preview-02/cards/`, then wired both into `preview-02.svelte`.
  - Confirmed: `preview` and `preview-02` card filenames match upstream `registry/bases/base/blocks`, with upstream `bar-visualizer.tsx` represented locally as `bar-visualizer-card.svelte`.
  - Verification: Playwright desktop and narrow viewport visual pass at `/create/preview-02` and `/preview/preview-02?fromPreview=true`, `pnpm -F docs build:registry`, `pnpm -F docs build:content`, `pnpm -F docs check`, `pnpm -F docs build:svelte`.
- [x] Evaluate and port `docs/src/hooks.server.ts`, `docs/src/lib/components/setup-cards.svelte`, `docs/src/lib/types/block.ts` (confirm each is still needed by the routes being ported before copying).
  - Decision: no source port required. These paths are historical carry-over items from the older Svelte audit and do not exist in current `upstream-ui/main`.
  - Local coverage: cookie state is handled by `docs/src/routes/(app)/+layout.server.ts`; setup cards are covered by `docs/src/lib/components/install-cards.svelte`; block names and highlighted block response types are covered by `docs/src/lib/blocks.ts` and `docs/src/routes/api/block/[block]/+server.ts`.
  - Verification: `git ls-tree -r --name-only upstream-ui/main -- apps/v4 | rg 'hooks\\.server|setup-cards|types/block'` returned no matches; `rg -n 'setup-cards|SetupCards|types/block|hooks.server' docs/src docs/content planning` found only planning/docs references and a documentation example filename.
- Verification: `pnpm -F docs build:registry`, `pnpm -F docs build:content`, `pnpm -F docs check`, `pnpm -F docs build:svelte`.

## Phase 7: Long Tail

- [x] Wire `apply` command on top of `packages/cli/src/preset/`.
  - Implemented: `shadcn-svelte apply [preset]` accepts named presets, preset codes, copied `--preset <code>` values, and `/init?preset=` URLs; updates `components.json`; applies the existing `/init` registry payload; and optionally reinstalls existing components when style, icon library, or menu settings change.
  - Docs: `docs/content/cli.md` now lists and documents the `apply` command.
  - Verification: `pnpm -F shadcn-svelte exec vitest test/commands/apply.test.ts --run`, `pnpm -F shadcn-svelte check`, `pnpm -F shadcn-svelte build`, `pnpm -F docs build:content`, `pnpm -F docs build:search`, `pnpm -F docs check`, `node packages/cli/dist/index.mjs apply --help`, and a built CLI smoke test against a temporary Vite starter using a local registry server.
- [x] Wire `preset` command group (decode, url, open, resolve).
  - Implemented: `shadcn-svelte preset decode`, `preset url`, `preset open`, and `preset resolve` with the `preset info` alias. `decode` and `resolve` support `--json`.
  - Note: `preset resolve` reconstructs the closest portable preset from `components.json`. Values not stored in the current config schema, such as chart color, font, heading font, and radius, are inferred from shipped defaults and returned in `fallbacks`.
  - Docs: `docs/content/cli.md` now lists and documents the `preset` command group.
  - Verification: `pnpm -F shadcn-svelte exec vitest test/commands/preset.test.ts --run`, `pnpm -F shadcn-svelte check`, `pnpm -F docs build:content`, `pnpm -F docs build:search`, `pnpm -F docs check`, `pnpm -F shadcn-svelte build`, `node packages/cli/dist/index.mjs preset --help`, `node packages/cli/dist/index.mjs preset decode a0 --json`, `node packages/cli/dist/index.mjs preset resolve --cwd packages/cli/test/fixtures/config-vite --json`.
- [x] Wire `registry add` command for adding namespace entries to `components.json`.
  - Implemented: `shadcn-svelte registry add [registries...]` accepts curated directory namespaces such as `@ofkm` and explicit URL templates such as `@acme=https://example.com/r/{name}.json`.
  - Note: the command skips built-in `@shadcn`, preserves existing `components.json` fields, and writes only new entries under the `registries` map.
  - Docs: `docs/content/cli.md`, `docs/content/components-json.md`, and `docs/content/directory.md` now document the command.
  - Verification: `pnpm -F shadcn-svelte exec vitest test/commands/registry-add.test.ts --run`, `pnpm -F shadcn-svelte check`, `pnpm -F shadcn-svelte build`, `pnpm -F docs build:content`, `pnpm -F docs build:search`, `pnpm -F docs check`, `node packages/cli/dist/index.mjs registry add --help`, and a built CLI smoke test against a temporary Vite fixture.
- [x] Decide `diff` vs unhiding and documenting the existing `update` command; implement the decision.
  - Decision: do not port upstream `diff` as a new command because upstream marks it deprecated and points users toward future `add --diff` behavior. For the Svelte CLI, make the existing `update` command visible and document it as the supported component refresh path.
  - Implemented: `shadcn-svelte update [components...]` now appears in root help and remains the command that updates installed components, stylesheet tokens, fonts, dependencies, and `postUpdate` hooks.
  - Docs: `docs/content/cli.md` now lists and documents the `update` command.
  - Verification: `pnpm -F shadcn-svelte exec vitest test/commands/update.test.ts --run`, `pnpm -F shadcn-svelte check`, `pnpm -F shadcn-svelte build`, `pnpm -F docs build:content`, `pnpm -F docs build:search`, `pnpm -F docs check`, `node packages/cli/dist/index.mjs --help`, `node packages/cli/dist/index.mjs update --help`.
- [x] Evaluate `eject` semantics for the Svelte stack; implement or record `not-applicable`.
  - Decision: implement the Svelte equivalent. Local projects import `shadcn-svelte/tailwind.css`, so `eject` inlines that helper CSS into the configured stylesheet and removes the `shadcn-svelte` dependency when present.
  - Implemented: `shadcn-svelte eject` supports `--cwd`, `--yes`, and `--silent`, resolves the configured `tailwind.css` path from `components.json`, and falls back to editing `package.json` directly when no package manager is detected.
  - Docs: `docs/content/cli.md` now lists and documents the `eject` command.
  - Verification: `pnpm -F shadcn-svelte exec vitest test/commands/eject.test.ts --run`, `pnpm -F shadcn-svelte check`, `pnpm -F shadcn-svelte build`, `pnpm -F docs build:content`, `pnpm -F docs build:search`, `pnpm -F docs check`, `node packages/cli/dist/index.mjs --help`, `node packages/cli/dist/index.mjs eject --help`, and a built CLI smoke test against a temporary Vite fixture with `shadcn-svelte` removed from package dependencies.
- [x] Add `migrate` runner; include an RTL migration to close the remaining `partial` on issue 2512.
  - Implemented: `shadcn-svelte migrate --list` and `shadcn-svelte migrate rtl [path]`, with path and glob support. The RTL migration rewrites common physical Tailwind utilities to logical utilities, adds additive `rtl:*` helpers idempotently, replaces `cn-rtl-flip`, writes `rtl: true` to `components.json`, and reports files that may need manual review.
  - Docs: `docs/content/cli.md`, `docs/content/rtl/index.md`, `docs/content/components-json.md`, `docs/static/schema.json`, and `docs/static/schema/registry-item.json` now cover the command and config key.
  - Verification: `pnpm -F shadcn-svelte exec vitest test/commands/migrate.test.ts --run`, `pnpm -F shadcn-svelte check`, `pnpm -F shadcn-svelte build`, `pnpm -F @shadcn-svelte/registry check`, `pnpm -F @shadcn-svelte/registry build`, `pnpm -F docs build:registry`, `pnpm -F docs build:content`, `pnpm -F docs build:search`, `pnpm -F docs check`, `node packages/cli/dist/index.mjs migrate --help`, `node packages/cli/dist/index.mjs migrate --list`, and a built CLI smoke test against a temporary Vite starter.
- [x] Add top-level `build` alias for `registry build` (command-line compatibility with upstream).
  - Implemented: `shadcn-svelte build [registry]` reuses the existing registry build implementation through a command factory, while keeping `shadcn-svelte registry build [registry]` available. The shared builder now resolves registry item file paths relative to `--cwd`.
  - Docs: `docs/content/cli.md` now lists and documents the top-level alias.
  - Verification: `pnpm -F shadcn-svelte exec vitest test/commands/build.test.ts test/commands/migrate.test.ts --run`, `pnpm -F shadcn-svelte check`, `pnpm -F shadcn-svelte build`, `pnpm -F docs build:content`, `pnpm -F docs build:search`, `pnpm -F docs check`, `node packages/cli/dist/index.mjs --help`, `node packages/cli/dist/index.mjs build --help`, and a built CLI smoke test against a temporary registry project.
- [x] Stretch: fixture-based e2e package mirroring `packages/tests` with SvelteKit fixtures.
  - Implemented: `packages/tests` copies SvelteKit app and monorepo templates into a temp workspace, serves `docs/static` as a local registry, and exercises the built CLI against `add`, `migrate rtl`, and top-level `build`.
  - Docs: root `README.md`, `templates/README.md`, and `packages/tests/README.md` now document `pnpm test:e2e`.
  - Verification: `pnpm -F @shadcn-svelte/e2e-tests typecheck`, `pnpm test:e2e`.

## Not Applicable (record only)

- [x] Record disposition: `registry/bases/{base,radix}` multi-primitive architecture (Bits UI is the single primitive layer here); add a watch note for schema changes in `bases.ts` and `config.ts`.
  - Recorded in `planning/shadcn-svelte-lab-plan.md` under "Not applicable, watch only".
- [x] Record disposition: `react-19.mdx`, `react-hook-form.mdx`, `_v0.mdx`, `_blocks.mdx`.
  - Recorded in `planning/shadcn-svelte-lab-plan.md` under "Docs content coverage" and "Not applicable, watch only".
