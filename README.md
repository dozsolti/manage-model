# Manage Model

`manage-model` helps you define reusable model factories with typed templates, initialization helpers, validation, sanitization, parsing, and many more.

## Install

```bash
npm install manage-model
```

## Why use it

`manage-model` keeps model creation logic centralized and typed. It is useful when you want to:

- reuse named templates
- build models from external data sources
- validate and sanitize data in one place
- define conversion and serialization rules
- keep model behavior organized and easy to test

> Read the [Model Manager API](https://dozsolti.github.io/manage-model/) guide for more details.

## Import

```ts
import { manageModel } from "manage-model";
```

## Usage

```ts
type User = {
  name: string;
  email: string;
};

// user.model.ts
export const userModel = manageModel<User>()(
  {
    templates: {
      empty: { name: "", email: "" },
    },
  },
  ({ templates }) => ({
    parsers: {
      json: {
        to: (model: User) => JSON.stringify(model),
        from: (dto) => (dto ? JSON.parse(dto) : templates.default),
      },
    },
    to: {
      fromObject: (data) => ({ name: data.name, email: data.email }),
    },
    sorters: {
      byName: (a, b) => a.name.localeCompare(b.name),
    },
    validators: {
      isValidEmail: (user) => /.+@.+\..+/.test(user.email),
    },
    sanitizers: {
      normalize: (user) => ({
        ...user,
        name: user.name.trim(),
        email: user.email.trim().toLowerCase(),
      }),
    },
  }),
);

// api.ts
const user = userModel.inits.fromApi({
  id: 123,
  name: "   Jane Doe   ",
  email: "JANE@EXAMPLE.COM",
});

// signup.tsx
const cleanUser = userModel.sanitizers.normalize(user);
const isValid = userModel.validators.hasValidEmail(cleanUser);
```
