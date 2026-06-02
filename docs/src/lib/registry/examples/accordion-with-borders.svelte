<script lang="ts">
	import * as Accordion from "$lib/registry/ui/accordion/index.js";

	const items = [
		{
			value: "billing",
			trigger: "How does billing work?",
			content:
				"Billing is charged at the beginning of each cycle. You can switch plans or cancel from settings.",
		},
		{
			value: "security",
			trigger: "Is my data secure?",
			content:
				"All data is encrypted at rest and in transit, with optional two-factor authentication.",
		},
		{
			value: "integrations",
			trigger: "What integrations do you support?",
			content:
				"We support popular tools including Slack, Zapier, Salesforce, HubSpot, and custom webhooks.",
		},
	];
</script>

<Accordion.Root type="single" class="flex w-full max-w-lg flex-col gap-2">
	{#each items as item (item.value)}
		<Accordion.Item value={item.value} class="rounded-lg border px-4">
			<Accordion.Trigger>{item.trigger}</Accordion.Trigger>
			<Accordion.Content class="text-muted-foreground">
				{item.content}
			</Accordion.Content>
		</Accordion.Item>
	{/each}
</Accordion.Root>
