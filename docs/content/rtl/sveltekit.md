---
title: SvelteKit
description: Configure RTL direction in a SvelteKit app.
---

## Static Direction

For an app that always renders RTL, set `dir="rtl"` in `src/app.html`.

```html title="src/app.html" showLineNumbers
<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    %sveltekit.head%
  </head>
  <body data-sveltekit-preload-data="hover">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>
```

## Direction Provider

Install the Direction component and wrap your layout.

```bash
pnpm dlx shadcn-svelte@latest add direction
```

```svelte title="src/routes/+layout.svelte" showLineNumbers
<script lang="ts">
  import { DirectionProvider } from "$lib/components/ui/direction";
  import "../app.css";

  let { children } = $props();
</script>

<DirectionProvider dir="rtl">
  {@render children()}
</DirectionProvider>
```

## Dynamic Direction

If direction changes by locale, pass it through layout data and set the document attribute on the client.

```svelte title="src/routes/+layout.svelte" showLineNumbers
<script lang="ts">
  import { browser } from "$app/environment";
  import { DirectionProvider } from "$lib/components/ui/direction";
  import type { LayoutData } from "./$types";

  let {
    data,
    children,
  }: { data: LayoutData; children: import("svelte").Snippet } = $props();

  $effect(() => {
    if (browser) {
      document.documentElement.dir = data.dir;
      document.documentElement.lang = data.lang;
    }
  });
</script>

<DirectionProvider dir={data.dir}>
  {@render children()}
</DirectionProvider>
```

## Tailwind Sources

No extra Tailwind setup is needed for `rtl:` variants. For shared UI packages in a monorepo, keep your `@source` paths pointed at the generated components.

```css title="src/app.css" showLineNumbers
@import "tailwindcss";
@source "../lib/components";
```
