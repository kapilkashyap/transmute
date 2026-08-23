# transmute

Transform plain JavaScript objects into runtime models with private properties, generated accessors, context-aware validation, cloning, and JSON conversion.

Transmute is useful when data needs a small, predictable model layer without introducing decorators, schemas, or a large runtime framework.

## Features

- Generate getters and setters from object keys.
- Keep model data in private runtime properties.
- Validate updates with type checks and custom rules.
- Run asynchronous rules with `validateAsync()`.
- Give validators access to the current property, path, parent model, root model, and array index.
- Express required and immutable constraints with rule metadata.
- Compose validators with `allOf` and `anyOf`.
- Validate arrays per element or as complete collections with `[]` rules.
- Keep configuration and validation rules isolated per model.
- Update validation rules after transmutation.
- Inspect registered synchronous and asynchronous rules.
- Clone models without sharing their data or later rule updates.
- Convert models back to plain JSON.
- Support nested objects and arrays of objects.
- Work in JavaScript and TypeScript projects.

## Installation

```bash
npm install transmute
```

With pnpm:

```bash
pnpm add transmute
```

## Quick Start

```javascript
import { transmute } from 'transmute';

const user = transmute({
	id: 'u-1',
	name: 'Jane Doe',
	age: 31,
	profile: {
		city: 'Hyderabad'
	}
});

console.log(user.getName());
console.log(user.getProfile().getCity());

user.setName('Jane Smith');
user.getProfile().setCity('Bengaluru');

console.log(user.toJson());
```

An optional third argument sets the generated runtime class name, which can help with debugging or developer tools:

```javascript
const namedUser = transmute({ name: 'Jane Doe' }, undefined, 'User');
```

Generated methods follow the source property names:

| Input property | Generated methods |
| --- | --- |
| `name` | `getName()`, `setName(value)` |
| `profile` | `getProfile()`, `setProfile(value)` |
| `contacts` | `getContacts()`, `setContacts(value)` |
| `contacts` array | `getContactsAt(index)`, `setContactsAt(index, value)` |

Property names are normalized when method names are generated. Spaces, dots, and hyphens are removed or converted so they can be used in JavaScript method names.

## TypeScript

The package exports the public configuration and validator types:

```typescript
import {
	AsyncRule,
	AsyncRuleMetadata,
	AsyncValidatorFn,
	Config,
	Rule,
	RuleMetadata,
	UpdateRulesOptions,
	ValidatorContext,
	ValidatorFn,
	ValidationResult,
	transmute,
	unTransmute
} from 'transmute';
```

The main validator contract is:

```typescript
type ValidatorFn = (value: unknown, context: ValidatorContext) => boolean | string;
```

JavaScript functions that declare only the `value` parameter continue to work at runtime because JavaScript ignores additional arguments. TypeScript consumers should use the two-parameter type when assigning validators.

Rules can also be declared as metadata objects. `required` rejects `null` and `undefined`, while `immutable` permits the initial value but rejects later changes through setters. Use `validator` to combine metadata with a custom validation function:

```typescript
import { transmute } from 'transmute';

const user = transmute(
	{ id: 'user-1', name: 'Jane Doe' },
	{
		validateInput: true,
		rules: {
			id: { immutable: true },
			name: {
				required: true,
				validator: (value) => String(value).trim().length > 1 || 'Name is required'
			}
		}
	}
);
```

Metadata checks apply during setter validation. Initial construction and full-model validation do not treat an unchanged immutable value as a mutation.

Validators can be composed without repeating the value and context plumbing:

```typescript
import { allOf, anyOf, transmute } from 'transmute';

const nonEmpty = (value) => String(value).trim().length > 0 || 'Value is required';
const shortEnough = (value) => String(value).length <= 80 || 'Value is too long';
const nameRule = allOf(nonEmpty, shortEnough);
const contactRule = anyOf(
	(value) => /^\+?[0-9 -]+$/.test(String(value)) || 'Not a phone number',
	(value) => /^\S+@\S+\.\S+$/.test(String(value)) || 'Not an email address'
);

const user = transmute({ name: 'Jane Doe', contact: '+91 123 456 7890' }, {
	validateInput: true,
	rules: { name: nameRule, contact: contactRule }
});
```

