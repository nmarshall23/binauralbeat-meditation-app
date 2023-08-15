<template>
  <q-layout view="hHh lpr fff">
    <q-header elevated class="bg-primary text-white" height-hint="50">
      <q-toolbar>
        <q-toolbar-title> Binaual Beat Meditation App </q-toolbar-title>
        <q-space />

        <q-btn v-if="showResetButton" round flat icon="arrow_back" to="/">
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
import { ref, watch } from "vue";
import { useRoute } from "vue-router/auto";

const showResetButton = ref(true);

const route = useRoute();

watch(
  () => route.path,
  (path) => {
    console.log("TO %o", path);
    if (path === "/") {
      showResetButton.value = false;
    } else {
      showResetButton.value = true;
    }
  },
  { immediate: true }
);
</script>
