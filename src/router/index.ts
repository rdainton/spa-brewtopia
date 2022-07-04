import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

// Middleware
import middlewarePipeline, { RouterMiddleware } from './middlewarePipeline'
import auth from './middleware/auth'
import guest from './middleware/guest'
import passwordReset from './middleware/passwordReset'
import attemptAutoLogin from './middleware/attemptAutoLogin'

// Components
import DeckBuilder from '../components/pages/Deckbuilder.vue'

export const routeNames = {
  deckbuilder: Symbol('deckbuilder'),
  decklists: Symbol('decklists'),
  info: Symbol('info'),
  feedback: Symbol('feedback'),
  login: Symbol('login'),
  register: Symbol('register'),
  resetPassword: Symbol('reset-password'),
  forgotPassword: Symbol('forgot-password'),
  logout: Symbol('logout'),
}

const routeRecords: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: routeNames.deckbuilder,
    component: DeckBuilder,
    meta: {
      middleware: [attemptAutoLogin],
    },
  },
  {
    path: '/login',
    name: routeNames.login,
    component: () => import('../components/pages/auth/Login.vue'),
    meta: {
      middleware: [attemptAutoLogin, guest],
    },
  },
  {
    path: '/register',
    name: routeNames.register,
    component: () => import('../components/pages/auth/Register.vue'),
    meta: {
      middleware: [attemptAutoLogin, guest],
    },
  },
  {
    path: '/forgot-password',
    name: routeNames.forgotPassword,
    component: () => import('../components/pages/auth/ForgotPassword.vue'),
    meta: {
      middleware: [attemptAutoLogin, guest],
    },
  },
  {
    path: '/reset-password',
    name: routeNames.resetPassword,
    component: () => import('../components/pages/auth/ResetPassword.vue'),
    meta: {
      middleware: [attemptAutoLogin, guest, passwordReset],
    },
  },
  {
    path: '/logout',
    name: routeNames.logout,
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
    path: '/decklists',
    name: routeNames.decklists,
    component: () => import('../components/pages/Decklists.vue'),
    meta: {
      middleware: [attemptAutoLogin, auth],
    },
  },
  {
    path: '/info',
    name: routeNames.info,
    component: () => import('../components/pages/Info.vue'),
    meta: {
      middleware: [attemptAutoLogin],
    },
  },

  {
    path: '/feedback',
    name: routeNames.feedback,
    component: () => import('../components/pages/Feedback.vue'),
    meta: {
      middleware: [attemptAutoLogin],
    },
  },
  {
    path: '/:notFound(.*)',
    redirect: '/', // could create a 404 component here instead.
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: routeRecords,
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
