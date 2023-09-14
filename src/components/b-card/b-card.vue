<template>
  <section :class="['b-card  bg-current border-current', roundedCss]">
    <slot />
  </section>
</template>

<script setup lang="ts">
import { match } from "ts-pattern";

const props = withDefaults(
  defineProps<{
    rounded?: boolean | "md" | "lg";
    color?: string
  }>(),
  {
    rounded: true,
    color: 'colors.indigo.800'
  }
);

const { rounded, color } = useVModels(props);

const roundedCss = computed(() =>
  match(rounded.value)
    .with(false, () => "")
    .with(true, () => "rounded")
    .with('md', () => "rounded-md")
    .with('lg', () => "rounded-lg")
    .run()
);

</script>

<style scoped>

.b-card {
  color: theme('colors.zinc.800'); 
}

</style>