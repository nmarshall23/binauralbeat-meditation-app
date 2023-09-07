import { noop } from "@vueuse/core";

export type GenOpsDialogRevealData<T, R> = {
  updateOptions: (options: T) => void;
  getOptionValues: () => Required<T>;
  toggleGenSoundTest: (value?: boolean) => void;
  additionalRecords: R;
};

export function setupGenOpsDialog<T, R>(model: Ref<T>) {
  // === Dialog === //

  const { isRevealed, reveal, onReveal, onConfirm, confirm } =
    useConfirmDialog<GenOpsDialogRevealData<T, R>>();

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
  const isUpdateFinished = ref(false);

  watch(last, async () => {
    isUpdateFinished.value = false;
    await nextTick();
    updateOptions.value(model.value);
    await nextTick();
    isUpdateFinished.value = true;
  });

  const additionalRecords = ref<R>();
  // === Event Setup === //

  onReveal(async (data) => {
    additionalRecords.value = data.additionalRecords;
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
    isPlaying,
    // History Tracking
    undo,
    redo,
    canUndo,
    canRedo,
    // additionalRecords
    additionalRecords,
    isUpdateFinished,
  };
}