`allOf` runs validators in order and returns the first failure, so every rule must pass. `anyOf` returns `true` when any validator succeeds; when all fail, it returns the last failure result. An empty `allOf` succeeds, while an empty `anyOf` fails.

## Where Transmute Fits

Transmute is a runtime model layer for applications where data models are first-class objects. It complements the tools commonly used around a frontend application; it does not replace them.

| Tool | Primary responsibility | How Transmute complements it |
| --- | --- | --- |
| TypeScript | Static types during development and compilation | Adds runtime models, accessors, and validation after data exists at runtime. |
| React | Rendering and component state | Keeps domain behavior and data mutation outside JSX and component event handlers. |
| Redux | Application-wide state storage and event-driven updates | Stores a Transmute model or its JSON representation when centralized state is needed. |
| Zod | Schema parsing and input validation | Parses and validates API or form boundaries; Transmute provides the mutable model used after parsing. |

### TypeScript + Transmute

TypeScript describes what a value should look like at compile time. Transmute gives a runtime value generated getters, setters, private properties, and update-time checks.

Use both when data comes from an API, storage, or user input and must remain safe after the initial type boundary:

```typescript
type UserPayload = {
	name: string;
	age: number;
};

const payload: UserPayload = await fetchUser();
const user = transmute(payload, { validateInput: true });

user.setAge(32);
```

TypeScript protects the code that calls `setAge()`. Transmute protects the runtime model when values are changed dynamically.

### React + Transmute

React should describe rendering and user interaction. A Transmute model can own domain updates and validation, while React stores the current model in state and renders its getters.

```jsx
function ProfileForm({ initialProfile }) {
	const [profile, setProfile] = React.useState(() =>
		transmute(initialProfile, {
			validateInput: true,
			rules: {
				name: (value) => String(value).trim().length > 1 || 'Name is required'
			}
		})
	);

	const updateName = (name) => {
		setProfile((current) => {
			const next = current.clone();
			next.setName(name);
			return next;
		});
	};

	return <input value={profile.getName()} onChange={(event) => updateName(event.target.value)} />;
}
```

This keeps validation and domain mutation out of the component's rendering logic. For simpler applications, a model can be held directly in component state. For larger applications, the model or `toJson()` output can be integrated with a state store.

### Redux + Transmute

Redux remains responsible for application-wide state, actions, reducers, middleware, and time-travel-friendly state transitions. Transmute is useful at the domain boundary where a Redux slice contains a complex editable entity.

Common approaches include:

- Store plain `toJson()` data in Redux and create a Transmute model at the screen or domain boundary.
- Store a model when the application already treats the model as a controlled domain object and serialization constraints are understood.
- Use Redux actions to replace a model snapshot after calling `clone()` and applying validated updates.

For serializable Redux state, prefer storing plain data:

```javascript
const nextModel = currentModel.clone();
nextModel.setAge(32);

dispatch({
	type: 'profile/replaced',
	payload: nextModel.toJson()
});
```

Transmute does not replace Redux. It supplies model behavior at the point where plain state becomes an editable domain object.

### Zod + Transmute

Zod and Transmute solve different parts of the data lifecycle:

1. Use Zod to parse and validate an external boundary such as an API response.
2. Use the parsed value to create a Transmute model.
3. Use Transmute setters and context-aware rules during interactive edits.
4. Use `toJson()` when sending or storing the updated model.

```typescript
import { z } from 'zod';
import { transmute } from 'transmute';

const userSchema = z.object({
	name: z.string(),
	age: z.number()
});

const response = await fetch('/api/user');
const payload = userSchema.parse(await response.json());

const user = transmute(payload, {
	validateInput: true,
	rules: {
		age: (value) => value >= 18 || 'User must be an adult'
	}
});
```

Zod is a strong choice for parsing unknown external data and producing typed results. Transmute is a strong choice for the mutable, accessor-based model that lives after parsing. They can be used together without duplicating responsibility.

### Where It Fits Best

Transmute is a good fit when an application has:

