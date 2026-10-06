<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import OnboardingStepOne from '@/components/profile/OnboardingStepOne.vue'
import OnboardingStepTwo from '@/components/profile/OnboardingStepTwo.vue'

const router = useRouter()
const authStore = useAuthStore()

const mode = ref('login') // 'login' or 'register'
const step = ref(1)

const loginEmail = ref('')
const loginPassword = ref('')

const stepOneData = ref(null)

// Login Handler
async function handleLogin() {
  try {
    await authStore.login(loginEmail.value, loginPassword.value)
    router.push({ name: 'overview' })
  } catch (err) {
    // Error state managed by authStore.error
  }
}

// Step 1 Cache
function handleStepOneNext(data) {
  stepOneData.value = data
  step.value = 2
}

// Step 2 Submission (Creates Auth Account + Profiles Document)
async function handleStepTwoSubmit(stepTwoData) {
  try {
    // 1. Create Auth Account & Session
    await authStore.register(
      stepOneData.value.email,
      stepOneData.value.password,
      stepOneData.value.username
    )

    // 2. Create Profile Document
    await authStore.createProfile({
      username: stepOneData.value.username,
      ...stepTwoData,
    })

    // 3. Redirect to Overview Dashboard
    router.push({ name: 'overview' })
  } catch (err) {
    // Store captures error state
  }
}
</script>

<template>
  <div class="relative min-h-[calc(100vh-3rem)] overflow-hidden bg-background px-4 py-8 sm:px-6 lg:px-10">
    <div class="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
    <div class="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />

    <div class="relative mx-auto grid min-h-[calc(100vh-7rem)] w-full max-w-5xl overflow-hidden rounded-3xl border border-surface-border bg-surface/40 shadow-glass backdrop-blur-xl lg:grid-cols-[0.9fr_1.1fr]">
      <aside class="hidden flex-col justify-between border-r border-surface-border bg-gradient-to-br from-primary/15 via-transparent to-accent/10 p-10 lg:flex">
        <div>
          <div class="mb-10 flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lg font-black text-white shadow-lg shadow-primary/25">R</div>
            <span class="text-lg font-bold tracking-tight text-white">RepIQ</span>
          </div>
          <p class="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary">Train with intention</p>
          <h1 class="max-w-sm text-4xl font-bold leading-tight tracking-tight text-white">Build the routine that builds you.</h1>
          <p class="mt-5 max-w-sm text-sm leading-6 text-zinc-400">Track your workouts, meals, and progress in one focused space made for consistency.</p>
        </div>
        <div class="grid grid-cols-3 gap-3 text-center text-xs text-zinc-400">
          <div class="rounded-2xl border border-surface-border bg-background/30 px-3 py-4"><strong class="block text-lg text-white">01</strong>Plan</div>
          <div class="rounded-2xl border border-surface-border bg-background/30 px-3 py-4"><strong class="block text-lg text-white">02</strong>Train</div>
          <div class="rounded-2xl border border-surface-border bg-background/30 px-3 py-4"><strong class="block text-lg text-white">03</strong>Grow</div>
        </div>
      </aside>

      <div class="mx-auto flex w-full max-w-xl flex-col justify-center p-6 sm:p-10">
        <div class="mb-8 lg:hidden">
          <div class="mb-5 flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lg font-black text-white">R</div>
            <span class="text-lg font-bold tracking-tight text-white">RepIQ</span>
          </div>
          <p class="text-sm text-zinc-400">Your training log, sharpened.</p>
        </div>

        <div v-if="authStore.error" class="mb-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200" role="alert">
      {{ authStore.error }}
        </div>

        <div class="mb-8 rounded-xl border border-surface-border bg-background/40 p-1.5">
          <div class="grid grid-cols-2 gap-1">
            <button
              type="button"
              :class="mode === 'login' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-zinc-400 hover:bg-surface-hover hover:text-white'"
              class="rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors"
              @click="mode = 'login'; step = 1"
            >
              Sign in
            </button>
            <button
              type="button"
              :class="mode === 'register' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-zinc-400 hover:bg-surface-hover hover:text-white'"
              class="rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors"
              @click="mode = 'register'; step = 1"
            >
              Create account
            </button>
          </div>
    </div>

        <section v-if="mode === 'login'">
          <div class="mb-7">
            <p class="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Welcome back</p>
            <h2 class="text-3xl font-bold tracking-tight text-white">Ready for your next session?</h2>
            <p class="mt-2 text-sm text-zinc-400">Sign in to pick up where you left off.</p>
          </div>
          <form class="space-y-5" @submit.prevent="handleLogin">
            <div>
              <label for="login-email" class="mb-2 block text-sm font-medium text-zinc-300">Email</label>
              <input id="login-email" v-model="loginEmail" type="email" autocomplete="email" required class="w-full rounded-xl border border-surface-border bg-background/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="you@example.com" />
            </div>
            <div>
              <label for="login-password" class="mb-2 block text-sm font-medium text-zinc-300">Password</label>
              <input id="login-password" v-model="loginPassword" type="password" autocomplete="current-password" required class="w-full rounded-xl border border-surface-border bg-background/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="Enter your password" />
            </div>
            <button type="submit" :disabled="authStore.isLoading" class="w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-60">
              {{ authStore.isLoading ? 'Signing in...' : 'Sign in to RepIQ' }}
            </button>
          </form>
        </section>

        <section v-else>
          <div class="mb-7 flex items-end justify-between gap-4">
            <div>
              <p class="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Set up your profile</p>
              <h2 class="text-3xl font-bold tracking-tight text-white">Make your training measurable.</h2>
              <p class="mt-2 text-sm text-zinc-400">A few details help RepIQ tailor your targets.</p>
            </div>
            <span class="shrink-0 rounded-full border border-primary/20 bg-primary-muted px-3 py-1 text-xs font-semibold text-primary">Step {{ step }} of 2</span>
          </div>

          <OnboardingStepOne v-if="step === 1" @next="handleStepOneNext" />
          <OnboardingStepTwo v-else-if="step === 2" :is-loading="authStore.isLoading" @back="step = 1" @submit="handleStepTwoSubmit" />
        </section>
      </div>
    </div>
  </div>
</template>