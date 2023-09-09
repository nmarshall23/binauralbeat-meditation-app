import { App } from "vue";
import { Router } from "vue-router/auto";

 function setupRouterPageTransitions(router: Router) {
  router.afterEach((to, from) => {
    if (!isDefined(to.meta.transition)) {
      to.meta.transition = {
        enter: "animated fadeInRight",
        leave: "animated fadeOutLeft",
      };
    }

    if (!isDefined(from.meta.transition)) {
        from.meta.transition = {
          enter: "animated fadeInRight",
          leave: "animated fadeOutLeft",
        };
      }

    to.meta.transition.leave = from.meta.transition.leave;
  });
}

/** Must be used _after_ router is */
export default {
  install: (app: App) => {
    setupRouterPageTransitions(app.config.globalProperties.$router)
    // console.log(app.config.globalProperties)
  }
}