<template>
  <div class="ChipOtpion">
    <q-chip
      v-for="item in options"
      @click="onChipClicked(item)"
      :selected="chipsValue[item.value]"
      :color="chipsValue[item.value] ? 'primary' : 'grey-10'"
      text-color="white"
      >{{ item.label }}</q-chip
    >
  </div>
</template>

<script setup lang="ts">
export type ChipOption = {
  value: number;
  label: string;
};

const props = defineProps<{
  value: ChipOption;
  options: Array<ChipOption>;
}>();

const emit = defineEmits<{
  (e: "update:value", muteCtrl: boolean): void;
}>();

const model = useVModel(props, "value", emit);

const options = useVModel(props, "options");

const chipsValue = reactive<Record<number, boolean>>({});

onBeforeMount(() => {
  options.value.forEach((item) => {
    chipsValue[item.value] = false;
  });

  if (isDefined(model)) {
    chipsValue[model.value.value] = true;
  }

  console.log("model ", model.value);
});

function onChipClicked(item: ChipOption) {
  chipsValue[item.value] = true;
  chipsValue[model.value.value] = false;
  model.value = item;
}
</script>
