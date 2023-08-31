import * as Tone from "tone";

import { PlaybackTriggers } from "@/types/PlaybackState";
import { LoopEventValue, LooppingEventsOptions } from "@/types/LoopPattern";

export function setupLoopEventsHandlers<E>(
  eventHandler: PlaybackTriggers,
  loopEvents: LooppingEventsOptions<E> | undefined,
  callback: Tone.ToneEventCallback<LoopEventValue<E>| undefined>
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

    eventHandler.onPlayBackStarted(({ time }) => tonePattern.start(time));
    eventHandler.onPlayBackPaused((time) => tonePattern.stop(time));
  }
}
