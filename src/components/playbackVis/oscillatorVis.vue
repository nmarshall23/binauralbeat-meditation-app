<template>
  <q-card flat class="column justify-start items-center">
    <div class="text-subtitle2 q-pa-xs">Oscillator Shape</div>
    <canvas ref="canvasWFRef"></canvas>
  </q-card>
</template>

<script setup lang="ts">
import { useSimpleToneVis } from "@/use/useToneVis";

const props = defineProps<{
  watch: boolean;
  updateVisCb: () => Promise<Float32Array>
}>();

const { watch, updateVisCb } = useVModels(props);

// === Canvas  === //
const canvasWFRef = ref<HTMLCanvasElement>();

// === Setup Canvas === //

useSimpleToneVis(canvasWFRef, watch, () => updateVisCb.value());

</script>

<style scoped>
.card {
  width: 310px;
}
</style>
