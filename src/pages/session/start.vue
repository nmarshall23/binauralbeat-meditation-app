<template>
  <q-page>
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">Simple Binaural Beat generator</div>
      </q-card-section>

      <q-card-section>
        <count-down :remanding-duration="remandingDuration" />
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          @click="toggleIsPlaying()"
          class="btn-fixed-width"
          color="green"
          :label="playBtnLabel"
          :icon="playBtnIcon"
          padding="0 16px 0 8px"
        />
      </q-card-actions>

      <q-card-actions>
        <q-btn push color="primary" label="Volume">
          <q-popup-proxy>
            <q-card flat class="q-pa-sm q-pb-md q-pl-xl">
              <q-card-actions align="right">
                <q-slider
                  v-model="volumeRef"
                  :min="volumeSliderOptions.minValue"
                  :max="volumeSliderOptions.maxValue"
                  :step="volumeSliderOptions.step"
                  :inner-min="volumeSliderOptions.innerMin"
                  :inner-max="volumeSliderOptions.innerMax"
                  vertical
                  label
                  switch-label-side
                  reverse
                />
              </q-card-actions>
            </q-card>
          </q-popup-proxy>
        </q-btn>
      </q-card-actions>

      <q-card-section>
        <div class="text-subtitle2">Sound Generators</div>
        <sound-generator-controls
          name="Binaural Beat"
          v-model:mute-ctrl="bbgenMuteCtrl"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { usePlaybackState } from "../../state/playbackState";
import { useMainChannel } from "../../state/mainChannel";
import { useNoiseGen } from "../../tones/gen/lpBrownNoiseGen";
import { useBBGen01 } from "../../tones/gen/bbgen01";
import CountDown from "../../components/CountDown.vue";
import SoundGeneratorControls from "../../components/SoundGeneratorControls.vue";

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

const { volumeRef, volumeSliderOptions } = useMainChannel();

const { controls: noiseGenCtrl, muteCtrl: noiseGenMuteCtrl } = useNoiseGen();
const { controls: bbgenCtrl, muteCtrl: bbgenMuteCtrl } = useBBGen01();

onPlayBackStopped(() => {
  noiseGenCtrl.stop();
  bbgenCtrl.stop();
});

onPlayBackPaused(() => {
  noiseGenCtrl.pause();
  bbgenCtrl.pause();
});

onPlayBackStarted(() => {
  noiseGenCtrl.start();
  bbgenCtrl.start();
});
</script>
