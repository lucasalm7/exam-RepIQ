<script setup>
import { computed, onMounted, ref } from 'vue'
import { useCalendarMeals } from '@/composables/useCalendarSelectors'

const emit = defineEmits(['select', 'close'])

const { allMeals, isLoading, error, loadAllMeals } = useCalendarMeals()

const search = ref('')
const selectedTab = ref('all') // 'all' | 'preset' | 'personal'
const selectedMeal = ref(null)

const filteredMeals = computed(() => {
  const query = search.value.trim().toLowerCase()

  return allMeals.value.filter(meal => {
    const matchesSource =
      selectedTab.value === 'all' || meal.sourceType === selectedTab.value

    const searchableText = [meal.name, meal.category].filter(Boolean).join(' ').toLowerCase()

    return matchesSource && searchableText.includes(query)
  })
})

function pickMeal(meal) {
  selectedMeal.value = meal
}

function handleConfirm() {
  if (!selectedMeal.value) return

  emit('select', {
    type: 'meal',
    itemId: selectedMeal.value.$id,
    itemName: selectedMeal.value.name,
    sourceType: selectedMeal.value.sourceType,
    details: {
      calories: Number(selectedMeal.value.calories || 0),
      protein: Number(selectedMeal.value.protein || 0),
      carbs: Number(selectedMeal.value.carbs || 0),
      fats: Number(selectedMeal.value.fats || 0),
    },
  })
}

onMounted(loadAllMeals)
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
    <div class="w-full max-w-lg rounded-2xl border border-surface-border bg-surface p-6 shadow-xl">
      <div class="flex items-center justify-between border-b border-surface-border pb-4">
        <h2 class="text-lg font-semibold text-white">Add Meal to Calendar</h2>
        <button type="button" class="text-zinc-400 hover:text-white" @click="emit('close')">✕</button>
      </div>

      <!-- Source Filter Tabs -->
      <div class="mt-4 flex rounded-xl border border-surface-border bg-background/60 p-1">
        <button
          type="button"
          class="flex-1 rounded-lg py-1.5 text-xs font-semibold transition"
          :class="selectedTab === 'all' ? 'bg-primary text-white' : 'text-zinc-400 hover:text-white'"
          @click="selectedTab = 'all'"
        >
          All
        </button>
        <button
          type="button"
          class="flex-1 rounded-lg py-1.5 text-xs font-semibold transition"
          :class="selectedTab === 'preset' ? 'bg-primary text-white' : 'text-zinc-400 hover:text-white'"
          @click="selectedTab = 'preset'"
        >
          Presets
        </button>
        <button
          type="button"
          class="flex-1 rounded-lg py-1.5 text-xs font-semibold transition"
          :class="selectedTab === 'personal' ? 'bg-primary text-white' : 'text-zinc-400 hover:text-white'"
          @click="selectedTab = 'personal'"
        >
          My Meals
        </button>
      </div>

      <!-- Search Input -->
      <div class="mt-4">
        <input
          v-model="search"
          type="search"
          placeholder="Search meals..."
          class="w-full rounded-xl border border-surface-border bg-background/60 px-3 py-2 text-sm text-white outline-none focus:border-primary"
        />
      </div>

      <!-- Meal List -->
      <div class="mt-4 max-h-56 space-y-2 overflow-y-auto pr-1">
        <p v-if="isLoading" class="py-4 text-center text-xs text-zinc-500">Loading meal library...</p>
        <p v-else-if="error" class="py-4 text-center text-xs text-red-400">{{ error }}</p>
        <p v-else-if="filteredMeals.length === 0" class="py-4 text-center text-xs text-zinc-500">No meals found.</p>

        <button
          v-for="meal in filteredMeals"
          :key="meal.$id"
          type="button"
          class="w-full rounded-xl border p-3 text-left transition"
          :class="selectedMeal?.$id === meal.$id ? 'border-primary bg-primary-muted' : 'border-surface-border bg-background/30 hover:border-primary/40'"
          @click="pickMeal(meal)"
        >
          <div class="flex items-center justify-between">
            <span class="font-medium text-white">{{ meal.name }}</span>
            <span class="rounded bg-surface-border/50 px-2 py-0.5 text-[10px] uppercase text-zinc-300">
              {{ meal.sourceType }}
            </span>
          </div>
          <p class="mt-1 text-xs text-zinc-400">
            {{ meal.calories }} kcal | P: {{ meal.protein }}g C: {{ meal.carbs }}g F: {{ meal.fats }}g
          </p>
        </button>
      </div>

      <!-- Actions -->
      <div class="mt-6 flex justify-end gap-3">
        <button type="button" class="rounded-xl border border-surface-border px-4 py-2 text-xs text-zinc-300 hover:bg-surface-hover" @click="emit('close')">
          Cancel
        </button>
        <button
          type="button"
          :disabled="!selectedMeal"
          class="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
          @click="handleConfirm"
        >
          Add to Calendar
        </button>
      </div>
    </div>
  </div>
</template>