<template>
  <q-card flat bordered class="ND_card text-white text-left bg-grey-9">
    <q-card-section class="bg-purple">
      <div class="text-h6">Simple Binaural Beat generator</div>
      <div class="text-subtitle2">
        How long would you like your session to last?
      </div>
    </q-card-section>
    <q-card-actions>
      <q-option-group v-model="duration" :options="timeOptions" inline />
    </q-card-actions>
    <q-separator />
    <q-card-actions align="center">
      <q-btn
        push
        color="primary"
        label="Next"
        style="width: 150px"
        to="play"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { usePlaybackState } from "../../../state/playbackState";

const timeOptions = ref([
  { label: "10 mins", value: 600 },
  { label: "15 mins", value: 900 },
  { label: "20 mins", value: 1200 },
  { label: "30 mins", value: 1800 },
]);

// const currentValue = ref(timeOptions.value[0].value);

const { duration } = usePlaybackState();
</script>
