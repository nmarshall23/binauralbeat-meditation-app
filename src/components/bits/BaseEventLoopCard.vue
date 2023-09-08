<template>
  <q-card class="bg-brown-9" flat bordered>
    <q-item>
        <q-item-section >
            <q-item-label>Title</q-item-label>
          <q-item-label caption>
            Subhead
          </q-item-label>
        </q-item-section>

        <q-item-section side>
            <q-btn round color="warning" icon="close" @click="() => emit('removeItem', index)" />
        </q-item-section>
      </q-item>

    <list-item-number-input v-model="model.gain" label="Gain" hint="" />
    <slot></slot>
  </q-card>
</template>

<script setup lang="ts">
defineProps<{
  index: number
}>();

const model = ref({
  gain: 1,
});

const emit = defineEmits<{
  (e: "removeItem", i: number): void;
}>()
</script>
