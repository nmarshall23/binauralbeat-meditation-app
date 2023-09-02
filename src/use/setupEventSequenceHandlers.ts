import * as Tone from "tone";

import { EventSequence, EventValueType } from "@/types/LoopPattern";
import { PlaybackTriggers } from "@/types/PlaybackState";
import { Pattern, match } from "ts-pattern";
import { useProgramDurationStore } from "@/state/programDuration";
import { noop } from "@vueuse/core";

export function setupEventSequenceHandlers<E>(
  eventHandler: PlaybackTriggers,
  eventSequence: EventSequence<E> | undefined,
  callback: Tone.ToneEventCallback<EventValueType<E>>
) {
  if (isDefined(eventSequence)) {
    const {
      startOffsetSeconds = 0,
      loop,
      loopEnd,
      loopStart,
      events,
    } = eventSequence;

    const { duration } = useProgramDurationStore();

    const part = new Tone.Part({
      loop,
      loopEnd,
      loopStart,
      events: recalcEventTime(duration.value, events),
      callback,
    });

    eventHandler.onPlayBackStarted(({ initialize }) => {
      if (initialize) {
        part.start(`+${startOffsetSeconds}`);
      }
    });
    eventHandler.onPlayBackStopped((time) => part.stop(time));

    return () => part.dispose()
  }
  return noop
}

function recalcEventTime<E>(totalSeconds: number, events: EventValueType<E>[]) {
  return events.map((i) =>
    match(i)
      .with(
        {
          time: Pattern.string.regex(/^\-\d+/),
        },
        (event) => {
          const t = parseInt(event.time.slice(1));
          const clone: EventValueType<E> = Object.assign({}, event);
          clone.time = totalSeconds - t;
          return clone;
        }
      )
      .with(
        {
          time: Pattern.string.regex(/^%\d+/),
        },
        (event) => {
          const t = parseInt(event.time.slice(1));
          const clone: EventValueType<E> = Object.assign({}, event);
          clone.time = totalSeconds * (t * 0.01);
          return clone;
        }
      )
      .otherwise((event) => event)
  );
}
