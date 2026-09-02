import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Manage Model",
  description: "One model, one place.",
  cleanUrls: true,
  base: "/manage-model/",

  themeConfig: {
    footer: {
      message: "Released under the MIT License.",
    },
    sidebar: [
      {
        text: "Guide",
        items: [{ text: "Get Started", link: "/get-started" }],
      },
      {
        text: "Model Manager API",
        items: [
          {
            text: "Constants",
            link: "/api/constants",
            items: [
              { text: "templates", link: "/api/constants#templates" },
              { text: "inits", link: "/api/constants#inits" },
            ],
          },
          {
            text: "Functions",
            link: "/api/functions",
            items: [
              "to",
              "parse",
              "sort",
              "validate",
              "sanitize",
              "migrate",
              "can",
            ].map((fn) => ({ text: fn, link: `/api/functions#${fn}` })),
          },
        ],
      },
      {
        text: "Examples",
        items: [{ text: "Usage", link: "/examples/basic" }],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/dozsolti/manage-model" },
    ],
  },
});
