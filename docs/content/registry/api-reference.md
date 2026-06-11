---
title: API Reference
description: Registry APIs, CLI commands, and schema imports.
---

This page documents the stable registry surfaces in `shadcn-svelte`: registry JSON files, CLI commands, MCP tools, and schema imports.

## Registry Item

A registry item is the JSON payload installed by the CLI.

```json title="editor.json" showLineNumbers
{
  "$schema": "https://shadcn-svelte.com/schema/registry-item.json",
  "name": "editor",
  "type": "registry:block",
  "title": "Editor",
  "description": "An editor block.",
  "registryDependencies": ["button"],
  "dependencies": ["lucide-svelte"],
  "files": [
    {
      "path": "registry/editor/editor.svelte",
      "type": "registry:block",
      "target": "src/lib/components/editor.svelte",
      "content": "<script lang=\"ts\"></script>\n\n<div>Editor</div>\n"
    }
  ]
}
```

See [registry-item.json](/docs/registry/registry-item-json) for the full schema.

## Registry Catalog

Search, listing, and MCP registry discovery use a catalog request. For namespace registries, the CLI replaces `{name}` with `registry`.

```json title="registry.json" showLineNumbers
{
  "name": "acme",
  "homepage": "https://acme.com",
  "items": [
    {
      "name": "editor",
      "type": "registry:block",
      "title": "Editor",
      "description": "An editor block."
    }
  ]
}
```

Catalog items can include the same metadata as registry items, but they should not include file `content`.

See [Registry Index](/docs/registry/registry-index) for details.

## CLI Commands

### add

Install items from the default registry, a namespace, a URL, or a public GitHub source registry.

```bash
pnpm dlx shadcn-svelte@latest add button
pnpm dlx shadcn-svelte@latest add @acme/editor
pnpm dlx shadcn-svelte@latest add https://example.com/r/editor.json
pnpm dlx shadcn-svelte@latest add acme/toolkit/editor
```

### search

List or search registry catalogs.

```bash
pnpm dlx shadcn-svelte@latest search
pnpm dlx shadcn-svelte@latest search @acme --query editor
pnpm dlx shadcn-svelte@latest search https://example.com/r/registry.json --json
```

### view

Print full registry item JSON.

```bash
pnpm dlx shadcn-svelte@latest view button
pnpm dlx shadcn-svelte@latest view @acme/editor
```

### docs

Return documentation and registry links for components.

```bash
pnpm dlx shadcn-svelte@latest docs button --json
```

### info

Inspect project config, aliases, registries, and installed components.

```bash
pnpm dlx shadcn-svelte@latest info --json
```

### mcp

Start the MCP server used by coding agents.

```bash
pnpm dlx shadcn-svelte@latest mcp
```

### registry build

Build local registry item files into static JSON files.

```bash
pnpm dlx shadcn-svelte@latest registry build
```

### registry validate

Validate a public GitHub source registry and its item file paths.

```bash
pnpm dlx shadcn-svelte@latest registry validate acme/toolkit
```

## MCP Tools

The MCP server exposes these tools:

- `get_project_info`
- `get_project_registries`
- `get_init_command`
- `list_items_in_registries`
- `search_items_in_registries`
- `view_items_in_registries`
- `get_component_docs`
- `get_add_command_for_items`
- `get_audit_checklist`

See [Registry MCP](/docs/registry/mcp) for registry-author guidance.

## Schema Imports

Use the schema export when validating registry files in scripts.

```ts title="validate-registry.ts" showLineNumbers
import { registryItemSchema, registrySchema } from "shadcn-svelte/schema";

const registry = registrySchema.parse(await readJson("registry.json"));
const item = registryItemSchema.parse(await readJson("static/r/editor.json"));

console.log(registry.name, item.name);
```

The CLI's internal registry resolver modules are not a public package API. Prefer the CLI commands, MCP tools, JSON schemas, and `shadcn-svelte/schema` export for integrations.
