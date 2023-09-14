import * as Tone from "tone";
import { readOnly } from "tone/build/esm/core/util/Interface";

import { LFOEffect, LFOEffectOptions } from "tone/build/esm/effect/LFOEffect";

export interface LfoPitchShiftEffectOptions extends LFOEffectOptions {
  
}

export class LfoPitchShiftEffect<
  Options extends LfoPitchShiftEffectOptions
> extends LFOEffect<Options> {
  readonly name: string = "LfoPitchShiftEffect";

  

  constructor(options?: Partial<LfoPitchShiftEffectOptions>);
  constructor() {
    super(Tone.optionsFromArguments(LfoPitchShiftEffect.getDefaults(), arguments));
    const options = Tone.optionsFromArguments(
        LfoPitchShiftEffect.getDefaults(),
      arguments
    );

    
    readOnly(this, [
      
    ]);
  }

  static getDefaults(): LfoPitchShiftEffectOptions {
    return Object.assign(LFOEffect.getDefaults(), {
      
    });
  }

  

  dispose(): this {
    super.dispose();
    
    return this;
  }
}
