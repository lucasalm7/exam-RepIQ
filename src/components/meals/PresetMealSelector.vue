<script setup>
import { computed, onMounted, ref } from 'vue'
import { fetchPublicPresetMeals } from '@/stores/library'

const emit = defineEmits(['select'])

const meals = ref([])
const search = ref('')
const selectedMealId = ref('')
const isLoading = ref(false)
const error = ref('')
const category = ref('all')


const categories = [
  { value: 'all', label: 'All categories' },
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' },
]

const filteredMeals = computed(() => {
  const query = search.value.trim().toLowerCase()

  return meals.value.filter(meal => {
    const matchesCategory =
      category.value === 'all' ||
      String(meal.category || '').toLowerCase() === category.value

    const searchableText = [
      meal.name,
      meal.category,
      meal.servingSize,
      meal.instructions,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    const matchesSearch = searchableText.includes(query)

    return matchesCategory && matchesSearch
  })
})

async function loadMeals() {
  isLoading.value = true
  error.value = ''

  try {
    meals.value = await fetchPublicPresetMeals()
  } catch {
    error.value = 'Unable to load preset meals.'
  } finally {
    isLoading.value = false
  }
}

function selectMeal(meal) {
  selectedMealId.value = meal.$id
  emit('select', meal)
}

onMounted(loadMeals)
</script>

<template>
  <section class="w-full max-w-md space-y-4">
    <div class="space-y-3">
      <div>
        <label for="meal-search" class="mb-2 block text-sm font-semibold text-zinc-300" > Search meals </label>
        <input id="meal-search" v-model="search" type="search" placeholder="Search preset meals..." class="w-full rounded-xl border border-surface-border bg-background/60 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-primary focus:ring-2 focus:ring-primary/20" />
      </div>

      <div>
        <label for="meal-category" class="mb-2 block text-sm font-semibold text-zinc-300" > Category </label>
        <select id="meal-category" v-model="category" class="w-full rounded-xl border border-surface-border bg-background/60 px-4 py-3 text-sm text-zinc-300 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" >
          <option v-for="option in categories" :key="option.value" :value="option.value" >
            {{ option.label }}
          </option>
        </select>
      </div>
    </div>

    <p v-if="error" class="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
      {{ error }}
    </p>

    <p v-else-if="isLoading" class="py-6 text-center text-sm text-zinc-500"> Loading preset meals... </p>

    <p v-else-if="filteredMeals.length === 0" class="rounded-xl border border-surface-border bg-surface/30 px-4 py-8 text-center text-sm text-zinc-500" >
      No preset meals found.
    </p>

    <div v-else class="max-h-80 space-y-2 overflow-y-auto pr-1">
      <button v-for="meal in filteredMeals" :key="meal.$id" type="button" class="w-full rounded-xl border p-4 text-left transition" :class="selectedMealId === meal.$id
          ? 'border-primary bg-primary-muted'
          : 'border-surface-border bg-surface/30 hover:border-primary/50 hover:bg-surface-hover'"
        @click="selectMeal(meal)"
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <h3 class="font-semibold text-white"> {{ meal.name }} </h3>

            <p class="mt-1 text-xs text-primary"> {{ meal.category }} · {{ meal.servingSize }} </p>
          </div>

          <span v-if="selectedMealId === meal.$id" class="text-xs font-semibold text-primary" >
            Selected
          </span>
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
      </button>
    </div>
  </section>
</template>