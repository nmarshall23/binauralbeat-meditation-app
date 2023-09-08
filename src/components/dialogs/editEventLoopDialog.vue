<template>
  <q-dialog
    v-model="isRevealed"
    ref="dialogRef"
    persistent
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card dark class="q-dialog-plugin bg-blue-grey text-whit">
      <q-toolbar elevated class="bg-primary text-white justify-between">
        <q-btn @click="confirm()" dense flat icon="close" class="item-start">
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>

        <q-toolbar-title> Edit Event Loop</q-toolbar-title>

        <q-icon name="equalizer" />
      </q-toolbar>

      <q-item>
        <q-item-section>
          <q-item-label class="text-body1"> Event Loop for: </q-item-label>
        </q-item-section>
      </q-item>

      <list-item-selection-input
        v-model="model.pattern"
        :options="patternOptions"
        label="Pattern Type"
        hint=""
      />
      <list-item-number-input
        v-model="model.interval"
        label="interval "
        hint=""
      />

      <q-item>
        <q-item-section> Event Count: {{ model.values.length }} </q-item-section>
        <q-item-section avatar>
          <q-btn
            color="primary"
            icon="add"
            label="Add Event"
            @click="addEvent()"
          >
          </q-btn>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-card>
            <q-card-section class="q-gutter-md">
              <template v-for="i in model.values">
                <component :is="i.is" v-bind="i" @remove-item="removeEvent" />
              </template>
            </q-card-section>
          </q-card>
        </q-item-section>
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useFormatOptionsList } from "@/use/useFormatOptionsList";
import BaseEventLoopCard from "../bits/BaseEventLoopCard.vue";

const { isRevealed, reveal, onReveal, onConfirm, confirm } = useConfirmDialog();

defineExpose({
  reveal,
});

const model = ref({
  pattern: "upDown",
  interval: 1,
  values: [
    {
      is: markRaw(BaseEventLoopCard),
      index: 0,
    },
  ],
});

const patternOptions = useFormatOptionsList([
  "up",
  "down",
  "upDown",
  "random",
  "randomWalk",
]);

function addEvent() {
  const index =
    model.value.values.reduce((acc, i) => (acc < i.index ? i.index : acc), 0) +
    1;
  model.value.values.push({
    is: markRaw(BaseEventLoopCard),
    index,
  });
}

function removeEvent(i: number) {
  const index = model.value.values.findIndex(item => i === item.index)
  model.value.values.splice(index, 1)
}
</script>
