---
title: Installation
description: How to install dependencies and structure your app.
---

<script>
	import InstallCards from '$lib/components/install-cards.svelte'
	import SvelteWhite from '$lib/components/svelte-white.svelte'
</script>

## Guides

<InstallCards />

## Imports

Unlike the original [shadcn/ui](https://ui.shadcn.com) for React, where the full components can exist in a single file, components in this port are split into multiple files. This is because Svelte doesn't support defining multiple components in a single file, so utilizing the CLI to add components will be the optimal approach.

The CLI will create a folder for _each_ component, which will sometimes just contain a single Svelte file, and in other times, multiple files. Within each folder, there will be an `index.ts` file that exports the component(s), so you can import them from a single file.

For example, the Accordion component is split into four `.svelte` files:

- `accordion.svelte`
- `accordion-content.svelte`
- `accordion-item.svelte`
- `accordion-trigger.svelte`

They can then be imported from the `accordion/index.ts` file like so:

```ts
import * as Accordion from '$lib/components/ui/accordion"
// or
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "$lib/components/ui/accordion"
```

Regardless of the import approach you take, the components will be tree-shaken by Rollup, so you don't have to worry about unused components being bundled into your app.

## Troubleshooting

### Components Render Without Styles

If a component renders as plain HTML with Tailwind class names in the DOM, check two setup points.

First, make sure the global CSS file selected during `init` is imported by your app shell.

```svelte title="src/routes/+layout.svelte" showLineNumbers
<script lang="ts">
  import "../app.css";
</script>

<slot />
```

If your global CSS file lives at `src/routes/layout.css`, import that file from the same layout instead.

Second, for Tailwind v4 projects where components live outside the files Tailwind scans automatically, add a source directive to the global CSS file. Adjust the path so it is relative to that CSS file and points at your generated UI component directory.

```css title="src/app.css" showLineNumbers
@source "./lib/components/ui";
```

For the default `src/routes/layout.css` path, the same UI directory is usually one level up:

```css title="src/routes/layout.css" showLineNumbers
@source "../lib/components/ui";
```

For monorepos, shared UI packages, or SSR errors from generated `.svelte` component dependencies, see the [SvelteKit installation notes](/docs/installation/sveltekit#configure-monorepo-shared-ui-packages) for `noExternal`, `dedupe`, and Tailwind source setup.

## VSCode extension

Install the shadcn-svelte [VSCode extension](https://marketplace.visualstudio.com/items?itemName=Selemondev.vscode-shadcn-svelte) by [@selemondev](https://github.com/selemondev) in Visual Studio Code to easily add Shadcn Svelte components to your project.

This extension offers a range of features:

- Ability to initialize the shadcn-svelte-lab CLI
- Add components to your project
- Navigate to a specific component's documentation page directly from your IDE
- Handy snippets for quick component imports and markup

## JetBrains IDEs extension

Install the shadcn/ui Components Manager [JetBrains extension](https://plugins.jetbrains.com/plugin/23479-shadcn-ui-components-manager) by [@WarningImHack3r](https://github.com/WarningImHack3r) in any JetBrains IDE (IntelliJ IDEA, WebStorm...) to easily manage shadcn components within your project.

This extension offers a range of features, including:

- Automatically detect shadcn/ui components in your project
- Instantly add, remove, and update them with a single click
- Supports all shadcn/ui implementations: Svelte, React, Vue, and Solid
- Easily search for remote or existing components
