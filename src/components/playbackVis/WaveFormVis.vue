<template>
  <q-card flat class="q-ma-md column items-center">
    <div class="text-subtitle2 q-pa-xs">Waveform</div>
    <canvas ref="canvasWFRef"></canvas>
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

const canvasWFRef = ref<HTMLCanvasElement>();
const analysisNode = new Tone.Waveform();
const channel = new Tone.Channel()

// === Wire Connections ==== //

channel.receive('analysis')
channel.connect(analysisNode)


// === Draw Canvas === //

useToneVis(
  canvasWFRef,
  isPlaying,
  async () => analysisNode.getValue()
);

onUnmounted(() => {
  analysisNode.dispose();
});
</script>
