import { expect, test } from "vitest";

import { manageModel } from "../src";

test("access to constants", () => {
  const userModel = manageModel<{ name: string }>()(
    {
      templates: {
        johnDoe: { name: "John Doe" },
      },
    },
    ({ templates }) => ({
      to: {
        templateJohnDoe: () => templates.johnDoe,
      },
    }),
  );

  expect(userModel.templates.johnDoe).toEqual(userModel.to.templateJohnDoe());
});

test("access to constants from constants", () => {
  const userModel = manageModel<{ name: string }>()(
    {
      templates: {
        johnDoe: { name: "John Doe" },
      },
      inits: {
        fromName: function (name: string | null) {
          return {
            name: name ?? "",
          };
        },
      },
    },
    ({ templates }) => ({
      to: {
        templateJohnDoe: () => templates.johnDoe,
      },
    }),
  );

  expect(userModel.templates.johnDoe).toEqual(userModel.to.templateJohnDoe());
});

test("access to functions", () => {
  const userModel = manageModel<{ name: string }>()(
    {
      templates: {
        johnDoe: { name: "      John Doe        " },
      },
    },
    ({ templates }) => ({
      to: {
        templateCleanJohnDoe: () =>
          userModel.sanitizers.normalize(templates.johnDoe),
      },
      sanitizers: {
        normalize: (model: { name: string }) => ({ name: model.name.trim() }),
      },
    }),
  );

  expect(userModel.templates.johnDoe).not.toEqual(
    userModel.to.templateCleanJohnDoe(),
  );
});
