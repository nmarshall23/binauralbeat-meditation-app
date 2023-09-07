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
import {
  BinauralBeatSynth,
  BinauralBeatSynthOptions,
} from "@/tones/Instrument/BinauralBeatSynth";

export type GeneratorControlsBase<
  T extends GeneratorDefType,
  GenSettings,
  SignalType,
  R
> = {
  type: T;
  generatorName: string;

  muteCtrl: boolean;
  volumeCtrl: number;
  dispose: () => void;
  hasOptions: boolean;
  updateOptions: (options: RecursivePartial<GenSettings>) => void;
  getOptionValues: () => GenSettings;
  toggleGenSoundTest: (value?: boolean) => void;
  loopEvents?: LooppingEventsOptions<SignalType>;
  eventSequence?: EventSequence<SignalType>;
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
  sourceGetAsArray: () => Promise<Float32Array>
};

export type GeneratorCtrlBasicBinauralBeat = GeneratorControlsBase<
  "BasicBinauralBeatOsc",
  void,
  null,
  null
>;
export type GeneratorCtrlBasicNoise = GeneratorControlsBase<
  "BasicNoiseGen",
  void,
  null,
  null
>;
export type GeneratorCtrlBinauralBeatSynth = GeneratorControlsBase<
  "BinauralBeatwLoop",
  GeneratorCtrlBinauralBeatSynthOptions,
  BinauralBeatEventSignal,
  BinauralBeatSynthAdditionalRecords
>;
export type GeneratorCtrlBinauralBeatSpin = GeneratorControlsBase<
  "BinauralBeatSpinOsc",
  void,
  null,
  null
>;
export type GeneratorCtrlNoiseWithFilter = GeneratorControlsBase<
  "NoiseFilteredGen",
  GeneratorCtrlNoiseWithFilterOptions,
  NoiseFilteredGenEventSignal,
  null
>;
export type GeneratorCtrlSamplePlayer = GeneratorControlsBase<
  "SamplePlayer",
  void,
  null,
  null
>;

export type GeneratorControls =
  | GeneratorCtrlBasicBinauralBeat
  | GeneratorCtrlBasicNoise
  | GeneratorCtrlBinauralBeatSynth
  | GeneratorCtrlBinauralBeatSpin
  | GeneratorCtrlNoiseWithFilter
  | GeneratorCtrlSamplePlayer;
