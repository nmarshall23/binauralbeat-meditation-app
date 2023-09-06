<template>
  <q-item>
    <q-item-section>
      <q-input
        label-color="grey-12"
        outlined
        standout="bg-blue-grey-9 text-grey-12"
        dark
        v-model.number="model"
        :label="label"
        type="number"
        :hint="hint"
        :disable="disable"
      >
      </q-input>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: number;
  label: string;
  hint?: string | undefined;
  disable?: boolean
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
}>();

const model = useVModel(props, "modelValue", emit);
</script>
