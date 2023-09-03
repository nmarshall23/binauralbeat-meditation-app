import * as Tone from "tone";

import {
  StereoEffect,
  StereoEffectOptions,
} from "tone/build/esm/effect/StereoEffect";

export interface BinauralBeatEffectOptions extends StereoEffectOptions {
  beatFrequency: number;
}

export class BinauralBeatEffect<
  Options extends BinauralBeatEffectOptions
> extends StereoEffect<Options> {
  readonly name: string = "BinauralBeatEffect";

  /**
   *
   *
   */
  /**
   * The output merge node
   */

  private _freqShifter: Tone.FrequencyShifter;

  readonly beatFrequency: Tone.Signal<"frequency">;

  constructor(options?: Partial<BinauralBeatEffectOptions>);
  constructor() {
    super(
      Tone.optionsFromArguments(BinauralBeatEffect.getDefaults(), arguments)
    );
    const options = Tone.optionsFromArguments(
      BinauralBeatEffect.getDefaults(),
      arguments
    );

    this._freqShifter = new Tone.FrequencyShifter({
      context: this.context,
      frequency: options.beatFrequency,
    });

    this.beatFrequency = this._freqShifter.frequency;

    this.connectEffectLeft(this._freqShifter);
  }

  static getDefaults(): BinauralBeatEffectOptions {
    return Object.assign(StereoEffect.getDefaults(), {
      beatFrequency: 4,
    });
  }

  dispose(): this {
    super.dispose();
    this._freqShifter.dispose();
    return this;
  }
}
