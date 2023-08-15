<template>
    <q-card class="ND_card  text-white text-left bg-grey-9">
      <q-card-section :class="color">
        <slot name="header" />
      </q-card-section>
      <slot />
    </q-card>
</template> 

<script setup lang="ts">
defineProps<{
  color: string

}>();

</script>


<style scoped>
.ND_card {
  width: 500px;
}
</style>