# JS基础知识点

## 基本数据类型

在 JS 中，存在着 7 种原始值，分别是：

* `boolean`
* `null`
* `undefined`
* `number`
* `string`
* `symbol`
* `bigInt`

基本数据类型存储的都是值，是没有函数可以调用的，比如 `undefined.toString()` 会报错 `Uncaught TypeError: Cannot read properties of undefined (reading 'toString')`。

此时你肯定会疑惑，为什么`'1'.toString()`在浏览器能正常运行呢？因为 `'1'.toString()` 中的字符串 `'1'` 在这个时候会被封装成其对应的字符串对象，以上代码相当于 `new String('1').toString()`，因为 `new String('1')` 创建的是一个对象，而这个对象里是存在toString()方法的。

除了会在必要的情况下强转类型以外，原始类型还有一些坑。

其中 JS 的 `number` 类型是浮点类型的，在使用中会遇到某些 Bug，比如 `0.1 + 0.2 !== 0.3`，但是这一块的内容会在进阶部分讲到。`string` 类型是不可变的，无论你在 `string` 类型上调用何种方法，都不会对值有改变。

另外对于 `null` 来说，很多人会认为他是个对象类型，其实这是错误的。虽然 `typeof null` 会输出 `'object'`，但是这只是 JS 存在的一个悠久 Bug。在 JS 的最初版本中使用的是 32 位系统，为了性能考虑使用低位存储变量的类型信息，`000` 开头代表是对象，然而 `null` 表示为全零，所以将它错误的判断为 `object` 。虽然现在的内部类型判断代码已经改变了，但是对于这个 Bug 却是一直流传下来。

## 引用类型

> 在JS中，除了基本数据类型那么其他的都是引用类型了。基本数据类型和引用类型不同的是：基本数据类型存储的是值，引用类型存储的是地址（指针）。

```js
const a = []
const b = a
a.push('Christine')
```

对于常量 `a` 来说，假设内存地址（指针）为 `#001`，那么在地址 `#001` 的位置存放了值 []，常量 a 存放了地址（指针） `#001`，当我们将变量 `a` 赋值给变量 `b` 时，相当于将 `a` 的内存地址赋值给了 `b`，此时变量 `a` 和 `b` 指向同一个地址 `#001`，当我们进行数据修改的时候，就会修改存放在地址（指针） `#001` 上的值，也就导致了两个变量的值都发生了改变。

函数参数是对象

```js
function test(person) {
  person.age = 30
  person = {
    name: 'christine',
    age: 27
  }

  return person
}
const p1 = {
  name: 'picker',
  age: 26
}
const p2 = test(p1)
console.log(p1) // {name: 'picker', age: 30}
console.log(p2) // {name: 'christine', age: 27}
```

代码详解：

1. 函数传参传递的是 `p1` 对象指针的副本；
2. 在函数内部改变 `person` 的属性，`p1` 对象的值也同步修改了；
3. 函数返回了新的对象 `person`，这个新对象拥有了一个新的地址（指针），也就和 `p1` 对象没有任何关系了，最终导致两个变量的值是不相同的。

typeof VS instanceof

`typeof` 能精准判断除了null以外的所有基本数据类型的值。

```js
typeof 1         // 'number'
typeof '1'       // 'string'
typeof false     // 'boolean'
typeof undefined // 'undefined'
typeof null      // 'object'
typeof Symbol(1) // 'symbol'
typeof BigInt(1) //'bigint'
```

`typeof` 对于引用类型来说，除了函数会判断成 `'function'` ，其他引用类型一律返回 `'object'`。

```js
typeof []           // 'object'
typeof {}           // 'object'
typeof console.log  // 'function'
typeof new RegExp() // 'object'
```

如果我们想判断一个对象的正确类型，这时候可以考虑使用 `instanceof`，因为内部机制是通过原型链来判断的，在后面的章节中我们也会自己去实现一个 `instanceof`。

```js
const Person = function() {}
const p1 = new Person()
p1 instanceof Person // true

const str = 'hello world'
str instanceof String // false

const str1 = new String('hello world')
str1 instanceof String // true
```

