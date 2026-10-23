import { ref } from 'vue'
import { fetchPublicExerciseLibrary } from '@/stores/library'

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