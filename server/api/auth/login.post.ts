import { initDB } from '../../db/init'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { username, password } = body

    // 输入验证
    if (!username || !password) {
      throw createError({
        statusCode: 400,
        message: '用户名和密码不能为空'
      })
    }

    const db = await initDB()

    // 查找用户
    const user = await db.get('SELECT * FROM users WHERE username = ?', username)
    if (!user) {
      throw createError({
        statusCode: 401,
        message: '用户名或密码错误'
      })
    }

    // 验证密码（客户端已经使用SHA-256加密，这里直接比较）
    if (password !== user.password) {
      throw createError({
        statusCode: 401,
        message: '用户名或密码错误'
      })
    }

    // 生成 token
    const token = await generateToken(user)

    return {
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '登录失败'
    })
  }
})

async function generateToken(user: any) {
  const config = useRuntimeConfig()
  return jwt.sign(
    {
      id: user.id,
      username: user.username
    },
    config.authSecret,
    { expiresIn: '7d' }
  )
}