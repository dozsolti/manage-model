import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Manage Model",
  description: "One model, one place.",
  cleanUrls: true,
  base: "/manage-model/",

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Model Manager API", link: "/manage-model" },
    ],

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
            link: "/manage-model/constants",
            items: [
              { text: "templates", link: "/manage-model/constants#templates" },
              { text: "inits", link: "/manage-model/constants#inits" },
            ],
          },
          {
            text: "Functions",
            link: "/manage-model/functions",
            items: [
              { text: "to", link: "/manage-model/functions#to" },
              { text: "parsers", link: "/manage-model/functions#parsers" },
              { text: "sorters", link: "/manage-model/functions#sorters" },
              {
                text: "validators",
                link: "/manage-model/functions#validators",
              },
              {
                text: "sanitizers",
                link: "/manage-model/functions#sanitizers",
              },
            ],
          },
        ],
      },
      {
        text: "Examples",
        items: [{ text: "Basic Usage", link: "/examples/basic" }],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/dozsolti/manage-model" },
    ],
  },
});
