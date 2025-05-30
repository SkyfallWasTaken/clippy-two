import { defineConfig } from "wxt";

export default defineConfig({
  manifest: {
    host_permissions: ["<all_urls>"],
    permissions: ["offscreen", "tts"],
  },
  modules: ["@wxt-dev/module-react"],
});
