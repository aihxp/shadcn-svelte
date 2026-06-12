<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { LightSwitch } from "$lib/components/ui/light-switch";
</script>

<header class="sticky top-0 flex w-full items-center justify-end p-4">
	<LightSwitch variant="outline" size="icon" />
</header>

<main class="flex h-screen flex-col place-items-center justify-center gap-2">
	<h1 class="text-4xl font-bold">shadcn-svelte-lab repro template</h1>
	<p class="text-muted-foreground">
		Import and use components here to create a local reproduction for this lab.
	</p>
	<Button variant="outline" href="https://github.com/aihxp/shadcn-svelte-lab">GitHub</Button>
</main>
