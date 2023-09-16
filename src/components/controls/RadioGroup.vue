<template>
  <div class="q-gutter-sm text-white">
    <q-radio
      v-for="item in filteredMenu"
      v-model="model"
      checked-icon="task_alt"
      :val="item.value"
      :label="item.title"
      :disable="item.disable"
    />
  </div>
</template>

<script setup lang="ts">
import { MenuValueItem } from "@/types/MenuList";

const props = defineProps<{
  modelValue: string;
  menu: MenuValueItem[];
}>();

const emit = defineEmits<{
  (e: "update:model-value", muteCtrl: boolean): void;
}>();

const model = useVModel(props, "modelValue", emit);
const menu = useVModel(props, "menu");

const filteredMenu = useArrayFilter(menu, (i) => !i.hidden ?? false);
</script>
