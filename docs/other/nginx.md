# Nginx常见问题
## 解决页面刷新，显示404

```
<!-- nginx.conf文件 -->
server {
  location / {
    root html;
    index index.html index.htm;
    try_files $uri $uri/ /index.html;
  }
}
```