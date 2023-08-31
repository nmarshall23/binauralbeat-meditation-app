import { createStore } from "harlem";

import composeExtension from "@harlem/extension-compose";
import { SoundGenerators } from "@/types/GeneratorDef";
import { useMainChannel } from "./mainChannel";
import { usePlaybackState } from "./playbackState";
import { useProgramDurationStore } from "./programDuration";
import storageExtension from "@harlem/extension-storage";
import { presetPrograms } from "./presetPrograms";

export type BinauralBeatProgram = {
  id: string;
  title: string;
  description: string;
  generators: Array<SoundGenerators>;
  volumeLevel?: number;
};

const STATE = {
  currentProgramId: null as string | null,
  programs: presetPrograms,
};

export const {
  state,

  computeState,
  getter,
  ...store
} = createStore("binauralBeatPrograms", STATE, {
  extensions: [
    composeExtension(),
    storageExtension({
      prefix: "NMA",
      restore: true,
      include: "update-currentProgramId",
      branch: (state) => state.currentProgramId,
    }),
  ],
});

const programs = getter("getPrograms", (state) => state.programs);

const currentProgramId = computeState(
  (state) => state.currentProgramId,
  "update-currentProgramId"
);

const currentProgram = getter("currentProgram", (state) =>
  state.programs.find((p) => p.id === state.currentProgramId)
);

/* === initializeProgram === */

const { volumeRef } = useMainChannel();
const { initializeDurationCountdown } = useProgramDurationStore();
const { initializePlayBack } = usePlaybackState();

function initializeProgram() {
  if (isDefined(currentProgram)) {
    initializePlayBack();
    initializeDurationCountdown();

    if (isDefined(currentProgram.value.volumeLevel)) {
      volumeRef.value = currentProgram.value.volumeLevel;
    }
  }
}

export function useBinauralBeatPrograms() {
  return {
    programs,
    currentProgramId,
    currentProgram,
    initializeProgram,
  };
}
