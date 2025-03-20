import { defineNuxtPlugin } from '#app'
import { useAuthCustom } from '~/composables/useAuth'

export default defineNuxtPlugin(async (nuxtApp) => {
  // 在应用初始化时恢复用户会话
  const { checkSession } = useAuthCustom()

  // 使用 nuxtApp.hooks 确保在客户端导航时也能正确恢复会话
  nuxtApp.hook('app:mounted', async () => {
    try {
      await checkSession()
    } catch (error) {
      console.error('Failed to restore session:', error)
    }
  })
})