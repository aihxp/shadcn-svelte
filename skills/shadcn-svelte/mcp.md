# shadcn-svelte-lab MCP Server

The CLI includes an MCP server that lets agents inspect project setup, search registries, view registry items, fetch docs links, and generate install commands.

---

## Setup

```bash
shadcn-svelte-lab mcp
```

The command starts a stdio MCP server. Configure your MCP client to run the command through the package runner for the project:

```json
{
  "mcpServers": {
    "shadcn-svelte-lab": {
      "command": "npx",
      "args": ["@aihxp/shadcn-svelte-lab@latest", "mcp"]
    }
  }
}
```

Use `pnpm dlx` or `bunx --bun` instead of `npx` when that matches the project package manager.

---

## Tools

MCP clients usually expose these tools under the configured server name, for example `shadcn-svelte-lab:search_items_in_registries`.

### `get_project_info`

Returns the same structured project context as `shadcn-svelte-lab info --json`: package manager, framework, Svelte and Tailwind versions, `components.json`, resolved paths, configured registries, installed components, and helpful links.

**Input:** `cwd` (string, optional)

### `get_project_registries`

Returns the default registry, style, and namespace registry map from `components.json`.

**Input:** `cwd` (string, optional)

### `get_init_command`

Returns the package-manager-aware init command for the current project.

**Input:** `cwd` (string, optional)

### `list_items_in_registries`

Lists items from registries. Registries can be configured namespaces such as `@acme`, public GitHub sources such as `owner/repo`, or registry catalog URLs. Omit `registries` to use configured registries, falling back to `@shadcn`.

**Input:** `registries` (string[], optional), `types` (string[], optional, for example `["ui", "block"]`), `limit` (number, optional), `offset` (number, optional), `cwd` (string, optional)

### `search_items_in_registries`

Searches item names and descriptions across registries.

**Input:** `registries` (string[], optional), `query` (string), `types` (string[], optional), `limit` (number, optional), `offset` (number, optional), `cwd` (string, optional)

### `view_items_in_registries`

Returns full registry item JSON, including file contents when the item endpoint includes them.

**Input:** `items` (string[]), `cwd` (string, optional)

Examples:

```json
{
  "items": ["button", "@acme/editor", "owner/repo/item"]
}
```

### `get_component_docs`

Returns documentation, registry item, registry index, and `llms.txt` links for components.

**Input:** `components` (string[]), `cwd` (string, optional)

### `get_add_command_for_items`

Returns the package-manager-aware `shadcn-svelte-lab add` command for one or more items.

**Input:** `items` (string[]), `cwd` (string, optional)

### `get_audit_checklist`

Returns a short checklist for verifying generated or added components.

**Input:** none

---

## Registry Configuration

Namespaced and authenticated registries are configured in `components.json`:

```json
{
  "registries": {
    "@acme": "https://acme.com/r/{name}.json",
    "@private": {
      "url": "https://private.com/r/{name}.json",
      "headers": {
        "Authorization": "Bearer ${MY_TOKEN}"
      }
    }
  }
}
```

Rules:

- Names must start with `@`.
- Registry URLs must include `{name}`.
- `${VAR}` references are resolved from environment variables.
- Public GitHub registries can be addressed directly as `owner/repo/item` when the repository has a root `registry.json`.

Use `get_project_registries` before assuming a namespace exists.
