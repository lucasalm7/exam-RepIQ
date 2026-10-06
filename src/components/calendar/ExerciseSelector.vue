<script setup>
import { computed, onMounted, ref } from 'vue'
import { fetchPublicExerciseLibrary } from '@/stores/library'

const emit = defineEmits(['select'])

const exercises = ref([])
const search = ref('')
const category = ref('all')
const selectedExerciseId = ref('')
const isLoading = ref(false)
const error = ref('')

const categories = [
  { value: 'all', label: 'All categories' },
  { value: 'chest', label: 'Chest' },
  { value: 'back', label: 'Back' },
  { value: 'legs', label: 'Legs' },
  { value: 'shoulders', label: 'Shoulders' },
  { value: 'arms', label: 'Arms' },
  { value: 'core', label: 'Core' },
  { value: 'cardio', label: 'Cardio' },
]

const filteredExercises = computed(() => {
  const query = search.value.trim().toLowerCase()

  return exercises.value.filter(exercise => {
    const matchesCategory =
      category.value === 'all' ||
      String(exercise.category || '').toLowerCase() === category.value

    const searchableText = [
      exercise.name,
      exercise.category,
      exercise.equipment,
      ...(Array.isArray(exercise.primaryMuscles)
        ? exercise.primaryMuscles
        : []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    const matchesSearch = searchableText.includes(query)

    return matchesCategory && matchesSearch
  })
})

async function loadExercises() {
  isLoading.value = true
  error.value = ''

  try {
    exercises.value = await fetchPublicExerciseLibrary()
  } catch {
    error.value = 'Unable to load exercises.'
  } finally {
    isLoading.value = false
  }
}

function selectExercise(exercise) {
  selectedExerciseId.value = exercise.$id
  emit('select', exercise)
}

onMounted(loadExercises)
</script>

<template>
  <section class="space-y-4">
    <div class="space-y-3">
        <div>
            <label for="exercise-search" class="mb-2 block text-sm font-semibold text-zinc-300" > Search exercises </label>
            <input id="exercise-search" v-model="search" type="search" placeholder="Search by name, muscle, or equipment..." class="w-full rounded-xl border border-surface-border bg-background/60 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </div>

            <div>
                <label for="exercise-category" class="mb-2 block text-sm font-semibold text-zinc-300" > Category </label>
                <select id="exercise-category" v-model="category" class="w-full rounded-xl border border-surface-border bg-background/60 px-4 py-3 text-sm text-zinc-300 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" >
                <option v-for="option in categories" :key="option.value" :value="option.value" >
                    {{ option.label }}
                </option>
                </select>
            </div>
        </div>
    <p v-if="error" class="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
      {{ error }}
    </p>

    <p v-else-if="isLoading" class="py-6 text-center text-sm text-zinc-500"> Loading exercises... </p>

    <p v-else-if="filteredExercises.length === 0" class="rounded-xl border border-surface-border bg-surface/30 px-4 py-8 text-center text-sm text-zinc-500" >
      No exercises found.
    </p>

    <div v-else class="max-h-72 space-y-2 overflow-y-auto pr-1">
      <button v-for="exercise in filteredExercises" :key="exercise.$id" type="button" class="w-full rounded-xl border p-4 text-left transition" :class="selectedExerciseId === exercise.$id
          ? 'border-primary bg-primary-muted'
          : 'border-surface-border bg-surface/30 hover:border-primary/50 hover:bg-surface-hover'"
        @click="selectExercise(exercise)" >
        <div class="flex items-start justify-between gap-3">
          <div>
            <h3 class="font-semibold text-white"> {{ exercise.name }} </h3>

            <p class="mt-1 text-xs text-zinc-400"> {{ exercise.category }} · {{ exercise.equipment }} </p>
          </div>

          <span v-if="selectedExerciseId === exercise.$id" class="text-xs font-semibold text-primary" >
            Selected
          </span>
        </div>

        <p class="mt-3 text-xs text-zinc-500">
          {{
            Array.isArray(exercise.primaryMuscles)
              ? exercise.primaryMuscles.join(', ')
              : exercise.primaryMuscles || 'Muscles not specified'
          }}
        </p>
      </button>
    </div>
  </section>
</template>