---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Manage Model"
  tagline: "One model, one place."
  actions:
    - theme: brand
      text: Get Started
      link: /get-started
    - theme: alt
      text: Documentation
      link: /api/constants
---

`manage-model` helps you define typed templates, initialization helpers, validation, sanitization, parsing, and many more.

```bash
npm install manage-model
```

## With and Without

<table>
  <thead>
    <tr>
      <th>Before: same thing scattered across files</th>
      <th>After: one manageable place</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td valign="top">

```ts
// login.ts
export const onLoginPressed = (data) => {
  // ...
  login(
    data || {
      id: "guest",
      name: "Guest",
      email: "",
    },
  );
};

// api.ts
export const getUser = async () => {
  return axios
    .get("/api/user")
    .then((res) => res.json())
    .then((data) => ({
      id: String(data.id ?? "guest"),
      name: String(data.name ?? "Guest"),
      email: String(data.email ?? ""),
    }));
};

export const signUp = async () => {
  return (
    axios
      .post("/api/user")
      // ...
      .then((data) => ({
        id: String(data.id ?? "guest"),
        name: String(data.name ?? "Guest"),
        email: String(data.email ?? ""),
      }))
  );
};

// signUp.tsx
export const onFormSubmit = (data) => {
  if (
    typeof data.name == "string" &&
    data.name &&
    data.name.trim().length > 0
  ) {
    return;
  }
  // ...
};

// profile.tsx
export const onNameChange = (data) => {
  if (
    typeof data.name == "string" &&
    data.name &&
    data.name.trim().length > 0
  ) {
    return;
  }
  // ...
};
```

Templates, initialization, and validation are easy to lose track of as they spread between files.

</td>
      <td valign="top">

```ts
// login.ts
export const onLoginPressed = (data) => {
  // ...
  login(data || userModel.templates.guest);
};

// api.ts
export const getUser = async () => {
    //...
    .then(userModel.parsers.api.from);
};
export const signUp = async () => {
  // ...
  .then(userModel.parsers.api.from);
};

// signUp.tsx
export const onFormSubmit = (data) => {
  if (!userModel.validators.isValid(data)) return;
  // ...
};

// profile.tsx
export const onNameChange = (data) => {
  if (!userModel.validators.isValid(data)) return;
  // ...
};
```

Keep related templates, initialization, validation, sanitization, and parsing together in one typed definition.

  </td>
</tr>

  </tbody>
</table>

```ts
// user.model.ts
const userModel = manageModel<User>()(
  {
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
  },
  {
    validate: {
      isValid: (user) =>
        typeof data.name == "string" &&
        data.name &&
        data.name.trim().length > 0,
    },
  },
);
```
