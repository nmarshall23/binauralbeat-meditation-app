<template>
  <q-card class="my-card bg-secondary text-white">
    <q-card-section>
      <div class="text-h6">Binaural Beat Session</div>
    </q-card-section>

    <q-card-actions align="center">
      <q-stepper
        v-model="sessionSetupStep"
        ref="sessionStepper"
        color="primary"
        animated
      >
        <q-step
          :name="1"
          title="Select Sesson End Time"
          icon="settings"
          :done="sessionSetup.hasSessionEndTime"
        >
          <q-time 
            v-model="sessionSetupData.sessionEndTime" 
            flat
            dark
            format24h
            />
        </q-step>

        <q-step
          :name="2"
          title="Start Session"
          icon="settings"
          :done="sessionSetup.hasSessionEndTime"
        >
          
        </q-step>


        <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn @click="sessionStepper?.next()" color="primary" :label="sessionSetupStep === 4 ? 'Finish' : 'Continue'" />
          <q-btn v-if="sessionSetupStep > 1" flat color="primary" @click="sessionStepper?.previous()" label="Back" class="q-ml-sm" />
        </q-stepper-navigation>
      </template>
      </q-stepper>
    </q-card-actions>

    <q-card-actions align="center">
      <q-btn
        push
        :loading="progress.loading"
        :percentage="progress.percentage"
        color="primary"
        @click="startSession()"
        style="width: 150px"
      >
        Start Session
        <template v-slot:loading> Playing.. </template>
      </q-btn>

      <q-btn
        push
        :disable="!progress.loading"
        color="negative"
        @click="stopSession()"
        label="End Session"
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

    <q-separator />

    <q-card-actions vertical align="left">
      <q-toggle
        v-model="option1"
        checked-icon="check"
        color="red"
        label="Background Noise"
        unchecked-icon="clear"
      />

      <q-toggle
        v-model="option2"
        checked-icon="check"
        color="red"
        label="Chorius Fruit"
        unchecked-icon="clear"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import * as Tone from "tone";
import { useMainChannel } from "../state/mainChannel";
import { setUpBgNoiseTrack } from "../tones/tracks/BgNoiseTrack";
import { useBBGen01 } from "../tones/gen/bbgen01";
import { isDefined } from "@vueuse/core";
import { QStepper } from "quasar";

const option1 = ref(true);
const option2 = ref(true);
const progress = ref({ loading: false, percentage: 0 });

const sessionStepper = ref<QStepper | null >(null)
const sessionSetupStep = ref(1);
const sessionSetupData = ref({
  sessionEndTime: null,
});
const sessionSetup = computed(() => {
  return {
    hasSessionEndTime: isDefined(sessionSetupData.value.sessionEndTime),
  };
});

var intervalId: undefined | number = undefined;

const noiseTrack = setUpBgNoiseTrack();

const bbGen = useBBGen01();

async function startSession() {
  progress.value.loading = true;
  progress.value.percentage = 0;
  await Tone.start();
  Tone.Transport.start();

  noiseTrack.start(0);
  // noiseTrack.setup()
  // bbGen.start()
}

async function stopSession() {
  progress.value.loading = false;

  noiseTrack.stop();
  bbGen.stop();
}

function startComputing() {
  progress.value.loading = true;
  progress.value.percentage = 0;

  intervalId = setInterval(() => {
    progress.value.percentage += Math.floor(Math.random() * 8 + 10);
    if (progress.value.percentage >= 100) {
      clearInterval(intervalId);
      progress.value.loading = false;
    }
  }, 700);
}

const { volumeRef, volumeSliderOptions } = useMainChannel();


</script>
