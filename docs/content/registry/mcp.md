---
title: MCP
description: Expose registry search, docs, and add guidance to coding agents.
---

The `shadcn-svelte mcp` command starts a Model Context Protocol server for agents. It lets an agent inspect the current project, discover configured registries, search items, view item JSON, fetch docs links, and build the exact `add` command for selected items.

## Configure A Client

Add the server to your MCP client configuration.

```json title="mcp.json" showLineNumbers
{
  "mcpServers": {
    "shadcn-svelte": {
      "command": "npx",
      "args": ["shadcn-svelte@latest", "mcp"]
    }
  }
}
```

If your client supports working-directory arguments, pass the project directory so the server can read `components.json`.

```json title="mcp.json" showLineNumbers
{
  "mcpServers": {
    "shadcn-svelte": {
      "command": "npx",
      "args": ["shadcn-svelte@latest", "mcp", "--cwd", "/path/to/project"]
    }
  }
}
```

## Registry Discovery

The MCP server reads the same `components.json` file as the CLI.

```json title="components.json" showLineNumbers
{
  "registries": {
    "@acme": "https://registry.acme.com/r/{name}.json",
    "@private": {
      "url": "https://registry.acme.com/private/{name}.json",
      "headers": {
        "Authorization": "Bearer ${ACME_REGISTRY_TOKEN}"
      }
    }
  }
}
```

Agents can list configured registries with `get_project_registries`, then search or view items from those registries.

## Tools

### get_project_info

Returns project setup, resolved aliases, configured registries, and installed components.

### get_project_registries

Returns the default registry URL, current style, and namespace registries from `components.json`.

### get_init_command

Returns the package-manager-specific init command for the current project.

### list_items_in_registries

Lists registry catalog items from configured namespaces, explicit namespaces, URLs, or GitHub source registries.

### search_items_in_registries

Searches registry catalog items by name and description.

### view_items_in_registries

Returns full registry item JSON for names, namespaces, URLs, or GitHub source registry items.

### get_component_docs

Returns docs, registry item, registry index, and `llms.txt` links for components.

### get_add_command_for_items

Returns the exact `shadcn-svelte add` command for selected items.

### get_audit_checklist

Returns a short post-install checklist for agents.

## Registry Author Tips

Good registry metadata makes agent results better.

- Add clear `title` and `description` values to every item.
- Keep `registryDependencies` complete so generated add commands install the full tree.
- Serve a catalog at the namespace `registry` path so search and listing work.
- Keep private registry auth in `components.json` and environment variables.
- Return precise HTTP status codes for missing items and auth failures.

For catalog details, see [Registry Index](/docs/registry/registry-index).
