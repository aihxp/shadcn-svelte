# Upstream Audit Tasks

Snapshot date: 2026-06-02.

Local branch: `component-parity-shadcn-ui-2026-06-02`.

Local HEAD, fork `origin/main`, and upstream main: `e145dda`.

Use this checklist to track review and implementation work from `huntabyte/shadcn-svelte`. Audit the fork code first, including current working tree changes, because this fork may already address upstream issues. Mark a source item complete only after recording a local disposition and evidence. Mark an implementation item complete only after code, docs, generated output, and verification are done.

## Automation Progress

- Last updated: 2026-06-02 during the `continue-upstream-audit` heartbeat batch.
- Remaining unchecked items after this batch: 35.
- Remaining unchecked open pull request intake items after this batch: 0.

## Refresh Commands

- [x] Refresh open issues.
  - Command: `gh issue list -R huntabyte/shadcn-svelte --limit 25 --state open --json number,title,url,labels,createdAt,updatedAt,author`
  - Result: refreshed 25 open issues on 2026-06-02. Page 1 still runs issue `#2725` through issue `#2475`.
- [x] Refresh open pull requests.
  - Command: `gh pr list -R huntabyte/shadcn-svelte --limit 25 --state open --json number,title,url,labels,createdAt,updatedAt,author,mergeable,reviewDecision`
  - Result: refreshed 25 open pull requests on 2026-06-02. Page 1 still runs PR `#2726` through PR `#2641`.
- [x] Refresh discussions.
  - Command: `gh api graphql -f query='query { repository(owner: "huntabyte", name: "shadcn-svelte") { discussions(first: 25, orderBy: { field: UPDATED_AT, direction: DESC }) { nodes { number title url createdAt updatedAt category { name } author { login } comments { totalCount } } } } }'`
  - Result: refreshed 25 discussions on 2026-06-02. Page 1 still runs discussion `#2723` through discussion `#2465`.
- [x] Refresh fork baseline.
  - Command: `git status -sb && git ls-remote origin HEAD refs/heads/main && git ls-remote https://github.com/huntabyte/shadcn-svelte.git HEAD refs/heads/main`
  - Result: local branch is `component-parity-shadcn-ui-2026-06-02`; fork `origin/main` and upstream main both resolve to `e145dda4618918a989115a90da63f487f1a66a95`. Working tree still has combobox, direction, docs route, registry, and planning changes.
- [x] Update this file with any new page 1 items.
  - Result: no new page 1 issues, pull requests, or discussions were found.
- [x] Record the refreshed snapshot date and local commit.
  - Result: refreshed snapshot date is 2026-06-02; local HEAD remains `e145dda4618918a989115a90da63f487f1a66a95`.

## Classification Legend

- `needs-audit`: needs local review.
- `present`: already implemented locally.
- `present-in-fork`: already implemented in this fork, including current working tree changes.
- `needs-work`: valid local code or docs gap.
- `blocked-upstream`: waiting on an upstream project or decision.
- `needs-repro`: needs a reproduction before work is useful.
- `support-signal`: discussion signal that may become docs or code work.
- `not-applicable`: intentionally out of local scope.
- `partial`: code or docs now address part of the upstream concern, with a remaining explicit gap.

## Initial Local Observations

