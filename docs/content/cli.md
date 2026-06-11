---
title: shadcn-svelte
description: Use the shadcn-svelte CLI to initialize projects, apply presets, add components, inspect registries, and run agent tools.
---

<script>
	import PMExecute from "$lib/components/pm-execute.svelte";
</script>

The CLI can initialize projects, apply presets, add registry items, search and inspect registries, return docs links, start the MCP server, and help registry authors build or validate registry files.

## Commands

```txt
Usage: shadcn-svelte [options] [command]

Commands:
  add [components...]          Add components to your project
  apply [preset]               Apply a preset to an existing project
  docs <components...>         Get docs, API references, and usage examples
  info                         Inspect project configuration
  init                         Initialize your project and install dependencies
  mcp                          Start the MCP server
  preset                       Decode and inspect presets
  registry add [registries...] Add registries to components.json
  registry build [registry]    Build registry JSON files
  registry validate [registry] Validate a GitHub source registry
  search [registries...]       Search items from registries
  view <items...>              View registry items
```

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

## apply

Use the `apply` command to apply a preset from the create page to an existing project.

<PMExecute command="shadcn-svelte@latest apply --preset b2D0wqNxT" />

You can pass a preset code copied from `/create` or a shipped preset name:

```bash
shadcn-svelte apply lyra
shadcn-svelte apply --preset b2D0wqNxT
```

The command updates `components.json`, applies the preset stylesheet tokens and fonts, and reinstalls existing UI components when the preset changes style, icon library, or menu settings.

**Options**

```bash
Usage: shadcn-svelte apply [options] [preset]

apply a preset to an existing project

Arguments:
  preset              the preset code or preset name to apply

Options:
  --preset <preset>   the preset code or preset name to apply
  -c, --cwd <path>    the working directory (default: the current directory)
  --no-deps           skips adding & installing package dependencies
  --skip-preflight    ignore preflight checks and continue (default: false)
  -y, --yes           skip confirmation prompt (default: false)
  -o, --overwrite     overwrite existing component and stylesheet files (default: false)
  --no-reinstall      skip reinstalling existing components when style settings change
  --proxy <proxy>     fetch preset registry payload using a proxy
  -h, --help          display help for command
```

---

## preset

Use the `preset` command to decode preset codes, open them in the create page, and resolve the closest preset for the current project.

<PMExecute command="shadcn-svelte@latest preset decode b2D0wqNxT" />

**Subcommands**

```bash
shadcn-svelte preset decode <code>
shadcn-svelte preset url <code>
shadcn-svelte preset open <code>
shadcn-svelte preset resolve
```

Use `--json` with `decode` and `resolve` for scripts and agents:

```bash
shadcn-svelte preset decode b2D0wqNxT --json
shadcn-svelte preset resolve --json
```

`preset resolve` reads `components.json` and returns a portable preset code for the current project. Some create-page values are not stored in `components.json`; those values are inferred from shipped defaults and listed in `fallbacks`.

**Options**

```bash
Usage: shadcn-svelte preset [options] [command]

manage presets

Options:
  -h, --help              display help for command

Commands:
  decode [options] <code> decode a preset code
  resolve|info [options]  resolve a preset from your project
  url <code>              get the create URL for a preset code
  open <code>             open a preset code in the browser
```

---

## search

Use the `search` command to list or search registry items.

<PMExecute command="shadcn-svelte@latest search @shadcn --query button" />

Search a directory or configured namespace:

<PMExecute command="shadcn-svelte@latest search @ofkm --type ui" />

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

## registry add

Use the `registry add` command to add reusable namespace registries to `components.json`.

<PMExecute command="shadcn-svelte@latest registry add @ofkm" />

Pass a curated directory namespace, or provide a URL template directly:

```bash
shadcn-svelte registry add @ofkm
shadcn-svelte registry add @acme=https://registry.acme.test/{name}.json
```

Registry URL templates must include `{name}`. The `@shadcn` namespace is built in and is skipped if passed to this command.

**Options**

```bash
Usage: shadcn-svelte registry add [options] [registries...]

add registries to your project

Arguments:
  registries          registries (@namespace) or registry URLs (@namespace=url)

Options:
  -c, --cwd <path>    the working directory (default: the current directory)
  -s, --silent        mute output (default: false)
  -h, --help          display help for command
```

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

## registry validate

Use the `registry validate` command to check that a public GitHub source registry can be loaded and that declared item files are readable.

```bash
shadcn-svelte registry validate acme/toolkit
shadcn-svelte registry validate acme/toolkit#main
```

**Options**

```bash
Usage: shadcn-svelte registry validate [options] [registry]

validate a shadcn-svelte registry

Arguments:
  registry    GitHub registry source to validate, e.g. owner/repo or owner/repo#ref

Options:
  -h, --help  display help for command
```

---

## Outgoing Requests

### Proxy

This enables the use of a proxy when sending out requests to fetch from the `shadcn-svelte` registry. If the `HTTP_PROXY` or `http_proxy` environment variables have been set, the request library underneath will respect the proxy settings.

```bash
HTTP_PROXY="<proxy-url>" npx shadcn-svelte@latest init
```

Use a proxy only when your network requires one. To install from a custom registry, pass the item URL to `add` or set the `registry` value in `components.json`.
