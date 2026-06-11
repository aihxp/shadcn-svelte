---
title: Monorepo
description: Use shadcn-svelte components and the CLI in a workspace monorepo.
---

The CLI can resolve aliases through `tsconfig` paths, `package.json#imports`, and workspace package exports. That makes it possible to install shared UI components into a package such as `packages/ui` while app-level blocks live in an app workspace.

Template scaffolds for monorepos are tracked separately in the parity plan. Today, create the workspaces yourself, add a `components.json` file where the CLI should install files, and make the aliases point at the right workspace.

## Recommended Shape

```txt
apps
`-- web
    |-- src
    |   `-- lib
    |       `-- components
    |-- components.json
    `-- package.json
packages
`-- ui
    |-- src
    |   `-- lib
    |       |-- components
    |       |   `-- ui
    |       |-- hooks
    |       `-- utils.ts
    |-- components.json
    `-- package.json
package.json
```

Use the app workspace for app-specific blocks, pages, and feature components. Use the shared UI package for reusable `registry:ui`, hooks, and utilities.

## Shared UI Package

Configure the shared package so imports can resolve from other workspaces.

```json title="packages/ui/package.json" showLineNumbers
{
  "name": "@workspace/ui",
  "private": true,
  "type": "module",
  "exports": {
    "./components/*": "./src/lib/components/ui/*/index.ts",
    "./hooks/*": "./src/lib/hooks/*",
    "./lib/*": "./src/lib/*"
  }
}
```

Then configure its local install targets.

```json title="packages/ui/components.json" showLineNumbers
{
  "$schema": "https://shadcn-svelte.com/schema.json",
  "style": "vega",
  "tailwind": {
    "css": "src/lib/styles.css",
    "baseColor": "neutral"
  },
  "aliases": {
    "components": "$lib/components",
    "ui": "$lib/components/ui",
    "lib": "$lib",
    "hooks": "$lib/hooks",
    "utils": "$lib/utils"
  }
}
```

Run the CLI from `packages/ui` when you want to install shared components directly into that package.

```bash
cd packages/ui
pnpm dlx shadcn-svelte@latest add button
```

## App Workspace

Add the shared package as a workspace dependency.

```json title="apps/web/package.json" showLineNumbers
{
  "name": "web",
  "private": true,
  "dependencies": {
    "@workspace/ui": "workspace:*"
  }
}
```

Configure the app so `ui` and `utils` resolve to the shared package while app components remain local.

```json title="apps/web/components.json" showLineNumbers
{
  "$schema": "https://shadcn-svelte.com/schema.json",
  "style": "vega",
  "tailwind": {
    "css": "src/app.css",
    "baseColor": "neutral"
  },
  "aliases": {
    "components": "$lib/components",
    "ui": "@workspace/ui/components",
    "lib": "$lib",
    "hooks": "$lib/hooks",
    "utils": "@workspace/ui/lib/utils"
  }
}
```

Run `add` from the app workspace for blocks and app-level components.

```bash
cd apps/web
pnpm dlx shadcn-svelte@latest add login-01
```

The CLI resolves workspace package exports through the app dependency graph, so shared imports such as `@workspace/ui/components/button` can point to `packages/ui`.

## SvelteKit Setup

In SvelteKit apps that consume a shared UI package, make sure Vite processes shared Svelte code through the Svelte plugin.

```ts title="apps/web/vite.config.ts" showLineNumbers
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  resolve: {
    dedupe: ["svelte"],
  },
  ssr: {
    noExternal: ["@workspace/ui", "bits-ui"],
  },
});
```

For Tailwind CSS v4, include the shared package in your CSS sources.

```css title="apps/web/src/app.css" showLineNumbers
@import "tailwindcss";
@source "../../../packages/ui/src/lib";
```

See the [SvelteKit installation notes](/docs/installation/sveltekit#configure-monorepo-shared-ui-packages) for more detail.

## Package Imports

You can use `package.json#imports` for package-local aliases and package exports for workspace-shared aliases.

```json title="packages/ui/package.json" showLineNumbers
{
  "imports": {
    "#components/*": "./src/lib/components/*",
    "#lib/*": "./src/lib/*",
    "#hooks/*": "./src/lib/hooks/*"
  },
  "exports": {
    "./components/*": "./src/lib/components/ui/*/index.ts",
    "./lib/*": "./src/lib/*",
    "./hooks/*": "./src/lib/hooks/*"
  }
}
```

```json title="packages/ui/components.json" showLineNumbers
{
  "aliases": {
    "components": "#components",
    "ui": "#components/ui",
    "lib": "#lib",
    "hooks": "#hooks",
    "utils": "#lib/utils"
  }
}
```

See [Package Imports](/docs/package-imports) for the full setup.
