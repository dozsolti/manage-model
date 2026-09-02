import { expect, test } from "vitest";

import { manageModel } from "../src";

test("parse helpers support custom from/to variants", () => {
  type User = {
    id: number;
    name: string;
    active: boolean;
  };

  const userModel = manageModel<User>()(
    {
      templates: {
        defaultUser: { id: 1, name: "Alice", active: true },
      },
      inits: {
        fromRaw: (raw: Partial<User>) => ({
          id: Number(raw.id ?? 0),
          name: String(raw.name ?? ""),
          active: Boolean(raw.active),
        }),
      },
    },
    {
      parse: {
        storage: {
          from: (raw: string) => {
            const parsed = JSON.parse(raw) as Partial<User>;
            return parsed && typeof parsed.name === "string"
              ? (parsed as User)
              : null;
          },
          to: (model: User) => JSON.stringify(model),
        },
      },
    },
  );

  const raw = '{"id":2,"name":"Bob","active":false}';
  const parsed = userModel.parse.storage.from(raw);

  expect(parsed).toEqual({ id: 2, name: "Bob", active: false });
  expect(userModel.parse.storage.to(parsed!)).toBe(raw);
  expect(userModel.parse.storage.from(raw)).toEqual(parsed);
});

test("sort, validate, sanitize, migrate, and can work together", () => {
  type User = {
    id: string;
    name: string;
    age: number;
    email: string;
  };

  const userModel = manageModel<User>()(
    {
      templates: {
        admin: {
          id: "admin",
          name: "  Admin User  ",
          age: 30,
          email: "ADMIN@EXAMPLE.COM",
        },
      },
      inits: {
        defaultUser: (name: string) => ({
          id: crypto.randomUUID(),
          name,
          age: 18,
          email: "",
        }),
      },
    },
    {
      sort: {
        byAge: (a, b) => a.age - b.age,
      },
      validate: {
        isAdult: (user) => user.age >= 18,
        hasEmail: (user) => /.+@.+\..+/.test(user.email),
      },
      sanitize: {
        normalize: (user) => ({
          ...user,
          name: user.name.trim(),
          email: user.email.trim().toLowerCase(),
        }),
      },
      migrate: {
        toLegacy: (user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
        }),
      },
      can: {
        isEligible: (user) => user.age >= 18 && !!user.email,
      },
    },
  );

  const created = userModel.inits.defaultUser("Jane Doe");
  const normalized = userModel.sanitize.normalize({
    ...created,
    email: "  JANE@EXAMPLE.COM  ",
  });

  expect(userModel.validate.isAdult(normalized)).toBe(true);
  expect(userModel.validate.hasEmail(normalized)).toBe(true);
  expect(normalized.email).toBe("jane@example.com");
  expect(normalized.name).toBe("Jane Doe");

  const sorted = [
    { ...normalized, age: 25 },
    { ...normalized, age: 19 },
    { ...normalized, age: 31 },
  ].sort(userModel.sort.byAge);

  expect(sorted.map((user) => user.age)).toEqual([19, 25, 31]);
  expect(userModel.migrate.toLegacy(normalized)).toEqual({
    id: normalized.id,
    name: normalized.name,
    email: normalized.email,
  });
  expect(userModel.can.isEligible(normalized)).toBe(true);
  expect(
    userModel.can.isEligible({
      id: "kid",
      name: "Kid",
      age: 15,
      email: "",
    }),
  ).toBe(false);
});

test("builder function can compose constants and manager methods", () => {
  type User = {
    id: string;
    name: string;
  };

  const userModel = manageModel<User>()(
    {
      templates: {
        guest: { id: "guest", name: "Guest" },
      },
    },
    ({ templates }) => ({
      to: {
        guestName: () => templates.guest.name,
      },
      sanitize: {
        uppercase: (user) => ({
          ...user,
          name: user.name.toUpperCase(),
        }),
      },
    }),
  );

  expect(userModel.to.guestName()).toBe("Guest");
  expect(userModel.sanitize.uppercase({ id: "1", name: "john" })).toEqual({
    id: "1",
    name: "JOHN",
  });
});
