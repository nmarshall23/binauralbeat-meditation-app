<template>
  <q-card
    class="my-card text-white"
    style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)"
  >
    <q-card-section class="q-pb-none">
      <div class="text-h6 text-left">{{ name }}</div>
    </q-card-section>

    <q-card-actions align="right" class="q-py-none">
      <q-checkbox
        v-model="muteCtrl"
        label="Mute"
        checked-icon="volume_off"
        unchecked-icon="volume_up"
        keep-color
        left-label
        color="red"
      />
      <q-btn flat @click="showVolumeDialog">Volume</q-btn>
    </q-card-actions>

    <q-separator v-if="hasOptions" />

    <q-card-actions
      v-if="hasOptions"
      align="center"
      class="q-pt-md bg-blue-grey"
    >
      <q-btn outline padding="xs 3rem" @click="emit('showOptionsDialog')"
        >Options</q-btn
      >
    </q-card-actions>

    <q-expansion-item
      v-if="hasEvents || hasLoopEvents"
      class="bg-blue-grey"
      label="Events"
      header-class="text-subtitle1 text-weight-medium"
      dense
    >
      <event-sequence-info
        v-if="isDefined(eventSequence)"
        :event-sequence="eventSequence"
        @show-dialog="() => emit('showEditEventSequenceDialog')"
      />

      <q-separator
        v-if="hasEvents && hasLoopEvents"
        dark
        inset
        class="q-mb-md q-mt-sm"
      />

      <event-loop-info
        v-if="hasLoopEvents"
        :event-loop="eventLoopFmt"
        @show-dialog="() => emit('showEditEventLoopDialog')"
      />
    </q-expansion-item>
  </q-card>
</template>

<script setup lang="ts">
import { GeneratorDefType } from "@/types/GeneratorDef";
import { EventSequence, LooppingEventsOptions } from "@/types/GeneratorSignals";
import { capitalCase } from "change-case";

import { isDefined } from "@vueuse/core";
// type E = SignalBase & Record<string, any>;

const props = defineProps<{
  name: string;
  muteCtrl: boolean;
  genType: GeneratorDefType;
  hasOptions: boolean;
  eventLoop?: LooppingEventsOptions<any>;
  eventSequence?: EventSequence<any>;
}>();

const emit = defineEmits<{
  (e: "update:muteCtrl", muteCtrl: boolean): void;
  (
    e: "showVolumeDialog",
    options: {
      title: string;
    }
  ): void;
  (e: "showOptionsDialog"): void;
  (e: "showEditEventSequenceDialog"): void;
  (e: "showEditEventLoopDialog"): void;
}>();

const muteCtrl = useVModel(props, "muteCtrl", emit);
const { genType, eventLoop, eventSequence } = useVModels(props);

function showVolumeDialog() {
  emit("showVolumeDialog", {
    title: "Foo",
  });
}

const hasEvents = computed(() => isDefined(eventSequence));
const hasLoopEvents = computed(() => isDefined(eventLoop));

const eventLoopFmt = computed(() => {
  return {
    pattern: capitalCase(eventLoop?.value?.pattern ?? "upDown"),
    interval: `${eventLoop?.value?.interval ?? 60} seconds`,
    probability: `${(eventLoop?.value?.probability ?? 1) * 100}%`,
    values: eventLoop?.value?.values ?? [],
  };
});
</script>
