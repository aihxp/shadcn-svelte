---
title: Table
description: A responsive table component.
component: true
links:
  source: https://github.com/huntabyte/shadcn-svelte/tree/next/sites/docs/src/lib/registry/ui/table
---

<script>
	import ComponentPreview from "$lib/components/component-preview.svelte";
	import ComponentSource from "$lib/components/component-source.svelte";
	import PMAddComp from "$lib/components/pm-add-comp.svelte";
	import PMInstall from "$lib/components/pm-install.svelte";
	import Steps from "$lib/components/steps.svelte";
	import Step from "$lib/components/step.svelte";
	import InstallTabs from "$lib/components/install-tabs.svelte";

	let { viewerData } = $props();
</script>

<ComponentPreview name="table-demo">

<div></div>

</ComponentPreview>

## Installation

<InstallTabs>
{#snippet cli()}
<PMAddComp name="table" />
{/snippet}
{#snippet manual()}
<Steps>

<Step>

Copy and paste the following code into your project.

</Step>
{#if viewerData}
	<ComponentSource item={viewerData} data-llm-ignore/>
{/if}

</Steps>
{/snippet}
</InstallTabs>

## Usage

```svelte showLineNumbers
<script lang="ts">
  import * as Table from "$lib/components/ui/table/index.js";
</script>
```

```svelte showLineNumbers
<Table.Root>
  <Table.Caption>A list of your recent invoices.</Table.Caption>
  <Table.Header>
    <Table.Row>
      <Table.Head class="w-[100px]">Invoice</Table.Head>
      <Table.Head>Status</Table.Head>
      <Table.Head>Method</Table.Head>
      <Table.Head class="text-end">Amount</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.Cell class="font-medium">INV001</Table.Cell>
      <Table.Cell>Paid</Table.Cell>
      <Table.Cell>Credit Card</Table.Cell>
      <Table.Cell class="text-end">$250.00</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table.Root>
```

## Sticky Header

For a fixed header with a scrollable body, put the scroll behavior on a wrapper with a constrained height and make `Table.Header` sticky.

`Table.Root` renders a `div` around the table, so set height and overflow on an outside wrapper instead of `Table.Body`.

```svelte showLineNumbers
<div class="max-h-[360px] overflow-auto rounded-md border">
  <Table.Root>
    <Table.Header class="bg-background sticky top-0 z-10">
      <Table.Row>
        <Table.Head>Invoice</Table.Head>
        <Table.Head>Status</Table.Head>
        <Table.Head class="text-end">Amount</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each invoices as invoice (invoice.id)}
        <Table.Row>
          <Table.Cell>{invoice.id}</Table.Cell>
          <Table.Cell>{invoice.status}</Table.Cell>
          <Table.Cell class="text-end">{invoice.amount}</Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
</div>
```

## Data Table

You can use the `<Table />` component to build more complex data tables. Combine it with [@tanstack/table](https://tanstack.com/table) to create tables with sorting, filtering and pagination.

See the [Data Table](/docs/components/data-table) documentation for more information.

You can also see an example of a data table in the [Tasks](/examples/tasks) demo.
