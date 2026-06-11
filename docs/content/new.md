---
title: Your project is ready!
description: Start building with shadcn-svelte components, blocks, registries, and agent tools.
---

Here are a few things you can do after creating a new project with shadcn-svelte.

## Add Components

Use the CLI to add components to your project.

```bash
pnpm dlx shadcn-svelte@latest add button
```

Then import and use the component from your configured UI alias.

```svelte title="src/routes/+page.svelte" showLineNumbers
<script lang="ts">
  import { Button } from "$lib/components/ui/button";
</script>

<Button>Click me</Button>
```

You can add multiple components at once, or add all available components.

```bash
pnpm dlx shadcn-svelte@latest add button card input field
pnpm dlx shadcn-svelte@latest add --all
```

Browse all components on the [Components](/docs/components) page.

## Customize Your Theme

Edit your theme in the CSS file configured by `components.json`.

```json title="components.json" showLineNumbers
{
  "tailwind": {
    "css": "src/app.css",
    "baseColor": "neutral"
  }
}
```

Learn more in [Theming](/docs/theming).

## Add A Block

Blocks are larger composed examples that install through the same registry pipeline.

```bash
pnpm dlx shadcn-svelte@latest add login-01
```

After installation, import the generated file from its target path in your project.

```svelte title="src/routes/+page.svelte" showLineNumbers
<script lang="ts">
  import Login01 from "$lib/components/login-01.svelte";
</script>

<Login01 />
```

## Install From Registries

Install items from the default registry, a namespace, a URL, or a public GitHub source registry.

```bash
pnpm dlx shadcn-svelte@latest add @acme/editor
pnpm dlx shadcn-svelte@latest add https://example.com/r/editor.json
pnpm dlx shadcn-svelte@latest add acme/toolkit/project-conventions
```

See [Registry](/docs/registry), [Namespaces](/docs/registry/namespace), and [Authentication](/docs/registry/authentication).

## Use Agent Tools

The CLI includes commands that help AI assistants inspect projects and registries.

```bash
pnpm dlx shadcn-svelte@latest info --json
pnpm dlx shadcn-svelte@latest search @shadcn --query field
pnpm dlx shadcn-svelte@latest docs button --json
```

For connected MCP clients, start the server:

```bash
pnpm dlx shadcn-svelte@latest mcp
```

Learn more in [MCP Server](/docs/mcp) and [Skills](/docs/skills).

## Latest Additions

Recent parity work added the newer component set, registry namespaces, authenticated registries, GitHub source registries, registry search, item viewing, docs links, project info, and MCP tools.

Useful places to start:

- [Field](/docs/components/field) for form layout.
- [Input Group](/docs/components/input-group) for inputs with addons.
- [Empty](/docs/components/empty) for empty states.
- [Spinner](/docs/components/spinner) for loading states.
- [Registry Index](/docs/registry/registry-index) for searchable registries.
