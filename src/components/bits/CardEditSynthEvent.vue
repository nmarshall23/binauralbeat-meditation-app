<template>
  <q-item>
    <q-item-section>
      <q-card class="bg-brown-10">
        <q-item>
          <q-item-section avatar>
            <q-btn
              round
              color="warning"
              icon="remove_circle_outline"
              @click="() => emit('removeField', 'synth')"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-h6">Synth Event</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />

        <q-card-section v-if="fields.baseFreq">
          <q-input
            class="q-px-md"
            label-color="grey-12"
            outlined
            standout="bg-blue-grey-9 text-grey-12"
            dark
            v-model.number="baseFreq"
            label="Base Freq"
            type="number"
          >
            <template #before>
              <q-btn
                round
                color="warning"
                icon="remove_circle_outline"
                @click="() => removeField('baseFreq')"
              />
            </template>
          </q-input>
        </q-card-section>

        <q-card-section v-if="fields.beatFreq">
          <q-input
            class="q-px-md"
            label-color="grey-12"
            outlined
            standout="bg-blue-grey-9 text-grey-12"
            dark
            v-model.number="beatFreq"
            label="Beat Freq"
            type="number"
          >
            <template #before>
              <q-btn
                round
                color="warning"
                icon="remove_circle_outline"
                @click="() => removeField('beatFreq')"
              />
            </template>
          </q-input>
        </q-card-section>
      </q-card>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import {
  BinauralBeatSynthSignals,
  ExtendedSignal,
} from "@/types/GeneratorSignals";

const props = defineProps<{
  signal: Pick<ExtendedSignal, "synth">;
}>();

const emit = defineEmits<{
  (e: "removeField", i: "synth"): void;
  (e: "update:signal", v: Pick<ExtendedSignal, "synth">): void;
}>();

const signal = useVModel(props, "signal", emit);

const baseFreq = computed({
  get: () => signal.value.synth?.baseFreq,
  set: (baseFreq) => emit("update:signal", updateSignal("baseFreq", baseFreq)),
});

const beatFreq = computed({
  get: () => signal.value.synth?.beatFreq,
  set: (beatFreq) => emit("update:signal", updateSignal("beatFreq", beatFreq)),
});

type UpdateSig = BinauralBeatSynthSignals;
type FieldKeys = keyof UpdateSig;
// type FieldValues = BinauralBeatSynthSignals[keyof BinauralBeatSynthSignals]

function updateSignal(
  key: FieldKeys,
  value: any
): Pick<ExtendedSignal, "synth"> {
  const synth = Object.assign({}, signal.value.synth, { [key]: value });

  return Object.assign({}, signal.value, { synth });
}

const fields = computed(() => ({
  baseFreq: isDefined(signal.value.synth?.baseFreq),
  beatFreq: isDefined(signal.value.synth?.beatFreq),
}));

watch(fields, () => {
  if (!fields.value.baseFreq && !fields.value.beatFreq) {
    emit("removeField", "synth");
  }
});

function removeField(f: FieldKeys) {
  if (isDefined(signal.value.synth)) {
    signal.value.synth[f] = undefined;
  }
}
</script>
