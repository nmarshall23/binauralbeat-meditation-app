import { GeneratorControls } from "@/types/GeneratorControls";
import { Pattern, match } from "ts-pattern";
import * as Tone from "tone";

import EditEventLoopDialog from "@/components/dialogs/editEventLoopDialog.vue";
import {
  BinauralBeatEventSignal,
  LooppingEventsOptions,
  NoiseFilteredGenEventSignal,
} from "@/types/GeneratorSignals";
import { EventHook } from "@vueuse/core";

async function showEditGenEventsDialog(
  generatorsUpdate: EventHook<any>,
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
          const { data, isCanceled } =
            await editEventLoopDialogRef.value.reveal({
              generatorType: genCtrl.type,
              generatorName: genCtrl.generatorName,
              eventLoop,
              signalTypes: ["gain", "filter"],
            });

          if (!isCanceled && isDefined(data)) {
            console.log(data);
            generatorsUpdate.trigger({});
            genCtrl.loopEvents =
              data as LooppingEventsOptions<NoiseFilteredGenEventSignal>;
          }
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
          const { data, isCanceled } =
            await editEventLoopDialogRef.value.reveal({
              generatorType: genCtrl.type,
              generatorName: genCtrl.generatorName,
              eventLoop,
              signalTypes: ["gain", "synth"],
            });

          if (!isCanceled && isDefined(data)) {
            console.log(data);
            genCtrl.loopEvents =
              data as LooppingEventsOptions<BinauralBeatEventSignal>;
          }
        }
      }
    )
    .run();
}

const editEventLoopDialogRef = ref<InstanceType<
  typeof EditEventLoopDialog
> | null>(null);

export function useShowEditGenEventsDialog() {
  const generatorsUpdate = createEventHook();

  return {
    showEditGenEventsDialog: (
      genCtrl: GeneratorControls,
      eventType: "loop" | "seq"
    ) => showEditGenEventsDialog(generatorsUpdate, genCtrl, eventType),
    editEventLoopDialogRef,
    onGeneratorsEventsUpdate: generatorsUpdate.on,
  };
}
