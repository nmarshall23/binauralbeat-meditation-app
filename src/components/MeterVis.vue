<template>
  <q-linear-progress rounded size="10px" :value="value" class="q-mb-md" />
</template>

<script setup lang="ts">
import * as Tone from "tone";
import { useMainChannel } from "../state/mainChannel";
import { ref } from "vue";
import { useIntervalFn } from "@vueuse/core";

const { mainChannel } = useMainChannel();

const meterNode = new Tone.Meter({
  normalRange: true,
  // smoothing: 1,
});

mainChannel.connect(meterNode);

const value = ref(0);

useIntervalFn(() => {
    // console.log('meterNode.getValue %o', meterNode.getValue())

    const val = meterNode.getValue() as number;
    
    value.value = val * 10
    console.log('meterNode %o', value.value)
}, 1500)

// Tone.Transport.scheduleRepeat((time) => {
//   Tone.Draw.schedule(() => {
    
//     if (meterNode.channels > 1) {
//       const v = meterNode.getValue() as number[];
//       value.value = v.map((i) => i * 100);
//     }
//   }, time);
// }, 1);
</script>
