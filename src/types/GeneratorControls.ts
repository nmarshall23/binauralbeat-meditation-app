import { NoiseType } from "tone";
import { GeneratorDefType } from "./GeneratorDef";
import { FilterSignalOptions } from "./GeneratorSignals";

export type GeneratorCtrlNoiseWithFilterOptions = {
  noise?: {
    type: NoiseType,
  }
  filter?: Partial<FilterSignalOptions & { type: BiquadFilterType }>
};

export type GeneratorControlsBase<T extends GeneratorDefType, UpdateOptions> = {
  type: T;
  generatorName: string;

  muteCtrl: boolean;
  volumeCtrl: number;
  dispose: () => void;
  hasOptions: boolean;
  updateOptions: (options: UpdateOptions) => void;
};

export type GeneratorCtrlBasicBinauralBeat = GeneratorControlsBase<
  "BasicBinauralBeatOsc",
  void
>;
export type GeneratorCtrlBasicNoise = GeneratorControlsBase<
  "BasicNoiseGen",
  void
>;
export type GeneratorCtrlBinauralBeatSynth = GeneratorControlsBase<
  "BinauralBeatwLoop",
  void
>;
export type GeneratorCtrlBinauralBeatSpin = GeneratorControlsBase<
  "BinauralBeatSpinOsc",
  void
>;
export type GeneratorCtrlNoiseWithFilter = GeneratorControlsBase<
  "NoiseFilteredGen",
  GeneratorCtrlNoiseWithFilterOptions
>;
export type GeneratorCtrlSamplePlayer = GeneratorControlsBase<
  "SamplePlayer",
  void
>;

export type GeneratorControls =
  | GeneratorCtrlBasicBinauralBeat
  | GeneratorCtrlBasicNoise
  | GeneratorCtrlBinauralBeatSynth
  | GeneratorCtrlBinauralBeatSpin
  | GeneratorCtrlNoiseWithFilter
  | GeneratorCtrlSamplePlayer;
