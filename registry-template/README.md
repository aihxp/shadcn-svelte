# registry-template

> [!WARNING]
> This template belongs to `shadcn-svelte-lab`, a heavily modified fork of [huntabyte/shadcn-svelte](https://github.com/huntabyte/shadcn-svelte). It is useful for local lab experiments, but it is not the canonical maintained shadcn-svelte-lab registry template.

You can use the `shadcn-svelte-lab` CLI to run your own component registry. Running your own
component registry allows you to distribute your custom components, hooks, pages, and
other files to any Svelte project.

## Getting Started

This is a template for creating a custom registry using SvelteKit.

- The template uses a `registry.json` file to define components and their files.
- The `shadcn-svelte-lab build` command is used to build the registry.
- The registry items are served as static files under `public/r/[name].json`.
- Every registry item is compatible with the `shadcn-svelte-lab` CLI.
- The `card`, `button`, `input`, `label`, `textarea` components here would come from the configured registry, but the `stepper` component is a custom `ui` component you can use as a reference for creating and referencing "local" `ui` components.

> [!IMPORTANT]
> Don't forget to replace the version of `@aihxp/shadcn-svelte-lab` in the `package.json` file with the version you want to use.

## Documentation

For this lab, see the local registry docs in `docs/content/registry/`. For the maintained upstream path, visit the [shadcn-svelte-lab registry documentation](https://shadcn-svelte.com/docs/registry).
