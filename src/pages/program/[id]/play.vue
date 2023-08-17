<template>
  <nm-card color="bg-purple">
    <template #header>
      <div class="text-h6">{{ currentProgram?.title }}</div>
    </template>

    <q-card-actions align="center" class="q-pt-md playToggle_section">
      <q-btn
        @click="toggleIsPlaying()"
        class="btn-fixed-width playToggle_section_btn"
        color="green"
        :label="playBtnLabel"
        :icon="playBtnIcon"
        padding="4px 20px 4px 12px"
        size="1rem"
      />

      <q-btn
        @click="changeMainVolume()"
        round
        color="secondary"
        icon="tune"
        class="playToggle_section_vol"
      />
    </q-card-actions>

    <q-slide-transition>
      <div v-show="isPlaying">
        <q-separator dark />
        <q-linear-progress
          size="25px"
          :value="remandingDurationPercentage"
          color="accent"
        >
          <div class="absolute-full flex flex-center">
            <q-badge color="white" text-color="accent" :label="progressLabel" />
          </div>
        </q-linear-progress>
      </div>
    </q-slide-transition>

    <q-separator dark />

    <q-card-section class="sg-container">
      <div class="text-subtitle2">Sound Generators</div>

      <template v-for="g in generators">
        <sound-generator-controls
          :name="g.generatorName"
          v-model:mute-ctrl="g.muteCtrl"
          @show-volume-dialog="
            showVolumeDialog(
              `${g.generatorName} Volume`,
              g.volumeCtrl,
              (n) => (g.volumeCtrl = n)
            )
          "
        />
      </template>
    </q-card-section>

    <volume-dialog ref="volumeDialogRef" />
  </nm-card>

  <!-- <nm-card color="bg-purple">
    <template #header>
      <div class="text-h6">Meters</div>
    </template>

    <q-card-section>
      <meter-vis />
    </q-card-section>
  </nm-card> -->
</template>

<script setup lang="ts">
import NmCard from "../../../components/nmCard.vue";
import SoundGeneratorControls from "../../../components/SoundGeneratorControls.vue";
import VolumeDialog from "../../../components/dialogs/volumeDialog.vue";

import { useBinauralBeatPrograms } from "../../../state/bbPrograms";
import { computed, onBeforeUnmount, ref } from "vue";

import { usePlaybackState } from "../../../state/playbackState";
import { useMainChannel } from "../../../state/mainChannel";
import { isDefined } from "@vueuse/core";

// import MeterVis from "../../../components/MeterVis.vue";
import { SoundGenerators } from "../../../tones/SoundGenerators";
import { setupProgramGenerators } from "../../../use/setupProgramGenerators";
import { useProgramDurationStore } from "../../../state/programDuration";

const { isPlaying, toggleIsPlaying, resetInit, eventHandler } =
  usePlaybackState();

const { remandingDuration, remandingDurationPercentage } =
  useProgramDurationStore();

const playBtnIcon = computed(() => (isPlaying.value ? "pause" : "play_arrow"));
const playBtnLabel = computed(() => (isPlaying.value ? "pause" : "play"));

resetInit();

const progressLabel = computed(
  () =>
    `${remandingDuration.value.hours}:${remandingDuration.value.minutes}:${remandingDuration.value.seconds}`
);

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

const { currentProgram } = useBinauralBeatPrograms();

const generators = computed(() => {
  const gs = (currentProgram.value?.generators ?? []) as Array<SoundGenerators>;
  return setupProgramGenerators(gs, eventHandler);
});

onBeforeUnmount(() => {
  generators.value.forEach((i) => i.dispose());
});
</script>

<style scoped lang="scss">
@use "sass:map";
@use "quasar/src/css/variables" as q;

.sg-container {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: min-content 1fr;
  row-gap: map.get(q.$space-md, "y");
}

.playToggle_section {
  display: grid;
  grid-template-columns: 1fr 140px 1fr;
}

.playToggle_section_btn {
  grid-column: 2 / 3;
}

.playToggle_section_vol {
  grid-column: 3 / 4;
  justify-self: right;
}
</style>
