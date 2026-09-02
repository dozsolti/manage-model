import { expect, test } from "vitest";

import { manageModel } from "../src";

type User = { name: string };

test("no typescript errors - to", () => {
  const userModel = manageModel<User>()(
    {},
    {
      to: {
        string: (data) => data.name,
        stringWithNumber: (data, num: number) => data.name + ` (${num})`,
        stringWithObject: (data, obj: { num: number }) =>
          data.name + ` (${obj.num})`,
      },
    },
  );

  expect(userModel.to.string({ name: "John" })).toEqual("John");
  expect(userModel.to.stringWithNumber({ name: "John" }, 30)).toEqual(
    "John (30)",
  );
  expect(userModel.to.stringWithObject({ name: "John" }, { num: 30 })).toEqual(
    "John (30)",
  );
});
