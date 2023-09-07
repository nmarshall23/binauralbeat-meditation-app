<template>
  <q-card flat class="q-ma-md column items-center">
    <div class="text-subtitle2 q-pa-xs">Fourier Transformation</div>
    <canvas ref="canvasFFTRef"></canvas>
  </q-card>
</template>

<script setup lang="ts">
import * as Tone from "tone";

import { useMainChannel } from "@/state/mainChannel";
import { useToneVis } from "@/use/useToneVis";

const props = defineProps<{
  isPlaying: boolean;
}>();

const isPlaying = useVModel(props, "isPlaying");

// === Canvas  === //
const canvasFFTRef = ref<HTMLCanvasElement>();

// === Connect to MainChannel === //

const { mainChannel } = useMainChannel();

const splitNode = new Tone.Split();
const analysisNodeL = new Tone.Waveform();
const analysisNodeR = new Tone.Waveform()

mainChannel.connect(splitNode);
splitNode.connect(analysisNodeL, 0);
splitNode.connect(analysisNodeR, 1);
// === Setup Canvas === //

useToneVis(canvasFFTRef, isPlaying, async () => {
  const l = analysisNodeL.getValue();
  const r = analysisNodeR.getValue();

  return l.map((entry, i) => entry - r[i]);
});

onUnmounted(() => {
  // analysisNode.disconnect(mainChannel)
  analysisNodeL.dispose();
});
</script>
