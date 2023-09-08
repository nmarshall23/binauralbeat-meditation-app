<template>
  <q-card class="q-pb-md bg-brown-9" flat bordered>
    <q-item class="header_container">
      <q-item-section side top>
        <dropdown-btn
          label="Add Field"
          :menu="signalTypesMenu"
          @item-clicked="addField"
        />
      </q-item-section>

      <div class="actionbtn row justify-end q-gutter-md">
        <q-btn
          round
          color="info"
          icon="keyboard_arrow_up"
          @click="() => emit('moveUp', index)"
          :disable="isMoveUpDisabled"
        />
        <q-btn
          round
          color="info"
          icon="keyboard_arrow_down"
          @click="() => emit('moveDown', index)"
          :disable="isMoveDownDisabled"
        />

        <q-btn
          round
          color="warning"
          icon="delete_outline"
          @click="() => emit('removeItem', index)"
          class="q-ml-lg"
        />
      </div>
    </q-item>

    <q-input
      v-if="fields.gain"
      class="q-pa-md"
      label-color="grey-12"
      outlined
      standout="bg-blue-grey-9 text-grey-12"
      dark
      v-model.number="signal.gain"
      label="Gain"
      type="number"
    >
      <template #before>
        <q-btn
          round
          color="warning"
          icon="remove_circle_outline"
          @click="() => removeField('gain')"
        />
      </template>
    </q-input>

    <card-edit-synth-event
      v-if="fields.synth"
      v-model:signal="signal"
      @remove-field="removeField"
    />

    <!-- <card-edit-filter-event
      v-if="fields.filter"
      v-model:wet="filter.wet"
      v-model:frequency="filter.frequency"
      v-model:q="filter.Q"
      v-model:gain="filter.gain"
      @remove-field="removeField"
    /> -->
  </q-card>
</template>

<script setup lang="ts">
import { ExtendedSignal } from "@/types/GeneratorSignals";
import { MenuValueItem } from "@/types/MenuList";
import { match } from "ts-pattern";

const props = defineProps<{
  index: number;
  isMoveUpDisabled: boolean;
  isMoveDownDisabled: boolean;
  signalTypes: Array<keyof ExtendedSignal>;
  signal: ExtendedSignal;
}>();

const emit = defineEmits<{
  (e: "moveUp", i: number): void;
  (e: "moveDown", i: number): void;
  (e: "removeItem", i: number): void;
  (e: "update:signal", v: number): void;
}>();

const { signal, signalTypes } = useVModels(props, emit);

const fields = computed(() => ({
  gain: isDefined(signal.value.gain),
  filter: isDefined(signal.value.filter),
  synth: isDefined(signal.value.synth),
  spinEffect: false,
}));

const signalTypesMenu: MenuValueItem[] = reactive([
  {
    title: "Gain",
    value: "gain",
    disable: computed(() => fields.value.gain),
    hidden: computed(() => !signalTypes.value.includes("gain")),
  },
  {
    title: "Filter",
    value: "filter",
    disable: computed(() => fields.value.filter),
    hidden: computed(() => !signalTypes.value.includes("filter")),
  },
  {
    title: "Synth",
    value: "synth",
    disable: computed(() => fields.value.synth),
    hidden: computed(() => !signalTypes.value.includes("synth")),
  },
  {
    title: "SpinEffect",
    value: "spinEffect",
    disable: computed(() => fields.value.spinEffect),
    hidden: true,
  },
]);

function removeField(f: keyof ExtendedSignal) {
  signal.value[f] = undefined;
}

function addField(f: string) {
  match(f)
    .with("gain", () => {
      signal.value.gain = 1;
    })
    .with("filter", () => {
      signal.value.filter = {
        wet: 1,
        frequency: 200,
        Q: 1,
        gain: 0,
      };
    })
    .with("synth", () => {
      signal.value.synth = {
        baseFreq: 190,
        beatFreq: 6,
      };
    })
    .otherwise(() => {});
}
</script>

<style scoped>
.header_container {
  display: grid;
  grid-template-columns: min-content 1fr 166px;
}

.header_container .actionbtn {
  grid-column: 3 / 4;
}
</style>
