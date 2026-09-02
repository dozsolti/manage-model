# Usage pattern

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
      object: (data) => ({ name: data.name }),
    },
    validators: {
      hasName: (user) => user.name.length > 0,
    },
  },
);
```

## Complete example

```ts
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
      object: (data) => ({
        id: data.id,
        name: data.name,
        email: data.email,
        age: data.age,
      }),
    },
    parse: {
      localStorage: {
        from: (raw) => {
          const parsed = JSON.parse(raw as string) as Partial<User>;
          return parsed && parsed.name ? (parsed as User) : null;
        },
        to: (model) => JSON.stringify(model),
      },
    },
    sort: {
      byName: (a, b) => a.name.localeCompare(b.name),
    },
    validate: {
      hasValidEmail: (user) => /.+@.+\..+/.test(user.email),
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

const created = userModel.inits.fromApi({
  id: 1,
  name: "Jane Doe",
  email: "JANE@EXAMPLE.COM",
  age: 28,
});

const normalized = userModel.sanitize.normalize(created);
const valid = userModel.validate.hasValidEmail(normalized);
const stored = userModel.parse.localStorage.to(normalized);
```

This pattern keeps model creation logic centralized while still allowing typed, reusable definitions for templates, creation, parsing, and validation.
