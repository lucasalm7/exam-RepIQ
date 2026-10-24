<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'
import { calculateBMR } from '@/composables/useTdeeCalculator'

const authStore = useAuthStore()

const isLoading = ref(false)
const saveSuccess = ref(false)
const errorMessage = ref('')

// Reactive form state matching Appwrite profiles schema
// its reactive because we want to bind it to the form inputs and have the UI update automatically when the values change. 
const form = reactive({
  username: '',
  height: 175,
  weight: 70,
  gender: 'male',
  activityLevel: 'moderate',
  birthDate: '',
  isPrivate: false,
})

// Populate form fields from authStore user profile when mounted
onMounted(() => {
  const profile = authStore.userProfile || {}
  form.username = profile.username || authStore.user?.name || ''
  form.height = profile.height || 175
  form.weight = profile.weight || 70
  form.gender = profile.gender || 'male'
  form.activityLevel = profile.activityLevel || 'moderate'
  form.birthDate = profile.birthDate ? profile.birthDate.split('T')[0] : ''
  form.isPrivate = Boolean(profile.isPrivate)
})

// Dynamic calculation for BMR & TDEE leveraging the shared composable utility
const estimatedBmr = computed(() => {
  if (!form.weight || !form.height) return 0
  const age = form.birthDate ? calculateAge(form.birthDate) : 25
  return calculateBMR({
    weightKg: Number(form.weight),
    heightCm: Number(form.height),
    age,
    sex: form.gender,
  })
})

const estimatedTdee = computed(() => {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  }
  const mult = multipliers[form.activityLevel] || 1.375
  return Math.round(estimatedBmr.value * mult)
})

