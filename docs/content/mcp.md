---
title: MCP Server
description: Use the shadcn-svelte-lab MCP server to browse, search, inspect, and install registry items with an AI assistant.
---

<script>
	import Callout from "$lib/components/callout.svelte";
</script>

The `shadcn-svelte-lab` MCP server gives AI assistants structured access to your project, configured registries, and directory registries. Agents can inspect `components.json`, search registries, view registry item JSON, fetch component docs links, and generate the right `add` command for your package manager.

Private and team registries are configured in your project's `components.json` file. Directory namespaces can be searched directly.

```json title="components.json" showLineNumbers
{
  "registries": {
    "@acme": "https://registry.acme.com/r/{name}.json"
  }
}
```

## Start The Server

Run the server through your package runner.

```bash
npx @aihxp/shadcn-svelte-lab@latest mcp
```

Use `pnpm dlx @aihxp/shadcn-svelte-lab@latest mcp` or `bunx --bun @aihxp/shadcn-svelte-lab@latest mcp` when that matches your project.

<Callout class="mt-6">

The local CLI starts the MCP server directly. It does not currently ship an `mcp init` command that edits client config files for you.

</Callout>

## Claude Code

Add the server to your project's `.mcp.json` file.

```json title=".mcp.json" showLineNumbers
{
  "mcpServers": {
    "shadcn-svelte-lab": {
      "command": "npx",
      "args": ["@aihxp/shadcn-svelte-lab@latest", "mcp"]
    }
  }
}
```

Restart Claude Code and run `/mcp` to verify that the server is connected.

## Cursor

Add the server to `.cursor/mcp.json`.

```json title=".cursor/mcp.json" showLineNumbers
{
  "mcpServers": {
    "shadcn-svelte-lab": {
      "command": "npx",
      "args": ["@aihxp/shadcn-svelte-lab@latest", "mcp"]
    }
  }
}
```

Enable the server from Cursor settings after adding the file.

## VS Code

Add the server to `.vscode/mcp.json`.

```json title=".vscode/mcp.json" showLineNumbers
{
  "servers": {
    "shadcn-svelte-lab": {
      "command": "npx",
      "args": ["@aihxp/shadcn-svelte-lab@latest", "mcp"]
    }
  }
}
```

Open the file in VS Code and start the server from the MCP controls.

## Codex

Add the server to `~/.codex/config.toml`.

```toml title="~/.codex/config.toml" showLineNumbers
[mcp_servers.shadcn-svelte-lab]
command = "npx"
args = ["@aihxp/shadcn-svelte-lab@latest", "mcp"]
```

Restart Codex after editing the config.

## Tools

The server exposes these tools:

- `get_project_info`: inspect framework, aliases, registries, resolved paths, and installed components.
- `get_project_registries`: list the default registry, current style, and namespace registry map.
- `get_init_command`: return the package-manager-aware init command.
- `list_items_in_registries`: list catalog items from configured registries, directory namespaces, explicit namespaces, URLs, or GitHub source registries.
- `search_items_in_registries`: search registry item names and descriptions.
- `view_items_in_registries`: return full registry item JSON.
- `get_component_docs`: return docs, registry item, registry index, and `llms.txt` links.
- `get_add_command_for_items`: return the exact `shadcn-svelte-lab add` command for selected items.
- `get_audit_checklist`: return a short checklist for verifying added components.

## Example Prompts

Once the server is connected, try prompts like:

- Show me the components installed in this project.
- Search the shadcn-svelte-lab registry for empty states.
- Add the button, dialog, and field components.
- Find a login block and give me the add command.
- Show me items from the `@ofkm` registry.

## Private Registries

Private registries use the same namespace configuration as the CLI.

```json title="components.json" showLineNumbers
{
  "registries": {
    "@private": {
      "url": "https://registry.company.com/r/{name}.json",
      "headers": {
        "Authorization": "Bearer ${REGISTRY_TOKEN}"
      }
    }
  }
}
```

Set the environment variable in the shell or client process that launches the MCP server.

```bash
export REGISTRY_TOKEN="..."
```

For registry details, see [Directory](/docs/directory), [Namespaces](/docs/registry/namespace), [Authentication](/docs/registry/authentication), and [Registry MCP](/docs/registry/mcp).
