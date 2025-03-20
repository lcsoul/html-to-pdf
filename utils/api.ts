import { useState } from '#imports'

/**
 * 封装的API请求函数，自动处理token
 * @param url API接口路径
 * @param options 请求选项
 * @returns 请求响应
 */
export const useApi = () => {
  const token = useState<string | null>('auth-token')

  /**
   * 发送API请求，自动附加token
   */
  const request = async <T>(url: string, options: any = {}): Promise<T> => {
    // 准备headers
    const headers = options.headers || {}

    // 如果存在token，添加到Authorization头
    if (token.value) {
      headers.Authorization = `Bearer ${token.value}`
    }

    // 合并选项并发送请求
    return $fetch<T>(url, {
      ...options,
      headers
    })
  }

  /**
   * GET请求
   */
  const get = <T>(url: string, options: any = {}): Promise<T> => {
    return request<T>(url, { ...options, method: 'GET' })
  }

  /**
   * POST请求
   */
  const post = <T>(url: string, body: any, options: any = {}): Promise<T> => {
    return request<T>(url, { ...options, method: 'POST', body })
  }

  /**
   * PUT请求
   */
  const put = <T>(url: string, body: any, options: any = {}): Promise<T> => {
    return request<T>(url, { ...options, method: 'PUT', body })
  }

  /**
   * DELETE请求
   */
  const del = <T>(url: string, options: any = {}): Promise<T> => {
    return request<T>(url, { ...options, method: 'DELETE' })
  }

  return {
    request,
    get,
    post,
    put,
    del
  }
}