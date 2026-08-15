# Get Started

`manage-model` helps you define reusable model factories with typed templates, initialization helpers, validation, sanitization, parsing, and lifecycle hooks.

## Install

```bash
npm install manage-model
```

## Import

```ts
import { manageModel } from "manage-model";
```

## Basic usage

```ts
type User = {
  id: string;
  name: string;
  email: string;
};

const userModel = manageModel<User>()({
  templates: {
    guest: { id: "guest", name: "Guest", email: "" },
  },
  inits: {
    fromApi: (data) => ({
      id: String(data.id ?? "guest"),
      name: String(data.name ?? "Guest"),
      email: String(data.email ?? ""),
    }),
  },
});

const guest = userModel.templates.guest;
const created = userModel.inits?.fromApi({
  id: 42,
  name: "Jane Doe",
  email: "jane@example.com",
});
```

## Add behavior with a builder

You can extend the model with a second argument that defines runtime behavior.

```ts
type User = {
  name: string;
  email: string;
};

const userModel = manageModel<User>()(
  {
    templates: {
      empty: { name: "", email: "" },
    },
  },
  {
    to: {
      fromObject: (data) => ({ name: data.name, email: data.email }),
    },
    validators: {
      hasEmail: (user) => /.+@.+\..+/.test(user.email),
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
    },
  },
);
```

## Example: create a user model

```ts
type User = {
  id: string;
  name: string;
  email: string;
};

const userModel = manageModel<User>()(
  {
    templates: {
      default: { id: "default", name: "Anonymous", email: "" },
    },
    inits: {
      fromApi: (payload) => ({
        id: String(payload.id ?? "user-1"),
        name: String(payload.name ?? "Anonymous"),
        email: String(payload.email ?? ""),
      }),
    },
  },
  {
    parsers: {
      json: {
        from: (raw) => JSON.parse(raw as string) as User,
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
    },
  },
);

const user = userModel.inits?.fromApi({
  id: 123,
  name: "   Jane Doe   ",
  email: "JANE@EXAMPLE.COM",
});

const cleanUser = userModel.sanitizers?.normalize(user!);
const isValid = userModel.validators?.hasValidEmail(cleanUser!);
```

## Why use it

`manage-model` keeps model creation logic centralized and typed. It is useful when you want to:

- reuse named templates
- build models from external data sources
- validate and sanitize data in one place
- define conversion and serialization rules
- keep model behavior organized and easy to test

## Next steps

- Read the [Model Manager API](./manage-model) guide.
- Explore the examples in the docs.
- Use `manageModel<T>()` to define your own model layers.
