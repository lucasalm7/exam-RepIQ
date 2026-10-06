<script setup>
defineProps({
  meals: {
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
      <table class="w-full min-w-215 text-left text-sm">
        <thead class="border-b border-surface-border bg-background/40 text-xs uppercase tracking-wider text-zinc-500">
          <tr>
            <th class="px-5 py-4">Meal</th>
            <th class="px-5 py-4">Category</th>
            <th class="px-5 py-4">Serving size</th>
            <th class="px-5 py-4">Macros</th>
            <th class="px-5 py-4">Calories</th>
            <th class="px-5 py-4">Instructions</th>
            <th class="px-5 py-4">Actions</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-surface-border">
          <tr v-for="meal in meals" :key="meal.$id" class="transition hover:bg-surface-hover/40" >
            <td class="px-5 py-4 font-semibold text-white"> {{ meal.name }} </td>
            <td class="px-5 py-4 text-primary"> {{ meal.category }} </td>
            <td class="px-5 py-4 text-zinc-300"> {{ meal.servingSize }} </td>
            <td class="px-5 py-4 font-mono text-xs text-zinc-400"> {{ meal.protein }}g / {{ meal.carbs }}g / {{ meal.fats }}g </td>
            <td class="px-5 py-4 text-white"> {{ meal.calories }} kcal </td>
            <td class="max-w-xs truncate px-5 py-4 text-zinc-400"> {{ meal.instructions || 'No instructions available.' }} </td>
            <td class="flex gap-2 px-5 py-4">
            
              <button type="button" class="rounded-lg border border-primary/30 px-3 py-1.5 text-xs text-primary hover:bg-primary/10" @click="emit('edit', meal)" >
                Edit
              </button>

              <button v-if="isAdmin" type="button" :disabled="isLoading" class="rounded-lg border border-red-400/25 px-3 py-1.5 text-xs text-red-300 hover:bg-red-400/10 disabled:opacity-50" @click="emit('delete', meal.$id)" >
                Delete
              </button>
            </td>
          </tr>

          <tr v-if="meals.length === 0">
            <td colspan="7" class="px-5 py-12 text-center text-zinc-500">
              No preset meals found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>