<template>
  <q-card
    class="my-card text-white"
    style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)"
  >
    <q-card-section class="q-pb-none">
      <div class="text-h6 text-left">{{ name }}</div>
    </q-card-section>

    <q-card-actions align="right" class="q-py-none">
      <q-checkbox
        v-model="muteCtrl"
        label="Mute"
        checked-icon="volume_off"
        unchecked-icon="volume_up"
        keep-color
        left-label
        color="red"
      />
      <q-btn flat @click="showVolumeDialog">Volume</q-btn>
    </q-card-actions>
    <q-separator v-if="hasOptions" />
    <q-card-actions v-if="hasOptions" align="center" class="bg-primary">
      <q-btn outline padding="xs 3rem" @click="emit('showOptionsDialog')">Options</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { GeneratorDefType } from "@/types/GeneratorDef";

const props = defineProps<{
  name: string;
  muteCtrl: boolean;
  type: GeneratorDefType;
  hasOptions: boolean;
}>();

const emit = defineEmits<{
  (e: "update:muteCtrl", muteCtrl: boolean): void;
  (
    e: "showVolumeDialog",
    options: {
      title: string;
    }
  ): void;
  (e: "showOptionsDialog"): void;
}>();

const muteCtrl = useVModel(props, "muteCtrl", emit);

function showVolumeDialog() {
  emit("showVolumeDialog", {
    title: "Foo",
  });
}
</script>
