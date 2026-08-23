# Transmute Examples

The examples folder contains polished interactive demos of the library's main runtime behaviors. Start the examples server from the repository root:

```bash
npm run build:dev
node examples/server.js
```

Open `http://localhost:4173/` and use the hub to launch a demo.

## Interactive demos

- `01-type-validation` — built-in type validation without custom rules.
- `02-context-aware-validation` — sibling and cross-field validation using `ValidatorContext`.
- `03-dynamic-model-rules` — per-model rule isolation, replacement, merging, and cloning.
- `04-full-form-flow` — editable form state, fail-fast validation, cloning, and payload logging.
- `05-validation-ergonomics` — focused demos of `allOf`, rule metadata, `[]` collection validators,
  asynchronous validation, and rule introspection.
- `06-user-directory` — a consolidated, full-blown app combining every core capability: fetch-and-hydrate,
  built-in and context-aware validation, dynamic rule merging/replacement, an adapter layer at the API
  boundary, a custom data hook, and optimistic save with server-side rollback.

## Canonical workflow

The recommended app lifecycle across the examples is:

1. Hydrate a model from an API or storage adapter.
2. Validate it immediately using `validateOnCreate` or `model.validate()`.
3. Clone the current model before user edits for optimistic rollback.
4. Edit through generated setters while rules enforce both type and domain constraints.
5. Persist the plain JSON payload with `unTransmute()` after validation passes.
6. Restore the previous snapshot if the save fails.

This workflow is the basis of the full-form and user-directory demos and is the easiest way to integrate Transmute into existing application state and API boundaries.

Note: The examples intentionally load React and Babel from CDNs in browser demos. They are reference applications, not distributable packages or production build configurations.
