<template>
  <q-list dark>
    <q-item class="q-mb-xs" dense>
      <q-item-section>
        <q-item-label overline>Event Sequence</q-item-label>
      </q-item-section>
      <q-item-section avatar>
        <q-btn
          v-if="featureFlag.editGenEventSequ"
          size="sm"
          outline
          label="edit"
          @click="() => emit('showDialog')"
        />
      </q-item-section>
    </q-item>

    <q-item dense class="q-mb-sm" v-if="hasValues">
      <q-item-section>
        <q-item-label caption v-if="eventSequence.startOffsetSeconds">
          <span class="text-weight-bold">startOffsetSeconds: </span>
          {{ eventSequence.startOffsetSeconds }}
        </q-item-label>

        <q-item-label caption v-if="eventSequence.loop">
          <span class="text-weight-bold">loop: </span>
          {{ eventSequence.loop }}
        </q-item-label>
        <q-item-label caption v-if="eventSequence.loopStart">
          <span class="text-weight-bold">Start Time: </span>
          {{ eventSequence.loopStart }}
        </q-item-label>
        <q-item-label caption v-if="eventSequence.loopEnd">
          <span class="text-weight-bold">End Time: </span>
          {{ eventSequence.loopEnd }}
        </q-item-label>
      </q-item-section>
    </q-item>


    <template v-for="(item, i) in eventSequence.events" :key="i">
      <event-sequence-entry :value="item" />
      <q-separator
        v-if="i < eventSequence.events.length - 1"
        class="q-mb-sm q-mt-xs"
        inset
      />
    </template>
  </q-list>
</template>

<script setup lang="ts">
import { useAppFeatures } from "@/state/appFeatures";
import { EventValueType } from "@/types/GeneratorSignals";

const props = defineProps<{
  eventSequence: {
    startOffsetSeconds?: number;
    loop?: boolean | number;
    loopStart?: string;
    loopEnd?: string;
    events: EventValueType<any>[];
  };
}>();

const emit = defineEmits<{
  (e: "showDialog"): void;
}>();

const eventSequence = useVModel(props, 'eventSequence');

const hasValues = computed(
  () => Object.keys(eventSequence.value ?? {}).length > 1
);

//=== App Feature Flags ===//

const featureFlag = useAppFeatures()

</script>
