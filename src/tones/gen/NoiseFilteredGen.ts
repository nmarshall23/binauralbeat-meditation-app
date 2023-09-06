import * as Tone from "tone";
import { NoiseFilteredGenOptions } from "@/types/GeneratorDef";
import { capitalCase } from "change-case";
import { useVolumeControl } from "@/use/useVolumeControl";
import { useTrackToneNode } from "@/use/useTrackToneNode";
import {
  GeneratorControls,
  GeneratorCtrlNoiseWithFilterOptions,
} from "@/types/GeneratorControls";
import { PlaybackTriggers } from "@/types/PlaybackState";
import { isMatching } from "ts-pattern";
import {
  eventMatcherFilterDetune,
  eventMatcherFilterFrequency,
  eventMatcherFilterGain,
  eventMatcherFilterQ,
  eventMatcherFilterWet,
  eventMatcherGain,
} from "@/use/useLoopEventMatchers";

import { setupLoopEventsHandlers } from "@/use/setupLoopEventsHandlers";
import { FilterEffect } from "../effect/filterEffect";
import {
  EventValueType,
  NoiseFilteredGenEventSignal,
} from "@/types/GeneratorSignals";
import { setupEventSequenceHandlers } from "@/use/setupEventSequenceHandlers";
import { logicNot } from "@vueuse/math";
import { RecursivePartial } from "tone/build/esm/core/util/Interface";

export function createNoiseFilteredGen(
  generatorName: string,
  eventHandler: PlaybackTriggers,
  options: NoiseFilteredGenOptions
): GeneratorControls {
  const {
    gain = 1,
    noise: noiseOptions,
    filter: filterOptions,
    loopEvents,
    eventSequence,
  } = options;

  console.debug(
    `createNoiseFilteredGen ${generatorName} gain %o, opt %o`,
    gain,
    toRaw(options)
  );

  const channel = new Tone.Channel();

  const gainNode = new Tone.Gain(gain);

  const filterEffectNode = new FilterEffect({
    filter: filterOptions,
    //wet: filterOptions?.wet ?? 1,
  });

  const noiseSythNode = new Tone.NoiseSynth({
    envelope: {
      attack: 30,
      decay: 0,
      sustain: 1,
      release: 30,
    },
    noise: noiseOptions,
  });

  // === Connections === //

  channel.send("main");
  noiseSythNode.chain(filterEffectNode, gainNode, channel);

  /* === === */

  // === Playback === //

  eventHandler.onPlayBackStarted((event) => {
    noiseSythNode.triggerAttack(event.time);
  });

  eventHandler.onPlayBackPaused((time) => {
    noiseSythNode.triggerRelease(time);
  });
  eventHandler.onPlayBackStopped((time) => {
    noiseSythNode.triggerRelease(time);
  });

  function eventCallBack(
    eventType: string,
    time: number,
    event: EventValueType<NoiseFilteredGenEventSignal>
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

    if (isMatching(eventMatcherFilterFrequency, event)) {
      const { rampTime, signal } = event;
      filterEffectNode.frequency.rampTo(
        signal.filter.frequency,
        rampTime,
        time
      );
    }

    if (isMatching(eventMatcherFilterQ, event)) {
      const { rampTime, signal } = event;
      filterEffectNode.Q.rampTo(signal.filter.Q, rampTime, time);
    }

    if (isMatching(eventMatcherFilterGain, event)) {
      const { rampTime, signal } = event;
      filterEffectNode.gain.rampTo(signal.filter.gain, rampTime, time);
    }

    if (isMatching(eventMatcherFilterDetune, event)) {
      const { rampTime, signal } = event;
      filterEffectNode.detune.rampTo(
        signal.filter.detune,
        rampTime,
        time
      );
    }

    if (isMatching(eventMatcherFilterWet, event)) {
      const { rampTime, signal } = event;
      filterEffectNode.wet.rampTo(signal.filter.wet, rampTime, time);
    }
  }

  const { disposePattern } = setupLoopEventsHandlers(
    eventHandler,
    loopEvents,
    (time, event) =>
      eventCallBack(
        "Loop",
        time,
        event as EventValueType<NoiseFilteredGenEventSignal>
      )
  );

  const disposePart = setupEventSequenceHandlers(
    eventHandler,
    eventSequence,
    (time: number, event) =>
      eventCallBack(
        "Event Sequence",
        time,
        event as EventValueType<NoiseFilteredGenEventSignal>
      )
  );

  /* === Dispay === */

  const displayName = computed(() => {
    return `${generatorName} - ${capitalCase(noiseSythNode.noise.type)}`;
  });

  /* === Controls === */

  const muteCtrl = useTrackToneNode(channel, "mute", false);

  const { volumeRef } = useVolumeControl(channel.volume);

  function dispose() {
    channel.dispose();
    disposePart();
    disposePattern();
  }

  function updateOptions(options: RecursivePartial<GeneratorCtrlNoiseWithFilterOptions>) {
    console.log("updateOptions options: %o", options);
    noiseSythNode.noise.type = options.noise?.type ?? 'white';
    filterEffectNode.wet.value = options?.filter?.wet ?? 0;
    filterEffectNode.frequency.value = options?.filter?.frequency ?? 200
    filterEffectNode.type = options?.filter?.type ?? 'lowpass'
    filterEffectNode.Q.value = options?.filter?.Q ?? 1
    filterEffectNode.gain.value = options?.filter?.gain ?? 0
    

    // if (isDefined(options.noise)) {
    //   noiseSythNode.noise.type = options.noise.type ?? 'white';
    // }

    // if (isDefined(options.filter) && isDefined(options.filter.wet)) {
    //   filterEffectNode.wet.value = options.filter.wet;
    // }

    // if (isDefined(options.filter) && isDefined(options.filter.frequency)) {
    //   filterEffectNode.filter.frequency.value = options.filter.frequency;
    // }

    // if (isDefined(options.filter) && isDefined(options.filter.type)) {
    //   filterEffectNode.filter.type = options.filter.type;
    // }

    // if (isDefined(options.filter) && isDefined(options.filter.Q)) {
    //   filterEffectNode.filter.Q.value = options.filter.Q;
    // }

    // if (isDefined(options.filter) && isDefined(options.filter.gain)) {
    //   filterEffectNode.filter.gain.value = options.filter.gain;
    // }

    console.log(
      "updateOptions - noiseSythNode.noise.type %o filterEffectNode.wet %o",
      noiseSythNode.noise.type,
      filterEffectNode.wet.value
    );
  }

  function getOptionValues() {
    return {
      noise: {
        type: noiseSythNode.noise.type,
      },
      filter: {
        wet: filterEffectNode.wet.value,
        frequency: filterEffectNode.frequency.value,
        type: filterEffectNode.type,
        Q: filterEffectNode.Q.value,
        gain: filterEffectNode.gain.value,
      },
    };
  }

 

  const [isGenTestEnabled, toggleGenSoundTest] = useToggle()

  whenever(isGenTestEnabled, () => {
    noiseSythNode.triggerAttack();
    console.log('getOptionValues %o', getOptionValues())
  })

  whenever(logicNot(isGenTestEnabled), () => {
    noiseSythNode.triggerRelease()
  })

  return reactive({
    generatorName: displayName,
    type: "NoiseFilteredGen",
    muteCtrl,
    volumeCtrl: volumeRef,
    dispose,
    hasOptions: true,
    updateOptions,
    getOptionValues,
    toggleGenSoundTest,
    loopEvents,
    eventSequence,
  });
}
