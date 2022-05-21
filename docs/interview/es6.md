# ES6知识点

## var、let 及 const 区别

### 作用域规则

>var声明的变量的作用域是整个封闭函数。let声明的变量只在其声明的块或子块中可用。

```js
function varTest() {
  var x = 1;
  {
    var x = 2;  // 同样的变量!
    console.log(x);  // 2
  }
  console.log(x);  // 2
}

function letTest() {
  let x = 1;
  {
    let x = 2;  // 不同的变量
    console.log(x);  // 2
  }
  console.log(x);  // 1
}
```

### 挂载到全局

```js
var a = 'global'
let b = 'global'
const c = 'global'

console.log('window.a', window.a) // "global"
console.log('window.b', window.b) // undefined
console.log('window.c', window.c) // undefined
```

### 重复声明

```js
var a = 10
var a
console.log(a) // 10

if (x) {
  let foo;
  let foo; // SyntaxError thrown.
}
```

### 暂存死区

> 与通过  `var` 声明的有初始化值 `undefined` 的变量不同，通过 `let` 声明的变量直到它们的定义被执行时才初始化。在变量初始化前访问该变量会导致 `ReferenceError`。该变量处在一个自块顶部到初始化处理的“暂存死区”中。

```js
function test(){
  console.log(a)
  let a
}
test()
```

### 暂存死区与`typeof`

```js
console.log(typeof undeclaredVariable); // 'undefined'

console.log(typeof i); // ReferenceError
let i = 10;
```

总结：

* 函数提升优先于变量提升，函数提升会把整个函数挪到作用域顶部，变量提升只会把声明挪到作用域顶部；
* `var` 存在提升，我们能在声明之前使用。`let`、`const` 因为暂时性死区的原因，不能在声明前使用；
* `var` 在全局作用域下声明变量会导致变量挂载在 `window` 上，其他两者不会；
* `let` 和 `const` 作用基本一致，但是后者声明的变量不能被再次赋值。

## 预解析

函数变量及作用域

隐式全局变量：变量没有声明，直接赋值，执行到时，浏览器才会偷偷把变量提升为隐式全局变量

全局作用域：在函数声明之外的作用域

预解析:

1. 所有的变量声明，都会提升到最顶部，但不会提升赋值；
2. 所有的函数声明，都会提升到最顶部，但不会提升函数的调用；
3. 如果同时有多个 `var` 声明的相同的变量，后面的 `var` 将被忽略；
4. 如果同时有多个同名的函数，后面的函数将会覆盖前面的函数；
5. 如果声明的变量和声明的函数同名，声明的函数将会覆盖声明的变量。

词法分析3步骤:

1. 先分析函数形参（默认值为undefined），再分析形参赋值（没有形参的直接忽略此步骤）
2. 分析函数体中所有的变量声明：
   * 如果变量名与形参名相同时，直接忽略 `var`;
   * 如果变量名与形参名不同时，就相当于声明了一个变量，如var foo，值为undefined;
3. 分析函数体中所有的函数声明：
   * 如果函数名与变量名相同，函数将作为变量的值；
   * 如果函数名与变量名不相同，相当于 `var 函数名 = function 函数名 () {}`;

函数执行过程分为2步:

1. 词法分析过程;
2. 执行过程

栗子1:

```js
function a(b) {
  console.log(b);
  function b() {
    console.log(b);
  }
  b();
  b=1
}
a(1);
```

栗子2:

```js
function t3(greet) {
  console.log(greet); //?
  var greet = 'hello';
  console.log(greet); //?
  function greet() {
  };
  console.log(greet); //?
}
t3(null);
```

栗子3:

```js
function test(a, b) {
  console.log(a);
  console.log(b);
  var b = 234;
  console.log(b);
  a = 123;
  console.log(a);
  function a() {
  }
  var a;
  b = 234;
  var b = function () {
  }
  console.log(a);
  console.log(b);
}

test(1);
```

知识点补充:

arguments是一个对应于传递给函数的参数的类数组对象。(可以获取实参)

```js
function fn(a,b) {
  console.log(arguments);
  console.log(arguments[0]);
  console.log(arguments[0] = 4);
  console.log(a);
}
fn(1,2,3);
```

