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