- Editable forms with repeated updates to the same entity.
- Nested domain objects that need discoverable getters and setters.
- Cross-property rules such as confirmation fields or date ranges.
- API data that needs behavior after hydration.
- Optimistic updates implemented by cloning a model before mutation.
- Model-specific rules that must remain isolated from other entities.
- A preference for small runtime abstractions over a full state or schema framework.

Transmute is less suitable when an application only needs:

- Static TypeScript types with no runtime mutation checks.
- One-time parsing of external data, where a schema library is sufficient.
- A global state workflow that should contain only serializable plain objects.
- Immutable state transitions with no need for model methods.

### Advantages of First-Class Models

Treating models as first-class citizens can provide:

- **Encapsulation:** Consumers use generated accessors instead of reaching into arbitrary object shapes.
- **Consistent mutation:** Setters provide one place for type checks and custom validation.
- **Local domain behavior:** Cross-property rules live close to the model they protect.
- **Object-graph context:** Validators can inspect siblings, parents, the root model, paths, and array indexes.
- **Configuration isolation:** Models do not inherit rules from models created later.
- **Predictable cloning:** A clone gets independent data and a configuration snapshot.
- **Framework flexibility:** The model can be used from React, Redux integrations, hooks, services, or plain JavaScript.
- **Serialization boundaries:** Runtime behavior stays on the model while `toJson()` produces plain data for APIs and storage.

The central tradeoff is that models are runtime objects rather than plain serializable data. Applications should serialize them at state, persistence, and network boundaries when those systems require plain values.

