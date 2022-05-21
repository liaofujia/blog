# TypeScript自定义工具类型
## First
> `First`表示用来返回数组的第一个元素。

用法：
```ts
type arr1 = ['a', 'b', 'c']
type arr2 = [3, 2, 1]

type one = First<arr1> // 'a'
type two = First<arr2> // 3
```

代码实现：
```ts
索引实现
type First<T extends any[]> = T extends [] ? never : T[0]
or
占位实现
type First<T extends any[]> = T extends [infer Head, ...rest] ? Head : never
```

代码详解：
* `T extends []`：用于判断 `T` 是否是空数组
* `T[0]`：用于取数组的第一项
* `infer Head`：表示数组第一个元素的占位
* `...rest`：表示数组的剩余元素

## Mutable
> `Mutable<T>`表示将某个类型中的所有属性的readonly移除。

用法：
```ts
type UserInfo = {
  readonly name: string,
  readonly age: number
}
// {name: string, age: number}
type D = Mutable<UserInfo>
```

代码实现：
```ts
type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}
```

代码详解：
* `-readonly`：表示把`readonly`关键字去掉

## Length
> `Length<T>`表示用来获取一个数组或者类数组的长度。

用法：
```ts
type tesla = { 3: '3', length: 4 }
type spaceX = ['FALCON 9', 'FALCON HEAVY', 'DRAGON', 'STARSHIP', 'HUMAN SPACEFLIGHT']

type length1 = Length<tesla> // 4
type length2 = Length<spaceX> // 5
```

代码实现：
```ts
type Length<T> = T extends {length: number} ?  T['length']: never
```

代码详解：
* `T extends { length: number; }`：判断`T`是否是`{length: number}`的子类型
* `T['length']`：在TypeScript中不能使用 `.` 语法来取值，必须使用 `[]` 语法

## If
> `If<T, C, F>`表示它接收一个条件类型 `T` ，一个判断为真时的返回类型 `C` ，以及一个判断为假时的返回类型 `F`。 `T` 只能是 `true` 或者 `false`， `C` 和 `F` 可以是任意类型。

用法：
```ts
type a = If<true, 'a', 'b'> // 'a'
type b = If<false, 'a', 'b'> // 'b'
```

代码实现：
```ts
type If<T extends boolean, C, F> = T extends true ? C : F
```

代码详解：
* `T extends boolean`：表示 `T` 类型为 `boolean` 类型的子类型，即 `T` 只能接收 `true` 或者 `false`
* `T extends true`：写在三元表达式中，用于判断 `T` 是否为 `true`
  
## Concat
> `Concat<T, U>`表示这个类型接受两个参数，返回的新数组类型应该按照输入参数从左到右的顺序合并为一个新的数组。

用法：
```ts
// [1,2]
type Result = Concat<[1], [2]>
```

代码实现： 
```ts
type Concat<T extends any[], U extends any[]> = [...T, ...U]
```

代码详解：
* `T extends any[]`：用来限制T是一个数组，如果传递非数组会报错，U也是一样的道理。
* `[...T, ...U]`：可以理解成JavaScript的扩展运算符 `...` 。

## Includes
> `Includes<T， U>`表示这个类型接受两个参数，用于判断 `U` 是否在数组 `T` 中，类似实现数组的 `includes` 方法。

用法：
```ts
type isPillarMen = Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Dio'> // false

// 使用简单版：预期是false，实际是true
type result = Includes<[{}], { a: 'A' }>
```

代码实现：
```ts
简单版
type Includes<T extends readonly any[], U> = U extends T[number] ? true : false

完整版
type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false

type Includes<T extends readonly any[], U> = 
T extends [infer First , ...infer Rest] 
  ? 
    Equal<First,U> extends true 
    ? 
      true 
    : Includes<Rest,U> 
  : false;
// false
type result = Includes<[{}], { a: 'A' }>
```

代码详解：
```ts
Equal<string, number>

先分析T extends string ? 1 : 2，假定T为string, string extends string 为true， 结果() => 1
<T>() => T extends string ? 1 : 2

再分析string extends number ? 1 : 2，string extends number 为false，     结果() => 2
<T>() => string extends number ? 1 : 2

() => 1 extends () => 2 // false
```
## Push
> `Push<T, U>`表示将U类型添加到T类型，并作为T类型的最后一项。

