<script setup>
import { onMounted, watch } from 'vue'
import { useLogsStore } from '@/stores/logs'

const logsStore = useLogsStore()

onMounted(() => {
  if (logsStore.selectedDate) {
    logsStore.fetchCalendarByDate(logsStore.selectedDate)
  }
})

watch(
  () => logsStore.selectedDate,
  (newDate) => {
    if (newDate) {
      logsStore.fetchCalendarByDate(newDate)
    }
  }
)
</script>

<template>
  <div class="rounded-2xl border border-surface-border bg-surface p-4">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-sm font-bold text-white">Daily Nutrition Summary</h3>
      <span class="text-xs text-zinc-400">{{ logsStore.selectedDate }}</span>
    </div>

    <!-- 2 cols on narrow card widths, 4 cols when space permits -->
    <div class="grid grid-cols-2 gap-2 xl:grid-cols-4">
      <!-- Calories -->
      <div class="flex flex-col items-center justify-center rounded-xl border border-surface-border bg-background/40 p-2 text-center min-w-0">
        <span class="text-[9px] sm:text-[10px] font-semibold uppercase tracking-tight text-amber-400 whitespace-nowrap">
          Calories
        </span>
        <div class="mt-1 flex flex-wrap items-baseline justify-center gap-0.5">
          <span class="text-base sm:text-lg lg:text-xl font-extrabold text-white leading-none">
            {{ logsStore.totalDailyCalories }}
          </span>
          <span class="text-[9px] sm:text-[10px] font-normal text-zinc-400">kcal</span>
        </div>
      </div>

      <!-- Protein -->
      <div class="flex flex-col items-center justify-center rounded-xl border border-surface-border bg-background/40 p-2 text-center min-w-0">
        <span class="text-[9px] sm:text-[10px] font-semibold uppercase tracking-tight text-rose-400 whitespace-nowrap">
          Protein
        </span>
        <div class="mt-1 flex flex-wrap items-baseline justify-center gap-0.5">
          <span class="text-base sm:text-lg lg:text-xl font-extrabold text-white leading-none">
            {{ logsStore.totalDailyProtein }}
          </span>
          <span class="text-[9px] sm:text-[10px] font-normal text-zinc-400">g</span>
        </div>
      </div>

      <!-- Carbs -->
      <div class="flex flex-col items-center justify-center rounded-xl border border-surface-border bg-background/40 p-2 text-center min-w-0">
        <span class="text-[9px] sm:text-[10px] font-semibold uppercase tracking-tight text-sky-400 whitespace-nowrap">
          Carbs
        </span>
        <div class="mt-1 flex flex-wrap items-baseline justify-center gap-0.5">
          <span class="text-base sm:text-lg lg:text-xl font-extrabold text-white leading-none">
            {{ logsStore.totalDailyCarbs }}
          </span>
          <span class="text-[9px] sm:text-[10px] font-normal text-zinc-400">g</span>
        </div>
      </div>

      <!-- Fats -->
      <div class="flex flex-col items-center justify-center rounded-xl border border-surface-border bg-background/40 p-2 text-center min-w-0">
        <span class="text-[9px] sm:text-[10px] font-semibold uppercase tracking-tight text-emerald-400 whitespace-nowrap">
          Fats
        </span>
        <div class="mt-1 flex flex-wrap items-baseline justify-center gap-0.5">
          <span class="text-base sm:text-lg lg:text-xl font-extrabold text-white leading-none">
            {{ logsStore.totalDailyFats }}
          </span>
          <span class="text-[9px] sm:text-[10px] font-normal text-zinc-400">g</span>
        </div>
      </div>
    </div>
  </div>
</template>