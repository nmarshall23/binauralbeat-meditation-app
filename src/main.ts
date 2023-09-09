import { createApp } from "vue";
import { Quasar, Dialog, BottomSheet } from "quasar";
import { createRouter, createWebHistory } from "vue-router/auto";

import "@quasar/extras/material-icons/material-icons.css";
import "quasar/src/css/index.sass";
import "./style.css";

import '@quasar/extras/animate/fadeInUpBig.css'
import '@quasar/extras/animate/fadeOutDownBig.css'
import '@quasar/extras/animate/fadeInRight.css'
import '@quasar/extras/animate/fadeOutLeft.css'

import App from "./App.vue";

import { createVuePlugin } from "harlem";
import routerPageTransitions from "./use/pluginRouterPageTransitions";


const base = process.env.NODE_ENV === "production" ? '/binauralbeat-meditation-app/' : ''
const router = createRouter({
  history: createWebHistory(base),
  
  // You don't need to pass the routes anymore,
  // the plugin writes it for you 🤖
});


createApp(App)
  .use(router)
  .use(routerPageTransitions)
  .use(createVuePlugin())
  .use(Quasar, {
    plugins: {
      Dialog,
      BottomSheet,
    }, // import Quasar plugins and add here
    config: {
      dark: true,
    }
  })
  .mount("#app");