- [x] Confirm whether fork combobox work addresses issue [#2693](https://github.com/huntabyte/shadcn-svelte/issues/2693).
  - Current evidence: uncommitted files exist under `docs/src/lib/registry/ui/combobox/` and `docs/src/lib/registry/examples/create/combobox/`.
  - Required disposition: `present-in-fork`, `needs-work`, or `partial`.
  - Disposition: `present-in-fork`.
  - Evidence: `docs/src/lib/registry/ui/combobox/` now includes `Combobox.Chips`, `Combobox.ChipsInput`, `Combobox.Chip`, `Combobox.ChipRemove`, `Combobox.Clear`, and `Combobox.Value`; `docs/src/lib/registry/examples/combobox-multiple.svelte` exposes multi-select docs; generated `docs/static/registry/styles/*/combobox.json` includes `combobox-chips-input.svelte`.
  - Verification: `pnpm -F docs build:registry`, `pnpm -F docs build:content`, and `pnpm -F docs check`.
- [x] Confirm whether fork direction work addresses issue [#2512](https://github.com/huntabyte/shadcn-svelte/issues/2512).
  - Current evidence: uncommitted files exist under `docs/src/lib/registry/ui/direction/`; several components include `rtl:` classes.
  - Required disposition: `present-in-fork`, `needs-work`, or `partial`.
  - Disposition: `partial`.
  - Evidence: `docs/src/lib/registry/ui/direction/direction-provider.svelte` now renders a provider element with `dir={value}` so `rtl:` classes can activate; `docs/content/components/direction.md` documents installation and usage; generated `docs/static/registry/styles/*/direction.json` includes the updated provider.
  - Remaining gap: a CLI migration command for converting existing projects to RTL was not implemented in this pass.
  - Verification: `pnpm -F docs build:registry`, `pnpm -F docs build:content`, and `pnpm -F docs check`.
- [x] Confirm whether fork registry docs and schema already cover custom registries and GitHub registries.
  - Related sources: issue [#2725](https://github.com/huntabyte/shadcn-svelte/issues/2725), PR [#2726](https://github.com/huntabyte/shadcn-svelte/pull/2726), discussion [#2528](https://github.com/huntabyte/shadcn-svelte/discussions/2528), discussion [#2525](https://github.com/huntabyte/shadcn-svelte/discussions/2525).
  - Disposition: `present-in-fork`.
  - Evidence: `packages/cli/src/utils/registry/address.ts`, `github-ref.ts`, `github.ts`, and `source.ts` add GitHub source registry resolution; `packages/cli/src/commands/registry/validate.ts` adds `registry validate owner/repo`; `docs/content/registry/github.md` and `docs/content/registry/registry-json.md` document GitHub registries and `include`; `packages/cli/src/utils/registry/schema.ts`, `packages/registry/src/schemas.ts`, and `docs/static/schema/registry.json` include GitHub source registry support.
  - Verification: `pnpm -F shadcn-svelte exec vitest test/utils/registry-github.test.ts`, `pnpm -F shadcn-svelte check`, `pnpm -F shadcn-svelte build`, `pnpm -F docs build:registry`, `pnpm -F docs build:content`, and `pnpm -F docs check`.

## Open Pull Request Intake

- [x] `present-in-fork` PR [#2726](https://github.com/huntabyte/shadcn-svelte/pull/2726): feat(cli): support GitHub registries.
  - Evidence: ported the focused CLI GitHub registry support from the PR, including item address parsing, ref resolution, raw source loading, source registry includes, `registry validate`, docs, schema updates, and focused tests.
  - Verification: `pnpm -F shadcn-svelte exec vitest test/utils/registry-github.test.ts`, `pnpm -F shadcn-svelte check`, `pnpm -F shadcn-svelte build`, `pnpm -F docs build:registry`, `pnpm -F docs build:content`, and `pnpm -F docs check`.
- [x] `present-in-fork` PR [#2724](https://github.com/huntabyte/shadcn-svelte/pull/2724): chore(deps-dev): bump vitest from 3.2.3 to 4.1.0.
  - Evidence: `packages/cli/package.json` now requests `vitest` `^4.1.0`; `pnpm-lock.yaml` resolves `vitest` to `4.1.8`.
  - Verification: `pnpm -F shadcn-svelte exec vitest --version`, `pnpm -F shadcn-svelte test`, and `pnpm -F shadcn-svelte check`.
- [x] `blocked-upstream` PR [#2722](https://github.com/huntabyte/shadcn-svelte/pull/2722): docs: changelogs.
  - Evidence: upstream adds `docs/content/changelog/**/*.md`, `docs/src/routes/(app)/(layout)/docs/changelog/+page.*`, and root route assets from the Create docs branch. This fork still uses the single `docs/content/changelog.md` doc page and has no `docs/content/changelog/` collection or `docs/src/routes/(app)/(layout)/(root)/` route.
  - Blocker: depends on the broader Create docs site infrastructure tracked by PR [#2679](https://github.com/huntabyte/shadcn-svelte/pull/2679) and PR [#2678](https://github.com/huntabyte/shadcn-svelte/pull/2678).
- [x] `blocked-upstream` PR [#2720](https://github.com/huntabyte/shadcn-svelte/pull/2720): docs: rhea homepage cards.
  - Evidence: upstream targets `docs/src/routes/(app)/(layout)/(root)/+page.*` and card components under `docs/src/routes/(app)/(layout)/(root)/cards/`; this fork has no `(root)` route and keeps the homepage at `docs/src/routes/(app)/(layout)/+page.svelte`.
  - Blocker: depends on the broader Create docs root route and homepage card infrastructure tracked by PR [#2679](https://github.com/huntabyte/shadcn-svelte/pull/2679).
- [x] `present-in-fork` PR [#2718](https://github.com/huntabyte/shadcn-svelte/pull/2718): chore(deps): bump postcss from 8.5.6 to 8.5.10.
  - Evidence: `packages/cli/package.json` now requests `postcss` `^8.5.10`; `pnpm-lock.yaml` resolves the CLI PostCSS dependency to `8.5.15`.
  - Verification: `pnpm install`, `pnpm -F shadcn-svelte test`, and `pnpm -F shadcn-svelte check`.
- [x] `present-in-fork` PR [#2713](https://github.com/huntabyte/shadcn-svelte/pull/2713): chore(deps): bump `@sveltejs/kit` from 2.55.0 to 2.60.1.
  - Evidence: `docs/package.json` and the workspace catalog in `pnpm-workspace.yaml` now request `@sveltejs/kit` `^2.60.1`; `pnpm-lock.yaml` resolves the docs app to `@sveltejs/kit` `2.61.1`.
  - Verification: `pnpm install` and `pnpm -F docs check`.
- [x] `present-in-fork` PR [#2712](https://github.com/huntabyte/shadcn-svelte/pull/2712): chore(deps): bump `@sveltejs/kit` from 2.42.1 to 2.60.1 in `/repro`.
  - Evidence: `repro/package.json` now pins `@sveltejs/kit` to `2.60.1`; `repro/pnpm-lock.yaml` resolves `/repro` SvelteKit dependencies to `2.60.1`.
  - Verification: `pnpm --dir repro install --lockfile-only --ignore-workspace` and `pnpm --dir repro install --ignore-workspace --ignore-scripts`.
  - Verification caveat: `pnpm --dir repro --ignore-workspace check` still fails on missing generated `$lib/components/ui/button` imports after lifecycle scripts are skipped, not on the SvelteKit dependency update.
- [x] `present-in-fork` PR [#2705](https://github.com/huntabyte/shadcn-svelte/pull/2705): chore: migrate Cloudflare Pages deploys to `cloudflare/wrangler-action`.
  - Evidence: `.github/workflows/deploy-preview.yml`, `.github/workflows/deploy-svelte-4.yml`, and `.github/workflows/deploy-tailwind-3.yml` now use `cloudflare/wrangler-action@v3` with `pages deploy` commands.
  - Verification: `pnpm exec prettier --check .github/workflows/deploy-preview.yml .github/workflows/deploy-svelte-4.yml .github/workflows/deploy-tailwind-3.yml`.
- [x] `present-in-fork` PR [#2704](https://github.com/huntabyte/shadcn-svelte/pull/2704): chore(deps): bump svelte from 5.41.2 to 5.55.7 in `/repro`.
  - Evidence: `repro/package.json` now requests `svelte` `^5.55.7`; `repro/pnpm-lock.yaml` resolves `/repro` Svelte to `5.56.1`.
  - Verification: `pnpm --dir repro install --lockfile-only --ignore-workspace` and `pnpm --dir repro install --ignore-workspace --ignore-scripts`.
  - Verification caveat: `pnpm --dir repro --ignore-workspace check` still fails on missing generated `$lib/components/ui/button` imports after lifecycle scripts are skipped, not on the Svelte dependency update.
- [x] `present-in-fork` PR [#2703](https://github.com/huntabyte/shadcn-svelte/pull/2703): chore(deps): bump devalue from 5.6.2 to 5.6.4.
  - Evidence: `package.json` now includes a `pnpm.overrides` entry redirecting `devalue@5.6.2` to `5.6.4`; `pnpm-lock.yaml` no longer contains a package resolution for `devalue@5.6.2`.
  - Verification: `pnpm install`, `pnpm why devalue --recursive --depth 2`, `pnpm -F shadcn-svelte test`, `pnpm -F shadcn-svelte check`, and `pnpm -F docs check`.
- [x] `present-in-fork` PR [#2702](https://github.com/huntabyte/shadcn-svelte/pull/2702): chore(deps): bump svelte from 5.54.0 to 5.55.7.
  - Evidence: `package.json`, `docs/package.json`, and `pnpm-workspace.yaml` now request `svelte` `^5.55.7`; `pnpm-lock.yaml` resolves the root and docs Svelte graph to `5.56.1`.
  - Verification: `pnpm install`, `pnpm -F shadcn-svelte test`, `pnpm -F shadcn-svelte check`, and `pnpm -F docs check`.
- [x] `partial` PR [#2679](https://github.com/huntabyte/shadcn-svelte/pull/2679): create docs: site infrastructure, layout, navigation, and routing.
  - Evidence: the paginated upstream file list contains 2,899 files, and 2,892 matching paths already exist locally, including the `(create)` docs route tree and most layout infrastructure.
  - Remaining gap: local files are still missing for `docs/src/hooks.server.ts`, `docs/src/lib/components/setup-cards.svelte`, `docs/src/lib/types/block.ts`, `docs/src/lib/utils/search.ts`, `docs/src/routes/(app)/(layout)/(create)/components/menu-picker.svelte`, `docs/src/routes/(app)/(layout)/(create)/components/project-form.svelte`, and `docs/src/routes/rss.xml/+server.ts`.
  - Verification: upstream path inventory and `pnpm -F docs check`.
- [x] `needs-work` PR [#2678](https://github.com/huntabyte/shadcn-svelte/pull/2678): create docs: update non-component docs, changelog, and velite config.
  - Evidence: upstream adds a changelog content collection, a docs changelog route, setup cards, non-component docs rewrites, image assets, and `docs/velite.config.js` changes. This fork still uses `docs/content/changelog.md` rather than `docs/content/changelog/**/*.md`.
  - Remaining gap: port after the broader Create docs routing and changelog collection migration is accepted locally.
  - Verification: upstream path review and `pnpm -F docs check`.
- [x] `needs-work` PR [#2677](https://github.com/huntabyte/shadcn-svelte/pull/2677): create docs: update all component documentation pages.
  - Evidence: upstream touches 543 component documentation and example paths, while 353 of those paths currently exist locally.
  - Remaining gap: broad component documentation parity pass is still needed, including the missing generated examples and page content updates.
  - Verification: upstream path inventory and `pnpm -F docs check`.
- [x] `needs-work` PR [#2676](https://github.com/huntabyte/shadcn-svelte/pull/2676): create docs: add and update component example files and registry styles.
  - Evidence: upstream touches 483 component example and registry style paths, while 302 of those paths currently exist locally.
  - Remaining gap: broad example and registry parity pass is still needed before this PR can be considered fully present in the fork.
  - Verification: upstream path inventory and `pnpm -F docs check`.
- [x] `partial` PR [#2675](https://github.com/huntabyte/shadcn-svelte/pull/2675): create docs: chart easing animation and charts page layout updates.
  - Evidence: `docs/src/lib/registry/ui/chart/easing.ts` now provides the shared cubic-bezier easing helper and default motion exports; `docs/src/lib/registry/ui/chart/index.ts` re-exports them; generated style registries now include `chart/easing.ts`.
  - Remaining gap: the larger chart block and charts page layout rewrites from the upstream PR are not ported in this focused pass.
  - Verification: `pnpm -F docs build:registry` and `pnpm -F docs check`.
- [x] `partial` PR [#2674](https://github.com/huntabyte/shadcn-svelte/pull/2674): create docs: create layout tweaks and mobile optimizations.
  - Evidence: upstream touches 35 paths and 32 now exist locally. The CLI preset utility portion is covered by the `DEFAULT_PRESETS` export added in this batch.
  - Remaining gap: the Create docs route still lacks `menu-picker.svelte`, `project-form.svelte`, and the updated `create/+page.svelte`, so the mobile layout rewrite is not fully ported.
  - Verification: upstream path inventory, `pnpm -F docs build:registry`, `pnpm -F docs check`, and `pnpm -F shadcn-svelte check`.
- [x] `needs-work` PR [#2673](https://github.com/huntabyte/shadcn-svelte/pull/2673): create docs: add Sera demo page and changelog.
  - Evidence: upstream touches 202 paths and 168 exist locally, mostly generated `sera` style registry JSON. The fork still lacks the `docs/src/routes/(app)/(layout)/(styles)/sera/` demo route tree, Sera example images, and the changelog collection entry.
  - Remaining gap: port only after the broader Create docs styles route and changelog collection work is accepted locally.
  - Verification: upstream path inventory and `pnpm -F docs check`.
- [x] `present-in-fork` PR [#2672](https://github.com/huntabyte/shadcn-svelte/pull/2672): create docs: improve search.
  - Evidence: `docs/scripts/build-search-data.ts` builds sanitized search data, `docs/src/routes/api/search.json/+server.ts` serves it, `docs/src/lib/utils/search.ts` creates the client FlexSearch indexes, and `docs/src/lib/components/command-menu/command-menu.svelte` now searches nav, content, and colors.
  - Verification: `pnpm -F docs build:search`, `pnpm -F docs build:registry`, and `pnpm -F docs check`.
- [x] `partial` PR [#2671](https://github.com/huntabyte/shadcn-svelte/pull/2671): feat(ui): update calendar, chart, pagination, progress, resizable, and other UI components.
  - Evidence: ported focused UI parity for button `data-size`, calendar and range-calendar selected and focus styling, menubar focus behavior, pagination custom children, resizable aliases and orientation mapping, separator vertical sizing, and toggle-group `data-orientation`; generated style registries include the updates.
  - Remaining gap: upstream also includes empty progress placeholder files and a registry category visibility change that were not ported because they do not add usable component behavior in this fork.
  - Verification: `pnpm -F docs build:registry` and `pnpm -F docs check`.
- [x] `partial` PR [#2670](https://github.com/huntabyte/shadcn-svelte/pull/2670): create docs: add preset support and expand registry schemas.
  - Evidence: `packages/cli/src/preset/preset.ts` now exports browser-safe `DEFAULT_PRESETS`, `packages/cli/src/preset/index.ts` re-exports it, the interactive preset prompt uses separate metadata, and `packages/registry/src/schemas.ts` now accepts `registry:item` and `registry:font` entries.
  - Remaining gap: upstream also adds `NEWPROPS.md` and `packages/cli/src/utils/handle-error.ts`; those were not ported because `NEWPROPS.md` is a tracking note and this fork already exposes CLI error handling through `prompt-helpers`.
  - Verification: `pnpm -F shadcn-svelte check` and `pnpm -F @shadcn-svelte/registry build`.
- [x] `partial` PR [#2669](https://github.com/huntabyte/shadcn-svelte/pull/2669): create docs: update workspace tooling, deps, and config.
  - Evidence: ported the local search and tooling pieces that apply to this fork, including the search JSON prettier ignore, `/api/search.json` prerender entry, FlexSearch compact Vite alias, and `docs/tsconfig.json` script exclusion.
  - Remaining gap: upstream also includes broader dependency and package-manager churn, Create docs changelog collection work, and dashboard data table changes tied to dependency bumps that were not ported in this focused batch.
  - Verification: `pnpm -F docs build:search`, `pnpm -F docs build:registry`, and `pnpm -F docs check`.
- [x] `present-in-fork` PR [#2658](https://github.com/huntabyte/shadcn-svelte/pull/2658): feat(calendar): add `mode="range"` support.
  - Evidence: `docs/src/lib/registry/ui/calendar/calendar.svelte` now accepts `mode="range"` and forwards range mode to the range calendar; `calendar-04` uses the unified calendar wrapper; generated registry JSON now makes `calendar` depend on `range-calendar`.
  - Verification: `pnpm -F docs build:registry` and `pnpm -F docs check`.
- [x] `present-in-fork` PR [#2655](https://github.com/huntabyte/shadcn-svelte/pull/2655): fix: update `<Field.Title/>` to have `data-slot="field-title"`.
  - Evidence: `docs/src/lib/registry/ui/field/field-title.svelte` now sets `data-slot="field-title"`, and generated style registries include the updated field component.
  - Verification: `pnpm -F docs build:registry` and `pnpm -F docs check`.
- [x] `present-in-fork` PR [#2641](https://github.com/huntabyte/shadcn-svelte/pull/2641): calendar-day selected hover text color fix.
  - Evidence: `docs/src/lib/registry/ui/calendar/calendar-day.svelte` no longer applies a selected hover foreground override; generated calendar registries were rebuilt in this batch.
  - Verification: `pnpm -F docs build:registry` and `pnpm -F docs check`.

## Open Issue Intake

- [x] `present-in-fork` Issue [#2725](https://github.com/huntabyte/shadcn-svelte/issues/2725): GitHub Registries.
  - Evidence: GitHub registry installation via `owner/repo/item#ref`, source registry includes, validation command, schema support, and docs are implemented locally.
- [x] `present-in-fork` Issue [#2719](https://github.com/huntabyte/shadcn-svelte/issues/2719): command-menu docs hardcode neutral colors instead of theme tokens.
  - Evidence: `docs/src/lib/components/command-menu/command-menu.svelte` now uses `bg-popover`, `text-popover-foreground`, `ring-border`, `border-t-border`, and `bg-muted` tokens instead of hardcoded neutral colors.
  - Verification: `pnpm -F docs build:search`, `pnpm -F docs build:registry`, and `pnpm -F docs check`.
- [x] `present-in-fork` Issue [#2711](https://github.com/huntabyte/shadcn-svelte/issues/2711): Missing Accordion examples from shadcn/ui.
  - Evidence: `docs/content/components/accordion.md` now exposes Basic, Multiple, Disabled, Border, and Card examples; root registry examples were added under `docs/src/lib/registry/examples/accordion-*.svelte` so the docs preview loader can import them.
  - Verification: `pnpm -F docs build:registry`, `pnpm -F docs build:content`, and `pnpm -F docs check`.
- [x] `needs-work` Issue [#2700](https://github.com/huntabyte/shadcn-svelte/issues/2700): Accordion and Collapsible animations do not work well with Svelte animate flip.
  - Evidence: upstream includes a StackBlitz reproduction and maintainer analysis that disabling Accordion animations during `animate:flip` avoids the height distortion. Local `docs/src/lib/registry/ui/accordion/accordion-content.svelte` and `docs/src/lib/registry/ui/collapsible/collapsible-content.svelte` still apply `cn-*` animation classes by default.
  - Remaining gap: needs a focused animation opt-out or flip-aware pattern across Accordion and Collapsible without breaking existing animation defaults.
  - Verification: upstream issue review and local component source review.
- [x] `needs-repro` Issue [#2695](https://github.com/huntabyte/shadcn-svelte/issues/2695): init generates empty CSS when using custom aliases.
  - Evidence: upstream is labeled `awaiting submitter`, and a maintainer could not reproduce without CLI output. Local CSS generation merges registry CSS and theme variables through `packages/cli/src/utils/add-registry-items.ts` and `packages/cli/src/utils/updaters/update-css-vars.ts`, which does not branch on import aliases during CSS insertion.
  - Verification: upstream issue review and local CLI CSS generation source review.
- [x] `present-in-fork` Issue [#2693](https://github.com/huntabyte/shadcn-svelte/issues/2693): Support multiple select in Combobox.
  - Evidence: Combobox exposes multi-select chip parts and docs include `combobox-multiple`; generated registry output includes the new combobox files.
- [x] `present-in-fork` Issue [#2689](https://github.com/huntabyte/shadcn-svelte/issues/2689): SvelteKit installation guide missing `ssr.noExternal` config for `bits-ui`.
  - Evidence: `docs/content/installation/sveltekit.md` now includes a Vite SSR section showing `ssr.noExternal: ["bits-ui"]` and links to the Vite `ssr.noExternal` docs.
  - Verification: `pnpm -F docs build:content` and `pnpm -F docs check`.
- [x] `present-in-fork` Issue [#2688](https://github.com/huntabyte/shadcn-svelte/issues/2688): IsMobile clarification.
  - Evidence: `docs/src/lib/registry/hooks/is-mobile.svelte.ts` already provides the reusable hook, and `docs/content/components/navigation-menu.md` now documents that the `viewport` prop is optional and shows how to install and use `is-mobile` when copying the demo.
  - Verification: `pnpm -F docs build:content` and `pnpm -F docs check`.
- [x] `blocked-upstream` Issue [#2664](https://github.com/huntabyte/shadcn-svelte/issues/2664): New dialog styles break backward compatibility with old projects.
  - Evidence: upstream is labeled `awaiting upstream` and links the matching shadcn/ui compatibility thread. Local style sources still use Tailwind v4 state modifiers such as `data-open` and `data-closed`, including dialog and alert dialog animation classes.
  - Remaining gap: wait for the upstream compatibility decision before mass-changing generated state selectors across all styles.
  - Verification: upstream issue review and local style source review.
- [x] `partial` Issue [#2663](https://github.com/huntabyte/shadcn-svelte/issues/2663): Style parity between Form and Field.
  - Evidence: `docs/content/components/form.md` now documents how to combine `Form.Field` and `Form.Control` for Formsnap and Superforms state with `Field` layout primitives such as `Field.Group`, `Field.Set`, `Field.Content`, and `orientation`.
  - Remaining gap: no new Form layout API was added in this focused pass.
  - Verification: `pnpm -F docs build:content` and `pnpm -F docs check`.
- [x] `needs-repro` Issue [#2661](https://github.com/huntabyte/shadcn-svelte/issues/2661): Poor performance on tw4 branch vs tw3.
  - Evidence: upstream remains labeled `needs reproduction`; maintainer comments point to docs icon volume, while a later submitter comment points at `supports-backdrop-filter:backdrop-blur-*` overlay classes as a possible Chrome performance trigger.
  - Remaining gap: reproduce and profile the Chrome performance path before changing overlay styles globally.
  - Verification: upstream issue review and local overlay style source review.
- [x] `present-in-fork` Issue [#2635](https://github.com/huntabyte/shadcn-svelte/issues/2635): wrong data-slot name for field-title.
  - Evidence: `docs/src/lib/registry/ui/field/field-title.svelte` now sets `data-slot="field-title"`, and generated style registries include the updated field component.
  - Verification: `pnpm -F docs build:registry` and `pnpm -F docs check`.
- [x] `present-in-fork` Issue [#2624](https://github.com/huntabyte/shadcn-svelte/issues/2624): Translucent Menu Mode breaks submenus in Context Menu component.
  - Evidence: `docs/src/lib/registry/ui/context-menu/context-menu-content.svelte` no longer applies root content overflow classes that clipped portalled submenus in translucent menu mode.
  - Verification: `pnpm -F docs build:registry` and `pnpm -F docs check`.
- [x] `present-in-fork` Issue [#2601](https://github.com/huntabyte/shadcn-svelte/issues/2601): docs: Astro 6 compatibility.
  - Evidence: `docs/content/installation/astro.md` now includes an Astro 6 SSR compatibility section showing `vite.ssr.noExternal` for `@lucide/svelte`, `bits-ui`, `runed`, and `svelte-toolbelt`.
  - Verification: `pnpm -F docs build:content`, `pnpm -F docs build:search`, and `pnpm -F docs check`.
- [x] `present-in-fork` Issue [#2600](https://github.com/huntabyte/shadcn-svelte/issues/2600): CarouselNext and CarouselPrev buttons jerk when clicked.
  - Evidence: `docs/src/lib/registry/ui/carousel/carousel-next.svelte` and `carousel-previous.svelte` now preserve horizontal `-translate-y-1/2` centering during the button active state with `active:translate-y-[calc(-50%+1px)]`.
  - Verification: `pnpm -F docs build:registry` and `pnpm -F docs check`.
- [x] `present-in-fork` Issue [#2590](https://github.com/huntabyte/shadcn-svelte/issues/2590): Search is incorrect.
  - Evidence: `docs/src/lib/utils/search.ts` now boosts exact, page title, prefix, word, and substring title matches before falling back to content matches, so exact component searches outrank broader docs pages.
  - Verification: `pnpm -F docs build:search` and `pnpm -F docs check`.
- [x] `partial` Issue [#2584](https://github.com/huntabyte/shadcn-svelte/issues/2584): docs: Bad performance with Command.
  - Evidence: `Command.Item` now supports `showIndicator={false}`, and the docs command menu disables the indicator for navigation and search rows to avoid rendering unused `IconPlaceholder` instances while hovering large command lists.
  - Remaining gap: no browser performance profile was captured in this pass.
  - Verification: `pnpm -F docs build:registry`, `pnpm -F docs build:search`, and `pnpm -F docs check`.
- [x] `partial` Issue [#2577](https://github.com/huntabyte/shadcn-svelte/issues/2577): `TypeError [ERR_UNKNOWN_FILE_EXTENSION]` for `.svelte` with `bits-ui`.
  - Evidence: `docs/content/installation/sveltekit.md` now documents the broader monorepo-oriented `ssr.noExternal` list for `@lucide/svelte`, `bits-ui`, `runed`, and `svelte-toolbelt`.
  - Remaining gap: no isolated monorepo reproduction was added in this pass.
  - Verification: `pnpm -F docs build:content`, `pnpm -F docs build:search`, and `pnpm -F docs check`.
- [ ] `needs-audit` Issue [#2559](https://github.com/huntabyte/shadcn-svelte/issues/2559): docs: more granular search.
- [ ] `blocked-upstream` Issue [#2555](https://github.com/huntabyte/shadcn-svelte/issues/2555): Sidebar cookie is never used.
- [ ] `needs-audit` Issue [#2526](https://github.com/huntabyte/shadcn-svelte/issues/2526): Support non-gregorian calendars.
- [ ] `needs-audit` Issue [#2515](https://github.com/huntabyte/shadcn-svelte/issues/2515): `dashboard-01` block resets scroll position when data table changes in Safari.
- [ ] `needs-audit` Issue [#2514](https://github.com/huntabyte/shadcn-svelte/issues/2514): scroll-area component makes the page un-scrollable in Safari.
- [x] `partial` Issue [#2512](https://github.com/huntabyte/shadcn-svelte/issues/2512): Right-to-left support for shadcn/ui components and CLI to migrate to RTL.
  - Evidence: Direction provider registry item and docs are present, and the provider now renders `dir` for `rtl:` support.
  - Remaining gap: CLI RTL migration is not implemented yet.
- [ ] `needs-audit` Issue [#2475](https://github.com/huntabyte/shadcn-svelte/issues/2475): cli: post update/add hook.

## Discussion Intake

- [ ] `support-signal` Discussion [#2723](https://github.com/huntabyte/shadcn-svelte/discussions/2723): Moving from JavaScript-based APIs to Web Standards for various components.
- [ ] `support-signal` Discussion [#2721](https://github.com/huntabyte/shadcn-svelte/discussions/2721): Declaration tags.
- [ ] `support-signal` Discussion [#2636](https://github.com/huntabyte/shadcn-svelte/discussions/2636): Tabs without active state UI.
- [ ] `support-signal` Discussion [#2625](https://github.com/huntabyte/shadcn-svelte/discussions/2625): How to style InputGroupAddon when InputGroupInput is disabled?
- [ ] `support-signal` Discussion [#1334](https://github.com/huntabyte/shadcn-svelte/discussions/1334): How to make a table with a fixed header and scrollable body?
- [ ] `support-signal` Discussion [#2244](https://github.com/huntabyte/shadcn-svelte/discussions/2244): Documentation for charts.
- [ ] `support-signal` Discussion [#2604](https://github.com/huntabyte/shadcn-svelte/discussions/2604): Initialize Project with Custom Theme Color.
- [ ] `support-signal` Discussion [#1955](https://github.com/huntabyte/shadcn-svelte/discussions/1955): Initializing project, CLI error failed to fetch base color from registry.
- [ ] `support-signal` Discussion [#2593](https://github.com/huntabyte/shadcn-svelte/discussions/2593): Select with Remote Functions.
- [ ] `support-signal` Discussion [#2531](https://github.com/huntabyte/shadcn-svelte/discussions/2531): Add SKILL.md file to repo.
- [ ] `support-signal` Discussion [#2523](https://github.com/huntabyte/shadcn-svelte/discussions/2523): Are the examples for formsnap components removed for select, Input, and similar components?
- [ ] `support-signal` Discussion [#2549](https://github.com/huntabyte/shadcn-svelte/discussions/2549): Updating Card classes and docs.
- [ ] `support-signal` Discussion [#904](https://github.com/huntabyte/shadcn-svelte/discussions/904): Components have no styles but have Tailwind CSS classes.
- [ ] `support-signal` Discussion [#2528](https://github.com/huntabyte/shadcn-svelte/discussions/2528): Installing from your own custom registry.
- [ ] `support-signal` Discussion [#2527](https://github.com/huntabyte/shadcn-svelte/discussions/2527): Svelte 5 and SvelteKit monorepo context issue with Sidebar.
- [ ] `support-signal` Discussion [#2525](https://github.com/huntabyte/shadcn-svelte/discussions/2525): Add support for multiple registry setups.
- [ ] `support-signal` Discussion [#1573](https://github.com/huntabyte/shadcn-svelte/discussions/1573): How to make Data Table header sticky?
- [ ] `support-signal` Discussion [#2448](https://github.com/huntabyte/shadcn-svelte/discussions/2448): Remote Function support for Forms.
- [ ] `support-signal` Discussion [#2456](https://github.com/huntabyte/shadcn-svelte/discussions/2456): Poor Data Table performance with large frequently updated data.
- [ ] `support-signal` Discussion [#2496](https://github.com/huntabyte/shadcn-svelte/discussions/2496): How to migrate from `Form.*` to `Field.*`.
- [ ] `support-signal` Discussion [#2491](https://github.com/huntabyte/shadcn-svelte/discussions/2491): Floating UI styles do not seem to clear correctly.
- [ ] `support-signal` Discussion [#2481](https://github.com/huntabyte/shadcn-svelte/discussions/2481): Sidebar.Trigger triggering Drawer on mobile.
- [ ] `support-signal` Discussion [#2252](https://github.com/huntabyte/shadcn-svelte/discussions/2252): Cannot read properties of undefined, reading `Root`.
- [ ] `support-signal` Discussion [#2470](https://github.com/huntabyte/shadcn-svelte/discussions/2470): Checkbox not working.
- [ ] `support-signal` Discussion [#2465](https://github.com/huntabyte/shadcn-svelte/discussions/2465): Shadcn-svelte-extra.

## Implementation Queue

- [x] Decide whether GitHub registry support should be ported from PR [#2726](https://github.com/huntabyte/shadcn-svelte/pull/2726).
  - Related: issue [#2725](https://github.com/huntabyte/shadcn-svelte/issues/2725), discussion [#2528](https://github.com/huntabyte/shadcn-svelte/discussions/2528), discussion [#2525](https://github.com/huntabyte/shadcn-svelte/discussions/2525).
  - Expected verification: focused CLI tests plus registry docs review.
  - Result: ported focused CLI support and docs locally.
  - Verification: `pnpm -F shadcn-svelte exec vitest test/utils/registry-github.test.ts`, `pnpm -F shadcn-svelte check`, `pnpm -F shadcn-svelte build`, `pnpm -F docs build:registry`, `pnpm -F docs build:content`, and `pnpm -F docs check`.
- [x] Finish or classify Combobox multiple selection support.
  - Related: issue [#2693](https://github.com/huntabyte/shadcn-svelte/issues/2693).
  - Expected verification: component docs examples, registry output, and `pnpm -F docs check`.
  - Result: `present-in-fork`.
  - Verification: `pnpm -F docs build:registry`, `pnpm -F docs build:content`, and `pnpm -F docs check`.
- [x] Finish or classify RTL and direction provider support.
  - Related: issue [#2512](https://github.com/huntabyte/shadcn-svelte/issues/2512).
  - Expected verification: component source audit, CLI migration decision, and docs check.
  - Result: `partial`; provider, docs, and generated registry are in place, but CLI RTL migration remains unimplemented.
  - Verification: `pnpm -F docs build:registry`, `pnpm -F docs build:content`, and `pnpm -F docs check`.
- [ ] Audit form and field parity.
  - Related: issue [#2663](https://github.com/huntabyte/shadcn-svelte/issues/2663), discussion [#2496](https://github.com/huntabyte/shadcn-svelte/discussions/2496), discussion [#2448](https://github.com/huntabyte/shadcn-svelte/discussions/2448).
  - Expected verification: docs examples and component source comparison against `ui.shadcn.com/docs/forms`.
- [ ] Audit docs search work.
  - Related: PR [#2672](https://github.com/huntabyte/shadcn-svelte/pull/2672), issue [#2590](https://github.com/huntabyte/shadcn-svelte/issues/2590), issue [#2559](https://github.com/huntabyte/shadcn-svelte/issues/2559).
  - Expected verification: docs search behavior and `pnpm -F docs check`.
- [ ] Audit Safari scrolling and performance reports.
  - Related: issue [#2515](https://github.com/huntabyte/shadcn-svelte/issues/2515), issue [#2514](https://github.com/huntabyte/shadcn-svelte/issues/2514), issue [#2584](https://github.com/huntabyte/shadcn-svelte/issues/2584), discussion [#2456](https://github.com/huntabyte/shadcn-svelte/discussions/2456).
  - Expected verification: browser-specific reproduction notes.
- [ ] Audit installation and monorepo support docs.
  - Related: issue [#2689](https://github.com/huntabyte/shadcn-svelte/issues/2689), issue [#2577](https://github.com/huntabyte/shadcn-svelte/issues/2577), discussion [#2527](https://github.com/huntabyte/shadcn-svelte/discussions/2527), discussion [#904](https://github.com/huntabyte/shadcn-svelte/discussions/904).
  - Expected verification: docs edits, setup notes, and `pnpm -F docs check`.
