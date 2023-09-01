import * as Tone from "tone";

import { PlaybackTriggers } from "@/types/PlaybackState";
import { LoopEventValue, LooppingEventsOptions } from "@/types/LoopPattern";
import { noop } from "@vueuse/core";

export function setupLoopEventsHandlers<E>(
  eventHandler: PlaybackTriggers,
  loopEvents: LooppingEventsOptions<E> | undefined,
  callback: Tone.ToneEventCallback<LoopEventValue<E> | undefined>
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
