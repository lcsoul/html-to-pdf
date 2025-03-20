# 响应式网址导航

一个基于 Nuxt 3 和 Tailwind CSS 开发的响应式网址导航系统，使用 SQLite 存储数据。

## 功能特点

- 响应式设计，适配各种设备
- 用户注册登录系统
- 网址分类管理
- 书签的增删改查
- 公共和私有书签分离
- 默认图标支持
- 支持调整分类顺序

## 技术栈

- Nuxt 3
- Vue 3
- Tailwind CSS
- SQLite
- TypeScript

## 安装和使用

1. 克隆项目

```bash
git clone <repository-url>
cd nav2
```

2. 安装依赖

```bash
npm install
```

3. 创建环境变量

在项目根目录创建 `.env` 文件，内容如下：

```
AUTH_SECRET=your_secret_key_here
```

4. 启动开发服务器

```bash
npm run dev
```

5. 构建生产版本

```bash
npm run build
```

## 默认账户

- 用户名：admin
- 密码：admin123

## 使用说明

1. 未登录用户可以查看所有公共书签
2. 登录后可以添加、编辑和删除书签
3. 可以将书签设为私有，只有自己可见
4. 可以对书签进行分类管理
5. 可以调整分类的显示顺序

## 安全措施

- 密码使用 bcrypt 加密存储
- API 请求使用 JWT 认证
- 预防 XSS 攻击
- 输入验证和防注入措施

## 许可证

MIT
