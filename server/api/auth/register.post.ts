import { initDB } from '../../db/init'

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

    if (username.length < 3 || username.length > 20) {
      throw createError({
        statusCode: 400,
        message: '用户名长度必须在3-20个字符之间'
      })
    }

    if (password.length < 6) {
      throw createError({
        statusCode: 400,
        message: '密码长度不能少于6个字符'
      })
    }

    const db = await initDB()

    // 检查用户名是否已存在
    const existingUser = await db.get('SELECT id FROM users WHERE username = ?', username)
    if (existingUser) {
      throw createError({
        statusCode: 400,
        message: '用户名已存在'
      })
    }

    // 创建用户（密码已经在客户端使用SHA-256加密）
    const result = await db.run(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, password]
    )

    return {
      success: true,
      message: '注册成功'
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '注册失败'
    })
  }
})