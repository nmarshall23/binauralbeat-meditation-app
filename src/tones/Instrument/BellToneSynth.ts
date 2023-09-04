import * as Tone from "tone";
import { RecursivePartial } from "tone/build/esm/core/util/Interface";
import { ModulationSynth, ModulationSynthOptions } from "tone/build/esm/instrument/ModulationSynth";

export type BellToneSynthOptions = ModulationSynthOptions;

export class BellToneSynth extends ModulationSynth<BellToneSynthOptions> {

	readonly name: string = "AMSynth";

	/**
	 * Scale the oscillator from -1,1 to 0-1
	 */
	private _modulationScale: Tone.AudioToGain;
	private _modNeg: Tone.Abs


	constructor(options?: RecursivePartial<BellToneSynthOptions>);
	constructor() {
		super(Tone.optionsFromArguments(BellToneSynth.getDefaults(), arguments));

		

		// control the two voices frequency
		this.frequency.connect(this._carrier.frequency);
		this.frequency.chain(this.harmonicity, this._modulator.frequency);
		this.detune.fan(this._carrier.detune, this._modulator.detune);
		this._modulator.chain( this._modulationNode.gain);
		this._carrier.chain(this._modulationNode, this.output);
	}

	dispose(): this {
		super.dispose();
		this._modulationScale.dispose();
		this._modNeg.dispose()
		return this;
	}
}