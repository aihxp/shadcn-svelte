# CLI e2e Tests

This package runs fixture-based end-to-end tests for the local `shadcn-svelte` CLI.

The tests copy starter templates into `packages/tests/temp`, serve `docs/static` as a local registry, and execute the built CLI with `REGISTRY_URL` pointed at that local server. They also check dependency baseline drift for public registry JSON, template manifests, and the repro manifest. They do not install template dependencies.

Run the suite from the repository root:

```bash
pnpm test:e2e
```

For type checking only:

```bash
pnpm -F @aihxp/shadcn-svelte-lab-e2e-tests typecheck
```
