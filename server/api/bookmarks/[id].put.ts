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

    const id = getRouterParam(event, 'id')
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

    // 检查书签是否存在
    const bookmark = await db.get('SELECT * FROM bookmarks WHERE id = ? AND is_deleted = 0', id)
    if (!bookmark) {
      throw createError({
        statusCode: 404,
        message: '网址不存在'
      })
    }

    // 检查用户是否有权限修改
    if (bookmark.user_id !== token.id) {
      throw createError({
        statusCode: 403,
        message: '无权限修改'
      })
    }

    // 检查分类是否存在
    const category = await db.get('SELECT * FROM categories WHERE id = ?', category_id)
    if (!category) {
      throw createError({
        statusCode: 400,
        message: '分类不存在'
      })
    }

    // 更新书签
    await db.run(
      'UPDATE bookmarks SET title = ?, url = ?, icon_url = ?, category_id = ?, is_private = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [title, url, icon_url, category_id, is_private || false, id]
    )

    return {
      success: true,
      message: '更新网址成功'
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '更新网址失败'
    })
  }
})