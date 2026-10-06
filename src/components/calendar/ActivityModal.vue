<script setup>
import { ref } from 'vue'
import ExerciseSelector from '../exercises/ExerciseSelector.vue/index.js'

const emit = defineEmits(['close', 'select'])

const selectedExercise = ref(null)

function handleExerciseSelect(exercise) {
  selectedExercise.value = exercise
  emit('select', exercise)
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
    <section class="w-full max-w-2xl rounded-2xl border border-surface-border bg-background p-6 shadow-glass">
      <div class="mb-6 flex items-start justify-between border-b border-surface-border pb-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-primary"> Workout log </p>
          <h2 class="mt-1 text-xl font-bold text-white"> Log an exercise </h2>
        </div>

        <button type="button" class="text-xl text-zinc-500 hover:text-white" @click="emit('close')" >
          x
        </button>
      </div>

      <ExerciseSelector @select="handleExerciseSelect" />

      <div v-if="selectedExercise" class="mt-5 rounded-xl border border-success/20 bg-success-muted p-3 text-sm text-success">
        Selected: {{ selectedExercise.name }}
      </div>
    </section>
  </div>
</template>