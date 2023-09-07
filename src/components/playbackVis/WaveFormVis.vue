<template>
  <q-card flat class="q-ma-md column items-center">
    <div class="text-subtitle2 q-pa-xs">Waveform</div>
    <canvas ref="canvasWFRef"></canvas>
  </q-card>
</template>

<script setup lang="ts">
import * as Tone from "tone";

import { useMainChannel } from "@/state/mainChannel";
import { useToneVis } from "@/use/useToneVis";

const props = defineProps<{
  isPlaying: boolean;
}>();

const { isPlaying } = useVModels(props);

// === Canvas  === //
const canvasWFRef = ref<HTMLCanvasElement>();

// === Connect to MainChannel === //

const { mainChannel } = useMainChannel();

const analysisNode = new Tone.Waveform();

mainChannel.connect(analysisNode);

// === Setup Canvas === //

useToneVis(canvasWFRef, isPlaying, async () => analysisNode.getValue());

onUnmounted(() => {
  analysisNode.dispose();
});
</script>
