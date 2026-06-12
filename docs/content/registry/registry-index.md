---
title: Registry Index
description: Serve a searchable catalog for registry items.
---

A registry index is the catalog used by `search`, MCP listing tools, and registry discovery. It describes what your registry contains without sending full file contents for every item.

For configured namespace registries, the CLI builds the catalog URL by replacing `{name}` with `registry`.

```json title="components.json" showLineNumbers
{
  "registries": {
    "@acme": "https://registry.acme.com/r/{name}.json"
  }
}
```

`search @acme` requests:

```txt
https://registry.acme.com/r/registry.json
```

## Catalog Shape

Serve a JSON object with optional registry metadata and an `items` array.

```json title="registry.json" showLineNumbers
{
  "name": "acme",
  "homepage": "https://acme.com",
  "items": [
    {
      "name": "editor",
      "type": "registry:block",
      "title": "Editor",
      "description": "A collaborative editor block.",
      "registryDependencies": ["button", "textarea"]
    },
    {
      "name": "toolbar",
      "type": "registry:component",
      "title": "Toolbar",
      "description": "A command toolbar."
    }
  ]
}
```

Catalog items are intentionally lightweight. Include metadata that helps people and agents decide what to install. Do not include file `content` in the catalog.

## Static Hosting

If you use `shadcn-svelte-lab registry build`, place your catalog next to the generated item JSON files.

```txt
static
`-- r
    |-- registry.json
    |-- editor.json
    `-- toolbar.json
```

Then configure the namespace:

```json title="components.json" showLineNumbers
{
  "registries": {
    "@acme": "https://registry.acme.com/r/{name}.json"
  }
}
```

## Index Array

The CLI also accepts a registry index array for URL-based search. This shape uses `relativeUrl` so the CLI can fetch the full item when needed.

```json title="index.json" showLineNumbers
[
  {
    "name": "editor",
    "type": "registry:block",
    "title": "Editor",
    "description": "A collaborative editor block.",
    "relativeUrl": "editor.json"
  }
]
```

Use the catalog object for configured namespace registries. Use the index array when you already publish a standalone URL such as `https://example.com/registry/index.json`, or when a directory entry points at a dedicated catalog URL.

## GitHub Source Registries

GitHub source registries use the root `registry.json` from the repository. The CLI can load `include` entries from that file and build a catalog from the combined items.

```bash
pnpm dlx @aihxp/shadcn-svelte-lab@latest search acme/toolkit --query editor
```

See [GitHub Registries](/docs/registry/github) for the source-registry workflow.
