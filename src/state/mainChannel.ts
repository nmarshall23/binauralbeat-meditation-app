import { useVolumeControl } from "@/use/useVolumeControl";
import * as Tone from "tone";

const volumeSliderOptions = {
  maxValue: 100,
  minValue: 0,
  step: 10,
  innerMin: 1,
  innerMax: 99,
  projectionMax: 3,
  projectionMin: -25,
};
const mainChannel = new Tone.Channel(-10).receive("main").toDestination();

const { volumeRef } = useVolumeControl(mainChannel.volume, {
  projectionMax: volumeSliderOptions.projectionMax,
  projectionMin: volumeSliderOptions.projectionMin,
  defaultValue: 50
});

export function useMainChannel() {
  return {
    mainChannel,
    volumeRef,
    volumeSliderOptions,
  };
}
