---
title: RTL
description: Configure right-to-left layouts with shadcn-svelte components.
---

shadcn-svelte components can be used in right-to-left layouts by setting the document direction and wrapping component subtrees with the [Direction](/docs/components/direction) component when they need explicit context.

The local CLI does not currently include upstream's automatic RTL migration command. Existing projects should migrate directional classes manually and add the Direction component where needed.

## Get Started

Choose your setup:

- [SvelteKit](/docs/rtl/sveltekit)
- [Vite](/docs/rtl/vite)
- [Astro](/docs/rtl/astro)

## Install Direction

```bash
pnpm dlx shadcn-svelte@latest add direction
```

Use `DirectionProvider` around the part of the app that should render RTL.

```svelte showLineNumbers
<script lang="ts">
  import { DirectionProvider } from "$lib/components/ui/direction";
</script>

<DirectionProvider dir="rtl">
  <slot />
</DirectionProvider>
```

## Directional CSS

Prefer logical utilities and RTL-aware utilities:

- Use `start-*` and `end-*` instead of `left-*` and `right-*`.
- Use `ms-*`, `me-*`, `ps-*`, and `pe-*` instead of left and right margin or padding utilities.
- Use `text-start` and `text-end` instead of `text-left` and `text-right`.
- Use `rtl:rotate-180` for directional icons when needed.

Some components already include RTL-aware classes for directional controls, including Calendar, Range Calendar, Switch, and Menubar.

## Fonts

Use fonts with strong support for your target language. Noto is a practical default for Arabic, Hebrew, Persian, and other RTL scripts.
