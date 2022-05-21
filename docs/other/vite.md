# vite常见问题

## vite多入口配置
> 一般的React项目只有根目录一个index.html文件，这个文件就作为整个项目的入口。（因为React是单页面应用）。但是当项目需要多个入口时，可以通过配置vite.config.ts文件来实现多页面应用。

### 配置vite.config.ts
```ts
build: {
    rollupOptions: {
        input: {
            main: path.resolve(__dirname, '..', 'index.html'),
            heathCheck: path.resolve(__dirname, '..', 'healthCheck.html'),
        },
    },
},
```