对于基本数据类型来说，你想直接通过 `instanceof` 来判断类型是不行的，当然我们还是有办法让 `instanceof` 判断基本数据类型的。

```js
class PrimitiveString {
  static [Symbol.hasInstance](x) {
    return typeof x === 'string'
  }
}
console.log('hello world' instanceof PrimitiveString) // true
```

代码详解：

* `Symbol.hasInstance` 用于判断某对象是否为某构造器的实例。

通过上面的例子侧边反映了一个问题， `instanceof` 也不是百分之百可信的。

## 类型转换

在 `JS` 中类型转换只有三种情况，分别是：

* 转换为布尔值
* 转换为数字
* 转换为字符串

| 原始值 | 转换目标 | 结果 |
| ----  | ----     | ----  |
| number | 布尔值 | 除了0、-0、NaN其它都为true |
| string | 布尔值 | 除了空字符串其它都为true |
| undefined、null | 布尔值 | 都为false |
| 引用类型 | 布尔值 | 都为true |
| symbol | 布尔值 | true |
| number | 字符串 | 6 => '6'|
| 布尔值 | 字符串 | true => 'true' |
| undefined | 字符串 | 'undefined'|
| null | 字符串 | 'null'|
| symbol | 字符串 | Symbol(2) => 'Symbol(2)'|
| 函数| 字符串 | function(){} => "function(){}"|
| 数组 | 字符串 | [1,2] => '1,2'、[] => ''|
| 对象 | 字符串 | {age: 18} => '[object Object]'|
| 字符串 | 数字 | '1' => 1、'a' => NaN、'0' => 0、'' => 0|
| 数组 | 数字 | [] => 0、 存在一个元素且为数字的数组 => 数字，其它情况都为NaN |
| null | 数字 |  0 |
| undefined | 数字 | NaN|
| 对象 | 数字 | NaN|
| 函数 | 数字 | function(){} => NaN|
| symbol | 数字 | Uncaught TypeError: Cannot convert a Symbol value to a number |

## 转boolean

在条件判断时，除了`undefined`、`null`、`false`、`''`、`0`、`-0`、`NaN`转布尔为 `false` 外，其它所有值转布尔都为 `true` 。包括所有对象。

## 对象转基本数据类型

对象转基本数据类型时，会调用内置的 `[[ToPrimitive]]` 函数，对于该函数来说，其逻辑一般来说如下：

* 如果已经为原始值，则不需要转换；
* 调用 `x.valueOf()`, 如果转换为基本数据类型，则返回转换的值；
* 调用 `x.toString()`，如果转换为基本数据类型，则返回转换的值；
* 如果都没有转为基本类型，则报错；

当然你也可以重写 Symbol.toPrimitive ，该方法在转原始类型时调用优先级最高。

```js
const a = {
  valueOf() {
    return 0
  },
  toString() {
    return '1'
  },
  [Symbol.toPrimitive]() {
    return 2
  }
}

1 + a // => 3
```

## 对象转原始类型应用

如何使if(a==1&&a==2&&a==3) {console.log('true')}; 正确打印'true'

```js
const a = {
  value: 0,
  valueOf() {
    this.value++;
    return this.value;
  }
}
if(a==1 && a==2 && a==3) {
  console.log('true'); // 输出true
}
```

代码详解：

* 重写对象 `a` 的 `valueOf()` 方法，使 `value` 属性每次调用时自增;
* 当判断 `a==1` 时，第一次调用 `valueOf()` 方法，此时 `value` 等于1，判断1==1，继续向下走；
* 判断 `a==2` 时，第二次调用 `valueOf()` 方法，此时 `value` 等于2，判断2==2，继续向下走；
* 判断 `a==3` 时，第三次调用 `valueOf()` 方法，此时 `value` 等于3，判断3==3，if判断结束；
* if条件判断为 `true && true && true` ，执行 `console.log('true')` ，打印true。

## this

在JS中 `this` 指向，写个栗子简单诠释下：

```js
var a = 1

function foo() {
  console.log(this.a)
}

const obj1 = {
  a: 2,
  foo: foo
}

const obj2 = {
  a: 3
}

foo() // 1
obj1.foo() // 2
obj1.foo.apply(obj2) // 3
const c = new foo() // undefined
```

