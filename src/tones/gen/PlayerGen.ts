import { GeneratorControls } from "@/types/GeneratorControls";
import { SamplePlayerGenerator } from "@/types/GeneratorDef";
import {
  EventValueType,
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
  eventMatcherStartLoopBool,
  eventMatcherStartLoopPatten,
  eventMatcherStartSample,
} from "@/use/useLoopEventMatchers";
import { useTrackToneNode } from "@/use/useTrackToneNode";
import { useVolumeControl } from "@/use/useVolumeControl";
import * as Tone from "tone";
import { isMatching } from "ts-pattern";

export function createPlayerGen(
  generatorName: string,
  eventHandler: PlaybackTriggers,
  options: SamplePlayerGenerator
): GeneratorControls {
  const { gain = 1, loopEvents, eventSequence } = options;

  console.debug(
    `createNoiseFilteredGen ${generatorName} gain %o, opt %o`,
    gain,
    toRaw(options)
  );

  const channel = new Tone.Channel();

  const gainNode = new Tone.Gain(1);

  const panner3D = new Tone.Panner3D();

  const sample = "cakelid_gong1";

  const playerNode = new Tone.Player(`/${sample}.wav`);

  // === Connections === //

  channel.send("main");
  playerNode.chain(panner3D, gainNode, channel);

  /* === === */

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

    if (isMatching(eventMatcherStartSample, event)) {
    }

    if (isMatching(eventMatcherStartLoopBool, event)) {
      // const { rampTime, signal } = event;
    }

    if (isMatching(eventMatcherStartLoopPatten, event)) {
      // const { rampTime, signal } = event;
    }

    if (isMatching(eventMatcherPanner3dPositionX, event)) {
      const { rampTime, signal } = event;
      panner3D.positionX.rampTo(signal.panner3d.positionX, rampTime, time);
    }

    if (isMatching(eventMatcherPanner3dPositionY, event)) {
      const { rampTime, signal } = event;
      panner3D.positionX.rampTo(signal.panner3d.positionY, rampTime, time);
    }

    if (isMatching(eventMatcherPanner3dPositionZ, event)) {
      const { rampTime, signal } = event;
      panner3D.positionX.rampTo(signal.panner3d.positionZ, rampTime, time);
    }
  }

  const disposePattern = setupLoopEventsHandlers(
    eventHandler,
    loopEvents,
    (time, event) => eventCallBack("Loop", time, event)
  );

  const disposePart = setupEventSequenceHandlers(
    eventHandler,
    eventSequence,
    (time: number, event) => eventCallBack("Event Sequence", time, event)
  );

  /* === Dispay === */

  const displayName = computed(() => {
    return `${generatorName} - ${sample}`;
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
