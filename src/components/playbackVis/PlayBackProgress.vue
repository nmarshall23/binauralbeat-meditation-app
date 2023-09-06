<template>
  <q-linear-progress
    size="25px"
    :value="remandingDurationPercentage"
    color="accent"
  >
    <div class="absolute-full flex flex-center">
      <q-badge color="white" text-color="accent" :label="progressLabel" />
    </div>
  </q-linear-progress>
</template>

<script setup lang="ts">
const props = defineProps<{
  remandingDurationPercentage: number;
  remandingDuration: {
    hours: number;
    minutes: number;
    seconds: number;
  };
}>();

const remandingDuration = useVModel(props, "remandingDuration");

// Add a Second so label doesn't go negtive
const progressLabel = computed(
  () =>
    `${remandingDuration.value.hours}:${remandingDuration.value.minutes}:${
      remandingDuration.value.seconds + 1
    }`
);
</script>
