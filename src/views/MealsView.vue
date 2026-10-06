<script setup>
import { onMounted, ref } from 'vue'
import PresetMealSelector from '@/components/meals/PresetMealSelector.vue'
import AiScannerModal from '@/components/meals/AiScannerModal.vue'
import MealFormModal from '@/components/meals/MealFormModal.vue'
import { useMealsStore } from '@/stores/meals'

const mealsStore = useMealsStore()

const showAiScanner = ref(false)
const showMealForm = ref(false)
const selectedMeal = ref(null)
const editingMeal = ref(null)

function handleMealSelect(meal) {
  selectedMeal.value = meal
}

async function handleMealSubmit(meal) {
  try {
    if (editingMeal.value) {
      await mealsStore.updateUserMeal(
        editingMeal.value.$id,
        meal,
      )
    } else {
      await mealsStore.addUserMeal(meal)
    }

    editingMeal.value = null
    showMealForm.value = false
  } catch {
    // display error message in the modal
  }
}

function startEditingMeal(meal) {
  editingMeal.value = meal
  showMealForm.value = true
}

function closeMealForm() {
  editingMeal.value = null
  showMealForm.value = false
}
async function handleDeleteMeal(mealId) {
  if (!confirm('Delete this meal?')) return

  await mealsStore.deleteUserMeal(mealId)
}

onMounted(() => {
  mealsStore.fetchUserMeals()
})
</script>

