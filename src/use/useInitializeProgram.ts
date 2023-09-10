import { useCurrentProgramStore } from "@/state/currentProgram";
import { useMainChannel } from "@/state/mainChannel";
import { usePlaybackState } from "@/state/playbackState";
import { useProgramDurationStore } from "@/state/programDuration";

export function useInitializeProgram() {
  /* === initializeProgram === */

  const { volumeRef } = useMainChannel();
  const { initializeDurationCountdown } = useProgramDurationStore();
  const { initializePlayBack } = usePlaybackState();
  const { currentProgram } = useCurrentProgramStore();

  if (isDefined(currentProgram)) {
    initializePlayBack();
    initializeDurationCountdown();

    if (isDefined(currentProgram.value.volumeLevel)) {
      volumeRef.value = currentProgram.value.volumeLevel;
    }
  }
}
