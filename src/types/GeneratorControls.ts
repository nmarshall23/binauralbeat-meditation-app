import { NoiseType, ToneOscillatorType } from "tone";
import {
  BasicBinauralBeatOscOptions,
  BasicNoiseGenOptions,
  BinauralBeatSynthGenerator,
  BinauralBeatSynthSpinGenerator,
 
  GeneratorDefBase,
  GeneratorDefType,
  GeneratorNoiseFilteredGen,
  NoiseFilteredGenOptions,
  SamplePlayerGenerator,
} from "./GeneratorDef";
import { Frequency } from "tone/build/esm/core/type/Units";
import { RecursivePartial } from "tone/build/esm/core/util/Interface";
import { FilterSignalOptions } from "./GeneratorSignals";

export type GeneratorControlsBase<
  T extends GeneratorDefType,
  GenOptions,
  GenSettings,
  R
> = {
  type: T;
  generatorName: string;
  generatorDef: GeneratorDefBase<T, GenOptions>;

  muteCtrl: boolean;
  volumeCtrl: number;
  dispose: () => void;
  hasOptions: boolean;
  updateOptions: (options: RecursivePartial<GenSettings>) => void;
  getOptionValues: () => GenSettings;
  toggleGenSoundTest: (value?: boolean) => void;
  additionalRecords: R;
};

export type GeneratorCtrlNoiseWithFilterOptions = {
  noise: {
    type: NoiseType;
  };
  filter: FilterSignalOptions & { type: BiquadFilterType };
};

export type OscillatorSourceType = "oscillator" | "fm" | "am" | "fat";

export type GeneratorCtrlBinauralBeatSynthOptions = {
  synth: {
    baseFrequency: Frequency;
    beatFrequency: number;
    oscillator: {
      baseType: OscillatorType;
      sourceType: OscillatorSourceType;
      partialCount: number;
      sourceOptions: {
        count: number;
        spread: number;
        modulationType: ToneOscillatorType;
        harmonicity: number;
        modulationIndex: number;
      };
    };
  };
};

export type BinauralBeatSynthAdditionalRecords = {
  // source: BinauralBeatSynth<BinauralBeatSynthOptions>;
  sourceGetAsArray: () => Promise<Float32Array>;
};

export type GeneratorCtrlBasicBinauralBeat = GeneratorControlsBase<
  "BasicBinauralBeatOsc",
  BasicBinauralBeatOscOptions,
  void,
  unknown
>;
export type GeneratorCtrlBasicNoise = GeneratorControlsBase<
  "BasicNoiseGen",
  BasicNoiseGenOptions,
  void,
  unknown
>;
export type GeneratorCtrlBinauralBeatSynth = GeneratorControlsBase<
  "BinauralBeatwLoop",
  BinauralBeatSynthGenerator,
  GeneratorCtrlBinauralBeatSynthOptions,
  BinauralBeatSynthAdditionalRecords
>;
export type GeneratorCtrlBinauralBeatSpin = GeneratorControlsBase<
  "BinauralBeatSpinOsc",
  BinauralBeatSynthSpinGenerator,
  void,
  unknown
>;

export type GeneratorCtrlNoiseWithFilter = {
  type: "NoiseFilteredGen";
  generatorDef: GeneratorNoiseFilteredGen;
} & GeneratorControlsBase<
  "NoiseFilteredGen",
  NoiseFilteredGenOptions,
  GeneratorCtrlNoiseWithFilterOptions,
  unknown
>;

export type GeneratorCtrlSamplePlayer = GeneratorControlsBase<
  "SamplePlayer",
  SamplePlayerGenerator,
  void,
  unknown
>;

export type GeneratorControls =
  | GeneratorCtrlBasicBinauralBeat
  | GeneratorCtrlBasicNoise
  | GeneratorCtrlBinauralBeatSynth
  | GeneratorCtrlBinauralBeatSpin
  | GeneratorCtrlNoiseWithFilter
  | GeneratorCtrlSamplePlayer;
