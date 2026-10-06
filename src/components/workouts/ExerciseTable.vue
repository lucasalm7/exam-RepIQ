<script setup>
defineProps({
  exercises: {
    type: Array,
    default: () => [],
  },
  isAdmin: Boolean,
  isLoading: Boolean,
})

const emit = defineEmits(['edit', 'delete'])
</script>

<template>
  <div class="overflow-hidden rounded-2xl border border-surface-border bg-surface/30">
    <div class="overflow-x-auto">
      <table class="w-full min-w-180 text-left text-sm">
        <thead class="border-b border-surface-border bg-background/40 text-xs uppercase tracking-wider text-zinc-500">
          <tr>
            <th class="px-5 py-4">Name</th>
            <th class="px-5 py-4">Category</th>
            <th class="px-5 py-4">Equipment</th>
            <th class="px-5 py-4">Primary muscles</th>
            <th class="px-5 py-4">Actions</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-surface-border">
          <tr v-for="exercise in exercises" :key="exercise.$id" class="transition hover:bg-surface-hover/40">
            <td class="px-5 py-4 font-semibold text-white">
              {{ exercise.name }}
            </td>

            <td class="px-5 py-4">
              <span class="rounded-full bg-primary-muted px-2.5 py-1 text-xs text-primary">{{ exercise.category }}</span>
            </td>

            <td class="px-5 py-4 text-zinc-300">{{ exercise.equipment }}</td>

            <td class="px-5 py-4 text-zinc-400">
              {{
                Array.isArray(exercise.primaryMuscles)
                  ? exercise.primaryMuscles.join(', ')
                  : exercise.primaryMuscles
              }}
            </td>

            <td class="flex gap-2 px-5 py-4">
              <button type="button"
                class="rounded-lg border border-primary/30 px-3 py-1.5 text-xs text-primary hover:bg-primary/10"
                @click="emit('edit', exercise)"
              >
                Edit
              </button>

              <button v-if="isAdmin" type="button" :disabled="isLoading"
                class="rounded-lg border border-red-400/25 px-3 py-1.5 text-xs text-red-300 hover:bg-red-400/10 disabled:opacity-50"
                @click="emit('delete', exercise.$id)"
              >
                Delete
              </button>
            </td>
          </tr>

          <tr v-if="exercises.length === 0">
            <td colspan="5" class="px-5 py-12 text-center text-zinc-500">
              No exercises found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>