<script lang="ts">
	const tasks = [
		"Install shared UI with pnpm dlx @aihxp/shadcn-svelte-lab@latest add button",
		"Keep app blocks in apps/web/src/lib/components",
		"Share reusable UI from packages/ui",
	];
</script>

<main class="bg-background text-foreground min-h-svh">
	<section class="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-12">
		<div class="space-y-3">
			<p class="text-muted-foreground text-sm font-medium">shadcn-svelte starter</p>
			<h1 class="text-3xl font-semibold tracking-normal sm:text-4xl">Vite monorepo</h1>
			<p class="text-muted-foreground max-w-2xl text-base">
				A workspace setup with a Svelte and Vite app plus a shared UI package ready for
				shadcn-svelte-lab registry installs.
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
