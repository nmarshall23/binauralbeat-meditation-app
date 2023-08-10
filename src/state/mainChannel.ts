import { useDebounceFn } from "@vueuse/core";
import { createProjection } from '@vueuse/math'

import * as Tone from "tone";
import { computed, ref, watchEffect } from "vue";

const volumeSliderOptions = {
    maxValue: 100,
    minValue: 0,
    step: 10,
    innerMin: 5,
    innerMax: 99,
    projectionMax: -6,
    projectionMix: -40
}
const mainChannel = new Tone.Channel(-30).receive("main").toDestination();

// const deciScaleExp = new Tone.Scale(-60, -20).connect(mainChannel.volume.input);
// const deciSignalExp = new Tone.Signal(0.5).connect(deciScaleExp);
// const scale = new Tone.Scale(10, 100).connect(deciScaleExp)
// const volumeSignal = new Tone.Signal({
//     value: -40,
//     units: "decibels",
//     maxValue: volumeRange.maxValue,
//     minValue: volumeRange.minValue
// }).connect(mainChannel.volume);

const setVolume = useDebounceFn((n: number) => {
    console.log('MainChannel Vol ', mainChannel.volume.value)
    console.log('Input N %o, ', n)
    mainChannel.volume.rampTo(n, 3)
  }, 1500)

// const volumeRef = computed({
//     get: () => volumeSignal.value,
//     set: async (n: number) => await setVolume(n)
// })

const useProjector = createProjection([0, 100], [volumeSliderOptions.projectionMix, volumeSliderOptions.projectionMax])
const volumeRef = ref(30)
const projected = useProjector(volumeRef)

watchEffect(() => {
    setVolume(projected.value)
})


export function useMainChannel() {
  return {
    mainChannel,
    volumeRef,
    volumeSliderOptions,
  };
}
