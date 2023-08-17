import { useVolumeControl } from "@/use/useVolumeControl";
import * as Tone from "tone";

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

export function useMainChannel() {
  return {
    mainChannel,
    volumeRef,
    volumeSliderOptions,
  };
}
