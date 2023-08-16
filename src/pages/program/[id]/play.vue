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
      <div v-show="isPlaying">
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

      <template v-for="g in generators">
       <sound-generator-controls
            :name="g?.generatorName"
            v-model:mute-ctrl="g.muteCtrl"
          /> 
      </template>
    </q-card-section>
  </nm-card>
  <volume-dialog ref="volumeDialogRef"  />
</template>

<script setup lang="ts">
import { useQuasar } from "quasar";
import NmCard from "../../../components/nmCard.vue";
import SoundGeneratorControls from "../../../components/SoundGeneratorControls.vue";
import VolumeDialog from "../../../components/dialogs/volumeDialog.vue";

import { useBinauralBeatPrograms } from "../../../state/bbPrograms";
import { InjectionKey, Ref, computed, provide, ref } from "vue";
import { match } from "ts-pattern";

import { usePlaybackState } from "../../../state/playbackState";
import { useMainChannel } from "../../../state/mainChannel";
import { createBasicNoiseGen } from "../../../tones/gen/createBasicNoiseGen";
import { isDefined } from "@vueuse/core";

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


const myInjectionKey = Symbol('location') as InjectionKey<{ 
  volume: Ref<number>, 
    updateVolume: (value: number) => void }>


function updateVolume(value: number) {
  console.log('updateVol %o', value)
  volumeRef.value =value
}

provide(myInjectionKey, {
  volume: volumeRef,
  updateVolume
})

const volumeDialogRef = ref<InstanceType<typeof VolumeDialog> | null>(null)
async function changeVolume() {
  if(isDefined(volumeDialogRef)) {
    const data = await volumeDialogRef.value.reveal({
      title: "Main Volume",
      volume: volumeRef.value,
      updateVolume,
    })

    console.log('vol %o', volumeRef.value)
  }
 
}

const { currentProgram } = useBinauralBeatPrograms();

const generators = computed(() => {
  const generators = currentProgram.value?.generators ?? [];

  return generators.map((genDef) =>
    match(genDef).with(
      {
        type: "BasicNoiseGen",
      },
      (def) => createBasicNoiseGen("Noise", eventHandler, def.options)

    ).otherwise((def) => {
      console.log('Unkown Generator %o', def)
      return null
    })
  ).filter((i) => isDefined(i))
});
</script>
