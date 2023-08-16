<template>
  <q-layout view="hHh lpr fff">
    <q-header elevated class="bg-primary text-white" height-hint="50">
      <q-toolbar class="justify-between">
        <q-toolbar-title class="text-left" > Binaual Beat Meditation App </q-toolbar-title>
        

        <q-btn
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
import { ref, watchEffect } from "vue";
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
