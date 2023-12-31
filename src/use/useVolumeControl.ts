import * as Tone from "tone";

import { createProjection } from "@vueuse/math";

type UseVolumeControlOptions = {
  projectionMax?: number;
  projectionMin?: number;
  defaultValue?: number
};

export function useVolumeControl(
  volume: Tone.Param<"decibels">,
  options?: UseVolumeControlOptions
) {
  const { projectionMax = 0, projectionMin = -16, defaultValue = 50 } = options ?? {};

  const setVolume = useDebounceFn((n: number) => {
    // console.log('MainChannel Vol ', volume.value)
    // console.log('Input N %o, ', n)
    volume.rampTo(n, 1);
  }, 700);

  const useProjector = createProjection(
    [0, 100],
    [projectionMin, projectionMax]
  );

  const volumeRef = ref(defaultValue);
  const projected = useProjector(volumeRef);

  watchEffect(() => {
    setVolume(projected.value);
  });

  return {
    volumeRef
  }
}
