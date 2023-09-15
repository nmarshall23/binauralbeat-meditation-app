<template>
  <b-card color="#334155">
    <b-card-header color="bg-indigo-500 text-grey-3 text-h6">
      {{ synthName }}
    </b-card-header>
    
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

    <q-separator />
    <section class="pl-2 py-1">
      <div class="text-left text-slate-50 text-caption">Filter</div>
    </section>
  </b-card>
</template>

<script setup lang="ts">
import * as Tone from "tone";
import { useComponentSettings } from "@/use/useComponentSettings";

const props = withDefaults(
  defineProps<{
    synthName: string;
    synthGain: number;
    oscBaseType: "pulse" | "pwm" | OscillatorType;
    oscSourceType: Tone.OmniOscSourceType;
    modulationIndex: number
    updateVisCb: () => Promise<Float32Array>;
  }>(),
  {}
);

const emit = defineEmits<{
  "update:synthGain": [number];
  "update:oscBaseType": [OscillatorType];
  "update:oscSourceType": [Tone.OmniOscSourceType];
  "update:modulationIndex": [number]
}>();

const { oscBaseType, oscSourceType, synthGain, modulationIndex } = useVModels(props, emit);

const { gainSliderSettings, oscSourceTypeOptions, oscTypeOptions, multiplySliderSettings } =
  useComponentSettings();

const hasUpdated = ref(false);
watch(
  [oscBaseType, oscSourceType, synthGain],
  async (_val, _prevVal) => {
    hasUpdated.value = true;
    await nextTick();
    hasUpdated.value = false;
    console.debug("pbAmSynth Updated val %o", _val);
  }
);

onMounted(() => {
  hasUpdated.value = true;
})

</script>
