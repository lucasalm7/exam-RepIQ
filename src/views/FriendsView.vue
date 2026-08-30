<script setup>
import { ref } from 'vue'
import UserSearchModal from '@/components/friends/UserSearchModal.vue'
import FriendRequestList from '@/components/friends/FriendRequestList.vue'
import FriendCard from '@/components/friends/FriendCard.vue'
import PrivacySettingsForm from '@/components/profile/PrivacySettingsForm.vue'

const showSearchModal = ref(false)
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <button 
        @click="showSearchModal = true"
        class="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-xl shadow-lg shadow-primary/20 transition-all cursor-pointer"
      >🔍 Find Friends</button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <FriendRequestList />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FriendCard />
        </div>
      </div>
      <div>
        <PrivacySettingsForm />
      </div>
    </div>

    <UserSearchModal v-if="showSearchModal" @close="showSearchModal = false" />
  </div>
</template>