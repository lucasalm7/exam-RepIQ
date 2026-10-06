<script setup>
import { reactive, ref } from 'vue'

const emit = defineEmits(['submit', 'back'])

defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
})

const form = reactive({
  birthdate: '',
  height: '',
  weight: '',
  gender: 'male',
  activityLevel: 'moderate',
})

const localError = ref('')

// Calculate Age from Birthdate
function calculateAge(birthdate) {
  const diff = Date.now() - new Date(birthdate).getTime()
  const ageDate = new Date(diff)
  return Math.abs(ageDate.getUTCFullYear() - 1970)
}

// Mifflin-St Jeor BMR & TDEE Calculation
function calculateMetrics() {
  const weight = Number(form.weight)
  const height = Number(form.height)
  const age = calculateAge(form.birthdate)

  let bmr = 10 * weight + 6.25 * height - 5 * age
  bmr = form.gender === 'male' ? bmr + 5 : bmr - 161

  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  }

  const tdee = bmr * (multipliers[form.activityLevel] || 1.55)

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
  }
}

function handleSubmit() {
  localError.value = ''

  if (!form.birthdate || !form.height || !form.weight) {
    localError.value = 'Please complete all physical metrics.'
    return
  }

  const { bmr, tdee } = calculateMetrics()

  emit('submit', {
    ...form,
    bmr,
    tdee,
  })
}
</script>

<template>
  <section class="step-container">
    <div class="mb-5 flex items-center gap-2 text-xs text-zinc-500">
      <span class="text-zinc-400">Account details</span>
      <span class="h-px flex-1 bg-surface-border" />
      <span class="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">2</span>
      <span>Profile metrics</span>
    </div>

    <p v-if="localError" class="mb-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200" role="alert">{{ localError }}</p>

    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div>
        <label for="birthdate" class="mb-2 block text-sm font-medium text-zinc-300">Date of birth</label>
        <input id="birthdate" v-model="form.birthdate" type="date" required
          class="w-full rounded-xl border border-surface-border bg-background/60 px-4 py-3 text-sm text-white outline-none transition scheme-dark focus:border-primary focus:ring-2 focus:ring-primary/20"/>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label for="height" class="mb-2 block text-sm font-medium text-zinc-300">Height <span class="text-zinc-500">(cm)</span></label>
        <input id="height" v-model="form.height" type="number" min="50" max="250" placeholder="175" required
          class="w-full rounded-xl border border-surface-border bg-background/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-primary focus:ring-2 focus:ring-primary/20"/>
        </div>

        <div>
          <label for="weight" class="mb-2 block text-sm font-medium text-zinc-300">Weight <span class="text-zinc-500">(kg)</span></label>
        <input id="weight" v-model="form.weight" type="number" step="0.1" min="30" max="300" placeholder="70" required
          class="w-full rounded-xl border border-surface-border bg-background/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-primary focus:ring-2 focus:ring-primary/20"/>
        </div>
      </div>

      <div>
        <label for="gender" class="mb-2 block text-sm font-medium text-zinc-300">Gender</label>
        <select id="gender" v-model="form.gender" class="w-full rounded-xl border border-surface-border bg-background/60 px-4 py-3 text-sm text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20">
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label for="activityLevel" class="mb-2 block text-sm font-medium text-zinc-300">Activity level</label>
        <select id="activityLevel" v-model="form.activityLevel" class="w-full rounded-xl border border-surface-border bg-background/60 px-4 py-3 text-sm text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20">
          <option value="sedentary">Sedentary (Little or no exercise)</option>
          <option value="light">Lightly Active (1-3 days/week)</option>
          <option value="moderate">Moderately Active (3-5 days/week)</option>
          <option value="active">Very Active (6-7 days/week)</option>
          <option value="very_active">Extra Active (Physical job or hard training)</option>
        </select>
      </div>

      <div class="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
        <button type="button" :disabled="isLoading" class="rounded-xl border border-surface-border px-4 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-surface-hover hover:text-white disabled:cursor-not-allowed disabled:opacity-50" @click="emit('back')">
          Back
        </button>
        <button type="submit" :disabled="isLoading" class="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-60">
          {{ isLoading ? 'Creating account...' : 'Create account' }}
        </button>
      </div>
    </form>
  </section>
</template>