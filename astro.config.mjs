// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

const [owner, repository] = (process.env.GITHUB_REPOSITORY ?? "").split("/");
const isUserSite = Boolean(
  owner && repository === `${owner}.github.io`,
);
const site =
  process.env.SITE_URL ||
  (owner
    ? `https://${owner}.github.io`
    : "https://your-github-username.github.io");
const base =
  process.env.BASE_PATH ||
  (repository && !isUserSite ? `/${repository}` : "/");

// https://astro.build/config
export default defineConfig({
  output: "static",
  site,
  base,
  trailingSlash: "always",
  integrations: [mdx(), sitemap(), tailwind()],
  markdown: {
    shikiConfig: {
      theme: "github-dark-high-contrast",
    },
  },
});
