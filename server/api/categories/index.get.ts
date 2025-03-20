import { initDB } from '../../db/init'

export default defineEventHandler(async (event) => {
  try {
    const db = await initDB()
    const categories = await db.all('SELECT * FROM categories ORDER BY order_index')
    return {
      success: true,
      categories
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '获取分类失败'
    })
  }
})
