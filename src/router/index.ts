import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import store from '../store'
import middlewarePipeline, { RouterMiddleware } from './middlewarePipeline'

// Components
import DeckBuilder from '../components/pages/Deckbuilder.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'deckbuilder',
    component: DeckBuilder,
    meta: {
      middleware: [],
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../components/pages/auth/Login.vue'),
    meta: {
      middleware: [],
    },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../components/pages/auth/Register.vue'),
    meta: {
      middleware: [],
    },
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('../components/pages/auth/ForgotPassword.vue'),
    meta: {
      middleware: [],
    },
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: () => import('../components/pages/auth/ResetPassword.vue'),
    meta: {
      middleware: [],
    },
  },
  {
    path: '/logout',
    name: 'logout',
    component: () => import('../components/pages/auth/Logout.vue'),
    meta: {
      middleware: [],
    },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../components/pages/Profile.vue'),
    meta: {
      middleware: [],
    },
  },
  {
    path: '/decks',
    name: 'decks',
    component: () => import('../components/pages/Decks.vue'),
    meta: {
      middleware: [],
    },
  },
  {
    path: '/:notFound(.*)',
    redirect: '/', // could create a 404 component here instead.
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'text-red-500',
  linkExactActiveClass: 'text-red-600',
  scrollBehavior(_to, _from, savedPosition) {
    // if 'back' is pressed, return to previous scoll position
    if (savedPosition) return savedPosition

    return {
      left: 0,
      right: 0,
    }
  },
})

router.beforeEach((to, from, next) => {
  const middleware = to.meta.middleware as RouterMiddleware[]

  if (!middleware || !middleware.length) return next()

  const context = { to, from, next, store }

  middleware[0]({
    ...context,
    next: middlewarePipeline(context, middleware, 1),
  })
})

export default router
