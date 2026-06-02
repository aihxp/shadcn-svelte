<script lang="ts">
	import * as Accordion from "$lib/registry/ui/accordion/index.js";

	const items = [
		{
			value: "item-1",
			trigger: "What is included in the starter plan?",
			content:
				"The starter plan includes unlimited projects, basic analytics, and community support.",
		},
		{
			value: "item-2",
			trigger: "Can I invite my team?",
			content:
				"Yes. You can invite team members, assign roles, and manage permissions from settings.",
		},
		{
			value: "item-3",
			trigger: "Do you offer priority support?",
			content:
				"Priority support is available on paid plans and includes faster response times.",
		},
	];
</script>

<Accordion.Root type="multiple" class="w-full max-w-lg">
	{#each items as item (item.value)}
		<Accordion.Item value={item.value}>
			<Accordion.Trigger>{item.trigger}</Accordion.Trigger>
			<Accordion.Content>{item.content}</Accordion.Content>
		</Accordion.Item>
	{/each}
</Accordion.Root>
