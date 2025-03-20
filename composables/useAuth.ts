import { ref, useState } from '#imports'

interface User {
  id: number
  username: string
}

interface LoginForm {
  username: string
  password: string
}

interface RegisterForm {
  username: string
  password: string
}

interface AuthResponse {
  success: boolean
  user?: User
  token?: string
  message?: string
}

export const useAuthCustom = () => {
  const user = useState<User | null>('auth-user', () => null)
  const token = useState<string | null>('auth-token', () => null)

  const login = async (form: LoginForm) => {
    try {
      const response = await $fetch<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: form
      })

      if (response.success && response.user && response.token) {
        user.value = response.user
        token.value = response.token
        if (process.client) {
          localStorage.setItem('token', response.token)
        }
      }
    } catch (error: any) {
      if (error.data && error.data.message) {
        throw new Error(error.data.message)
      } else {
        throw new Error(error.message || '登录失败')
      }
    }
  }

  const register = async (form: RegisterForm) => {
    try {
      const response = await $fetch<AuthResponse>('/api/auth/register', {
        method: 'POST',
        body: form
      })

      if (response.success) {
        return response
      }
    } catch (error: any) {
      if (error.data && error.data.message) {
        throw new Error(error.data.message)
      } else {
        throw new Error(error.message || '注册失败')
      }
    }
  }

  const logout = async () => {
    try {
      await $fetch<AuthResponse>('/api/auth/logout', {
        method: 'POST'
      })
      user.value = null
      token.value = null
      if (process.client) {
        localStorage.removeItem('token')
      }
    } catch (error: any) {
      throw new Error(error.message || '退出失败')
    }
  }

  const checkSession = async () => {
    if (process.client) {
      if (user.value) {
        console.log('已有用户会话，无需重新验证')
        return
      }

      const storedToken = localStorage.getItem('token')
      if (!storedToken) {
        console.log('本地存储中没有找到 token')
        return
      }

      console.log('正在验证存储的 token...')
      try {
        const response = await $fetch<AuthResponse>('/api/auth/session', {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        })

        if (response.success && response.user) {
          console.log('Token 有效，已恢复用户会话:', response.user.username)
          user.value = response.user
          token.value = storedToken
        } else {
          console.warn('Token 无效或用户会话已过期')
          localStorage.removeItem('token')
        }
      } catch (error: any) {
        console.error('会话验证失败:', error.message || error)
        localStorage.removeItem('token')
      }
    }
  }

  return {
    user,
    token,
    login,
    register,
    logout,
    checkSession
  }
}