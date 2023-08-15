<template>
  <nm-card color="bg-purple">
    <template #header>
      <div class="text-h6">{{ currentProgram?.title }}</div>
    </template>

    <!-- <q-list dark bordered separator>
        <q-item
          clickable
          v-ripple
          v-for="gen in currentProgram?.generators"
          
        >
          <q-item-section>
            <q-item-label>{{ gen.type }}</q-item-label>
            
          </q-item-section>
        </q-item>
      </q-list> -->

    <q-card-actions align="center" class="q-pt-md">
      <q-btn
        @click="toggleIsPlaying()"
        class="btn-fixed-width"
        color="green"
        :label="playBtnLabel"
        :icon="playBtnIcon"
        padding="4px 20px 4px 12px"
        size="1rem"
      />

      <q-btn @click="changeVolume()" round color="secondary" icon="tune" />
    </q-card-actions>

    <q-slide-transition>
        <div v-show="expanded">
            <q-separator dark />
    <q-linear-progress size="25px" :value="progressBar" color="accent">
      <div class="absolute-full flex flex-center">
        <q-badge color="white" text-color="accent" :label="progressLabel" />
      </div>
    </q-linear-progress>
        </div>
      </q-slide-transition>

   


    <q-separator dark />

    <q-card-section class="sg-container">
      <div class="text-subtitle2">Sound Generators</div>

      <template v-for="g in currentProgram?.generators">
        <!-- <sound-generator-controls
            :name="g.type"
            v-model:mute-ctrl="g.muteCtrl"
          /> -->
      </template>
    </q-card-section>
  </nm-card>
</template>

<script setup lang="ts">
import { useQuasar } from "quasar";
import NmCard from "../../../components/nmCard.vue";
import VolumeDialog from "../../../components/dialogs/volumeDialog.vue";

import { useBinauralBeatPrograms } from "../../../state/bbPrograms";
import { computed, ref } from "vue";
import { match } from "ts-pattern";

import { usePlaybackState } from "../../../state/playbackState";
import { useMainChannel } from "../../../state/mainChannel";
import { createBasicNoiseGen } from "../../../tones/gen/createBasicNoiseGen";

const $q = useQuasar();

const {
  isPlaying,
  toggleIsPlaying,
  resetInit,
  onPlayBackPaused,
  onPlayBackStarted,
  onPlayBackStopped,
  remandingDuration,
} = usePlaybackState();

const playBtnIcon = computed(() => (isPlaying.value ? "pause" : "play_arrow"));
const playBtnLabel = computed(() => (isPlaying.value ? "pause" : "play"));

resetInit();

const progressBar = ref(0.3);
const progressLabel = computed(
  () => `${remandingDuration.value.hours}:${remandingDuration.value.minutes}:${remandingDuration.value.seconds}`
);

const expanded = ref(true)

const { volumeRef, volumeSliderOptions } = useMainChannel();

const eventHandler = {
  onPlayBackPaused,
  onPlayBackStarted,
  onPlayBackStopped,
};

function changeVolume() {
  $q.dialog({
    component: VolumeDialog,
    position: "bottom",
    componentProps: {
      title: "Main Volume",
    },
  }).onOk(() => {
    console.log("OK");
  });
}

const { currentProgram } = useBinauralBeatPrograms();

const generators = computed(() => {
  const generators = currentProgram.value?.generators ?? [];
  return generators.map((genDef) =>
    match(genDef).with(
      {
        type: "BasicNoiseGen",
      },
      (def) => {
        createBasicNoiseGen("Noise", eventHandler, def.options);
      }
    )
  );
});
</script>
