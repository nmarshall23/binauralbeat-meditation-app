<template>
  <q-list dark class="q-pb-sm">
    <q-item class="q-mb-xs" dense>
      <q-item-section>
        <q-item-label overline>Event Loop</q-item-label>
      </q-item-section>
      <q-item-section avatar>
        <q-btn
          v-if="featureFlag.editGenEventLoops"
          size="sm"
          outline
          label="edit"
          @click="() => emit('showDialog')"
        />
      </q-item-section>
    </q-item>

    <q-item dense class="q-mb-sm">
      <q-item-section>
        <q-item-label caption>
          <span class="text-weight-bold">Pattern: </span>
          {{ eventLoop.pattern }}
        </q-item-label>
        <q-item-label caption>
          <span class="text-weight-bold">interval: </span>
          {{ eventLoop.interval }}
        </q-item-label>
      </q-item-section>
      <q-item-section side top>
        <q-item-label caption>
          <span class="text-weight-bold">Probability: </span>
          {{ eventLoop.probability }}
        </q-item-label>
      </q-item-section>
    </q-item>

    <template v-for="(item, i) in eventLoop.values" :key="i">
      <event-loop-entry :value="item" />
      <q-separator
        v-if="i < eventLoop.values.length - 1"
        class="q-mb-sm q-mt-xs"
        inset
      />
    </template>
  </q-list>
</template>

<script setup lang="ts">
import { useAppFeatures } from "@/state/appFeatures";
import { LoopEventValue } from "@/types/GeneratorSignals";

defineProps<{
  eventLoop: {
    pattern: string;
    interval: string;
    probability: string;
    values: LoopEventValue<unknown>[];
  };
}>();

const emit = defineEmits<{
  (e: "showDialog"): void;
}>();

//=== App Feature Flags ===//

const featureFlag = useAppFeatures()

</script>