栗子4:

```js
a = 100;
function demo(e) {
  function e() {
  }
  arguments[0] = 2;
  console.log(e);//?
  if (a) {
      var b = 123;
  }
  a = 10;
  var a;
  console.log(b); //?
  f = 123;
  console.log(a); //?
}

var a;
demo(1);
console.log(a); //?
console.log(f); //?
```

:::warning 警告
具名函数中的变量不能用来调用函数。

```js
var a = function b() {
  console.log(123);
}
a();//123
b();报错
```

:::

## Proxy

> `Proxy` 是ES6新增的功能，它可以用来自定义对象中的操作。

```js
const p = new Proxy(target, handler);
```

代码详解：

* `target`代表需要添加代理的对象
* `handler`用来自定义对象中的操作，比如可以用来自定义 `set` 和 `get` 函数。

接下来我们通过Proxy来实现一个数据响应式

```js
const onWatch = (obj, setBind, getLogger) => {
  const handler = {
    get(target, property, receiver) {
      getLogger(target, property)
      return Reflect.get(target, property, receiver)
    },
    set(target, property, value, receiver) {
      setBind(value, property)
      return Reflect.set(target, property, value, receiver)
    }
  }

  return new Proxy(obj, handler)
}

const user = { name: 'christine' }
const p = onWatch(
  user,
  (value, property) => {
    console.log(`监听到属性${property}改变为${value}`)
  },
  (target, property) => {
    console.log(`'${property}' = ${target[property]}`)
  }
)

user.name = 'Picker' // 监听到属性name改变为Picker
user.name // 'name' = 'Picker'
```

## Set、WeakSet、Map、WeakMap

> `Set` 和 `Map` 主要的应用场景在于 `数据重组` 和 `数据存储`。
> `Set` 是一种叫做集合的数据结构，`Map` 是一种叫做字典的数据结构。

### Set（集合）

ES6 新增的一种新的数据结构，类似于数组，但成员是唯一且无序的，没有重复的值。

Set本身是一种构造函数，用来生成Set数据结构。

```js
new Set([iterable])
```

🌰：

```js
const arr = new Set()
[1,2,3,2,1].forEach(num => arr.add(num))
console.log([...arr]) //[1,2,3]
```

`Set` 对象允许你存储任何类型的唯一值，无论是原始值or对象引用。

```js
const arr = new Set([1,2,3,2,1])
const obj = {age: 18}
arr.add(obj)
arr.add(obj)
console.log(arr.size) // 4

arr.add({age: 18})
console.log(arr.size) // 5
```

![alt](/blog/set.jpg)

* Set 实例属性
  * constructor： 构造函数，返回Set
  * size：返回实例成员总数

    ```js
    const set = new Set([1, 2, 3, 2, 1])

    console.log(set.length) // undefined
    console.log(set.size) // 3
    ```

* Set 实例方法
  * 操作方法
    * add(value)：向一个 Set 对象的末尾添加一个指定的值。返回 `Set` 对象本身

    * delete(value)：从一个 Set 对象中删除指定的元素。成功删除返回 true，否则返回 false。
    * has(value)：返回一个布尔值来指示对应的值value是否存在Set对象中。
    * clear()：用来清空一个 Set 对象中的所有元素。

      ```js
      const set = new Set()

      set.add(1).add(2).add(1)

      set.has(1) // true
      set.has(3) // false
      set.delete(1)
      set.has(1) // false
      ```

      `Array.from` 和 `...`可以将Set对象转为数组

      ```js
      const set = new Set([1, 2, 3, 2, 1])
      const array = Array.from(set)
      console.log(array) // [1, 2, 3]

      or

      const arr = [...set]
      console.log(arr) // [1, 2, 3]
      ```

  * 遍历方法
    * keys()：按照元素插入顺序返回一个具有 Set 对象每个元素值的全新 Iterator 对象。
    * values()：按照元素插入顺序返回一个具有 Set 对象每个元素值的全新 Iterator 对象。
    * entries()：返回一个包含Set对象中所有元素得键值对迭代器
    * forEach(callbackFn, thisArg)：用于对集合成员执行callbackFn操作，如果提供了 thisArg 参数，它便是回调函数执行过程中的 this。

      ```js
      let set = new Set([1, 2, 3])
      console.log(set.keys()) // SetIterator {1, 2, 3}
      console.log(set.values()) // SetIterator {1, 2, 3}
      console.log(set.entries()) // SetIterator {1 => 1, 2 => 2, 3 => 3}

      for (let item of set.keys()) {
        console.log(item);
      } // 1 2  3
      for (let item of set.entries()) {
        console.log(item);
      } // [1, 1] [2, 2] [3, 3]

      set.forEach((value, key) =>  {
          console.log(key + ' : ' + value)
      }) // 1 : 1 2 : 2  3 : 3
      console.log([...set]) // [1, 2, 3]
      ```

      Set 可默认遍历，默认迭代器生成函数是 values() 方法

      ```js
      Set.prototype[Symbol.iterator] === Set.prototype.values // true
      ```

