# HTML_TO_PDF

# 使用说明：
下载项目自行编译

# 解压后进入目录
```bash
cd html_to_pdf
```

# 构建镜像
```bash
docker build -t html_to_pdf .
```

# 运行容器
```bash
docker run -d -p 3000:3000 --name html_to_pdf html_to_pdf
```

# 访问
http://127.0.0.1:3000/generate-pdf
# 请求方式：
```bash
curl -X POST -H "Content-Type: application/json" \
-d '{"html":"<html><body><h1>Hello World</h1></body></html>"}' \
http://127.0.0.1:3000/generate-pdf --output test.pdf
```



# 如需导出镜像使用
```bash
docker save -o html_to_pdf.tar html_to_pdf
```
# 导入镜像使用
```bash
docker load -i html_to_pdf.tar
```

