---
title: Authentication
description: Configure private registries with headers, query parameters, and environment variables.
---

<script>
	import Callout from "$lib/components/callout.svelte";
	import PMExecute from "$lib/components/pm-execute.svelte";
</script>

Private registries use the `registries` map in `components.json`. Each namespace can define a URL template, request headers, and query parameters.

Secrets stay in the user's environment. Do not commit tokens to `components.json`.

## Bearer Token

Use the object form when your registry needs request headers.

```json title="components.json" showLineNumbers
{
  "registries": {
    "@acme": {
      "url": "https://registry.acme.com/r/{name}.json",
      "headers": {
        "Authorization": "Bearer ${ACME_REGISTRY_TOKEN}"
      }
    }
  }
}
```

The CLI expands `${ACME_REGISTRY_TOKEN}` before each request. Header environment variables are required. If the token is missing, the CLI stops before fetching from the registry.

```bash
export ACME_REGISTRY_TOKEN="..."
```

Install, search, and view items with the namespace.

<PMExecute command="@aihxp/shadcn-svelte-lab@latest add @acme/editor" />

```bash
pnpm dlx @aihxp/shadcn-svelte-lab@latest search @acme --query editor
pnpm dlx @aihxp/shadcn-svelte-lab@latest view @acme/editor
```

## API Keys

If your registry uses an API key header, set the header name your server expects.

```json title="components.json" showLineNumbers
{
  "registries": {
    "@company": {
      "url": "https://registry.company.com/items/{name}.json",
      "headers": {
        "X-API-Key": "${COMPANY_REGISTRY_KEY}"
      }
    }
  }
}
```

## Query Parameters

Use `params` when your registry accepts authentication in the query string.

```json title="components.json" showLineNumbers
{
  "registries": {
    "@team": {
      "url": "https://registry.team.com/r/{name}.json",
      "params": {
        "token": "${TEAM_REGISTRY_TOKEN}",
        "workspace": "${TEAM_WORKSPACE_ID}"
      }
    }
  }
}
```

Missing parameter values are omitted from the request. If a parameter is required by your server, validate it on the server and return `401 Unauthorized` or `403 Forbidden`.

## SvelteKit Endpoint

A registry endpoint only needs to return a valid registry item JSON payload. Here is a minimal SvelteKit route that checks a bearer token.

```ts title="src/routes/r/[name].json/+server.ts" showLineNumbers
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

const registryItems = {
  editor: {
    $schema: "https://shadcn-svelte.com/schema/registry-item.json",
    name: "editor",
    type: "registry:block",
    title: "Editor",
    description: "A private editor block.",
    files: [
      {
        path: "editor.svelte",
        type: "registry:block",
        target: "src/lib/components/editor.svelte",
        content: '<script lang="ts"></script>\n\n<div>Editor</div>\n',
      },
    ],
  },
};

export const GET: RequestHandler = async ({ params, request }) => {
  const token = request.headers.get("authorization");

  if (token !== `Bearer ${process.env.ACME_REGISTRY_TOKEN}`) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  const item = registryItems[params.name as keyof typeof registryItems];

  if (!item) {
    return json({ error: "Not found" }, { status: 404 });
  }

  return json(item);
};
```

<Callout class="mt-6">

Use HTTPS for hosted private registries. Treat registry item JSON like source code because the CLI installs its files into the user's project.

</Callout>

## Test Requests

Test the same URL and headers the CLI will use before sharing a private namespace with a team.

```bash
curl \
  -H "Authorization: Bearer $ACME_REGISTRY_TOKEN" \
  https://registry.acme.com/r/editor.json
```

Then test through the CLI.

```bash
pnpm dlx @aihxp/shadcn-svelte-lab@latest view @acme/editor
```
