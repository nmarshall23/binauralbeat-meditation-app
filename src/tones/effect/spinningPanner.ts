import * as Tone from "tone";
import { LFOEffect, LFOEffectOptions } from "tone/build/esm/effect/LFOEffect";

export interface SpinningPannerOptions extends LFOEffectOptions {
	// channelCount: number;
}

export class SpinningPanner extends LFOEffect<SpinningPannerOptions> {

	readonly name: string = "SpinningPanner";

    readonly _panner3d: Tone.Panner3D

    constructor(options?: Partial<SpinningPannerOptions>);
	constructor() {
		super(Tone.optionsFromArguments(SpinningPanner.getDefaults(), arguments));
		// const options = Tone.optionsFromArguments(SpinningPanner.getDefaults(), arguments);

        this._panner3d = new Tone.Panner3D()

		
		// connections
		this.connectEffect(this._panner3d);
		this._lfo.connect(this._panner3d.orientationY);

		this._lfo.min = -1 * Math.PI * 2
		this._lfo.max = Math.PI * 2
	}

	static getDefaults(): SpinningPannerOptions {
		return Object.assign(LFOEffect.getDefaults(), {
			// channelCount: 2
		});
	}

	dispose(): this {
		super.dispose();
		this._panner3d.dispose()
		return this;
	}
}
