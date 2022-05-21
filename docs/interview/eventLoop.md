# Event Loop

## 进程和线程

### 进程

> 一个进程就是CPU执行的单个任务的过程，**是程序在执行过程当中CPU资源分配的最小单位**，并且进程都有自己的地址空间，包含了运行态、就绪态、阻塞态、创建态、终止态五个状态。

### 线程

> **线程是CPU调度的最小单位**，它可以和属于同一个进程的其他线程共享这个进程的全部资源。

### 两者之间的关系

一个进程包含多个线程，一个线程只能在一个进程之中。每一个进程最少包含一个线程。

### 两者之间的区别

1. 进程是CPU资源分配的最小单位，线程是CPU调度的最小单位；
2. 进程之间的切换开销比较大，但是线程之间的切换开销比较小。
3. CPU会把资源分配给进程，但是线程几乎不拥有任何的系统资源。因为线程之间是共享同一个进程的，所以线程之间的通信几乎不需要系统的干扰。

**举个例子能够帮助更好的理解进程和线程：**

当你打开一个 Tab 页时，其实就是创建了一个进程，一个进程中可以有多个线程，比如渲染线程、JS 引擎线程、HTTP 请求线程等等。当你发起一个请求时，其实就是创建了一个线程，当请求结束后，该线程可能就会被销毁。

JS 引擎线程和渲染线程，大家应该都知道，在 JS 运行的时候可能会阻止 UI 渲染，这说明了两个线程是互斥的。这其中的原因是因为 JS 可以修改 DOM，如果在 JS 执行的时候 UI 线程还在工作，就可能导致不能安全的渲染 UI。这其实也是一个单线程的好处，得益于 JS 是单线程运行的，可以达到节省内存，节约上下文切换时间，没有锁的问题的好处。当然前面两点在服务端中更容易体现，对于锁的问题，形象的来说就是当我读取一个数字 15 的时候，同时有两个操作对数字进行了加减，这时候结果就出现了错误。解决这个问题也不难，只需要在读取的时候加锁，直到读取完毕之前都不能进行写入操作。

## 执行上下文（Execution Context）

### 什么是执行上下文

>简而言之，执行上下文就是当前 JavaScript 代码被解析和执行时所在环境的抽象概念， JavaScript 中运行任何的代码都是在执行上下文中运行

### 执行上下文的类型

* 全局执行上下文： 这是默认的、最基础的执行上下文。不在任何函数中的代码都位于全局执行上下文中。它做了两件事：
  * 创建一个全局对象，在浏览器中这个全局对象就是 window 对象。
  * 将 this 指针指向这个全局对象。一个程序中只能存在一个全局执行上下文。
* 函数执行上下文： 每次调用函数时，都会为该函数创建一个新的执行上下文。每个函数都拥有自己的执行上下文，但是只有在函数被调用的时候才会被创建。一个程序中可以存在任意数量的函数执行上下文。

### 执行上下文的生命周期

执行上下文的生命周期包括三个阶段：**创建阶段→执行阶段→回收阶段**。

## 执行栈

JavaScript 引擎创建了执行栈来管理执行上下文。可以把执行栈认为是一个存储函数调用的栈结构，遵循`先进后出`的原则。

```js
function foo() {
  throw new Error('error')
  console.log(111)
}

function bar() {
  foo()
}

bar()
```

代码详解：

* 调用 bar 函数时，此时 bar 函数内部代码还未执行，js执行引擎立即创建一个 bar 的执行上下文（简称EC），然后把这执行上下文压入到执行栈（简称ECStack）中。
* 执行 bar 函数过程中，调用 foo 函数，同样地，foo 函数执行之前也创建了一个 foo 的执行上下文，并压入到执行栈中。
* foo 函数执行过程中遇到错误，把错误抛出并弹出栈。

## Event Loop

>在 `JavaScript` 中，任务被分为两种，一种宏任务（`MacroTask`）也叫 `Task`，一种叫微任务（`MicroTask`）。

### MacroTask（宏任务）

`script`全部代码、`setTimeout`、`setInterval`、`setImmediate`（浏览器暂时不支持，只有IE10支持，具体可见MDN）、`I/O`、`UI Rendering`。

### MicroTask（微任务）

