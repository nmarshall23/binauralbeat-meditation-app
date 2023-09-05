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

        <q-toolbar-title>
          {{ title }}
        </q-toolbar-title>

        <q-icon name="equalizer" />
      </q-toolbar>

      <q-list bordered padding dark class="bg-blue-grey-7 rounded-borders">
        <q-item>
          <q-item-section>
            <q-item-label class="text-body1">Filtered Noise Generator</q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-btn color="primary" push>Revert changes</q-btn>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section side>
            <q-btn color="primary" push>Play</q-btn>
          </q-item-section>
          <q-item-section >
            <q-item-label caption>Hear the changes you have made.</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator spaced dark />

        <q-item-label header>Noise Source Settings</q-item-label>

        <q-item class="q-ml-md">
          <q-item-section>
            <q-select
              label-color="grey-12"
              outlined
              standout="bg-blue-grey-9 text-grey-12"
              dark
              v-model="noiseTypeModel"
              :options="noiseTypeOptions"
              label="Noise Type"
            />
          </q-item-section>
        </q-item>

        <q-separator spaced dark />

        <q-item-label header>Filter Settings</q-item-label>

        <q-item class="q-ml-md">
          <q-item-section>
            <q-select
              label-color="grey-12"
              outlined
              standout="bg-blue-grey-9 text-grey-12"
              dark
              v-model="filterTypeModel"
              :options="filterTypeOtions"
              label="Filter Type"
              :hint="fitlerInputsInfo.typeHint"
            />
          </q-item-section>
        </q-item>

        <q-item class="q-ml-md">
          <q-item-section>
            <q-input
              label-color="grey-12"
              outlined
              standout="bg-blue-grey-9 text-grey-12"
              dark
              v-model="filterFreqModel"
              label="Filter Frequency"
              type="number"
              :hint="fitlerInputsInfo.freqHint"
            >
            </q-input>
          </q-item-section>
        </q-item>

        <q-item class="q-ml-md">
          <q-item-section>
            <q-input
              label-color="grey-12"
              outlined
              standout="bg-blue-grey-9 text-grey-12"
              dark
              v-model="filterQModel"
              label="Filter Q"
              type="number"
              :disable="fitlerInputsInfo.q"
              :hint="fitlerInputsInfo.qHint"
            >
            </q-input>
          </q-item-section>
        </q-item>

        <q-item class="q-ml-md">
          <q-item-section>
            <q-input
              label-color="grey-12"
              outlined
              standout="bg-blue-grey-9 text-grey-12"
              dark
              v-model="filterGainModel"
              label="Filter Gain"
              type="number"
              :disable="fitlerInputsInfo.gain"
              :hint="fitlerInputsInfo.gainHint"
            >
            </q-input>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { NoiseType } from "tone";
import { match } from "ts-pattern";

type VolumeDialogRevealData = {
  title: string;
};

const { isRevealed, reveal, onReveal, onConfirm, confirm } =
  useConfirmDialog<VolumeDialogRevealData>();

defineExpose({
  reveal,
});

const title = ref("");
// const volume = ref(10);
// const updateVolume = ref((_v: number) => {});

const filterFreqModel = ref();
const filterQModel = ref();
const filterGainModel = ref();

const noiseTypeModel = ref<NoiseType>("white");
const noiseTypeOptions = ref(["white", "brown", "pink"]);

const filterTypeModel = ref<BiquadFilterType>("lowpass");
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
  match(filterTypeModel.value)
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

onReveal((data) => {
  title.value = data.title;
  // volume.value = data.volume;
  // updateVolume.value = data.updateVolume;
});

onConfirm(() => {
  title.value = "";
});
</script>
