import { GeneratorControls } from "@/types/GeneratorControls";
import { match } from "ts-pattern";
import * as Tone from "tone";

import EditEventLoopDialog from "@/components/dialogs/editEventLoopDialog.vue";

async function showEditGenEventsDialog(
  genCtrl: GeneratorControls,
  eventType: "loop" | "seq"
) {
  if (Tone.getContext().state === "suspended") {
    await Tone.start();
  }

  match({ genType: genCtrl.type, eventType })
    .with({ genType: "NoiseFilteredGen", eventType: 'loop' }, async () => {
      if (isDefined(editEventLoopDialogRef)) {
        await editEventLoopDialogRef.value.reveal({
        });
      }
    })
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
