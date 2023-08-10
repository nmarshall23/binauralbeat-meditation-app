<template>
    <div>
        <div>{{ durationObj.minutes }}</div>
        <div>{{ durationObj.seconds }}</div>
    </div>
</template>

<script setup lang="ts">
import * as Tone from "tone";
import { useVModels } from '@vueuse/core';
import { computed, ref } from "vue";
import { useFloor } from "@vueuse/math";
import { Duration } from 'ts-duration';

const props = defineProps<{
  duration: number,
  isPlaying: boolean
}>()

const { duration, isPlaying } = useVModels(props)

const durationObj = ref(Duration.second(duration.value))

const countdownLoop = computed(() => {

    const loop = new Tone.Loop((time) => {
	// triggered every second.
	console.log(time);
}, 1)

    loop.iterations = duration.value

    return loop
})






</script>