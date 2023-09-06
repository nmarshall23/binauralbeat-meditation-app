import binauralBeatSynthOpsDialogVue from "@/components/dialogs/binauralBeatSynthOpsDialog.vue";
import noiseOptionsDialogVue from "@/components/dialogs/noiseOptionsDialog.vue";
import { GeneratorControls } from "@/types/GeneratorControls";
import { match } from "ts-pattern";

function showGenOptionsDialog(genCtrl: GeneratorControls) {
  match(genCtrl)
    .with({ type: "NoiseFilteredGen" }, async (genCtrl) => {
      if (isDefined(noiseOptionsDialogRef)) {
        await noiseOptionsDialogRef.value.reveal({
          title: "Update Options",
          toggleGenSoundTest: genCtrl.toggleGenSoundTest,
          updateOptions: genCtrl.updateOptions,
          getOptionValues: genCtrl.getOptionValues,
        });
      }
    })
    .with({ type: "BinauralBeatwLoop" }, async (genCtrl) => {
      if (isDefined(binauralBeatSynthOpsDialogRef)) {
        await binauralBeatSynthOpsDialogRef.value.reveal({
          toggleGenSoundTest: genCtrl.toggleGenSoundTest,
          updateOptions: genCtrl.updateOptions,
          getOptionValues: genCtrl.getOptionValues,
        });
      }
    })
    .run();
}

const noiseOptionsDialogRef = ref<InstanceType<
  typeof noiseOptionsDialogVue
> | null>();
const binauralBeatSynthOpsDialogRef = ref<InstanceType<
  typeof binauralBeatSynthOpsDialogVue
> | null>();

export function setupSoundsSettingsDialogs() {
  return { showGenOptionsDialog, noiseOptionsDialogRef, binauralBeatSynthOpsDialogRef };
}
