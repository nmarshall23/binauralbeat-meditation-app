import * as Tone from "tone";
import { Frequency, NormalRange, Time } from "tone/build/esm/core/type/Units";
import { omitFromObject } from "tone/build/esm/core/util/Defaults";
import { RecursivePartial } from "tone/build/esm/core/util/Interface";
import {
  Instrument,
  InstrumentOptions,
} from "tone/build/esm/instrument/Instrument";
import { Source } from "tone/build/esm/source/Source";

export interface BinauralBeatSynthOptions extends InstrumentOptions {
  synth: Tone.SynthOptions;
  baseFrequency: Frequency;
  beatFrequency: number;
}

export class BinauralBeatSynth<
  Options extends BinauralBeatSynthOptions = BinauralBeatSynthOptions
> extends Instrument<Options> {
  readonly name: string = "BinauralBeatOscSynth";

  /**
   * The oscillator.
   */
  private readonly synthL: Tone.Synth<any>;
  private readonly synthR: Tone.Synth<any>;

  // private readonly mergeNode: Tone.Merge;

  private readonly addBeatNode: Tone.Add;

  readonly baseFrequency: Tone.Signal<"frequency">;
  readonly beatFrequency: Tone.Param<"number">;

  /**
   * @param options the options available for the synth.
   */
  constructor(options?: RecursivePartial<BinauralBeatSynthOptions>);
  constructor() {
    super(
      Tone.optionsFromArguments(BinauralBeatSynth.getDefaults(), arguments)
    );
    const options = Tone.optionsFromArguments(
      BinauralBeatSynth.getDefaults(),
      arguments
    );


    const mergeNode = new Tone.Merge().connect(this.output);
    this.synthL = new Tone.Synth(options.synth).connect(mergeNode, 0, 1);
    this.synthR = new Tone.Synth(options.synth).connect(mergeNode, 0, 0);

    this.addBeatNode = new Tone.Add(options.beatFrequency);

    this.baseFrequency = new Tone.Signal({
      value: options.baseFrequency,
      units: "frequency",
    }).connect(this.addBeatNode)

    this.beatFrequency = this.addBeatNode.addend
  }

  static getDefaults(): BinauralBeatSynthOptions {
    return Object.assign(Instrument.getDefaults(), {
      synth: Object.assign(Tone.Synth.getDefaults(), {
        envelope: Object.assign(
          omitFromObject(Tone.Envelope.getDefaults(), Object.keys(Tone.ToneAudioNode.getDefaults())),
          {
            attack: 10,
            decay: 0,
            release: 10,
            sustain: 1,
          },
        ),
        oscillator: Object.assign(
          omitFromObject(Tone.OmniOscillator.getDefaults(), [...Object.keys(Source.getDefaults()), "frequency", "detune"]),
          {
            type: "sine",
          },
        ) as Tone.OmniOscillatorOptions,
      }),
      baseFrequency: 180,
      beatFrequency: 6,
    });
  }

  triggerAttackRelease(
    duration: Time,
    time?: Time,
    velocity?: NormalRange
  ): this {
    const computedTime = this.toSeconds(time);
    const computedDuration = this.toSeconds(duration);
    this.triggerAttack(computedTime, velocity);
    this.triggerRelease(computedTime + computedDuration);
    return this;
  }

  triggerAttack(time?: Time, velocity: NormalRange = 1): this {
    this.log("triggerAttack", time, velocity);

    this.synthL.triggerAttack(this.baseFrequency.value, time, velocity);
    this.synthR.triggerAttack(this.beatFrequency.value, time, velocity);
    return this;
  }

  triggerRelease(time?: Time): this {
    this.synthL.triggerRelease(time);
    this.synthR.triggerRelease(time);
    return this;
  }

  /**
   * clean up
   */
  dispose(): this {
    super.dispose();
    this.synthL.dispose();
    this.synthR.dispose();

    return this;
  }
}
