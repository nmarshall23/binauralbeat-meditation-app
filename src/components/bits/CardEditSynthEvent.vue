<template>
  <q-item>
    <q-item-section>
      <q-card class="bg-brown-10" >
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
            v-model.number="baseFreqModel"
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
            v-model.number="beatFreqModel"
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
const props = defineProps<{
  baseFreq: number;
  beatFreq: number;
}>();

const emit = defineEmits<{
  (e: "removeField", i: "synth"): void;
  (e: "update:baseFreq", value: number): void;
  (e: "update:beatFreq", value: number): void;
}>();

const baseFreqModel = useVModel(props, "baseFreq", emit);
const beatFreqModel = useVModel(props, "beatFreq", emit);

const fields = reactive({
  baseFreq: true,
  beatFreq: true,
});

watch(fields, () => {
  if (!fields.baseFreq && !fields.beatFreq) {
    emit("removeField", "synth");
  }
});

type FieldKeys = keyof typeof fields;

function removeField(f: FieldKeys) {
  fields[f] = false;
}
</script>
