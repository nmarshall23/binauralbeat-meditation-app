<template>
  <q-list dark bordered separator>
    <template v-for="item in menu">
      <q-item clickable v-ripple :to="item" v-if="isMenuListLinkItem(item)">
        <q-item-section>
          <q-item-label top class="text-grey-12">{{ item.title }}</q-item-label>
          <q-item-label caption>{{ item.subtitle }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-expansion-item
        v-if="isMenuListGroupItem(item)"
        :group="item.group"
        :label="item.title"
        :caption="item.subtitle"
        :default-opened="item.open"
      >
        <template v-for="subItem in item.menu">
          <q-separator dark />
          <q-item
            clickable
            v-ripple
            :to="subItem.to"
            class="q-pl-lg bg-grey-10"
          >
            <q-item-section top>
              <q-item-label class="text-grey-12">{{
                subItem.title
              }}</q-item-label>
              <q-item-label caption>{{ subItem.subtitle }}</q-item-label>
            </q-item-section>
            <q-item-section side v-if="subItem.icon">
              <q-icon :name="subItem.icon" />
            </q-item-section>
          </q-item>
        </template>
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
