import { checkIsAuthenticated } from '~/utils/auth'

export default defineNuxtRouteMiddleware((to) => {
  // Never redirect if already navigating to student or student subroutes
  if (to.path === '/student' || to.path.startsWith('/student/')) {
    return
  }

  const isAuth = checkIsAuthenticated()

  if (isAuth) {
    return navigateTo('/student')
  }
})
