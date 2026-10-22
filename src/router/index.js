import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/auth',
    name: 'auth',
    component: () => import('@/views/AuthView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/',
    name: 'overview',
    component: () => import('@/views/OverviewView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/workouts',
    name: 'workouts',
    component: () => import('@/views/WorkoutsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/meals',
    name: 'meals',
    component: () => import('@/views/MealsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/goals',
    name: 'goals',
    component: () => import('@/views/GoalsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/friends',
    name: 'friends',
    component: () => import('@/views/FriendsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/views/AdminView.vue'),
    meta: { requiresAuth: true, requiresStaff: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue')
  }
]

// Create the router instance with history mode and the defined routes
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation Guards
// This navigation guard checks the user's authentication and authorization status before allowing access to certain routes. 
// It ensures that users are redirected appropriately based on their login state and role (guest, authenticated user, or staff/admin).
router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (!authStore.isInitialized) {
    await authStore.fetchCurrentUser()
  }

  const isAuthenticated = authStore.isAuthenticated
  const hasProfile = Boolean(authStore.userProfile)
  const canAccessAdmin = authStore.canAccessAdmin

  if (to.meta.requiresAuth && (!isAuthenticated || (!hasProfile && !canAccessAdmin))) {
    return { name: 'auth' }
  }

  if (to.meta.requiresGuest && isAuthenticated && hasProfile) {
    return { name: 'overview' }
  }

  if (to.meta.requiresStaff && !canAccessAdmin) {
    return { name: 'overview' }
  }

  return true
})

export default router