For more detailed use cases, see the [Examples](#examples) section.

## Configuration

`transmute()` accepts optional configuration:

```typescript
type Config = {
	validateInput?: boolean;
	validateOnCreate?: boolean;
	cloneable?: boolean;
	rules?: Record<string, Rule>;
	asyncRules?: Record<string, AsyncRule>;
};
```

Defaults:

```text
validateInput: false
validateOnCreate: false
cloneable: true
rules: {}
asyncRules: {}
```

Example:

```javascript
const user = transmute(
	{
		name: 'Jane Doe',
		age: 31
	},
	{
		validateInput: true,
		cloneable: true,
		rules: {
			name: (value, context) => String(value).trim().length > 1 || 'Name is required',
			age: (value, context) => Number(value) >= 18 || 'Age must be at least 18'
		}
	}
);
```

Configuration is scoped to the model created by that `transmute()` call. Creating another model does not replace the first model's rules or clone behavior.

## Validation

The library separates mutation validation from creation-time validation:

- `validateInput: true` enables validation for all subsequent setter-based mutations.
- `validateOnCreate: true` validates the initial payload once the object graph is fully constructed.
- `model.validate()` validates the current model state at any time.

This keeps validation predictable during hydration while still protecting future writes. Creation-time validation evaluates the current model graph and any rules attached to it; it does not infer a new schema from raw input.

### Mutation Validation

Validation is enabled with `validateInput: true`:

When enabled, Transmute performs built-in runtime type validation for setter values even when no custom `rules` are provided. Custom rules extend this with application-specific checks such as formats, ranges, and cross-property constraints.

```javascript
const user = transmute(
	{ email: 'jane@example.com' },
	{
		validateInput: true,
		rules: {
			email: (value, context) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value)) || 'Invalid email'
		}
	}
);

user.setEmail('invalid');
// Throws: Validation error [email]: Invalid email
```

Setters validate before changing the stored value. If validation fails, the previous value remains unchanged.

Validation is fail-fast by default: the first failing setter or array-element update throws an error. For form or diagnostics workflows, pass `{ collectErrors: true }` to collect failures instead:

```javascript
const result = user.validate({ collectErrors: true });

if (!result.valid) {
	console.log(result.errors);
}
```

Each error includes the failing `path`, property `key`, human-readable `message`, and an `index` when the failure belongs to an array element. The asynchronous equivalent is `await user.validateAsync({ collectErrors: true })`.

### Creation-Time Validation

Use `validateOnCreate: true` when you want the initial model graph to be checked against its current values and rules before the model is returned:

```javascript
const user = transmute(
	{ age: 15 },
	{
		validateInput: true,
		validateOnCreate: true,
		rules: {
			age: (value) => value >= 18 || 'Must be an adult'
		}
	}
);
// Throws: Validation error [age]: Must be an adult
```

This is useful for imported data and hydration flows where a model should be checked immediately after construction.

### Full-Model Validation

You can validate the complete model state at any time with `validate()`:

```javascript
const user = transmute(
	{ age: 31, email: 'jane@example.com' },
	{
		validateInput: true,
		rules: {
			age: (value) => value >= 18 || 'Age must be at least 18'
		}
	}
);

user.validate();
```

`validate()` walks the current model graph, reuses the current setter validation rules, and throws on the first failure. It is intended for hydration, imported data, and post-update verification of the current graph.

### Asynchronous Validation

Use `asyncRules` for checks that require an asynchronous operation, such as checking username availability against a service. Asynchronous rules do not run during synchronous setters or `validate()`; call `validateAsync()` explicitly:

```javascript
const user = transmute(
	{ username: 'jane-doe' },
	{
		asyncRules: {
			username: async (value) => {
				const response = await fetch(`/api/users/${encodeURIComponent(value)}/availability`);
				return response.ok || 'Username is already in use';
			}
		}
	}
);

await user.validateAsync();
```

`validateAsync()` runs synchronous type and rule checks first, then awaits asynchronous rules across the complete nested object graph, including array elements. It resolves to the model when valid and rejects with the validation error when invalid. Async metadata supports `required` and an async-capable `validator`:

```javascript
const profile = transmute(
	{ username: 'jane-doe' },
	{
		asyncRules: {
			username: {
				required: true,
				validator: async (value) => value.length >= 3 || 'Username is too short'
			}
		}
	}
);

await profile.validateAsync();
```

Asynchronous rules are useful at save or submission boundaries when the result depends on a remote system. Keep local, deterministic checks in `rules` so setters can reject invalid edits immediately.

`validateOnCreate` performs synchronous creation-time validation. If asynchronous creation-time checks are required, construct the model and call `await model.validateAsync()` at the application boundary.

### Canonical Workflow

A practical app flow is:

1. Hydrate a model from API or persisted data.
2. Optionally run `validateOnCreate` or `model.validate()` immediately after hydration.
3. Clone the live model before a user edit if you want an easy rollback path.
4. Edit using generated setters.
5. Validate again before persisting.
6. Roll back to the last committed snapshot if the save fails.

```javascript
let model = transmute(await fetchProfile(), {
	validateInput: true,
	validateOnCreate: true,
	rules: {
		age: (value) => value >= 18 || 'Age must be at least 18',
		email: (value) => /\S+@\S+\.\S+/.test(String(value)) || 'Invalid email'
	}
});

const snapshot = model.clone();

try {
	model.setAge(17);
	model.validate();
	await saveProfile(unTransmute(model));
} catch (error) {
	model = snapshot;
	throw error;
}
```

Transmute stores model values in private fields, so rollback replaces the working model reference instead of using `Object.assign()`. This pattern keeps the domain logic on the model while letting the application boundary remain simple: fetch, validate, mutate, persist, and roll back on failure.

### Built-in Type Validation

Built-in type validation does not require custom rules. Transmute remembers the type of each input property and checks setter values when `validateInput` is enabled:

```javascript
const user = transmute(
	{
		name: 'Jane Doe',
		age: 31,
		active: true,
		contacts: ['+91-99999-99999']
	},
	{ validateInput: true }
);

user.setAge(32); // Valid
user.setActive(false); // Valid
user.setContacts(['+91-88888-88888']); // Valid

user.setAge('32');
// Throws: Type mismatch: argument of type number expected but got string instead

user.setContacts('not-an-array');
// Throws: Type mismatch: argument of type array expected but got string instead
```

A failed type check leaves the previous property value unchanged. Use custom rules when validation needs formats, ranges, or relationships between properties.

### Validation Results

Validators return:

- `true` when the value is valid.
- A string containing the validation message when the value is invalid.
- Any other non-`true` value for a generic validation failure.

```javascript
const rules = {
	age: (value, context) => value >= 18 || 'Age must be at least 18',
	status: (value, context) => ['draft', 'active'].includes(value) || 'Invalid status'
};
```

### Rule Metadata and Collection Rules

Rules may be plain validator functions or metadata objects. Metadata is useful when a property needs a built-in constraint together with an optional custom validator:

```javascript
const user = transmute(
	{ id: 'user-1', name: 'Jane Doe' },
	{
		validateInput: true,
		rules: {
			id: { immutable: true },
			name: {
				required: true,
				validator: (value) => String(value).trim().length > 1 || 'Name is required'
			}
		}
	}
);
```

- `required` rejects `null` and `undefined` during the applicable validation pass.
- `immutable` allows the initial value but rejects later setter changes. It is a synchronous setter constraint.
- `validator` applies custom synchronous validation alongside the metadata constraints.
- `asyncRules` uses the same registration model for asynchronous validators, with `required` and an async-capable `validator`.

Array rules have two scopes. An unsuffixed key validates each element, while a key ending in `[]` validates the complete collection:

```javascript
const directory = transmute(
	{ contacts: ['+91-11111-11111', '+91-22222-22222'] },
	{
		validateInput: true,
		rules: {
			contacts: (value) => /^\+?[0-9-]+$/.test(value) || 'Invalid contact number',
			'contacts[]': (value) => value.length >= 2 || 'At least two contacts are required'
		}
	}
);
```

Both rules run when both are configured. `contacts` receives one element and an `index` in its `ValidatorContext`; `contacts[]` receives the complete array and no element index. On `setContactsAt(index, value)`, the collection rule validates the prospective array with the candidate value in place, before the model is mutated. The same `[]` convention works with namespaced and asynchronous rules, such as `root.profile.contacts[]` in `asyncRules`.

### Context-Aware Validation

Every validator receives the value and a `ValidatorContext`:

```typescript
type ValidatorContext = {
	key: string;
	path: string;
	value: unknown;
	parentObject?: unknown;
	rootObject?: unknown;
	index?: number;
	getParent: () => unknown;
	getRoot: () => unknown;
};
```

The context enables rules that depend on more than the value being updated.

#### Sibling Validation

```javascript
const account = transmute(
	{
		password: 'secret123',
		confirmPassword: 'secret123'
	},
	{
		validateInput: true,
		rules: {
			confirmPassword: (value, context) => {
				const password = context.parentObject.getPassword();
				return password === value || 'Passwords do not match';
			}
		}
	}
);
```

#### Root-Level Validation

```javascript
const order = transmute(
	{
		customer: { country: 'US' },
		shipping: { country: 'US' }
	},
	{
		validateInput: true,
		rules: {
			'root.shipping.country': (value, context) => {
				const customerCountry = context.getRoot().getCustomer().getCountry();
				return value === customerCountry || 'Shipping country does not match customer country';
			}
		}
	}
);
```

#### Conditional Validation

Conditional rules can be expressed inline by returning `true` when the condition does not apply. This keeps the existing `ValidatorFn` contract and gives the validator access to sibling or parent state:

```javascript
const customer = transmute(
	{
		country: 'IN',
		taxId: ''
	},
	{
		validateInput: true,
		rules: {
			taxId: (value, context) => {
				const country = context.getParent().getCountry();
				return country !== 'US' || /^[0-9]{9}$/.test(String(value)) || 'Invalid US tax ID';
			}
		}
	}
);

customer.setCountry('US');
customer.setTaxId('123456789');
```

When the country is not `US`, the rule succeeds without applying the tax ID format. When the country is `US`, the format check runs normally. The same pattern works with root state, nested models, array indexes, and `[]` collection rules.

#### Array-Index Validation

```javascript
const user = transmute(
	{
		contacts: ['primary', 'secondary']
	},
	{
		validateInput: true,
		rules: {
			contacts: (value, context) => {
				if (context.index === 0 && value !== 'primary') {
					return 'The first contact must be primary';
				}
				return true;
			}
		}
	}
);

user.setContactsAt(0, 'secondary');
```

#### Rule Paths

Rules can target a fully qualified path:

```javascript
const profile = transmute(
	{
		profile: {
			age: 30
		}
	},
	{
		validateInput: true,
		rules: {
			'root.profile.age': (value, context) => value >= 18 || `Invalid value at ${context.path}`
		}
	}
);
```

Rules can also use a leaf key such as `age` or `email`. A fully qualified rule is preferred when it is present.

Wildcard paths can apply one rule to matching segments at any depth of a namespaced path. Use `*` for exactly one path segment:

```javascript
const company = transmute(
	{
		homeAddress: { zip: '500001' },
		workAddress: { zip: '500002' }
	},
	{
		validateInput: true,
		rules: {
			'root.*.zip': (value) => /^\d{6}$/.test(String(value)) || 'ZIP code must have six digits'
		}
	}
);

company.getHomeAddress().setZip('invalid');
```

The same wildcard matching is available in `asyncRules`. Exact namespaced rules take precedence over matching wildcard rules.

## Updating Rules

Models expose `updateRules()` for explicit runtime rule changes:

```typescript
type UpdateRulesOptions = {
	mergeRules?: boolean;
	remove?: string[];
};
```

By default, the supplied rules replace the current rule set:

```javascript
user.updateRules({
	age: (value, context) => value >= 21 || 'Age must be at least 21'
});
```

Use `mergeRules: true` to preserve existing rules and add or overwrite only the supplied rules:

```javascript
user.updateRules(
	{
		email: (value, context) => String(value).includes('@') || 'Invalid email'
	},
	{ mergeRules: true }
);
```

Rules are copied when updated, so later mutations to the caller's rules object do not change the model. Updates apply to future setter calls only; existing values are not automatically revalidated.

Calling `updateRules()` on a nested model updates the shared model configuration and returns the root model:

```javascript
const root = user.getProfile().updateRules({
	'root.profile.age': (value, context) => value >= 18 || 'Age must be at least 18'
});

root.setName('Updated name');
```

Remove synchronous rules with `removeRules()` or with the `remove` option on `updateRules()`:

```javascript
user.removeRules('age');

user.updateRules(
	{ email: (value) => String(value).includes('@') || 'Invalid email' },
	{ mergeRules: true, remove: ['name'] }
);
```

Asynchronous rules have matching update and removal methods. They are kept separate from synchronous rules because they run only through `validateAsync()`:

```javascript
user.updateAsyncRules({
	username: async (value) => value !== 'taken' || 'Username is unavailable'
});

user.updateAsyncRules(
	{ email: async (value) => String(value).includes('@') || 'Invalid email' },
	{ mergeRules: true }
);

user.removeAsyncRules('username');
```

Use `getRules()` and `getAsyncRules()` to inspect the currently registered rule maps. The returned maps are snapshots, so changing them does not change model validation:

```javascript
const rules = user.getRules();
const asyncRules = user.getAsyncRules();

console.log(Object.keys(rules));
console.log(Object.keys(asyncRules));
```

Introspection is useful for dynamic forms, debugging, and showing which validation policies apply to a model. It reports configured rules; it does not execute validators or analyze their function bodies.

## Nested Objects and Arrays

Nested plain objects become nested models:

```javascript
const user = transmute({
	profile: {
		city: 'Hyderabad',
		active: true
	}
});

user.getProfile().setCity('Bengaluru');
```

Arrays of primitives support indexed access:

```javascript
const user = transmute({
	contacts: ['+91-99999-99999', '+91-88888-88888']
});

user.setContactsAt(0, '+91-77777-77777');
console.log(user.getContactsAt(0));
```

Arrays of objects produce indexed nested models:

```javascript
const company = transmute({
	employees: [
		{ id: 'E-1', name: 'Alice' },
		{ id: 'E-2', name: 'Bob' }
	]
});

company.getEmployeesAt(0).setName('Alice Smith');
```

Model configuration is shared by nested objects and array elements belonging to the same root model.

Use `getMetaInfo()` when tooling needs to inspect which source properties are primitive values, nested objects, or arrays. It returns model-shape metadata, not validation rules; use `getRules()` and `getAsyncRules()` for rule introspection.

## Cloning

Cloning creates a new model from the current JSON data:

```javascript
const original = transmute(
	{ name: 'Jane', age: 31 },
	{
		validateInput: true,
		rules: {
			age: (value, context) => value >= 18 || 'Age must be at least 18'
		}
	}
);

const copy = original.clone();
copy.setName('Janet');

console.log(original.getName());
console.log(copy.getName());
```

The original and clone do not share model data. The clone receives a snapshot of the configuration and rules at clone time. Later rule updates on the original do not affect an existing clone.

Disable cloning when it is not needed:

```javascript
const model = transmute(data, { cloneable: false });
console.log(model.clone); // undefined
```

## JSON Conversion

`toJson()` returns a plain object containing model data:

```javascript
const plainObject = user.toJson();
```

`unTransmute()` accepts a model or an array of models:

```javascript
import { unTransmute } from 'transmute';

const plainUser = unTransmute(user);
const plainUsers = unTransmute([userA, userB]);
```

Runtime metadata such as private properties, parent/root references, rules, and configuration is not included in the output.

`JSON.stringify(model)` intentionally does not serialize the model as data. Use `model.toJson()` or `unTransmute(model)` when JSON output is required.

## Utility API

### `memorySizeOf`

Estimate the encoded size of a JSON-compatible object:

```javascript
import { memorySizeOf } from 'transmute';

console.log(memorySizeOf(user.toJson()));
```

The result is formatted in bytes, KiB, MiB, or GiB.

## Error Handling

Type mismatches are rejected by generated setters:

```javascript
const user = transmute({ age: 31 }, { validateInput: true });

user.setAge('31');
// Type mismatch: argument of type number expected but got string instead
```

Validation errors include the rule path and, for indexed updates, the array index:

```text
Validation error at index 1 [root.items.id]: Duplicate ID: ITEM-1
```

Validator exceptions are not swallowed. If a validator throws its own exception, that exception propagates to the caller.

## Construction and Updates

Transmute separates model construction from public updates:

1. Input values are assigned through internal initialization methods.
2. Nested models and array elements are generated recursively.
3. Root, parent, and array-index metadata are attached.
4. Public setters validate only subsequent updates.

This prevents context-aware validators from running against a partially constructed object graph.

## Limitations

- Multidimensional arrays are not supported.
- Validation is fail-fast by default. Use `validate({ collectErrors: true })` or `validateAsync({ collectErrors: true })` to collect multiple failures.
- Existing values are not revalidated automatically after `updateRules()`.
- `updateRules()` changes rules only; `validateInput` and `cloneable` are structural options selected when the model is generated.
- Validator functions are runtime functions and are not serialized by `toJson()`.
- Property names that normalize to the same generated method name can collide.
- TypeScript consumers should use the two-argument validator signature even when a rule does not need the context.

## Examples

The repository includes polished interactive demos in [`examples/`](examples/):

- `01-type-validation` — built-in runtime type validation without custom rules.
- `02-context-aware-validation` — sibling and cross-field validation with `ValidatorContext`.
- `03-dynamic-model-rules` — per-model rule isolation, replacement, merging, and cloning.
- `04-full-form-flow` — editable form state, fail-fast validation, cloning, and payload logging.
- `05-validation-ergonomics` — focused demos of `allOf`, rule metadata, `[]` collection validators,
  asynchronous validation, and rule introspection.
- `06-user-directory` — nested user-directory models, adapters, and runtime rule changes.

To run the browser examples from a repository checkout, using npm:

```bash
npm run build:dev
node examples/server.js
```

Then open:

```text
http://localhost:4173/
```

The examples server serves the generated `dist` modules and the reference example pages. The examples are not included in the published package.

## Development

Install development dependencies and build the library with npm:

```bash
npm install
npm run build:dev
```

Run the test suite:

```bash
npm test -- --runInBand
```

Run linting:

```bash
npm run lint
```

Create a production-oriented build with minification:

```bash
npm run build
```

The build emits CommonJS, ESM, IIFE, and TypeScript declaration files under `dist/`. The `dist` directory is generated and should not be edited manually or committed.

## Release Notes

The context-aware validator API is a breaking TypeScript API change when upgrading from a value-only `ValidatorFn` type. JavaScript functions that declare only one parameter continue to work at runtime, but TypeScript validators should use:

```typescript
const rule: ValidatorFn = (value, context) => {
	return value !== '' || 'Value is required';
};
```

Per-model configuration and runtime rule updates are designed to prevent configuration leakage between models. `updateRules()` uses replacement by default; merging must be requested explicitly with `{ mergeRules: true }`.

## License

MIT