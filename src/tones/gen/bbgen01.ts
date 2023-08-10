import * as Tone from "tone";

export function useBBGen01(frequency = 180, bb = 4) {
  const channel = new Tone.Channel(-44).send("main");
  const env = new Tone.AmplitudeEnvelope({
    attack: 30,
    decay: 0,
    sustain: 0.5,
    release: 30,
    attackCurve: "sine",
    releaseCurve: "sine",
  }).connect(channel);
  const merge = new Tone.Merge().connect(env)
  // const pannerR = new Tone.Panner(1).connect()

  const oscGenR = new Tone.Oscillator({
    type: "sine",
    frequency,
  }).connect(merge, 0, 0).sync()

  const oscGenL = new Tone.Oscillator({
    type: "sine",
    frequency,
  }).connect(merge, 0, 1).sync()

  //=== Signals ===

  const signalFreq = new Tone.Signal({
    value: "300",
    units: "frequency",
  }).connect(oscGenR.frequency);

  const add = new Tone.Add(bb).connect(oscGenL.frequency);

  signalFreq.connect(add);



  // 

  function start() {
    oscGenR.start();
    oscGenL.start();

    env.triggerAttack("+1");
  }

  function stop() {
    env.triggerRelease();
  }

  function pause() {
    oscGenR.stop();
    oscGenL.stop();

    env.triggerRelease()
  }

  return {
    start,
    stop,
    pause,
  };
}
