<template>
  <q-list dark bordered separator>
    <template v-for="(item, i) in menu">
      <q-item
        v-if="isMenuListLinkItem(item)"
        :key="`im${i}`"
        clickable
        v-ripple
        :to="item"
      >
        <q-item-section>
          <q-item-label top class="text-grey-12">{{ item.title }}</q-item-label>
          <q-item-label caption>{{ item.subtitle }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-expansion-item
        v-if="isMenuListGroupItem(item)"
        :key="`xp${i}`"
        v-model="menuStateModel[i]"
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
              <q-icon :name="subItem.icon" v-bind="subItem.iconProps" />
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

const props = withDefaults(
  defineProps<{
    menu: MenuList;
    menuState: Array<boolean>;
  }>(),
  {
    menuState: () => [],
  }
);

const emit = defineEmits<{
  (e: "update:menuState", value: Array<boolean>): void;
}>();

const menu = useVModel(props, "menu");
const menuState = useVModel(props, "menuState");

const menuStateModel = ref<Array<boolean>>([]);

init();
async function init() {
  menuStateModel.value = Array(menu.value.length).fill(false);

  const i = menuState.value.findIndex((v) => v === true);
  menuStateModel.value[i] = true;
  //console.log('menuStateModel i %o', i)
  await nextTick();

  watch(
    menuStateModel,
    (state) => {
      // console.log("menuStateModel", state);
      emit("update:menuState", state);
    },
    {
      deep: true,
    }
  );
}
</script>
