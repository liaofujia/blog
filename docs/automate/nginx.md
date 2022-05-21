# Nginx部署
## Nginx基础配置
### 安装编译工具及库文件

```shell
yum -y install make zlib zlib-devel gcc-c++ libtool  openssl openssl-devel
```

### 首先要安装 PCRE

> PCRE 作用是让 Nginx 支持 Rewrite 功能。

#### 下载 PCRE 安装包，下载地址： http://downloads.sourceforge.net/project/pcre/pcre/8.35/pcre-8.35.tar.gz

```shell
cd /usr/local/
wget http://downloads.sourceforge.net/project/pcre/pcre/8.35/pcre-8.35.tar.gz
```
#### 解压安装包:

```shell
tar zxvf pcre-8.35.tar.gz
```

#### 进入安装包目录

```shell
cd pcre-8.35
```

#### 编译安装

```shell
./configure
make && make install
```
#### 查看pcre版本

```shell
pcre-config --version
```

### 连接远程服务器

```shell
1.  ssh 用户名@xx.xx.xx.xx 
2.  输入密码 
```

登陆成功进入服务器根目录

### 下载Nginx及安装

* 去nginx download官网下载稳定版的nginx，上传到服务器的某个位置（这里的位置是 /usr/local ）解压。
* 在服务器上用命令下载
进入服务器` /usr/local`文件夹，打开命令行输入如下命令：

```shell
wget http://nginx.org/download/nginx-1.18.0.tar.gz
```
查看当前目录就会看到 **nginx-1.18.0.tar.gz**
### 编译

输入命令`tar -zxvf nginx-1.18.0.tar.gz`进行解压, 解压完成之后查看这个目录就会出现一个 **nginx-1.18.0** 文件夹, 进入`cd nginx-1.18.0`。

>./configure的作用是检测系统配置，生成makefile文件，以便你可以用 make 和 make install 来编译和安装程序。

1. 执行`./configure --prefix=/usr/local/webserver/nginx --with-http_stub_status_module --with-http_ssl_module --with-pcre=/usr/local/src/pcre-8.35`
2. `make` 编译 （make的过程是把各种语言写的源码文件，变成可执行文件和各种库文件）
3.  `make install `安装 （`make install`是把这些编译出来的可执行文件和库文件复制到合适的地方）
4.  查看nginx版本 
```shell
/usr/local/nginx/sbin/nginx -v
```

### Nginx 配置

* http请求 listen端口以80开头
* 检查配置文件nginx.conf的正确性命令：
```shell
/usr/local/nginx/sbin/nginx -t
```
### 启动 Nginx
```shell
/usr/local/nginx/sbin/nginx
```

### 重新加载 Nginx
```shell
/usr/local/nginx/sbin/nginx -s reload
```

### 修改dist文件权限
```shell
chmod -R 777 dist
```

### 通过命令找到master对应的进程号

```shell
ps -ef|grep nginx
```

### nginx 压缩

```shell
# 开启gzip
gzip on;

# 启用gzip压缩的最小文件，小于设置值的文件将不会压缩
gzip_min_length 1k;

# gzip 压缩级别，1-9，数字越大压缩的越好，也越占用CPU时间，后面会有详细说明
gzip_comp_level 1;

# 进行压缩的文件类型。javascript有多种形式。其中的值可以在 mime.types 文件中找到。
gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png application/vnd.ms-fontobject font/ttf font/opentype font/x-woff image/svg+xml;

# 是否在http header中添加Vary: Accept-Encoding，建议开启
gzip_vary on;

# 禁用IE 6 gzip
gzip_disable "MSIE [1-6]\.";

# 设置压缩所需要的缓冲区大小     
gzip_buffers 32 4k;

# 设置gzip压缩针对的HTTP协议版本，没做负载的可以不用
# gzip_http_version 1.0;

# 开启缓存
location ~* ^.+\.(ico|gif|jpg|jpeg|png)$ { 
    access_log   off; 
    expires      2d;
}

location ~* ^.+\.(css|js|txt|xml|swf|wav)$ {
    access_log   off;
    expires      24h;
}

location ~* ^.+\.(html|htm)$ {
    expires      1h;
}

location ~* ^.+\.(eot|ttf|otf|woff|svg)$ {
    access_log   off;
    expires max;
}
```

