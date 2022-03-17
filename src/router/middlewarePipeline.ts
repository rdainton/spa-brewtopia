import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export type RouterMiddleware = (context: RouteContext) => void

export interface RouteContext {
  to: RouteLocationNormalized
  from: RouteLocationNormalized
  next: NavigationGuardNext
}

/**
 * Sequentially call middleware.
 *
 * @param context
 * @param middleware
 * @param index
 * @returns
 */
function middlewarePipeline(
  context: RouteContext,
  middleware: RouterMiddleware[],
  index: number
): NavigationGuardNext {
  const nextMiddleware = middleware[index]

  if (!nextMiddleware) {
    return context.next
  }

  return () => {
    nextMiddleware({
      ...context,
      next: middlewarePipeline(context, middleware, index + 1),
    })
  }
}

export default middlewarePipeline
