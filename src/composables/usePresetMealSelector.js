import { computed, onMounted, ref } from 'vue'
import { fetchPublicPresetMeals } from '@/stores/library'

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