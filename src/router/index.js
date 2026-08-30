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
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation Guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Initialize auth session if not checked yet
  if (!authStore.isInitialized) {
    await authStore.fetchCurrentUser()
  }

  const isAuthenticated = authStore.isAuthenticated
  const isAdmin = authStore.isAdmin

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: 'auth' })
  }

  if (to.meta.requiresGuest && isAuthenticated) {
    return next({ name: 'overview' })
  }

  if (to.meta.requiresAdmin && !isAdmin) {
    return next({ name: 'overview' })
  }

  next()
})

export default router