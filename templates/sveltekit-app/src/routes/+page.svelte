<script lang="ts">
	const tasks = [
		"Install a component with pnpm dlx @aihxp/shadcn-svelte-lab@latest add button",
		"Edit src/app.css to tune tokens",
		"Build your app flow in src/routes",
	];
</script>

<svelte:head>
	<title>SvelteKit Starter</title>
</svelte:head>

<main class="bg-background text-foreground min-h-svh">
	<section class="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-12">
		<div class="space-y-3">
			<p class="text-muted-foreground text-sm font-medium">shadcn-svelte starter</p>
			<h1 class="text-3xl font-semibold tracking-normal sm:text-4xl">SvelteKit app</h1>
			<p class="text-muted-foreground max-w-2xl text-base">
				A clean SvelteKit project with Tailwind CSS v4, shadcn-svelte theme tokens, and CLI
				aliases ready for registry installs.
			</p>
		</div>

		<div class="bg-card text-card-foreground rounded-lg border p-5 shadow-sm">
			<h2 class="text-sm font-medium">Ready checks</h2>
			<ul class="text-muted-foreground mt-4 grid gap-3 text-sm">
				{#each tasks as task}
					<li class="bg-background rounded-md border px-3 py-2">{task}</li>
				{/each}
			</ul>
		</div>
	</section>
</main>
