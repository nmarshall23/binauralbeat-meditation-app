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

      <q-card-section class="sg-container">
        <div class="text-subtitle2">Sound Generators</div>

        <template v-for="g in generators">
          <sound-generator-controls
            :name="g.generatorName"
            v-model:mute-ctrl="g.muteCtrl"
          />
        </template>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { usePlaybackState } from "../../state/playbackState";
import { useMainChannel } from "../../state/mainChannel";
import { useNoiseGen } from "../../tones/gen/lpBrownNoiseGen";
import { useBBGen01 } from "../../tones/gen/bbgen01";
import CountDown from "../../components/CountDown.vue";
import SoundGeneratorControls from "../../components/SoundGeneratorControls.vue";
import { Temporal } from "@js-temporal/polyfill";

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

const eventHandler = {
  onPlayBackPaused,
  onPlayBackStarted,
  onPlayBackStopped,
};

const secondsInMins = (minutes: number ) => Temporal.Duration.from({ minutes }).round({ largestUnit: 'second' }).seconds

const generators = ref([
  useNoiseGen("Low Pass Brown Noise", {
    eventHandler,
  }),

  useBBGen01("Binaural Beat 180Hz 4hz ", {
    frequency: 180,
    beatFreq: 4,
    eventHandler,
  }),
  useBBGen01("Binaural Beat 222Hz 6Hz", {
    frequency: 222,
    beatFreq: 6,
    eventHandler,
    patternLoop: {
      humanize: 30,
      interval: secondsInMins(1),
      probability: 1,
      pattern: "upDown",
      values: [
        {
          freq: 255,
          rampTime: secondsInMins(1),
        },
        {
          freq: 190,
          rampTime: secondsInMins(1),
        },
        {
          freq: 240,
          rampTime: secondsInMins(1),
        },
      ],
    },
  }),
]);
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
</style>
