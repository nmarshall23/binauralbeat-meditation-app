<template>
  <q-layout view="hHh lpr fff">
    <q-header elevated class="bg-primary text-white" height-hint="50">
      <q-toolbar class="app_toolbar">
        <q-toolbar-title class="text-left">
          Binaural Beat Meditation App
        </q-toolbar-title>

        <q-btn
          :disable="disableRestButton"
          round
          flat
          icon="info"
          :to="{ name: '/info' }"
        >
          <q-tooltip>About</q-tooltip>
        </q-btn>

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

    <q-page-container>
      <router-view />
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
</style>
