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
            v-model.number="qValue"
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
import { ExtendedSignal, FilterSignalOptions } from "@/types/GeneratorSignals";

const props = defineProps<{
  signal: Pick<ExtendedSignal, "filter">;
}>();

const emit = defineEmits<{
  (e: "removeField", i: "filter"): void;
  (e: "update:signal", value: Pick<ExtendedSignal, "filter">): void;
}>();

const signal = useVModel(props, "signal", emit);

const wet = computed({
  get: () => signal.value.filter?.wet,
  set: (wet) => emit("update:signal", updateSignal('wet', wet)),
});

const frequency = computed({
  get: () => signal.value.filter?.frequency,
  set: (frequency) => emit("update:signal", updateSignal('frequency', frequency)),
});

const qValue = computed({
  get: () => signal.value.filter?.Q,
  set: (Q) => emit("update:signal", updateSignal('Q', Q)),
});

const gain = computed({
  get: () => signal.value.filter?.gain,
  set: (gain) => emit("update:signal", updateSignal('gain', gain)),
});

type UpdateSig = FilterSignalOptions;
type FieldKeys = keyof UpdateSig;
// type FieldValues = FilterSignalOptions[keyof FilterSignalOptions] 

function updateSignal(key: FieldKeys, value: any ): Pick<ExtendedSignal, "filter"> {
  const filter = Object.assign({}, signal.value.filter, { [key]: value});

  return Object.assign({}, signal.value, { filter });
}

// === === //

const fields = computed(() => ({
  wet: isDefined(signal.value.filter?.wet),
  frequency: isDefined(signal.value.filter?.frequency),
  Q: isDefined(signal.value.filter?.Q),
  gain: isDefined(signal.value.filter?.gain),
}));

watch(fields, () => {
  if (Object.values(fields.value).every((i) => !i)) {
    emit("removeField", "filter");
  }
});


function removeField(f: FieldKeys) {
  if (isDefined(signal.value.filter)) {
    signal.value.filter[f] = undefined;
  }
}
</script>
