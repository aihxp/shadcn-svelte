---
title: Astro
description: Configure RTL direction in an Astro app that uses shadcn-svelte components.
---

## Static Direction

For a site that always renders RTL, set `dir="rtl"` in your Astro layout.

```astro title="src/layouts/base.astro" showLineNumbers
---
const { title = "App" } = Astro.props;
---

<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

## Svelte Islands

Install the Direction component.

```bash
pnpm dlx @aihxp/shadcn-svelte-lab@latest add direction
```

Wrap interactive Svelte islands with `DirectionProvider`.

```svelte title="src/components/rtl-panel.svelte" showLineNumbers
<script lang="ts">
  import { DirectionProvider } from "$lib/components/ui/direction";
  import { Button } from "$lib/components/ui/button";
</script>

<DirectionProvider dir="rtl">
  <div class="flex items-center gap-2">
    <Button>Save</Button>
    <Button variant="outline">Cancel</Button>
  </div>
</DirectionProvider>
```

Use a client directive when the component is interactive.

```astro title="src/pages/index.astro" showLineNumbers
---
import RtlPanel from "../components/rtl-panel.svelte";
---

<RtlPanel client:load />
```

## Tailwind Sources

Make sure Tailwind scans your generated Svelte components.

```css title="src/styles/global.css" showLineNumbers
@import "tailwindcss";
@source "../components";
```
