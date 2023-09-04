import * as Tone from "tone";

import { PlaybackTriggers } from "@/types/PlaybackState";
import { noop } from "@vueuse/core";
import { LoopEventValue, LooppingEventsOptions } from "@/types/GeneratorSignals";

type LoopDefaultOptions = {
  iterations: number
}

export function setupLoopEventsHandlers<E>(
  eventHandler: PlaybackTriggers,
  loopEvents: LooppingEventsOptions<E> | undefined,
  callback: Tone.ToneEventCallback<LoopEventValue<E> | undefined>,
  loopDefaultOptions?: LoopDefaultOptions
) {
  if (isDefined(loopEvents)) {
    const { values, humanize, probability, interval, pattern } = loopEvents;
    

    const tonePattern = new Tone.Pattern({
      pattern,
      values,
      humanize,
      probability,
      interval,
      callback,
      iterations: loopDefaultOptions?.iterations ?? Infinity
    });

    eventHandler.onPlayBackStarted(({ initialize }) => {
      if (initialize) {
        tonePattern.start();
      }
    });
    eventHandler.onPlayBackStopped((time) => tonePattern.stop(time));

    return () => tonePattern.dispose()
  }

  return noop
}
