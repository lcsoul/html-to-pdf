// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@sidebase/nuxt-auth'
  ],
  auth: {
    baseURL: process.env.AUTH_ORIGIN,
    provider: {
      type: 'local',
      endpoints: {
        signIn: { path: '/api/auth/login', method: 'post' },
        signOut: { path: '/api/auth/logout', method: 'post' },
        signUp: { path: '/api/auth/register', method: 'post' },
        getSession: { path: '/api/auth/session', method: 'get' }
      },
      pages: {
        login: '/login'
      },
      token: {
        signInResponseTokenPointer: '/token'
      }
    }
  },
  runtimeConfig: {
    authSecret: process.env.AUTH_SECRET || 'YourSuperSecretKeyHere123456',
    public: {
      apiBase: process.env.API_BASE || '/api'
    }
  }
})
