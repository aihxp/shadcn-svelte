<script lang="ts">
	import Metadata from "$lib/components/metadata.svelte";

	let { data } = $props();

	const dateFormatter = new Intl.DateTimeFormat("en", {
		month: "long",
		year: "numeric",
		timeZone: "UTC",
	});
</script>

<Metadata
	title="Changelog"
	description="Latest updates and announcements."
	ogImage={{
		url: `/og?title=${encodeURIComponent("Changelog")}&description=${encodeURIComponent("Latest updates and announcements.")}`,
	}}
	ogType="article"
/>

<div data-slot="docs" class="text-[1.05rem] sm:text-[15px] xl:w-full" id="main-content">
	<div class="mx-auto flex w-full max-w-2xl min-w-0 flex-1 flex-col px-4 py-12 md:px-0">
		<div class="flex flex-col gap-2">
			<h1 class="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
				Changelog
			</h1>
			<p class="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
				Latest updates and announcements.
			</p>
		</div>

		<div class="mt-10 flex flex-col gap-10">
			{#each data.pages as page}
				<article class="border-border border-b pb-10 last:border-b-0">
					<p class="text-muted-foreground text-sm">
						{dateFormatter.format(new Date(page.date))}
					</p>
					<h2 class="mt-2 text-2xl font-semibold tracking-tight">
						<a class="hover:underline" href={`/docs/changelog/${page.slug}`}>
							{page.title}
						</a>
					</h2>
					<p class="text-muted-foreground mt-2 text-base text-balance">
						{page.description}
					</p>
				</article>
			{/each}
		</div>
	</div>
</div>
