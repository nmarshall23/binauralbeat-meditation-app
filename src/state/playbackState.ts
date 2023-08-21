import { createStore } from "harlem";
import composeExtension from "@harlem/extension-compose";

import * as Tone from "tone";
import { useProgramDurationStore } from "./programDuration";
import { PlaybackStartEvent } from "@/types/PlaybackState";
import { match } from "ts-pattern";

// The initial state for this store
const STATE = {
  hasInit: false,
  stopEventId: null as null | number,
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

const stopEventId = computeState((state) => state.stopEventId);

const { initializeDurationCountdown, duration } = useProgramDurationStore();

const setHasInit = mutation("setHasInit", (state, payload: boolean) => {
  initializeDurationCountdown();

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

const isPlaying = getter("getisPlaying", (state) => state.isPlaying);
const setIsPlaying = mutation("setIsPlaying", (state, payload: boolean) => {
  state.isPlaying = payload;
});

const toggleIsPlaying = () => setIsPlaying(!state.isPlaying);

const playBackStarted = createEventHook<PlaybackStartEvent>();
const playBackStopped = createEventHook<number>();
const playBackPaused = createEventHook<number>();

playBackStarted.on(() => Tone.Transport.start("+0.1"));
playBackStopped.on(() => Tone.Transport.stop("+0.1"));
playBackPaused.on(() => Tone.Transport.pause("+0.1"));

const updatePlayingState = async (isPlaying: boolean) => {
  const action = match({
    isPlaying,
    hasInit: state.hasInit,
  })
    .with(
      {
        isPlaying: true,
        hasInit: false,
      },
      async () => {
        await Tone.start();

        setHasInit(true);

        await playBackStarted.trigger({
          time: Tone.now(),
          initialize: true,
        });
        return 'playing - initialize'
      }
    )
    .with(
      {
        isPlaying: true,
        hasInit: true,
      },
      async () => {
        await Tone.start();

        setHasInit(true);

        await playBackStarted.trigger({
          time: Tone.now(),
          initialize: false,
        });
        return 'playing'
      }
    )
    .otherwise(async () => {
      await playBackPaused.trigger(Tone.now());
      return 'paused'
    });

  // if (isPlaying) {
  //   if (!state.hasInit) {
  //     await Tone.start();

  //     setHasInit(true);

  //     playBackStarted.trigger({
  //       time: Tone.now(),
  //       initialize: true
  //     });
  //   } else {
  //     playBackStarted.trigger({
  //       time: Tone.now(),
  //       initialize: false
  //     });
  //   }

  // } else {
  //   playBackPaused.trigger(Tone.now());
  // }
  console.log("updatePlayingState - action: %o", action);
};

watch(isPlaying, updatePlayingState);

const eventHandler = {
  onPlayBackPaused: playBackPaused.on,
  onPlayBackStarted: playBackStarted.on,
  onPlayBackStopped: playBackStopped.on,
};

export function usePlaybackState() {
  return {
    isPlaying,
    toggleIsPlaying,
    stopEventId,
    resetInit,
    eventHandler,
  };
}
