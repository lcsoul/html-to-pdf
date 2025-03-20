import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import bcrypt from 'bcryptjs'

export async function initDB() {
  const db = await open({
    filename: 'nav.db',
    driver: sqlite3.Database
  })

  // 创建用户表
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // 创建分类表
  await db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      order_index INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // 创建网址表
  await db.exec(`
    CREATE TABLE IF NOT EXISTS bookmarks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      icon_url TEXT,
      category_id INTEGER,
      user_id INTEGER,
      is_private BOOLEAN DEFAULT 0,
      is_deleted BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `)

  // // 创建默认管理员账户
  // const adminPassword = await bcrypt.hash('admin123', 10)
  // await db.run(`
  //   INSERT OR IGNORE INTO users (username, password)
  //   VALUES ('admin', ?)
  // `, adminPassword)

  // // 创建默认分类
  // await db.run(`
  //   INSERT OR IGNORE INTO categories (id, name, order_index)
  //   VALUES (1, '常用网站', 1)
  // `)

  // await db.run(`
  //   INSERT OR IGNORE INTO categories (id, name, order_index)
  //   VALUES (2, '技术文档', 2)
  // `)

  // await db.run(`
  //   INSERT OR IGNORE INTO categories (id, name, order_index)
  //   VALUES (3, '工具网站', 3)
  // `)

  // // 创建默认网址
  // const admin = await db.get('SELECT id FROM users WHERE username = ?', 'admin')
  // if (admin) {
  //   await db.run(`
  //     INSERT OR IGNORE INTO bookmarks (title, url, icon_url, category_id, user_id, is_private)
  //     VALUES ('Github', 'https://github.com', 'https://github.com/favicon.ico', 1, ?, 0)
  //   `, admin.id)

  //   await db.run(`
  //     INSERT OR IGNORE INTO bookmarks (title, url, icon_url, category_id, user_id, is_private)
  //     VALUES ('Google', 'https://google.com', 'https://google.com/favicon.ico', 1, ?, 0)
  //   `, admin.id)

  //   await db.run(`
  //     INSERT OR IGNORE INTO bookmarks (title, url, icon_url, category_id, user_id, is_private)
  //     VALUES ('Vue.js', 'https://vuejs.org', 'https://vuejs.org/logo.svg', 2, ?, 0)
  //   `, admin.id)

  //   await db.run(`
  //     INSERT OR IGNORE INTO bookmarks (title, url, icon_url, category_id, user_id, is_private)
  //     VALUES ('Nuxt.js', 'https://nuxtjs.org', 'https://nuxtjs.org/favicon.ico', 2, ?, 0)
  //   `, admin.id)

  //   await db.run(`
  //     INSERT OR IGNORE INTO bookmarks (title, url, icon_url, category_id, user_id, is_private)
  //     VALUES ('Tailwind CSS', 'https://tailwindcss.com', 'https://tailwindcss.com/favicon.ico', 2, ?, 0)
  //   `, admin.id)

  //   await db.run(`
  //     INSERT OR IGNORE INTO bookmarks (title, url, icon_url, category_id, user_id, is_private)
  //     VALUES ('JSON Formatter', 'https://jsonformatter.curiousconcept.com', '', 3, ?, 0)
  //   `, admin.id)

  //   await db.run(`
  //     INSERT OR IGNORE INTO bookmarks (title, url, icon_url, category_id, user_id, is_private)
  //     VALUES ('私人笔记', 'https://example.com/notes', '', 3, ?, 1)
  //   `, admin.id)
  // }

  return db
}