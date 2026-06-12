---
title: Vite
description: Configure RTL direction in a Svelte Vite app.
---

## Static Direction

For an app that always renders RTL, set `dir="rtl"` in `index.html`.

```html title="index.html" showLineNumbers
<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

## Direction Provider

Install the Direction component.

```bash
pnpm dlx @aihxp/shadcn-svelte-lab@latest add direction
```

Wrap your app.

```svelte title="src/App.svelte" showLineNumbers
<script lang="ts">
  import { DirectionProvider } from "$lib/components/ui/direction";
</script>

<DirectionProvider dir="rtl">
  <main>
    <slot />
  </main>
</DirectionProvider>
```

## Dynamic Direction

When direction changes at runtime, update the document element and the provider together.

```svelte title="src/App.svelte" showLineNumbers
<script lang="ts">
  import { DirectionProvider } from "$lib/components/ui/direction";

  let dir: "ltr" | "rtl" = $state("rtl");

  $effect(() => {
    document.documentElement.dir = dir;
  });
</script>

<DirectionProvider {dir}>
  <button type="button" onclick={() => (dir = dir === "rtl" ? "ltr" : "rtl")}>
    Toggle direction
  </button>
</DirectionProvider>
```
