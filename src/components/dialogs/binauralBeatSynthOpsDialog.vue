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
              >Binaural Beat Generator</q-item-label
            >
            <q-item-label caption
              >Under the hood is a Synthesizer, using a oscilling
              waveform.</q-item-label
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

        <q-slide-transition>
          <div v-show="isPlaying">
            <q-separator spaced dark />
            <meter-plot :is-playing="isPlaying" />
            <div class="row">
              <FftVis :is-playing="isPlaying" />
            </div>
          </div>
        </q-slide-transition>

        <q-separator spaced dark />

        <q-item-label header>Binaural Beat Settings</q-item-label>

        <list-item-number-input
          v-model="model.synth.baseFrequency"
          label="Base Frequency"
          class="q-ml-md"
        />

        <list-item-number-input
          v-model="model.synth.beatFrequency"
          label="Beat Frequency"
          class="q-ml-md"
        />

        <q-separator spaced dark />
        <q-item-label header class="q-pb-xs">Synthesizer Settings</q-item-label>

        <q-item>
          <q-item-section class="q-ml-md row"  >
            <oscillator-vis
              :get-as-array="getOscAsArray"
              :watch="isUpdateFinished"
              class="self-start bg-blue-grey-10"
            />
          </q-item-section>
        </q-item>

        <list-item-selection-input
          v-model="model.synth.oscillator.baseType"
          :options="oscillatorBaseTypesOptions"
          label="Base Wave Type"
          class="q-ml-md"
        />

        <list-item-number-input
          v-model="model.synth.oscillator.partialCount"
          label="Partials Count"
          hint="The number of Harmonic Partials"
          class="q-ml-md"
        />

        <list-item-selection-input
          v-model="model.synth.oscillator.sourceType"
          :options="oscillatorSourceTypesOptions"
          label="Source Type"
          :hint="oscSourceTypeSetting.sourceTypeHint"
          class="q-ml-md"
        />

        <q-expansion-item
          v-model="oscSourceTypeSetting.showFatSection"
          group="fat"
          expand-icon-toggle
          :content-inset-level="1"
          dense
          label="FAT Oscillator Settings"
          header-class="q-ml-md text-grey-13"
        >
          <list-item-number-input
            v-model="model.synth.oscillator.sourceOptions.count"
            label="Count"
            hint="The number of detuned oscillators."
          />
          <list-item-number-input
            v-model="model.synth.oscillator.sourceOptions.spread"
            label="Detune Spread"
            hint="The detune spread between the oscillators."
          />
        </q-expansion-item>

        <q-separator dark spaced inset="item" />

        <q-expansion-item
          v-model="oscSourceTypeSetting.showAmSection"
          group="am"
          expand-icon-toggle
          :content-inset-level="1"
          dense
          label="AM Oscillator Settings"
          header-class="q-ml-md text-grey-13"
        >
          <list-item-number-input
            v-model="model.synth.oscillator.sourceOptions.harmonicity"
            label="Harmonicity"
            hint="Harmonicity is the frequency ratio between the carrier and the modulator oscillators."
          />
          <list-item-selection-input
            v-model="model.synth.oscillator.sourceOptions.modulationType"
            :options="oscillatorBaseTypesOptions"
            label="Modulation Type"
            hint="The type of the modulator oscillator."
          />
        </q-expansion-item>

        <q-separator dark spaced inset="item" />

        <q-expansion-item
          v-model="oscSourceTypeSetting.showFmSection"
          group="fm"
          expand-icon-toggle
          :content-inset-level="1"
          dense
          label="FM Oscillator Settings"
          header-class="q-ml-md text-grey-13"
        >
          <list-item-number-input
            v-model="model.synth.oscillator.sourceOptions.harmonicity"
            label="Harmonicity"
            hint="Harmonicity is the frequency ratio between the carrier and the modulator oscillators."
          />
          <list-item-selection-input
            v-model="model.synth.oscillator.sourceOptions.modulationType"
            :options="oscillatorBaseTypesOptions"
            label="Modulation Type"
            hint="The type of the modulator oscillator."
          />
          <list-item-number-input
            v-model="model.synth.oscillator.sourceOptions.modulationIndex"
            label="Modulation Index"
            hint=""
          />
        </q-expansion-item>
      </q-list>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {
  BinauralBeatSynthAdditionalRecords,
  GeneratorCtrlBinauralBeatSynthOptions,
} from "@/types/GeneratorControls";
import { setupGenOpsDialog } from "@/use/setupGenOpsDialog";
import { useFormatOptionsList } from "@/use/useFormatOptionsList";
import { match } from "ts-pattern";

const model = ref<GeneratorCtrlBinauralBeatSynthOptions>({
  synth: {
    baseFrequency: 100,
    beatFrequency: 10,
    oscillator: {
      baseType: "sine",
      sourceType: "oscillator",
      partialCount: 0,
      sourceOptions: {
        count: 3,
        spread: 20,
        modulationType: "square",
        modulationIndex: 2,
        harmonicity: 1,
      },
    },
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
  // additionalRecords
  additionalRecords,
  isUpdateFinished,
} = setupGenOpsDialog<
  GeneratorCtrlBinauralBeatSynthOptions,
  BinauralBeatSynthAdditionalRecords
>(model);

defineExpose({
  reveal,
});

const getOscAsArray = computed(() => {
  if (isDefined(additionalRecords)) {
    return () => additionalRecords.value.sourceGetAsArray();
  }
  return () => Promise.resolve<Float32Array>(new Float32Array());
});

const oscillatorBaseTypesOptions = useFormatOptionsList([
  "sine",
  "sawtooth",
  "square",
  "triangle",
]);
const oscillatorSourceTypesOptions = useFormatOptionsList([
  "oscillator",
  "fat",
  "am",
  "fm",
]);

const oscSourceTypeSetting = computed(() =>
  match(model.value.synth.oscillator.sourceType)
    .with("oscillator", () => {
      return {
        showFatSection: false,
        showAmSection: false,
        showFmSection: false,
        sourceTypeHint: "A simple waveform",
      };
    })
    .with("fat", () => {
      return {
        showFatSection: true,
        showAmSection: false,
        showFmSection: false,
        sourceTypeHint:
          "Multiple oscillators that are detuned from each other to thicken the sound.",
      };
    })
    .with("am", () => {
      return {
        showFatSection: false,
        showAmSection: true,
        showFmSection: false,
        sourceTypeHint:
          "Uses the output of one oscillator to modulate the amplitude of another oscillator",
      };
    })
    .with("fm", () => {
      return {
        showFatSection: false,
        showAmSection: false,
        showFmSection: true,
        sourceTypeHint:
          "Uses the output of one oscillator to modulate the frequency of another oscillator",
      };
    })
    .run()
);
</script>
