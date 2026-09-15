import { checkIsAuthenticated } from '~/utils/auth'

export default defineNuxtRouteMiddleware((to) => {
  const isAuth = checkIsAuthenticated()

  if (!isAuth) {
    return navigateTo({
      path: '/login',
      query: {
        redirect: to.fullPath !== '/student' ? to.fullPath : undefined
      }
    })
  }
})
