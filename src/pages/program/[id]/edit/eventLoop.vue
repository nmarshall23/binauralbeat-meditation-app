<template>
  <q-card dark class="q-dialog-plugin bg-blue-grey text-whit">
    <q-toolbar elevated class="bg-primary text-white justify-between">
      <q-btn dense flat icon="close" class="item-start">
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
        <q-btn color="primary" icon="add" label="Add Event" @click="addEvent()">
        </q-btn>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-card>
          <q-card-section class="q-gutter-md">
            <BaseEventLoopCard
              v-for="(item, i) in eventList"
              :key="item.index"
              :is-move-up-disabled="item.isMoveUpDisabled"
              :is-move-down-disabled="item.isMoveDownDisabled"
              :index="item.index"
              v-model:signal="item.signal"
              :signal-types="generatorInfo.signalTypes"
              @remove-item="removeEvent"
              @move-up="moveEventUp"
              @move-down="moveEventDown"
              :ref="(el) => (eventCards[i] = el)"
            />
          </q-card-section>
        </q-card>
      </q-item-section>
    </q-item>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-page-scroller
        position="bottom-right"
        :scroll-offset="150"
        :offset="[18, 18]"
      >
        <q-btn fab icon="keyboard_arrow_up" color="accent" />
      </q-page-scroller>
    </q-page-sticky>
  </q-card>
</template>

<script setup lang="ts">
import { useFormatOptionsList } from "@/use/useFormatOptionsList";
import BaseEventLoopCard from "@/components/bits/BaseEventLoopCard.vue";
import {
  ExtendedSignal,
  LoopEventValue,
  LooppingEventsOptions,
} from "@/types/GeneratorSignals";
import { definePage } from "vue-router/auto";

definePage({
  meta: {
    transition: {
      enter: "animated fadeInUpBig",
      leave: "animated fadeOutDownBig",
    },
  },
});

const model = ref({
  pattern: "upDown",
  interval: 1,
  probability: 1,
});

const generatorInfo = ref({
  name: "",
  signalTypes: [] as Array<keyof ExtendedSignal>,
  initalEventCount: 0,
});

type IndexedItem = {
  index: number;
  isMoveUpDisabled: boolean;
  isMoveDownDisabled: boolean;
};

const data = computed(
  () =>
    Object.assign({}, model.value, {
      values: eventList.value as LoopEventValue<ExtendedSignal>[],
    }) as LooppingEventsOptions<ExtendedSignal>
);
const eventList = ref<Array<LoopEventValue<ExtendedSignal> & IndexedItem>>([]);


    const eventLen = computed(() => eventList.value.length);
const firstEvent = computed(() => eventList.value[0]);
const lastEvent = computed(() => eventList.value[eventLen.value - 1]);

const eventCards = ref<Array<Element | ComponentPublicInstance | null>>([]);

watch(
  [eventLen, lastEvent, firstEvent],
  ([length, ..._r]) => {
    eventList.value.forEach((item, i) => {
      if (eventLen.value === 1) {
        item.isMoveUpDisabled = true;
        item.isMoveDownDisabled = true;
      } else if (i === 0) {
        item.isMoveUpDisabled = true;
        item.isMoveDownDisabled = false;
      } else if (i === length - 1) {
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

const eventCardsLen = computed(() => eventCards.value.length);
watch(eventCardsLen, (curLen, prevLen) => {
  const lastCard = eventCards.value.at(-1) as InstanceType<
    typeof BaseEventLoopCard
  > | null;

  if (
    isDefined(prevLen) &&
    curLen > generatorInfo.value.initalEventCount &&
    curLen > prevLen &&
    isDefined(lastCard)
  ) {
    console.log(
      "scroll to last %o, %o",
      eventCards.value.length,
      toRaw(lastCard.index)
    );

    if (isDefined(lastCard.$el)) {
      // console.log("scroll to last ", toRaw(lastCard.elemRef));

      lastCard.$el.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "end",
      });
    }
  }
});

const patternOptions = useFormatOptionsList([
  "up",
  "down",
  "upDown",
  "random",
  "randomWalk",
]);

function defaultSignal() {
  // generatorInfo.value.signalTypes
  // TODO
  return {} as Partial<ExtendedSignal>;
}

function addEvent() {
  const index =
    eventList.value.reduce((acc, i) => (acc < i.index ? i.index : acc), 0) + 1;
  eventList.value.push({
    index,
    isMoveUpDisabled: false,
    isMoveDownDisabled: false,
    rampTime: 10,
    signal: { gain: 1 }, //Object.assign({}, defaultSignal()),
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