用例：
```ts
// [1,2,'3']
type Result = Push<[1, 2], '3'>
```

代码实现：
```ts
// [1,2,'3']
type Push<T extends readonly any[], U> = [...T, U]
```

## Unshift
> `Unshift<T, U>`表示将U类型添加到T类型，并作为T类型的第一项。

用例：
```ts
// ['3', 1, 2]
type Result = Unshift<[1, 2], '3'>
```

代码实现：
```ts
// ['3', 1, 2]
type Unshift<T extends readonly any[], U> = [U, ...T]
```

## PromiseType
> `PromiseType<T>`用来获取`Promise`包裹类型。

用法：
```ts
function getInfo (): Promise<string|number> {
  return Promise.resolve(1)
}
// 结果：(） => Promise<string|number>
type funcType = typeof getInfo
// 结果：Promise<string|number>
type returnResult = ReturnType<funcType>
// 结果：string|number
type PromiseResult = PromiseType<returnResult>
```

代码实现：
```ts
type PromiseType<T> = T extends Promise<infer R> ? R : never
```

代码详解：
* `T extends Promise<infer R>`：判断 `T` 是否是 `Promise<infer R>` 的子类型，也就是说T必须满足 `Promise<any>` 的形式。

## 按需Readonly
> `Readonly<T, K>` K指定应设置为Readonly的T的属性集。如果未提供K，则应使所有属性都变为只读，就像普通的 `Readonly<T>` 一样。

```ts
interface Todo {
  title: string
  description: string
  completed: boolean
}

const todo: MyReadonly2<Todo, 'title' | 'description'> = {
  title: "Hey",
  description: "foobar",
  completed: false,
}

todo.title = "Hello" // Error: cannot reassign a readonly property
todo.description = "barFoo" // Error: cannot reassign a readonly property
todo.completed = true // OK
```

代码实现：
```ts
type MyReadonly2<T, K extends keyof T = keyof T> = T & {
  readonly [P in K]: T[P]
}
```

代码详解：
* `K extends keyof T = keyof T`：如果不传递，则默认值为`keyof T`，意味着全部属性都添加readonly。

## DeepReadonly
> `DeepReadonly<T>`表示将T类型的每个参数及其子对象递归地设为只读。

用法：
```ts
type X = {
  x: {
    a: 1
    b: 'hi'
  }
  y: 'hey'
}

type Todo = DeepReadonly<X>

期望的结果👇
type Expected = {
  readonly x: {
    readonly a: 1
    readonly b: 'hi'
  }
  readonly y: 'hey'
}
```

代码实现：
```ts
type DeepReadonly<T> = {
  [P in keyof T]: T[P] extends {[key: string]: any} ? DeepReadonly<T[P]> : T[P]
}
```

代码详解：
* `T[P] extends { [key: string]: any }`：这段表示T[P]是否是一个包含索引签名的字段，如果包含我们认为它是一个嵌套对象，就可以递归调用DeepReadonly。

## TupleToUnion
> `TupleToUnion<T>`用来将一个元组类型T转换成联合类型.

用法：
```ts
type Arr = ['1', '2', '3']

// "1" | "2" | "3"
type Test = TupleToUnion<Arr>
```

代码实现：
```ts
方法一：
type TupleToUnion<T extends any[]> = T[number]

方法二：
type TupleToUnion<T extends any[]> = T extends [infer L, ...infer R] ? L | TupleToUnion<R> : never
```

代码详解：
* `T[number]`：它会自动迭代元组的数字型索引，然后将所以元素组合成一个联合类型。
* `L | TupleToUnion<R>`：L表示每一次迭代中的第一个元素，它的迭代过程可以用下面伪代码表示：
```ts
// 第一次迭代
const L = '1'
const R = ['2', '3']
const result = '1' | TupleToUnion<R>

// 第二次迭代
const L = '2'
const R = ['3']
const result = '1' | '2' | TupleToUnion<R>

// 第三次迭代
const L = '3'
const R = ['']
const result = '1' | '2' | '3'
```

## Last
> `Last<T>`用来获取数组中的最后一个元素。

用法：
```ts
type arr1 = ['a', 'b', 'c']
type arr2 = [3, 2, 1]

type tail1 = Last<arr1> // expected to be 'c'
type tail2 = Last<arr2> // expected to be 1
```

