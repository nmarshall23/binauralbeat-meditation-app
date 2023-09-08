<template>
  <q-dialog
    v-model="isRevealed"
    ref="dialogRef"
    persistent
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card dark class="q-dialog-plugin bg-blue-grey text-whit">
      <q-toolbar elevated class="bg-primary text-white justify-between">
        <q-btn @click="confirm()" dense flat icon="close" class="item-start">
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>

        <q-toolbar-title> Edit Event Loop</q-toolbar-title>

        <q-icon name="equalizer" />
      </q-toolbar>

      <q-item>
        <q-item-section>
          <q-item-label class="text-body1">
            Event Loop for: <span> {{ generatorInfo.name }}</span></q-item-label
          >
        </q-item-section>
      </q-item>

      <list-item-selection-input
        v-model="model.pattern"
        :options="patternOptions"
        label="Pattern Type"
        hint=""
      />
      <list-item-number-input
        v-model="model.interval"
        label="interval "
        hint=""
      />

      <q-item>
        <q-item-section> Event Count: {{ eventList.length }} </q-item-section>
        <q-item-section avatar>
          <q-btn
            color="primary"
            icon="add"
            label="Add Event"
            @click="addEvent()"
          >
          </q-btn>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-card>
            <q-card-section class="q-gutter-md">
              <BaseEventLoopCard
                v-for="i in eventList"
                :key="i.index"
                v-bind="i"
                v-model:signal="i.signal"
                :signal-types="generatorInfo.signalTypes"
                @remove-item="removeEvent"
                @move-up="moveEventUp"
                @move-down="moveEventDown"
              />
            </q-card-section>
          </q-card>
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useFormatOptionsList } from "@/use/useFormatOptionsList";
import BaseEventLoopCard from "../bits/BaseEventLoopCard.vue";
import {
  ExtendedSignal,
  LoopEventValue,
  LooppingEventsOptions,
} from "@/types/GeneratorSignals";
import { GeneratorDefType } from "@/types/GeneratorDef";

type RevealData = {
  generatorType: GeneratorDefType;
  generatorName: string;
  eventLoop: LooppingEventsOptions<ExtendedSignal>;
  signalTypes: Array<keyof ExtendedSignal>;
};

const { isRevealed, reveal, onReveal, onConfirm, confirm } =
  useConfirmDialog<RevealData>();

defineExpose({
  reveal,
});

const model = ref({
  pattern: "upDown",
  interval: 1,
  probability: 1,
  values: [
    {
      index: 0,
      isMoveUpDisabled: false,
      isMoveDownDisabled: false,
      gain: 1,
      synth: {
        baseFreq: 190,
        beatFreq: 6,
      },
      filter: {
        wet: 1 as const,
        frequency: 200,
        Q: 1,
        gain: 0,
      },
    },
  ],
});

const generatorInfo = ref({
  name: "",
  signalTypes: [] as Array<keyof ExtendedSignal>,
});

type IndexedItem = {
  index: number;
  isMoveUpDisabled: boolean;
  isMoveDownDisabled: boolean;
};

const eventList = ref<Array<LoopEventValue<any> & IndexedItem>>([]);

onReveal((data) => {
  generatorInfo.value.name = data.generatorName;
  generatorInfo.value.signalTypes = data.signalTypes;

  model.value.pattern = data.eventLoop.pattern;
  model.value.interval = data.eventLoop.interval;
  model.value.probability = data.eventLoop.probability ?? 1;

  eventList.value = data.eventLoop.values.map((item, index) => {
    const newItem = Object.assign(toRaw(item), {
      index,
      isMoveUpDisabled: false,
      isMoveDownDisabled: false,
    });
    return newItem;
  });
});

onConfirm(() => {});

const eventLen = computed(() => eventList.value.length);
const firstEvent = computed(() => eventList.value[0]);
const lastEvent = computed(() => eventList.value[eventLen.value - 1]);

watch(
  [firstEvent, eventLen, lastEvent],
  () => {
    eventList.value.forEach((item, i) => {
      if (eventLen.value === 1) {
        item.isMoveUpDisabled = true;
        item.isMoveDownDisabled = true;
      } else if (i === 0) {
        item.isMoveUpDisabled = true;
        item.isMoveDownDisabled = false;
      } else if (i === eventLen.value - 1) {
        item.isMoveDownDisabled = true;
      } else {
        item.isMoveUpDisabled = false;
        item.isMoveDownDisabled = false;
      }
    });
  },
  {
    immediate: true,
  }
);

const patternOptions = useFormatOptionsList([
  "up",
  "down",
  "upDown",
  "random",
  "randomWalk",
]);

function addEvent() {
  const index =
    eventList.value.reduce((acc, i) => (acc < i.index ? i.index : acc), 0) + 1;

  eventList.value.push({
    index,
    isMoveUpDisabled: false,
    isMoveDownDisabled: false,
    rampTime: 10,
    signal: {
      gain: 1,
      synth: {
        baseFreq: 190,
        beatFreq: 6,
      },
      filter: {
        wet: 1 as const,
        frequency: 200,
        Q: 1,
        gain: 0,
      },
    },
  });
}

function removeEvent(i: number) {
  const index = findEventIndex(i);
  eventList.value.splice(index, 1);
}

function moveEventUp(i: number) {
  const index = findEventIndex(i);
  swapElements(index, index - 1);
}

function moveEventDown(i: number) {
  const index = findEventIndex(i);
  swapElements(index, index + 1);
}

function swapElements(index1: number, index2: number) {
  eventList.value[index1] = eventList.value.splice(
    index2,
    1,
    eventList.value[index1]
  )[0];
}

function findEventIndex(i: number) {
  return eventList.value.findIndex((item) => i === item.index);
}
</script>
