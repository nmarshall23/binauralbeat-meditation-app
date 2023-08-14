import { EventHookOn } from "@vueuse/core"
import { Ref } from "vue"

export type SoundGeneratorControls = {
    muteCtrl: Ref<boolean>

}

export type PlaybackTriggers = {
    onPlayBackPaused: EventHookOn<number>
    onPlayBackStarted: EventHookOn<number>
    onPlayBackStopped: EventHookOn<number>
}