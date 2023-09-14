<template>
  <q-page class="container py-4 grid">
    <b-card>
      <b-card-header color="bg-secondary text-grey-3 text-h6">
        Test Sounds
      </b-card-header>

      <div class="p-4">
        <q-btn
          @click="changeMainVolume()"
          round
          color="secondary"
          icon="tune"
          class="playToggle_section_vol"
        />
      </div>
      <q-separator dark />
      <div class="p-2 grid gap-3 sm:grid-cols-5 md:grid-cols-7 ">
        <q-btn
          v-for="note in notesScale"
          @click="onPlay(note)"
          @mousedown="onMouseDown(note)"
          class="btn-fixed-width playToggle_section_btn"
          color="green"
          :label="note"
          padding="4px 20px 4px 12px"
          size="1rem"
        />
      </div>

    </b-card>

    <nm-card color="bg-secondary" style="width: 428px">
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
      <grid-container :cols="7" class="mx-4 my-3 gap-4">
        <q-btn
          v-for="note in notesScale"
          @click="onPlay(note)"
          @mousedown="onMouseDown(note)"
          class="btn-fixed-width playToggle_section_btn"
          color="green"
          :label="note"
          padding="4px 20px 4px 12px"
          size="1rem"
        />
      </grid-container>
    </nm-card>
    <nm-card color="bg-blue-8">
      <template #header>
        <div class="text-h6">Synth Controls</div>
      </template>

      <q-card-section class="py-2">
        <div class="text-subtitle2">Synth Oscillator</div>
      </q-card-section>

      <oscillator-vis
        :get-as-array="getOscAsArray"
        :watch="hasUpDated"
        class="self-start bg-blue-grey-10"
      />

      <section class="py-4 px-2">
        <q-btn-toggle
          v-model="synthNodeOscBaseType"
          no-caps
          rounded
          unelevated
          toggle-color="accent"
          color="white"
          text-color="primary"
          :options="oscTypeOptions"
        />
      </section>

      <section class="py-4 px-2">
        <q-btn-toggle
          v-model="synthNodeOscSourceType"
          no-caps
          rounded
          unelevated
          toggle-color="accent"
          color="white"
          text-color="primary"
          :options="oscSourceTypeOptions"
        />
      </section>

      <section class="py-4 px-2">
        <q-badge color="secondary">
          Partial Count: {{ synthNodeOscPartialCount }}
        </q-badge>
        <q-slider
          dense
          :model-value="synthNodeOscPartialCount"
          @change="
            (val) => {
              synthNodeOscPartialCount = val;
            }
          "
          v-bind="partialCountSliderSettings"
          class="px-4"
        />
      </section>

      <q-separator />
      <q-card-section class="py-2">
        <div class="text-subtitle2">Synth Modulator</div>
      </q-card-section>

      <section class="py-4 px-2">
        <q-btn-toggle
          v-model="synthNodeModulationBaseType"
          no-caps
          rounded
          unelevated
          toggle-color="accent"
          color="white"
          text-color="primary"
          :options="oscTypeOptions"
        />
      </section>

      <section class="py-4 px-2">
        <q-badge color="secondary">
          Modulation Index: {{ synthNodeSignalModulationIndex }}
        </q-badge>
        <q-slider
          dense
          :model-value="synthNodeSignalModulationIndex"
          @change="
            (val) => {
              synthNodeSignalModulationIndex = val;
            }
          "
          v-bind="multiplySliderSettings"
          class="px-4"
        />
      </section>
    </nm-card>

    <nm-card color="bg-blue-8">
      <template #header>
        <div class="text-h6">Filter Controls</div>
      </template>

      <section class="py-4 px-2">
        <q-badge color="secondary"> Wet: {{ filterNodeSignalWet }} </q-badge>
        <q-slider
          dense
          :model-value="filterNodeSignalWet"
          @change="
            (val) => {
              filterNodeSignalWet = val;
            }
          "
          v-bind="normalRangeSliderSettings"
          class="px-4"
        />
      </section>

      <q-separator />
      <section class="py-4 px-2">
        <q-badge color="secondary">
          Frequency: {{ filterNodeSignalFreq }} Hz
        </q-badge>
        <q-slider
          dense
          :model-value="filterNodeSignalFreq"
          @change="
            (val) => {
              filterNodeSignalFreq = val;
            }
          "
          v-bind="frequencySliderSettings"
          class="px-4"
        />
      </section>

      <section class="py-4 px-2">
        <q-badge color="secondary">
          Amount LFO {{ filterLFOamountSignal * 100 }}%
        </q-badge>
        <q-slider
          dense
          :model-value="filterLFOamountSignal"
          @change="
            (val) => {
              filterLFOamountSignal = val;
            }
          "
          v-bind="normalRangeSliderSettings"
          class="px-4"
        />
      </section>
    </nm-card>
    <nm-card color="bg-blue-8">
      <template #header>
        <div class="text-h6">LFO Controls</div>
      </template>
      <section class="py-4 px-2">
        <q-btn-toggle
          v-model="lfoNodeType"
          no-caps
          rounded
          unelevated
          toggle-color="accent"
          color="white"
          text-color="primary"
          :options="lfoTypeOptions"
        />
      </section>

      <q-separator />
      <section class="py-4 px-2">
        <q-badge color="secondary">
          Frequency: {{ lfoNodeFreq.toFixed(1) }} Hz
        </q-badge>
        <q-slider
          dense
          :model-value="lfoNodeFreq"
          @change="
            (val) => {
              lfoNodeFreq = val;
            }
          "
          v-bind="freqLfoSliderSettings"
          class="px-4"
        />
      </section>
    </nm-card>

    <volume-dialog ref="volumeDialogRef" />
  </q-page>
