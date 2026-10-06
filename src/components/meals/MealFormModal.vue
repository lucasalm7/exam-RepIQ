<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  editingMeal: {
    type: Object,
    default: null,
  },
  isLoading: Boolean,
})

const emit = defineEmits(['submit', 'close'])

const form = reactive({
  name: '',
  category: 'lunch',
  servingSize: '1 serving',
  calories: 0,
  protein: 0,
  carbs: 0,
  fats: 0,
  instructions: '',
})

function resetForm() {
  Object.assign(form, {
    name: '',
    category: 'lunch',
    servingSize: '1 serving',
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    instructions: '',
  })
}

watch(
  () => props.editingMeal,
  meal => {
    if (!meal) {
      resetForm()
      return
    }

    Object.assign(form, {
      name: meal.name || '',
      category: meal.category || 'lunch',
      servingSize: meal.servingSize || '1 serving',
      calories: meal.calories || 0,
      protein: meal.protein || 0,
      carbs: meal.carbs || 0,
      fats: meal.fats || 0,
      instructions: meal.instructions || '',
    })
  },
  { immediate: true },
)

function submit() {
  emit('submit', {
    name: form.name,
    category: form.category,
    servingSize: form.servingSize,
    calories: Number(form.calories),
    protein: Number(form.protein),
    carbs: Number(form.carbs),
    fats: Number(form.fats),
    instructions: form.instructions,
  })
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
    <form class="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-surface-border bg-background p-6 shadow-glass"
      @submit.prevent="submit">
      <div class="mb-6 flex items-start justify-between border-b border-surface-border pb-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-primary"> Meal library </p>

          <h2 class="mt-1 text-xl font-bold text-white"> {{ editingMeal ? 'Edit preset meal' : 'Add preset meal' }} </h2>

          <p class="mt-1 text-sm text-zinc-400"> Add a verified meal with its serving size and nutrition details. </p>
        </div>

        <button type="button" aria-label="Close meal form" class="text-xl text-zinc-500 transition hover:text-white" @click="emit('close')" >
          s
        </button>
      </div>

      <div class="space-y-6">
        <section class="space-y-4">
          <div>
            <h3 class="text-sm font-semibold text-white">Meal details</h3>
            <p class="mt-1 text-xs text-zinc-500"> Give this preset a clear name and serving description. </p>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="field-label" for="meal-name">Meal name</label>
              <input id="meal-name" v-model="form.name" class="field-input" placeholder="e.g. Chicken rice bowl" required/>
            </div>

            <div>
              <label class="field-label" for="meal-category">Category</label>
              <select id="meal-category" v-model="form.category" class="field-input">
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>
          </div>

          <div>
            <label class="field-label" for="meal-serving-size">Serving size</label>
            <input id="meal-serving-size" v-model="form.servingSize" class="field-input" placeholder="e.g. 1 bowl (300g)" required />
          </div>
        </section>

        <section class="space-y-4 border-t border-surface-border pt-5">
          <div>
            <h3 class="text-sm font-semibold text-white">Nutrition</h3>
            <p class="mt-1 text-xs text-zinc-500">
              Enter the nutritional values for one serving.
            </p>
          </div>

          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label class="field-label" for="meal-calories">Calories</label>
              <div class="relative">
                <input id="meal-calories" v-model="form.calories" type="number" min="0" class="field-input pr-14" placeholder="0" required />
                <span class="field-suffix">kcal</span>
              </div>
            </div>

            <div>
              <label class="field-label" for="meal-protein">Protein</label>
              <div class="relative">
                <input id="meal-protein" v-model="form.protein" type="number" min="0" step="0.1" class="field-input pr-10" placeholder="0" required />
                <span class="field-suffix">g</span>
              </div>
            </div>

            <div>
              <label class="field-label" for="meal-carbs">Carbs</label>
              <div class="relative">
                <input id="meal-carbs" v-model="form.carbs" type="number" min="0" step="0.1" class="field-input pr-10" placeholder="0" required />
                <span class="field-suffix">g</span>
              </div>
            </div>

            <div>
              <label class="field-label" for="meal-fats">Fats</label>
              <div class="relative">
                <input id="meal-fats" v-model="form.fats" type="number" min="0" step="0.1" class="field-input pr-10" placeholder="0" required />
                <span class="field-suffix">g</span>
              </div>
            </div>
          </div>
        </section>

        <section class="space-y-4 border-t border-surface-border pt-5">
          <div>
            <h3 class="text-sm font-semibold text-white">Preparation</h3>
            <p class="mt-1 text-xs text-zinc-500"> Add optional instructions for preparing this meal. </p>
          </div>

          <div>
            <label class="field-label" for="meal-instructions"> Instructions </label>
            <textarea id="meal-instructions" v-model="form.instructions" class="field-input min-h-28 resize-y" rows="4" placeholder="Step 1: Cook the rice..." />
          </div>
        </section>
      </div>

      <div class="mt-6 flex justify-end gap-3 border-t border-surface-border pt-5">
        <button type="button" class="rounded-xl border border-surface-border px-4 py-2.5 text-sm font-semibold text-zinc-300 transition hover:bg-surface-hover hover:text-white" @click="emit('close')" >
          Cancel
        </button>

        <button type="submit" :disabled="isLoading" class="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60" >
          {{ isLoading ? 'Saving...' : 'Save meal' }}
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
  transition: border-color 0.2s, box-shadow 0.2s;
}

.field-input::placeholder {
  color: rgb(82 82 91);
}

.field-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(255, 46, 147, 0.2);
}

.field-suffix {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgb(113 113 122);
  font-size: 0.75rem;
  pointer-events: none;
}
</style>