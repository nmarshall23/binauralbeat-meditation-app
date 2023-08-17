import * as Tone from "tone";
import { useVolumeControl } from "../use/useVolumeControl";

const volumeSliderOptions = {
  maxValue: 100,
  minValue: 0,
  step: 10,
  innerMin: 1,
  innerMax: 99,
  projectionMax: -5,
  projectionMin: -25,
};
const mainChannel = new Tone.Channel(-25).receive("main").toDestination();

const { volumeRef } = useVolumeControl(mainChannel.volume, {
  projectionMax: 0,
  projectionMin: -25,
  defaultValue: 50
});

// const setVolume = useDebounceFn((n: number) => {
//     console.log('MainChannel Vol ', mainChannel.volume.value)
//     console.log('Input N %o, ', n)
//     mainChannel.volume.rampTo(n, 3)
//   }, 1500)

// const useProjector = createProjection([0, 100], [volumeSliderOptions.projectionMin, volumeSliderOptions.projectionMax])
// const volumeRef = ref(50)
// const projected = useProjector(volumeRef)

// watchEffect(() => {
//     setVolume(projected.value)
// })

export function useMainChannel() {
  return {
    mainChannel,
    volumeRef,
    volumeSliderOptions,
  };
}