:::tip 总结

* 向 `Set` 加入多个NaN时，只会存在一个`NaN`；
* 向 `Set` 添加值时不会发生类型转换`(5 !== "5")`；
* 向 `Set` 添加不同内存地址的"相同对象"时，会同时存在Set对象中；
* `keys()` 和 `values()` 的行为完全一致，`entries()` 返回的遍历器同时包括键和值且两值相等。
:::

### WeakSet

> `WeakSet` 对象允许你将弱引用对象存储在一个集合中。

```js
new WeakSet([iterable]);
```

WeakSet 与 Set 的区别：

* WeakSet 只能储存对象引用，不能存放值，而 Set 对象都可以
* 成员都是弱引用，垃圾回收机制不考虑WeakSet结构对此成员的引用
* 其他对象不再引用成员时，垃圾回收机制会自动回收此成员所占用的内存，不考虑此成员是否还存在于WeakSet结构中

属性：

* constructor：构造函数，任何一个具有 Iterable 接口的对象，都可以作参数

  ```js
  const arr = [[1, 2], [3, 4]]

  const weakSet = new WeakSet(arr)
  console.log(weakSet)
  ```

  ![alt](/blog/weakSet.jpg)

方法：

* add(value)：在 WeakSet 对象的最后一个元素后添加新的对象。
* has(value)：根据 WeakSet 是否存在相应对象返回布尔值。
* delete(value)：从 WeakSet 对象中移除指定的元素。
* ~~clear()：清空所有元素，注意该方法已废弃。~~

  ```js
  const ws = new WeakSet()

  const obj = {}
  const foo = {}

  ws.add(window)
  ws.add(obj)

  ws.has(window) // true
  ws.has(foo) // false

  ws.delete(window) // true
  ws.has(window) // false
  ```

### Map（字典）

**任何具有 Iterator 接口、且每个成员都是一个双元素的数组的数据结构都可以当作Map构造函数的参数**，例如：

```js
const set = new Set([
  ['foo', 1],
  ['bar', 2]
]);
const m1 = new Map(set);
m1.get('foo') // 1

const m2 = new Map([['baz', 3]]);
const m3 = new Map(m2);
m3.get('baz') // 3
```

如果读取一个未知的键，则返回 `undefined`。

```js
new Map().get('age') // undefined
```

只有对同一个对象的引用，Map 对象才将其视为同一个键。

```js
const map = new Map();

map.set(['a'], 555);
map.get(['a']) // undefined
```

上面代码的 `set` 和 `get` 方法，表面是针对同一个键，但实际上这是两个值，内存地址是不一样的，因此 `get` 方法无法读取该键，返回 `undefined`。

:::tip
Map 的键实际上是跟内存地址绑定的，只要内存地址不一样，就视为两个键。这就解决了同名属性碰撞（clash）的问题，我们扩展别人的库的时候，如果使用对象作为键名，就不用担心自己的属性与原作者的属性同名。
:::

如果 Map 的键是基本数据类型的值（数字、字符串、布尔值），则只要两个值严格相等，Map 将其视为一个键，比如 `0` 和 `-0` 就是一个键，布尔值 `true` 和字符串 `true` 则是两个不同的键。另外，`undefined` 和 `null` 也是两个不同的键。虽然 `NaN` 不严格相等于自身，但 `Map` 将其视为同一个键。

