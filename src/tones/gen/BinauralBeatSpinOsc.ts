import * as Tone from "tone";

import { isMatching, P } from "ts-pattern";
import { useTrackToneNode } from "@/use/useTrackToneNode";
import { useVolumeControl } from "@/use/useVolumeControl";
import { PlaybackTriggers, BinauralBeatSpinOscOptions } from "@/types/GeneratorDef";

const defaultVolume = -18;

export function createBinauralBeatSpinOsc(
  generatorName: string,
  eventHandler: PlaybackTriggers,
  options: BinauralBeatSpinOscOptions
) {
  const {
    gain,
    beatFreq,
    spinCrossFade = 1,
    spinCycle = 0.1,
    osc: oscOptions,
    loopEvents,
  } = options;

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

  const spinCrossFadeNode = new Tone.CrossFade(spinCrossFade).connect(envNode);

  const mergeSpinEffect = new Tone.Merge().connect(spinCrossFadeNode.b);
  const mergeNorm = new Tone.Merge().connect(spinCrossFadeNode.a);

  const pannerRNode = new Tone.Panner(1).connect(mergeSpinEffect, 0, 0);
  const pannerLNode = new Tone.Panner(-1).connect(mergeSpinEffect, 0, 1);

  const oscGenR = new Tone.OmniOscillator({
    type: "sine",
    ...oscOptions,
  })
    .connect(mergeNorm, 0, 0)
    .connect(pannerRNode)
    .sync();

  const oscGenL = new Tone.OmniOscillator({
    type: "sine",
    ...oscOptions,
  })
    .connect(mergeNorm, 0, 1)
    .connect(pannerLNode)
    .sync();

  // === Signals === //

  const freqSignal = new Tone.Signal({
    value: oscOptions.frequency,
    units: "frequency",
  }).connect(oscGenR.frequency);

  const add = new Tone.Add(beatFreq).connect(oscGenL.frequency);

  freqSignal.connect(add);

  // === Panner input ===

  const lfoNode = new Tone.LFO(spinCycle, -1, 1).start();

  lfoNode.connect(pannerRNode.pan);

  const negNode = new Tone.Negate().connect(pannerLNode.pan);

  lfoNode.connect(negNode);

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
          "%o Pattern Triggered - time %o event.rampTime %o event.signal %o",
          generatorName,
          time,
          event?.rampTime,
          event?.signal
        );

        if (isMatching(beatFreqEventPattern, event)) {
          add.addend.rampTo(event.signal.beatFreq, event.rampTime, time);
        }

        if (isMatching(frequencyEventPattern, event)) {
          freqSignal.rampTo(event.signal.frequency, event.rampTime, time);
        }

        if (isMatching(spinCrossFadeEventPattern, event)) {
          spinCrossFadeNode.fade.rampTo(
            event.signal.spinCrossFade,
            event.rampTime,
            time
          );
        }

        if (isMatching(spinCycleEventPattern, event)) {
          lfoNode.frequency.rampTo(
            event.signal.spinCycle,
            event.rampTime,
            time
          );
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
  signal: {
    beatFreq: P.number,
  },
};

const frequencyEventPattern = {
  signal: {
    frequency: P.number,
  },
};

const spinCrossFadeEventPattern = {
  signal: {
    spinCrossFade: P.number,
  },
};

const spinCycleEventPattern = {
  signal: {
    spinCycle: P.number,
  },
};
