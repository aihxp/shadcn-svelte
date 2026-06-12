# shadcn-svelte-lab CLI

> [!WARNING]
> This package lives inside `shadcn-svelte-lab`, a heavily modified fork of [huntabyte/shadcn-svelte](https://github.com/huntabyte/shadcn-svelte). It is not the canonical upstream CLI and this lab is not expected to be maintained regularly.

The CLI installs Svelte registry items, manages `components.json`, searches and inspects registries, starts the MCP server, applies presets, runs migrations, and builds registry JSON.

## Common Commands

Initialize a project:

```bash
npx @aihxp/shadcn-svelte-lab init
```

Add a component:

```bash
npx @aihxp/shadcn-svelte-lab add button
```

Search a registry namespace:

```bash
npx @aihxp/shadcn-svelte-lab search @shadcn --query button
```

Inspect a project:

```bash
npx @aihxp/shadcn-svelte-lab info --json
```

Start the MCP server:

```bash
npx @aihxp/shadcn-svelte-lab mcp
```

When working from this repository locally, build the CLI first:

```bash
pnpm build:cli
```

Then run the built CLI from `packages/cli/dist/index.mjs` or through the package scripts.

## Verification

Run CLI unit tests:

```bash
pnpm test
```

Run fixture-based e2e tests:

```bash
pnpm test:e2e
```

## License

Licensed under the [MIT license](../../LICENSE.md). This lab retains upstream notices from `shadcn/ui` and `huntabyte/shadcn-svelte`.
