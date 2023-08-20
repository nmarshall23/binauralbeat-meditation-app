<template>
  <q-card class="ND_card text-white text-left bg-grey-9">
    <q-card-section :class="color">
      <slot name="header" />
    </q-card-section>
    <slot />
  </q-card>
</template>

<script setup lang="ts">
defineProps<{
  color: string;
}>();
</script>

<style scoped lang="scss">
@use "quasar/src/css/variables" as q;
.ND_card {
  @media (max-width: $breakpoint-xs-max) {
    width: 360px;
  }

  @media (min-width: $breakpoint-sm-min) and (max-width: $breakpoint-sm-max) {
    width: 360px;
  }

  @media (min-width: $breakpoint-md-min) and (max-width: $breakpoint-md-max) { 
    width: 450px;
  }

  @media (min-width: $breakpoint-lg-min) and (max-width: $breakpoint-lg-max) {
    width: 450px;
  }

  @media (min-width: $breakpoint-xl-min) {
    width: 450px;
  }
}
</style>
