<template>
  <nm-card color="bg-purple">
    <template #header>
      <div class="text-h6">Simple Binaural Beat generator</div>
      <div class="text-subtitle2">
        How long would you like your session to last?
      </div>
    </template>

    <q-card-actions>
      <chip-option v-model:value="selected" :options="durationOptions" />
    </q-card-actions>
    <q-separator />
    <q-card-actions align="center">
      <q-btn push color="primary" label="Next" style="width: 150px" to="play" />
    </q-card-actions>
  </nm-card>
</template>

<script setup lang="ts">
import { useProgramDurationStore } from "@/state/programDuration";
import { useMinDurationToSec } from "@/use/useDurationInSec";
import { definePage } from "vue-router/auto";

definePage({
  meta: {
    transition: {
      enter: "animated fadeInUpBig",
      leave: "animated fadeOutDownBig",
    },
  },
});

const durationOptions = ref([
  { label: "4 minutes", value: useMinDurationToSec(4) },
  { label: "16 minutes", value: useMinDurationToSec(16) },
  { label: "20 minutes", value: useMinDurationToSec(20) },
  { label: "30 minutes", value: useMinDurationToSec(30) },
  { label: "1 hour", value: useMinDurationToSec(60) },

  { label: "8 hours", value: useMinDurationToSec(0, 8) },
]);

if (process.env.NODE_ENV === "development") {
  durationOptions.value.unshift({ label: "Testing", value: 60 });
}

const { duration } = useProgramDurationStore();

const selected = ref(durationOptions.value[0]);

watch(
  selected,
  (newSelection) => {
    duration.value = newSelection.value;
  },
  {
    immediate: true,
  }
);


</script>
