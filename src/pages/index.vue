<template>
  <q-page class="column q-gutter-sm items-start">
    <nm-card color="bg-secondary">
      <template #header>
        <div class="text-h6">What Are Binaural Beats?</div>
        <q-card-section class="q-pt-none">
        A binaural beat is an illusion created by the brain when you listen to
        two tones with slightly different frequencies at the same time.
      </q-card-section>
      <q-card-section class="q-py-none">
        To experience this effect you need to wear headphones.
      </q-card-section>
      </template>
      
      <q-separator dark />
      <q-card-actions class="q-pt-none">
        <q-btn flat href="https://www.webmd.com/balance/what-are-binaural-beats"
          >Read more on WebMD</q-btn
        >
      </q-card-actions>
    </nm-card>


    

    <q-card class="ND_card text-white text-left bg-grey-9">
      <q-card-section class="bg-purple">
        <div class="text-h6">Programs</div>
        <div class="text-subtitle2">Select one to begin your session</div>
      </q-card-section>

      <q-list dark bordered separator>
        <q-item
          clickable
          v-ripple
          v-for="program in programs"
          :to="{
            name: '/program/[id]/select-duration',
            params: { id: program.id },
          }"
        >
          <q-item-section>
            <q-item-label>{{ program.title }}</q-item-label>
            <q-item-label caption>{{ program.description }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import NmCard from "../components/nmCard.vue";
import { useBinauralBeatPrograms } from "../state/bbPrograms";


const { programs } = useBinauralBeatPrograms();
</script>

<style scoped>
.ND_card {
  width: 500px;
}
</style>
