import * as Tone from "tone";
import { RecursivePartial } from "tone/build/esm/core/util/Interface";
import {
  Instrument,
  InstrumentOptions,
} from "tone/build/esm/instrument/Instrument";

import bell_mallett_1 from "@/assets/berklee/bell_mallett_1.wav";
import gong1 from "@/assets/berklee/cakelid_gong1.wav";
import cookieTin2 from "@/assets/berklee/CookieTin2.wav";
import iron_bell1 from "@/assets/berklee/iron_bell1.wav";
import tinybell5 from "@/assets/berklee/tinybell5.wav";

const sampleLookup = {
  bell_mallett_1: bell_mallett_1,
  gong1: gong1,
  cookieTin2: cookieTin2,
  iron_bell1: iron_bell1,
  tinybell5: tinybell5,
};

export type PlayersInstOptions = InstrumentOptions & {
  sample: keyof typeof sampleLookup;
  // player: Omit<Tone.PlayerOptions, keyof Tone.ToneAudioNodeOptions>;
  count: number;
};

export class PlayersInst extends Instrument<PlayersInstOptions> {
  readonly name: string = "PlayersInst";

  readonly players: Tone.Players;
  readonly playerNames: Array<string>;

  readonly _lastUsedName: Array<string>;

  /**
   * @param options the options available for the synth.
   */
  constructor(options?: RecursivePartial<PlayersInstOptions>);
  constructor() {
    super(Tone.optionsFromArguments(PlayersInst.getDefaults(), arguments));
    const options = Tone.optionsFromArguments(
      PlayersInst.getDefaults(),
      arguments
    );

    this._lastUsedName = [];
    this.playerNames =Array.from({ length: options.count }, (_v, i) => `player${i}`); 
    
    this.players = new Tone.Players();

    this.playerNames.forEach((name) => {
      this.players.add(name, sampleLookup[options.sample]);
    });
  }

  static getDefaults(): PlayersInstOptions {
    return Object.assign(Instrument.getDefaults(), {
      sample: "iron_bell1" as const,
      count: 3,
    });
  }

  triggerAttackRelease(duration: Tone.Unit.Time, time?: Tone.Unit.Time): this {
    const computedTime = this.toSeconds(time);
    const computedDuration = this.toSeconds(duration);
    this.triggerAttack(computedTime);
    this.triggerRelease(computedTime + computedDuration);
    return this;
  }

  triggerAttack(time?: Tone.Unit.Time): this {
    const name = this._nextPlayerName();

    const player = this.players.player(name);

    player.start(time);

    console.log(player.fadeIn, player.loaded, player.buffer.duration)
    return this;
  }

  triggerRelease(time?: Tone.Unit.Time): this {
    if (this.players.state === "started") {
      this.playerNames.forEach((p) => this.players.player(p).stop(time));
    }

    return this;
  }

  private _nextPlayerName() {
    const name = this.playerNames.find(
      (n) => !this._lastUsedName.find((l) => l === n)
    );
    if (isDefined(name)) {
      this._lastUsedName.push(name);
      return name;
    }

    const altName = this._lastUsedName.shift();
    if (isDefined(altName)) {
      return altName;
    }

    return this.playerNames[0];
  }

  /**
   * clean up
   */
  dispose(): this {
    super.dispose();
    this.players.stopAll();
    this.players.dispose();

    return this;
  }
}
