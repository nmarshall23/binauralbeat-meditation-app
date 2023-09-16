<template>
  <b-card color="#334155">
    <b-card-header color="bg-indigo-500 text-grey-3 text-h6">
      {{ synthName }}
    </b-card-header>
    <b-card-section>
      <template #caption>Gain: {{ synthGain * 100 }}% </template>
      <q-slider
        dense
        :model-value="synthGain"
        @change="
          (val) => {
            synthGain = val;
          }
        "
        v-bind="gainSliderSettings"
        class="px-4"
      />
    </b-card-section>
    <oscillator-vis
      class="self-start bg-blue-grey-10"
      :watch="hasUpdated"
      :update-vis-cb="updateVisCb"
    />

    <b-card-section>
      <template #caption>Oscillator Base Type</template>
      <q-btn-toggle
        v-model="oscBaseType"
        no-caps
        rounded
        unelevated
        toggle-color="accent"
        color="white"
        text-color="primary"
        :options="oscTypeOptions"
      />
    </b-card-section>

    <b-card-section>
      <template #caption>Oscillator Source Type</template>
      <q-btn-toggle
        v-model="oscSourceType"
        no-caps
        rounded
        unelevated
        toggle-color="accent"
        color="white"
        text-color="primary"
        :options="oscSourceTypeOptions"
      />
    </b-card-section>

    <b-card-section>
      <template #caption>Source Type Options</template>
      <b-card-section v-if="sourceTypeSectionOptions.modType">
        <template #caption>{{
          sourceTypeSectionOptions.modTypeLabel
        }}</template>
        <q-btn-toggle
          v-model="oscModulationType"
          no-caps
          rounded
          unelevated
          toggle-color="accent"
          color="white"
          text-color="primary"
          :options="oscTypeOptions"
        />
      </b-card-section>

      <b-card-section v-if="sourceTypeSectionOptions.modIndex">
        <template #caption>
          FM Modulation Index: {{ oscModulationIndex }}
        </template>
        <q-slider
          dense
          :model-value="oscModulationIndex"
          @change="
            (val) => {
              oscModulationIndex = val;
            }
          "
          v-bind="multiplyLowSliderSettings"
          class="px-4"
        />
      </b-card-section>

      <b-card-section v-if="sourceTypeSectionOptions.harmonicity">
        <template #caption>
          {{ sourceTypeSectionOptions.harmonicityLabel }}: {{ oscHarmonicity }}
        </template>
        <q-slider
          dense
          :model-value="oscHarmonicity"
          @change="
            (val) => {
              oscHarmonicity = val;
            }
          "
          v-bind="multiplyLowSliderSettings"
          class="px-4"
        />
      </b-card-section>

      <b-card-section v-if="sourceTypeSectionOptions.spread">
        <template #caption>Fat Oscillator Spread: {{ oscSpread }} </template>
        <q-slider
          dense
          :model-value="oscSpread"
          @change="
            (val) => {
              oscSpread = val;
            }
          "
          v-bind="multiplySliderSettings"
          class="px-4"
        />
      </b-card-section>
    </b-card-section>

    <q-separator />
    <section class="pl-2 py-1">
      <div class="text-left text-slate-50 text-caption">Modulator</div>
    </section>
    <b-card-section>
      <template #caption>Modulation Index: {{ modulationIndex }} </template>
      <q-slider
        dense
        :model-value="modulationIndex"
        @change="
          (val) => {
            modulationIndex = val;
          }
        "
        v-bind="multiplySliderSettings"
        class="px-4"
      />
    </b-card-section>

    <b-card-section>
      <template #caption>Harmonicity Factor: {{ harmonicityFactor }} </template>
      <q-slider
        dense
        :model-value="harmonicityFactor"
        @change="
          (val) => {
            harmonicityFactor = val;
          }
        "
        v-bind="multiplySliderSettings"
        class="px-4"
      />
    </b-card-section>

    <q-separator />
    <section class="pl-2 py-1">
      <div class="text-left text-slate-50 text-caption">Filter</div>
    </section>
  </b-card>
</template>

<script setup lang="ts">
import * as Tone from "tone";
import { useComponentSettings } from "@/use/useComponentSettings";
import { match } from "ts-pattern";

const props = withDefaults(
  defineProps<{
    synthName: string;
    synthGain: number;
    oscBaseType: "pulse" | "pwm" | OscillatorType;
    oscSourceType: Tone.OmniOscSourceType;
    modulationIndex: number;
    harmonicityFactor: number;
    oscModulationType: OscillatorType;
    oscModulationIndex: number;
    oscHarmonicity: number;
    oscSpread: number;
    updateVisCb: () => Promise<Float32Array>;
  }>(),
  {}
);

const emit = defineEmits<{
  "update:synthGain": [number];
  "update:oscBaseType": [OscillatorType];
  "update:oscSourceType": [Tone.OmniOscSourceType];
  "update:modulationIndex": [number];
  "update:harmonicityFactor": [number];
  "update:oscModulationType": [number];
  "update:oscModulationIndex": [number];
  "update:oscHarmonicity": [number];
  "update:oscSpread": [number];
}>();

const {
  oscBaseType,
  oscSourceType,
  synthGain,
  modulationIndex,
  harmonicityFactor,
  oscModulationType,
  oscModulationIndex,
  oscHarmonicity,
  oscSpread,
} = useVModels(props, emit);

// === Setup === //

const {
  gainSliderSettings,
  oscSourceTypeOptions,
  oscTypeOptions,
  multiplySliderSettings,
  multiplyLowSliderSettings,
} = useComponentSettings();

const sourceTypeSectionOptions = computed(() =>
  match(oscSourceType.value)
    .with("am", () => ({
      modType: true,
      modTypeLabel: "AM Oscillator Type",
      modIndex: false,
      harmonicity: true,
      harmonicityLabel: "AM Oscillator Harmonicity",
      spread: false,
    }))
    .with("fm", () => ({
      modType: true,
      modTypeLabel: "FM Oscillator Type",
      modIndex: true,
      harmonicity: true,
      harmonicityLabel: "FM Oscillator Harmonicity",
      spread: false,
    }))
    .with("fat", () => ({
      modType: false,
      modTypeLabel: "",
      modIndex: false,
      harmonicity: false,
      harmonicityLabel: "",
      spread: true,
    }))
    .otherwise(() => ({
      modType: false,
      modTypeLabel: "",
      modIndex: false,
      harmonicity: false,
      harmonicityLabel: "",
      spread: false,
    }))
);

const hasUpdated = ref(false);
watch([oscBaseType, oscSourceType, synthGain], async (_val, _prevVal) => {
  hasUpdated.value = true;
  await nextTick();
  hasUpdated.value = false;
  console.debug("pbAmSynth Updated val %o", _val);
});

onMounted(() => {
  hasUpdated.value = true;
});
</script>
