import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

// Middleware
import middlewarePipeline, { RouterMiddleware } from './middlewarePipeline'
import auth from './middleware/auth'
import guest from './middleware/guest'
import passwordReset from './middleware/passwordReset'
import attemptAutoLogin from './middleware/attemptAutoLogin'

// Components
import DeckBuilder from '../components/pages/Deckbuilder.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'deckbuilder',
    component: DeckBuilder,
    meta: {
      middleware: [attemptAutoLogin],
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../components/pages/auth/Login.vue'),
    meta: {
      middleware: [attemptAutoLogin, guest],
    },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../components/pages/auth/Register.vue'),
    meta: {
      middleware: [attemptAutoLogin, guest],
    },
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('../components/pages/auth/ForgotPassword.vue'),
    meta: {
      middleware: [attemptAutoLogin, guest],
    },
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: () => import('../components/pages/auth/ResetPassword.vue'),
    meta: {
      middleware: [attemptAutoLogin, guest, passwordReset],
    },
  },
  {
    path: '/logout',
    name: 'logout',
    component: () => import('../components/pages/auth/Logout.vue'),
    meta: {
      middleware: [attemptAutoLogin, auth],
    },
  },
  // {
  //   path: '/profile',
  //   name: 'profile',
  //   component: () => import('../components/pages/Profile.vue'),
  //   meta: {
  //     middleware: [attemptAutoLogin, auth],
  //   },
  // },
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

  const context = { to, from, next }

  middleware[0]({
    ...context,
    next: middlewarePipeline(context, middleware, 1),
  })
})

export default router
