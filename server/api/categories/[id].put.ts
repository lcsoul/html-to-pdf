import { initDB } from '../../db/init'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const { name, order_index } = body

    // 输入验证
    if (!name) {
      throw createError({
        statusCode: 400,
        message: '分类名称不能为空'
      })
    }

    const db = await initDB()

    // 检查分类是否存在
    const category = await db.get('SELECT * FROM categories WHERE id = ?', id)
    if (!category) {
      throw createError({
        statusCode: 404,
        message: '分类不存在'
      })
    }

    // 检查分类名是否已存在
    const existingCategory = await db.get(
      'SELECT id FROM categories WHERE name = ? AND id != ?',
      [name, id]
    )
    if (existingCategory) {
      throw createError({
        statusCode: 400,
        message: '分类名称已存在'
      })
    }

    // 更新分类
    await db.run(
      'UPDATE categories SET name = ?, order_index = ? WHERE id = ?',
      [name, order_index || 0, id]
    )

    return {
      success: true,
      message: '更新分类成功'
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '更新分类失败'
    })
  }
})