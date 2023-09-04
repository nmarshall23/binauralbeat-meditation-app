import { GeneratorControls } from "@/types/GeneratorControls";
import { SamplePlayerGenerator } from "@/types/GeneratorDef";
import {
  LoopEventValue,
  SamplePlayerEventSignal,
} from "@/types/GeneratorSignals";
import { PlaybackTriggers } from "@/types/PlaybackState";
import { setupEventSequenceHandlers } from "@/use/setupEventSequenceHandlers";
import { setupLoopEventsHandlers } from "@/use/setupLoopEventsHandlers";
import {
  eventMatcherGain,
  eventMatcherPanner3dPositionX,
  eventMatcherPanner3dPositionY,
  eventMatcherPanner3dPositionZ,
  eventMatcherPitchShiftPitch,
  eventMatcherPitchShiftWet,
  eventMatcherStartLoopBool,
  eventMatcherStartLoopPatten,
  eventMatcherStartSample,
} from "@/use/useLoopEventMatchers";
import { useTrackToneNode } from "@/use/useTrackToneNode";
import { useVolumeControl } from "@/use/useVolumeControl";
import * as Tone from "tone";
import { isMatching, match, Pattern } from "ts-pattern";
import { capitalCase } from "change-case";

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

export type SamplePlayerSampleKey = keyof typeof sampleLookup;

export function createPlayerGen(
  generatorName: string,
  eventHandler: PlaybackTriggers,
  options: SamplePlayerGenerator
): GeneratorControls {
  const {
    gain = 1,
    player,
    pichShift,
    panner3d,
    loopEvents,
    eventSequence,
  } = options;

  console.debug(
    `createNoiseFilteredGen ${generatorName} gain %o, opt %o`,
    gain,
    toRaw(options)
  );

  const channel = new Tone.Channel();

  const gainNode = new Tone.Gain(1);

  const panner3dNode = new Tone.Panner3D(panner3d);

  const pichShiftNode = new Tone.PitchShift(pichShift?.pich);
  pichShiftNode.wet.value = isDefined(pichShift) ? 1 : 0;

  const playerNode = new Tone.Player(sampleLookup[player.sample]);

  // === Signals === //

  //   function calcPanner3dOrient() {
  //     if (
  //       Math.abs(panner3dNode.positionX.value) > 0 &&
  //       Math.abs(panner3dNode.positionZ.value) > 0
  //     ) {
  //         const a = Math.abs(panner3dNode.positionZ.value)
  //         const b = Math.abs(panner3dNode.positionX.value)

  //         // const c = a ^ 2 + b ^ 2

  //         const g = Math.atan(a / b )

  //         const [rotX, rotZ] = match({
  //             signX: Math.sign(panner3dNode.positionX.value),
  //             signZ: Math.sign(panner3dNode.positionZ.value)
  //         }).with({
  //             signX: 0,
  //             signZ: 0,
  //         }, () => {
  //             return [0, 0]
  //         }).with({
  //             signX: -1,
  //             signZ: 0,
  //         }, () => {
  //             return [0, 0]
  //         })
  //     }
  //   }

  // === Connections === //

  channel.send("main");
  playerNode.chain(pichShiftNode, panner3dNode, gainNode, channel);

  /* === eventHandler  === */
  eventHandler.onPlayBackStarted(() => {
    playerNode.fadeOut = 0;
  });

  eventHandler.onPlayBackStopped((time) => {
    if (playerNode.state === "started") {
      playerNode.fadeOut = 2;
      playerNode.stop(time);
    }
  });

  eventHandler.onPlayBackPaused((time) => {
    if (playerNode.state === "started") {
      playerNode.fadeOut = 2;
      playerNode.stop(time);
    }
  });

  // === Playback Events === //

  function eventCallBack<E extends LoopEventValue<SamplePlayerEventSignal>>(
    eventType: string,
    time: number,
    event: E | undefined
  ) {
    console.log(
      "%o %o Triggered - Time %o, event.rampTime: %o event.signal %o",
      eventType,
      generatorName,
      Math.floor(time),
      event?.rampTime,
      toRaw(event?.signal)
    );

    if (isMatching(eventMatcherGain, event)) {
      const { rampTime, signal } = event;
      gainNode.gain.rampTo(signal.gain, rampTime, time);
    }

    if (isMatching(eventMatcherPitchShiftPitch, event)) {
      const { signal } = event;
      pichShiftNode.pitch = signal.pitchShift.pitch;
    }

    if (isMatching(eventMatcherPitchShiftWet, event)) {
      const { rampTime, signal } = event;
      pichShiftNode.wet.rampTo(signal.pitchShift.wet, rampTime, time);
    }

    if (isMatching(eventMatcherPanner3dPositionX, event)) {
      const { rampTime, signal } = event;
      panner3dNode.positionX.rampTo(signal.panner3d.positionX, rampTime, time);
    }

    if (isMatching(eventMatcherPanner3dPositionY, event)) {
      const { rampTime, signal } = event;
      panner3dNode.positionY.rampTo(signal.panner3d.positionY, rampTime, time);
    }

    if (isMatching(eventMatcherPanner3dPositionZ, event)) {
      const { rampTime, signal } = event;
      panner3dNode.positionZ.rampTo(signal.panner3d.positionZ, rampTime, time);
    }

    if (isMatching(eventMatcherStartSample, event)) {
      if (playerNode.state === "started") {
        playerNode.restart(time);
      } else {
        playerNode.start(time);
      }
    }

    if (isMatching(eventMatcherStartLoopPatten, event)) {
      const { signal } = event;
      if (isDefined(tonePattern)) {
        tonePattern.pattern = signal.startLoop.pattern;
      }
    }

    if (isMatching(eventMatcherStartLoopBool, event)) {
      console.log("eventMatcherStartLoopBool ", isDefined(tonePattern));
      if (isDefined(tonePattern)) {
        tonePattern.start(time);
      }
    }
  }

  // calc iterations

  const iterationsMuli = match(loopEvents?.pattern)
    .with(Pattern.union("upDown", "downUp"), () => 2)
    .with(Pattern.union("alternateUp", "alternateDown"), () => 0.5)
    .otherwise(() => 1);

  const iterations = (loopEvents?.values.length ?? 0) * iterationsMuli;

  const { disposePattern, tonePattern } = setupLoopEventsHandlers(
    eventHandler,
    loopEvents,
    (time, event) => eventCallBack("Loop", time, event),
    { iterations }
  );

  const disposePart = setupEventSequenceHandlers(
    eventHandler,
    eventSequence,
    (time: number, event) => eventCallBack("Event Sequence", time, event)
  );

  /* === Dispay === */

  const displayName = computed(() => {
    return `${generatorName} - ${capitalCase(player.sample)}`;
  });

  /* === Controls === */

  const muteCtrl = useTrackToneNode(channel, "mute", false);

  const { volumeRef } = useVolumeControl(channel.volume);

  function dispose() {
    channel.disconnect();
    channel.dispose();
    playerNode.dispose();
    disposePart();
    disposePattern();
  }

  return reactive({
    generatorName: displayName,
    type: "BinauralBeatSpinOsc",
    muteCtrl,
    volumeCtrl: volumeRef,
    dispose,
  });
}
