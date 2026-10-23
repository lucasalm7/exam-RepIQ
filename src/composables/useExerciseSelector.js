import { ref } from 'vue'
import { fetchPublicExerciseLibrary } from '@/stores/library'
// this composable is used to fetch the public exercise library and manage its state
// the function loadExercises fetches the exercises and updates the state accordingly, handling loading and error states.
export function useExerciseSelector() {
  const exercises = ref([])
  const isLoading = ref(false)
  const error = ref('')

  async function loadExercises() {
    isLoading.value = true
    error.value = ''

    try {
      exercises.value = await fetchPublicExerciseLibrary()
    } catch (err) {
      error.value = 'Unable to load exercises.'
    } finally {
      isLoading.value = false
    }
  }

  return {
    exercises,
    isLoading,
    error,
    loadExercises,
  }
}