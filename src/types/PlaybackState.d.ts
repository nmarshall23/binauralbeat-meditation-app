
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