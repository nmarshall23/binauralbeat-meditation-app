import { GeneratorControls } from "@/types/GeneratorControls";
import { Pattern, match } from "ts-pattern";
import * as Tone from "tone";

import EditEventLoopDialog from "@/components/dialogs/editEventLoopDialog.vue";

async function showEditGenEventsDialog(
  genCtrl: GeneratorControls,
  eventType: "loop" | "seq"
) {
  if (Tone.getContext().state === "suspended") {
    await Tone.start();
  }

  match({
    genType: genCtrl.type,
    eventType,
    eventLoop: genCtrl.loopEvents,
    eventSequence: genCtrl.eventSequence,
  })
    .with(
      {
        genType: Pattern.union("NoiseFilteredGen"),
        eventType: "loop",
        eventLoop: Pattern.not(Pattern.nullish),
      },
      async ({ eventLoop }) => {
        if (isDefined(editEventLoopDialogRef)) {
          await editEventLoopDialogRef.value.reveal({
            generatorType: genCtrl.type,
            generatorName: genCtrl.generatorName,
            eventLoop,
            signalTypes: ["gain", "filter"],
          });
        }
      }
    )
    .with(
      {
        genType: Pattern.union("BinauralBeatwLoop"),
        eventType: "loop",
        eventLoop: Pattern.not(Pattern.nullish),
      },
      async ({ eventLoop }) => {
        if (isDefined(editEventLoopDialogRef)) {
          await editEventLoopDialogRef.value.reveal({
            generatorType: genCtrl.type,
            generatorName: genCtrl.generatorName,
            eventLoop,
            signalTypes: ["gain", "synth"],
          });
        }
      }
    )
    .run();
}

const editEventLoopDialogRef = ref<InstanceType<
  typeof EditEventLoopDialog
> | null>(null);

export function useShowEditGenEventsDialog() {
  return {
    showEditGenEventsDialog,
    editEventLoopDialogRef,
  };
}
