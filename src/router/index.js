import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Auth/Register.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Auth/Login.vue')
    },
    {
      path: '/dashboard/:userId',
      name: 'dashboard',
      component: () => import('../views/Dashboard.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/Profile.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/beneficiaries',
      name: 'beneficiaries',
      component: () => import('../views/Beneficiaries.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/transfer',
      name: 'transfer',
      component: () => import('../views/Transactions/Transfer.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/deposit',
      name: 'deposit',
      component: () => import('../views/Transactions/Deposit.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: () => import('../views/Transactions/History.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if ((to.name === 'login' || to.name === 'register') && token) {
    // If already logged in, redirect to dashboard
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user.id) {
      next(`/dashboard/${user.id}`)
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
