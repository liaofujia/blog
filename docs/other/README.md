# umi常见问题
## 前端项目引入自定义字体包
1. 在public文件放入第三方字体文件
2. 在样式文件中引入自定义字体
```css
@font-face {
  font-family: "PingFangSC Light";
  src: url('@/assets/css/fonts/PingFang/PingFang-Light.ttf');
}

/* 引入多个自定义字体 */
@font-face {
  font-family: "PingFangSC Dark";
  src: url('@/assets/css/fonts/PingFang/PingFang-Dark.ttf');
}
```
3. 使用方式
```css
a { font-family: "PingFangSC Light", sans-serif; }
```
## Ant Design Pro中打包与加载otf自定义字体
:::tip 注意
使用 Webpack 打包字体文件的时候需要使用 file-loader 来处理打包文件，在ant design pro中可通过配置文件中的 chainWebpack 函数来自定义 Webpack 的配置。
:::
1. 安装 file-loader
```shell
npm install --save-dev file-loader
```
2. 编辑ant design pro的配置文件 `config/config.ts` 中的 `chainWebpack`
```ts
export default defineConfig({
  // ...
  chainWebpack(config){
    config.module // 配置 file-loader
      .rule('otf')
      .test(/.otf$/)
      .use('file-loader')
      .loader('file-loader');
  },
});
```
## umi中的request二次封装
```ts
type Method = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';

export function Request<T, Res>(url: string, method: Method = 'GET') {
  return (params?: T, options?: Record<string, unknown>) => {
    const key = method === 'GET' ? 'params' : 'data';

    return request<
      Promise<{
        code: string;
        ext: string;
        msg: string;
        result: Res;
      }>
    >(url, {
      method,
      [key]: params,
      ...options,
    });
  };
}
```

## 云效Node.js构建报错
> '"umi"' has no exported member named 'history'. Did you mean 'History'?

解决步骤：
1. 确保 tsconfig.json 中有配置 @@ 的路径，比如 `"@@/*": ["src/.umi/*"]`。
2. 执行 `umi generate tmp`命令
在跑 `npm run build` 之前，先执行一次 `npm run postinstall`。对应的命令如下：
3. CI/CD执行命令顺序
```shell
"scripts": {
    "build": "cross-env UMI_ENV=prod umi build",
    "postinstall": "umi generate tmp",
}
```