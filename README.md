# shadcn-svelte-lab

> [!WARNING]
> `shadcn-svelte-lab` is a heavily modified fork of [huntabyte/shadcn-svelte](https://github.com/huntabyte/shadcn-svelte), which is the Svelte port of [shadcn/ui](https://ui.shadcn.com).
>
> It is not the canonical shadcn-svelte project, it is not affiliated with shadcn, and it is not affiliated with the upstream shadcn-svelte maintainers. This lab is not expected to be maintained regularly. Treat it as an experimental reference, not as the safest production starting point.

This lab explores how current [shadcn/ui](https://github.com/shadcn-ui/ui) registry, CLI, agent, and documentation ideas can be adapted to Svelte. The component layer still uses Svelte-native primitives, primarily [Bits UI](https://bits-ui.com), but the CLI and registry platform have been changed substantially.

## Feature Comparison

| Feature                           | [shadcn/ui](https://ui.shadcn.com)                       | [huntabyte/shadcn-svelte](https://github.com/huntabyte/shadcn-svelte) | `shadcn-svelte-lab`                                |
| --------------------------------- | -------------------------------------------------------- | --------------------------------------------------------------------- | -------------------------------------------------- |
| Primary ecosystem                 | React and Next.js                                        | Svelte and SvelteKit                                                  | Svelte and SvelteKit                               |
| Canonical project status          | Canonical shadcn project                                 | Canonical community Svelte port                                       | Experimental lab fork                              |
| Component model                   | Copy-paste React components                              | Copy-paste Svelte components                                          | Copy-paste Svelte components                       |
| Primitive layer                   | React primitives, including upstream base and Radix work | Svelte primitives, primarily Bits UI                                  | Svelte primitives, primarily Bits UI               |
| Component and block catalog       | Canonical upstream catalog                               | Maintained Svelte catalog                                             | Expanded local Svelte catalog used for experiments |
| Registry item install             | Yes                                                      | Yes                                                                   | Yes                                                |
| Custom registries                 | Yes                                                      | Yes                                                                   | Yes                                                |
| Registry namespaces               | Yes                                                      | Limited or upstream-dependent                                         | Yes                                                |
| Private registry auth             | Yes                                                      | Limited or upstream-dependent                                         | Yes                                                |
| Registry search and view commands | Yes                                                      | Limited or upstream-dependent                                         | Yes                                                |
| MCP and agent tooling             | Yes                                                      | Limited or upstream-dependent                                         | Yes                                                |
| Starter templates                 | React framework templates                                | Svelte starter coverage depends on upstream                           | SvelteKit, Vite, Astro, and monorepo templates     |
| Fixture e2e package               | Yes                                                      | Limited or upstream-dependent                                         | Yes, local Svelte fixture suite                    |
| Maintenance expectation           | Use as canonical React source                            | Use as canonical Svelte source                                        | Not maintained regularly                           |

Use `shadcn/ui` for React projects. Use canonical `shadcn-svelte` for production Svelte projects that need the maintained upstream path. Use `shadcn-svelte-lab` for research, comparison, local experiments, and one-off internal use.

## Why This Lab Exists

`shadcn-svelte-lab` keeps the Svelte component model from `shadcn-svelte`, then explores a broader registry and agent workflow:

- Svelte-native components, blocks, charts, styles, and starter templates.
- Registry namespace support through `components.json` `registries`.
- Registry search, view, docs, info, and MCP surfaces for agent workflows.
- Registry authentication configuration for private registries.
- Additional CLI commands for presets, applying presets, registry builds, migrations, and ejecting bundled CSS.
- SvelteKit, Vite, Astro, and monorepo starter templates.
- Fixture-based CLI e2e tests in `packages/tests`.

Lab package names and command examples use `@aihxp/shadcn-svelte-lab` and `shadcn-svelte-lab` to avoid colliding with the canonical `shadcn-svelte` package.

## Local Development

Install dependencies:

```bash
pnpm install
```

Build the CLI:

```bash
pnpm build:cli
```

Run the CLI unit tests:

```bash
pnpm test
```

Run the fixture-based e2e suite:

```bash
pnpm test:e2e
```

Build the docs site:

```bash
pnpm build:docs
```

## Documentation

The docs in this repository describe this lab's current behavior. For canonical project documentation, use:

- [shadcn/ui documentation](https://ui.shadcn.com/docs)
- [shadcn-svelte documentation](https://www.shadcn-svelte.com/docs)

If this lab drifts from those sources, prefer the canonical upstream docs unless you are intentionally working with this repository's changed CLI and registry platform.

## Project Name

The chosen project name is `shadcn-svelte-lab`.

That name is intentionally modest. It signals that this is an experiment and not a replacement for the canonical Svelte port.

If the npm package is published from this lab, keep using a scoped package name that identifies the owner, for example `@aihxp/shadcn-svelte-lab`. Publishing under the unscoped `shadcn-svelte` name would imply continuity with the upstream package and should be avoided.

## License And Attribution

This repository remains under the MIT license. The original copyright and permission notices are retained in [LICENSE.md](LICENSE.md), [packages/cli/LICENSE.md](packages/cli/LICENSE.md), and [packages/registry/LICENSE.md](packages/registry/LICENSE.md).

Credit belongs to:

- [shadcn](https://github.com/shadcn) and [shadcn/ui](https://github.com/shadcn-ui/ui) for the original design method, registry model, and React implementation.
- [Hunter Johnston](https://github.com/huntabyte), [CokaKoala](https://github.com/adriangonz97), Aidan Bleser, and the [shadcn-svelte contributors](https://github.com/huntabyte/shadcn-svelte/graphs/contributors) for the Svelte port.
- The maintainers of Bits UI, Formsnap, Paneforge, Vaul Svelte, and the other open source projects used by this codebase.

When redistributing this lab or substantial portions of it, keep the MIT license text and upstream notices intact.