## Nginx的SSL模块安装

1. 查看 nginx 是否安装 http_ssl_module 模块。

```shell
/usr/local/nginx/sbin/nginx -V
```

如果出现 `configure arguments: –with-http_ssl_module`, 则已安装（下面的步骤可以跳过，进入 nginx.conf 配置）。

2. 配置SSl模块

```shell
cd nginx-xxx
./configure --prefix=/usr/local/nginx --with-http_ssl_module
```

3. 使用 make 命令编译（使用make install会重新安装nginx，不建议使用make install），此时当前目录会出现 objs 文件夹。
```shell
make
```

4. 关闭Nginx进程
```shell
nginx -s stop
```

5. 用新的 nginx 文件覆盖当前的 nginx 文件
```shell
cp ./objs/nginx /usr/local/nginx/sbin/
```

6. 再次查看安装的模块（configure arguments: –with-http_ssl_module说明ssl模块已安装）。

```shell
$ /usr/local/nginx/sbin/nginx -V

nginx version: nginx/1.15.9
...
configure arguments: --with-http_ssl_module
```

### SLL证书部署

1. 下载申请好的 ssl 证书文件压缩包到本地并解压（这里是用的 pem 与 key 文件，文件名可以更改）
2. 在 nginx 目录新建 cert 文件夹存放证书文件。

```shell
$ cd /usr/local/nginx
$ mkdir cert
```

3. 将这两个文件上传至服务器的 cert 目录里。
这里使用 mac 终端上传至服务器的 scp 命令（这里需要新开一个终端，不要使用连接服务器的窗口）:

```shell
$ scp /Users/yourname/Downloads/ssl.pem root@xxx.xx.xxx.xx:/usr/local/nginx/cert/
$ scp /Users/yourname/Downloads/ssl.key root@xxx.xx.xxx.xx:/usr/local/nginx/cert/
```

::: tip
scp [本地文件路径，可以直接拖文件至终端里面] [<服务器登录名>@<服务器IP地址>:<服务器上的路径>]
:::

### nginx.conf 配置

1. 编辑 `/usr/local/nginx/conf/nginx.conf` 配置文件
2. 配置 https server。注释掉之前的 http server 配置，新增 https server:

```shell
server {
    # 服务器端口使用443，开启ssl, 这里ssl就是上面安装的ssl模块
    listen       443 ssl;
    # 域名，多个以空格分开
    server_name  hack520.com www.hack520.com;
    
    # ssl证书地址
    ssl_certificate     /usr/local/nginx/cert/ssl.pem;  # pem文件的路径
    ssl_certificate_key  /usr/local/nginx/cert/ssl.key; # key文件的路径
    
    # ssl验证相关配置
    ssl_session_timeout  5m;    #缓存有效期
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;    #加密算法
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;    #安全链接可选的加密协议
    ssl_prefer_server_ciphers on;   #使用服务器端的首选算法

    location / {
        root   html;
        index  index.html index.htm;
    }
}

3. 将 http 重定向 https。

server {
    listen       80;
    server_name  hack520.com www.hack520.com;
    return 301 https://$server_name$request_uri;
}
```

### 重启 nginx

```shell
$ /usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
```

1. 如果 80 端口被占用，用`kill [id]`来结束进程：

### 查看端口使用
```shell
$ netstat -lntp


Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name    
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      21307/nginx: master 
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      3072/sshd           
tcp        0      0 0.0.0.0:443             0.0.0.0:*               LISTEN      21307/nginx: master 

# 结束 80 端口进程
$ kill 21307
```

2. 再次重启 nginx：

```shell
$ /usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
```