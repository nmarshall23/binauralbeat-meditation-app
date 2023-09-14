<template>
    <div :class="[color, 'px-2 rounded-t']">
        <slot />
    </div>
</template>

<script setup lang="ts">
defineProps<{
  color?: string;
}>();

</script>