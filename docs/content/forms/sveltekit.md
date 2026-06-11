---
title: SvelteKit
description: Build SvelteKit forms with shadcn-svelte, Formsnap, Superforms, and server actions.
---

The recommended SvelteKit form path is `Form` from shadcn-svelte with Formsnap and `sveltekit-superforms`. This gives you progressive enhancement, server validation, client validation, and accessible form markup.

## Install

```bash
pnpm dlx shadcn-svelte@latest add form input button
pnpm add sveltekit-superforms zod
```

## Schema

Define the shape of the form with Zod.

```ts title="src/routes/settings/schema.ts" showLineNumbers
import { z } from "zod";

export const formSchema = z.object({
  username: z.string().min(2).max(50),
});

export type FormSchema = typeof formSchema;
```

## Server Load And Action

Create a Superforms form in `load`, validate the submitted request in the default action, and return `fail(400, { form })` when validation fails.

```ts title="src/routes/settings/+page.server.ts" showLineNumbers
import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import type { Actions, PageServerLoad } from "./$types";
import { formSchema } from "./schema";

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod4(formSchema)),
  };
};

export const actions: Actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, zod4(formSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    return { form };
  },
};
```

## Form Component

Use the generated `Form` components to bind labels, descriptions, controls, and errors.

```svelte title="src/routes/settings/settings-form.svelte" showLineNumbers
<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import {
    superForm,
    type Infer,
    type SuperValidated,
  } from "sveltekit-superforms";
  import { zod4Client } from "sveltekit-superforms/adapters";
  import { formSchema, type FormSchema } from "./schema";

  let { form: initialForm }: { form: SuperValidated<Infer<FormSchema>> } =
    $props();

  const form = superForm(initialForm, {
    validators: zod4Client(formSchema),
  });

  const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance class="flex flex-col gap-6">
  <Form.Field {form} name="username">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Username</Form.Label>
        <Input {...props} bind:value={$formData.username} />
      {/snippet}
    </Form.Control>
    <Form.Description>This is your public display name.</Form.Description>
    <Form.FieldErrors />
  </Form.Field>

  <Button type="submit">Save</Button>
</form>
```

Render it from the page.

```svelte title="src/routes/settings/+page.svelte" showLineNumbers
<script lang="ts">
  import type { PageData } from "./$types";
  import SettingsForm from "./settings-form.svelte";

  let { data }: { data: PageData } = $props();
</script>

<SettingsForm form={data.form} />
```

## When To Use Field Instead

Use the standalone [Field](/docs/components/field) component when your form library already owns form state and you only need layout, labels, descriptions, and errors.

The `Form` components are best when you are using Formsnap and Superforms.
