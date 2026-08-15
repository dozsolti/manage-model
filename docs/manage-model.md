---
outline: deep
---

# Model Manager API

The `manageModel<T>()` factory creates a typed model definition that can include reusable templates, initialization functions, and runtime operations such as parsing, validation, sorting, and sanitization.

## Factory signature

```ts
export const manageModel = <T>() => {
  const factory: ModelFactory<T> = (
    constants: C,
    builder?: M | ((constants: C) => M),
  ) => {
    if (!builder) {
      return constants;
    }

    const manager =
      typeof builder === "function" ? builder(constants) : builder;

    return {
      ...constants,
      ...manager,
    };
  };

  return factory;
};
```

The factory supports two patterns:

```ts
const model = manageModel<User>()({
  templates: {
    empty: { name: "" },
  },
});
```

and

```ts
const model = manageModel<User>()(
  {
    templates: {
      empty: { name: "" },
    },
  },
  ({ templates }) => ({
    to: {
      fromApi: (data) => ({ name: data.name }),
    },
    validators: {
      hasName: (user) => user.name.length > 0,
    },
  }),
);
```

---

## `ModelManagerConstants<T>`

`ModelManagerConstants<T>` defines the base constant set for a model.

::: info
It is intended for static, reusable definitions.
:::

#### `templates`

Named model instances that can be reused across the app.

```ts
const userModel = manageModel<{ name: string }>()({
  templates: {
    johnDoe: { name: "John Doe" },
    janeDoe: { name: "Jane Doe" },
  },
});
```

#### `inits`

Named initialization functions that create a typed model from raw input data.

```ts
const userModel = manageModel<{ name: string }>()({
  inits: {
    fromApi: (data) => ({ name: data.name ?? "Anonymous" }),
  },
});
```

---

## `ModelManager<T>`

`ModelManager<T>` describes the behavior layer attached to the model.
::: info
This is where conversion, validation, sorting, and lifecycle hooks are declared.
:::

### `to`

Maps a name to a creator function that builds or transforms a model from raw input data.

```ts
const model = manageModel<{ name: string }>()(
  {},
  {
    to: {
      fromPlainObject: (data) => ({ name: data.name }),
    },
  },
);
```

### `parsers`

Defines a parser object containing both a `from` method and a `to` method, plus optional helper methods. This is useful for converting between different external representations and the model type.

```ts
const model = manageModel<{ name: string }>()(
  {},
  {
    parsers: {
      localStorage: {
        from: (value) => ({ name: value }),
        to: (model) => model.name,
      },
    },
  },
);
```

### `sorters`

Registers comparator functions for ordering model instances.

```ts
const model = manageModel<{ score: number }>()(
  {},
  {
    sorters: {
      byScore: (a, b) => a.score - b.score,
    },
  },
);
```

### `validators`

Defines boolean checks for model validity.

```ts
const model = manageModel<{ name: string }>()(
  {},
  {
    validators: {
      hasName: (user) => typeof user.name === "string" && user.name.length > 0,
    },
  },
);
```

### `sanitizers`

Provides functions that normalize or clean model data before use.

```ts
const model = manageModel<{ name: string }>()(
  {},
  {
    sanitizers: {
      trimName: (user) => ({ ...user, name: user.name.trim() }),
    },
  },
);
```

### `hooks`

Executes logic before and after model creation.

```ts
const model = manageModel<{ name: string }>()(
  {},
  {
    hooks: {
      beforeCreate: (data) => ({ ...data, name: data.name?.trim() ?? "" }),
      afterCreate: (user) => {
        console.log("Created user:", user);
      },
    },
  },
);
```

---

## Usage pattern

A typical model definition combines the static constants and the behavior manager:

```ts
type User = {
  name: string;
};

const userModel = manageModel<User>()(
  {
    templates: {
      default: { name: "Anonymous" },
    },
    inits: {
      fromApi: (data) => ({ name: data.name ?? "Anonymous" }),
    },
  },
  {
    to: {
      fromObject: (data) => ({ name: data.name }),
    },
    validators: {
      hasName: (user) => user.name.length > 0,
    },
    hooks: {
      beforeCreate: (data) => ({ ...data, name: data.name.trim() }),
    },
  },
);
```

## Complete example

```ts
type User = {
  id: string;
  name: string;
  email: string;
  age: number;
};

const userModel = manageModel<User>()(
  {
    templates: {
      guest: { id: "guest", name: "Guest", email: "", age: 0 },
      admin: {
        id: "admin",
        name: "Admin",
        email: "admin@example.com",
        age: 30,
      },
    },
    inits: {
      fromApi: (data) => ({
        id: String(data.id ?? crypto.randomUUID()),
        name: String(data.name ?? "Anonymous"),
        email: String(data.email ?? ""),
        age: Number(data.age ?? 0),
      }),
    },
  },
  {
    to: {
      fromObject: (data) => ({
        id: data.id,
        name: data.name,
        email: data.email,
        age: data.age,
      }),
    },
    parsers: {
      localStorage: {
        from: (raw) => {
          const parsed = JSON.parse(raw as string) as Partial<User>;
          return parsed && parsed.name ? (parsed as User) : null;
        },
        to: (model) => JSON.stringify(model),
      },
    },
    sorters: {
      byName: (a, b) => a.name.localeCompare(b.name),
    },
    validators: {
      hasValidEmail: (user) => /.+@.+\..+/.test(user.email),
    },
    sanitizers: {
      normalize: (user) => ({
        ...user,
        name: user.name.trim(),
        email: user.email.trim().toLowerCase(),
      }),
    },
    hooks: {
      beforeCreate: (data) => ({
        ...data,
        name: String(data.name ?? "").trim(),
        email: String(data.email ?? "")
          .trim()
          .toLowerCase(),
      }),
      afterCreate: (user) => {
        console.log("User created:", user);
      },
    },
  },
);

const created = userModel.inits?.fromApi({
  id: 1,
  name: "Jane Doe",
  email: "JANE@EXAMPLE.COM",
  age: 28,
});

const normalized = userModel.sanitizers.normalize(created);
const valid = userModel.validators.hasValidEmail(normalized);
const stored = userModel.parsers.localStorage.to(normalized);
```

This pattern keeps model creation logic centralized while still allowing typed, reusable definitions for templates, creation, parsing, and validation.
