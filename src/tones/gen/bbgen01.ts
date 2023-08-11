import * as Tone from "tone";

export function useBBGen01(frequency = 200, bb = 4) {
  const channel = new Tone.Channel(-44).send("main");

  const envNode = new Tone.AmplitudeEnvelope({
    attack: 30,
    decay: 0,
    sustain: 0.5,
    release: 30,
    attackCurve: "sine",
    releaseCurve: "sine",
  }).connect(channel);

  const gainNode = new Tone.Gain(0.2).connect(envNode)
  const merge = new Tone.Merge().connect(gainNode)
  // const pannerR = new Tone.Panner(1).connect()

  const oscGenR = new Tone.OmniOscillator({
    type: "sine",
    frequency,
  }).connect(merge, 0, 0).sync()

  const oscGenL = new Tone.OmniOscillator({
    type: "sine",
    frequency,
  }).connect(merge, 0, 1).sync()

  //=== Signals ===

  const signalFreq = new Tone.Signal({
    value: frequency,
    units: "frequency",
  }).connect(oscGenR.frequency);

  const add = new Tone.Add(bb).connect(oscGenL.frequency);

  signalFreq.connect(add);


  function start() {
    oscGenR.start('+0.1');
    oscGenL.start('+0.1');

    envNode.set({
      release: 8,
      attack: 8,
    });
    envNode.triggerAttack("+0.2");
  }

  function stop() {
    oscGenR.stop("+8.1");
    oscGenL.stop("+8.1");

    envNode.triggerRelease('+0.1');
  }

  function pause() {
    oscGenR.stop("+2.1");
    oscGenL.stop("+2.1");

    envNode.set({
      release: 2,
      attack: 2,
    });

    envNode.triggerRelease("+0.1")
  }

  return {
    start,
    stop,
    pause,
  };
}
