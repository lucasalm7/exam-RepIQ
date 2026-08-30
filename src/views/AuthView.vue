<script setup>
import { ref } from 'vue'
import OnboardingStepOne from '@/components/profile/OnboardingStepOne.vue'
import OnboardingStepTwo from '@/components/profile/OnboardingStepTwo.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const currentStep = ref(1)
const formData = ref({ username: '', email: '', password: '', age: null, height: null, weight: null, gender: '', activityLevel: '' })

const handleStepOne = (stepOneData) => {
  formData.value = { ...formData.value, ...stepOneData }
  currentStep.value = 2
}

const handleStepTwo = async (stepTwoData) => {
  formData.value = { ...formData.value, ...stepTwoData }
  await authStore.registerUser(formData.value)
}
</script>

<template>
  <div class="min-h-screen bg-background flex items-center justify-center p-4">
    <div class="glass-panel w-full max-w-md p-8 rounded-2xl border border-surface-border">
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold text-white tracking-tight">Join LIFT-LOG</h1>
        <p class="text-xs text-zinc-400 mt-1">Step {{ currentStep }} of 2</p>
      </div>

      <OnboardingStepOne v-if="currentStep === 1" @next="handleStepOne" />
      <OnboardingStepTwo v-else @submit="handleStepTwo" @back="currentStep = 1" />
    </div>
  </div>
</template>