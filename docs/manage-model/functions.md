# `ModelManager<T>`

`ModelManager<T>` describes the behavior layer attached to the model.
::: info
This is where conversion, validation, sorting, and lifecycle hooks are declared.
:::

## `to`

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

## `parsers`

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

## `sorters`

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

## `validators`

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

## `sanitizers`

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

## `hooks`

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
