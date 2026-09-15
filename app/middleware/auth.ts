import { checkIsAuthenticated } from '~/utils/auth'

export default defineNuxtRouteMiddleware((to) => {
  // Never redirect if already navigating to /login
  if (to.path === '/login' || to.path.startsWith('/login/')) {
    return
  }

  const isAuth = checkIsAuthenticated()

  if (!isAuth) {
    const isDefaultStudent = to.path === '/student' && Object.keys(to.query).length === 0
    return navigateTo({
      path: '/login',
      query: !isDefaultStudent ? { redirect: to.fullPath } : undefined
    })
  }
})
