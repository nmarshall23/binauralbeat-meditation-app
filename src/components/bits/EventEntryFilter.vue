<template>
  <q-item-section>
    <q-item-label caption class="text-weight-bold"> Filter Event </q-item-label>

    <q-item-label caption v-if="hasFilterWetEvent" class="q-ml-md">
      <span class="text-weight-medium">Wet: </span>
      {{ event?.signal?.filter?.wet }}
    </q-item-label>

    <q-item-label caption v-if="hasFilterFreqEvent" class="q-ml-md">
      <span class="text-weight-medium">Frequency: </span>
      {{ event?.signal?.filter?.frequency }}
    </q-item-label>

    <q-item-label caption v-if="hasFilterQEvent" class="q-ml-md">
      <span class="text-weight-medium">Q: </span>
      {{ event?.signal?.filter?.Q }}
    </q-item-label>

    <q-item-label caption v-if="hasFilterGainEvent" class="q-ml-md">
      <span class="text-weight-medium">Gain: </span>
      {{ event?.signal?.filter?.gain }}
    </q-item-label>

  </q-item-section>
</template>

<script setup lang="ts">
import { LoopEventValue, SignalBase } from "@/types/GeneratorSignals";
import { isFilterFreqEvent, isFilterGainEvent, isFilterQEvent, isFilterWetEvent } from "@/use/useLoopEventMatchers";

type E = SignalBase & Record<string, any>;

const props = defineProps<{
  value: LoopEventValue<E> | undefined;
}>();
const event = useVModel(props, "value");

const hasFilterFreqEvent = computed(() => isFilterFreqEvent(event.value));
const hasFilterQEvent = computed(() => isFilterQEvent(event.value));
const hasFilterGainEvent = computed(() => isFilterGainEvent(event.value));
const hasFilterWetEvent = computed(() => isFilterWetEvent(event.value));

</script>