</template>

<script setup lang="ts">
import VolumeDialog from "@/components/dialogs/volumeDialog.vue";
import { useMainChannel } from "@/state/mainChannel";
import { FilterEffect } from "@/tones/effect/filterEffect";
import {
  useTrackToneNode,
  useTrackToneNodeSignal,
} from "@/use/useTrackToneNode";
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

const notes = ref(["C", "D", "E", "F", "G", "A", "B"]);
const octives = ref([2, 3, 4]);

const notesScale = computed(() =>
  octives.value.flatMap((o) => notes.value.map((n) => `${n}${o}`))
);

const hasUpDated = ref(false);

onUpdated(async () => {
  hasUpDated.value = true;
  await nextTick();
  hasUpDated.value = false;
  console.debug("onUpdated");
});

// === Slider Setup === //

const partialCountSliderSettings = {
  min: 0,
  //innerMin: 1,
  max: 5,
  step: 1,
  snap: true,
  label: true,
  markers: true,
  markerLabels: true,
};

const multiplySliderSettings = {
  min: 1,
  //innerMin: 1,
  max: 20,
  step: 1,
  snap: true,
  label: true,
  markers: 20,
  markerLabels: true,
};

const normalRangeSliderSettings = {
  min: 0,
  max: 1,
  step: 0.1,
  snap: true,
  label: true,
  markers: 0.5,
  markerLabels: (v: number) => v.toFixed(1),
};

const frequencySliderSettings = {
  min: 20,
  max: 2000,
  step: 100,
  snap: true,
  label: true,
  markers: 500,
  markerLabels: [
    { value: 20, label: "20 Hz" },
    { value: 500, label: "500 Hz" },
    { value: 1000, label: "1KHz" },
    { value: 1500, label: "1.5KHz" },
    { value: 2000, label: "2KHz" },
  ],
};

const freqLfoSliderSettings = {
  min: 0.1,
  max: 10,
  step: 0.1,
  snap: true,
  label: true,
  markers: 10,
  markerLabels: (v: number) => v.toFixed(1),
};

const lfoTypeOptions = [
  { label: "Sine", value: "sine" },
  { label: "Triangle", value: "triangle" },
  { label: "Square", value: "square" },
];

const oscTypeOptions = [
  { label: "Sine", value: "sine" },
  { label: "SawTooth", value: "sawtooth" },
  { label: "Triangle", value: "triangle" },
  { label: "Square", value: "square" },
];

const oscSourceTypeOptions = [
  { label: "Oscillator", value: "oscillator" },
  { label: "AM", value: "am" },
  { label: "FM", value: "fm" },
  { label: "Fat", value: "fat" },
];

// === Synth Setup === //

const channel = new Tone.Channel();
const gain01Node = new Tone.Gain(0.5);
const gain02Node = new Tone.Gain(0.5);

const synthNode = new Tone.FMSynth({
  oscillator: {
    type: "sawtooth",
  },
});

const synth02Node = new Tone.Synth({
  oscillator: {
    type: "sine",
  },
});

const filterNode = new FilterEffect({
  filter: {
    type: "lowpass",
    frequency: 400,
  },
});

const lfoNode = new Tone.LFO({
  min: -0.5,
  max: 0.5,
});

