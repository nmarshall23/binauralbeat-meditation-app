import * as Tone from "tone";
import { readOnly } from "tone/build/esm/core/util/Interface";

import { Effect, EffectOptions } from "tone/build/esm/effect/Effect";

export interface FilterEffectOptions extends EffectOptions {
  filter: Partial<Tone.FilterOptions>;
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

 constructor(options?: Partial<FilterEffectOptions>);
  constructor() {
    super(Tone.optionsFromArguments(FilterEffect.getDefaults(), arguments))
    const options = Tone.optionsFromArguments(FilterEffect.getDefaults(), arguments)

    this.filter = new Tone.Filter(options.filter)

    // connections
    this.connectEffect(this.filter);

    readOnly(this, ["filter"]);
  }

  static getDefaults(): FilterEffectOptions {
    return Object.assign(Effect.getDefaults(), {
      filter: Object.assign(Tone.ToneAudioNode.getDefaults(),Tone.Filter.getDefaults()),
    });
  }
}
