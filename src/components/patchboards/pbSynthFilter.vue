<template>
  <b-card color="#334155">
    <b-card-header color="bg-indigo-500 text-grey-3 text-h6">
      {{ synthName }}
    </b-card-header>
    <section class="pl-2 py-1">
      <div class="text-left text-slate-50 text-caption">Oscillator</div>
    </section>
    <oscillator-vis
      class="self-start bg-blue-grey-10"
      :watch="hasUpdated"
      :update-vis-cb="updateVisCb"
    />
    <section class="py-4 px-2">
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
    </section>
    <section class="py-4 px-2">
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
    </section>

    <section class="py-4 px-2">
      <q-badge color="secondary"> Synth 01 Gain: {{ synthGain }} </q-badge>
      <q-slider
        dense
        :model-value="synthGain"
        @change="
          (val) => {
            synthGain = val;
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
    updateVisCb: () => Promise<Float32Array>;
  }>(),
  {}
);

const emit = defineEmits<{
  (e: "update:synthGain", v: number): void;
  (e: "update:oscBaseType", v: OscillatorType): void;
  (e: "update:oscSourceType", v: Tone.OmniOscSourceType): void;
}>();

const { oscBaseType, oscSourceType, synthGain } = useVModels(props, emit);

const { normalRangeSliderSettings, oscSourceTypeOptions, oscTypeOptions } =
  useComponentSettings();

const hasUpdated = ref(false);
watch([oscBaseType, oscSourceType, synthGain], async (_val, _prevVal) => {
  hasUpdated.value = true;
  await nextTick();
  hasUpdated.value = false;
});

onMounted(() => {
  hasUpdated.value = true;
})
</script>
