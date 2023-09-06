import * as Tone from "tone";
import { Positive } from "tone/build/esm/core/type/Units";
import { readOnly } from "tone/build/esm/core/util/Interface";

import { Effect, EffectOptions } from "tone/build/esm/effect/Effect";

export interface FilterEffectOptions extends EffectOptions {
  filter: Partial<Tone.FilterOptions>;
  filterFrequencyIndex?: Positive;
}

export class FilterEffect<
  Options extends FilterEffectOptions
> extends Effect<Options> {
  readonly name: string = "FilterEffect";

  /**
   *
   *
   */
  readonly filter: Tone.Filter;

  /**
   * The Frequency index which is in essence the depth or amount of multipied to filter.Frequency.
   */
  readonly frequencyIndex: Tone.Signal<"positive">;
  private _frequencyIndexMulti: Tone.Multiply<"positive">;

  /**
   * The cutoff frequency of the filter.
   */
  readonly frequency: Tone.Signal<"frequency">;

  /**
   * The Q or Quality of the filter
   */
  readonly Q: Tone.Signal<"positive">;
  /**
   * The detune parameter
   */
  readonly detune: Tone.Signal<"cents">;
  /**
   * The gain of the filter, only used in certain filter types
   */
  readonly gain: Tone.Signal<"decibels">;

  constructor(options?: Partial<FilterEffectOptions>);
  constructor() {
    super(Tone.optionsFromArguments(FilterEffect.getDefaults(), arguments));
    const options = Tone.optionsFromArguments(
      FilterEffect.getDefaults(),
      arguments
    );

    this.filter = new Tone.Filter(options.filter);

    this.Q = this.filter.Q;
    this.detune = this.filter.detune;
    this.gain = this.filter.gain;

    this.frequency = new Tone.Signal({
      context: this.context,
      units: "frequency",
      value: options.filter.frequency,
    });

    this._frequencyIndexMulti = new Tone.Multiply({
      context: this.context,
      units: "positive",
      value: options.filterFrequencyIndex,
    });

    this.frequencyIndex = new Tone.Signal({
      context: this.context,
      units: "positive",
      value: options.filterFrequencyIndex,
    });

    // connections
    this.connectEffect(this.filter);

    this.frequencyIndex.connect(this._frequencyIndexMulti.factor);
    this.frequency.connect(this._frequencyIndexMulti);

    this._frequencyIndexMulti.connect(this.filter.frequency);

    readOnly(this, [
      "frequencyIndex",
      "frequency",
      "Q",
      "detune",
      "gain",
      "filter",
    ]);
  }

  static getDefaults(): FilterEffectOptions {
    return Object.assign(Effect.getDefaults(), {
      filter: Object.assign(
        Tone.ToneAudioNode.getDefaults(),
        Tone.Filter.getDefaults()
      ),
      filterFrequencyIndex: 1,
    });
  }

  /**
   * The type of the filter. Types: "lowpass", "highpass",
   * "bandpass", "lowshelf", "highshelf", "notch", "allpass", or "peaking".
   */
  get type() {
    return this.filter.type;
  }
  set type(type: BiquadFilterType) {
    this.filter.type = type;
  }

  dispose(): this {
    super.dispose();
    this.filter.dispose();
    return this;
  }
}
