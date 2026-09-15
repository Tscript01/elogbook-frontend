import { checkIsAuthenticated } from '~/utils/auth'

export default defineNuxtRouteMiddleware(() => {
  const isAuth = checkIsAuthenticated()

  if (isAuth) {
    return navigateTo('/student')
  }
})
