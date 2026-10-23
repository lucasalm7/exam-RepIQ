<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  items: {
    type: Array,
    required: true
  },
  emptyMessage: {
    type: String,
    default: 'No items logged for this day.'
  },
  type: {
    type: String,
    required: true // 'exercise' or 'meal'
  }
})

defineEmits(['delete'])
</script>

<template>
  <div class="rounded-xl border border-surface-border bg-background/30 p-4">
    <h3 class="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">{{ title }}</h3>
    <p v-if="items.length === 0" class="text-xs text-zinc-500">{{ emptyMessage }}</p>
    <ul v-else class="space-y-2">
      <li
        v-for="item in items"
        :key="item.$id"
        class="flex items-center justify-between rounded-lg bg-surface/50 p-2.5 text-xs text-zinc-200"
      >
        <div>
          <span class="font-medium text-white">{{ item.itemName }}</span>
          <span class="ml-2 rounded bg-surface-border/40 px-1.5 py-0.5 text-[10px] text-zinc-400">{{ item.sourceType }}</span>
        </div>
        <div class="flex items-center gap-3">
          <!-- Conditional display based on whether it's an exercise or meal -->
          <span class="text-zinc-400">
            <template v-if="type === 'exercise'">
              {{ item.parsedDetails?.sets }}x{{ item.parsedDetails?.reps }} @ {{ item.parsedDetails?.weight }}kg
            </template>
            <template v-else>
              {{ item.parsedDetails?.calories }} kcal
            </template>
          </span>
          <button
            type="button"
            class="text-zinc-500 hover:text-red-400 transition cursor-pointer"
            title="Delete entry"
            @click="$emit('delete', item.$id)"
          >
            ✕
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>