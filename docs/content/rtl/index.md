---
title: RTL
description: Configure right-to-left layouts with shadcn-svelte components.
---

shadcn-svelte components can be used in right-to-left layouts by setting the document direction and wrapping component subtrees with the [Direction](/docs/components/direction) component when they need explicit context.

The CLI includes an RTL migration that updates common physical Tailwind utilities to logical utilities and marks the project with `rtl: true` in `components.json`.

## Get Started

Choose your setup:

- [SvelteKit](/docs/rtl/sveltekit)
- [Vite](/docs/rtl/vite)
- [Astro](/docs/rtl/astro)

## Install Direction

```bash
pnpm dlx @aihxp/shadcn-svelte-lab@latest add direction
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

## Migrate Classes

Run the migration from the root of a project that already has `components.json`.

```bash
pnpm dlx @aihxp/shadcn-svelte-lab@latest migrate rtl
```

You can also pass a path or glob when you want to migrate a smaller surface.

```bash
pnpm dlx @aihxp/shadcn-svelte-lab@latest migrate rtl src/lib/components/ui
pnpm dlx @aihxp/shadcn-svelte-lab@latest migrate rtl "src/lib/components/ui/**/*.svelte"
```

The migration rewrites utilities such as `ml-*`, `mr-*`, `pl-*`, `pr-*`, `left-*`, `right-*`, `text-left`, `text-right`, `rounded-l-*`, and `border-r-*` to logical equivalents. It also adds RTL variants for `space-x-*`, `divide-x-*`, and `translate-x-*`.

Review the diff after running it. Components with physical side behavior, such as Sidebar, Calendar, Range Calendar, and Pagination, may need manual adjustments.

## Directional CSS

Prefer logical utilities and RTL-aware utilities:

- Use `start-*` and `end-*` instead of `left-*` and `right-*`.
- Use `ms-*`, `me-*`, `ps-*`, and `pe-*` instead of left and right margin or padding utilities.
- Use `text-start` and `text-end` instead of `text-left` and `text-right`.
- Use `rtl:rotate-180` for directional icons when needed.

Some components already include RTL-aware classes for directional controls, including Calendar, Range Calendar, Switch, and Menubar.

## Fonts

Use fonts with strong support for your target language. Noto is a practical default for Arabic, Hebrew, Persian, and other RTL scripts.
