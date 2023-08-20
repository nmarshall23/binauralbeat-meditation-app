import * as Tone from "tone";

import { BinauralBeatwLoopOscOptions, PlaybackTriggers } from "@/types/GeneratorDef";
import { useTrackToneNode } from "@/use/useTrackToneNode";
import { isMatching, P } from "ts-pattern";
import { useVolumeControl } from "@/use/useVolumeControl";


const defaultVolume = -18;

export function createBinauralBeatwLoop(
  generatorName: string,
  eventHandler: PlaybackTriggers,
  options: BinauralBeatwLoopOscOptions
) {
  const { gain, beatFreq, osc: oscOptions, loopEvents } = options;

  console.debug(
    `createBinauralBeatwLoop ${generatorName} gain %o, opt %o`,
    gain,
    options
  );

  const channel = new Tone.Channel(defaultVolume);

  channel.send("main");

  // const channelGainNode = new Tone.Gain(gain).connect(channel)

  const envNode = new Tone.AmplitudeEnvelope({
    attack: 4,
    decay: 0,
    sustain: 0.5,
    release: 4,
    attackCurve: "sine",
    releaseCurve: "sine",
  }).connect(channel);

  const merge = new Tone.Merge().connect(envNode);

  const oscGenR = new Tone.OmniOscillator({
    type: "sine",
    ...oscOptions,
  })
    .connect(merge, 0, 0)
    .sync();

  const oscGenL = new Tone.OmniOscillator({
    type: "sine",
    ...oscOptions,
  })
    .connect(merge, 0, 1)
    .sync();

  // === Signals === //

  const freqSignal = new Tone.Signal({
    value: oscOptions.frequency,
    units: "frequency",
  }).connect(oscGenR.frequency);

  const add = new Tone.Add(beatFreq).connect(oscGenL.frequency);

  freqSignal.connect(add);

  // === Playback === //

  eventHandler.onPlayBackStarted(() => {
    if (oscGenR.state === "stopped") {
      oscGenR.start("+0.1");
      oscGenL.start("+0.1");
    }

    envNode.set({
      release: 10,
      attack: 5,
    });

    envNode.triggerAttack("+0.2");
  });

  eventHandler.onPlayBackPaused(() => {
    envNode.set({
      release: 2,
      attack: 2,
    });

    envNode.triggerRelease("+0.1");
  });

  eventHandler.onPlayBackStopped(() => {
    oscGenR.start("+4");
    oscGenL.start("+4");

    envNode.triggerRelease("+0.1");
  });

  if (isDefined(loopEvents)) {
    const { values, humanize, probability, interval, pattern } = loopEvents;

    const tonePattern = new Tone.Pattern({
      pattern,
      values,
      humanize,
      probability,
      interval,
      callback: (time, event) => {
        console.log(
          "%o Pattern Triggered - time %o event %o",
          generatorName,
          time,
          event
        );

        if (isMatching(beatFreqEventPattern, event)) {
          add.addend.rampTo(event.beatFreq, event.rampTime, time);
        }

        if (isMatching(frequencyEventPattern, event)) {
          freqSignal.rampTo(event.frequency, event.rampTime, time);
        }

        // if (isMatching(gainEventPattern, event)) {
        //   console.log("channelGainNode.gain %o", channelGainNode.gain.value);
        //   channelGainNode.gain.rampTo(event.gain, event.rampTime, time);
        // }
      },
    });

    eventHandler.onPlayBackStarted((time:number) => tonePattern.start(time));
    eventHandler.onPlayBackPaused((time:number) => tonePattern.stop(time));
  }

  /* === Dispay === */

  const displayName = computed(() => {
    return `${generatorName} - ${beatFreq}Hz`;
  });

  /* === Controls === */

  const muteCtrl = useTrackToneNode(channel, "mute", false);

  const { volumeRef } = useVolumeControl(channel.volume, {
    defaultValue: gain,
  });

  function dispose() {
    channel.dispose();
  }

  return reactive({
    generatorName: displayName,
    muteCtrl,
    volumeCtrl: volumeRef,
    dispose,
  });
}

const beatFreqEventPattern = {
  beatFreq: P.number,
};

const frequencyEventPattern = {
  frequency: P.number,
};

// const gainEventPattern = {
//   gain: P.number,
// };
