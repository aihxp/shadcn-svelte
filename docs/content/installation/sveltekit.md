---
title: SvelteKit
description: How to setup shadcn-svelte in a SvelteKit project.
---

<script>
	import * as Alert from "$lib/registry/ui/alert/index.js";
	import Steps from "$lib/components/steps.svelte";
	import PMCreate from "$lib/components/pm-create.svelte";
	import PMExecute from "$lib/components/pm-execute.svelte";
	import PMInstall from "$lib/components/pm-install.svelte";
	import PMAddComp from "$lib/components/pm-add-comp.svelte";
</script>

<Steps>

### Create project

Use the SvelteKit CLI to create a new project with TailwindCSS

<PMExecute command="sv create my-app --add tailwindcss" />

### Setup path aliases

If you are not using the default alias `$lib`, you'll need to update your `svelte.config.js` file to include those aliases.

```ts title="svelte.config.js" {6} showLineNumbers
const config = {
  // ... other config
  kit: {
    // ... other config
    alias: {
      "@/*": "./path/to/lib/*",
    },
  },
};
```

### Run the CLI

<PMExecute command="@aihxp/shadcn-svelte-lab@latest init" />

### Configure Vite SSR dependencies

If your production SSR build reports an unknown `.svelte` file extension from `bits-ui` or another Svelte dependency, add those packages to `ssr.noExternal` in your Vite config so Vite processes them through the Svelte plugin pipeline. This is especially useful in monorepos where dependency externalization can differ between packages.

```ts title="vite.config.ts" {8-10} showLineNumbers
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  ssr: {
    noExternal: ["@lucide/svelte", "bits-ui", "runed", "svelte-toolbelt"],
  },
});
```

See the [Vite SSR noExternal option](https://vite.dev/config/ssr-options.html#ssr-noexternal) for more details.

### Debug undefined primitive exports

If the dev server throws `Cannot read properties of undefined (reading 'Root')` or a similar error from a generated `ui/*/index.ts` file, treat it as an SSR dependency resolution problem first. This can happen during the first cold SSR evaluation of Bits UI or another Svelte primitive package.

Use the `ssr.noExternal` config above, dedupe `svelte`, and make sure your lockfile resolves a single compatible version of `bits-ui`. After changing dependency or Vite config, stop the dev server and clear Vite's cache if the error only disappears after saving the generated component file.

```bash
rm -rf node_modules/.vite
```

Do not wrap generated primitive exports in `browser` guards. That hides the SSR problem and can produce mismatched client behavior.

### Configure monorepo shared UI packages

If you move generated components into a workspace package, make sure the SvelteKit app and the shared UI package resolve the same Svelte runtime. Context-driven components such as `Sidebar`, `Form`, `Dialog`, and `Tooltip` depend on `setContext` and `getContext`, so duplicate Svelte runtimes can make child components unable to read provider state.

In the UI package, keep `svelte` in `peerDependencies` and `devDependencies`, and avoid bundling it into the package output.

```json title="packages/ui/package.json" showLineNumbers
{
  "peerDependencies": {
    "svelte": "^5.0.0"
  },
  "devDependencies": {
    "svelte": "^5.0.0"
  }
}
```

In the app, dedupe `svelte` and process the shared UI package through Vite during SSR.

```ts title="apps/web/vite.config.ts" {7-12} showLineNumbers
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  resolve: {
    dedupe: ["svelte"],
  },
  ssr: {
    noExternal: [
      "@my-org/ui",
      "@lucide/svelte",
      "bits-ui",
      "runed",
      "svelte-toolbelt",
    ],
  },
});
```

Import every part of a component from the same package entrypoint. For example, do not render `Sidebar.Provider` from one compiled package copy and `Sidebar.Root` from another.

### Configure components.json

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

### That's it

You can now start adding components to your project.

<PMAddComp name="button" />

The command above will add the `Button` component to your project. You can then import it like this:

```svelte {2,5} showLineNumbers
<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
</script>

<Button>Click me</Button>
```

</Steps>
