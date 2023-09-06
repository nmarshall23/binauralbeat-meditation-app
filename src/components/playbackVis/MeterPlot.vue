<template>
  <q-card flat class="q-ma-md q-pa-md bg-brown-10 track">
    <q-card-section class="bg-orange sled"> </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import * as Tone from "tone";

import { useMainChannel } from "@/state/mainChannel";
import { logicNot } from "@vueuse/math/index.cjs";

const props = defineProps<{
  isPlaying: boolean;
}>();

const isPlaying = useVModel(props, "isPlaying");

// === Connect Meter to MainChannel === //

const { mainChannel } = useMainChannel();
console.info("mainChannel %o", mainChannel.channelCount);
const meterNode = new Tone.Meter({
  normalRange: true,
});

mainChannel.connect(meterNode);

// === Output Value === //

const source = ref(0);

const { pause, resume } = useRafFn(
  () => {
    const val = meterNode.getValue() as number;
    source.value = Math.pow(val, 0.2);

    // console.log("meterNode.getValue %o source %o", val, source.value,);
  },
  { immediate: false }
);

whenever(isPlaying, () => {
  source.value = 0;
  resume();
});
whenever(logicNot(isPlaying), () => {
  pause();
  source.value = 0;
});
</script>

<style scoped>
.track {
  position: relative;
  height: 40px;
}
.sled {
  transition: transform 1000ms;
  transform-origin: bottom center;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform: scaleY(v-bind("source"));
  height: 100%;
}
</style>
