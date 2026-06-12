---
title: About shadcn-svelte-lab
description: What this lab is, what it is not, and how it credits upstream.
---

## What This Is

`shadcn-svelte-lab` is an experimental Svelte workspace built from [huntabyte/shadcn-svelte](https://github.com/huntabyte/shadcn-svelte), the community Svelte port of [shadcn/ui](https://ui.shadcn.com).

The lab explores registry distribution, CLI workflows, MCP tools, templates, migrations, and documentation ideas in a Svelte codebase. It keeps the Svelte component model and primitive stack, primarily Bits UI, while experimenting with a broader registry and agent surface.

## What This Is Not

This is not the canonical shadcn-svelte project. It is not affiliated with shadcn, shadcn/ui, or the upstream shadcn-svelte maintainers. It is also not expected to be maintained regularly.

For production work, use the canonical project that matches your stack:

- [shadcn/ui](https://ui.shadcn.com) for React and Next.js.
- [shadcn-svelte](https://www.shadcn-svelte.com) for Svelte and SvelteKit.
- `shadcn-svelte-lab` for research, comparison, local experiments, and one-off internal use.

## Feature Map

| Feature                             | shadcn/ui                   | shadcn-svelte                   | shadcn-svelte-lab                              |
| ----------------------------------- | --------------------------- | ------------------------------- | ---------------------------------------------- |
| Ecosystem                           | React and Next.js           | Svelte and SvelteKit            | Svelte and SvelteKit                           |
| Role                                | Canonical shadcn project    | Canonical community Svelte port | Experimental lab fork                          |
| Components                          | Copy-paste React components | Copy-paste Svelte components    | Copy-paste Svelte components                   |
| Registry installs                   | Yes                         | Yes                             | Yes                                            |
| Namespaced registries               | Yes                         | Depends on upstream status      | Yes                                            |
| Private registry auth               | Yes                         | Depends on upstream status      | Yes                                            |
| Search, view, and docs CLI commands | Yes                         | Depends on upstream status      | Yes                                            |
| MCP and agent tooling               | Yes                         | Depends on upstream status      | Yes                                            |
| Starter templates                   | React framework templates   | Svelte coverage from upstream   | SvelteKit, Vite, Astro, and monorepo templates |
| Maintenance expectation             | Canonical React source      | Canonical Svelte source         | Not maintained regularly                       |

## Naming And Packages

The repository is named `shadcn-svelte-lab` to make the experimental status clear. Some package names and command examples still use the inherited `shadcn-svelte` package name because this lab began as a fork of that project.

If this lab is ever published as a package, it should use a scoped package name such as `@aihxp/shadcn-svelte-lab`. Publishing under the unscoped `shadcn-svelte` name would imply continuity with the upstream package and should be avoided.

## Credits

Credit belongs to the projects and maintainers this lab builds on:

- [shadcn](https://github.com/shadcn) and [shadcn/ui](https://ui.shadcn.com) for the original design method, registry model, and React implementation.
- [Hunter Johnston](https://github.com/huntabyte), [CokaKoala](https://github.com/adriangonz97), Aidan Bleser, and the [shadcn-svelte contributors](https://github.com/huntabyte/shadcn-svelte/graphs/contributors) for the Svelte port.
- [Bits UI](https://bits-ui.com), [Formsnap](https://formsnap.dev), [Paneforge](https://paneforge.com), and [Vaul Svelte](https://vaul-svelte.com) for the Svelte primitives and integrations used by this codebase.
- [Radix UI](https://radix-ui.com), [Shu Ding](https://shud.in), and [Cal](https://cal.com) for work that influenced the original shadcn/ui ecosystem.

## License

This repository remains under the MIT license. Keep `LICENSE.md`, package license files, and upstream notices intact when redistributing this lab or substantial portions of it.
