<template>
  <q-dialog
    v-model="isRevealed"
    ref="dialogRef"
    persistent
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card dark class="q-dialog-plugin bg-grey-9 text-whit">
      <q-toolbar elevated class="bg-primary text-white justify-between">
        <q-btn @click="confirm()" dense flat icon="close" class="item-start">
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>

        <q-toolbar-title> Update Options </q-toolbar-title>

        <q-icon name="equalizer" />
      </q-toolbar>

      <q-list bordered padding dark class="bg-blue-grey-7 rounded-borders">
        <q-item>
          <q-item-section>
            <q-item-label class="text-body1"
              >Filtered Noise Generator</q-item-label
            >
          </q-item-section>
          <q-item-section side top>
            <q-btn
              color="primary"
              push
              no-caps
              icon-right="redo"
              :disabled="!canRedo"
              @click="redo"
              >Redo</q-btn
            >
          </q-item-section>
          <q-item-section side top>
            <q-btn
              color="primary"
              push
              no-caps
              icon-right="undo"
              :disabled="!canUndo"
              @click="undo"
              >Undo</q-btn
            >
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section side>
            <q-btn
              color="primary"
              push
              :label="playBtnLabel"
              :icon="playBtnIcon"
              @click="toggleIsPlaying()"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label caption>Hear the changes you have made.</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator spaced dark v-if="isPlaying" />
        <q-slide-transition>
          <div v-show="isPlaying">
            <meter-plot :is-playing="isPlaying" />
            <div class="row">
              <wave-form-vis :is-playing="isPlaying" />
              <FftVis :is-playing="isPlaying" />
            </div>
          </div>
        </q-slide-transition>

        <q-separator spaced dark />

        <q-item-label header>Noise Source Settings</q-item-label>

        <list-item-selection-input
          class="q-ml-md"
          v-model="model.noise.type"
          :options="noiseTypeOptions"
          label="Noise Type"
        />

        <q-separator spaced dark />

        <q-item class="q-pa-none q-pr-md">
          <q-item-section>
            <q-item-label header>Filter Settings</q-item-label>
          </q-item-section>
          <q-item-section side top>
            <q-toggle
              v-model="model.filter.wet"
              :false-value="0"
              :true-value="1"
              left-label
              label="Enable Filter"
            />
          </q-item-section>
        </q-item>

        <list-item-selection-input
          class="q-ml-md"
          v-model="model.filter.type"
          :options="filterTypeOtions"
          label="Filter Type"
          :hint="fitlerInputsInfo.typeHint"
          :disable="!model.filter.wet"
        />

        <list-item-number-input
          class="q-ml-md"
          v-model="model.filter.frequency"
          label="Filter Frequency"
          :hint="fitlerInputsInfo.freqHint"
          :disable="!model.filter.wet"
        />

        <list-item-number-input
          class="q-ml-md"
          v-model="model.filter.Q"
          label="Filter Q"
          :hint="fitlerInputsInfo.qHint"
          :disable="fitlerInputsInfo.q || !model.filter.wet"
        />

        <list-item-number-input
          class="q-ml-md"
          v-model="model.filter.gain"
          label="Filter Gain"
          :hint="fitlerInputsInfo.gainHint"
          :disable="fitlerInputsInfo.gain || !model.filter.wet"
        />
      </q-list>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { GeneratorCtrlNoiseWithFilterOptions } from "@/types/GeneratorControls";
import { setupGenOpsDialog } from "@/use/setupGenOpsDialog";
import { match } from "ts-pattern";

const model = ref<Required<GeneratorCtrlNoiseWithFilterOptions>>({
  noise: {
    type: "white",
  },
  filter: {
    wet: 1,
    type: "lowpass",
    frequency: 200,
    Q: 1,
    gain: 1,
    // detune: 0
  },
});

