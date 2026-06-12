---
title: Registry
description: Run your own component registry.
---

<script>
	import Callout from "$lib/components/callout.svelte";
	import PMExecute from "$lib/components/pm-execute.svelte";
</script>

<Callout>

**Note:** This feature is experimental in `shadcn-svelte-lab`. Do not send lab-specific registry feedback to upstream unless the issue also reproduces in the canonical [shadcn-svelte](https://github.com/huntabyte/shadcn-svelte) project.

</Callout>

You can use the `shadcn-svelte-lab` CLI to create your own component registry. Creating your own registry allows you to distribute your own custom components, hooks, pages, and other files to any Svelte project.

Registry items are automatically compatible with the `shadcn-svelte-lab` CLI.

## Requirements

You are free to design and host your custom registry as you see fit. The only requirement is that your registry items must be valid JSON files that conform to the [registry-item schema specification](/docs/registry/registry-item-json).

If you want to see an example of a registry for this lab, this repository includes `registry-template` as a starting point. It uses the local lab CLI package and should be treated as an experimental reference.

You can clone the lab template using `degit`:

<PMExecute command="degit aihxp/shadcn-svelte-lab/registry-template" />

For the maintained upstream Svelte template, use the canonical [huntabyte/shadcn-svelte registry template](https://github.com/huntabyte/shadcn-svelte/tree/main/registry-template) instead.
