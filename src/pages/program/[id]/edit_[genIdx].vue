<template>
  <q-card dark class="q-dialog-plugin bg-blue-grey text-whit">
    <q-toolbar elevated class="bg-primary text-white justify-between">
      <q-btn @click="save(model)" dense flat icon="close" class="item-start">
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
              v-for="(item, i) in sortedEventList"
              :key="item.itemId"
              :index="item.itemId"
              v-model:signal="item.signal"
              :signal-types="generatorInfo.signalTypes"
              @remove-item="removeCard"
              @move-up="moveCardUp"
              @move-down="moveCardDown"
              :ref="(el) => (eventCards[i] = el as ComponentPublicInstance)"
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
import { definePage } from "vue-router/auto";
import { useCurrentProgramStore } from "@/state/currentProgram";
import { useFormatOptionsList } from "@/use/useFormatOptionsList";
import {
  IndexedItem,
  useOrderableCardControls,
} from "@/use/useOrderableCardControls";
import { ExtendedSignal, LoopEventValue } from "@/types/GeneratorSignals";
import BaseEventLoopCard from "@/components/bits/BaseEventLoopCard.vue";
import { useScollToNewCard } from "@/use/useScollToNewCard";

definePage({
  props: true,
  meta: {
    transition: {
      enter: "animated fadeInUpBig",
      leave: "animated fadeOutDownBig",
    },
  },
});

const props = defineProps<{
  genIdx: number;
}>();

const genIdx = useVModel(props, "genIdx");

const { getGenCtrlFromIndex } = useCurrentProgramStore();

const genCtrl = getGenCtrlFromIndex(genIdx);

const initalEventCount = 2;

console.log("genIdx %o", genIdx.value, genCtrl);

function save(genCtrl: GenGeneratorControls) {}

// === === //

const patternOptions = useFormatOptionsList([
  "up",
  "down",
  "upDown",
  "random",
  "randomWalk",
]);

// === === //

const eventList = ref<Array<LoopEventValue<ExtendedSignal> & IndexedItem>>([]);

const {
  cardsSorted: sortedEventList,
  moveCardDown,
  moveCardUp,
  removeCard,
} = useOrderableCardControls(eventList);

// === === //

// const eventCards = ref<Array<InstanceType<typeof BaseEventLoopCard> | null>>(
//   []
// );

const eventCards = ref<Array<ComponentPublicInstance | null >>([]);

useScollToNewCard(eventCards, initalEventCount);
</script>
