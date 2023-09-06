import { noop } from "@vueuse/core";

export type GenOpsDialogRevealData<T> = {
  updateOptions: (options: T) => void;
  getOptionValues: () => Required<T>;
  toggleGenSoundTest: (value?: boolean) => void;
};

export function setupGenOpsDialog<T>(model: Ref<T>) {
  // === Dialog === //

  const { isRevealed, reveal, onReveal, onConfirm, confirm } =
    useConfirmDialog<GenOpsDialogRevealData<T>>();

  

  // === Playback btn === //

  const [isPlaying, toggleIsPlaying] = useToggle();
  const playBtnIcon = computed(() =>
    isPlaying.value ? "pause" : "play_arrow"
  );
  const playBtnLabel = computed(() => (isPlaying.value ? "pause" : "play"));

  const toggleGenSoundTest = ref<(value?: boolean) => void>(noop);
  watch(isPlaying, (v) => toggleGenSoundTest.value(v));

  // === Model History Tracking === //

  const { undo, redo, canUndo, canRedo, last, commit, clear } =
    useDebouncedRefHistory(model, {
      capacity: 10,
      deep: true,
      debounce: 900,
    });

  const updateOptions = ref((_op: T) => {});

  watch(last, () => updateOptions.value(model.value));

  // === Event Setup === //

  onReveal(async (data) => {
    toggleGenSoundTest.value = data.toggleGenSoundTest;
    updateOptions.value = data.updateOptions;

    model.value = data.getOptionValues();
    commit();
    clear();
  });

  onConfirm(() => {
    toggleIsPlaying(false);
  });

  return {
    // Dialog
    isRevealed,
    confirm,
    reveal,
    // Playback Btn
    toggleIsPlaying,
    playBtnIcon,
    playBtnLabel,
    // History Tracking
    undo,
    redo,
    canUndo,
    canRedo,
  };
}
