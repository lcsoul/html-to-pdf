import { initDB } from '../../db/init'

export default defineEventHandler(async (event) => {
  try {
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

    // 检查分类名是否已存在
    const existingCategory = await db.get('SELECT id FROM categories WHERE name = ?', name)
    if (existingCategory) {
      throw createError({
        statusCode: 400,
        message: '分类名称已存在'
      })
    }

    // 创建分类
    const result = await db.run(
      'INSERT INTO categories (name, order_index) VALUES (?, ?)',
      [name, order_index || 0]
    )

    return {
      success: true,
      message: '添加分类成功'
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '添加分类失败'
    })
  }
})