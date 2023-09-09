<template>
  <q-layout view="hHh lpr fff" class="app_container">
    <q-header elevated reveal class="bg-primary text-white" >
      <q-toolbar class="app_toolbar">
        <q-toolbar-title class="text-left">
          Binaural Beat Meditation App
        </q-toolbar-title>

        <q-btn
          v-if="!showResetButton"
          round
          flat
          icon="info"
          :to="{ name: '/info' }"
        >
          <q-tooltip>About</q-tooltip>
        </q-btn>

        <!--  <save-program-btn-group /> -->

        <q-btn
          class="app_toolbar_lastBtn"
          v-if="showResetButton"
          :disable="disableRestButton"
          round
          flat
          icon="arrow_back"
          to="/"
        >
          <q-tooltip>Reset Program</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container class="app_page_container">
      <router-view v-slot="{ Component, route }">
        <transition
          appear
          :enter-active-class="route.meta.transition?.enter"
          :leave-active-class="route.meta.transition?.leave"
        >
          <component
            :is="Component"
            :key="route.path"
            class="app_page"
            :style-fn="styleFn"
          />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router/auto";
import { usePlaybackState } from "./state/playbackState";

const showResetButton = ref(true);
const disableRestButton = ref(false);

const { isPlaying } = usePlaybackState();

const route = useRoute();

watchEffect(() => {
  if (isPlaying.value && route.path != "/") {
    disableRestButton.value = true;
  }

  if (!isPlaying.value && route.path != "/") {
    disableRestButton.value = false;
  }

  if (route.path === "/") {
    showResetButton.value = false;
  }

  if (route.path !== "/") {
    showResetButton.value = true;
  }
});

function styleFn(_offset: number) {
  // "offset" is a Number (pixels) that refers to the total
  // height of header + footer that occupies on screen,
  // based on the QLayout "view" prop configuration

  // this is actually what the default style-fn does in Quasar
  // return { minHeight: offset ? `calc(100svh - ${offset}px)` : "100svh" };
  return {
    minHeight: "100%",
  };
}
</script>

<style scoped lang="scss">
.app_toolbar {
  display: grid;
  grid-template-columns: min-content min-content 1fr min-content;
  grid-template-rows: 1fr;
  column-gap: 8px;
}

.app_toolbar_lastBtn {
  grid-column: 4 / 5;
}

.app_page {
  grid-area: page;
}
.app_page_container {
  // height: 100svh;
  grid-area: page;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 100%;
  grid-template-areas: "page";
}

.app_container {
  display: grid;
  grid-template-columns: 1fr min-content 1fr;
  grid-template-rows: min-content 1fr;
  gap: 0px 0px;
  grid-template-areas:
    "header header header"
    ". page .";
}
</style>
