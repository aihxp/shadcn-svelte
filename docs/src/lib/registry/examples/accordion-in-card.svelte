<script lang="ts">
	import * as Accordion from "$lib/registry/ui/accordion/index.js";
	import { Button } from "$lib/registry/ui/button/index.js";
	import * as Card from "$lib/registry/ui/card/index.js";
	import ArrowUpRightIcon from "@lucide/svelte/icons/arrow-up-right";

	const items = [
		{
			value: "plans",
			trigger: "What subscription plans do you offer?",
			content: [
				"We offer starter, professional, and enterprise plans with increasing storage, API access, and support.",
			],
			hasButton: true,
		},
		{
			value: "billing",
			trigger: "How does billing work?",
			content: [
				"Billing occurs automatically at the start of each cycle. You can update payment details in settings.",
				"You will receive an invoice by email after each payment.",
			],
		},
		{
			value: "cancel",
			trigger: "How do I cancel my subscription?",
			content: [
				"You can cancel anytime from account settings. Your access continues until the end of the current period.",
			],
		},
	];
</script>

<Card.Root class="w-full max-w-lg gap-4">
	<Card.Header>
		<Card.Title>Subscription and Billing</Card.Title>
		<Card.Description>Common questions about plans and payments.</Card.Description>
	</Card.Header>
	<Card.Content>
		<Accordion.Root type="multiple" value={["plans"]}>
			{#each items as item (item.value)}
				<Accordion.Item value={item.value}>
					<Accordion.Trigger>{item.trigger}</Accordion.Trigger>
					<Accordion.Content>
						{#each item.content as paragraph, i (i)}
							<p>{paragraph}</p>
						{/each}
						{#if item.hasButton}
							<Button size="sm" class="mt-2">
								View plans
								<ArrowUpRightIcon />
							</Button>
						{/if}
					</Accordion.Content>
				</Accordion.Item>
			{/each}
		</Accordion.Root>
	</Card.Content>
</Card.Root>
