---
title: Formsnap
description: Use the shadcn-svelte Form component with Formsnap and Superforms.
links:
  doc: https://formsnap.dev
---

Formsnap is the established form integration used by the shadcn-svelte `Form` component. It pairs with `sveltekit-superforms` to connect SvelteKit actions, validation, form state, and accessible field markup.

## Install

```bash
pnpm dlx @aihxp/shadcn-svelte-lab@latest add form
pnpm add sveltekit-superforms zod
```

## Anatomy

```svelte showLineNumbers
<form method="POST" use:enhance>
  <Form.Field {form} name="email">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Email</Form.Label>
        <Input {...props} bind:value={$formData.email} />
      {/snippet}
    </Form.Control>
    <Form.Description>We will never share your email.</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
</form>
```

The important pieces are:

- `Form.Field` scopes state and errors to one field name.
- `Form.Control` provides the generated props for the actual input.
- `Form.Label` is associated with the input.
- `Form.FieldErrors` renders validation messages from Superforms.

## With Shadcn-Svelte Controls

Spread `props` onto native-input-like controls such as `Input` and `Textarea`.

```svelte showLineNumbers
<Form.Control>
  {#snippet children({ props })}
    <Form.Label>Bio</Form.Label>
    <Textarea {...props} bind:value={$formData.bio} />
  {/snippet}
</Form.Control>
```

For headless controls such as Select, Checkbox, Radio Group, and Switch, follow the component-specific examples in [Form](/docs/components/form) and [Select](/docs/components/select). These components usually need explicit value or checked binding instead of a direct native prop spread.

## Client And Server Validation

Use Superforms adapters for the schema library you choose. Zod is the default shown in the shadcn-svelte docs.

```ts showLineNumbers
import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { formSchema } from "./schema";

const form = await superValidate(zod4(formSchema));
```

Use `zod4Client(formSchema)` in the client form component when you want client-side validation.

## Next Steps

For a complete route-level example, see [SvelteKit Forms](/docs/forms/sveltekit). For the component API, see [Form](/docs/components/form).
