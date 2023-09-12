import * as Tone from "tone";
import { omitFromObject } from "tone/build/esm/core/util/Defaults";
import { LFOEffect, LFOEffectOptions } from "tone/build/esm/effect/LFOEffect";

export interface SpinningPannerOptions
  extends Omit<
    LFOEffectOptions,
    "min" | "max" | "phase" | "units" | "amplitude"
  > {
  panner3d: Partial<Omit<Tone.Panner3DOptions, keyof Tone.ToneAudioNodeOptions>>; 
}

export class SpinningPanner extends LFOEffect<SpinningPannerOptions> {
  readonly name: string = "SpinningPanner";

  readonly panner3d: Tone.Panner3D;

  constructor(options?: Partial<SpinningPannerOptions>);
  constructor() {
    super(Tone.optionsFromArguments(SpinningPanner.getDefaults(), arguments));
    const options = Tone.optionsFromArguments(
      SpinningPanner.getDefaults(),
      arguments
    );

    this.panner3d = new Tone.Panner3D(options.panner3d);

    // === Connections === //

    this.connectEffect(this.panner3d);
    this._lfo.connect(this.panner3d.orientationY);
  }

  static getDefaults(): SpinningPannerOptions {
    return Object.assign(LFOEffect.getDefaults(), {
      min: 0, // -1 * Math.PI * 2,
      max: Math.PI * 2,
      phase: 90,
      panner3d: Object.assign(
        omitFromObject(
          Tone.Panner3D.getDefaults(),
          Object.keys(Tone.ToneAudioNode.getDefaults())
        ),
        {}
      ),
    });
  }

  dispose(): this {
    super.dispose();
    this.panner3d.dispose();
    return this;
  }
}