代码详解：

* `foo()`：对于直接调用foo来说，不管foo函数放在了什么地方，this一定是window；
* `obj1.foo()`：对于 `obj1.foo()` 来说，我们只需要记住，谁调用了函数，`this` 就指向谁，所以在这个场景下 `foo` 函数中的 `this` 就是 `obj1` 对象；

* `obj1.foo.apply(obj2)`：`call()`、`apply()` 和 `bind()` 改变上下文的方法，`this` 指向取决于这些方法的第一个参数，当第一个参数为 `null` 或者为 `空` 时，`this` 指向全局对象 `window`；

* `new foo()`：`new` 构造函数调用，`this` 永远指向新创建的对象上，优先级最高。

下面我们来看看箭头函数的 `this`

```js
function abc() {
  return () => {
    return () => {
      console.log(this)
    }
  }
}
console.log(abc()()())
```

首先箭头函数其实是没有 `this` 的，箭头函数中的 `this` 只取决包裹箭头函数的第一个普通函数的 `this`。在这个例子中，因为包裹箭头函数的第一个普通函数是 `abc`，所以此时的 `this` 是 `window`。另外对箭头函数使用 `bind` 这类函数是无效的。

那么说到 bind，不知道大家是否考虑过，如果对一个函数进行多次 bind，那么上下文会是什么呢？

```js
let a = {}
let fn = function () { console.log(this) }
fn.bind().bind(a)() // => window
```

如果你认为输出结果是 a，那么你就错了，其实我们可以把上述代码转换成另一种形式

```js
// fn.bind().bind(a) 等于
let fn2 = function fn1() {
  return function() {
    return fn.apply()
  }.apply(a)
}
fn2()
```

可以从上述代码中发现，不管我们给函数 `bind` 几次，`fn` 中的 `this` 永远由第一次 `bind` 决定，所以结果永远是 `window`。

```js
const a = { name: 'christine' }
function foo() {
  console.log(this.name)
}
foo.bind(a)() // => 'christine'
```

以上就是 `this` 的规则了，但是可能会发生多个规则同时出现的情况，这时候不同的规则之间会根据优先级最高的来决定 `this` 最终指向哪里。

::: warning
`new` 的方式优先级最高，接下来是 `bind` 这些函数，然后是 `obj1.foo()` 这种调用方式，最后是 `foo` 这种调用方式，同时，箭头函数的 `this` 一旦被绑定，就不会再被任何方式所改变。
:::

== VS ===

假如我们需要对比 x 和 y 是否相同，就会进行如下判断流程：

1.首先会判断两者类型是否相同，相同的话就比数值大小了；

2.若类型不相同的话，那么就会进行类型转换；

3.会先判断是否在对比 `null` 和 `undefined`，是的话就会返回 `true`；

4.判断两者类型是否为 `string` 和 `number`，是的话就会将 `string` 转换为 `number`；

```js
1 == '1'
      ↓
1 ==  1
```

5.判断其中一方是否为 boolean，是的话就会把 boolean 转为 number 再进行判断；

```js
'1' == true
        ↓
'1' ==  1
 ↓
 1  ==  1
```

6.判断其中一方是否为 `object` 且另一方为 `string`、`number` 或者 `symbol`，是的话就会把 `object` 转为基本数据类型再进行判断；

```js
'1' == { name: 'christine' }
                  ↓
'1' == '[object Object]'
```

看完了上面的步骤，对于 `[] == ![]` 你是否能正确写出答案呢？

```js
[] == ![] // true
```

代码详解：

1. 左侧是一个 `[]`；

2. 右侧是一个布尔值，`[]` 转换成布尔值 `true`，因为除了 `null` 之外的所有对象转换成布尔都是 `true`，所以 `![]` 结果为 `false`；

3. 此时相当于 `[] == false`，依据类型转换规则，会把布尔转换成 `number` 再进行比较；`false` 转 `number` 结果为 `0`；

4. 此时相当于 `[] == 0`，依据类型转换规则，会把 `[]` 转为基本数据类型，调用 `[].toString()`，将 [] 转换成了字符串，所以 `[]` 结果为 `''`；

