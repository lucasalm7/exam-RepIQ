// Composable functions to aggregate public/preset library items and user-specific entries for calendar selection
import { ref } from 'vue'
import { fetchPublicExerciseLibrary, fetchPublicPresetMeals } from '@/stores/library'
import { useWorkoutsStore } from '@/stores/workouts'
import { useMealsStore } from '@/stores/meals'

export function useCalendarExercises() {// Composable function to manage the loading and state of exercises for calendar selection
  const allExercises = ref([])// Reactive reference to hold the combined list of exercises from both public and user-specific sources
  const isLoading = ref(false)
  const error = ref('')

  async function loadAllExercises() {// Function to load all exercises, combining public and user-specific entries
    isLoading.value = true
    error.value = ''
    try {
      const workoutsStore = useWorkoutsStore()// Access the workouts store to fetch user-specific exercises

      const [globals, personals] = await Promise.all([// Fetch public exercises and user-specific exercises in parallel
        fetchPublicExerciseLibrary().catch(() => []),
        workoutsStore.fetchUserExercises().catch(() => [])//where is fetchUserExercises defined? It is defined in the workouts store, which is imported at the top of this file. It fetches exercises specific to the authenticated user.
      ])

      // Tag items with their origin source type for UI handling
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

      // 1. Fetch public preset meals and user-created meals in parallel
      const [presets, personals] = await Promise.all([
        fetchPublicPresetMeals().catch(() => []),
        mealsStore.fetchUserMeals().catch(() => [])
      ])

      // Tag items with their origin source type
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