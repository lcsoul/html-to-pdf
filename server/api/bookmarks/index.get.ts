import { initDB } from '../../db/init'
import { getToken } from '../auth/utils'

export default defineEventHandler(async (event) => {
  try {
    const db = await initDB()
    const token = await getToken(event)

    let query = 'SELECT * FROM bookmarks WHERE is_deleted = 0'
    const params: any[] = []

    if (!token) {
      // 未登录用户只能看到公共书签
      query += ' AND is_private = 0'
    } else {
      // 登录用户可以看到自己的私有书签和所有公共书签
      query += ' AND (is_private = 0 OR user_id = ?)'
      params.push(token.id)
    }

    const bookmarks = await db.all(query, params)

    return {
      success: true,
      bookmarks
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '获取网址失败'
    })
  }
})