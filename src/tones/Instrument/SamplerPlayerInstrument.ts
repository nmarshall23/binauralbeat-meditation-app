import * as Tone from "tone";
import { RecursivePartial } from "tone/build/esm/core/util/Interface";
import {
  Instrument,
  InstrumentOptions,
} from "tone/build/esm/instrument/Instrument";

import bell_mallett_1 from "@/assets/berklee/bell_mallett_1.wav";
import gong1 from "@/assets/berklee/cakelid_gong1.wav";
import cookieTin2 from "@/assets/berklee/CookieTin2.wav";
import iron_bell1 from "@/assets/berklee/iron_bell1.wav";
import tinybell5 from "@/assets/berklee/tinybell5.wav";

const sampleLookup = {
  bell_mallett_1: bell_mallett_1,
  gong1: gong1,
  cookieTin2: cookieTin2,
  iron_bell1: iron_bell1,
  tinybell5: tinybell5,
};

const sampleNote: Record<keyof typeof sampleLookup, Tone.Unit.Note> = {
  bell_mallett_1: "F4",
  gong1: "A2",
  cookieTin2: "A2",
  iron_bell1: "C5",
  tinybell5: "F#6",
};

export type SamplerPlayerInstrumentOptions = InstrumentOptions & {
  sample: keyof typeof sampleLookup;
};

export class SamplerPlayerInstrument extends Instrument<SamplerPlayerInstrumentOptions> {
  readonly name: string = "PlayersInst";

  private _buffer: Tone.ToneAudioBuffer;
  readonly sampler: Tone.Sampler;
  readonly sampleBaseNote: Tone.Unit.Note;

  /**
   * @param options the options available for the synth.
   */
  constructor(options?: RecursivePartial<SamplerPlayerInstrumentOptions>);
  constructor() {
    super(
      Tone.optionsFromArguments(
        SamplerPlayerInstrument.getDefaults(),
        arguments
      )
    );
    const options = Tone.optionsFromArguments(
      SamplerPlayerInstrument.getDefaults(),
      arguments
    );

    this.sampleBaseNote = sampleNote[options.sample];
    this._buffer = new Tone.ToneAudioBuffer(sampleLookup[options.sample]);

    this.sampler = new Tone.Sampler({
      [this.sampleBaseNote]: this._buffer,
    });

    this.sampler.connect(this.output);
  }

  static getDefaults(): SamplerPlayerInstrumentOptions {
    return Object.assign(Instrument.getDefaults(), {
      sample: "iron_bell1" as const,
    });
  }

  triggerAttackRelease(
    notes: Tone.Unit.Frequency | Tone.Unit.Frequency[],
    duration: Tone.Unit.Time,
    time?: Tone.Unit.Time
  ): this {
    const computedTime = this.toSeconds(time);
    const computedDuration = this.toSeconds(duration);

    this.triggerAttack(notes, computedTime);
    this.triggerRelease(notes, computedTime + computedDuration);
    return this;
  }

  triggerAttack(
    notes: Tone.Unit.Frequency | Tone.Unit.Frequency[],
    time?: Tone.Unit.Time
  ): this {
    this.sampler.triggerAttack(notes, time);
    return this;
  }

  triggerRelease(
    notes: Tone.Unit.Frequency | Tone.Unit.Frequency[],
    time?: Tone.Unit.Time
  ): this {
    this.sampler.triggerRelease(notes, time);
    return this;
  }

  triggerByBaseNote(
    time?: Tone.Unit.Time,
    transposeBysemitones?: number,
  ) {
    const computedDuration = this._buffer.duration;

    const note = Tone.Frequency(this.sampleBaseNote)
      .transpose(transposeBysemitones ?? 0)
      .toFrequency();

    this.sampler.triggerAttackRelease(note, computedDuration, time);
    
  }

  /**
   * clean up
   */
  dispose(): this {
    super.dispose();
    this._buffer.dispose();
    this.sampler.dispose();
    return this;
  }
}
