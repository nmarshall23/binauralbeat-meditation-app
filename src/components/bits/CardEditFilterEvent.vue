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
              @click="() => emit('removeField', 'filter')"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-h6">Filter Event</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-toggle
              v-model="wet"
              label="Wet"
              left-label
              color="green"
              size="lg"
              checked-icon="check"
              unchecked-icon="clear"
              :true-value="1"
              :false-value="0"
            />
            <q-item-label caption></q-item-label>
          </q-item-section>

        </q-item>
        <q-separator />

        <q-card-section v-if="fields.frequency">
          <q-input
            class="q-px-md"
            label-color="grey-12"
            outlined
            standout="bg-blue-grey-9 text-grey-12"
            dark
            v-model.number="frequency"
            label="Frequency"
            type="number"
          >
            <template #before>
              <q-btn
                round
                color="warning"
                icon="remove_circle_outline"
                @click="() => removeField('frequency')"
              />
            </template>
          </q-input>
        </q-card-section>

        <q-card-section v-if="fields.Q">
          <q-input
            class="q-px-md"
            label-color="grey-12"
            outlined
            standout="bg-blue-grey-9 text-grey-12"
            dark
            v-model.number="q"
            label="Q"
            type="number"
          >
            <template #before>
              <q-btn
                round
                color="warning"
                icon="remove_circle_outline"
                @click="() => removeField('Q')"
              />
            </template>
          </q-input>
        </q-card-section>

        <q-card-section v-if="fields.gain">
          <q-input
            class="q-px-md"
            label-color="grey-12"
            outlined
            standout="bg-blue-grey-9 text-grey-12"
            dark
            v-model.number="gain"
            label="Gain"
            type="number"
          >
            <template #before>
              <q-btn
                round
                color="warning"
                icon="remove_circle_outline"
                @click="() => removeField('gain')"
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
  wet: 0 | 1;
  frequency: number;
  q: number;
  gain: number;
}>();

const emit = defineEmits<{
  (e: "removeField", i: "filter"): void;
  (e: "update:wet", value: 0 | 1): void;
  (e: "update:frequency", value: number): void;
  (e: "update:q", value: number): void;
  (e: "update:gain", value: number): void;
}>();

const { wet, frequency, q, gain } = useVModels(props, emit);

const fields = reactive({
  wet: true,
  frequency: true,
  Q: true,
  gain: true,
});

watch(fields, () => {
  if (!fields.wet && !fields.frequency && !fields.Q && !fields.gain) {
    emit("removeField", "filter");
  }
});

type FieldKeys = keyof typeof fields;

function removeField(f: FieldKeys) {
  fields[f] = false;
}
</script>
