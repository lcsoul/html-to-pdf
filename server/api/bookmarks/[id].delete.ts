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
    const db = await initDB()

    // 检查书签是否存在
    const bookmark = await db.get('SELECT * FROM bookmarks WHERE id = ? AND is_deleted = 0', id)
    if (!bookmark) {
      throw createError({
        statusCode: 404,
        message: '网址不存在'
      })
    }

    // 检查用户是否有权限删除
    if (bookmark.user_id !== token.id) {
      throw createError({
        statusCode: 403,
        message: '无权限删除'
      })
    }

    // 逻辑删除书签
    await db.run(
      'UPDATE bookmarks SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      id
    )

    return {
      success: true,
      message: '删除网址成功'
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '删除网址失败'
    })
  }
})