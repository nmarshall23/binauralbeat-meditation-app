<template>
  <q-item >
    <q-item-section>
      <q-select
        label-color="grey-12"
        outlined
        standout="bg-blue-grey-9 text-grey-12"
        dark
        v-model="model"
        :options="options"
        emit-value
        :label="label"
        :hint="hint"
        :disable="disable"
      />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
  options: { label: string; value: string };
  label: string;
  hint?: string;
  disable?: boolean
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
}>();

const model = useVModel(props, "modelValue", emit);
</script>
