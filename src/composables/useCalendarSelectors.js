import { ref } from 'vue'
import { fetchPublicExerciseLibrary, fetchPublicPresetMeals } from '@/stores/library'
import { useWorkoutsStore } from '@/stores/workouts'
import { useMealsStore } from '@/stores/meals'

export function useCalendarExercises() {
  const allExercises = ref([])
  const isLoading = ref(false)
  const error = ref('')

  async function loadAllExercises() {
    isLoading.value = true
    error.value = ''
    try {
      const workoutsStore = useWorkoutsStore()

      // 1. Fetch public exercises
      const globals = await fetchPublicExerciseLibrary().catch(() => [])

      // 2. Fetch personal exercises safely
      if (typeof workoutsStore.fetchPersonalExercises === 'function') {
        await workoutsStore.fetchPersonalExercises()
      } else if (typeof workoutsStore.fetchUserExercises === 'function') {
        await workoutsStore.fetchUserExercises()
      }

      // Check where user exercises are held in your store
      const personals = workoutsStore.personalExercises || workoutsStore.userExercises || workoutsStore.workouts || []

      const taggedGlobals = (globals || []).map(item => ({ ...item, sourceType: 'global' }))
      const taggedPersonals = (personals || []).map(item => ({ ...item, sourceType: 'personal' }))

      allExercises.value = [...taggedGlobals, ...taggedPersonals]
    } catch (err) {
      console.error('Error loading exercises:', err)
      error.value = 'Failed to load exercises'
    } finally {
      isLoading.value = false
    }
  }

  return { allExercises, isLoading, error, loadAllExercises }
}

export function useCalendarMeals() {
  const allMeals = ref([])
  const isLoading = ref(false)
  const error = ref('')

  async function loadAllMeals() {
    isLoading.value = true
    error.value = ''
    try {
      const mealsStore = useMealsStore()

      // 1. Fetch public preset meals
      const presets = await fetchPublicPresetMeals().catch(() => [])

      // 2. Fetch personal meals safely
      if (typeof mealsStore.fetchPersonalMeals === 'function') {
        await mealsStore.fetchPersonalMeals()
      } else if (typeof mealsStore.fetchUserMeals === 'function') {
        await mealsStore.fetchUserMeals()
      }

      // Check where user meals are held in your store
      const personals = mealsStore.personalMeals || mealsStore.userMeals || mealsStore.meals || []

      const taggedPresets = (presets || []).map(item => ({ ...item, sourceType: 'preset' }))
      const taggedPersonals = (personals || []).map(item => ({ ...item, sourceType: 'personal' }))

      allMeals.value = [...taggedPresets, ...taggedPersonals]
    } catch (err) {
      console.error('Error loading meals:', err)
      error.value = 'Failed to load meals'
    } finally {
      isLoading.value = false
    }
  }

  return { allMeals, isLoading, error, loadAllMeals }
}