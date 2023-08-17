<template>
  <q-card flat bordered class="ND_card text-white text-left bg-grey-9">
    <q-card-section class="bg-purple">
      <div class="text-h6">Simple Binaural Beat generator</div>
      <div class="text-subtitle2">
        How long would you like your session to last?
      </div>
    </q-card-section>

    <q-card-actions>
      <chip-option v-model:value="selected" :options="timeOptions" />
    </q-card-actions>
    <q-separator />
    <q-card-actions align="center">
      <q-btn push color="primary" label="Next" style="width: 150px" to="play" />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { ref, watch, watchEffect } from "vue";
import { useProgramDurationStore } from "../../../state/programDuration";
import { useMinDurationToSec } from "../../../use/useDurationInSec";
import ChipOption from "../../../components/ChipOption.vue";

const timeOptions = ref([
  { label: "4 minutes", value: useMinDurationToSec(4) },
  { label: "16 minutes", value: useMinDurationToSec(16) },
  { label: "30 minutes", value: useMinDurationToSec(30) },
  { label: "1 hour", value: useMinDurationToSec(60) },
]);

const selected = ref(timeOptions.value[0]);

watch(selected, (newSelection) => {
  duration.value = newSelection.value
})


const { duration } = useProgramDurationStore();
</script>
