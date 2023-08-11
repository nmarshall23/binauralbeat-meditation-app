<template>
  <q-card
    class="my-card text-white"
    style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)"
  >
    <q-card-section>
      <div class="text-h6">{{ name }}</div>
    </q-card-section>

    <q-card-section> </q-card-section>

    <q-card-actions vertical align="right">
      <q-checkbox
        v-model="muteCtrl"
        label="Mute"
        checked-icon="volume_off"
        unchecked-icon="volume_up"
        color="green"
        keep-color
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { useVModel } from "@vueuse/core";
import { SoundGeneratorControls } from "../tones/Types";

const props = defineProps<{
  name: string;
  // controls: SoundGeneratorControls;
    muteCtrl: boolean
}>();

const emit = defineEmits<{
    (e: 'update:muteCtrl', controls: SoundGeneratorControls): void
}>()

const muteCtrl = useVModel(props, 'muteCtrl', emit)


</script>
