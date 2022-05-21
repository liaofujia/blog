# 前端自动化部署

::: tip
以云效为例
:::
## 流水线创建
1. 新建流水线
2. 前端选择Node.js流水线模版

## 自动化部署流程配置

1. 添加流水线源
    *    选择云效Codeup
    *    选择需要自动化部署的代码仓库
    *    默认分支选择 `master`
    *    开启代码源出发选项
    *    触发事件建议选择合并请求完成后
    *    过滤条件输入 `master`
2. 配置测试流程(目前没用到)
3. 构建
>通过cnpm install 完成依赖包安装

*    Node.js
构建命令 `cnpm install && npm run build`

*    构建物上传
![alt 构建物上传](/blog/construct.png)

1.  部署
    * 选择主机部署
    * 选择制品名称
    * 新建主机组
    * 城市选择上海
    * 部署配置下载路径一定是dist包上传到nginx的根目录下
    * 执行用户写 `root`
    * 部署脚本
    
```shell
    cd /usr/local/nginx/html/
    rm -rf dist
    # 创建dist文件夹
    mkdir dist
    # 解压压缩包
    tar -zxvf dist.tgz -C dist
    # 移除tgz包
    rm -rf dist.tgz
    /usr/local/nginx/sbin/nginx -s reload

```