5. 此时相当于 `'' == 0`，依据类型转换规则，会把 `''` 转换为 `number`，结果为 `0`， 所以 `0 == 0`，结果为 `true`。

## 闭包

> 一个函数和对其周围状态（lexical environment，词法环境）的引用捆绑在一起（或者说函数被引用包围），这样的组合就是闭包（closure）。也就是说，闭包让你可以在一个内层函数中访问到其外层函数的作用域。

```js
function init() {
  const name = "Mozilla"; // name 是一个被 init 创建的局部变量
  function displayName() { // displayName() 是内部函数，一个闭包
      alert(name); // 使用了父函数中声明的变量
  }
  displayName();
}
init();
```

在 JS 中，闭包存在的意义就是让我们可以间接访问函数内部的变量。

```!
经典面试题，循环中使用闭包解决 `var` 定义函数的问题
```

```js
for (var i = 1; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i)
  }, i * 1000)
}
```

首先因为 `setTimeout` 是个异步函数，所以会先把循环全部执行完毕，这时候 `i` 就是 `6` 了，所以会输出一堆 `6`。

解决办法有三种:

1.使用闭包的方式

```js
for (var i = 1; i <= 5; i++) {
  ;(function(j) {
    setTimeout(function timer() {
      console.log(j)
    }, j * 1000)
  })(i)
}
```

在上述代码中，我们首先使用了立即执行函数将 `i` 传入函数内部，这个时候值就被固定在了参数 `j` 上面不会改变，当下次执行 `timer` 这个闭包的时候，就可以使用外部函数的变量 `j`，从而达到目的。

2.使用 `setTimeout` 的第三个参数，这个参数会被当成 `timer` 函数的参数传入。

```js
for (var i = 1; i <= 5; i++) {
  setTimeout(
    function timer(j) {
      console.log(j)
    },
    i * 1000,
    i
  )
}
```

