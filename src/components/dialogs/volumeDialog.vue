<template>
  <q-dialog
    v-model="isRevealed"
    ref="dialogRef"
    persistent
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card dark class="q-dialog-plugin bg-blue-grey text-whit">
      <q-toolbar elevated class="bg-primary text-white justify-between">
        <q-btn @click="confirm()" dense flat icon="close" class="item-start">
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>

        <q-toolbar-title>
          {{ title }}
        </q-toolbar-title>

        <q-icon name="equalizer" />
      </q-toolbar>

      <!-- buttons example -->
      <q-card-actions vertical align="center" class="q-pt-lg q-gutter-md">
        <q-badge color="secondary" class="q-pa-sm">
          {{ volume }}
        </q-badge>
        <q-slider
          @change="updateVolume"
          v-model="volume"
          :min="0"
          :max="100"
          vertical
          track-size="76px"
          thumb-size="0"
          reverse
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
type VolumeDialogRevealData = {
  title: string;
  volume: number;
  updateVolume: (v: number) => void;
};

const { isRevealed, reveal, onReveal, onConfirm, confirm } =
  useConfirmDialog<VolumeDialogRevealData>();

defineExpose({
  reveal,
});

const title = ref("");
const volume = ref(10);
const updateVolume = ref((_v: number) => {});

onReveal((data) => {
  title.value = data.title;
  volume.value = data.volume;
  updateVolume.value = data.updateVolume;
});

onConfirm(() => {
  title.value = "";
  volume.value = 10;
});
</script>