synthNode.chain(gain01Node, filterNode, channel);
synth02Node.chain(gain02Node, channel);

channel.send("main");

const filterLfoAmount = new Tone.CrossFade(1);
const filterLfoFac = new Tone.Multiply();

const filterFrequencySignal = new Tone.Signal({
  value: "400",
  units: "frequency",
});

lfoNode.chain(filterLfoFac.factor);
filterFrequencySignal.chain(filterLfoFac, filterLfoAmount.b);
filterFrequencySignal.chain(filterLfoAmount.a);
filterLfoAmount.connect(filterNode.frequency);

// === === //

const noiseGainNode = new Tone.Gain(2);

const noiseFilterEffectNode = new FilterEffect({
  filter: {
    type: "lowpass",
  },
});

const noiseSythNode = new Tone.NoiseSynth({
  envelope: {
    attack: 0.2,
    decay: 0,
    sustain: 1,
    release: 3,
  },
  noise: {
    type: "brown",
  },
});

noiseSythNode.chain(noiseFilterEffectNode, noiseGainNode, channel);

synthNode.frequency.connect(noiseFilterEffectNode.frequency)

// synthNodeHarmonicityFactorSignal.connect(synthNode.harmonicity.factor)

// filterFreqFollowsSythFreqAmount.fade.connect(filterFreqFollowsSythFreqFac.factor)
// synthNode.frequency.chain(filterFreqFollowsSythFreqAmount.b )

// // synthNode.frequency.chain(filterFreqFollowsSythFreqFac, filterFreqFollowsSythFreqAmount.b)
// // filterFrequencySignal.chain(filterFreqFollowsSythFreqAmount.a);

//  filterFreqFollowsSythFreqAmount.connect(filterNode.frequency)

// === Synth Refs === //

const synthNodeOscBaseType = useTrackToneNode(
  synthNode.oscillator,
  "baseType",
  "sine"
);

const synthNodeOscSourceType = useTrackToneNode(
  synthNode.oscillator,
  "sourceType",
  "oscillator"
);

const synthNodeOscPartialCount = useTrackToneNode(
  synthNode.oscillator,
  "partialCount",
  1
);

// const synthNodeHarmonicityFactor = useTrackToneNodeSignal(
//   synthNodeHarmonicityFactorSignal
// );

const synthNodeModulationBaseType = useTrackToneNode(
  synthNode.modulation,
  "baseType",
  "sine"
);

const synthNodeSignalModulationIndex = useTrackToneNodeSignal(
  synthNode.modulationIndex
);

const getOscAsArray = computed(() => {
  if (isDefined(synthNode.oscillator)) {
    return () => synthNode.oscillator.asArray();
  }
  return () => Promise.resolve<Float32Array>(new Float32Array());
});

const filterNodeSignalWet = useTrackToneNodeSignal(filterNode.wet);

const filterNodeSignalFreq = useTrackToneNodeSignal(
  filterFrequencySignal,
  0.1,
  (n: number) => filterNode.toFrequency(n),
  (n) => filterNode.toFrequency(n)
);

const lfoNodeType = useTrackToneNode(lfoNode, "type", "sine");

const lfoNodeFreq = useTrackToneNodeSignal(
  lfoNode.frequency,
  0.1,
  (n: number) => filterNode.toFrequency(n),
  (n) => filterNode.toFrequency(n)
);

const filterLFOamountSignal = useTrackToneNodeSignal(filterLfoAmount.fade);

// === Trigger Synth === //

const needsInit = ref(true);

function onPlay(_note: string) {
  console.log("play");

  synthNode.triggerRelease();
  synth02Node.triggerRelease();
  noiseSythNode.triggerRelease();
  hasUpDated.value = false;
}

function onMouseDown(note: string) {
  hasUpDated.value = true;
  if (needsInit) {
    Tone.start();
    lfoNode.start();
    needsInit.value = false;
  }

  console.log("onMouseDown");

  synthNode.triggerAttack(note);
  synth02Node.triggerAttack(note);
  noiseSythNode.triggerAttack();

  console.log(
    "synthNode oscillator.baseType %o frequency %o, harmonicity %o modulationIndex %o",
    synthNode.oscillator.baseType,
    synthNode.frequency.value,
    synthNode.harmonicity.factor.value,
    synthNode.modulationIndex.value
  );

  console.log(
    "FilterNode frequency %o, Q %o",
    filterNode.frequency.value,
    filterNode.Q.value
  );
}
</script>
