---
title: Forms
description: Build accessible forms with shadcn-svelte components and the Svelte form library that fits your app.
---

Forms are one of the places where shadcn-svelte is most useful: you keep control of the markup, but the components give you consistent labels, descriptions, errors, spacing, and accessibility attributes.

Start with the form path that matches your project:

- [SvelteKit](/docs/forms/sveltekit): Formsnap, Superforms, and server actions.
- [Formsnap](/docs/forms/formsnap): the established shadcn-svelte form integration.
- [TanStack Form](/docs/forms/tanstack-form): a headless form model with a Svelte adapter.
- [Formisch](/docs/forms/formisch): a Svelte-first, schema-based form library built on Valibot.

## Component Layers

shadcn-svelte has two form layers:

- `Form` components wrap Formsnap and Superforms for SvelteKit form actions.
- `Field` components are general layout primitives that work with any form library.

Use `Form` for the classic SvelteKit plus Superforms workflow. Use `Field` when integrating headless libraries such as TanStack Form or Formisch.

## Add Components

Install the form and field components before building the examples in this section.

```bash
pnpm dlx shadcn-svelte@latest add form field input textarea button
```

Add the controls you need for your form:

```bash
pnpm dlx shadcn-svelte@latest add select checkbox radio-group switch input-group
```

## Validation

Use the validation library that matches your form stack.

- Formsnap and Superforms commonly use Zod through `sveltekit-superforms/adapters`.
- TanStack Form supports field validators and Standard Schema compatible validators.
- Formisch uses Valibot as the schema source of truth.

No matter which stack you choose, keep the shadcn-svelte accessibility pattern the same: put `data-invalid` on the field wrapper, put `aria-invalid` on the control, and render errors with `Field.Error` or `Form.FieldErrors`.
