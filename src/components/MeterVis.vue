<template>
  <q-linear-progress rounded size="10px" :value="value" class="q-mb-md" />
</template>

<script setup lang="ts">
import { useMainChannel } from "@/state/mainChannel";
import * as Tone from "tone";

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

  value.value = val * 10;
  console.log("meterNode %o", value.value);
}, 1500);
</script>
