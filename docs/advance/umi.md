# 首屏加载时间优化

## 为什么首屏加载需要优化

因为做了很多事情：
初始化 webView -> 请求页面 -> 下载数据 -> 解析 HTML -> 请求 js/css 资源 -> dom 渲染 -> 解析 JS 执行 -> JS 请求数据 -> 解析渲染 -> 下载渲染图片

在 `dom渲染` 之前用户看到的都是白屏，在 `下载渲染图片` 后，用户才能看到完整的页面。首屏秒开优化就是要减少这个过程的耗时。

对首屏启动速度影响最大的就是网络请求。由于业务需求，导致我们不得不引入很多第三方包(类如：antd，moment，echarts 等)来实现功能，这些包恰恰会容易影响到网络请求。

## 分析产物

在 `umi` 项目中，执行 `ANALYZE=1 umi build` 来查看build之后的产物包结构。
:::tip
注意环境变量的使用，mac上可以直接使用，window上需要使用set ，因此在项目中，我们一般是通过安装 `cross-env` 来抹去平台差异。
:::

**配置脚本**

```json
// package.json
{
  "scripts": {
    "analyze": "cross-env ANALYZE=1 umi build"
  }
}
```

执行 `npm run analyze`，编译执行完成后以后，你可以查看 http://127.0.0.1:8888 包分析页面。可以看到大致如下图所示的页面。

:::tip
start size：原始没有经过 minify 处理的文件大小

parse size：比如 webpack plugin 里用了 uglify，就是 minified 以后的文件大小

gzip size：被压缩以后的文件大小
:::

![alt 拆包前](/blog/init.png)

这个是初始打包出来的 js 大小，可以清晰的看到，vendors.js 6.1M 真的超级大。这个时候我们想拆出来怎么办呢？

**有如下几种优化的方法**：

1. 启用按需加载

**常见使用场景**：组件体积太大，不适合直接计入 bundle 中，以免影响首屏加载速度。例如：某组件 HugeA 包含巨大的实现 / 依赖了巨大的三方库，且该组件 HugeA 的使用不在首屏显示范围内，可被单独拆出。这时候，`dynamic` 就该上场了。
为了简化部署成本，umi按需加载功能默认是关闭的，你需要在使用之前先通过配置开启，
```js
export default {
  dynamicImport: {
    // @ 默认指到 src 目录
    loading: '@/pages/Loading/index',
  },
};
```
添加完按需加载，每次在切换页面的时候，都会渲染一个 loading 页面，这个loading页面是可以自定义的。

2. 图片资源压缩

这是最有效减小产物包大小的一步，却是被很多人忽略的一步，很多开发者都是直接下载了 `UI` 提供的切图，并没有对图片进行处理，其实适当的对图片进行压缩其实不会影响显示效果的。压缩工具有很多比如 TinyPNG 或者 pngquant。

3. 调整 splitChunks 策略

`cacheGroups` 中的配置，尤其是每一项里面的 test ，比如这里的 `/[\\/]node_modules[\\/]/` 表示将 `node_modules` 中的所有的库拆分到一个新的js文件中，文件名称为 `vendors.js`、`antd.js`、`echarts.js` 和 `bizcharts.js` 。
```ts
// config.ts
chainWebpack: function (config) {
    //过滤掉momnet的那些不使用的国际化文件
    config
      .plugin('replace')
      .use(require('webpack').ContextReplacementPlugin)
      .tap(() => {
        return [/moment[/\\]locale$/, /zh-cn/];
      });
    config.merge({
      optimization: {
        splitChunks: {
            chunks: 'all', //提取 chunks 的时候从哪里提取
            name: true,  // chunk 的名称，如果设置为固定的字符串那么所有的 chunk 都会被合并成一个，这就是为什么 umi 默认只有一个 vendors.async.js。
            minSize: 30000, // byte, == 30 kb，越大那么单个文件越大，chunk 数就会变少（针对于提取公共 chunk 的时候，不管再大也不会把动态加载的模块合并到初始化模块中）当这个值很大的时候就不会做公共部分的抽取了
            maxSize: 0, // 文件的最大尺寸，优先级：maxInitialRequest/maxAsyncRequests < maxSize < minSize，需要注意的是这个如果配置了，umi.js 就可能被拆开，最后构建出来的 chunkMap 中可能就找不到 umi.js 了。
            minChunks: 1, // 被提取的一个模块至少需要在几个 chunk 中被引用，这个值越大，抽取出来的文件就越小
            maxAsyncRequests: 10, // 在做一次按需加载的时候最多有多少个异步请求，为 1 的时候就不会抽取公共 chunk 了
            maxInitialRequests: 5, // 针对一个 entry 做初始化模块分隔的时候的最大文件数，优先级高于 cacheGroup，所以为 1 的时候就不会抽取 initial common 了。
          cacheGroups: {
            vendor: {
              name: 'vendors',
              test: /^.*node_modules[\\/](?!echarts|bizcharts|antd|@ant-design).*$/, //除去需要拆分的node_modules包
              chunks: 'all',
              priority: 10,
            },
            antd: { // antdsign
                name: 'antd',
                chunks: 'all',
                test: /[\\/]node_modules[\\/]antd|@ant-design[\\/]/,
                priority: 10,
            },
            echarts: {
                name: 'echarts',
                chunks: 'all',
                test: /[\\/]node_modules[\\/]echarts[\\/]/,
                priority: 10,
            },
            bizcharts: {
                name: 'bizcharts',
                chunks: 'all',
                test: /[\\/]node_modules[\\/]bizcharts[\\/]/,
                priority: 10,
            },
          },
      },
    });
  },
```
增加文件加载顺序声明 chunks ，因为我们增加了一个 js 文件，这是我们就要告诉项目，应该先加载哪个文件，如果你有增加其他的拆分文件，记得也要同步添加这个配置。
```ts
chunks: ['vendors', 'echarts', 'antd', 'bizcharts', 'umi'],
```

