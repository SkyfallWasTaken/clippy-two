import { defineConfig } from "wxt";

export default defineConfig({
  manifest: {
    name: "Clippy Two",
    host_permissions: ["<all_urls>"],
  },
  modules: ["@wxt-dev/module-react"],
});
