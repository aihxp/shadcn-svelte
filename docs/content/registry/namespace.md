---
title: Namespaces
description: Use @namespace/item addresses to install from multiple registries.
---

<script>
	import PMExecute from "$lib/components/pm-execute.svelte";
</script>

Namespaces let a project install from more than one registry without replacing the default `registry` URL. Add each namespace to the `registries` map in `components.json`, then reference items with `@namespace/item`.

```json title="components.json" showLineNumbers
{
  "registries": {
    "@acme": "https://registry.acme.com/r/{name}.json"
  }
}
```

<PMExecute command="shadcn-svelte@latest add @acme/editor" />

## Naming Rules

Registry names must:

- Start with `@`.
- Use letters, numbers, hyphens, or underscores.
- Start and end with a letter or number after `@`.

Valid examples include `@acme`, `@acme-ui`, and `@acme_tools`.

## URL Templates

Every registry URL must include `{name}`. The CLI replaces `{name}` with the item name from the address.

```json title="components.json" showLineNumbers
{
  "registries": {
    "@acme": "https://registry.acme.com/r/{name}.json"
  }
}
```

`@acme/editor` resolves to:

```txt
https://registry.acme.com/r/editor.json
```

You can also use `{style}` to include the project's current style name.

```json title="components.json" showLineNumbers
{
  "style": "vega",
  "registries": {
    "@acme": "https://registry.acme.com/r/{style}/{name}.json"
  }
}
```

`@acme/editor` resolves to:

```txt
https://registry.acme.com/r/vega/editor.json
```

## Object Form

Use the object form when the registry needs headers or query parameters.

```json title="components.json" showLineNumbers
{
  "registries": {
    "@private": {
      "url": "https://registry.acme.com/r/{name}.json",
      "headers": {
        "Authorization": "Bearer ${ACME_REGISTRY_TOKEN}"
      },
      "params": {
        "workspace": "${ACME_WORKSPACE_ID}"
      }
    }
  }
}
```

Environment variables can be used in the URL, headers, and params. Header variables are required and will be checked before the request is sent.

## Search And View

The same namespace can be used by agent-facing commands.

```bash
pnpm dlx shadcn-svelte@latest search @acme --query calendar
pnpm dlx shadcn-svelte@latest view @acme/calendar
pnpm dlx shadcn-svelte@latest docs button
```

For `search @acme`, the CLI requests the namespace catalog by replacing `{name}` with `registry`.

```txt
https://registry.acme.com/r/registry.json
```

See [Registry Index](/docs/registry/registry-index) for the catalog shape used by search and MCP listing tools.

## Dependencies

Registry dependencies can also point at namespaced items.

```json title="editor.json" showLineNumbers
{
  "$schema": "https://shadcn-svelte.com/schema/registry-item.json",
  "name": "editor",
  "type": "registry:block",
  "registryDependencies": ["@acme/toolbar", "button"],
  "files": []
}
```

Bare names such as `button` still resolve through the project's default registry. Namespaced dependencies resolve through the matching entry in `registries`.

## GitHub Sources

Namespaces are different from GitHub source registry addresses.

```bash
pnpm dlx shadcn-svelte@latest add acme/toolkit/editor
```

Use GitHub source addresses for one-off public repositories. Use namespaces when you want a reusable registry endpoint in `components.json`, custom auth, search, and MCP discovery.
