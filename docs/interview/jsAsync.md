# JS异步编程

## 并发和并行区别

并发是宏观概念，现在分别有任务 A 和任务 B，在一段时间内通过任务间的切换完成了这两个任务，这种情况就可以称之为并发。

并行是微观概念，假设 CPU 中存在两个核心，那么我就可以同时完成任务 A、B。同时完成多个任务的情况就可以称之为并行。

## 回调函数（Callback）

### 什么是回调函数(Callback)

其实回调函数并不复杂，明白两个重点即可：

1. 函数可以作为一个参数传递到另一个函数中。
2. JS是异步编程语言。

### 为什么需要回调函数？

JavaScript 按从上到下的顺序运行代码。但是，在有些情况下，必须在某些情况发生之后，代码才能运行（或者说必须运行），这就不是按顺序运行了。这是异步编程。

回调函数确保：函数在某个任务完成之前不运行，在任务完成之后立即运行。它帮助我们编写异步 JavaScript 代码，避免问题和错误。

在 JavaScript 里创建回调函数的方法是将它作为参数传递给另一个函数，然后当某个任务完成之后，立即调用它。

回调函数有个致命的弱点，就是容易写出回调地狱。

```js
ajax(url, () => {
  // 处理逻辑
  ajax(url1, () => {
    // 处理逻辑
    ajax(url2, () => {
        // 处理逻辑
    })
  })
})
```

回调地狱的根本问题就是：

* 嵌套函数存在耦合性，一旦有所改动，就会牵一发而动全身
* 嵌套函数一多，就很难处理错误
* 不能使用 try catch 捕获错误
* 不能直接 return

## Generator

执行 Generator 函数会返回一个遍历器对象，也就是说，Generator 函数除了状态机，还是一个遍历器对象生成函数。返回的遍历器对象，可以依次遍历 Generator 函数内部的每一个状态。

形式上，Generator 函数是一个普通函数，但是有两个特征。

1. `function` 关键字与函数名之间有一个 `*`；
2. 函数体内部使用 `yield` 表达式，定义不同的内部状态（yield在英语里的意思就是“产出”）。

### yield

由于 Generator 函数返回的遍历器对象，只有调用 `next` 方法才会遍历下一个内部状态，所以其实提供了一种可以暂停执行的函数。`yield` 表达式就是暂停标志。

遍历器对象的 `next` 方法的运行逻辑如下：

1. 遇到 `yield` 表达式，就暂停执行后面的操作，并将紧跟在 `yield` 后面的那个表达式的值，作为返回的对象的 `value` 属性值。
2. 下一次调用 `next` 方法时，再继续往下执行，直到遇到下一个`yield` 表达式。
3. 如果没有再遇到新的 `yield` 表达式，就一直运行到函数结束，直到 `return` 语句为止，并将 `return` 语句后面的表达式的值，作为返回的对象的 `value` 属性值。
4. 如果该函数没有 `return` 语句，则返回的对象的 `value` 属性值为 `undefined` 。

### next

`next` 方法可以带一个参数，该参数就会被当作上一个 `yield` 表达式的返回值。

```js
function* foo(x) {
  const y = 2 * (yield (x + 1));
  const z = yield (y / 3);
  return (x + y + z);
}

const a = foo(5);
a.next() // Object{value:6, done:false}
a.next() // Object{value:NaN, done:false}
a.next() // Object{value:NaN, done:true}
```

**代码详解：**

* 第二次运行 `next` 方法的时候不带参数，导致 `y` 的值等于`2 * undefined`（即 `NaN` ），除以 3 以后还是 `NaN` ，因此返回对象的 `value` 值也等于 `NaN`。
* 第三次运行 `next` 方法的时候不带参数，所以 `z` 等于`undefined`，返回对象的 `value` 值等于 `5 + NaN + undefined`，即 `NaN`。

```js
function* foo(x) {
  const y = 2 * (yield (x + 1));
  const z = yield (y / 3);
  return (x + y + z);
}

const b = foo(5);
b.next()   //  { value:6, done:false }
b.next(12) // { value:8, done:false }
b.next(13) // { value:42, done:true }
```