代码实现：
```ts
// way1：索引思想
type Last<T extends any[]> = [any, ...T][T['length']]

// way2: 后占位思想
type Last<T extends any[]> = T extends [...infer L, infer R] ? R : never
```

代码详解：
* `[any, ...T]`：表示我们构建了一个新数组，并添加了一个新元素到第一个位置，然后把原数组T中的元素依次扩展到新数组中，可以用以下伪代码表示：
```ts
// 原数组
const T = [1, 2, 3]

// 新数组
const arr = [any, 1, 2, 3]

// 结果: 3
const result = arr[T['length']]
```

## Chainable(可串联构造器)
> `Chainable<T>` 用来让一个对象可以进行链式调用

用法：
```ts
declare const config: Chainable<{}>

const res = config
  .options('foo', 123)
  .options('bar', { value: 'Hello' })
  .options('name', 'TypeScript')
  .get()
```

代码实现：
```ts
type Chainable<T> = {
  options<K extends string, V>(key: K, value: V): Chainable<T & {[k in K]: V}>
  get(): T
}
```

代码详解：
* `{[k in K]: V}`：每次调用options时，把key/value构造成一个对象，例如：`{ foo: 123 }`。
* `T & {[k in K]: V}`：此处使用到 `&` 关键词，用来合并 `T` 和 `{[k in K]: V}` 两个对象中的所有`key`。
* `Chainable<>`：递归调用 `Chainable` ，赋予新对象以链式调用的能力。

## Pop
> `Pop<T>` 接收一个数组 `T` 并返回删除最后一个元素的新数组。

用法：
```ts
type arr1 = []
type arr2 = [3, 2, 1]

type re1 = Pop<arr1> // expected to be []
type re2 = Pop<arr2> // expected to be [3, 2]
```

代码实现：
```ts
type Pop<T extends readonly any[]> = T extends [...infer L, infer R] ? L : never
```
## LookUp(查找)

用法：
```ts
interface Cat {
  type: 'cat'
  color: 'black' | 'orange' | 'gray'
}
interface Dog {
  type: 'dog'
  color: 'white'
  name: 'wang'
}

// 结果：Dog
type result = LookUp<Cat | Dog, 'dog'>
```

代码实现：
```ts
type LookUp<
  U extends { type: string; },
  T extends string
> = U extends { type: T } ? U : never
```

代码详解：
* `U extends { type: string; }`：限制U的类型必须是具有属性为type的对象

## PromiseAll返回类型
> `PromiseAll`是用来取Promise.all()函数所有返回的类型

用法：
```ts
// 结果：Promise<[number, number, number]>
type result = typeof PromiseAll([1, 2, Promise.resolve(3)])
```

代码实现：
与之前的例子不同，PromiseAll我们声明的是一个function而不是type。
```ts
type PromiseAllType<T> = Promise<{
  [P in keyof T]: T[P] extends Promise<infer R> ? R : T[P]git
}>
declare function PromiseAll<T extends any[]>(values: readonly [...T]): PromiseAllType<T>
```

代码详解：
* 因为`Promise.all()`函数接受的是一个数组，因此泛型`T`限制为一个`any[]`类型的数组。
* `PromiseAllType`的实现思路有点像之前的`PromiseType`，只不过这里多了一层`Promise`的包裹，因为`Promise.all()`的返回类型也是一个`Promise`。

## Trim、TrimLeft以及TrimRight
> `Trim、TrimLeft以及TrimRight`都是用来去除空格的。

用法：
```ts
const t1 = TrimLeft<' str'>  // 'str'
const t2 = Trim<' str '>     // 'str'
const t3 = TrimRight<'str '> // 'str'
```

代码实现：
```ts
type Space = ' ' | '\n' | '\t'
type TrimLeft<S extends string> = S extends `${Space}${infer R}` ? TrimLeft<R> : S
type Trim<S extends string> = S extends (`${Space}${infer R}` | `${infer R}${Space}`) ? Trim<R> : S
type TrimRight<S extends string> = S extends `${infer R}${Space}` ? TrimRight<R> : S
```

代码详解：
* `TrimLeft` 和 `TrimRight` 的实现思路是相同的，区别在于空白符的占位出现在左侧还是右侧。
* `Trim` 的实现就是把 `TrimLeft` 和 `TrimRight` 所做的事情结合起来。


## Uncapatilize(首字母小写)
> `Uncapatilize<T>`是用来将一个字符串的首字母变成小写的。

