import * as Tone from "tone";
import { useTrackToneNode } from "../../use/useTrackToneNode";

import { PlaybackTriggers } from "../Types";
import { getLogger } from "../../use/useLogger";
import { isDefined } from "@vueuse/core";
import { PatternName } from "tone/build/esm/event/PatternGenerator";
import { match, P } from "ts-pattern";


type BinBeatGenPatternEventFreq = {
  freq: number;
  rampTime: Tone.Unit.Time;
};

type BinBeatGenPatternEventBeat = {
  beatFreq: number;
  rampTime: Tone.Unit.Time;
};

export type UseBinBeatGenOptions = {
  frequency?: number;
  beatFreq?: number;
  eventHandler: PlaybackTriggers;
  patternLoop?: {
    humanize: Tone.Unit.Time;
    probability: Tone.Unit.NormalRange;
    interval: Tone.Unit.Time;
    pattern: PatternName;
    values: Array<BinBeatGenPatternEventBeat | BinBeatGenPatternEventFreq>;
  };
};

const logger = getLogger("tone.generators").getChildCategory("binBeat");

export function useBBGen01(
  generatorName: string,
  options: UseBinBeatGenOptions
) {
  const { frequency = 200, beatFreq = 4, eventHandler, patternLoop } = options;

  console.debug(`Init BinBeat Gen ${generatorName}`);

  const channel = new Tone.Channel({
    volume: -20,
    mute: false,
  });

  channel.send("main");

  const envNode = new Tone.AmplitudeEnvelope({
    attack: 4,
    decay: 0,
    sustain: 0.5,
    release: 4,
    attackCurve: "sine",
    releaseCurve: "sine",
  }).connect(channel);

  // const gainNode = new Tone.Gain(0.2).connect(envNode)
  const merge = new Tone.Merge().connect(envNode);
  // const pannerR = new Tone.Panner(1).connect()

  const oscGenR = new Tone.OmniOscillator({
    type: "sine",
    frequency,
  })
    .connect(merge, 0, 0)
    .sync();

  const oscGenL = new Tone.OmniOscillator({
    type: "sine",
    frequency,
  })
    .connect(merge, 0, 1)
    .sync();

  // === Signals === //

  const signalFreq = new Tone.Signal({
    value: frequency,
    units: "frequency",
  }).connect(oscGenR.frequency);

  const add = new Tone.Add(beatFreq).connect(oscGenL.frequency);

  signalFreq.connect(add);

  // === Playback === //

  function start() {
    console.info("start");

    if (oscGenL.state === "stopped") {
      oscGenR.start("+0.1");
      oscGenL.start("+0.1");
    }

    envNode.triggerAttack("+0.2");

    envNode.set({
      release: 4,
      attack: 4,
    });
  }

  function stop() {
    console.info("stop");

    oscGenR.stop("+8.1");
    oscGenL.stop("+8.1");

    envNode.triggerRelease("+0.1");
  }

  function pause() {
    console.info("paused");

    envNode.set({
      release: 2.5,
      attack: 2.5,
    });

    envNode.triggerRelease("+0.1");
  }

  // const mutedCtrl = customRef((track, trigger) => {
  //   return {with
  //     get() {
  //       track()
  //       return channel.mute
  //     },
  //     set(mute) {
  //       console.log("BB Mute %o channel %o", mute, channel.mute);
  //       channel.set({
  //         mute,
  //       });
  //       trigger()
  //     }
  //   }
  // })

  if (isDefined(patternLoop)) {
    const { values, humanize, probability, interval } = patternLoop;

    const tonePattern = new Tone.Pattern<
      BinBeatGenPatternEventBeat | BinBeatGenPatternEventFreq
    >({
      values,
      humanize,
      probability,
      interval,
      callback: (time, value) => {
        console.log(
          "%o Pattern Triggered - time %o value %o",
          generatorName,
          time,
          value
        );
        match(value)
          .with(
            {
              freq: P.number.positive(),
              rampTime: P.not(P.nullish),
            },
            ({ freq, rampTime }) => {
              signalFreq.rampTo(freq, rampTime, time);
            }
          )
          .with(
            {
              beatFreq: P.number.positive(),
              rampTime: P.not(P.nullish),
            },
            ({ beatFreq, rampTime }) => {
              add.addend.rampTo(beatFreq, rampTime, time);
            }
          )
          .otherwise((event) => console.warn("Unknown pattern %o", event));
      },
    });

    eventHandler.onPlayBackStarted((time) => tonePattern.start(time));
    eventHandler.onPlayBackPaused((time) => tonePattern.stop(time));
  }

  eventHandler.onPlayBackStarted(() => start());
  eventHandler.onPlayBackPaused(() => pause());
  eventHandler.onPlayBackStopped(() => stop());

  const muteCtrl = useTrackToneNode(channel, "mute", false);

  return {
    generatorName,
    muteCtrl,
  };
}
