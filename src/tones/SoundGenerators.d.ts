import * as Tone from "tone";
import { PatternName } from "tone/build/esm/event/PatternGenerator";


export type SoundGeneratorBasicNoiseGenOptions = {
    gain: Tone.Unit.GainFactor;
    noise: {
      type: Tone.NoiseType;
    };
}

export type SoundGeneratorBasicNoiseGen = {
  type: "BasicNoiseGen";
  options: SoundGeneratorBasicNoiseGenOptions
};

export type SoundGeneratorBasicBinauarlBeatOsc = {
  type: "BasicBinauarlBeatOsc";
  options: {
    gain: Tone.Unit.GainFactor;
    beatFreq: Tone.Unit.Frequency;
    osc: {
      frequency: Tone.Unit.Frequency;
      phase?: Tone.Unit.Degrees;
    };
  };
};

export type SoundGeneratorNoiseFilteredGen = {
  type: "NoiseFilteredGen";
  options: {
    gain: Tone.Unit.GainFactor;
    noise: {
      type: Tone.NoiseType;
    };
    filter: {
      type: BiquadFilterType;
      frequency?: Tone.Unit.Frequency;
      Q?: number;
    };
  };
};

export type SoundGeneratorAdvBinauarlBeatOsc = {
  type: "AdvBinauarlBeatOsc";
  options: {
    gain: Tone.Unit.GainFactor;
    beatFreq: Tone.Unit.Frequency;
    osc: {
      frequency: Tone.Unit.Frequency;
      phase?: Tone.Unit.Degrees;
    };
    loopEvents?: LooppingEventsOptions<BinauarlBeatOscLoopEvent>
  };
};

export type BinauarlBeatOscLoopEvent = {
    rampTime: number
    signal: RequireAtLeastOne<BinauarlBeatOscLoopEventSignal>
}

type BinauarlBeatOscLoopEventSignal = {
    beatFreq: Tone.Unit.Frequency;
    frequency: Tone.Unit.Frequency;
    phase: Tone.Unit.Degrees;
    gain: Tone.Unit.GainFactor;
}

export type LooppingEventsOptions<E> = {
    pattern: PatternName;
    interval: Time;
    humanize?: boolean | Time;
    probability : Tone.Unit.NormalRange
    values: Array<E>
}

export type SoundGenerators =
  | SoundGeneratorBasicNoiseGen
  | SoundGeneratorBasicBinauarlBeatOsc
  | SoundGeneratorNoiseFilteredGen
  | SoundGeneratorAdvBinauarlBeatOsc
