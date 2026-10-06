<script setup>
import { onMounted, ref } from 'vue'
import ExerciseSelector from '@/components/workouts/ExerciseSelector.vue'
import ExerciseFormModal from '@/components/workouts/ExerciseFormModal.vue'
import { useWorkoutsStore } from '@/stores/workouts'

const workoutsStore = useWorkoutsStore()

const showExerciseForm = ref(false)
const editingExercise = ref(null)

const selectedGlobalExercise = ref(null)

function handleGlobalExerciseSelect(exercise) {
  selectedGlobalExercise.value = exercise
}

function startAddingExercise() {
  editingExercise.value = null
  showExerciseForm.value = true
}

function startEditingExercise(exercise) {
  editingExercise.value = exercise
  showExerciseForm.value = true
}

function closeExerciseForm() {
  editingExercise.value = null
  showExerciseForm.value = false
}

async function handleExerciseSubmit(exerciseData) {
  try {
    if (editingExercise.value) {
      await workoutsStore.updateUserExercise(
        editingExercise.value.$id,
        exerciseData,
      )
    } else {
      await workoutsStore.addUserExercise(exerciseData)
    }

    closeExerciseForm()
  } catch {
    // error
  }
}

async function handleDeleteExercise(exerciseId) {
  if (!confirm('Delete this exercise?')) return

  try {
    await workoutsStore.deleteUserExercise(exerciseId)
  } catch {
    // error
  }
}

onMounted(() => {
  workoutsStore.fetchUserExercises()
})
</script>

<template>
  <div class="space-y-6">
    <header class="border-b border-surface-border pb-6">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-primary"> Workout library </p>
      <h1 class="mt-2 text-3xl font-bold text-white"> Build your exercise routine </h1>
      <p class="mt-2 text-sm text-zinc-400">
        Choose verified exercises or create movements for your own routine.
      </p>
    </header>

    <div v-if="workoutsStore.error" class="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200" role="alert" >
      {{ workoutsStore.error }}
    </div>

    <div class="grid gap-6 xl:grid-cols-2">
      <!-- Global exercises -->
      <section class="space-y-4">
  <div>
    <p class="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
      Verified library
    </p>

    <h2 class="mt-1 text-xl font-bold text-white">
      Global exercises
    </h2>

    <p class="mt-1 text-sm text-zinc-400">
      Exercises prepared by the RepIQ team.
    </p>
  </div>

  <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.85fr)] lg:items-start">
    <div class="glass-panel rounded-2xl p-5">
      <ExerciseSelector @select="handleGlobalExerciseSelect" />
    </div>

    <div
      class="rounded-2xl border border-primary/20 bg-primary-muted p-5 lg:sticky lg:top-6"
    >
      <template v-if="selectedGlobalExercise">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Exercise details
            </p>

            <h3 class="mt-1 text-xl font-bold text-white">
              {{ selectedGlobalExercise.name }}
            </h3>

            <p class="mt-1 text-sm capitalize text-zinc-300">
              {{ selectedGlobalExercise.category }}
              ·
              {{ selectedGlobalExercise.equipment }}
            </p>
          </div>

          <button
            type="button"
            class="text-xs text-zinc-400 hover:text-white"
            @click="selectedGlobalExercise = null"
          >
            Close
          </button>
        </div>

        <div class="mt-5 space-y-4">
          <div>
            <h4 class="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Primary muscles
            </h4>

            <p class="mt-1 text-sm text-zinc-200">
              {{
                Array.isArray(selectedGlobalExercise.primaryMuscles)
                  ? selectedGlobalExercise.primaryMuscles.join(', ')
                  : selectedGlobalExercise.primaryMuscles || 'Not specified'
              }}
            </p>
          </div>

          <div v-if="selectedGlobalExercise.secondaryMuscles?.length">
            <h4 class="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Secondary muscles
            </h4>

            <p class="mt-1 text-sm text-zinc-200">
              {{
                Array.isArray(selectedGlobalExercise.secondaryMuscles)
                  ? selectedGlobalExercise.secondaryMuscles.join(', ')
                  : selectedGlobalExercise.secondaryMuscles
              }}
            </p>
          </div>

          <div>
            <h4 class="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Instructions
            </h4>

            <p class="mt-1 whitespace-pre-line text-sm leading-6 text-zinc-300">
              {{ selectedGlobalExercise.description || 'No instructions available.' }}
            </p>
          </div>
        </div>
      </template>

      <div v-else class="flex min-h-56 items-center justify-center text-center">
        <div>
          <p class="text-sm font-semibold text-zinc-300">
            Select an exercise
          </p>
          <p class="mt-1 text-xs text-zinc-500">
            Details will appear here.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>  

      <!-- User-created exercises -->
      <section class="space-y-4">
        <div class="flex items-end justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-accent"> Your library </p>
            <h2 class="mt-1 text-xl font-bold text-white"> My exercises </h2>
            <p class="mt-1 text-sm text-zinc-400"> Exercises you created for your own routine. </p>
          </div>

          <button type="button" class="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary-hover" @click="startAddingExercise" >
            Add exercise
          </button>
        </div>

        <div v-if="workoutsStore.isLoading && workoutsStore.userExercises.length === 0" class="rounded-2xl border border-surface-border bg-surface/30 px-5 py-12 text-center text-sm text-zinc-500" >
          Loading your exercises...
        </div>

        <div v-else-if="workoutsStore.userExercises.length === 0" class="rounded-2xl border border-dashed border-surface-border bg-surface/20 px-5 py-12 text-center" >
          <p class="text-sm font-semibold text-zinc-300"> No personal exercises yet </p>

          <p class="mt-1 text-xs text-zinc-500"> Click “Add exercise” to create your first one. </p>
        </div>

        <div v-else class="space-y-3">
          <article v-for="exercise in workoutsStore.userExercises" :key="exercise.$id" class="glass-panel rounded-2xl p-5" >
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="font-semibold text-white"> {{ exercise.name }} </h3>

                <p class="mt-1 text-xs text-primary"> {{ exercise.category }} · {{ exercise.equipment }} </p>
              </div>

              <div class="flex items-center gap-3">
                <button type="button" class="text-xs font-semibold text-primary hover:text-pink-300" @click="startEditingExercise(exercise)" >
                  Edit
                </button>

                <button type="button" class="text-xs font-semibold text-red-300 hover:text-red-200" @click="handleDeleteExercise(exercise.$id)" >
                  Delete
                </button>
              </div>
            </div>

            <p class="mt-3 text-sm text-zinc-400">
              {{
                Array.isArray(exercise.primaryMuscles)
                  ? exercise.primaryMuscles.join(', ')
                  : exercise.primaryMuscles || 'Muscles not specified'
              }}
            </p>

            <p class="mt-2 text-xs text-zinc-500"> {{ exercise.description || 'No description available.' }} </p>
          </article>
        </div>
      </section>
    </div>

    <ExerciseFormModal v-if="showExerciseForm" :editing-exercise="editingExercise" :is-loading="workoutsStore.isLoading" @submit="handleExerciseSubmit" @close="closeExerciseForm" />
  </div>
</template>