<template>
  <q-card class="q-pb-md bg-brown-9" flat bordered>
    <q-item class="header_container">
      <q-item-section side top>
        <dropdown-btn
          label="Add Field"
          :menu="items"
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
      class="q-px-md"
      label-color="grey-12"
      outlined
      standout="bg-blue-grey-9 text-grey-12"
      dark
      v-model.number="gain"
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
      v-model:base-freq="synth.baseFreq"
      v-model:beat-freq="synth.beatFreq"
      @remove-field="removeField"
    />

    <card-edit-filter-event
      v-if="fields.filter"
      v-model:wet="filter.wet"
      v-model:frequency="filter.frequency"
      v-model:q="filter.Q"
      v-model:gain="filter.gain"
      @remove-field="removeField"
    />
  </q-card>
</template>

<script setup lang="ts">
import { MenuValueItem } from "@/types/MenuList";

const props = defineProps<{
  index: number;
  isMoveUpDisabled: boolean;
  isMoveDownDisabled: boolean;
  gain: number;
  synth: {
    baseFreq: number;
    beatFreq: number;
  };
  filter: {
    wet: 0 | 1;
    frequency: number;
    Q: number;
    gain: number;
  };
}>();

const emit = defineEmits<{
  (e: "moveUp", i: number): void;
  (e: "moveDown", i: number): void;
  (e: "removeItem", i: number): void;
  (e: "update:gain", v: number): void;
  (e: "update:synth", v: number): void;
  (e: "update:filter", v: number): void;
}>();

const { gain, synth, filter } = useVModels(props, emit);

const fields = ref({
  gain: true,
  filter: false,
  synth: false,
  spinEffect: false,
});

const items: MenuValueItem[] = reactive([
  {
    title: "Gain",
    value: "gain",
    disable: computed(() => fields.value.gain),
  },
  {
    title: "Filter",
    value: "filter",
    disable: computed(() => fields.value.filter),
  },
  {
    title: "Synth",
    value: "synth",
    disable: computed(() => fields.value.synth),
  },
  {
    title: "SpinEffect",
    value: "spinEffect",
    disable: computed(() => fields.value.spinEffect),
  },
]);

type FieldKeys = keyof typeof fields.value;
function removeField(f: FieldKeys) {
  fields.value[f] = false;
}

function addField(f: string) {
  fields.value[f as FieldKeys] = true;
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