const {
  // Dialog
  isRevealed,
  confirm,
  reveal,
  // Playback Btn
  toggleIsPlaying,
  playBtnIcon,
  playBtnLabel,
  isPlaying,
  // History Tracking
  undo,
  redo,
  canUndo,
  canRedo,
} = setupGenOpsDialog<GeneratorCtrlNoiseWithFilterOptions>(model);

defineExpose({
  reveal,
});

const noiseTypeOptions = ref(["white", "brown", "pink"]);

const filterTypeOtions = ref([
  "lowpass",
  "highpass",
  "bandpass",
  "lowshelf",
  "highshelf",
  "notch",
  "allpass",
  "peaking",
]);

const fitlerInputsInfo = computed(() =>
  match(model.value.filter.type)
    .with("lowpass", () => {
      return {
        q: false,
        gain: true,
        qHint: "Indicates how peaked the frequency is around the cutoff.",
        freqHint: "The cutoff frequency.",
        typeHint:
          "Frequencies below the cutoff pass through; frequencies above it are attenuated.",
        gainHint: "Not used in this Filter Type.",
      };
    })
    .with("highpass", () => {
      return {
        q: false,
        gain: true,
        qHint: "Indicates how peaked the frequency is around the cutoff.",
        freqHint: "The cutoff frequency.",
        gainHint: "Not used in this Filter Type.",
        typeHint:
          "Frequencies below the cutoff are attenuated; frequencies above it pass through.",
      };
    })
    .with("bandpass", () => {
      return {
        q: false,
        gain: true,
        qHint:
          "Controls the width of the frequency band. The greater the Q value, the smaller the frequency band.",
        freqHint: "The center of the range of frequencies.",
        typeHint:
          "Frequencies outside the given range of frequencies are attenuated; the frequencies inside it pass through.",
        gainHint: "Not used in this Filter Type.",
      };
    })
    .with("lowshelf", () => {
      return {
        q: true,
        gain: false,
        qHint: "Not used in this Filter Type.",
        gainHint:
          "The boost, in dB, to be applied; if negative, it will be an attenuation.",
        freqHint:
          "The upper limit of the frequencies getting a boost or an attenuation.",
        typeHint:
          "Frequencies lower than the frequency get a boost, or an attenuation; frequencies over it are unchanged.",
      };
    })
    .with("highshelf", () => {
      return {
        q: true,
        gain: false,
        qHint: "Not used in this Filter Type.",
        gainHint:
          "The boost, in dB, to be applied; if negative, it will be an attenuation.",
        freqHint:
          "The lower limit of the frequencies getting a boost or an attenuation.",
        typeHint:
          "Frequencies higher than the frequency get a boost or an attenuation; frequencies lower than it are unchanged.",
      };
    })
    .with("peaking", () => {
      return {
        q: false,
        gain: false,
        gainHint:
          "The boost, in dB, to be applied; if negative, it will be an attenuation.",
        freqHint:
          "The middle of the frequency range getting a boost or an attenuation.",
        qHint:
          "Controls the width of the frequency band. The greater the Q value, the smaller the frequency band.",
        typeHint:
          "Frequencies inside the range get a boost or an attenuation; frequencies outside it are unchanged.",
      };
    })
    .with("notch", () => {
      return {
        q: false,
        gain: true,
        gainHint:
          "Controls the width of the frequency band. The greater the Q value, the smaller the frequency band.",
        freqHint: "The center of the range of frequencies.",
        qHint: "Not used in this Filter Type.",
        typeHint:
          "The opposite of a bandpass filter: frequencies outside the give range of frequencies pass through; frequencies inside it are attenuated.",
      };
    })
    .with("allpass", () => {
      return {
        q: false,
        gain: true,
        gainHint: "Not used in this Filter Type.",
        freqHint:
          "The frequency where the center of the phase transition occurs.",
        qHint:
          "How sharp the transition is at the medium frequency. The larger this parameter is, the sharper and larger the transition will be.",
        typeHint:
          "Lets all frequencies through, but changes the phase-relationship between the various frequencies.",
      };
    })
    .run()
);
</script>
