<template>
  <q-list dark bordered separator>
    <template v-for="item in menu">
      <q-item clickable v-ripple :to="item" v-if="isMenuListLinkItem(item)">
        <q-item-section>
          <q-item-label>{{ item.title }}</q-item-label>
          <q-item-label caption>{{ item.subtitle }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-expansion-item
        v-if="isMenuListGroupItem(item)"
        :group="item.group"
        expand-icon-toggle
        :content-inset-level="1"
        dense
        :label="item.title"
      >
        <q-item v-for="subItem in item.menu" clickable v-ripple :to="subItem">
          <q-item-section>
            <q-item-label>{{ subItem.title }}</q-item-label>
            <q-item-label caption>{{ subItem.subtitle }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-expansion-item>
    </template>
  </q-list>
</template>

<script setup lang="ts">
import {
  MenuList,
  isMenuListGroupItem,
  isMenuListLinkItem,
} from "@/types/MenuList";

defineProps<{
  menu: MenuList;
}>();
</script>
