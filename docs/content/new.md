---
title: Your project is ready!
description: Start building with shadcn-svelte components, blocks, registries, and agent tools.
---

Here are a few things you can do after creating a new project with shadcn-svelte.

## Start From A Template

Starter templates are available in the repository under `templates/` for SvelteKit, Vite, and Astro. Each framework has a single app template and a monorepo template with a shared `packages/ui` workspace.

Use the single app templates for small projects. Use the monorepo templates when multiple apps should share the same UI package. See [Monorepo](/docs/monorepo#template-starters) for the workspace layout.

The `/create` page also exposes these paths in the Get Code dialog. Use the Command tab to copy `shadcn-svelte-lab init --preset <preset>` for the current design, or use the Template tab to copy a starter template path.

## Add Components

Use the CLI to add components to your project.

```bash
pnpm dlx @aihxp/shadcn-svelte-lab@latest add button
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
pnpm dlx @aihxp/shadcn-svelte-lab@latest add button card input field
pnpm dlx @aihxp/shadcn-svelte-lab@latest add --all
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
pnpm dlx @aihxp/shadcn-svelte-lab@latest add login-01
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
pnpm dlx @aihxp/shadcn-svelte-lab@latest add @ofkm/status-badge
pnpm dlx @aihxp/shadcn-svelte-lab@latest add @acme/editor
pnpm dlx @aihxp/shadcn-svelte-lab@latest add https://example.com/r/editor.json
pnpm dlx @aihxp/shadcn-svelte-lab@latest add acme/toolkit/project-conventions
```

See [Directory](/docs/directory), [Registry](/docs/registry), [Namespaces](/docs/registry/namespace), and [Authentication](/docs/registry/authentication).

## Use Agent Tools

The CLI includes commands that help AI assistants inspect projects and registries.

```bash
pnpm dlx @aihxp/shadcn-svelte-lab@latest info --json
pnpm dlx @aihxp/shadcn-svelte-lab@latest search @shadcn --query field
pnpm dlx @aihxp/shadcn-svelte-lab@latest docs button --json
```

For connected MCP clients, start the server:

```bash
pnpm dlx @aihxp/shadcn-svelte-lab@latest mcp
```

Learn more in [MCP Server](/docs/mcp) and [Skills](/docs/skills).

## Latest Additions

Recent lab work added the newer component set, registry namespaces, authenticated registries, GitHub source registries, the curated directory, registry search, item viewing, docs links, project info, and MCP tools.

Useful places to start:

- [Field](/docs/components/field) for form layout.
- [Input Group](/docs/components/input-group) for inputs with addons.
- [Empty](/docs/components/empty) for empty states.
- [Spinner](/docs/components/spinner) for loading states.
- [Directory](/docs/directory) for curated Svelte-compatible registries.
- [Registry Index](/docs/registry/registry-index) for searchable registries.
