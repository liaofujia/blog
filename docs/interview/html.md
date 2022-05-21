# Html 知识点

## 如何实现图片的懒加载

> 当我们碰到长网页有很多图片时，我们会采用先加载出现在视口内的几张图片，当滚动条滚动到相应图片的位置时才去加载别的图片。这种延迟加载的方式我们就称之为懒加载。

故问题拆分成两个：

1. 如何判断图片出现在了当前视口 （即如何判断我们能够看到图片）
2. 如何控制图片的加载

### 方案一：位置计算 + 滚动事件 (Scroll) + DataSet API

首先要理解三个属性的含义分别是什么？

* offsetTop：返回当前元素相对于其 `offsetParent` 元素的顶部内边距的距离。
* clientHeight： `document.documentElement.clientHeight`浏览器可视窗口的高度。
* scrollTop：获取或设置一个元素的内容垂直滚动的像素数。

如何判断图片出现在了当前视口

当 `offsetTop` <= `clientHeight` + `scrollTop`时，可以判断图片出现在了当前视口。

如何控制图片的加载

可以通过将图片的地址保存在img元素的自定义属性上面，当需要加载的时候再将该自定义属性赋值给该图片的src。

```html
<img data-src="logo.jpg" />
```

```js
 // 使用data-xx的自定义属性可以通过dom元素的dataset.xx取得；
img.src = img.datset.src
```

监听滚动事件加载后面的图片

```js
window.onscroll = () => lazyLoad('需要懒加载的图片');
```

### 方案二：getBoundingClientRect API + Scroll with Throttle + DataSet API

`Element.getBoundingClientRect()` 方法返回元素的大小及其相对于视口的位置。

如何判断图片出现在了当前视口

```js
// clientHeight 代表当前视口的高度
img.getBoundingClientRect().top < document.documentElement.clientHeight;
```

监听 `window.scroll` 事件也优化一下

加个节流器，提高性能。工作中比较常用的就是`lodash.throttle`

### 方案三：IntersectionObserver API + DataSet API

如何判断图片出现在了当前视口

方案二使用的方法是: `window.scroll` 监听 `Element.getBoundingClientRect()` 并使用 `_.throttle` 节流。

[IntersectionObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver/IntersectionObserver)

事件回调的参数是 [IntersectionObserverEntry](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserverEntry)的集合，代表关于是否在可见视口的一系列值。

其中，`entry.isIntersecting` 代表目标元素可见。

```js
// 利用 IntersectionObserver 监听元素是否出现在视口
const observer = new IntersectionObserver((changes) => {
  // changes: 目标元素集合
  changes.forEach((change) => {
    // intersectionRatio
    if (change.isIntersecting) {
      const img = change.target;
      img.src = img.dataset.src;
      observer.unobserve(img); // 填充完 img 的 src 属性后取消监听。
    }
  });
});

observer.observe(img);
```

### 方案四： LazyLoading 属性

浏览器觉得懒加载这事可以交给自己做，你们开发者加个属性就好了。

```html
<img src="logo.jpg" loading="lazy" />
```

## 浏览器中如何实现剪切板复制的功能

方式一：使用第三方库 `clipboard-copy`
方式二：最为推荐的方式是使用 Clipboard API 进行实现(不兼容IE浏览器)

```js
async function writeClipBoard() {
  const res = await navigator.clipboard.writeText('Hi，Christine')
  console.log('写入', res);
}
writeClipBoard()
```

方式三：选中: Selection API （兼容IE浏览器）

```js
const selection = window.getSelection();
const range = document.createRange();
const element = document.querySelector('div');

// RangeAPI: 制造区域
range.selectNodeContents(element);

// Selection: 选中区域
selection.addRange(range);

selectedText = selection.toString();
```

## localhost:3000 与 localhost:5000 的 cookie 信息是否共享

共享。

:::tip
Cookie 只区分域，不区分端口和协议，只要域相同，即使端口号或协议不同，cookie 也能共享。
:::

参考链接[Cookie属性详解](https://juejin.cn/post/6863377752939036679)

## 如果把JSON数据转化为demo.json并下载

### 方式一：json 视为字符串，可以利用 DataURL 进行下载

```js
function download(url, name) {
  const a = document.createElement('a')
  a.download = name
  a.href = url
  a.click();
}

const person = {
  name: 'Christine',
  age: 18,
  gender: '女',
}

const dataUrl = `data:,${JSON.stringify(person)}`
download(dataUrl, 'demo.json')
```

### 方式二：转化为 Object URL 进行下载

```js
function download(url, name) {
  const a = document.createElement('a')
  a.download = name
  a.href = url
  a.click();
}

const person = {
  name: 'Christine',
  age: 18,
  gender: '女',
}

const url = URL.createObjectURL(new Blob([JSON.stringify(person)]))
download(url, 'demo.json')
```
