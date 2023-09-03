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
    /**
	 * The negate operator
	 */
	private _negate: Tone.Negate;

	/**
	 * The add operator
	 */
	private _add: Tone.Add;
    private _addNeg: Tone.Add;

	constructor(options?: RecursivePartial<BellToneSynthOptions>);
	constructor() {
		super(Tone.optionsFromArguments(BellToneSynth.getDefaults(), arguments));

		this._modulationScale = new Tone.AudioToGain({
			context: this.context,
		});

        this._negate = new Tone.Negate({ context: this.context });
		this._add = new Tone.Add({ context: this.context });
        this._addNeg = new Tone.Add({ context: this.context });

		// control the two voices frequency
		this.frequency.connect(this._carrier.frequency);
		this.frequency.chain(this.harmonicity, this._modulator.frequency);
		this.detune.fan(this._carrier.detune, this._modulator.detune);

        this._carrier.fan(this._add, this._addNeg) 
        this._modulator.fan(this._add.addend, this._negate, this._modulationScale)

        this._add.connect(this._modulationNode)
        this._modulationScale.chain(this._addNeg, this._modulationNode)
       // this._negate.chain(this._addNeg, this._modulationNode)

        this._modulationNode.connect(this.output)

        this._modulationNode.gain.value = 1
		// this._modulator.chain(this._modulationScale, this._modulationNode.gain);

		// this._carrier.chain(this._modulationNode, this.output);
	}

	dispose(): this {
		super.dispose();
		this._modulationScale.dispose();
        this._add.dispose()
        this._negate.dispose()
		return this;
	}
}