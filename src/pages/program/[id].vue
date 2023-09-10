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
import { useCurrentProgramStore } from "@/state/currentProgram";

const props = defineProps<{
  id: string;
}>();

const programId = useVModel(props, "id");

const { currentProgramId, cleanUpCurrentProgram } = useCurrentProgramStore();

currentProgramId.value = programId.value;

console.log("programId %o", programId.value);

onBeforeUnmount(() => {
  cleanUpCurrentProgram()
});
</script>
