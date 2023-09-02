import * as Tone from "tone";
import { readOnly } from "tone/build/esm/core/util/Interface";

import { Effect, EffectOptions } from "tone/build/esm/effect/Effect";

export interface KeyTrackFilterEffectOptions extends EffectOptions {
  filter: Partial<Tone.FilterOptions>;
}

export class KeyTrackFilterEffect<
  Options extends KeyTrackFilterEffectOptions
> extends Effect<Options> {
  readonly name: string = "KeyTrackFilterEffect";

  /**
   *
   *
   */
  readonly filter: Tone.Filter;
  readonly keyFrequency: Tone.Signal<"frequency">;

  constructor(options?: Partial<KeyTrackFilterEffectOptions>);
  constructor() {
    super(Tone.optionsFromArguments(KeyTrackFilterEffect.getDefaults(), arguments));
    const options = Tone.optionsFromArguments(
        KeyTrackFilterEffect.getDefaults(),
      arguments
    );

    this.filter = new Tone.Filter(options.filter);

// === Signals === //


    // connections
    this.connectEffect(this.filter);


    

    readOnly(this, ["filter"]);
  }

  static getDefaults(): KeyTrackFilterEffectOptions {
    return Object.assign(Effect.getDefaults(), {
      filter: Object.assign(
        Tone.ToneAudioNode.getDefaults(),
        Tone.Filter.getDefaults()
      ),
    });
  }
}
