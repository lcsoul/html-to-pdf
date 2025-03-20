import * as dotenv from 'dotenv'
import { defineEventHandler } from 'h3'

// 确保环境变量加载
dotenv.config()

export default defineEventHandler(() => {
  // 确认 AUTH_SECRET 加载
  if (!process.env.AUTH_SECRET) {
    process.env.AUTH_SECRET = 'YourSuperSecretKeyHere123456'
  }
})