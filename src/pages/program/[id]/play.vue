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
          :gen-type="g.type"
          v-model:mute-ctrl="g.muteCtrl"
          @show-volume-dialog="
            showVolumeDialog(
              `${g.generatorName} Volume`,
              g.volumeCtrl,
              (n) => (g.volumeCtrl = n)
            )
          "
          :has-options="g.hasOptions"
          :event-sequence="g.eventSequence"
          :event-loop="g.loopEvents"
          @show-options-dialog="showGenOptionsDialog(g)"
        />
      </template>
    </q-card-section>

    <volume-dialog ref="volumeDialogRef" />
    <noise-options-dialog ref="noiseOptionsDialogRef" />
    <binaural-beat-synth-ops-dialog ref="binauralBeatSynthOpsDialogRef" />
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
import * as Tone from "tone";
import VolumeDialog from "@/components/dialogs/volumeDialog.vue";
import { useBinauralBeatPrograms } from "@/state/bbPrograms";
import { useMainChannel } from "@/state/mainChannel";
import { usePlaybackState } from "@/state/playbackState";
import { useProgramDurationStore } from "@/state/programDuration";
import { SoundGenerators } from "@/types/GeneratorDef";
import { setupProgramGenerators } from "@/use/setupProgramGenerators";
import NoiseOptionsDialogVue from "@/components/dialogs/noiseOptionsDialog.vue";
import { GeneratorControls } from "@/types/GeneratorControls";
import { match } from "ts-pattern";
import BinauralBeatSynthOpsDialog from "@/components/dialogs/binauralBeatSynthOpsDialog.vue";
import { setupSoundsSettingsDialogs } from "@/use/setupSoundsSettingsDialogs";

const { currentProgram, initializeProgram } = useBinauralBeatPrograms();

initializeProgram();

const { isPlaying, toggleIsPlaying, eventHandler } = usePlaybackState();

const { remandingDuration, remandingDurationPercentage } =
  useProgramDurationStore();

const playBtnIcon = computed(() => (isPlaying.value ? "pause" : "play_arrow"));
const playBtnLabel = computed(() => (isPlaying.value ? "pause" : "play"));

// Add a Second so label doesn't go negtive
const progressLabel = computed(
  () =>
    `${remandingDuration.value.hours}:${remandingDuration.value.minutes}:${
      remandingDuration.value.seconds + 1
    }`
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

const {
  showGenOptionsDialog,
  noiseOptionsDialogRef,
  binauralBeatSynthOpsDialogRef,
} = setupSoundsSettingsDialogs();

const generators = computed(() => {
  const gs = (currentProgram.value?.generators ?? []) as Array<SoundGenerators>;
  return setupProgramGenerators(gs, eventHandler);
});

onBeforeUnmount(() => {
  generators.value.forEach((i) => i.dispose());
  Tone.Transport.stop("+0.1");
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
@/tones/GeneratorDef
