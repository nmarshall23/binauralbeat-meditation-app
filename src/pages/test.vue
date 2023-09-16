<template>
  <q-page class="container py-4 inline-grid gap-4">
    <b-card class="md:col-span-2 object-contain">
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
      <div class="p-2 grid gap-3 sm:grid-cols-5 md:grid-cols-7">
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

      <section>
        <section class="flex justify-center">

        <wave-form-vis :is-playing="isPlaying" />
        <FftVis :is-playing="isPlaying"  />
        </section>
        <radio-group v-model="waveFormNodeName" :menu="selectAnalysisMenu" />
        <q-separator />
      </section>
    </b-card>

    <pb-fm-synth-filter
      synth-name=" FM Synth 01"
      v-model:synth-gain="synth01NodeGain"
      v-model:osc-base-type="synth01NodeOscBaseType"
      v-model:osc-source-type="synth01NodeOscSourceType"
      v-model:modulation-index="synth01NodeModulationIndex"
      v-model:harmonicity-factor="synth01NodeHarmonicityFactor"
      v-model:osc-modulation-type="synth01NodeOscModulationType"
      v-model:osc-modulation-index="synth01NodeOscModulationIndex"
      v-model:osc-harmonicity="synth01NodeOscHarmonicity"
      v-model:osc-spread="synth01NodeOscSpread"
      :update-vis-cb="onUpdateSynth01Vis"
    />

    <pb-synth-filter
      synth-name="Synth 02"
      v-model:synth-gain="synth02NodeGain"
      v-model:osc-base-type="synth02NodeOscBaseType"
      v-model:osc-source-type="synth02NodeOscSourceType"
      :update-vis-cb="onUpdateSynth02Vis"
    />

    <!-- <b-card color="#334155">
      <b-card-header color="bg-indigo-500 text-grey-3 text-h6">
        Synth 01
      </b-card-header>
      <section class="pl-2 py-1">
        <div class="text-left text-slate-50 text-caption">Oscillator</div>
      </section>
      <oscillator-vis
        :get-as-array="getOscAsArray"
        :watch="hasUpDated"
        class="self-start bg-blue-grey-10"
      />
      <section class="py-4 px-2">
        <q-btn-toggle
          v-model="synth01NodeOscBaseType"
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
          v-model="synth01NodeOscSourceType"
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
          Synth 01 Gain: {{ synth01NodeGain }}
        </q-badge>
        <q-slider
          dense
          :model-value="synth01NodeGain"
          @change="
            (val) => {
              synth01NodeGain = val;
            }
          "
          v-bind="normalRangeSliderSettings"
          class="px-4"
        />
      </section>

      <q-separator />
      <section class="pl-2 py-1">
        <div class="text-left text-slate-50 text-caption">Modulator</div>
      </section>

      <q-separator />
      <section class="pl-2 py-1">
        <div class="text-left text-slate-50 text-caption">Filter</div>
      </section>
    </b-card> -->

    <!--  <nm-card color="bg-blue-8">
      <template #header>
        <div class="text-h6">Synth Controls</div>
      </template>

      <q-card-section class="py-2">
        <div class="text-subtitle2">Synth Oscillator</div>
      </q-card-section>

      <oscillator-vis
        :get-as-array="synth01OscAsArray"
        :watch="hasUpDated"
        class="self-start bg-blue-grey-10"
      />

      <section class="py-4 px-2">
        <q-btn-toggle
          v-model="synth01NodeOscBaseType"
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
          v-model="synth01NodeOscSourceType"
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
          Synth 01 Gain: {{ synth01NodeGain }}
        </q-badge>
        <q-slider
          dense
          :model-value="synth01NodeGain"
          @change="
            (val) => {
              synth01NodeGain = val;
            }
          "
          v-bind="normalRangeSliderSettings"
          class="px-4"
        />
      </section>

      <section class="py-4 px-2">
        <q-badge color="secondary">
          Synth 02 Gain: {{ synth02NodeGain }}
        </q-badge>
        <q-slider
          dense
          :model-value="synth02NodeGain"
          @change="
            (val) => {
              synth02NodeGain = val;
            }
          "
          v-bind="normalRangeSliderSettings"
          class="px-4"
        />
      </section>

      <section class="py-4 px-2">
        <q-badge color="secondary">
          Synth Detune: {{ synth02DetuneSignal }}
        </q-badge>
        <q-slider
          dense
          :model-value="synth02DetuneSignal"
          @change="
            (val) => {
              synth02DetuneSignal = val;
            }
          "
          v-bind="multiplySliderSettings"
          class="px-4"
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
      </section> -->

    <!--       <section class="py-4 px-2">
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
      </section> -->

    <!--      <section class="py-4 px-2">
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
    </nm-card> -->

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
          Amount LFO {{ filterLFOamountRef * 100 }}%
        </q-badge>
        <q-slider
          dense
          :model-value="filterLFOamountRef"
          @change="
            (val) => {
              filterLFOamountRef = val;
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

import * as Tone from "tone";

import { binauralBeatPatch01 } from "@/tones/patch/binauralBeatPatch01";
import { useComponentSettings } from "@/use/useComponentSettings";
import { match } from "ts-pattern";
import {
  useFormatMenuList,
} from "@/use/useFormatOptionsList";
import { useManageAudioNodeConnection } from "@/use/useManageAudioNodeConnection";

const { volumeRef, mainChannel } = useMainChannel();

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

const {
  normalRangeSliderSettings,
  freqLfoSliderSettings,
  frequencySliderSettings,
  // Select Option
  lfoTypeOptions,
} = useComponentSettings();

// === analysis Connection === //

const waveFormNodeName = ref<string>("mainChannel");
const selectAnalysisMenu = useFormatMenuList(["mainChannel", "synth01Node", "lfoNode", "filterNode"]);
const analyzedNode = computed<Tone.ToneAudioNode | undefined>(() =>
  match(waveFormNodeName.value)
    .with("mainChannel", () => mainChannel)
    .with("synth01Node", () => synth01Node)
    .with("lfoNode", () => lfoNode)
    .with("filterNode", () => filterNode.frequency)
    .otherwise(() => undefined)
);

const analysisChannel = new Tone.Channel()

analysisChannel.send('analysis')

useManageAudioNodeConnection(analyzedNode, analysisChannel)

// === Synth Setup === //

const {
  synth01Node,
  synth02Node,
  lfoNode,
  filterNode,

  triggerAttack,
  triggerRelease,
  synth01NodeOscBaseType,
  synth01NodeOscSourceType,
  synth01NodeGain,
  synth01NodeModulationIndex,
  synth01NodeHarmonicityFactor,

  synth01NodeOscModulationType,
  synth01NodeOscModulationIndex,
  synth01NodeOscHarmonicity,
  synth01NodeOscSpread,

  synth02NodeOscBaseType,
  synth02NodeOscSourceType,
  synth02NodeGain,
  filterNodeSignalWet,
  filterNodeSignalFreq,
  filterLFOamountRef,
  lfoNodeFreq,
  lfoNodeType,

  synth02DetuneSignal,
  synth02DetuneLfoAmount,
  patchDispose,
} = binauralBeatPatch01();

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

noiseSythNode.chain(noiseFilterEffectNode, noiseGainNode);

synth01Node.frequency.connect(noiseFilterEffectNode.frequency);



function onUpdateSynth01Vis() {
  const v = synth01Node.oscillator.asArray();
  console.info("synth01Node.oscillator %o", v);

  return v;
}

function onUpdateSynth02Vis() {
  const v = synth02Node.oscillator.asArray();
  console.info("synth02Node.oscillator %o", v);

  return v;
}

// === Trigger Synth === //

const isPlaying = ref(false);
const needsInit = ref(true);

function onPlay(_note: string) {
  console.log("play");

  triggerRelease();
  noiseSythNode.triggerRelease();
  hasUpDated.value = false;
  isPlaying.value = false;
}

function onMouseDown(note: string) {
  hasUpDated.value = true;
  if (needsInit) {
    Tone.start();
    lfoNode.start();
    needsInit.value = false;
  }

  isPlaying.value = true;
  triggerAttack(note);

  console.log(
    "synth01 freq %o, %o %o osc %o osc spread %o",
    synth01Node.frequency.value,
    synth01Node.harmonicity.value,
    synth01Node.harmonicity.factor.value,
    synth01Node.oscillator.modulationType,
    synth01Node.oscillator.spread,
  
  );
  console.log('filter frequency %o', filterNode.frequency.value)
}

onUnmounted(() => {
  analysisChannel.dispose()
  patchDispose()
})
</script>
