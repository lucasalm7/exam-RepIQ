<script setup>
import { computed, onMounted, ref } from 'vue'
import { useCalendarExercises } from '@/composables/useCalendarSelectors'

const emit = defineEmits(['select', 'close'])

const { allExercises, isLoading, error, loadAllExercises } = useCalendarExercises()

const search = ref('')
const selectedTab = ref('all') // 'all' | 'global' | 'personal'
const selectedCategory = ref('all')
const selectedExercise = ref(null)

// Logging Details Form State
const sets = ref(3)
const reps = ref(10)
const weight = ref(0)

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

  return allExercises.value.filter(exercise => {
    const matchesSource =
      selectedTab.value === 'all' || exercise.sourceType === selectedTab.value

    const matchesCategory =
      selectedCategory.value === 'all' ||
      String(exercise.category || '').toLowerCase() === selectedCategory.value

    const searchableText = [
      exercise.name,
      exercise.category,
      exercise.equipment,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return matchesSource && matchesCategory && searchableText.includes(query)
  })
})

function pickExercise(exercise) {
  selectedExercise.value = exercise
}

function handleConfirm() {
  if (!selectedExercise.value) return

  emit('select', {
    type: 'exercise',
    itemId: selectedExercise.value.$id,
    itemName: selectedExercise.value.name,
    sourceType: selectedExercise.value.sourceType,
    details: {
      sets: Number(sets.value),
      reps: Number(reps.value),
      weight: Number(weight.value),
    },
  })
}

onMounted(loadAllExercises)
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
    <div class="w-full max-w-lg rounded-2xl border border-surface-border bg-surface p-6 shadow-xl">
      <div class="flex items-center justify-between border-b border-surface-border pb-4">
        <h2 class="text-lg font-semibold text-white">Add Exercise to Calendar</h2>
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
          :class="selectedTab === 'global' ? 'bg-primary text-white' : 'text-zinc-400 hover:text-white'"
          @click="selectedTab = 'global'"
        >
          System Library
        </button>
        <button
          type="button"
          class="flex-1 rounded-lg py-1.5 text-xs font-semibold transition"
          :class="selectedTab === 'personal' ? 'bg-primary text-white' : 'text-zinc-400 hover:text-white'"
          @click="selectedTab = 'personal'"
        >
          My Exercises
        </button>
      </div>

      <!-- Search & Category Inputs -->
      <div class="mt-4 grid grid-cols-2 gap-3">
        <input
          v-model="search"
          type="search"
          placeholder="Search exercises..."
          class="w-full rounded-xl border border-surface-border bg-background/60 px-3 py-2 text-sm text-white outline-none focus:border-primary"
        />
        <select
          v-model="selectedCategory"
          class="w-full rounded-xl border border-surface-border bg-background/60 px-3 py-2 text-sm text-zinc-300 outline-none focus:border-primary"
        >
          <option v-for="cat in categories" :key="cat.value" :value="cat.value">{{ cat.label }}</option>
        </select>
      </div>

      <!-- Exercise List -->
      <div class="mt-4 max-h-48 space-y-2 overflow-y-auto pr-1">
        <p v-if="isLoading" class="py-4 text-center text-xs text-zinc-500">Loading exercise library...</p>
        <p v-else-if="error" class="py-4 text-center text-xs text-red-400">{{ error }}</p>
        <p v-else-if="filteredExercises.length === 0" class="py-4 text-center text-xs text-zinc-500">No exercises found.</p>

        <button
          v-for="ex in filteredExercises"
          :key="ex.$id"
          type="button"
          class="w-full rounded-xl border p-3 text-left transition"
          :class="selectedExercise?.$id === ex.$id ? 'border-primary bg-primary-muted' : 'border-surface-border bg-background/30 hover:border-primary/40'"
          @click="pickExercise(ex)"
        >
          <div class="flex items-center justify-between">
            <span class="font-medium text-white">{{ ex.name }}</span>
            <span class="rounded bg-surface-border/50 px-2 py-0.5 text-[10px] uppercase text-zinc-300">
              {{ ex.sourceType }}
            </span>
          </div>
        </button>
      </div>

      <!-- Performance Log Input (Sets, Reps, Weight) -->
      <div v-if="selectedExercise" class="mt-4 grid grid-cols-3 gap-3 border-t border-surface-border pt-4">
        <div>
          <label class="block text-xs font-medium text-zinc-400">Sets</label>
          <input v-model.number="sets" type="number" min="1" class="mt-1 w-full rounded-lg border border-surface-border bg-background/60 px-3 py-1.5 text-sm text-white" />
        </div>
        <div>
          <label class="block text-xs font-medium text-zinc-400">Reps</label>
          <input v-model.number="reps" type="number" min="1" class="mt-1 w-full rounded-lg border border-surface-border bg-background/60 px-3 py-1.5 text-sm text-white" />
        </div>
        <div>
          <label class="block text-xs font-medium text-zinc-400">Weight (kg)</label>
          <input v-model.number="weight" type="number" min="0" step="0.5" class="mt-1 w-full rounded-lg border border-surface-border bg-background/60 px-3 py-1.5 text-sm text-white" />
        </div>
      </div>

      <!-- Actions -->
      <div class="mt-6 flex justify-end gap-3">
        <button type="button" class="rounded-xl border border-surface-border px-4 py-2 text-xs text-zinc-300 hover:bg-surface-hover" @click="emit('close')">
          Cancel
        </button>
        <button
          type="button"
          :disabled="!selectedExercise"
          class="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
          @click="handleConfirm"
        >
          Add to Calendar
        </button>
      </div>
    </div>
  </div>
</template>