**代码详解：**

* 当执行第一次 `next` 时，函数暂停在 `yield (x + 1)` 处，所以返回 `5 + 1 = 6`；
* 当执行第二次 `next` 时，将上一次 `yield` 表达式的值设为 `12` ，此时 `const y = 2 * 12`，所以第二个 `yield` 等于 `2 * 12 / 3 = 8`；
* 当执行第三次 next 时，将上一次 `yield` 表达式的值设为 `13` ，所以 `z = 13`, `x = 5`, `y = 24`，相加等于 `42`。

:::tip
由于 `next` 方法的参数表示上一个 `yield` 表达式的返回值，所以在第一次使用 `next` 方法时，传递参数是无效的。V8 引擎直接忽略第一次使用 `next` 方法时的参数，只有从第二次使用 `next` 方法开始，参数才是有效的。从语义上讲，第一个 `next` 方法用来启动遍历器对象，所以不用带有参数。
:::

用 `Generator` 解决回调地狱如下：

```js
function *fetch() {
  yield ajax(url, () => {console.log('这里是首次回调函数');});
  yield ajax(url, () => {console.log('这里是第二次回调函数');});
  yield ajax(url, () => {console.log('这里是第三次回调函数');});
}
const it = fetch();
const result1 = it.next();
const result2 = it.next();
const result3 = it.next();
```

## Promise

> Promise 是异步编程的一种解决方案。

```js
new Promise((resolve, reject) => {})
```

Promise对象代表一个异步操作，有三种状态：

1. pending（进行中）
2. fulfilled（已成功）
3. rejected（已失败）

特点：

* 对象的状态不受外界影响
* 一旦状态改变就不会再变，任何时候都可得到这个结果

方法：

* then()：分别指定 `resolved` 状态和 `rejected` 状态的回调函数
  * 第一参数：状态变为 `resolved` 时调用
  * 第二参数：状态变为 `rejected` 时调用(可选)
* catch()：指定发生错误时的回调函数
* finally()：用于指定不管 `Promise` 对象最后状态如何，都会执行的操作。
* Promise.all()：将多个实例包装成一个新实例，返回全部实例状态变更后的结果数组(齐变更再返回)
  * 入参：具有 `Iterator` 接口的数据结构
  * 成功：只有全部实例状态变成 `fulfilled` ，最终状态才会变成`fulfilled`
  * 失败：其中一个实例状态变成 `rejected` ，最终状态就会变成`rejected`

    ```js
    var p1 = Promise.resolve(1);
    var p2 = new Promise((resolve) => {
      setTimeout(() => {
        resolve(2);
      }, 100);
    })
    var p3 = 3;
    Promise.all([p1,p2,p3]).then((res) => {
      console.log(res); // 输出[1,2,3]
    })
    ```

* Promise.race()：将多个实例包装成一个新实例，返回全部实例状态优先变更后的结果(先变更先返回)
  * 入参：具有 `Iterator` 接口的数据结构
  * 成功失败：哪个实例率先改变状态就返回哪个实例的状态
