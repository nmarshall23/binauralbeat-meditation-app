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

const analysisNode = new Tone.FFT();

mainChannel.connect(analysisNode);

// === Setup Canvas === //

useToneVis(canvasFFTRef, analysisNode, isPlaying);
</script>