[setTimeout用法](https://developer.mozilla.org/zh-CN/docs/Web/API/setTimeout)

3.使用 `let` 定义 `i`，这个也是最为推荐的方式。

```js
for (let i = 1; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i)
  }, i * 1000)
}
```

## 深浅拷贝

### 浅拷贝

:::tip
浅拷贝只会拷贝所有的属性值到新的对象中，如果属性值是对象的话，拷贝的是地址。
:::

浅拷贝的几种方式

1.Object.assign

```js
const a = {
  age: 18
}
const b = Object.assign({}, a)
a.age = 20
console.log(b.age) // 18
```

:::tip
使用 `Object.assign` 方法有几点需要注意:

* 它不会拷贝对象的继承属性；
* 它不会拷贝对象的不可枚举属性；
* 可以拷贝Symbol类型的属性。
:::

2.扩展运算符`...`

```js
const a = {
  age: 18
}
const b = {...a}
a.age = 20
console.log(b.age) // 18
```

通常浅拷贝就能解决大部分问题了，但是当我们遇到如下情况时，可能需要使用深拷贝来解决。

```js
const a = {
  age: 1,
  jobs: {
    first: 'FE'
  }
}
const b = { ...a }
a.jobs.first = 'native'
console.log(b.jobs.first) // 'native'
```

### 深拷贝

上面的问题，可以通过`JSON.parse(JSON.stringify(object))`来解决。

```js
const a = {
  age: 1,
  jobs: {
    first: 'FE'
  }
}
const b = JSON.parse(JSON.stringify(a))
a.jobs.first = 'native'
console.log(b.jobs.first) // 'FE'
```

但是该方法也是有局限性的：

* 会忽略 `undefined`
* 会忽略 `symbol`
* 不能序列化函数
* 不能解决循环引用的对象

```js
const a = {
  age: undefined,
  sex: Symbol('male'),
  jobs: function() {},
  name: 'Christine'
}
const b = JSON.parse(JSON.stringify(a))
console.log(b) // {name: "Christine"}
```

### 手写深拷贝

```js
function isObject(o) {
  return (typeof o === 'object' || typeof o === 'function') && o !== null
}

function deepClone(obj) {
  if (!isObject(obj)) {
    throw new Error('非对象')
  }

  let isArray = Array.isArray(obj)
  let newObj = isArray ? [...obj] : { ...obj }
  Reflect.ownKeys(newObj).forEach(key => {
    newObj[key] = isObject(obj[key]) ? deepClone(obj[key]) : obj[key]
  })

  return newObj
}

const obj = {
  a: [1, 2, 3],
  b: {
    c: 2,
    d: 3
  }
}
const newObj = deepClone(obj)
newObj.b.c = 1
console.log(obj.b.c) // 2

const obj2 = {
  age: undefined,
  sex: Symbol('male'),
  jobs: function() {},
  name: 'Christine'
}
const newObj2 = deepClone(obj2)
console.log(newObj2)
```

`obj2` 和 `newObj2`打印结果对比如下：
![alt](/blog/deepClone.jpg)

## 防抖（debounce）

>触发高频事件后 n 秒内函数只会执行一次，如果 n 秒内高频事件再次被触发，则重新计算时间。

应用场景：

1. 登录、发短信等按钮避免用户点击太快，以致于发送多次请求。
2. 调整浏览器窗口大小时，resize次数过于频繁，造成计算过多，此时需要一次到位，就用到了防抖。
3. 文本编辑器实时保存，当无任何更改操作一秒后进行保存。

```js
function debounce(fn, wait) {
  let timerId;

  return function() {
    const _this = this
    const args = arguments

    if(timerId) {
      clearTimeout(timerId)
    }

    timerId = setTimeout(() => {
      fn.apply(_this, args)
    }, wait)
  }
}

window.onresize = debounce(function() {
  console.log('onresize')
}, 500)
```

## 节流（throttle）

> 高频事件触发，但在 n 秒内只会执行一次，所以节流会稀释函数的执行频率。

应用场景：

1. `scroll` 事件，每隔 `wait` 秒计算一次位置信息等
2. 浏览器播放事件，每隔 `wait` 秒计算一次进度信息等
3. input框实时搜索并发送请求展示下拉列表，每隔 `wait` 秒发送一次请求（也可做防抖）

```js
// 延时器
function throttle(fn, wait) {
  let timerId
  return function() {
    const _this = this
    const args = arguments

    if(!timerId) {
      timerId = setTimeout(() => {
        timerId = null
        clearTimeout(timerId)
        fn.apply(_this, args)
      }, wait)
    }
  }
}
```

### 总结

* 防抖：防止抖动，单位时间内事件触发会被重置，避免事件被误伤触发多次。**代码实现重在清零** `clearTimeout`。防抖可以比作等电梯，只要有一个人进来，就需要再等一会儿。业务场景有避免登录按钮多次点击的重复提交。
* 节流：控制流量，单位时间内事件只能触发一次，与服务器端的限流 (Rate Limit) 类似。**代码实现重在开锁关锁** `timer=timeout; timer=null`。节流可以比作过红绿灯，每等一个红灯时间就可以过一批。

## 原型和原型链

### 原型基本概念

Javascript 规定，每一个构造函数都有一个 `prototype` 属性，指向原型对象。 这个对象的所有属性和方法，都会被构造函数的实例继承。

这也就意味着，我们可以把所有对象实例需要共享的属性和方法直接定义在 `prototype` 对象上。

```js
function Person (name, age) {
  this.name = name
  this.age = age
}

Person.prototype.type = 'human'

Person.prototype.sayName = function () {
  console.log(this.name)
}

var p1 = new Person('Christine', 18)
var p2 = new Person('Picker', 18)

console.log(p1.sayName === p2.sayName) // => true
```

这时所有实例的 `type` 属性和 `sayName()` 方法， 其实都是同一个内存地址，指向 `prototype` 对象，因此就提高了运行效率。

我们注意到，上面例子中每添加一个属性和方法就要敲一遍 `Person.prototype`。 为减少不必要的输入，更常见的做法是用一个包含所有属性和方法的对象字面量来重写整个原型对象：

```js
function Person (name, age) {
  this.name = name
  this.age = age
}

Person.prototype = {
  type: 'human',
  sayHello: function () {
    console.log('我叫' + this.name + '，我今年' + this.age + '岁了')
  }
}
```

在该示例中，我们将一个新的对象赋值给了 `Person.prototype` 。 这样做的好处就是为 `Person.prototype` 添加成员简单了，但是也会带来一个问题，那就是原型对象丢失了 `constructor` 成员。
所以，我们为了保持 `constructor` 的指向正确，建议的写法是：

```js
function Person (name, age) {
  this.name = name
  this.age = age
}

Person.prototype = {
  constructor: Person, // => 手动将 constructor 指向正确的构造函数
  type: 'human',
  sayHello: function () {
    console.log('我叫' + this.name + '，我今年' + this.age + '岁了')
  }
}
```

### 构造函数、实例、原型三者之间的关系

构造函数：构造函数就是一个函数，配合new可以新建对象。

实例：通过构造函数实例化出来的对象我们把它叫做构造函数的实例。一个构造函数可以有很多实例。

原型：每一个构造函数都有一个属性prototype，这个属性就叫做原型属性。通过构造函数创建出来的实例能够直接使用原型上的属性和方法。

### `__proto__`

通过构造函数创建的对象，自带一个`__proro__`属性，这个属性指向了构造函数的 `prototype` 属性，也就是原型对象。

获取原型对象：

* 通过 `构造函数.prototype` 可以获取
* 通过 `实例.__proto__` 可以获取（隐式原型）
* 它们指向了同一个对象 `构造函数.prototype` === `实例.__proto__`

:::tip
`__proto__` 是浏览器的一个隐藏（私有）属性，早期的IE浏览器不支持，不要去修改它，如果要修改原型中的内容，使用 `构造函数.prototype` 去修改。
:::

总结：

* 任何函数都具有一个 `prototype` 属性，该属性是一个对象；
* 构造函数的 `prototype` 对象默认都有一个 `constructor` 属性，指向 `prototype` 对象所在函数；
* 通过构造函数得到的实例对象内部会包含一个指向构造函数的 `prototype` 对象的指针 `__proto__`；
* 所有实例都直接或间接继承了原型对象的成员。

:::warning 警告
如果重置了 `prototype` 记得修正 `constructor` 的指向。
:::

### 原型链概念

任何一个对象，都有原型对象，原型对象本身又是一个对象，所以原型对象也有自己的原型对象，这样一环扣一环就形成了一个链式结构，我们把这个链式结构称为：原型链。

原型链可以实现一些属性和方法的公有化，通过原型链，自身没有的属性和方法可以在原型链中查找。

:::tip
Object.prototype是原型链的尽头，Object.prototype的原型是null。
:::

### Object.prototype成员介绍

* hasOwnProperty
`hasOwnProperty()` 方法会返回一个布尔值，指示对象自身属性中是否具有指定的属性（也就是，是否有指定的键）。

```js
const obj = {
  name:"zs"
}
//判断name属性是不是obj自己提供（非继承）的
console.log(obj.hasOwnProperty("name"));//true
console.log(obj.hasOwnProperty("toString"));//false
```

#### 思考：hasOwnProperty与in的区别？

in操作符：如果属性不是自己提供的，是从原型上继承来的，也会返回true

hasOwnProperty: 该属性必须是自己提供，才返回true，否则返回false。

## 原型继承和 Class 继承

首先先来讲下 `class`，其实在 JS 中并不存在类，`class` 只是语法糖，本质还是函数。

```js
class Person {}
Person instanceof Function // true
```

### 组合继承

```js
function Car(color, money){
  this.color = color
  this.money = money
}

Car.prototype.speed = function() {
  console.log('180km/h')
}

function BWM(seat, color, money){
  this.seat = seat
  Car.call(this, color, money)
}

BWM.prototype = new Car()

const bwm = new BWM(7, 'blue', '100万')
bwm.speed()
console.log(bwm instanceof Car)
console.log(bwm instanceof BWM)
```

以上继承的方式核心是在子类的构造函数中通过 `Car.call(this, color, money)` 继承父类的属性，然后改变子类的原型为 `new Car()` 来继承父类的函数。

这种继承方式优点在于构造函数可以传参，不会与父类引用属性共享，可以复用父类的函数，但是也存在一个缺点就是在继承父类函数的时候调用了父类构造函数，导致子类的原型上多了不需要的父类属性，存在内存上的浪费。
![alt](/blog/extend.jpg)

### 寄生组合继承

这种继承方式对组合继承进行了优化，组合继承缺点在于继承父类函数时调用了父类构造函数，我们只需要优化掉这点就行了。

```js
function Car(color, money){
  this.color = color
  this.money = money
}

Car.prototype.speed = function() {
  console.log(`${this.color} 150km/h`)
}

function BWM(seat, color, money){
  this.seat = seat
  Car.call(this, color, money)
}

BWM.prototype = Object.create(Car.prototype)
BWM.prototype.constructor = BWM

const bwm1 = new BWM(7, 'blue', '100万')
const bwm2 = new BWM(5, 'black', '50万')
bwm1.speed() // "blue 150km/h"
bwm2.speed() // "black 150km/h"
```

以上继承实现的核心就是将父类的原型赋值给了子类，并且将构造函数设置为子类，这样既解决了无用的父类属性问题，还能正确的找到子类的构造函数。
![alt](/blog/extend1.jpg)

### Class 继承

以上两种继承方式都是通过原型去解决的，在 ES6 中，我们可以使用 `class` 去实现继承，并且实现起来很简单。

```js
class Car {
  constructor(color, money){
    this.color = color
    this.money = money
  }
  speed() {
    console.log(`${this.color} 150km/h`)
  }
}

class BWM extends Car {
  constructor(seat, color, money) {
    super(color, money) // 需要写在构造函数的最顶部
    this.seat = seat
  }
}

const bwm1 = new BWM(7, 'blue', '100万')
const bwm2 = new BWM(5, 'black', '50万')
bwm1.speed() // "blue 150km/h"
bwm2.speed() // "black 150km/h"
```

`class` 实现继承的核心在于使用 `extends` 表明继承自哪个父类，并且在子类构造函数中必须调用 `super`，因为这段代码可以看成 `Car.call(this, color, money)`。

### 类的静态属性/方法

> 通过关键字 `static` 可以声明一个静态属性/方法。和其他语言一样，静态属性/方法只会挂载到类中，而不会通过类创建的实例调用。

```js
class User {
  static type = "女孩";

  constructor(name) {
    this.name = name;
  }

  show() {
    console.log("show: " + this.name);
  }

  static print() {
    console.log("static print by: " + this.type); // 静态方法里的 this 指向类本身
  }
}

const user = new User("Christine");

// 实例调用类方法
user.print(); // 报错。找不到对象方法

// 使用类方法
User.print(); // static print by: 女孩
```

### super关键字

在继承的过程中，经常会看到 `super` 关键字，它有两个作用：

1. 子类调用构造函数 `constructor` 时，必须在构造函数先调用 `super` 关键字，然后才能使用`this`对象。
2. 子类同名方法会覆盖父类方法，这是使用 `super` 关键字可以调用父类方法。

```js
class Child extends User {
  constructor() {}
}

// 当子类调用了构造函数，却没有在内部使用super，新建实例会报错
const child = new Child('Christine')
```

![alt](/blog/class.jpg)
所以需要在使用 `this` 之前，调用一下 `super`。

```js
class Child extends User {
  constructor(name, age) {
    super(name)
    this.age = age
  }
}
```

#### super 指向

ES6 给我们提供的 `super` 会指向父类的原型。所以我们可以通过 `super` 找到其原型链中的所有属性/方法，但是无法找到 `static` 方法/属性。

:::tip 总结

1. `constructor` 是一个构造函数，创建对象时会自动调用。即使不写，它也会默认存在。
2. 所有写在 `constructor` 内的属性都是实例属性，是定义在实例中的。在constructor之外的属性，都是定义在类中的，也就是原型属性。
3. `constructor` 中的 `this` 指向的是调用的实例对象，静态方法中的this指向类本身。
4. 子类使用构造器时，必须使用 `super` 关键字来扩展构造器，并且需要先调用 `super`。
5. 使用 `static` 关键字标明类属性/方法，他们无法通过类创建的实例调用，只能通过类直接调用。
6. 静态属性/方法是会被继承的。
:::
