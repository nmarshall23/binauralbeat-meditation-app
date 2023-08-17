import { createStore } from "harlem";
import composeExtension from "@harlem/extension-compose";

import { Temporal } from "@js-temporal/polyfill";
import * as Tone from "tone";
import { isDefined } from "@vueuse/core";
import { useMinDurationToSec } from "../use/useDurationInSec";

// The initial state for this store
const STATE = {
  duration: useMinDurationToSec(60),
  temporalDuration: null as null | Temporal.Duration,
  durationEventId: null as null | number,
};

const { computeState, mutation, onAfterMutation, getter } = createStore(
  "programDuration",
  STATE,
  {
    extensions: [composeExtension()],
  }
);

const durationEventId = computeState((state) => state.durationEventId);
const duration = computeState((state) => state.duration, "set-duration");
const temporalDuration = computeState((state) => state.temporalDuration);

onAfterMutation("set-duration", (event) => {
  console.log(
    "set-duration trigger - duration %o event %o",
    duration.value,
    event
  );
  setupToneTransportCountDown();
});

function setupToneTransportCountDown() {
  if (isDefined(durationEventId)) {
    Tone.Transport.clear(durationEventId.value);
  }

  durationEventId.value = Tone.Transport.scheduleRepeat(durationCountDown, 1);
  temporalDuration.value = Temporal.Duration.from({
    seconds: duration.value,
  }).round({ largestUnit: "hour" });
}

const remandingDurationPercentage = getter(
  "remandingDurationPercentage",
  (state) => {
    if (isDefined(state.temporalDuration)) {
      const remandingSec = state.temporalDuration.round({
        largestUnit: "second",
      }).seconds;

      console.log("Duration Progress Bar %o %o", remandingSec, state.duration);

      return remandingSec / state.duration;
    }
    return 0;
  }
);

const remandingDuration = getter("remandingDuration", (state) => {
  if (isDefined(state.temporalDuration)) {
    return {
      hours: state.temporalDuration.hours,
      minutes: state.temporalDuration.minutes,
      seconds: state.temporalDuration.seconds,
    };
  }
  return {
    hours: null,
    minutes: null,
    seconds: null,
  };
});

const elapsedDuration = getter("elapsedDuration", (state) => {
  if (isDefined(state.temporalDuration)) {
    const { hours, minutes, seconds } = state.temporalDuration
      .subtract({ seconds: state.duration })
      .round({ largestUnit: "hour" });
    return {
      hours,
      minutes,
      seconds,
    };
  }
  return {
    hours: null,
    minutes: null,
    seconds: null,
  };
});

const subtractDuration = mutation(
  "update-duration",
  (state, seconds: number) => {
    if (isDefined(state.temporalDuration)) {
      state.temporalDuration = state.temporalDuration
        .subtract({ seconds })
        .round({ largestUnit: "hour" });
    }
  }
);

function durationCountDown(time: number) {
  Tone.Draw.schedule(() => {
    console.log("Duration Timer - Time: %o", Math.round(time));
    subtractDuration(1);

    console.log(
      "Duration Timer - Remaning Duration: %o : %o : %o",
      remandingDuration.value.hours,
      remandingDuration.value.minutes,
      remandingDuration.value.seconds
    );
  }, time);
}

function initializeDurationCountdown() {
  if (!isDefined(durationEventId)) {
    setupToneTransportCountDown();
  }
}

export function useProgramDurationStore() {
  return {
    duration,
    remandingDuration,
    remandingDurationPercentage,
    elapsedDuration,
    initializeDurationCountdown,
  };
}
