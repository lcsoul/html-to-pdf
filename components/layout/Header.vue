<template>
  <div>
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <NuxtLink to="/" class="text-xl font-bold text-gray-800">
                网址导航
              </NuxtLink>
            </div>
          </div>
          <div class="flex items-center">
            <template v-if="user">
              <div class="flex items-center space-x-4">
                <span class="text-gray-700">{{ user.username }}</span>
                <button
                  @click="handleLogout"
                  class="text-gray-600 hover:text-gray-900"
                >
                  退出
                </button>
              </div>
            </template>
            <template v-else>
              <button
                @click="showLoginModal = true"
                class="text-gray-600 hover:text-gray-900"
              >
                登录
              </button>
            </template>
          </div>
        </div>
      </div>
    </header>

    <!-- 登录弹窗 -->
    <Modal v-model="showLoginModal">
      <template #title>登录</template>
      <template #content>
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">用户名</label>
            <input
              v-model="loginForm.username"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">密码</label>
            <input
              v-model="loginForm.password"
              type="password"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div class="flex justify-between">
            <button
              type="button"
              @click="showRegisterModal = true"
              class="text-sm text-indigo-600 hover:text-indigo-500"
            >
              没有账号？立即注册
            </button>
            <button
              type="submit"
              class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              登录
            </button>
          </div>
        </form>
      </template>
    </Modal>

    <!-- 注册弹窗 -->
    <Modal v-model="showRegisterModal">
      <template #title>注册</template>
      <template #content>
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">用户名</label>
            <input
              v-model="registerForm.username"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">密码</label>
            <input
              v-model="registerForm.password"
              type="password"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">确认密码</label>
            <input
              v-model="registerForm.confirmPassword"
              type="password"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div class="flex justify-end">
            <button
              type="submit"
              class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              注册
            </button>
          </div>
        </form>
      </template>
    </Modal>

    <!-- 提示信息 -->
    <Toast
      :show="showToast"
      @update:show="showToast = $event"
      :message="toastMessage"
      :type="toastType"
      :timeout="3000"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthCustom } from '~/composables/useAuth'
// Modal 组件已在全局注册，无需导入

const { user, login, register, logout } = useAuthCustom()

const showLoginModal = ref(false)
const showRegisterModal = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error' | 'info'>('info')

const loginForm = ref({
  username: '',
  password: ''
})

const registerForm = ref({
  username: '',
  password: '',
  confirmPassword: ''
})

const handleLogin = async () => {
  try {
    await login(loginForm.value)
    showLoginModal.value = false
    loginForm.value = { username: '', password: '' }
    showSuccess('登录成功')
  } catch (error: any) {
    showError(error.message || '登录失败')
  }
}

const handleRegister = async () => {
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    showError('两次输入的密码不一致')
    return
  }

  try {
    await register(registerForm.value)
    showRegisterModal.value = false
    registerForm.value = { username: '', password: '', confirmPassword: '' }
    showLoginModal.value = true
    showSuccess('注册成功，请登录')
  } catch (error: any) {
    showError(error.message || '注册失败')
  }
}

const handleLogout = async () => {
  try {
    await logout()
    showSuccess('退出成功')
  } catch (error: any) {
    showError(error.message || '退出失败')
  }
}

// 显示错误提示
const showError = (message: string) => {
  toastMessage.value = message
  toastType.value = 'error'
  showToast.value = true
}

// 显示成功提示
const showSuccess = (message: string) => {
  toastMessage.value = message
  toastType.value = 'success'
  showToast.value = true
}
</script>