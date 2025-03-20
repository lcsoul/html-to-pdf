import { initDB } from '../../db/init'
import { getToken } from '../auth/utils'

export default defineEventHandler(async (event) => {
  try {
    const token = await getToken(event)
    if (!token) {
      throw createError({
        statusCode: 401,
        message: '请先登录'
      })
    }

    const body = await readBody(event)
    const { title, url, icon_url, category_id, is_private } = body

    // 输入验证
    if (!title || !url || !category_id) {
      throw createError({
        statusCode: 400,
        message: '请填写完整信息'
      })
    }

    const db = await initDB()

    // 检查分类是否存在
    const category = await db.get('SELECT * FROM categories WHERE id = ?', category_id)
    if (!category) {
      throw createError({
        statusCode: 400,
        message: '分类不存在'
      })
    }

    // 创建书签
    const result = await db.run(
      'INSERT INTO bookmarks (title, url, icon_url, category_id, user_id, is_private) VALUES (?, ?, ?, ?, ?, ?)',
      [title, url, icon_url, category_id, token.id, is_private || false]
    )

    return {
      success: true,
      message: '添加网址成功'
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '添加网址失败'
    })
  }
})