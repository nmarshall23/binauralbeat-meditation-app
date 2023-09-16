<template>
  <q-card flat class="q-ma-md column items-center">
    <div class="text-subtitle2 q-pa-xs">Waveform</div>
    <canvas ref="canvasWFRef"></canvas>
  </q-card>
</template>

<script setup lang="ts">
import * as Tone from "tone";

// import { useMainChannel } from "@/state/mainChannel";
import { useToneVis } from "@/use/useToneVis";

const props = defineProps<{
  isPlaying: boolean;
  toneNode?: Tone.ToneAudioNode;
}>();

const { isPlaying, toneNode } = useVModels(props);

// === Define const  === //

const canvasWFRef = ref<HTMLCanvasElement>();
// const { mainChannel } = useMainChannel();
const analysisNode = new Tone.Waveform();
// const analysisNode = new Tone.Analyser('fft')

// === Connect to MainChannel === //
onMounted(() => {});

watch(
  () => toneNode?.value,
  (node, prevNode) => {
    if (isDefined(prevNode)) {
      console.log("prev %o", prevNode);
      prevNode.disconnect(analysisNode);
    }

    if (isDefined(node)) {
      console.log("node %o", node);
      node.connect(analysisNode);
    }
    // else {
    //   mainChannel.connect(analysisNode);
    // }
  },
  {
    immediate: true,
  }
);

// === Setup Canvas === //

useToneVis(
  canvasWFRef,
  isPlaying,
  async () => analysisNode.getValue()
);

onUnmounted(() => {
  // analysisNode.dispose();
});
</script>
