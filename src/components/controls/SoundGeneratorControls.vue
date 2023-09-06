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
    <q-card-actions v-if="hasOptions" align="center" class="bg-blue-grey">
      <q-btn outline padding="xs 3rem" @click="emit('showOptionsDialog')"
        >Options</q-btn
      >
    </q-card-actions>

    <q-separator v-if="hasEvents" class="bg-grey-5" />
    <q-card-actions v-if="hasEvents" class="bg-blue-grey">
      <q-btn
        flat
        dense
        :icon="expandEventSection ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
        label="Show Events"
        @click="toggleExpand()"
      />
    </q-card-actions>

    <q-slide-transition>
      <div v-show="expandEventSection">
        <q-card-section class="bg-blue-grey" dark>
          <q-list dark>
            <q-item-label overline>Event Sequence</q-item-label>
            <q-item v-for="item in eventSequence?.events" dense>
              <q-item-section >
                <q-item-label caption>Time: {{ item.time }}</q-item-label>
              </q-item-section>
              <q-item-section >
                <q-item-label caption>{{ item.signal }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator dark  inset class="q-mb-md q-mt-sm" />
            <q-item-label overline>Event Loop</q-item-label>
            <q-item v-for="item in eventLoop?.values" dense>
             
              <q-item-section >
                <q-item-label caption>{{ item.signal }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </div>
    </q-slide-transition>
  </q-card>
</template>

<script setup lang="ts">
import { GeneratorDefType } from "@/types/GeneratorDef";
import { EventSequence, LooppingEventsOptions } from "@/types/GeneratorSignals";

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
}>();

const muteCtrl = useVModel(props, "muteCtrl", emit);
const { genType, loopEvents, eventSequence } = useVModels(props);

function showVolumeDialog() {
  emit("showVolumeDialog", {
    title: "Foo",
  });
}

const hasEvents = computed(
  () => isDefined(loopEvents) || isDefined(eventSequence)
);
const [expandEventSection, toggleExpand] = useToggle();
</script>
