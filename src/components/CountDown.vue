<template>
  <div>
    <div>{{ remandingDuration.hours }}</div>
    <div>{{ remandingDuration.minutes }}</div>
    <div>{{ remandingDuration.seconds }}</div>
  </div>
</template>

<script setup lang="ts">

defineProps<{
  remandingDuration: {
    hours: number | null;
    minutes: number | null;
    seconds: number | null;
  };

}>();

</script>
