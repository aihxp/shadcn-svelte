---
title: GitHub Registries
description: Install registry items directly from a public GitHub repository.
---

GitHub registries let you use a public GitHub repository as a source registry. Add a `registry.json` file at the repository root, declare the items you want to share, and install them with the CLI.

```bash
pnpm dlx @aihxp/shadcn-svelte-lab@latest add acme/toolkit/project-conventions
```

You can pin a branch, tag, or full commit SHA with `#ref`.

```bash
pnpm dlx @aihxp/shadcn-svelte-lab@latest add acme/toolkit/project-conventions#v1.0.0
```

## registry.json

The root `registry.json` must include `name` and `homepage`. Items can live in the root file, or you can split them across relative `registry.json` files with `include`.

```json title="registry.json" showLineNumbers
{
  "$schema": "https://shadcn-svelte.com/schema/registry.json",
  "name": "acme-toolkit",
  "homepage": "https://github.com/acme/toolkit",
  "include": ["rules/registry.json"],
  "items": [
    {
      "name": "project-conventions",
      "type": "registry:file",
      "files": [
        {
          "path": "AGENTS.md",
          "type": "registry:file",
          "target": "~/AGENTS.md"
        }
      ]
    }
  ]
}
```

Included files must be relative paths inside the same repository and must point to a `registry.json` file.

## Items

GitHub registry item files are read from the repository source. File paths are relative to the `registry.json` file that declares the item.

```json title="rules/registry.json" showLineNumbers
{
  "items": [
    {
      "name": "agent-rules",
      "type": "registry:file",
      "files": [
        {
          "path": "AGENTS.md",
          "type": "registry:file",
          "target": "~/AGENTS.md"
        }
      ]
    }
  ]
}
```

Install the included item with the same `owner/repo/item` address.

```bash
pnpm dlx @aihxp/shadcn-svelte-lab@latest add acme/toolkit/agent-rules
```

## Validate

Use `registry validate` to check that the GitHub source registry can be loaded and that each item can read its declared files.

```bash
pnpm dlx @aihxp/shadcn-svelte-lab@latest registry validate acme/toolkit
```