我们先看下 `cacheGroups` 下的属性，其他属性在下文中会讲解，先实现需求为重。

`cacheGroups` 下的属性为 `key-value` 的对象形式，`key` 可以自行命名，那 `value` 的值呢，我们继续往下看：

`name`: 拆分块的名称，提供字符串或函数使您可以使用自定义名称,如果 `name` 与 `chunks` 名称匹配，则进行拆分。
`test`: 正则匹配路径，符合入口的都会被拆分，装到 name 名称下的包中。
`priority`: 拆包的优先级，越大优先级越高。顺序很重要，先把大包分出去，在将剩余的 `node_modules` 分成 `vendors` 包。
`enforce`: 不管这个包的大小，都会进行分包处理。

![alt 拆包后](/blog/splitChunks.png)
上图可以清晰地看到使用splitChunks的方法，vendors.js大小缩小到1.88M，`echarts`、`antd`和`bizcharts`已经从vendors.js中拆分出来了。

4. 通过 externals 结合 scripts 的方法设置哪些模块不被打包
> 配置 externals 还能减小编译消耗，使项目的编译时间更短。
```ts
// config.ts
chunks: ['antd', 'antPro', 'vendors', 'umi'],
chainWebpack: function (config) {
    //过滤掉momnet的那些不使用的国际化文件
    config
      .plugin('replace')
      .use(require('webpack').ContextReplacementPlugin)
      .tap(() => {
        return [/moment[/\\]locale$/, /zh-cn/];
      });
    config.merge({
      module: {
        rules: [
          {
            test: /\.(gif|png|jpe?g|svg)$/i,
            loader: 'url-loader',
            options: {
              // 图片大小小于8kb，就会被base64处理
              // 优点：减少请求数量（减轻服务器压力）
              // 缺点： 图片体积会更大（文件请求速度更慢）
              limit: 10 * 1024,
              // outputPath: "img/",
            },
          },
        ],
      },
      optimization: {
        splitChunks: {
            chunks: 'all', //提取 chunks 的时候从哪里提取
            name: true,  // chunk 的名称，如果设置为固定的字符串那么所有的 chunk 都会被合并成一个，这就是为什么 umi 默认只有一个 vendors.async.js。
            minSize: 30000, // byte, == 30 kb，越大那么单个文件越大，chunk 数就会变少（针对于提取公共 chunk 的时候，不管再大也不会把动态加载的模块合并到初始化模块中）当这个值很大的时候就不会做公共部分的抽取了
            maxSize: 0, // 文件的最大尺寸，优先级：maxInitialRequest/maxAsyncRequests < maxSize < minSize，需要注意的是这个如果配置了，umi.js 就可能被拆开，最后构建出来的 chunkMap 中可能就找不到 umi.js 了。
            minChunks: 1, // 被提取的一个模块至少需要在几个 chunk 中被引用，这个值越大，抽取出来的文件就越小
            maxAsyncRequests: 10, // 在做一次按需加载的时候最多有多少个异步请求，为 1 的时候就不会抽取公共 chunk 了
            maxInitialRequests: 5, // 针对一个 entry 做初始化模块分隔的时候的最大文件数，优先级高于 cacheGroup，所以为 1 的时候就不会抽取 initial common 了。
          cacheGroups: {
            vendor: {
              name: 'vendors',
              test: /^.*node_modules[\\/](?!antd|@ant-design).*$/, //除去需要拆分的node_modules包
              chunks: 'all',
              priority: 10,
            },
            antd: {
                name: 'antd',
                chunks: 'all',
                test: /[\\/]node_modules[\\/]antd[\\/]/,
                priority: 10,
            },
            antPro: {
              name: 'antPro',
              chunks: 'all',
              test: /[\\/]node_modules[\\/]@ant-design[\\/]/,
              priority: 10,
            },
          },
      },
    });
},
externals: {
    react: 'window.React',
    'react-dom': 'window.ReactDOM',
    lodash: 'window._',
    bizcharts: 'window.BizCharts',
    echarts: 'window.echarts',
},
scripts: [
    'https://unpkg.com/browse/react@^17/umd/react.production.min.js',
    'https://unpkg.com/browse/react-dom@^17/umd/react-dom.production.min.js',
    'https://unpkg.com/browse/lodash@4.17.21/lodash.min.js',
    'https://unpkg.com/browse/bizcharts@4.1.10/umd/BizCharts.min.js',
    'https://unpkg.com/browse/echarts@5.1.2/dist/echarts.min.js',
  ],
```
:::tip
项目中对lodash的引用使用的是`import _ from 'lodash'`，所以想要在浏览器访问时，可以通过`window._`拿到。
例如：`BizCharts`库对外暴露的全局变量是BizCharts
:::

