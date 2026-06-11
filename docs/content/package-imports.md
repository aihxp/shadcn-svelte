---
title: Package Imports
description: Configure shadcn-svelte with package.json imports and workspace package exports.
---

The `shadcn-svelte` CLI can resolve aliases from TypeScript paths, `package.json#imports`, and workspace package exports.

Package imports let you use private `#...` aliases from `package.json` instead of `compilerOptions.paths` in `tsconfig.json`.

## App Setup

Configure `imports` in your `package.json`.

```json title="package.json" showLineNumbers
{
  "imports": {
    "#components/*": "./src/lib/components/*",
    "#lib/*": "./src/lib/*",
    "#hooks/*": "./src/lib/hooks/*"
  }
}
```

Then use those roots in `components.json`.

```json title="components.json" showLineNumbers
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

Generated Svelte components can then import through package imports.

```svelte title="src/lib/components/example.svelte" showLineNumbers
<script lang="ts">
  import { Button } from "#components/ui/button";
  import { cn } from "#lib/utils";
</script>

<Button class={cn("w-full")}>Save</Button>
```

## TypeScript

Enable package import resolution.

```json title="tsconfig.json" showLineNumbers
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "resolvePackageJsonImports": true
  }
}
```

SvelteKit projects already use a bundler-style TypeScript setup. Keep the setting explicit when you maintain a custom `tsconfig.json`.

## Svelte Component Folders

Most shadcn-svelte UI components live in folders with an `index.ts` barrel.

```txt
src/lib/components/ui/button
|-- button.svelte
`-- index.ts
```

Use extensionless targets for component folders.

```json title="package.json" showLineNumbers
{
  "imports": {
    "#components/*": "./src/lib/components/*"
  }
}
```

This keeps imports clean:

```ts
import { Button } from "#components/ui/button";
```

## Monorepo Setup

In a monorepo, use package imports for files inside a workspace and package exports for files consumed by other workspaces.

For an app workspace:

```json title="apps/web/package.json" showLineNumbers
{
  "name": "web",
  "private": true,
  "imports": {
    "#components/*": "./src/lib/components/*",
    "#lib/*": "./src/lib/*",
    "#hooks/*": "./src/lib/hooks/*"
  },
  "dependencies": {
    "@workspace/ui": "workspace:*"
  }
}
```

```json title="apps/web/components.json" showLineNumbers
{
  "aliases": {
    "components": "#components",
    "ui": "@workspace/ui/components",
    "lib": "#lib",
    "hooks": "#hooks",
    "utils": "@workspace/ui/lib/utils"
  }
}
```

For the shared UI package:

```json title="packages/ui/package.json" showLineNumbers
{
  "name": "@workspace/ui",
  "private": true,
  "type": "module",
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

When you run `add` from `apps/web`, app-local files use `#...` imports and shared UI files can resolve through `@workspace/ui`.

```ts
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
```

## Troubleshooting

If TypeScript cannot resolve a `#...` import, check that:

- The specifier starts with `#`.
- The `imports` entry is in the nearest `package.json`.
- `moduleResolution` is set to `bundler`.
- `resolvePackageJsonImports` is enabled.
- The target path exists after components are added.

If a component installs but imports still point to an old alias, check that `components.json` uses the same `#...` roots as your package imports.
