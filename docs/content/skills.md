---
title: Skills
description: Give AI assistants shadcn-svelte project context, component rules, and registry workflows.
---

The shadcn-svelte skill gives AI assistants project-aware guidance for using components, composing layouts, applying styles, reading registry docs, and running the CLI.

The skill is included in this repository at `skills/shadcn-svelte` and is exposed through the Cursor plugin bundle. When an assistant supports local skills or plugin bundles, point it at the repository skill directory or the plugin manifest.

```txt
skills/shadcn-svelte
|-- SKILL.md
|-- cli.md
|-- customization.md
|-- mcp.md
|-- registry.md
`-- rules
    |-- bits-ui.md
    |-- composition.md
    |-- forms.md
    |-- icons.md
    `-- styling.md
```

## What It Does

The skill teaches an assistant how to:

- Read project context with `shadcn-svelte-lab info --json`.
- Use Svelte component import patterns from the project's aliases.
- Search, view, and install registry items with the CLI or MCP tools.
- Compose UI with existing components before writing custom markup.
- Follow shadcn-svelte form, icon, styling, and accessibility rules.
- Build and verify custom registries.

## Project Context

The first step in the skill workflow is to inspect the project.

```bash
npx @aihxp/shadcn-svelte-lab@latest info --json
```

That command returns the current `components.json`, configured registries, style, icon library, resolved paths, installed components, and docs links. The assistant should use those values instead of assuming import aliases or installed packages.

## Component Rules

The skill includes Svelte-specific rules for common mistakes:

- Multi-part components use namespace imports such as `import * as Dialog from "$lib/components/ui/dialog"`.
- Single components use named imports such as `import { Button } from "$lib/components/ui/button"`.
- Form layouts use `Field.FieldGroup` and `Field.Field`.
- Input adornments use `InputGroup.Root` with `InputGroup.Input` or `InputGroup.Textarea`.
- Icons inside buttons use `data-icon`.
- Styling uses semantic tokens and component variants instead of hardcoded colors.

## Registry And MCP

The skill knows the registry address forms supported by the CLI:

```bash
npx @aihxp/shadcn-svelte-lab@latest search @shadcn --query button
npx @aihxp/shadcn-svelte-lab@latest view @acme/editor
npx @aihxp/shadcn-svelte-lab@latest add acme/toolkit/project-conventions
```

When MCP is available, the assistant can use the server tools instead of shelling out for every registry read. See [MCP Server](/docs/mcp) and [Registry MCP](/docs/registry/mcp).

## Cursor Plugin Bundle

The repository also includes `.cursor-plugin/plugin.json`. The bundle points Cursor-compatible tooling at the skill directory and the MCP server.

```json title=".cursor-plugin/plugin.json" showLineNumbers
{
  "name": "shadcn-svelte-lab",
  "skills": "./skills/",
  "mcpServers": {
    "shadcn-svelte-lab": {
      "command": "npx",
      "args": ["@aihxp/shadcn-svelte-lab@latest", "mcp"]
    }
  }
}
```

## Good Prompts

Use prompts that let the assistant inspect the project before writing code:

- Add a settings form using the existing shadcn-svelte field components.
- Search for empty-state components and build a file-upload empty state.
- Inspect the project config and add a dashboard card using the current aliases.
- Build a login page using a registry block, then run the audit checklist.
