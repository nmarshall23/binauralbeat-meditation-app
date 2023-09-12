import { GeneratorControls } from "@/types/GeneratorControls";
import { Pattern, match } from "ts-pattern";
import * as Tone from "tone";

import EditEventLoopDialog from "@/components/dialogs/editEventLoopDialog.vue";
import {
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
    generatorDef: genCtrl.generatorDef,
    eventType,
  })
    .with(
      {
        eventType: "loop",
        generatorDef: {
          type: "NoiseFilteredGen",
          options: {
            loopEvents: Pattern.not(Pattern.nullish)
          }
        },
      },
      async (ctrl) => {
        if (isDefined(editEventLoopDialogRef)) {
          const { data, isCanceled } =
            await editEventLoopDialogRef.value.reveal({
              generatorType: genCtrl.type,
              generatorName: genCtrl.generatorName,
              eventLoop: ctrl.generatorDef.options.loopEvents,
              signalTypes: ["gain", "filter"],
            });

          if (!isCanceled && isDefined(data)) {
            console.log(data);
            generatorsUpdate.trigger({});
            ctrl.generatorDef.options.loopEvents =
              data as LooppingEventsOptions<NoiseFilteredGenEventSignal>;
          }
        }
      }
    )
    .with(
      {
        eventType: "loop",
        generatorDef: {
          type: Pattern.union('BinauralBeatwLoop', 'BinauralBeatSpinOsc'),
          options: {
            loopEvents: Pattern.not(Pattern.nullish)
          }
        },
      },
      async (ctrl) => {
        if (isDefined(editEventLoopDialogRef)) {
          const { data, isCanceled } =
            await editEventLoopDialogRef.value.reveal({
              generatorType: genCtrl.type,
              generatorName: genCtrl.generatorName,
              eventLoop: ctrl.generatorDef.options.loopEvents,
              signalTypes: ["gain", "synth"],
            });

          if (!isCanceled && isDefined(data)) {
            console.log(data);
            ctrl.generatorDef.options.loopEvents =
              data as LooppingEventsOptions<NoiseFilteredGenEventSignal>;
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
