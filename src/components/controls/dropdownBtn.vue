<template>
  <q-btn-dropdown color="primary" :label="label">
    <q-list>
      <q-item
        v-for="item in filteredMenu"
        clickable
        v-close-popup
        @click="() => emit('itemClicked', item.value)"
        :disable="item.disable"
      >
        <q-item-section>
          <q-item-label>{{ item.title }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
import { MenuValueItem } from "@/types/MenuList";

const props = defineProps<{
  label: string;
  menu: MenuValueItem[];
}>();

const emit = defineEmits<{
  (e: "itemClicked", v: string): void;
}>();

const menu = useVModel(props, 'menu')

const filteredMenu = useArrayFilter(menu, (i) => !i.hidden ?? false)
</script>
