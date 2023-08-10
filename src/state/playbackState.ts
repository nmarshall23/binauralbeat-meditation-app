import { createStore } from "harlem";
import composeExtension from "@harlem/extension-compose";

import * as Tone from "tone";
import { createEventHook, isDefined, whenever } from "@vueuse/core";
import { logicNot } from "@vueuse/math";
import { computed } from "vue";
import { Temporal } from '@js-temporal/polyfill'
import * as Duration from 'duration-fns'


// The initial state for this store
const STATE = {
  duration: 70,
  temporalDuration: null as null | Temporal.Duration,
  hasInit: false,
  stopEventId: null as null | number,
  durationEventId: null as null | number,
  isPlaying: false,
};

export const { state, computeState, mutation, action, ...store } = createStore(
  "playback",
  STATE,
  {
    extensions: [composeExtension()],
  }
);

const durationEventId = computeState((state) => state.durationEventId);

const setDuration = mutation("set-duration", (state, duration: number) => {
  if (isDefined(durationEventId)) {
    Tone.Transport.clear(durationEventId.value);
  }

  durationEventId.value = Tone.Transport.scheduleRepeat(durationCountDown, 1);

  state.duration = duration;
  state.temporalDuration = Temporal.Duration.from({ seconds: duration })
});

const duration = computed({
  set: setDuration,
  get: () => state.duration,
});

const subtractDuration = mutation("update-duration", (state, seconds: number) => {
  if(isDefined(state.temporalDuration)) {
    // const largestUnit = Temporal.Duration.compare(state.temporalDuration, Temporal.Duration.from({ hours: 1 }) > -1 ? 'hour' : ''

    state.temporalDuration = state.temporalDuration.subtract({ seconds }).round({ largestUnit: 'hour' })
  }

})

function durationCountDown(time: number) {
  Tone.Draw.schedule(() => {
    console.log("Duration Timer - Time: %o", Math.round(time));
    subtractDuration(1)

    console.log(
      "Duration Timer - Remaning Duration: %o : %o : %o",
      state.temporalDuration?.hours,
      state.temporalDuration?.minutes,
      state.temporalDuration?.seconds,
      
    );
  }, time);
}

const stopEventId = computeState((state) => state.stopEventId);

const setHasInit = mutation("setHasInit", (state, payload: boolean) => {
  if (!isDefined(durationEventId)) {
    setDuration(state.duration);
  }

  if (isDefined(stopEventId)) {
    Tone.Transport.clear(stopEventId.value);
  }

  stopEventId.value = Tone.Transport.scheduleOnce((time) => {
    Tone.Draw.schedule(() => {
      console.log("PlayBack Stopped Tigger %o", Math.round(time));
      playBackStopped.trigger(time);
    }, time);
  }, Tone.now() + duration.value + 1);

  state.hasInit = payload;
});

const resetInit = () => setHasInit(false);

const isPlaying = computeState((state) => state.isPlaying);
const toggleIsPlaying = () => (isPlaying.value = !isPlaying.value);

const playBackStarted = createEventHook<Tone.Unit.Time>();
const playBackStopped = createEventHook<Tone.Unit.Time>();
const playBackPaused = createEventHook<Tone.Unit.Time>();

playBackStarted.on(() => Tone.Transport.start());
playBackStopped.on(() => Tone.Transport.stop());
playBackPaused.on(() => Tone.Transport.pause());

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
  };
}