<template>
  <div class="space-y-6">
    <header class="border-b border-surface-border pb-6">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-primary"> Meals and nutrition </p>
      <h1 class="mt-2 text-3xl font-bold text-white"> Build your meal log </h1>
      <p class="mt-2 text-sm text-zinc-400"> Choose from verified presets or create meals for your own routine. </p>
    </header>

    <div v-if="mealsStore.error" class="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200" >
      {{ mealsStore.error }}
    </div>

    <div class="grid gap-6 xl:grid-cols-2">
      <!-- Admin-created meals -->
      <section class="space-y-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Verified library
          </p>

          <h2 class="mt-1 text-xl font-bold text-white">
            Preset meals
          </h2>

          <p class="mt-1 text-sm text-zinc-400">
            Meals prepared by the RepIQ team.
          </p>
        </div>

        <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.85fr)] lg:items-start">
          <div class="glass-panel rounded-2xl p-5">
            <PresetMealSelector @select="handleMealSelect" />
          </div>

          <div
            class="rounded-2xl border border-primary/20 bg-primary-muted p-5 lg:sticky lg:top-6"
          >
            <template v-if="selectedMeal">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    Meal details
                  </p>

                  <h3 class="mt-1 text-xl font-bold text-white">
                    {{ selectedMeal.name }}
                  </h3>

                  <p class="mt-1 text-sm capitalize text-zinc-300">
                    {{ selectedMeal.category }}
                    ·
                    {{ selectedMeal.servingSize }}
                  </p>
                </div>

                <button
                  type="button"
                  class="text-xs text-zinc-400 hover:text-white"
                  @click="selectedMeal = null"
                >
                  Close
                </button>
              </div>

              <div class="mt-5 grid grid-cols-2 gap-3">
                <div class="rounded-xl bg-background/50 p-3 text-center">
                  <span class="block text-[10px] uppercase text-zinc-500">
                    Calories
                  </span>
                  <strong class="text-sm text-white">
                    {{ selectedMeal.calories }} kcal
                  </strong>
                </div>

                <div class="rounded-xl bg-background/50 p-3 text-center">
                  <span class="block text-[10px] uppercase text-zinc-500">
                    Protein
                  </span>
                  <strong class="text-sm text-white">
                    {{ selectedMeal.protein }}g
                  </strong>
                </div>

                <div class="rounded-xl bg-background/50 p-3 text-center">
                  <span class="block text-[10px] uppercase text-zinc-500">
                    Carbs
                  </span>
                  <strong class="text-sm text-white">
                    {{ selectedMeal.carbs }}g
                  </strong>
                </div>

                <div class="rounded-xl bg-background/50 p-3 text-center">
                  <span class="block text-[10px] uppercase text-zinc-500">
                    Fats
                  </span>
                  <strong class="text-sm text-white">
                    {{ selectedMeal.fats }}g
                  </strong>
                </div>
              </div>

              <div class="mt-5">
                <h4 class="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Recipe instructions
                </h4>

                <p class="mt-1 whitespace-pre-line text-sm leading-6 text-zinc-300">
                  {{ selectedMeal.instructions || 'No recipe instructions available.' }}
                </p>
              </div>
            </template>

            <div v-else class="flex min-h-56 items-center justify-center text-center">
              <div>
                <p class="text-sm font-semibold text-zinc-300">
                  Select a preset meal
                </p>
                <p class="mt-1 text-xs text-zinc-500">
                  Nutrition and recipe details will appear here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- User-created meals -->
      <section class="space-y-4">
        <div class="flex items-end justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-accent"> Your library </p>
            <h2 class="mt-1 text-xl font-bold text-white"> My meals </h2>
            <p class="mt-1 text-sm text-zinc-400"> Meals you created for your own logs. </p>
          </div>

          <button type="button" class="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary-hover" @click="startEditingMeal(null)" >
            Add meal
          </button>
        </div>

        <div v-if="mealsStore.isLoading" class="rounded-2xl border border-surface-border bg-surface/30 px-5 py-12 text-center text-sm text-zinc-500" >
          Loading your meals...
        </div>

        <div v-else-if="mealsStore.userMeals.length === 0" class="rounded-2xl border border-dashed border-surface-border bg-surface/20 px-5 py-12 text-center" >
          <p class="text-sm font-semibold text-zinc-300"> No personal meals yet </p>
          <p class="mt-1 text-xs text-zinc-500"> Click “Add meal” to create your first one. </p>
        </div>

        <div v-else class="space-y-3">
          <article v-for="meal in mealsStore.userMeals" :key="meal.$id" class="glass-panel rounded-2xl p-5" >
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="font-semibold text-white"> {{ meal.name }} </h3>
                <p class="mt-1 text-xs text-primary"> {{ meal.category }} · {{ meal.servingSize }} </p>
              </div>

              <div class="flex items-center gap-3">
                <button type="button" class="text-xs font-semibold text-primary hover:text-pink-300" @click="startEditingMeal(meal)" >
                  Edit
                </button>

                <button type="button" class="text-xs font-semibold text-red-300 hover:text-red-200" @click="handleDeleteMeal(meal.$id)" >
                  Delete
                </button>
              </div>
            </div>

            <div class="mt-4 grid grid-cols-4 gap-2 text-center">
              <div class="rounded-lg bg-background/50 p-2">
                <span class="block text-[10px] uppercase text-zinc-500">Calories</span>
                <strong class="text-xs text-white">{{ meal.calories }} kcal</strong>
              </div>
              <div class="rounded-lg bg-background/50 p-2">
                <span class="block text-[10px] uppercase text-zinc-500">Protein</span>
                <strong class="text-xs text-white">{{ meal.protein }}g</strong>
              </div>
              <div class="rounded-lg bg-background/50 p-2">
                <span class="block text-[10px] uppercase text-zinc-500">Carbs</span>
                <strong class="text-xs text-white">{{ meal.carbs }}g</strong>
              </div>
              <div class="rounded-lg bg-background/50 p-2">
                <span class="block text-[10px] uppercase text-zinc-500">Fats</span>
                <strong class="text-xs text-white">{{ meal.fats }}g</strong>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>

    <AiScannerModal v-if="showAiScanner" @close="showAiScanner = false" />

    <MealFormModal v-if="showMealForm" :editing-meal="editingMeal" :is-loading="mealsStore.isLoading" @submit="handleMealSubmit" @close="closeMealForm" />
  </div>
</template>