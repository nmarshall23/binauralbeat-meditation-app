<template>
  <q-page padding class="column q-gutter-sm items-start">
    <nm-card color="bg-secondary">
      <template #header>
        <div class="text-h6">Test Sounds</div>
      </template>

      <q-separator dark />
      <q-card-actions align="center" class="q-pt-md playToggle_section">
        <q-btn
          @click="changeMainVolume()"
          round
          color="secondary"
          icon="tune"
          class="playToggle_section_vol"
        />
      </q-card-actions>
      <q-card-actions class="q-pt-md">
        <q-btn
          v-for="note in notes"
          @click="onPlay(note)"
          class="btn-fixed-width playToggle_section_btn"
          color="green"
          :label="note"
          padding="4px 20px 4px 12px"
          size="1rem"
        />
      </q-card-actions>
    </nm-card>
    <nm-card color="blue">
      <q-card-actions align="center" class="q-pt-md playToggle_section">
        <q-btn
          @click="toggleEffect_A"
          color="secondary"
          :label="`Toggle Wet A: ${bellTone.effectA_Ctrl}`"
        />
      </q-card-actions>
    </nm-card>
    <volume-dialog ref="volumeDialogRef" />
  </q-page>
</template>

<script setup lang="ts">
import VolumeDialog from "@/components/dialogs/volumeDialog.vue";
import { useMainChannel } from "@/state/mainChannel";
import { createTesterGen } from "@/tones/gen/TesterGen";
import * as Tone from "tone";

const { volumeRef } = useMainChannel();

function updateVolume(value: number) {
  console.log("updateVol %o", value);
  volumeRef.value = value;
}
const volumeDialogRef = ref<InstanceType<typeof VolumeDialog> | null>(null);

async function changeMainVolume() {
  showVolumeDialog("Main Volume", volumeRef.value, updateVolume);
}

async function showVolumeDialog(
  title: string,
  volume: number,
  updateVolume: (val: number) => void
) {
  if (isDefined(volumeDialogRef)) {
    await volumeDialogRef.value.reveal({
      title,
      volume,
      updateVolume,
    });

    console.log("vol %o", volumeRef.value);
  }
}

const notes = ref(["F2", "G2", "A3", "B3", "C3", "D3", "F3", "C4", "D4", "C5"]);

const bellTone = createTesterGen("Bell Tone");

function toggleEffect_A() {
  bellTone.effectA_Ctrl = !bellTone.effectA_Ctrl ? 1 : 0;
}

const needsInit = ref(true);

function onPlay(note: string) {
  if (needsInit) {
    Tone.start();
    needsInit.value = false;
  }
  bellTone.trigger(note, 4);
}
</script>
