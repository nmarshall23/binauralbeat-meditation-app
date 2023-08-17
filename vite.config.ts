import { defineConfig } from "vite";
import { resolve } from "node:path";
import VueRouter from "unplugin-vue-router/vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";

import vue from "@vitejs/plugin-vue";
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  plugins: [
    AutoImport({
      dts: true,
      imports: [
        // presets
        "vue",
        "@vueuse/core",
      ],
      eslintrc: {
        enabled: true,
      },
    }),
    VueRouter({
      /* options */
    }),
    vue({
      template: { transformAssetUrls },
    }),

    quasar({
      sassVariables: "src/quasar-variables.sass",
    }),
    Components({ dts: true }),
  ],
});
