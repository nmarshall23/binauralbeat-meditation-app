import { NoiseType, ToneOscillatorType } from "tone";
import { GeneratorDefType } from "./GeneratorDef";
import {
  BinauralBeatEventSignal,
  EventSequence,
  FilterSignalOptions,
  LooppingEventsOptions,
  NoiseFilteredGenEventSignal,
} from "./GeneratorSignals";
import { Frequency } from "tone/build/esm/core/type/Units";
import { RecursivePartial } from "tone/build/esm/core/util/Interface";

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

export type GeneratorControlsBase<
  T extends GeneratorDefType,
  GenSettings,
  SignalType
> = {
  type: T;
  generatorName: string;

  muteCtrl: boolean;
  volumeCtrl: number;
  dispose: () => void;
  hasOptions: boolean;
  updateOptions: (options: RecursivePartial<GenSettings>) => void;
  toggleGenSoundTest: (value?: boolean) => void;
  getOptionValues: () => GenSettings;
  loopEvents?: LooppingEventsOptions<SignalType>;
  eventSequence?: EventSequence<SignalType>;
};

export type GeneratorCtrlBasicBinauralBeat = GeneratorControlsBase<
  "BasicBinauralBeatOsc",
  void,
  null
>;
export type GeneratorCtrlBasicNoise = GeneratorControlsBase<
  "BasicNoiseGen",
  void,
  null
>;
export type GeneratorCtrlBinauralBeatSynth = GeneratorControlsBase<
  "BinauralBeatwLoop",
  GeneratorCtrlBinauralBeatSynthOptions,
  BinauralBeatEventSignal
>;
export type GeneratorCtrlBinauralBeatSpin = GeneratorControlsBase<
  "BinauralBeatSpinOsc",
  void,
  null
>;
export type GeneratorCtrlNoiseWithFilter = GeneratorControlsBase<
  "NoiseFilteredGen",
  GeneratorCtrlNoiseWithFilterOptions,
  NoiseFilteredGenEventSignal
>;
export type GeneratorCtrlSamplePlayer = GeneratorControlsBase<
  "SamplePlayer",
  void,
  null
>;

export type GeneratorControls =
  | GeneratorCtrlBasicBinauralBeat
  | GeneratorCtrlBasicNoise
  | GeneratorCtrlBinauralBeatSynth
  | GeneratorCtrlBinauralBeatSpin
  | GeneratorCtrlNoiseWithFilter
  | GeneratorCtrlSamplePlayer;
