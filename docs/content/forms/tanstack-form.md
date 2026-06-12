---
title: TanStack Form
description: Build forms with the TanStack Form Svelte adapter and shadcn-svelte Field components.
links:
  doc: https://tanstack.com/form/latest/docs/framework/svelte
---

TanStack Form has a Svelte adapter through `@tanstack/svelte-form`. It gives you a headless form model, field state, validators, subscriptions, and array helpers. Use shadcn-svelte `Field` components for markup and accessibility.

## Install

```bash
pnpm dlx @aihxp/shadcn-svelte-lab@latest add field input button
pnpm add @tanstack/svelte-form
```

## Basic Form

```svelte title="bug-report-form.svelte" showLineNumbers
<script lang="ts">
  import { createForm } from "@tanstack/svelte-form";
  import * as Field from "$lib/components/ui/field";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";

  const form = createForm(() => ({
    defaultValues: {
      title: "",
    },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  }));
</script>

<form
  class="flex flex-col gap-6"
  onsubmit={(event) => {
    event.preventDefault();
    event.stopPropagation();
    form.handleSubmit();
  }}
>
  <form.Field
    name="title"
    validators={{
      onChange: ({ value }) =>
        value.length < 5 ? "Title must be at least 5 characters." : undefined,
    }}
  >
    {#snippet children(field)}
      {@const isInvalid =
        field.state.meta.isTouched && !field.state.meta.isValid}

      <Field.Field data-invalid={isInvalid}>
        <Field.Label for={field.name}>Bug title</Field.Label>
        <Input
          id={field.name}
          name={field.name}
          value={field.state.value}
          onblur={field.handleBlur}
          oninput={(event) => {
            const target = event.target as HTMLInputElement;
            field.handleChange(target.value);
          }}
          aria-invalid={isInvalid}
          placeholder="Login button is not working"
        />
        <Field.Description>Use a short, specific title.</Field.Description>
        {#if isInvalid}
          <Field.Error
            errors={field.state.meta.errors.map((message) => ({ message }))}
          />
        {/if}
      </Field.Field>
    {/snippet}
  </form.Field>

  <form.Subscribe
    selector={(state) => ({
      canSubmit: state.canSubmit,
      isSubmitting: state.isSubmitting,
    })}
  >
    {#snippet children({ canSubmit, isSubmitting })}
      <Button type="submit" disabled={!canSubmit || isSubmitting}>
        {isSubmitting ? "Submitting" : "Submit"}
      </Button>
    {/snippet}
  </form.Subscribe>
</form>
```

## Validation

TanStack Form supports field-level validators and form-level validators. Keep shadcn-svelte state wiring consistent:

- `data-invalid` goes on `Field.Field`.
- `aria-invalid` goes on the input or control.
- Convert validator errors to `{ message }` objects before passing them to `Field.Error`.

## Component Controls

Native-input-like controls can use the field value and `handleChange` directly. Headless controls need value adapters:

```svelte showLineNumbers
<Switch
  checked={field.state.value}
  onCheckedChange={(checked) => field.handleChange(checked)}
  aria-invalid={isInvalid}
/>
```

Use `form.Subscribe` for submit state or derived form state instead of reading the whole form state in every field.

## Fit

Use TanStack Form when you want framework-portable form logic, detailed subscriptions, and headless field control. For SvelteKit server actions, Formsnap and Superforms are usually the shorter path.
