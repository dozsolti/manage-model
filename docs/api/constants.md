# `Model's Constants`

Intended for hardcoded, `static`, and reusable definitions.

> Every examples uses this type.

```ts
type User = { id: string; name: string; email: string; age: number };
```

## `templates`

Record of named model instances. Use it for default or reusable object values.

```ts
const userModel = manageModel<User>()({
  templates: {
    guest: { id: "guest", name: "Guest", email: "", age: 0 },
    admin: {
      id: "admin",
      name: "Admin",
      email: "admin@example.com",
      age: 30,
    },
  },
});
```

```ts
// login.ts
if (!isLoggedIn) {
  user = userModel.templates.guest;
}
```

## `inits`

Record of factory functions that build a model from any input.

```ts
const userModel = manageModel<User>()({
  templates: {
    //...
  },
  inits: {
    fromApi: (data) => ({
      id: String(data.id ?? crypto.randomUUID()),
      name: String(data.name ?? "Anonymous"),
      email: String(data.email ?? ""),
      age: Number(data.age ?? 0),
    }),
  },
});
```

```ts
//api.ts
const user = userModel.inits.fromApi(res.json());
```

This pattern keeps your defaults and creation logic centralized while still allowing the model to gain extra behavior in the second argument.
