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
          class="q-ml-xl"
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
      v-model.number="model.gain"
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
      v-model:base-freq="model.synth.baseFreq"
      v-model:beat-freq="model.synth.beatFreq"
      @remove-field="removeField"
    />
  </q-card>
</template>

<script setup lang="ts">
import { MenuValueItem } from "@/types/MenuList";

defineProps<{
  index: number;
  isMoveUpDisabled: boolean
  isMoveDownDisabled: boolean
}>();

const emit = defineEmits<{
  (e: "moveUp", i: number): void
  (e: "moveDown", i: number): void
  (e: "removeItem", i: number): void
}>();



const model = ref({
  gain: 1,
  synth: {
    baseFreq: 190,
    beatFreq: 6,
  },
});

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
  grid-template-columns: min-content 2fr 1fr;
}

.header_container .actionbtn {
  grid-column: 3 / 4;
}
</style>
