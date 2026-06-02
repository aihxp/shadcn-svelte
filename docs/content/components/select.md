---
title: Select
description: Displays a list of options for the user to pick from—triggered by a button.
component: true
links:
  source: https://github.com/huntabyte/shadcn-svelte/tree/next/sites/docs/src/lib/registry/ui/select
  doc: https://bits-ui.com/docs/components/select
  api: https://bits-ui.com/docs/components/select#api-reference
---

<script>
	import ComponentPreview from "$lib/components/component-preview.svelte";
	import ComponentSource from "$lib/components/component-source.svelte";
	import PMAddComp from "$lib/components/pm-add-comp.svelte";
	import PMInstall from "$lib/components/pm-install.svelte";
	import Steps from "$lib/components/steps.svelte";
	import InstallTabs from "$lib/components/install-tabs.svelte";

	let { viewerData } = $props();
	import Step from "$lib/components/step.svelte";
</script>

<ComponentPreview name="select-demo">

<div></div>

</ComponentPreview>

## Installation

<InstallTabs>
{#snippet cli()}
<PMAddComp name="select" />
{/snippet}
{#snippet manual()}
<Steps>

<Step>

Install `bits-ui`:

</Step>

<PMInstall command="bits-ui -D" />

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
  import * as Select from "$lib/components/ui/select/index.js";
</script>
```

```svelte showLineNumbers
<Select.Root type="single">
  <Select.Trigger class="w-[180px]"></Select.Trigger>
  <Select.Content>
    <Select.Item value="light">Light</Select.Item>
    <Select.Item value="dark">Dark</Select.Item>
    <Select.Item value="system">System</Select.Item>
  </Select.Content>
</Select.Root>
```

## Remote Functions

When using a SvelteKit remote form field with `Select`, keep the `Select.Root` value controlled and update the remote field in `onValueChange`.

Avoid spreading `field.as("select")` directly onto `Select.Root`. It can pass native select props that do not match the Bits UI root API.

```svelte showLineNumbers
<script lang="ts">
  import * as Field from "$lib/components/ui/field/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import { addUser, getDepartments } from "./user.remote.js";

  const departments = await getDepartments();

  const departmentProps = $derived.by(() => {
    const { value: _value, ...rest } = addUser.fields.department.as("text");
    return rest;
  });

  const selectedDepartment = $derived(
    departments.find(
      (department) => department.id === addUser.fields.department.value()
    )
  );
</script>

<Field.Field>
  <Field.Label for="department">Department</Field.Label>
  <Select.Root
    type="single"
    {...departmentProps}
    value={selectedDepartment?.id ?? ""}
    onValueChange={(value) => {
      addUser.fields.department.set(value);
      if (addUser.fields.department.issues()?.length) addUser.validate();
    }}
  >
    <Select.Trigger id="department">
      {selectedDepartment?.name ?? "Select a department"}
    </Select.Trigger>
    <Select.Content>
      {#each departments as department (department.id)}
        <Select.Item value={department.id}>{department.name}</Select.Item>
      {/each}
    </Select.Content>
  </Select.Root>
  {#each addUser.fields.department.issues() as issue}
    <Field.Error>{issue.message}</Field.Error>
  {/each}
</Field.Field>
```

## Examples

### Scrollable

<ComponentPreview name="select-scrollable">

<div></div>

</ComponentPreview>
