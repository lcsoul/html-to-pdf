# 使用官方Node镜像作为基础
FROM node:16-alpine

# 安装Chromium和依赖
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories \
    && apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    font-noto \
    font-noto-cjk \
    && mkfontscale \
    && mkfontdir \
    && fc-cache

# 设置环境变量
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# 创建工作目录
WORKDIR /app

# 复制package文件并安装依赖
COPY package*.json ./
RUN npm install

# 复制应用源代码
COPY . .

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["node", "src/app.js"]
