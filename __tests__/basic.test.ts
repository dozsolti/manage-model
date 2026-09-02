import { expect, test } from "vitest";

import { manageModel } from "../src/index";

test("Basic userModel", () => {
  const userModel = manageModel<{ name: string }>()({
    templates: {
      johnDoe: { name: "John Doe" },
    },
  });

  expect(userModel.templates.johnDoe).toEqual({ name: "John Doe" });
});

test("Complete example", () => {
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
          to: (model: any) => JSON.stringify(model),
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
  expect(valid).toBe(true);
  const stored = userModel.parse.localStorage.to(normalized);
  expect(stored).toBe(
    '{"id":"1","name":"Jane Doe","email":"jane@example.com","age":28}',
  );
});
