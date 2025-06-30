# HTML_TO_PDF

# 使用说明：
下载项目自行编译

# 解压后进入目录
cd html_to_pdf

# 构建镜像
docker build -t html_to_pdf .

# 运行容器
docker run -d -p 3000:3000 --name pdf-generator html_to_pdf


# docker提供3000端口访问
docker run -d -p 3000:3000 --name html_to_pdf_server html_to_pdf_server

# 请求方式：
curl -X POST -H "Content-Type: application/json" \
-d '{"html":"<html><body><h1>Hello World</h1></body></html>"}' \
http://127.0.0.1:3000/generate-pdf --output test.pdf



# 如需导出镜像使用
docker save -o html_to_pdf.tar html_to_pdf
# 导入镜像使用
docker load -i html_to_pdf.tar

