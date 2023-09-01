import * as Tone from "tone";
import { LFOEffect, LFOEffectOptions } from "tone/build/esm/effect/LFOEffect";

export interface SpinningPannerOptions extends LFOEffectOptions {
	// channelCount: number;
}

export class SpinningPanner extends LFOEffect<SpinningPannerOptions> {

	readonly name: string = "SpinningPanner";

    readonly panner3d: Tone.Panner3D

    constructor(options?: Partial<SpinningPannerOptions>);
	constructor() {
		super(Tone.optionsFromArguments(SpinningPanner.getDefaults(), arguments));
		// const options = Tone.optionsFromArguments(SpinningPanner.getDefaults(), arguments);

        this.panner3d = new Tone.Panner3D()

		
		// connections
		this.connectEffect(this.panner3d);
		this._lfo.connect(this.panner3d.orientationY);

		// this._lfo.min = -1 * Math.PI * 2
		// this._lfo.max = Math.PI * 2
	}

	static getDefaults(): SpinningPannerOptions {
		return Object.assign(LFOEffect.getDefaults(), {
			min: 0, // -1 * Math.PI * 2,
			max: Math.PI * 2,
			phase: 90,
			
		});
	}

	dispose(): this {
		super.dispose();
		this.panner3d.dispose()
		return this;
	}
}
