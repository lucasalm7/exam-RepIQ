<script setup>
import { reactive, ref } from 'vue'

const emit = defineEmits(['next'])

const form = reactive({
  username: '',
  email: '',
  password: '',
})

const localError = ref('')

function handleNext() {
  localError.value = ''

  if (!form.username.trim() || !form.email.trim() || !form.password) {
    localError.value = 'Please fill in all fields.'
    return
  }

  if (form.password.length < 8) {
    localError.value = 'Password must be at least 8 characters.'
    return
  }

  emit('next', { ...form })
}
</script>

<template>
  <section class="step-container">
    <div class="mb-5 flex items-center gap-2 text-xs text-zinc-500">
      <span class="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">1</span>
      <span>Account details</span>
      <span class="h-px flex-1 bg-surface-border" />
      <span>Profile metrics</span>
    </div>

    <p v-if="localError" class="mb-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200" role="alert">{{ localError }}</p>

    <form class="space-y-4" @submit.prevent="handleNext">
      <div>
        <label for="username" class="mb-2 block text-sm font-medium text-zinc-300">Username</label>
        <input id="username" v-model="form.username" type="text" placeholder="e.g. Alex123" required autocomplete="username"
          class="w-full rounded-xl border border-surface-border bg-background/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div>
        <label for="email" class="mb-2 block text-sm font-medium text-zinc-300">Email</label>
        <input id="email" v-model="form.email" type="email" placeholder="alex@example.com" required autocomplete="email"
          class="w-full rounded-xl border border-surface-border bg-background/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div>
        <div class="mb-2 flex items-center justify-between gap-3">
          <label for="password" class="block text-sm font-medium text-zinc-300">Password</label>
          <span class="text-xs text-zinc-500">8+ characters</span>
        </div>
        <input id="password" v-model="form.password" type="password" placeholder="At least 8 characters" required autocomplete="new-password"
          class="w-full rounded-xl border border-surface-border bg-background/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <button type="submit" class="mt-2 w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/50">Continue to profile</button>
    </form>
  </section>
</template>