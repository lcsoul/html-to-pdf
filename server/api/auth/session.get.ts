import { initDB } from '../../db/init'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const token = getHeader(event, 'Authorization')?.replace('Bearer ', '')

    if (!token) {
      throw createError({
        statusCode: 401,
        message: '未登录'
      })
    }

    // 验证 token
    const decoded = jwt.verify(token, config.authSecret) as any
    if (!decoded || !decoded.id) {
      throw createError({
        statusCode: 401,
        message: '登录已过期'
      })
    }

    const db = await initDB()
    const user = await db.get('SELECT id, username FROM users WHERE id = ?', decoded.id)

    if (!user) {
      throw createError({
        statusCode: 401,
        message: '用户不存在'
      })
    }

    return {
      success: true,
      user
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '验证失败'
    })
  }
})