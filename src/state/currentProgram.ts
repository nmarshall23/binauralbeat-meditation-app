import { createStore } from "harlem";

import composeExtension from "@harlem/extension-compose";
import storageExtension from "@harlem/extension-storage";
import { MeditationProgram } from "@/types/MeditationProgram";
import { usePresetProgramsStore } from "./presetProgramsStore";
import { usePlaybackState } from "./playbackState";
import { setupProgramGenerators } from "@/use/setupProgramGenerators";
import { MaybeRef } from "vue";

const STATE = {
  currentProgramId: null as string | null,
  meditationProgram: null as MeditationProgram | null,
};

export const {
  state,
  computeState,
  getter,
  onMutationSuccess,
  ...store
} = createStore("currentProgram", STATE, {
  extensions: [
    composeExtension(),
    storageExtension({
      prefix: "NMA",
      restore: true,
    }),
  ],
});

const { getProgramById } = usePresetProgramsStore();

const currentProgramId = computeState(
  (state) => state.currentProgramId,
  "update-currentProgramId"
);

onMutationSuccess("update-currentProgramId", (event) => {
  console.log("onMutationSuccess %o", event);
  if (isDefined(currentProgramId)) {
    const program = getProgramById(currentProgramId.value)
    if(isDefined(program)) {
        currentProgram.value = JSON.parse(JSON.stringify(program)); // structuredClone(program);
    }
    
  }
});

const currentProgram = computeState(
  (state) => state.meditationProgram
);

const { eventHandler } = usePlaybackState();
const sourceGenCtrls = computed(() => {
  const sourceGen = (currentProgram.value?.generators ?? []) 

  return setupProgramGenerators(sourceGen, eventHandler);
})

function cleanUpCurrentProgram() {
  sourceGenCtrls.value.forEach(gen => {
    gen.dispose()
  })
  currentProgram.value = null
  currentProgramId.value = null
}

// ===  === //

function getGenCtrlFromIndex(index: MaybeRef<number>) {
  return sourceGenCtrls.value[unref(index)]
}

export function useCurrentProgramStore() {
  return {
    currentProgramId,
    currentProgram,
    cleanUpCurrentProgram,
    sourceGenCtrls,
    getGenCtrlFromIndex
  };
}
