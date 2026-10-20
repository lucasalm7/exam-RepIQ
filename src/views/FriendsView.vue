<script setup>
import { ref } from 'vue'
// Commented out unused component imports for build/dev cleanliness
// import UserSearchModal from '@/components/friends/UserSearchModal.vue'
// import FriendRequestList from '@/components/friends/FriendRequestList.vue'
// import FriendCard from '@/components/friends/FriendCard.vue'
// import PrivacySettingsForm from '@/components/profile/PrivacySettingsForm.vue'

// const showSearchModal = ref(false)
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-4">
    <!-- Maintenance Icon Container -->
    <div class="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    </div>

    <!-- Maintenance Message -->
    <div class="max-w-md space-y-2">
      <h2 class="text-xl font-bold text-white">Social Hub Under Maintenance</h2>
      <p class="text-xs text-zinc-400 leading-relaxed">
        Friend connections, activity feeds, and shared workout feeds are currently undergoing planned improvements.
      </p>
    </div>

    <!-- Status Badge -->
    <div class="pt-2">
      <span class="px-3 py-1 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider">
        Coming Soon
      </span>
    </div>
  </div>
</template>