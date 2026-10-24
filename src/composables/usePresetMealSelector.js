import { computed, onMounted, ref } from 'vue'
import { fetchPublicPresetMeals } from '@/stores/library'

//the step by step of this function is as follows:
//1. define the reactive variables meals, search, selectedMealId, isLoading, error, and category using ref()
//2. define the categories array with the available meal categories
//3. define the filteredMeals computed property that filters the meals based on the search query and selected category
//4. define the loadMeals function that fetches the preset meals from the API and updates the meals variable, handling loading state and errors
export function usePresetMealSelector() {
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

  onMounted(loadMeals)

  return {
    meals,
    search,
    selectedMealId,
    isLoading,
    error,
    category,
    categories,
    filteredMeals,
    loadMeals,
  }
}