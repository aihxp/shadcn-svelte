---
title: Formisch
description: Build forms with Formisch, Valibot, and shadcn-svelte Field components.
links:
  doc: https://formisch.dev/svelte/guides/introduction/
---

Formisch is a schema-based, headless form library with a Svelte adapter. It uses Valibot as the source of truth for validation and type inference.

Use Formisch for form state and validation, then use shadcn-svelte `Field` components for labels, descriptions, spacing, and errors.

## Install

```bash
pnpm dlx @aihxp/shadcn-svelte-lab@latest add field input button
pnpm add @formisch/svelte valibot
```

## Basic Form

```svelte title="login-form.svelte" showLineNumbers
<script lang="ts">
  import { createForm, Field as FormischField, Form } from "@formisch/svelte";
  import * as v from "valibot";
  import * as Field from "$lib/components/ui/field";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";

  const LoginSchema = v.object({
    email: v.pipe(v.string(), v.email("Enter a valid email address.")),
    password: v.pipe(v.string(), v.minLength(8, "Use at least 8 characters.")),
  });

  const loginForm = createForm({
    schema: LoginSchema,
  });
</script>

<Form of={loginForm} onsubmit={(output) => console.log(output)}>
  <div class="flex flex-col gap-6">
    <FormischField of={loginForm} path={["email"]}>
      {#snippet children(field)}
        {@const isInvalid = field.errors !== null}

        <Field.Field data-invalid={isInvalid}>
          <Field.Label for="email">Email</Field.Label>
          <Input
            {...field.props}
            id="email"
            type="email"
            value={field.input}
            aria-invalid={isInvalid}
          />
          {#if field.errors}
            <Field.Error
              errors={field.errors.map((message) => ({ message }))}
            />
          {/if}
        </Field.Field>
      {/snippet}
    </FormischField>

    <FormischField of={loginForm} path={["password"]}>
      {#snippet children(field)}
        {@const isInvalid = field.errors !== null}

        <Field.Field data-invalid={isInvalid}>
          <Field.Label for="password">Password</Field.Label>
          <Input
            {...field.props}
            id="password"
            type="password"
            value={field.input}
            aria-invalid={isInvalid}
          />
          {#if field.errors}
            <Field.Error
              errors={field.errors.map((message) => ({ message }))}
            />
          {/if}
        </Field.Field>
      {/snippet}
    </FormischField>

    <Button type="submit">Sign in</Button>
  </div>
</Form>
```

## Native Inputs

For native-input-like shadcn-svelte controls, spread `field.props` and pass `value={field.input}`.

```svelte showLineNumbers
<Input {...field.props} value={field.input} aria-invalid={isInvalid} />
```

## Headless Controls

For controls such as Select, Checkbox, Radio Group, and Switch, read from `field.input` and call the Formisch update handler from the component event.

```svelte showLineNumbers
<Switch
  checked={field.input ?? false}
  onCheckedChange={field.onChange}
  aria-invalid={isInvalid}
/>
```

## Fit

Use Formisch when you want a Svelte-first, schema-driven form library with Valibot. Use Formsnap and Superforms when you want the established SvelteKit server-action workflow.