* Promise.resolve()：将对象转为Promise对象(等价于 `new Promise(resolve => resolve()))`
* Promise.reject()：将对象转为状态为 `rejected` 的Promise对象(等价于 `new Promise((resolve, reject) => reject()))`

```js
Promise.resolve('foo')
// 等价于
new Promise(resolve => resolve('foo'))
```

当我们在构造 `Promise` 的时候，构造函数内部的代码是立即执行的

```js
new Promise((resolve, reject) => {
  console.log('new Promise')
  resolve('success')
  console.log('end')
})
console.log('finish')

// 打印顺序
// new Promise => end => finish
```

`Promise` 实现了链式调用，也就是说每次调用 `then` 之后返回的都是一个 `Promise`，并且是一个全新的 `Promise`，原因也是因为状态不可变。如果你在 `then` 中 使用了 `return`，那么 `return` 的值会被 `Promise.resolve()` 包装

```js
Promise.resolve(1)
  .then(res => {
    console.log(res) // => 1
    return 2 // 包装成 Promise.resolve(2)
  })
  .then(res => {
    console.log(res) // => 2
  })
```

`Promise` 解决了回调地狱的问题，可以把之前的回调地狱例子改写为如下代码：

```js
ajax(url)
  .then(res => {
      console.log(res)
      return ajax(url1)
  }).then(res => {
      console.log(res)
      return ajax(url2)
  }).then(res => console.log(res))
```

:::tip 总结

* 只有异步操作的结果可决定当前状态是哪一种，其他操作都无法改变这个状态???
* 状态改变只有两种可能：从`pending`变为`resolved`、从`pending`变为`rejected`
* 一旦新建`Promise`对象就会立即执行，无法中途取消
* 建议使用`catch()`捕获错误，不要使用`then()`第二个参数捕获
* `then()`返回新实例，其后可再调用另一个`then()`
* `then()`运行中抛出错误会被`catch()`捕获
* `resolve()`和`reject()`的执行总是晚于本轮循环的同步任务
* 实例状态的错误具有`冒泡`性质，会一直向后传递直到被捕获为止，错误总是会被下一个`catch()`捕获
* `Promise` 中的错误是不会影响外层的运行，`window.onerror` 也是无法检测到的
:::

## async及await

一个函数如果加上 `async` ，那么该函数就会返回一个 `Promise`

```js
async function test() {
  return '1'
}
console.log(test())
```

打印结果如下：
![alt](/blog/promise.jpg)

`async`就是将函数的返回值使用 `Promise.resolve()` 包裹了一下，和 `then` 中处理返回值一样，并且 `await` 只能配套 `async`使用

```js
async function test() {
  const value = await 3 // await 后面跟的不是 Promise 的话，就会包装成 Promise.resolve(返回值)
}
```

`async` 和 `await` 可以说是异步终极解决方案了，相比直接使用 `Promise` 来说，优势在于处理 `then` 的调用链，能够更清晰准确的写出代码，毕竟写一大堆 `then` 也很恶心，并且也能优雅地解决回调地狱问题。当然也存在一些缺点，因为 `await` 将异步代码改造成了同步代码，如果多个异步代码没有依赖性却使用了 `await` 会导致性能上的降低。

```js
async function test() {
  // 以下代码没有依赖性的话，完全可以使用 Promise.all 的方式
  // 如果有依赖性的话，其实就是解决回调地狱的例子了
  await fetch(url)
  await fetch(url1)
  await fetch(url2)
}
```

## 常用定时器函数

常见的定时器函数有 setTimeout、setInterval、requestAnimationFrame。

### setTimeout

`setTimeout`延时执行某一段代码，但`setTimeout`由于EventLoop的存在，并不百分百是准时的，一个`setTimeout`可能会表示如下的形式：

```js
// 延时1s之后，打印hello,world
setTimeout(() => {
  console.log('hello,world');
}, 1000)
```

### setInterval

`setInterval`在指定的时间内，重复执行一段代码，与`setTimeout`类似，它也不是准时的，并且有时候及其不推荐使用`setInterval`定时器，因为它与某些耗时的代码配合使用的话，会存在执行积累的问题，它会等耗时操作结束后，一起一个或者多个执行定时器，存在性能问题。一个`setInterval`可能会表示如下的形式：

```js
setInterval(() => {
  console.log('hello,world');
}, 1000)
```

### requestAnimationFrame

翻译过来就是请求动画帧，它是html5专门用来设计请求动画的API，它与`setTimeout`相比有如下优势：

* 根据不同屏幕的刷新频率，自动调整执行回调函数的时机。
* 当窗口处于未激活状态时，`requestAnimationFrame`会停止执行，而`setTimeout`不会
* 自带函数节流功能

```js
let progress = 0;
let timer = null;
function render() {
  progress += 1;
  if (progress <= 100) {
    console.log(progress);
    timer = window.requestAnimationFrame(render);
  } else {
    cancelAnimationFrame(timer);
  }
}

//第一帧渲染
window.requestAnimationFrame(render);
```
