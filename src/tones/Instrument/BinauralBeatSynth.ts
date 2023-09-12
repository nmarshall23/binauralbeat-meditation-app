import * as Tone from "tone";
import {
  Cents,
  Frequency,
  NormalRange,
  Time,
} from "tone/build/esm/core/type/Units";
import { omitFromObject } from "tone/build/esm/core/util/Defaults";
import { RecursivePartial, readOnly } from "tone/build/esm/core/util/Interface";
import {
  Instrument,
  InstrumentOptions,
} from "tone/build/esm/instrument/Instrument";
import { Source } from "tone/build/esm/source/Source";
import { OmniOscillatorSynthOptions } from "tone/build/esm/source/oscillator/OscillatorInterface";

export interface BinauralBeatSynthOptions extends InstrumentOptions{
  oscillator: Partial<OmniOscillatorSynthOptions>;
  envelope: Omit<Tone.EnvelopeOptions, keyof Tone.ToneAudioNodeOptions>;
  baseFrequency: Frequency;
  beatFrequency: number;
  detune: Cents;
}

export class BinauralBeatSynth<
  Options extends BinauralBeatSynthOptions = BinauralBeatSynthOptions
> extends Instrument<Options> {
  readonly name: string = "BinauralBeatSynth";

  /**
   * The output merge node
   */
  private _merge: Tone.Merge;
  private _beatAdderNode: Tone.Add;

  /**
   * The oscillators.
   */
  private oscillatorL: Tone.OmniOscillator<any>;
  private oscillatorR: Tone.OmniOscillator<any>;
  // readonly oscillator: Tone.OmniOscillator<any>;
  /**
   * The frequency signals
   */
  readonly baseFrequency: Tone.Signal<"frequency">;
  readonly beatFrequency: Tone.Param<"number">;

  //  oscillatorType: OmniOscillatorType
  /**
   * The detune signal
   */
  readonly detune: Tone.Signal<"cents">;

  /**
   * The envelope
   */
  readonly envelope: Tone.AmplitudeEnvelope;

  /**
   * @param options the options available for the synth.
   */
  constructor(options?: RecursivePartial<BinauralBeatSynthOptions>);
  constructor() {
    super(
      Tone.optionsFromArguments(BinauralBeatSynth.getDefaults(), arguments)
    );

    const options = Tone.optionsFromArguments(
      BinauralBeatSynth.getDefaults(),
      arguments
    );

    // === Instruments === //

    this.envelope = new Tone.AmplitudeEnvelope(
      Object.assign(
        {
          context: this.context,
        },
        options.envelope
      )
    );

    this._merge = new Tone.Merge();

    this.oscillatorR = new Tone.OmniOscillator(
      Object.assign(
        {
          context: this.context,
          detune: options.detune,
        },
        options.oscillator
      )
    );

    this.oscillatorL = new Tone.OmniOscillator(
      Object.assign(
        {
          context: this.context,
          detune: options.detune,
        },
        options.oscillator
      )
    );

    // === Signals === //

    this.detune = new Tone.Signal({
      value: options.detune,
      units: "cents",
    });

    this._beatAdderNode = new Tone.Add(options.beatFrequency);

    this.beatFrequency = this._beatAdderNode.addend;

    this.baseFrequency = new Tone.Signal({
      value: options.baseFrequency,
      units: "frequency",
    });

    // === Connections === //

    this.envelope.connect(this.output);
    this._merge.connect(this.envelope);
    this.oscillatorR.connect(this._merge, 0, 0);
    this.oscillatorL.connect(this._merge, 0, 1);

    this.detune
      .connect(this.oscillatorL.detune)
      .connect(this.oscillatorR.detune);

    this._beatAdderNode.connect(this.oscillatorL.frequency);

    this.baseFrequency
      .connect(this._beatAdderNode)
      .connect(this.oscillatorR.frequency);

    // === Osc base to Channle Osc ===

    //this.oscillator.harmonicity?.fan(this.oscillatorL, this.oscillatorR)

    readOnly(this, [
      // "oscillatorR",
      // "oscillatorL",
      "baseFrequency",
      "beatFrequency",
      "detune",
      "envelope",
    ]);
  }

  static getDefaults(): BinauralBeatSynthOptions {
    return Object.assign(Instrument.getDefaults(), {
      envelope: Object.assign(
        omitFromObject(
          Tone.Envelope.getDefaults(),
          Object.keys(Tone.ToneAudioNode.getDefaults())
        ),
        {
          attack: 10,
          decay: 0,
          release: 10,
          sustain: 1,
        }
      ),
      oscillator: Object.assign(
        omitFromObject(Tone.OmniOscillator.getDefaults(), [
          ...Object.keys(Source.getDefaults()),
          "frequency",
          "detune",
        ]),
        {
          type: "sine",
        }
      ) as Tone.OmniOscillatorOptions,
      detune: 0,
      baseFrequency: 180,
      beatFrequency: 6,
    });
  }

  triggerAttackRelease(
    duration: Time,
    time?: Time,
    velocity?: NormalRange
  ): this {
    const computedTime = this.toSeconds(time);
    const computedDuration = this.toSeconds(duration);
    this.triggerAttack(computedTime, velocity);
    this.triggerRelease(computedTime + computedDuration);
    return this;
  }

  triggerAttack(time?: Time, velocity: NormalRange = 1): this {
    console.log("this info", this.channelCount);
    this.log("triggerAttack", time, velocity);
    const seconds = this.toSeconds(time);

    // the envelopes
    this.envelope.triggerAttack(seconds, velocity);
    this.oscillatorL.start(seconds);
    this.oscillatorR.start(seconds);
    // if there is no release portion, stop the oscillator
    if (this.envelope.sustain === 0) {
      const computedAttack = this.toSeconds(this.envelope.attack);
      const computedDecay = this.toSeconds(this.envelope.decay);
      const stopTime = seconds + computedAttack + computedDecay;

      this.oscillatorL.stop(stopTime);
      this.oscillatorR.stop(stopTime);
    }
    return this;
  }

  triggerRelease(time?: Time): this {
    this.log("triggerRelease", time);
    const seconds = this.toSeconds(time);

    this.envelope.triggerRelease(seconds);
    const stopTime = seconds + this.toSeconds(this.envelope.release);

    this.oscillatorL.stop(stopTime);
    this.oscillatorR.stop(stopTime);
    return this;
  }

  asArray() {
    return this.oscillatorR.asArray();
  }

  get oscillatorBaseType() {
    return this.oscillatorL.baseType;
  }

  set oscillatorBaseType(type) {
    this.oscillatorL.baseType = type;
    this.oscillatorR.baseType = type;
  }

  get oscillatorSourceType() {
    return this.oscillatorL.sourceType;
  }

  set oscillatorSourceType(sType) {
    this.oscillatorL.sourceType = sType;
    this.oscillatorR.sourceType = sType;
  }

  get oscillatorPartialCount(): number {
    return this.oscillatorL.partialCount;
  }

  set oscillatorPartialCount(p) {
    this.oscillatorL.partialCount = p;
    this.oscillatorR.partialCount = p;
  }

  get oscillatorCount() {
    return this.oscillatorL.count;
  }

  set oscillatorCount(c) {
    this.oscillatorL.count = c;
    this.oscillatorR.count = c;
  }

  get oscillatorSpread() {
    return this.oscillatorL.spread;
  }

  set oscillatorSpread(c) {
    this.oscillatorL.spread = c;
    this.oscillatorR.spread = c;
  }

  get oscillatorModulationType() {
    return this.oscillatorL.modulationType;
  }

  set oscillatorModulationType(c) {
    this.oscillatorL.modulationType = c;
    this.oscillatorR.modulationType = c;
  }

  get oscillatorModulationIndex() {
    return this.oscillatorL.modulationIndex?.value ?? 2;
  }

  set oscillatorModulationIndex(c: number) {
    if (
      isDefined(this.oscillatorL.modulationIndex) &&
      this.oscillatorR.modulationIndex
    ) {
      this.oscillatorL.modulationIndex.value = c;
      this.oscillatorR.modulationIndex.value = c;
    }
  }

  get oscillatorHarmonicity() {
    return this.oscillatorL.harmonicity?.value ?? 1;
  }

  set oscillatorHarmonicity(c: number) {
    if (
      isDefined(this.oscillatorL.harmonicity) &&
      this.oscillatorR.harmonicity
    ) {
      this.oscillatorL.harmonicity.value = c;
      this.oscillatorR.harmonicity.value = c;
    }
  }

  /**
   * clean up
   */
  dispose(): this {
    super.dispose();
    this.oscillatorL.dispose();
    this.oscillatorR.dispose();
    this.envelope.dispose();
    this._merge.dispose();

    return this;
  }
}
