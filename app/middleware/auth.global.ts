import { checkIsAuthenticated } from '~/utils/auth'

export default defineNuxtRouteMiddleware((to) => {
  // Protected paths that require authentication
  const isProtectedRoute = to.path.startsWith('/student') ||
    to.path.startsWith('/supervisor') ||
    to.path.startsWith('/coordinator') ||
    to.path.startsWith('/admin')

  // Public authentication / guest-only paths
  const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password']
  const isAuthRoute = authRoutes.some((route) => to.path === route || to.path.startsWith(`${route}/`))

  const isAuth = checkIsAuthenticated()

  // 1. If accessing a protected route while unauthenticated, redirect to login
  if (isProtectedRoute && !isAuth) {
    // Avoid setting self-redirect or unnecessary redirect if simply heading to default /student
    const isDefaultStudent = to.path === '/student' && Object.keys(to.query).length === 0
    return navigateTo({
      path: '/login',
      query: !isDefaultStudent ? { redirect: to.fullPath } : undefined
    })
  }

  // 2. If already authenticated and accessing login/register/forgot/reset, redirect to student dashboard
  if (isAuthRoute && isAuth) {
    return navigateTo('/student')
  }
})
