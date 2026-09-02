import { expect, test } from "vitest";

import { manageModel } from "../src";

test("no typescript errors - inits", () => {
  const userModel = manageModel<{ name: string }>()({
    inits: {
      default: () => ({ name: "Default User" }),
      fromUser: (name: string) => ({ name }),
      fromNameAndLastName: (firstName: string, lastName: string) => ({
        name: `${firstName} ${lastName}`,
      }),
      fromNameAndAge: (name: string, age: number) => ({
        name: `${name} (${age})`,
      }),
    },
  });

  expect(userModel.inits.default()).toEqual({ name: "Default User" });
  expect(userModel.inits.fromUser("John")).toEqual({ name: "John" });
  expect(userModel.inits.fromNameAndLastName("John", "Doe")).toEqual({
    name: "John Doe",
  });
  expect(userModel.inits.fromNameAndAge("John", 30)).toEqual({
    name: "John (30)",
  });
});