用法：
```ts
type t2 = Uncapatilize<'Christine'> // 'christine'
```

代码实现：
```ts
type Uncapatilize<S extends string> = S extends `${infer firstLetter}${infer L}` ? `${Lowercase<firstLetter>}${L}` : S
```

代码详解：
* `Uncapatilize<firstLetter>`: 我们只需要首字母用firstLetter占位，用工具函数 `Uncapatilize` 将首字母变成小写。

## Replace
> `Replace<T>` 是用来将字符串中第一次出现的某段内容，使用指定的字符串进行替换。

用法：
```ts
// 'IamPicker'
type t = Replace<'IamChristine', 'Christine', 'Picker'>
```

代码实现：
```ts
type Replace<
  S extends string,
  from extends string,
  to extends string
> = S extends `${infer L}${from}${infer R}`
      ? from extends ''
        ? S
        : `${L}${to}${R}`
      : S
```

代码详解：
* `${infer L}${from}${infer R}`: `infer L` 是 `Iam` 的占位，`form`是`Christine`，`infer R`是 `空字符串` 的占位。


## ReplaceAll
> `ReplaceAll<T>` 是用来将字符串中出现的某段内容，使用指定的字符串进行全局替换。

用法：
```ts
// 'IamPicker，IamPickeryeah'
type t = Replace<'IamChristine，IamChristineyeah', 'Christine', 'Picker'>
```

代码实现：
```ts
type ReplaceAll<T extends string, from extends string, to extends string> = T extends `${infer L}${from}${infer R}` 
  ? from extends '' 
    ? T
    : `${ReplaceAll<L, from, to>}${to}${ReplaceAll<R, from ,to>}`
  : T
```

## AppendArgument（函数追加形参）
> `AppendArgument<Fn, A>`对于给定的函数类型 Fn，以及一个任意类型 A，返回一个新的函数 G。G 拥有 Fn 的所有参数并在末尾追加类型为 A 的参数。

用法：
```ts
type Fn = (a: number, b: string) => number;

// (args_0: number, args_1: string, args_2: boolean) => number
type Result = AppendArgument<Fn, boolean> 
```

代码实现：
```ts
type AppendArgument<T, A> = T extends (...args: infer Params) => infer Res ? (...args: [...Params, A]) => Res : never
```

## Permutation
> `Permutation<T>`

## LengthOfString
> `LengthOfString<T extends string, U extends string[] = []>`用来计算一个字符串的长度。

用法：
```ts
type result = LengthOfString<'Hello'> // 5
```

代码实现：
```ts
type LengthOfString<T extends string, U extends string[] = []> = T extends `${infer firstLetter}${infer R}`
  ? LengthOfString<R, [...U, firstLetter]>
  : U['length']
```

代码详解：
* 我们通过一个泛型的辅助数组来帮计算字符串的长度，在第一次符合条件时，将其第一个字符添加到数组中，在后续的递归过程中，如果不符合条件，直接返回T['length']，这个过程可以用如下代码表示：
```
<!-- 第一次递归 -->
T: 'Hello' firstLetter: 'H' R: 'ello' U: ['H']
<!-- 第二次递归 -->
T: 'ello'  firstLetter: 'e' R: 'llo'  U: ['H', 'e']
<!-- 第三次递归 -->
T: 'llo'   firstLetter: 'l' R: 'lo'   U: ['H', 'e', 'l']
<!-- 第四次递归 -->
T: 'lo'    firstLetter: 'l' R: 'o'    U: ['H', 'e', 'l', 'l']
<!-- 第五次递归 -->
T: 'o'     firstLetter: 'o' R: ''     U: ['H', 'e', 'l'， 'l', 'o']
```
当 `T` 为空时，infer 占位需要内容，`firstLetter` 和 `R` 需要有一个有内容，此时 T extends `${infer firstLetter}${infer R}`为false，所以会执行U['length']

## Flatten(数组降维)
> `Flatten<T>` 将多维数组变为一维数组。

用法：
```ts
// [1, 2, 3, 4, 5]
type flatten = Flatten<[1, 2, [3, 4], [[[5]]]]> 
```

代码实现：
```ts
type Flatten<
  T extends any[]
> = T extends [infer L, ...infer Rest]
      ? L extends any[]
        ? [...Flatten<L>, ...Flatten<Rest>]
        : [L, ...Flatten<Rest>]
      : []
```
