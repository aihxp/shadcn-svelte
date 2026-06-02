<script lang="ts">
	import * as Accordion from "$lib/registry/ui/accordion/index.js";

	const items = [
		{
			value: "item-1",
			trigger: "Can I access my account history?",
			content:
				"Yes. You can view your account history, invoices, and support requests from your dashboard.",
			disabled: false,
		},
		{
			value: "item-2",
			trigger: "Premium feature information",
			content:
				"This section contains information about premium features and is disabled in the demo.",
			disabled: true,
		},
		{
			value: "item-3",
			trigger: "How do I update my email address?",
			content:
				"Update your email address in account settings, then confirm the change from your inbox.",
			disabled: false,
		},
	];
</script>

<Accordion.Root type="single" class="w-full max-w-lg overflow-hidden rounded-lg border">
	{#each items as item (item.value)}
		<Accordion.Item
			value={item.value}
			disabled={item.disabled}
			class="data-[state=open]:bg-muted/50 px-4"
		>
			<Accordion.Trigger>{item.trigger}</Accordion.Trigger>
			<Accordion.Content>{item.content}</Accordion.Content>
		</Accordion.Item>
	{/each}
</Accordion.Root>
