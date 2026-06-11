---
title: shadcn-svelte
description: Use the shadcn-svelte CLI to add components to your project.
---

<script>
	import PMExecute from "$lib/components/pm-execute.svelte";
</script>

## init

Use the `init` command to initialize dependencies for a new project.

The `init` command installs dependencies, adds the `cn` util, and creates CSS variables for the project.

<PMExecute command="shadcn-svelte@latest init" />

You will be asked a few questions to configure `components.json`:

```txt showLineNumbers
Which base color would you like to use? › Slate
Where is your global CSS file? (this file will be overwritten) › src/routes/layout.css
Configure the import alias for lib: › $lib
Configure the import alias for components: › $lib/components
Configure the import alias for utils: › $lib/utils
Configure the import alias for hooks: › $lib/hooks
Configure the import alias for ui: › $lib/components/ui
```

**Options**

```bash
Usage: shadcn-svelte init [options]

initialize your project and install dependencies

Options:
  -c, --cwd <path>           the working directory (default: the current directory)
  -o, --overwrite            overwrite existing files (default: false)
  --no-deps                  disable adding & installing dependencies
  --skip-preflight           ignore preflight checks and continue (default: false)
  --base-color <name>        the base color for the components (choices: "slate", "gray", "zinc",
                             "neutral", "stone")
  --css <path>               path to the global CSS file
  --components-alias <path>  import alias for components
  --lib-alias <path>         import alias for lib
  --utils-alias <path>       import alias for utils
  --hooks-alias <path>       import alias for hooks
  --ui-alias <path>          import alias for ui
  --proxy <proxy>            fetch items from registry using a proxy
  -h, --help                 display help for command
```

---

## add

Use the `add` command to add components and dependencies to your project.

<PMExecute command="shadcn-svelte@latest add [component]" />

**Options**

```bash
Usage: shadcn-svelte add [options] [components...]

add components to your project

Arguments:
  components         the components to add or a url to the component

Options:
  -c, --cwd <path>   the working directory (default: the current directory)
  --no-deps         skips adding & installing package dependencies
  --no-hooks        skips running postAdd hooks from components.json
  --skip-preflight  ignore preflight checks and continue (default: false)
  -a, --all         install all components to your project (default: false)
  -y, --yes         skip confirmation prompt (default: false)
  -o, --overwrite   overwrite existing files (default: false)
  --proxy <proxy>   fetch components from registry using a proxy
  -h, --help        display help for command
```

To install a custom registry item, pass the registry item URL as the `components` argument:

<PMExecute command="shadcn-svelte@latest add https://example.com/r/button.json" />

The `--proxy` option is only for HTTP proxy servers. It does not set the registry URL.

---

## search

Use the `search` command to list or search registry items.

<PMExecute command="shadcn-svelte@latest search @shadcn --query button" />

Search a configured namespace:

<PMExecute command="shadcn-svelte@latest search @acme --type ui" />

Use `--json` for agent and script workflows:

```bash
shadcn-svelte search @shadcn --query button --json
```

**Options**

```bash
Usage: shadcn-svelte search [options] [registries...]

search items from registries

Arguments:
  registries           registry addresses to search. Supports namespaces, GitHub sources, and URLs

Options:
  -c, --cwd <path>     the working directory (default: the current directory)
  -q, --query <query>  query string
  -t, --type <type>    filter by item type, e.g. ui, block, hook. Comma-separated for multiple
  -l, --limit <number> maximum number of items to display
  -o, --offset <number> number of items to skip
  --json              output as JSON
  -h, --help          display help for command
```

---

## info

Use the `info` command to inspect project setup, `components.json`, configured registries, resolved paths, and installed components.

<PMExecute command="shadcn-svelte@latest info" />

Use `--json` for agent and script workflows:

```bash
shadcn-svelte info --json
```

**Options**

```bash
Usage: shadcn-svelte info [options]

get information about your project

Options:
  -c, --cwd <path>   the working directory (default: the current directory)
  --json            output as JSON
  -h, --help        display help for command
```

---

## docs

Use the `docs` command to get documentation and registry links for components.

<PMExecute command="shadcn-svelte@latest docs button" />

Use `--json` for agent and script workflows:

```bash
shadcn-svelte docs button card --json
```

**Options**

```bash
Usage: shadcn-svelte docs [options] <components...>

get docs, api references and usage examples for components

Arguments:
  components         component names

Options:
  -c, --cwd <path>   the working directory (default: the current directory)
  --json            output as JSON
  -h, --help        display help for command
```

---

## view

Use the `view` command to print registry item JSON. This is useful for scripts and agents that need item metadata, dependencies, docs, or file contents.

<PMExecute command="shadcn-svelte@latest view button" />

You can also view namespace, URL, and GitHub registry items:

```bash
shadcn-svelte view @acme/editor
shadcn-svelte view https://example.com/r/editor.json
shadcn-svelte view owner/repo/editor#main
```

**Options**

```bash
Usage: shadcn-svelte view [options] <items...>

view items from the registry

Arguments:
  items              item addresses to view

Options:
  -c, --cwd <path>   the working directory (default: the current directory)
  -h, --help         display help for command
```

---

## mcp

Use the `mcp` command to start the shadcn-svelte MCP server over stdio.

```bash
shadcn-svelte mcp
```

The server exposes tools for project inspection, registry discovery, item search and listing, item viewing, docs links, init command guidance, add command generation, and a short component audit checklist.

**Options**

```bash
Usage: shadcn-svelte mcp [options]

start the MCP server

Options:
  -c, --cwd <path>   the working directory (default: the current directory)
  -h, --help         display help for command
```

The deprecated `registry mcp` alias remains available for registry-author workflows and prints a migration notice.

---

## registry build

Use the `registry build` command to generate the registry JSON files.

<PMExecute command="shadcn-svelte@latest registry build [registry.json]" />

This command reads the `registry.json` file and generates the registry JSON files into the `static/r` directory.

**Options**

```bash
Usage: shadcn-svelte registry build [options] [registry]

build components for a shadcn-svelte registry

Arguments:
  registry             path to registry.json file (default: ./registry.json)

Options:
  -c, --cwd <path>     the working directory (default: the current directory)
  -o, --output <path>  destination directory for json files (default: ./static/r)
  -h, --help           display help for command
```

---

## Outgoing Requests

### Proxy

This enables the use of a proxy when sending out requests to fetch from the `shadcn-svelte` registry. If the `HTTP_PROXY` or `http_proxy` environment variables have been set, the request library underneath will respect the proxy settings.

```bash
HTTP_PROXY="<proxy-url>" npx shadcn-svelte@latest init
```

Use a proxy only when your network requires one. To install from a custom registry, pass the item URL to `add` or set the `registry` value in `components.json`.
