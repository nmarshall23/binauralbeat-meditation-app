import { createStore } from "harlem";
import composeExtension from "@harlem/extension-compose";

import * as Tone from "tone";
import { useProgramDurationStore } from "./programDuration";
import { PlaybackStartEvent } from "@/types/PlaybackState";
import { match } from "ts-pattern";

// The initial state for this store
const STATE = {
  hasInit: false,
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

const isPlaying = computeState((state) => state.isPlaying);
const toggleIsPlaying = () => (isPlaying.value = !state.isPlaying);
const hasInit = computeState((state) => state.hasInit);

const { setupCountDownDuration, remandingDuration } = useProgramDurationStore();

/**
 * Sets up Countdown timer, and stop event
 */
function initializePlayBack() {
  setupCountDownDuration();
}

watch(remandingDuration, async (remanding) => {
  if (isDefined(remanding.seconds) && remanding.seconds < -1) {
    console.log(
      "updatePlayingState - action: %o, time: %o",
      "stop",
      Math.round(Tone.now())
    );
    await playBackStopped.trigger(Tone.now());
    isPlaying.value = false;
    await nextTick();

    setupCountDownDuration();
  }
});

const playBackStarted = createEventHook<PlaybackStartEvent>();
const playBackStopped = createEventHook<number>();
const playBackPaused = createEventHook<number>();

playBackStarted.on(() => Tone.Transport.start());
playBackStopped.on(() => Tone.Transport.stop('+4'));
playBackPaused.on(() => Tone.Transport.pause());

const updatePlayingState = async (isPlaying: boolean) => {
  const time = Tone.Transport.seconds; // Tone.Transport.now() // - Tone.Transport.seconds

  const action = await match({
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

        hasInit.value = true;

        await playBackStarted.trigger({
          time,
          initialize: true,
        });
        return "playing - initialize";
      }
    )
    .with(
      {
        isPlaying: true,
        hasInit: true,
      },
      async () => {
        await playBackStarted.trigger({
          time,
          initialize: false,
        });
        return "playing";
      }
    )
    .otherwise(async () => {
      await playBackPaused.trigger(time);
      return "paused";
    });

  console.log(
    "updatePlayingState - action: %o, time: %o",
    action,
    Math.round(time)
  );
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
    initializePlayBack,
    eventHandler,
  };
}
