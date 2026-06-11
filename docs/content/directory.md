---
title: Directory
description: Browse curated shadcn-svelte compatible registries.
---

<script>
	import Callout from "$lib/components/callout.svelte";
	import PMExecute from "$lib/components/pm-execute.svelte";
</script>

The directory is a curated list of public registries that publish Svelte-compatible registry items. Directory entries can be used by namespace without adding them to `components.json`.

<Callout class="mt-6">

The upstream shadcn directory contains many React and Next.js registries. The shadcn-svelte directory is intentionally narrower: entries are included only after their catalog and item payloads are verified against Svelte registry shapes.

</Callout>

## Included Registries

| Namespace | Registry                                                                      | Description                                                            |
| --------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `@ofkm`   | [ofkm/shadcn-svelte-registry](https://github.com/ofkm/shadcn-svelte-registry) | A public shadcn-svelte registry with components, hooks, and utilities. |

## Search

Use the namespace directly with the search command.

```bash
pnpm dlx shadcn-svelte@latest search @ofkm --query badge
```

The same namespace works through MCP tools such as `search_items_in_registries` and `list_items_in_registries`.

## Add Items

Install a directory item with its namespace and item name.

<PMExecute command="shadcn-svelte@latest add @ofkm/status-badge" />

Directory namespaces can still be overridden in `components.json`. Add an explicit `registries` entry when you need a private mirror, custom auth, or a different catalog host.

Use `registry add` to write a directory namespace into `components.json`:

```bash
pnpm dlx shadcn-svelte@latest registry add @ofkm
```

```json title="components.json" showLineNumbers
{
  "registries": {
    "@ofkm": "https://internal.example.com/ofkm/{name}.json"
  }
}
```

## Directory JSON

The public directory is available at:

```txt
https://shadcn-svelte.com/registry/directory.json
```

Each entry includes a namespace, homepage, item URL template, optional catalog URL, and description.

## Curation Policy

Directory entries should:

- Publish Svelte registry items.
- Expose either `registry.json`, `index.json`, or an equivalent catalog URL for search and MCP.
- Use a URL template with `{name}` for exact item installs.
- Avoid React-only or Next-only payloads unless they also include a verified Svelte target.
