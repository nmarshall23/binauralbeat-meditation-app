import { EventHookOn } from "@vueuse/core";

// ===  === //

export type PlaybackTriggers = {
    onPlayBackStarted: EventHookOn<PlaybackStartEvent>;
    onPlayBackPaused: EventHookOn<number>;
    onPlayBackStopped: EventHookOn<number>;
  };


export type PlaybackStartEvent = {
    time: number,
    initialize: boolean
}