# Get Started

`manage-model` helps you define reusable model factories with typed templates, initialization helpers, validation, sanitization, parsing, and many more.

## Install

```bash
npm install manage-model
```

## Import

```ts
import { manageModel } from "manage-model";
```

## Usage

```ts
const userModel = manageModel<User>()(
  {
    templates: {
      empty: { name: "", email: "" },
    },
  },
  {
    to: {
      object: (data) => ({ name: data.name, email: data.email }),
    },
    validate: {
      email: (user) => /.+@.+\..+/.test(user.email),
    },
    sanitize: {
      normalize: (user) => ({
        ...user,
        name: user.name.trim(),
        email: user.email.trim().toLowerCase(),
      }),
    },
  },
);
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
