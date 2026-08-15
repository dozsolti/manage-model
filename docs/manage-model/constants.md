# `ModelManagerConstants<T>`

`ModelManagerConstants<T>` defines the base constant set for a model.

::: info
It is intended for static, reusable definitions.
:::

## `templates`

Named model instances that can be reused across the app.

```ts
const userModel = manageModel<{ name: string }>()({
  templates: {
    johnDoe: { name: "John Doe" },
    janeDoe: { name: "Jane Doe" },
  },
});
```

## `inits`

Named initialization functions that create a typed model from raw input data.

```ts
const userModel = manageModel<{ name: string }>()({
  inits: {
    fromApi: (data) => ({ name: data.name ?? "Anonymous" }),
  },
});
```
