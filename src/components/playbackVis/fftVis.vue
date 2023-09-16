<template>
  <q-card flat class="q-ma-md column items-center">
    <div class="text-subtitle2 q-pa-xs">Fourier Transformation</div>
    <canvas ref="canvasFFTRef"></canvas>
  </q-card>
</template>

<script setup lang="ts">
import * as Tone from "tone";

import { useToneVis } from "@/use/useToneVis";

const props = defineProps<{
  isPlaying: boolean;
}>();

const isPlaying = useVModel(props, 'isPlaying');

// === define  === //
const canvasFFTRef = ref<HTMLCanvasElement>();
const analysisNode = new Tone.FFT();

const channel = new Tone.Channel()

// === Wire Connections ==== //

channel.receive('analysis')
channel.connect(analysisNode)


// === Draw Canvas === //

useToneVis(canvasFFTRef, isPlaying, async () => analysisNode.getValue());

onUnmounted(() => {
  // analysisNode.disconnect(mainChannel)
  analysisNode.dispose();
});
</script>
