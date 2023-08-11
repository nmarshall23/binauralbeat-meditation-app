import { createStore } from "harlem";
import composeExtension from "@harlem/extension-compose";

import * as Tone from "tone";
import { createEventHook, isDefined, whenever } from "@vueuse/core";
import { logicNot } from "@vueuse/math";

import { Temporal } from "@js-temporal/polyfill";
import { match } from "ts-pattern";

// The initial state for this store
const STATE = {
  duration: 4200,
  temporalDuration: null as null | Temporal.Duration,
  hasInit: false,
  stopEventId: null as null | number,
  durationEventId: null as null | number,
  isPlaying: false,
};

export const {
  state,
  computeState,
  mutation,
  reset,
  onAfterMutation,
  getter,
  ...store
} = createStore("playback", STATE, {
  extensions: [composeExtension()],
});

const durationEventId = computeState((state) => state.durationEventId);
const duration = computeState((state) => state.duration, "set-duration");
const temporalDuration = computeState((state) => state.temporalDuration);
const stopEventId = computeState((state) => state.stopEventId);

onAfterMutation("set-duration", (event) => {
  console.log(
    "set-duration trigger - duration %o event %o",
    duration.value,
    event
  );
  if (isDefined(durationEventId)) {
    Tone.Transport.clear(durationEventId.value);
  }

  durationEventId.value = Tone.Transport.scheduleRepeat(durationCountDown, 1);
  temporalDuration.value = Temporal.Duration.from({
    seconds: duration.value,
  }).round({ largestUnit: "hour" });
});

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

const setHasInit = mutation("setHasInit", (state, payload: boolean) => {
  if (!isDefined(state.durationEventId)) {
    duration.value = state.duration;
  }

  if (isDefined(state.stopEventId)) {
    Tone.Transport.clear(state.stopEventId);
  }

  if (payload) {
    state.stopEventId = Tone.Transport.scheduleOnce((time) => {
      Tone.Draw.schedule(() => {
        console.log("PlayBack Stopped Tigger %o", Math.round(time));
        playBackStopped.trigger(time);
      }, time);
    }, Tone.now() + duration.value + 1);
  }

  state.hasInit = payload;
});

const resetInit = () => setHasInit(false);

const isPlaying = computeState((state) => state.isPlaying, "set-isPlaying");
const toggleIsPlaying = () => (isPlaying.value = !isPlaying.value);

const playBackStarted = createEventHook<Tone.Unit.Time>();
const playBackStopped = createEventHook<Tone.Unit.Time>();
const playBackPaused = createEventHook<Tone.Unit.Time>();

playBackStarted.on(() => Tone.Transport.start());
playBackStopped.on(() => Tone.Transport.stop());
playBackPaused.on(() => Tone.Transport.pause());

// onAfterMutation("set-isPlaying", async (event) => {
//   const action = await match({
//     isPlaying: state.isPlaying,
//     hasInit: state.hasInit,
//   })
//     .with(
//       {
//         isPlaying: true,
//         hasInit: false,
//       },
//       async () => {
//         await Tone.start();
//         setHasInit(true);
//         playBackStarted.trigger(Tone.now());
//         return "start-init";
//       }
//     )
//     .with(
//       {
//         isPlaying: true,
//         hasInit: true,
//       },
//       async () => {
//         playBackStarted.trigger(Tone.now());
//         return "play";
//       }
//     )
//     .with(
//       {
//         isPlaying: false,
//         hasInit: true,
//       },
//       async () => {
//         playBackPaused.trigger(Tone.now());
//         return "paused";
//       }
//     )
//     .otherwise(async () => "unknown");

//   console.log("isPlaying trigger - action %o, event %o", action, event);
// });

whenever(isPlaying, async () => {
  if (!state.hasInit) {
    await Tone.start();

    setHasInit(true);
  }
  playBackStarted.trigger(Tone.now());
});

whenever(logicNot(isPlaying), () => {
  playBackPaused.trigger(Tone.now());
});

export function usePlaybackState() {
  return {
    duration,
    isPlaying,
    toggleIsPlaying,
    stopEventId,
    resetInit,
    onPlayBackPaused: playBackPaused.on,
    onPlayBackStarted: playBackStarted.on,
    onPlayBackStopped: playBackStopped.on,
    remandingDuration,
  };
}
