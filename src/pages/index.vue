<template>
  <q-page padding class="column items-start">
    <nm-card color="bg-secondary">
      <template #header>
        <div class="text-h6">What Are Binaural Beats?</div>
        <q-card-section class="q-pt-none">
          A binaural beat is an illusion created by the brain when you listen to
          two tones with slightly different frequencies at the same time.
        </q-card-section>
        <q-card-section class="q-py-none">
          To experience this effect you need to wear headphones.
        </q-card-section>
      </template>

      <q-separator dark />
      <q-card-actions class="q-pt-none">
        <q-btn flat href="https://www.webmd.com/balance/what-are-binaural-beats"
          >Read more on WebMD</q-btn
        >
      </q-card-actions>
    </nm-card>

    <nm-card color="bg-purple">
      <template #header>
        <div class="text-h6">Meditation Programs</div>
        <div class="text-subtitle2">Select one to begin your session</div>
      </template>
      <menu-list v-model:menu-state="menuState" :menu="accordionMenu" />
    </nm-card>
  </q-page>
</template>

<script setup lang="ts">
import { usePresetProgramsStore } from "@/state/presetProgramsStore";
import { definePage } from "vue-router/auto";

definePage({
  meta: {
    transition: {
      enter: "animated fadeInRight",
      leave: "animated fadeOutRightBig",
    },
  },
});

const { accordionMenu, menuState } = usePresetProgramsStore();
</script>
