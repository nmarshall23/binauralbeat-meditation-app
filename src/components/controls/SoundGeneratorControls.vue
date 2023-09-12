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

    <q-separator v-if="hasOptions && featureFlag.editGenOptions" />

    <q-card-actions
      v-if="hasOptions && featureFlag.editGenOptions"
      align="center"
      class="q-pt-md bg-blue-grey"
    >
      <q-btn outline padding="xs 3rem" @click="emit('showOptionsDialog')"
        >Options</q-btn
      >
    </q-card-actions>

    <q-expansion-item
      v-if="hasEventSequence || hasEventLoop"
      class="bg-blue-grey"
      label="Events"
      header-class="text-subtitle1 text-weight-medium"
      dense
    >
      <event-sequence-info
        v-if="hasEventSequence"
        :event-sequence="eventSequenceFmt"
        @show-dialog="() => emit('showEditEventSequenceDialog')"
      />

      <q-separator
        v-if="hasEventSequence && hasEventLoop"
        dark
        inset
        class="q-mb-md q-mt-sm"
      />

      <event-loop-info
        v-if="hasEventLoop"
        :event-loop="eventLoopFmt"
        @show-dialog="() => emit('showEditEventLoopDialog')"
      />
    </q-expansion-item>
  </q-card>
</template>

<script setup lang="ts">
import { GeneratorDefType, SoundGeneratorDef } from "@/types/GeneratorDef";
import { capitalCase } from "change-case";

import { isDefined } from "@vueuse/core";
import { Pattern, match } from "ts-pattern";
import { useAppFeatures } from "@/state/appFeatures";
// type E = SignalBase & Record<string, any>;

const props = defineProps<{
  name: string;
  generatorDef: SoundGeneratorDef;
  muteCtrl: boolean;
  genType: GeneratorDefType;
  hasOptions: boolean;
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
const { generatorDef } = useVModels(props);


//=== App Feature Flags ===//

const featureFlag = useAppFeatures()


function showVolumeDialog() {
  emit("showVolumeDialog", {
    title: "Foo",
  });
}

const events = computed(() => getEvents(generatorDef.value));
const hasEventSequence = computed(() => isDefined(events.value.eventSequence));
const hasEventLoop = computed(() => isDefined(events.value.eventLoop));

const eventLoopFmt = computed(() => {
  return {
    pattern: capitalCase(events.value.eventLoop?.pattern ?? "upDown"),
    interval: `${events.value.eventLoop?.interval ?? 60} seconds`,
    probability: `${(events.value.eventLoop?.probability ?? 1) * 100}%`,
    values: events.value.eventLoop?.values ?? [],
  };
});

const eventSequenceFmt = computed(() => {
  return {
    events: events.value.eventSequence?.events ?? [],
    ...events.value.eventSequence,
  };
});

function getEvents(generatorDef: SoundGeneratorDef) {
  return match(generatorDef)
    .with(
      {
        type: Pattern.union(
          "BinauralBeatSpinOsc",
          "BinauralBeatwLoop",
          "NoiseFilteredGen",
          "SamplePlayer"
        ),
        options: {
          loopEvents: Pattern.optional(Pattern.any),
          eventSequence: Pattern.optional(Pattern.any),
        },
      },
      (def) => {
        return {
          eventLoop: def.options.loopEvents,
          eventSequence: def.options.eventSequence,
        };
      }
    )
    .otherwise(() => {
      return {
        eventLoop: undefined,
        eventSequence: undefined,
      };
    });
}
</script>