`Process.nextTick（Node独有`）、`Promise`、~~`Object.observe`(废弃)~~、`MutationObserver`[具体使用方式查看](http://javascript.ruanyifeng.com/dom/mutationobserver.html)

### 浏览器中的Event Loop

`Javascript` 有一个 `main thread` 主线程和 `call-stack` 调用栈(执行栈)，所有的任务都会被放到调用栈等待主线程执行。

![alt](/blog/eventLoop.png)

:::tip 总结

* 执行栈在执行完`同步任务`后，查看执行栈是否为空，如果执行栈为空，就会去检查`微任务`(`microTask`)队列是否为空，如果微任务队列为空的话，就执行`Task`（宏任务）；如果微任务队列不为空的话，就一次性执行完所有的微任务。
* 每次单个`宏任务`执行完毕后，会去检查`微任务`(`microTask`)队列是否为空，如果不为空的话，会按照先入先出的规则全部执行完微任务(microTask)后，设置`微任务`(`microTask`)队列为`null`，然后再执行`宏任务`，如此循环。
:::

🌰：

```js
console.log('script start');

setTimeout(function() {
  console.log('setTimeout');
}, 0);

Promise.resolve().then(function() {
  console.log('promise1');
}).then(function() {
  console.log('promise2');
});

console.log('script end');

//script start => script end => promise1 => promise2 => setTimeout
```

上面代码执行过程可以参考[tasks-microtasks-queues-and-schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)

```js
console.log('script start')

async function async1() {
  await async2()
  console.log('async1 end')
}
async function async2() {
  console.log('async2 end')
}
async1()

setTimeout(function() {
  console.log('setTimeout')
}, 0)

new Promise(resolve => {
  console.log('Promise')
  resolve()
})
  .then(function() {
    console.log('promise1')
  })
  .then(function() {
    console.log('promise2')
  })

console.log('script end')

```

`async/await` 在底层转换成了 `promise` 和 `then` 回调函数。
每次我们使用 `await`, 解释器都创建一个 `promise` 对象，然后把剩下的 `async` 函数中的操作放到 `then` 回调函数中。

我们可以把上面两个async函数改造成下面的代码

```js
new Promise((resolve, reject) => {
  console.log('async2 end')
  // Promise.resolve() 将代码插入微任务队列尾部
  // resolve 再次插入微任务队列尾部
  resolve(Promise.resolve())
}).then(() => {
  console.log('async1 end')
})
```

### 关于73以下版本和73版本的区别

* 在老版本版本以下，先执行`promise1`和`promise2`，再执行`async1`。
* 在73版本，先执行`async1`再执行`promise1`和`promise2`。

代码详解：

#### 73以下版本

* 首先，打印`script start`，调用`async1()`时，返回一个`Promise`，所以打印出来`async2 end`。
* 每个 `await`，会新产生一个`promise`，但这个过程本身是异步的，所以该await后面不会立即调用。
* 继续执行同步代码，打印`Promise`和`script end`，将`then`函数放入微任务队列中等待执行。
* 同步执行完成之后，检查微任务队列是否为`null`，然后按照先入先出规则，依次执行。
* 然后先执行打印`promise1`，此时`then`的回调函数返回`undefined`，此时又有`then`的链式调用，又放入微任务队列中，再次打印`promise2`。
* 再回到`await`的位置执行返回的 `Promise` 的 `resolve` 函数，这又会把 `resolve` 丢到微任务队列中，打印`async1 end`。
* 当微任务队列为空时，执行宏任务，打印`setTimeout`。

#### 谷歌（金丝雀73版本）

* 如果传递给 `await` 的值已经是一个 `Promise`，那么这种优化避免了再次创建 `Promise` 包装器，在这种情况下，我们从最少三个 `microtick` 到只有一个 `microtick`。
* 引擎不再需要为 `await` 创造 `throwaway Promise` - 在绝大部分时间。
* 现在 `promise` 指向了同一个 `Promise`，所以这个步骤什么也不需要做。然后引擎继续像以前一样，创建 `throwaway Promise`，安排 `PromiseReactionJob` 在`microtask` 队列的下一个 `tick` 上恢复异步函数，暂停执行该函数，然后返回给调用者。

具体详情查看[这里](https://v8.js.cn/blog/fast-async/)
