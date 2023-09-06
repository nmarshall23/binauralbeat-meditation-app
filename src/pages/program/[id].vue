<route lang="json">
{
  "props": true
}
</route>

<template>
  <q-page padding class="column items-start">
    <router-view />
  </q-page>
</template>

<script setup lang="ts">
import { useBinauralBeatPrograms } from '@/state/bbPrograms';


const props = defineProps<{
  id: string;
}>();

const programId = useVModel(props, "id");

const { currentProgramId } = useBinauralBeatPrograms();

currentProgramId.value = programId.value;

console.log("programId %o", programId.value);
</script>
