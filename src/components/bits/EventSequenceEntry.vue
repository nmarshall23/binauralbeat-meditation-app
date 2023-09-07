<template>
  <q-item dense class="q-ml-sm EventItem_container">
    <!-- === Time Events === -->
    <q-item-section top class="col1">
      <q-item-label caption>
        <span class="text-weight-bold">Time: </span>
        <span>
          {{ formatTimeEvent }}
        </span>
      </q-item-label>
      <!-- === Gain Events === -->
      <q-item-label caption v-if="hasGainEvent">
        <span class="text-weight-bold">Gain: </span>
        <span>
          {{ event?.signal.gain }}
        </span>
      </q-item-label>
    </q-item-section>

    <!-- === Filter Events === -->
    <event-entry-filter :value="event" v-if="hasFilterEvent" class="col2" />

    <!-- === Synth Events === -->
    <event-entry-synth :value="event" v-if="hasSynthEvent" class="col2"  />
    
  </q-item>
</template>

<script setup lang="ts">
import { EventValueType, SignalBase } from "@/types/GeneratorSignals";
import {
  isFilterEvent,
  isGainEvent,
  isSpinEffectEvent,
  isSynthEvent,
} from "@/use/useLoopEventMatchers";
import { Pattern, match } from "ts-pattern";
import { WritableComputedRef } from "vue";

type E = SignalBase & Record<string, any>;

const props = defineProps<{
  value: EventValueType<unknown> | undefined;
}>();

const event = useVModel(props, "value") as WritableComputedRef<
  EventValueType<E>
>;

const formatTimeEvent = computed(() =>
  match(event.value)
    .with(
      {
        time: Pattern.number,
      },
      (e) => `${e.time} sec`
    )
    .with(
      {
        time: Pattern.string.startsWith("+"),
      },
      (e) => `${e.time.substring(1)}s`
    )
    .with(
      {
        time: Pattern.string.startsWith("-"),
      },
      (e) => `${e.time.substring(1)}s from End`
    )
    .with(
      {
        time: Pattern.string.startsWith("%"),
      },
      (e) => `${e.time.substring(1)}% Duration`
    )
    .otherwise((e) => `Unknown ${e?.time}`)
);

const hasGainEvent = computed(() => isGainEvent(event.value));

const hasFilterEvent = computed(() => isFilterEvent(event.value));

const hasSynthEvent = computed(() => isSynthEvent(event.value) || isSpinEffectEvent(event.value));

</script>

<style scoped>
.EventItem_container {
  display: grid;
  grid-template-columns: 8em 5em min-content min-content;
  grid-template-rows: min-content;
  justify-content: space-between;
}

.col1 {
  grid-area: 1 / 1 / 2 / 2;
  white-space: nowrap;
}
.col2 {
  grid-area: 1 / 2 / 2 / 3;
  margin-inline-start: 0;
  margin-left: 0;
  white-space: nowrap;
}

.col3 {
  grid-area: 1 / 3 / 2 / 4;
  margin-inline-start: 0;
  margin-left: 0;
}
.col4 {
  grid-area: 1 / 4 / 2 / 5;
}
</style>
