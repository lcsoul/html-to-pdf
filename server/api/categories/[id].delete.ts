import { initDB } from '../../db/init'
import { getToken } from '../auth/utils'

export default defineEventHandler(async (event) => {
  try {
    // 验证用户是否已登录
    const token = await getToken(event)
    if (!token) {
      throw createError({
        statusCode: 401,
        message: '无权限删除，请先登录'
      })
    }

    const id = getRouterParam(event, 'id')
    const db = await initDB()

    // 检查分类是否存在
    const category = await db.get('SELECT * FROM categories WHERE id = ?', id)
    if (!category) {
      throw createError({
        statusCode: 404,
        message: '分类不存在'
      })
    }

    // 检查分类下是否有网址
    const bookmarks = await db.get(
      'SELECT COUNT(*) as count FROM bookmarks WHERE category_id = ? AND is_deleted = 0',
      id
    )
    if (bookmarks.count > 0) {
      throw createError({
        statusCode: 400,
        message: '该分类下还有网址，无法删除'
      })
    }

    // 删除分类
    await db.run('DELETE FROM categories WHERE id = ?', id)

    return {
      success: true,
      message: '删除分类成功'
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '删除分类失败'
    })
  }
})