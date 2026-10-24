<script setup>
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'

defineProps({
  userMeals: {
    type: Array,
    default: () => [],
  },
  isLoading: Boolean,
})

const emit = defineEmits(['edit', 'delete', 'add'])
</script>

<template>
  <section class="space-y-4">
    <div class="flex items-end justify-between gap-4">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-accent"> Your library </p>
        <h2 class="mt-1 text-xl font-bold text-white"> My meals </h2>
        <p class="mt-1 text-sm text-zinc-400"> Meals you created for your own logs. </p>
      </div>

      <button type="button" class="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary-hover" @click="emit('add')">
        Add meal
      </button>
    </div>

    <div v-if="isLoading" class="glass-panel rounded-2xl">
      <LoadingSpinner text="Loading your meals..." />
    </div>

    <div v-else-if="userMeals.length === 0" class="rounded-2xl border border-dashed border-surface-border bg-surface/20 px-5 py-12 text-center">
      <p class="text-sm font-semibold text-zinc-300"> No personal meals yet </p>
      <p class="mt-1 text-xs text-zinc-500"> Click “Add meal” to create your first one. </p>
    </div>

    <div v-else class="space-y-3">
      <article v-for="meal in userMeals" :key="meal.$id" class="glass-panel rounded-2xl p-5">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="font-semibold text-white"> {{ meal.name }} </h3>
            <p class="mt-1 text-xs text-primary"> {{ meal.category }} · {{ meal.servingSize }} </p>
          </div>

          <div class="flex items-center gap-3">
            <button type="button" class="text-xs font-semibold text-primary hover:text-pink-300" @click="emit('edit', meal)">
              Edit
            </button>

            <button type="button" class="text-xs font-semibold text-red-300 hover:text-red-200" @click="emit('delete', meal.$id)">
              Delete
            </button>
          </div>
        </div>

        <div class="mt-4 grid grid-cols-4 gap-2 text-center">
          <div class="rounded-lg bg-background/50 p-2">
            <span class="block text-[10px] uppercase text-zinc-500">Calories</span>
            <strong class="text-xs text-white">{{ meal.calories }} kcal</strong>
          </div>
          <div class="rounded-lg bg-background/50 p-2">
            <span class="block text-[10px] uppercase text-zinc-500">Protein</span>
            <strong class="text-xs text-white">{{ meal.protein }}g</strong>
          </div>
          <div class="rounded-lg bg-background/50 p-2">
            <span class="block text-[10px] uppercase text-zinc-500">Carbs</span>
            <strong class="text-xs text-white">{{ meal.carbs }}g</strong>
          </div>
          <div class="rounded-lg bg-background/50 p-2">
            <span class="block text-[10px] uppercase text-zinc-500">Fats</span>
            <strong class="text-xs text-white">{{ meal.fats }}g</strong>
          </div>
        </div>

        <div class="instructions">
          <h4 class="mt-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Recipe instructions
          </h4>
          <p class="mt-1 whitespace-pre-line text-sm leading-6 text-zinc-300">
            {{ meal.instructions || 'No recipe instructions available.' }}
          </p>
        </div>
      </article>
    </div>
  </section>
</template>