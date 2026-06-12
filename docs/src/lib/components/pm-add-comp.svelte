<script lang="ts">
	import PMExecute from "./pm-execute.svelte";

	let { name }: { name: string } = $props();
</script>

<PMExecute command={`@aihxp/shadcn-svelte-lab@latest add ${name}`} />
