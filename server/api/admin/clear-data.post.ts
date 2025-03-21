import { initDB } from '../../db/init'
import { getToken } from '../auth/utils'

export default defineEventHandler(async (event) => {
  try {
    // 验证用户是否已登录
    const token = await getToken(event)
    if (!token) {
      throw createError({
        statusCode: 401,
        message: '无权限操作，请先登录'
      })
    }

    const db = await initDB()

    // 开始事务
    await db.exec('BEGIN TRANSACTION')

    try {
      // 清空书签表（使用物理删除而非逻辑删除）
      await db.run('DELETE FROM bookmarks')

      // 清空分类表
      await db.run('DELETE FROM categories')

      // 清空用户表
      await db.run('DELETE FROM users')

      // 提交事务
      await db.exec('COMMIT')

      return {
        success: true,
        message: '已成功清空所有用户信息、网址及分类数据'
      }
    } catch (error) {
      // 如果出错，回滚事务
      await db.exec('ROLLBACK')
      throw error
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '清空数据失败'
    })
  }
})