function calculateAge(birthDateString) {
  const birthDate = new Date(birthDateString)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

async function handleSaveProfile() {
  isLoading.value = true
  saveSuccess.value = false
  errorMessage.value = ''

  try {
    const updatedData = {
      username: form.username,
      height: Number(form.height),
      weight: Number(form.weight),
      gender: form.gender,
      activityLevel: form.activityLevel,
      birthDate: form.birthDate ? new Date(form.birthDate).toISOString() : null,
      isPrivate: form.isPrivate,
      bmr: estimatedBmr.value,
      tdee: estimatedTdee.value,
    }

    if (authStore.updateProfile) {
      await authStore.updateProfile(updatedData)
    }

    saveSuccess.value = true
    setTimeout(() => {
      saveSuccess.value = false
    }, 3000)
  } catch (err) {
    console.error('Failed to save profile:', err)
    errorMessage.value = err.message || 'Failed to update profile.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6 p-4 sm:p-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border pb-4">
      <div>
        <h1 class="text-2xl font-bold text-white">Profile Settings</h1>
        <p class="text-xs text-zinc-400">Manage your personal details, physical metrics, and privacy preferences.</p>
      </div>
      <div v-if="authStore.userProfile?.isAdmin" class="self-start sm:self-auto">
        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary/20 text-primary border border-primary/40 uppercase tracking-wider">
          Staff Account
        </span>
      </div>
    </div>

    <!-- Main Form Grid -->
    <form @submit.prevent="handleSaveProfile" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- Left 2 Cols: Personal Metrics -->
        <div class="md:col-span-2 space-y-4 rounded-2xl border border-surface-border bg-surface p-5">
          <h2 class="text-base font-bold text-white mb-2">Personal Metrics</h2>

          <!-- Username -->
          <div>
            <label class="block text-xs font-semibold text-zinc-300 mb-1">Username</label>
            <input
              v-model="form.username"
              type="text"
              required
              class="w-full rounded-xl border border-surface-border bg-background/50 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
            />
          </div>

          <!-- Height & Weight Grid -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-zinc-300 mb-1">Height (cm)</label>
              <input
                v-model.number="form.height"
                type="number"
                min="100"
                max="250"
                required
                class="w-full rounded-xl border border-surface-border bg-background/50 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-zinc-300 mb-1">Weight (kg)</label>
              <input
                v-model.number="form.weight"
                type="number"
                step="0.1"
                min="30"
                max="300"
                required
                class="w-full rounded-xl border border-surface-border bg-background/50 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <!-- Gender & Birthdate Grid -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-zinc-300 mb-1">Gender</label>
              <select
                v-model="form.gender"
                class="w-full rounded-xl border border-surface-border bg-background/50 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-zinc-300 mb-1">Birth Date</label>
              <input
                v-model="form.birthDate"
                type="date"
                class="w-full rounded-xl border border-surface-border bg-background/50 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <!-- Activity Level -->
          <div>
            <label class="block text-xs font-semibold text-zinc-300 mb-1">Activity Level</label>
            <select
              v-model="form.activityLevel"
              class="w-full rounded-xl border border-surface-border bg-background/50 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none"
            >
              <option value="sedentary">Sedentary (Little or no exercise)</option>
              <option value="light">Light (Exercise 1-3 days/week)</option>
              <option value="moderate">Moderate (Exercise 3-5 days/week)</option>
              <option value="active">Active (Exercise 6-7 days/week)</option>
              <option value="very_active">Very Active (Hard exercise & physical job)</option>
            </select>
          </div>

          <!-- Privacy Toggle -->
          <div class="pt-2 border-t border-surface-border/50 flex items-center justify-between">
            <div>
              <span class="block text-xs font-semibold text-white">Private Profile</span>
              <span class="text-[11px] text-zinc-400">Hide stats from friends and public search</span>
            </div>
            <input
              v-model="form.isPrivate"
              type="checkbox"
              class="h-4 w-4 rounded border-surface-border accent-primary focus:ring-0"
            />
          </div>
        </div>

        <!-- Right 1 Col: Calculated Energy Metrics -->
        <div class="space-y-4 rounded-2xl border border-surface-border bg-surface p-5 flex flex-col justify-between">
          <div>
            <h2 class="text-base font-bold text-white mb-2">Calculated Energy</h2>
            <p class="text-xs text-zinc-400 mb-4">Estimated metrics based on your physical attributes.</p>

            <div class="space-y-3">
              <!-- BMR -->
              <div class="rounded-xl border border-surface-border bg-background/40 p-3 text-center">
                <span class="text-[10px] font-semibold uppercase tracking-wider text-amber-400">BMR</span>
                <div class="mt-1 text-xl font-extrabold text-white">
                  {{ estimatedBmr }} <span class="text-xs font-normal text-zinc-400">kcal/day</span>
                </div>
                <span class="text-[10px] text-zinc-500">Base Metabolic Rate</span>
              </div>

              <!-- TDEE -->
              <div class="rounded-xl border border-surface-border bg-background/40 p-3 text-center">
                <span class="text-[10px] font-semibold uppercase tracking-wider text-sky-400">TDEE</span>
                <div class="mt-1 text-xl font-extrabold text-white">
                  {{ estimatedTdee }} <span class="text-xs font-normal text-zinc-400">kcal/day</span>
                </div>
                <span class="text-[10px] text-zinc-500">Total Daily Energy Expenditure</span>
              </div>
            </div>
          </div>

          <!-- Save Button -->
          <div class="pt-4">
            <button
              type="submit"
              :disabled="isLoading"
              class="flex items-center justify-center gap-2 w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-zinc-950 transition hover:bg-primary/90 disabled:opacity-50"
            >
              <template v-if="isLoading">
                <LoadingSpinner text="" class="py-0" />
                <span>Saving Changes...</span>
              </template>
              <span v-else>Save Profile</span>
            </button>

            <!-- Alerts -->
            <p v-if="saveSuccess" class="mt-2 text-center text-xs font-semibold text-emerald-400">
              Profile updated successfully!
            </p>
            <p v-if="errorMessage" class="mt-2 text-center text-xs font-semibold text-rose-400">
              {{ errorMessage }}
            </p>
          </div>
        </div>

      </div>
    </form>
  </div>
</template>