::: warning 警告
这种方式引入并不是越多越好的，浏览器对同一个 hostname 发起的请求数量是有限制的，特别在安卓的 webview 中，限制的更加明显，因此可以通过观察首次发起的请求数量，来酌情处理。当然，土豪组织也可以通过增加不同的 cdn 主机来解除限制。
:::

## 前端网站容灾 - CDN主域重试方案
> 对外网站前端静态资源一般都会部署在 `CDN` 上， `CDN` 可以减少资源请求时间，进而减少页面首屏时间。然而是否想过，有一天 `CDN` 也会被封禁而无法访问，不用怀疑，触不及防我们就会遇到。

既然 `CDN` 无法访问，我们还有主域，当 `CDN` 域名请求失败时，尝试将资源向主域进行请求，则可保证大概率的资源请求成功，网站正常访问。

由于资源加载时间不定，而 JS 有执行顺序要求，前面的 JS 应当比后面的 JS 先执行，在使用 捕获错误并将资源重新请求时，此时无法保证 JS 的执行顺序。

**既然要保证 JS 的执行顺序，需要做两件事**：
1. 判断资源是否加载失败，通过代码执行顺序来定
2. 当代码执行判定资源请求失败，就在资源标签的位置后方插入对应的主域请求，达到保证代码按顺序执行

实现：
```ts
// retryScript.js
window.retryScript = (name, url)=> {
  if (!window[name]) {
    document.write(`<script src="${url}" ></script>`);
  }
};

// config.ts
scripts: [
  { src: '/js/retryScript.js' },
  'https://cdn.staticfile.org/react/17.0.2/umd/react.production.min.js',
  { content: "window.retryScript('React','/js/react.production.min.js')" },
  'https://cdn.staticfile.org/react-dom/17.0.2/umd/react-dom.production.min.js',
  { content: "window.retryScript('ReactDOM','/js/react-dom.production.min.js')" },
  'https://cdn.staticfile.org/lodash.js/4.17.9/lodash.min.js',
  { content: "window.retryScript('_','/js/lodash.min.js')" },
  'https://cdn.staticfile.org/bizcharts/4.1.15/BizCharts.min.js',
  { content: "window.retryScript('BizCharts', '/js/BizCharts.min.js')" },
  'https://cdn.staticfile.org/echarts/5.1.2/echarts.min.js',
  { content: "(window).retryScript('echarts', '/js/echarts.min.js')" },
],
```


产物如下图：
![alt 拆包后](/blog/externals.png)
由上图可以看出，antd和@ant-design组件包从vendors.js拆分出来了。这样在首屏加载时antd和、ant-design和vendors.js实现异步加载，来提升首屏加载速度。

scripts引入的react和react-dom没有指定版本的话，在浏览器渲染时会重定向到指定版本，这样的话，首屏加载速度也会受到影响。
![alt 拆包后](/blog/noVersion.png)

scripts引入的react和react-dom有指定版本的话，在浏览器渲染时会直接加载指定版本，首屏加载速度会变快。
![alt 拆包后](/blog/version.png)

1. 选用可替代的依赖库
![alt 拆包后](/blog/img1.png)
由上图可以看出moment.js通过Gzip压缩后的包体积为94.03kb，而dayjs通过Gzip压缩后包体积为18.84kb。所以可以使用`dayjs`替换 Moment 以优化打包大小。
* 安装依赖包
```shell
npm install dayjs
```
* 安装antd-dayjs-webpack-plugin
```shell
npm i antd-dayjs-webpack-plugin -D
```
> 好处：无需对现有代码做任何修改直接替换成 day.js

修改config.ts文件
```ts
chainWebpack: function (config) {
  config.plugin('moment2dayjs').use('antd-dayjs-webpack-plugin',[
    {
      preset: 'antdv4'   //项目中使用的antd是v几版本
    }
  ])
}
```
替换后的包体积如下图
![alt 拆包后](/blog/img2.png)
dayjs通过Gzip压缩后包体积为18.84kb。

6. **减少将图片转成Base64**

在umi项目中，可以通过inlineLimit来限制是否将图片转成base64格式。inlineLimit默认值为10000（10kb），少于默认值会被编译为 base64 编码，否则会生成单独的js文件。


