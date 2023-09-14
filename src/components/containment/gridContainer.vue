<template>
  <section class="gridContainer">
    <slot />
  </section>
</template>

<script setup lang="ts">
defineProps<{
  cols: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
}>();
</script>


<style scoped>
.gridContainer {
    display: grid;
    grid-template-columns: repeat(v-bind('cols'), minmax(0, 1fr));
}
</style>