```js
const map = new Map();

map.set(-0, 666);
map.get(+0) // 666

map.set(true, 888);
map.set('true', 999);
map.get(true) // 888

map.set(undefined, 3);
map.set(null, 4);
map.get(undefined) // 3
map.get(null) // 4

map.set(NaN, 6);
map.get(NaN) // 6
map.set(NaN, NaN);
map.get(NaN) // NaN
```

![alt](/blog/Map.jpg)

* Map 实例属性
  * constructor：构造函数，返回Map对象
  * size：返回实例成员总数

    ```js
    const map = new Map([
      ['name', 'Christine'],
      ['age', 18],
    ])

    map.size // 2
    ```

* Map 实例方法
  * 操作方法
    * set(key, value)：添加键值对，返回实例
    * get(key)：通过键查找特定的数值并返回
    * delete(key)：移除 Map 对象中指定的元素，返回布尔
    * has(key)：判断字典中是否存在键key，返回布尔
    * clear()：移除Map对象中的所有元素。
  * 遍历方法
    * keys()：将字典中包含的所有键名以迭代器形式返回
    * values()：将字典中包含的所有元素的值以迭代器形式返回
    * entries()：返回以键和值为遍历器的对象
    * forEach()：使用回调函数遍历每个成员

      ```js
      const map = new Map([
        ['name', 'Christine'],
        ['age', 18]
      ])

      map.keys() // MapIterator {'name', 'age'}
      map.entries() // // MapIterator {'name' => 'Christine', 'age' => 18}
      map.forEach((value, key ,map) => {
        console.log(`map.get('${key}') = ${value}`)
      })
      ```

Map 结构的默认遍历器接口（`Symbol.iterator`属性），就是`entries`方法。

```js
map[Symbol.iterator] === map.entries // true
```

![alt](/blog/map2.jpg)
Map结构转为数据结构，比较快速的方法是
`Array.from` 和 `...`。

```js
const map = new Map([
  ['name', 'Christine'],
  ['age', 18]
])

Array.from(map) // [['name', 'Christine'],['age', 18]]
```

:::tip 总结

* 循环遍历 `Map` 对象可以使用 `let [key, value] of map`；
* 对同一个键多次赋值，后面的值将覆盖前面的值；
* 对同一个对象的引用，被视为一个键；
* 对同样值的两个实例，被视为两个键；
* 添加多个 `NaN` 作为键时，只会存在一个 `NaN` 作为键的值；
:::

### WeakMap

> WeakMap 对象是一组键值对的集合，其中的键是弱引用对象，而值可以是任意。
> WeakMap 弱引用的只是键名，而不是键值。键值依然是正常引用。

WeakMap 中，每个键对自己所引用对象的引用都是弱引用，在没有其他引用和该键引用同一对象，这个对象将会被垃圾回收（相应的key则变成无效的），所以，WeakMap 的 key 是不可枚举的。

属性：

* constructor：构造函数，返回WeakMap

方法：

* get(key)：返回键值对；
* set(key, value)：根据指定的key和value在 WeakMap对象中添加新/更新元素，返回实例；
* delete(key)：删除键值对，返回布尔；
* has(key)：检查键值对，返回布尔。

```js
const wm = new WeakMap();
const obj = {};

wm.set(obj, "foo").set(window, "bar");
wm.set(obj, "baz");
```

![alt](/blog/weakMap.jpg)

### 总结

* Set
  * 成员唯一、无序且不重复
  * [value, value]，键值与键名是一致的（或者说只有键值，没有键名）
  * 可以遍历
* WeakSet
  * 成员都是对象
  * 成员都是弱引用，可以被垃圾回收机制回收，可以用来保存DOM节点，不容易造成内存泄漏
  * 不能遍历
* Map
  * 本质上是键值对的集合，类似集合
  * 可以遍历，方法很多可以跟各种数据格式转换
* WeakMap
  * 只接受对象作为键名（null除外），不接受其他类型的值作为键名
  * 键名是弱引用，键值可以是任意的，键名所指向的对象可以被垃圾回收，此时键名是无效的
  * 不能遍历
