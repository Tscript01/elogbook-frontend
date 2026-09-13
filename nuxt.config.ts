export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:5000/api'
    }
  },
  devServer: {
    port: 3000,
    host: '0.0.0.0'
  },
  nitro: {
    preset: 'node-server'
  },
  modules: ['@nuxt/eslint', '@nuxtjs/tailwindcss', '@nuxtjs/color-mode', '@pinia/nuxt'],
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: '~~/tailwind.config.ts'
  },
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
    storageKey: 'siwes-color-mode'
  },
  app: {
    head: {
      title: 'SIWES E-Logbook',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Electronic logbook for the Student Industrial Work Experience Scheme'
        }
      ]
    }
  }
})
