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
