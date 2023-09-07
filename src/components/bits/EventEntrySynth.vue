<template>
  <q-item-section>
    <q-item-label caption class="text-weight-bold"> Synth Event </q-item-label>

    <q-item-label caption v-if="hasSynthBeatFreqEvent" class="q-ml-md">
      <span class="text-weight-medium">Beat Freq: </span>
      {{ event?.signal?.synth?.beatFreq }}
    </q-item-label>

    <q-item-label caption v-if="hasSynthBaseFreqEvent" class="q-ml-md">
      <span class="text-weight-medium">Base Freq: </span>
      {{ event?.signal?.synth?.baseFreq }}
    </q-item-label>

    <q-item-label caption v-if="hasSpinEffectWetEvent" class="q-ml-md">
      <span class="text-weight-medium">Spin Wet: </span>
      {{ spinEffectValue }}
    </q-item-label>

    <q-item-label caption v-if="hasSpinEffectCycleEvent" class="q-ml-md">
      <span class="text-weight-medium">Spin Freq: </span>
      {{ event?.signal?.spinEffect?.frequency }}
    </q-item-label>
  </q-item-section>
</template>

<script setup lang="ts">
import { LoopEventValue, SignalBase } from "@/types/GeneratorSignals";
import {
  isSpinEffectCycleFreqEvent,
  isSpinEffectEnableEvent,
  isSpinEffectWetEvent,
  isSynthBaseFreqEvent,
  isSynthBeatFreqEvent,
} from "@/use/useLoopEventMatchers";

type E = SignalBase & Record<string, any>;

const props = defineProps<{
  value: LoopEventValue<E> | undefined;
}>();

const event = useVModel(props, "value");

const hasSynthBeatFreqEvent = computed(() => isSynthBeatFreqEvent(event.value));
const hasSynthBaseFreqEvent = computed(() => isSynthBaseFreqEvent(event.value));

const hasSpinEffectWetEvent = computed(
  () =>
    isSpinEffectWetEvent(event.value) || isSpinEffectEnableEvent(event.value)
);

const spinEffectValue = computed(() => {
  if (isSpinEffectWetEvent(event.value)) {
    return event.value.signal.spinEffect.wet;
  }
  if (isSpinEffectEnableEvent(event.value)) {
    return event.value.signal.spinEffect;
  }
  return 0;
});

const hasSpinEffectCycleEvent = computed(() =>
  isSpinEffectCycleFreqEvent(event.value)
);
</script>
