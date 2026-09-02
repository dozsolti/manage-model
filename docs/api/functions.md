# `Model's Functions`

Where you add `conversion`, `parsing`, `sorting`, `validation`, `sanitization`, `migration`, and `capability checks`.

> You have access to constants if you define it as a functions.
>
> See the [parse](#parse) function.

```ts
type User = { id: string; name: string; email: string; age: number };
```

## `to`

Map of named functions that transform a model into any another shape.

```ts
const userModel = manageModel<User>()(
  {},
  {
    to: {
      object: (data) => ({
        id: data.id,
        name: data.name,
        email: data.email,
        age: data.age,
      }),
      string: (user) => `User #${user.id}, name: ${user.name}`,
    },
  },
);
```

```ts
const plain = userModel.to.object({
  id: "1",
  name: "Jane Doe",
  email: "jane@example.com",
  age: 28,
});
```

## `parse`

Intended for handling the external formats. Requires both `from` and `to` conversions.

```ts
const userModel = manageModel<User>()(
  {
    templates: {
      guest: { id: "guest", name: "Guest", email: "", age: 0 },
    },
  },
  ({ templates }) => ({
    parse: {
      db: {
        from: (raw) => {
          const parsed = JSON.parse(raw as string) as Partial<User>;
          return parsed && parsed.name ? (parsed as User) : templates.guest;
        },
        to: (model) => JSON.stringify(model),
      },
    },
  }),
);
```

```ts
const userJSON = userModel.parse.db.to({
  id: "1",
  name: "Jane Doe",
  email: "jane@example.com",
  age: 28,
});

db.setItem("user", userJSON);
```

```ts
const user = userModel.parse.db.from(db.getItem("user"));
```

## `sort`

Comparator functions for ordering collections.

```ts
const userModel = manageModel<User>()(
  {},
  {
    sort: {
      byName: (a, b) => a.name.localeCompare(b.name),
    },
  },
);
```

## `validate`

Boolean checks for model correctness.

```ts
const userModel = manageModel<{ email: string }>()(
  {},
  {
    validate: {
      hasValidEmail: (user) => /.+@.+\..+/.test(user.email),
    },
  },
);
```

## `sanitize`

Used to normalize and clean a model.

```ts
const userModel = manageModel<User>()(
  {},
  {
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

## `migrate`

Moving data between versions.

```ts
const userModel = manageModel<User>()(
  {},
  {
    migrate: {
      toLegacy: (oldUser: OldUser) => {
        if ("age" in oldUser) return oldUser;

        return {
          ...oldUser,
          age: new Date().getFullYear() - oldUser.birthDate.getFullYear(),
        };
      },
    },
  },
);
```

## `can`

Checking whether a model is eligible for a given action.

```ts
const userModel = manageModel<User>()(
  {},
  {
    can: {
      edit: (user) => user.role === "admin",
      inviteUsers: (user) => user.score > 999,
    },
  },
);
```

## more?

Suggest other constants or functions: `https://github.com/dozsolti/manage-model/issues`
