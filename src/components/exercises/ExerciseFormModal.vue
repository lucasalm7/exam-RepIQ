<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  editingExercise: {
    type: Object,
    default: null,
  },
  isLoading: Boolean,
})

const emit = defineEmits(['submit', 'close'])

const form = reactive({
  name: '',
  description: '',
  equipment: 'barbell',
  category: 'chest',
  primaryMuscles: '',
  secondaryMuscles: '',
  isCardio: false,
})

function resetForm() {
  Object.assign(form, {
    name: '',
    description: '',
    equipment: 'barbell',
    category: 'chest',
    primaryMuscles: '',
    secondaryMuscles: '',
    isCardio: false,
  })
}

watch(
  () => props.editingExercise,
  exercise => {
    if (!exercise) {
      resetForm()
      return
    }

    Object.assign(form, {
      name: exercise.name || '',
      description: exercise.description || '',
      equipment: exercise.equipment || 'barbell',
      category: exercise.category || 'chest',
      primaryMuscles: Array.isArray(exercise.primaryMuscles)
        ? exercise.primaryMuscles.join(', ')
        : exercise.primaryMuscles || '',
      secondaryMuscles: Array.isArray(exercise.secondaryMuscles)
        ? exercise.secondaryMuscles.join(', ')
        : exercise.secondaryMuscles || '',
      isCardio: exercise.isCardio || false,
    })
  },
  { immediate: true },
)

function submit() {
  emit('submit', {
    name: form.name,
    description: form.description,
    equipment: form.equipment,
    category: form.category,
    primaryMuscles: form.primaryMuscles
      .split(',')
      .map(value => value.trim())
      .filter(Boolean),
    secondaryMuscles: form.secondaryMuscles
      .split(',')
      .map(value => value.trim())
      .filter(Boolean),
    isCardio: form.isCardio,
  })
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
    <form
      class="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-surface-border bg-background p-6 shadow-glass"
      @submit.prevent="submit"
    >
      <div class="mb-6 flex items-start justify-between border-b border-surface-border pb-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Exercise library</p>
          <h2 class="mt-1 text-xl font-bold text-white">{{ editingExercise ? 'Edit exercise' : 'Add exercise' }}</h2>
          <p class="mt-1 text-sm text-zinc-400">Add the movement details used throughout RepIQ.</p>
        </div>

        <button type="button" class="text-xl text-zinc-500 hover:text-white" @click="emit('close')">
          x
        </button>
      </div>

      <div class="space-y-5">
        <div>
          <label class="field-label">Exercise name</label>
          <input v-model="form.name" class="field-input" placeholder="e.g. Bench Press" required />
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="field-label">Equipment</label>
            <select v-model="form.equipment" class="field-input">
              <option value="barbell">Barbell</option>
              <option value="dumbbell">Dumbbell</option>
              <option value="machine">Machine</option>
              <option value="cable">Cable</option>
              <option value="bodyweight">Bodyweight</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label class="field-label">Category</label>
            <select v-model="form.category" class="field-input">
              <option value="chest">Chest</option>
              <option value="back">Back</option>
              <option value="legs">Legs</option>
              <option value="shoulders">Shoulders</option>
              <option value="arms">Arms</option>
              <option value="core">Core</option>
              <option value="cardio">Cardio</option>
            </select>
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="field-label">Primary muscles</label>
            <input v-model="form.primaryMuscles" class="field-input" placeholder="Chest, triceps" required/>
            <p class="field-help">Separate multiple muscles with commas.</p>
          </div>

          <div>
            <label class="field-label">Secondary muscles</label>
            <input v-model="form.secondaryMuscles" class="field-input" placeholder="Front delts"/>
          </div>
        </div>

        <div>
          <label class="field-label">Description and instructions</label>
          <textarea v-model="form.description" class="field-input min-h-28 resize-y" placeholder="Explain how to perform the exercise..." required />
        </div>

        <label class="flex items-center gap-3 rounded-xl border border-surface-border bg-surface/40 p-4 text-sm text-zinc-300">
          <input v-model="form.isCardio" type="checkbox" class="h-4 w-4 accent-primary" />
          Mark as cardio exercise
        </label>
      </div>

      <div class="mt-6 flex justify-end gap-3 border-t border-surface-border pt-5">
        <button type="button"
          class="rounded-xl border border-surface-border px-4 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-surface-hover"
          @click="emit('close')">
          Cancel
        </button>

        <button type="submit" :disabled="isLoading" class="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-hover disabled:opacity-60">
          {{ isLoading ? 'Saving...' : 'Save exercise' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.field-label {
  display: block;
  margin-bottom: 0.5rem;
  color: rgb(212 212 216);
  font-size: 0.875rem;
  font-weight: 600;
}

.field-input {
  width: 100%;
  border: 1px solid var(--color-surface-border);
  border-radius: 0.75rem;
  background: rgba(8, 8, 12, 0.7);
  padding: 0.75rem 1rem;
  color: white;
  outline: none;
}

.field-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(255, 46, 147, 0.2);
}

.field-help {
  margin-top: 0.4rem;
  color: rgb(113 113 122);
  font-size: 0.75rem;
}
</style>