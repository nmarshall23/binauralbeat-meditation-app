import { EventHookOn } from "@vueuse/core";
import { Ref } from "vue";

export type GeneratorControlsBase<T extends GeneratorDefType> = {
  type: T;
  generatorName: string;

  muteCtrl: boolean;
  volumeCtrl: number;
  dispose: () => void;
};

type GeneratorControlNoiseFiltered = GeneratorControlsBase<"NoiseFilteredGen">;
type GeneratorControlBinauralBeatwLoop =
  GeneratorControlsBase<"BinauralBeatwLoop">;

export type GeneratorControls = {
  type: GeneratorDefType;
  generatorName: string;

  muteCtrl: boolean;
  volumeCtrl: number;
  dispose: () => void;
};
