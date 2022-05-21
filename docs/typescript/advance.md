# TypeScript进阶

## 类型拓宽（Type Widening）
>所有通过 let 或 var 定义的变量、函数的形参、对象的非只读属性，如果满足指定了初始值且未显式添加类型注解的条件，那么它们推断出来的类型就是指定的初始值字面量类型拓宽后的类型，这就是字面量类型拓宽。

```ts
let str = 'this is string'; // 类型是 string
let strFun = (str = 'this is string') => str; // 类型是 (str?: string) => string;
const specifiedStr = 'hello world' // 'hello world'
let newStr = specifiedStr // string

```
第 1~2 行满足了 let、形参且未显式声明类型注解的条件，所以变量、形参的类型拓宽为 string（形参类型确切地讲是 string | undefined）。

第 3 行的常量不可变更，类型没有拓宽，所以 specifiedStr 的类型是 'hello world' 字面量类型。

第 4 行赋予的值 specifiedStr 的类型是字面量类型，且没有显式类型注解，所以变量、形参的类型也被拓宽了。

基于字面量类型拓宽的条件，我们可以通过如下所示代码添加显示类型注解控制类型拓宽行为。

```ts
const str = 'hello world' as const
或者
const str: 'hello world' = 'hello world'

// Type is "hello world"
let newStr = str
```
实际上，除了字面量类型拓宽之外，TypeScript 对某些特定类型值也有类似 "Type Widening" （类型拓宽）的设计，下面我们具体来了解一下。

比如对 null 和 undefined 的类型进行拓宽，通过 let、var 定义的变量如果满足未显式声明类型注解且被赋予了 null 或 undefined 值，则推断出这些变量的类型是 any：

```ts
let x = null; // 类型拓宽成 any
let y = undefined; // 类型拓宽成 any

const z = null; // 类型是 null

let anyFun = (param = null) => param; // 形参类型是 null
let z2 = z; // 类型是 null
let x2 = x; // 类型是 null
let y2 = y; // 类型是 undefined
```

```ts
interface Vectors {
  x: number;
  y: number;
  z: number
}

function getComponent(vectors: Vectors, axis: "x" | "y" | "z") {
  return vectors[axis]
}

let x = "x"
let vec = {x: 10, y: 20, z: 30}
getComponent(vec, x) //Argument of type 'string' is not assignable to parameter of type '"x" | "y" | "z"'.(2345)
```
为什么会出现上述错误呢？通过 TypeScript 的错误提示消息，我们知道是因为变量 x 的类型被推断为 string 类型，而 getComponent 函数期望它的第二个参数有一个更具体的类型。这在实际场合中被拓宽了，所以导致了一个错误。

TypeScript 提供了一些控制拓宽过程的方法。其中一种方法是使用 const。如果用 const 而不是 let 声明一个变量，那么它的类型会更窄。事实上，使用 const 可以帮助我们修复前面例子中的错误：
```ts
const x = "x"
let vec = {x: 10, y: 20, z: 30}
getComponent(vec, x)
```
因为 x 不能重新赋值，所以 TypeScript 可以推断更窄的类型，就不会在后续赋值中出现错误。因为字符串字面量型 “x” 可以赋值给  "x"|"y"|"z"，所以代码会通过类型检查器的检查。

```ts
const obj = { x: 1}
obj.x = 6 //ok

//Type 'string' is not assignable to type 'number'.(2322)
obj.x = 'hi'

// Property 'name' does not exist on type '{ x: number; }'.(2339)
obj.name = "christine"
```

```ts
// Type is { name: string; age: number }
const obj = {name: 'christine', age: 18}

// Type is { name: 'christine'; age: number }
const obj = {name: 'christine' as const, age: 18}

// Type is { readonly name: 'christine'; readonly age: 18 }
const obj = {name: 'christine', age: 18} as const
```
当你在一个值之后使用 const 断言时，TypeScript 将为它推断出最窄的类型，没有拓宽。对于真正的常量，这通常是你想要的。当然你也可以对数组使用 const 断言：

```ts
// Type is number[]
const arr = [1, 2, 3]

// Type is readonly [1, 2, 3]
const arr1 = [1, 2, 3] as const
```

## 类型缩小 (Type Narrowing)
在 TypeScript 中，我们可以通过某些操作将变量的类型由一个较为宽泛的集合缩小到相对较小、较明确的集合，这就是 "Type Narrowing"。

比如，我们可以使用类型守卫（后面会讲到）将函数参数的类型从 any 缩小到明确的类型，具体示例如下：
```ts
let func = (anything: any) => {
  if (typeof anything === 'string') {
    return anything; // 类型是 string 
  } else if (typeof anything === 'number') {
    return anything; // 类型是 number
  }
  return null;
};
```
同样，我们可以使用类型守卫将联合类型缩小到明确的子类型，具体示例如下：

```ts
let func = (anything: string | number) => {
  if (typeof anything === 'string') {
      return anything; // 类型是 string 
  } else {
      return anything; // 类型是 number
  }
};
```
当然，我们也可以通过字面量类型等值判断（===）或其他控制流语句（包括但不限于 if、三目运算符、switch 分支）将联合类型收敛为更具体的类型，如下代码所示：

```ts
type Goods = 'pen' | 'pencil' |'ruler';
  const getPenCost = (item: 'pen') => 2;
  const getPencilCost = (item: 'pencil') => 4;
  const getRulerCost = (item: 'ruler') => 6;
  const getCost = (item: Goods) =>  {
    if (item === 'pen') {
      return getPenCost(item); // item => 'pen'
    } else if (item === 'pencil') {
      return getPencilCost(item); // item => 'pencil'
    } else {
      return getRulerCost(item); // item => 'ruler'
  }
}
```
那为什么类型由多个字面量组成的变量 item 可以传值给仅接收单一特定字面量类型的函数 `getPenCost`、`getPencilCost`、`getRulerCost `呢？这是因为在每个流程分支中，编译器知道流程分支中的 item 类型是什么。比如 item === 'pencil' 的分支，item 的类型就被收缩为“pencil”。

一般来说 `TypeScript` 非常擅长通过条件来判别类型，但在处理一些特殊值时要特别注意 —— 它可能包含你不想要的东西！例如，以下从联合类型中排除 null 的方法是错误的：

```ts
const el = document.getElementById("foo"); // Type is HTMLElement | null
if (typeof el === "object") {
  el; // Type is HTMLElement | null
}
```

因为在 JavaScript 中 typeof null 的结果是 "object" ，所以你实际上并没有通过这种检查排除 null 值。除此之外，falsy 的原始值也会产生类似的问题：
```ts
function foo(x?: number | string | null) {
  if (!x) {
    x; // Type is string | number | null | undefined\
  }
}
```
因为空字符串和 0 都属于 falsy 值，所以在分支中 x 的类型可能是 string 或 number 类型。帮助类型检查器缩小类型的另一种常见方法是在它们上放置一个明确的 “标签”：

```ts
interface UploadEvent {
  type: "upload";
  filename: string;
  contents: string;
}

interface DownloadEvent {
  type: "download";
  filename: string;
}

type AppEvent = UploadEvent | DownloadEvent;

function handleEvent(e: AppEvent) {
  switch (e.type) {
    case "download":
      e; // Type is DownloadEvent 
      break;
    case "upload":
      e; // Type is UploadEvent 
      break;
  }
}
```
这种模式也被称为 ”标签联合“ 或 ”可辨识联合“，它在 TypeScript 中的应用范围非常广。

## 联合类型 (Union Types)
联合类型表示取值可以为多种类型中的一种，使用 `|` 分隔每个类型。

```ts
let unionTypeValue: string | number;
unionTypeValue = 'Hello World';
unionTypeValue = 666;
```
联合类型通常与 `null` 和 `undefined` 一起使用：
```ts
const sayHello = (name: string | undefined) => {};
```
例如，这里 `name` 的类型是 `string | undefined` 意味着可以将 `string` 或 `undefined` 的值传递给 `sayHello` 函数。
```ts
sayHello('Christine');
sayHello(undefined);
```

::: warning 警告
当我们使用联合类型的时候，因为TypeScript不确定到底是哪一个类型，所以我们只能访问此联合类型的所有类型公用的属性和方法。
:::

```ts
// Property 'length' does not exist on type 'number'.(2339)
function getLength (value: string | number): number {
  return value.length
}

// ok
function valueToStr (value: string | number): string {
  return value.toString()
}
```

## 类型别名 (Type Aliases)
类型别名用 `type` 关键字来给一个类型起个新的名字，类型别名常用于联合类型。
```ts
type CombineType = number | string
type PeopleType = {
  age: number;
  name: string;
}
const value: CombineType = 666
const obj: PeopleType = {
  age: 18,
  name: 'Christine'
}
```

## 交叉类型（Intersection Types）
交叉类型是将多个类型合并为一个类型。 这让我们可以把现有的多种类型叠加到一起成为一种类型，它包含了所需的所有类型的特性，使用 `&` 定义交叉类型。

```ts
interface IPerson {
  id: string;
  age: number;
}

interface IWorker {
  companyId: string;
}

type IStaff = IPerson & IWorker;

const staff: IStaff = {
  id: '001',
  age: 18,
  companyId: '100'
}
```
在上面示例中，我们首先为 `IPerson` 和 `IWorker` 类型定义了不同的成员，然后通过 `&` 运算符定义了 `IStaff` 交叉类型，所以该类型同时拥有`IPerson` 和 `IWorker` 这两种类型的成员。那么现在问题来了，假设在合并多个类型的过程中，刚好出现某些类型存在相同的成员，但对应的类型又不一致，比如：

```ts
type IntersectionTypeConfict = { id: string, name: string } & { id: number, age: number }

const mixed: IntersectionTypeConfict = {
  id: 123,
  name: 'Christine',
  age: 18
}
```
上面的示例中，混入后的成员id的类型为`string & number`，即成员id的类型即是`string`类型又为`number`类型。很明显这种类型是不存在的，所以混入后成员id的类型为`never`。


如果同名属性（age）的类型兼容，比如一个是number类型，另一个是number类型的子类型（字面量类型），合并后age属性的类型就是两者中的子类型，即为数字字面量类型。
```ts
type IntersectionType = {id: string, age: 18} & {name: string, age: number}

let people: IntersectionType = {
  id: '001',
  name: 'Christine',
  age: 8 //Type '8' is not assignable to type '18'.(2322)
}

people = {
  id: '001',
  name: 'Christine',
  age: 18 //ok
}

```

如果同名属性是非基本数据类型的话，又会是什么情形。我们来看个具体的例子：
```ts
interface A {
  x:{d:true},
}
interface B {
  x:{e:string},
}
interface C {
  x:{f:number},
}
type ABC = A & B & C
let abc:ABC = {
  x:{
    d:true,
    e:'',
    f:666
  }
}

console.log(abc) 
// {
//   "x": {
//     "d": true,
//     "e": "",
//     "f": 666
//   }
// } 
```
在混入多个类型时，若存在相同的成员，且成员类型为非基本数据类型，那么是可以成功合并。

## 接口 (Interfaces)
在 TypeScript 中，我们使用接口（Interfaces）来定义对象的类型。

接口（Interfaces）是一个很重要的概念，它是对行为的抽象，而具体如何行动需要由类（classes）去实现（implement）。

::: tip
接口名一般首字母大写。
:::

```ts
interface Person {
  name: string;
  age: number
}

let personal: Person = {
  name: 'Christine',
  age: 18
}
```
在上面的栗子中，变量personal的类型是Person。那么变量的属性及属性值的类型必须和接口Person一致，变量比接口少一些属性或者多一些属性在TypeScript中都是不被允许的。
```ts
interface Person {
  name: string;
  age: number;
}

// Property 'age' is missing in type '{ name: string; }' but required in type 'Person'.(2741)
let personal: Person = {
  name: 'Christine'
};

// Type '{ name: string; age: number; favorite: string; }' is not assignable to type 'Person'.
// Object literal may only specify known properties, and 'favorite' does not exist in type 'Person'.(2322)
let personal: Person = {
  name: 'Christine',
  age: 18,
  favorite: 'apple'
}
```

### 可选 | 只读属性
```ts
interface Person {
  readonly name: string,
  age?: number
}
```
只读属性用于限制只能在对象初始化的时候赋值，不能在之后修改对象只读属性的值。

TypeScript还提供了`ReadonlyArray<T>`类型，它与`Array<T>`相似，只是去掉了所有可以改变数组的方法，因此可以确保数组创建后再也不能被修改。

```ts
let arr: ReadonlyArray<number> = [1,2,3]
arr.length = 4 //error
arr.push(4) //error
arr[0] = 5 //error
```

### 任意类型
有时候我们希望一个接口中除了包含必选和可选属性之外，还允许有其他的任意属性，这时我们可以使用 `索引签名` 的形式来满足上述要求。

```ts
interface Person {
  name: string;
  age?: number;
  [propName: string]: any;
}

let christine: Person = {
  name: 'Christine',
  age: 18,
  sex: '女'
}
```

::: tip
一旦定义了任意属性，那么必选属性和可选属性的类型都必须是它的类型的子集。
:::

```ts

// Property 'age' of type 'number | undefined' is not assignable to 'string' index type 'string'.(2411)
interface Person {
  name: string;
  age?: number;
  [propName: string]: string
}

let christine: Person = {
  name: 'Christine',
  age: 18,
  sex: '女'
}
```

上例中，任意属性的值是`string`类型，但是可选属性`age`的值是`number`类型，`number`类型不是`string`类型的子类型，所以会报错。

一个接口中只能定义一个任意属性。如果接口中有多个类型的属性，则可以在任意属性中使用联合类型：

```ts
interface Person {
  name: string;
  age?: number; // 类型是number | undefined
  [propName: string]: string | number | undefined
}

let christine: Person = {
  name: 'Christine',
  age: 18,
  sex: '女'
}
```
### 绕开额外属性检查的方式
#### 鸭式辨型法
所谓的鸭式辨型法就是`像鸭子一样走路并且嘎嘎叫的就叫鸭子`，即具有鸭子特征的认为它就是鸭子，也就是通过制定规则来判定对象是否实现这个接口。

```ts
interface Person {
  name: string;
}

function setPersonInfo(person: Person) {
  console.log(person.age)
}

let christine = { name: 'Christine', sex: '女' }

setPersonInfo(christine) //ok

// Argument of type '{ name: string; sex: string; }' is not assignable to parameter of type 'Person'.
  Object literal may only specify known properties, and 'sex' does not exist in type 'Person'.(2345)
setPersonInfo({ name: 'Christine', sex: '女' })
```

由上例说明：在参数里写对象就相当于是直接给`person`赋值，这个对象有严格的类型定义，所以不能多参或少参。而当你在外面将该对象用另一个变量`christine`接收，`christine`不会经过额外属性检查，但会根据类型推论为`let christine: { name: number; sex: string } = { name: 'Christine', sex: '女' }`，然后将这个`christine`再赋值给`person`，此时根据类型的兼容性，两种类型对象，参照鸭式辨型法，因为都具有`name`属性，所以被认定为两个相同，故而可以用此法来绕开多余的类型检查。

#### 类型断言
类型断言的意义就等同于你在告诉程序，你很清楚自己在做什么，此时程序自然就不会再进行额外的属性检查了。

```ts
interface Person {
  name: string;
  age: number; 
  sex?: string;
}

let christine: Person = {
  name: 'Christine',
  age: 18,
  sex: '女',
  eat: 'food'
} as Person
```

#### 索引签名
```ts
interface Person {
  name: string;
  age: number; 
  sex?: string;
  [propName: string]: any;
}

let christine: Person = {
  name: 'Christine',
  age: 18,
  sex: '女',
  eat: 'food'
}
```

### 接口与类型别名的区别
类型别名会给一个类型起个新名字,起别名不会新建一个类型，只是创建了一个新名字来引用那个类型。类型别名有时和接口很像，但是可以作用于原始值，联合类型，元组以及其它任何你需要手写的类型。

**Objects / Functions**
两者都可以用来描述对象或函数的类型，但是语法不同。

**Interface**
```ts
interface Point {
  x: number;
  y: number;
}

interface SetPoint {
  (x: number, y: number): void;
}
```

**Type alias**
```ts
type Point = {
  x: number;
  y: number;
};

type SetPoint = (x: number, y: number) => void;
```
**Other Types**
与接口不同，类型别名还可以用于其他类型，如基本类型（原始值）、联合类型、元组。
```ts
// primitive
type Name = string;

// object
type PartialPointX = { x: number; };
type PartialPointY = { y: number; };

// union
type PartialPoint = PartialPointX | PartialPointY;

// tuple
type Data = [number, string];

// dom
let div = document.createElement('div');
type B = typeof div;
```

**接口可以定义多次,类型别名不可以**
与类型别名不同，接口可以定义多次，会被自动合并为单个接口。
```ts
interface Point { x: number; }
interface Point { y: number; }
const point: Point = { x: 1, y: 2 };
```
**扩展**
两者的扩展方式不同，但并不互斥。接口可以扩展类型别名，同理，类型别名也可以扩展接口。

接口的扩展就是继承，通过 `extends` 来实现。类型别名的扩展就是交叉类型，通过 `&` 来实现。

* 接口扩展接口
```ts
interface Person {
  name: string;
  age: number; 
  sex?: string;
}

interface PersonA extends Person {
  money: number
}

let christine: PersonA = {
  name: 'Christine',
  age: 18,
  sex: '女',
  money: 1800
}
```
* 类型别名扩展类型别名
```ts
type Person = {
  name: string;
  age: number; 
  sex?: string;
}

type PersonA = Person & {
  money: number
}

let christine: PersonA = {
  name: 'Christine',
  age: 18,
  sex: '女',
  money: 1800
}
```
* 接口扩展类型别名
```ts
type Person = {
  name: string;
  age: number; 
  sex?: string;
}

interface PersonA extends Person{
  money: number
}

let christine: PersonA = {
  name: 'Christine',
  age: 18,
  sex: '女',
  money: 1800
}
```
* 类型别名扩展接口
```ts
interface Person {
  name: string;
  age: number; 
  sex?: string;
}

type PersonA = Person & {
  money: number
}

let christine: PersonA = {
  name: 'Christine',
  age: 18,
  sex: '女',
  money: 1800
}
```

## 泛型 (Generics)

```ts
function ha<T, U>(id: T, value: U): T {
  console.log(id)
  return id
}

ha<number, string>(123, 'hi')
ha<string, boolean>('123', true)
ha<Number, string>(123, '')
```
T 和 U 是抽象类型，只有在调用的时候才确定它的值。

除了为类型变量显式设定值之外，一种更常见的做法是使编译器自动选择这些类型，从而使代码更简洁。我们可以完全省略尖括号，比如：
```ts
function ha<T, U>(id: T, value: U): T {
  console.log(id)
  return id
}

ha(123, 'hi')
ha('123', true)
ha(123, '')
```
### 约束类型
```ts
function trace<T>(arg: T): T {
  console.log(arg.size); // Error: Property 'size doesn't exist on type 'T'
  return arg;
}
```
报错的原因在于 T 理论上是可以是任何类型的，不同于 any，你不管使用它的什么属性或者方法都会报错（除非这个属性和方法是所有集合共有的）。那么直观的想法是限定传给 trace 函数的`参数类型`应该有 size 类型，这样就不会报错了。如何去表达这个`类型约束`的点呢？实现这个需求的关键在于使用类型约束。 使用 extends 关键字可以做到这一点。简单来说就是你定义一个类型，然后让 T 实现这个接口即可。

```ts
interface Sizeable {
  size: number;
}
function trace<T extends Sizeable>(arg: T): T {
  console.log(arg.size);
  return arg;
}

trace({size: 123, age: 18})

function trace<{
    size: number;
    age: number;
}>(arg: {
    size: number;
    age: number;
}): {
    size: number;
    age: number;
}
```

## 泛型工具类型
### typeof
typeof 的主要用途是在类型上下文中获取变量或者属性的类型。
```ts
interface Person {
  name: string;
  age: number;
}
const people: Person = { name: "Christine", age: 18 };
type People = typeof people; // type People = Person

const chris: People = { name: 'hi', age: 18 }
```
在上面代码中，我们通过 `typeof` 操作符获取 people 变量的类型并赋值给 People 类型变量。

还可以对嵌套对象执行相同的操作：
```ts
const Message = {
    name: "jimmy",
    age: 18,
    address: {
      province: '四川',
      city: '成都'   
    }
}
type message = typeof Message;
/*
 type message = {
    name: string;
    age: number;
    address: {
        province: string;
        city: string;
    };
}
*/
```

此外，`typeof` 操作符除了可以获取对象的结构类型之外，它也可以用来获取函数对象的类型，比如：
```ts
function toArray(x: number): Array<number> {
  return [x];
}
type Func = typeof toArray; // -> (x: number) => number[]
```

### keyof

**`keyof` 操作符是在 TypeScript 2.1 版本引入的，该操作符可以用于获取某种类型的所有键，其返回类型是联合类型。**

```ts
const obj = { 0: 0, 1: 1, length: 3 }

type K1 = keyof typeof obj; // 0 | 1 | "length"
type K2 = keyof typeof obj[];  // number | "length" | "push" | "concat" | ...
type K3 = keyof { [x: string]: any };  // string | number
type K4 = keyof { [x: number]: any}; // number
type K5 = keyof { [x: symbol]: any}; // symbol
```
除了接口外，`keyof` 也可以用于操作类，比如：
```ts
class Person {
  name: string = "Christine";
}

let sname: keyof Person;
sname = "name";

// Type '"age"' is not assignable to type '"name"'.(2322)
sname = "age";
```
`keyof` 操作符除了支持接口和类之外，它也支持基本数据类型：
```ts
let K1: keyof boolean; // let K1: "valueOf"
let K2: keyof number; // let K2: "valueOf" | "toString" | "toFixed" | "toExponential" | "toPrecision" | "toLocaleString"
let K3: keyof symbol; // let K1: "valueOf" | "toString" | typeof Symbol.toPrimitive | typeof Symbol.toStringTag
```
此外 `keyof` 也称为输入索引类型查询，与之相对应的是索引访问类型，也称为查找类型。在语法上，它们看起来像属性或元素访问，但最终会被转换为类型：
```ts
interface Person {
  name: string;
  age: number;
  location: string;
}

type P1 = Person["name"];  // string
type P2 = Person["name" | "age"];  // string | number
type P3 = string["charAt"];  // (pos: number) => string
type P4 = string[]["push"];  // (...items: string[]) => number
type P5 = string[][0];  // string
```
**keyof 的作用**
JavaScript 是一种高度动态的语言。有时在静态类型系统中捕获某些操作的语义可能会很棘手。以一个简单的 `prop` 函数为例：
```js
function prop(obj, key) {
  return obj[key];
}
```
该函数接收 obj 和 key 两个参数，并返回对应属性的值。对象上的不同属性，可以具有完全不同的类型，我们甚至不知道 obj 对象长什么样。

那么在 TypeScript 中如何定义上面的 `prop` 函数呢？我们来尝试一下：
```ts
function prop(obj: object, key: string) {
  return obj[key];
}
```
在上面代码中，为了避免调用 prop 函数时传入错误的参数类型，我们为 obj 和 key 参数设置了类型，分别为 `{}` 和 `string` 类型。然而，事情并没有那么简单。针对上述的代码，TypeScript 编译器会输出以下错误信息：
```
Element implicitly has an 'any' type because expression of type 'string' can't be used to index type '{}'.
  No index signature with a parameter of type 'string' was found on type '{}'.(7053)
```
元素隐式地拥有 `any` 类型，因为 `string` 类型不能被用于索引 {} 类型。要解决这个问题，你可以使用以下非常暴力的方案：
```ts
function prop(obj: object, key: string) {
  return (obj as any)[key];
}
```
很明显该方案并不是一个好的方案，我们来回顾一下 `prop` 函数的作用，该函数用于获取某个对象中指定属性的属性值。因此我们期望用户输入的属性是对象上已存在的属性，那么如何限制属性名的范围呢？这时我们可以利用本文的主角 `keyof` 操作符：
```ts
function prop<T extends object, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}
```
在以上代码中，我们使用了 TypeScript 的泛型和泛型约束。**首先定义了 T 类型并使用 `extends` 关键字约束该类型必须是 object 类型的子类型，然后使用 `keyof` 操作符获取 T 类型的所有键，其返回类型是联合类型，最后利用 `extends` 关键字约束 K 类型必须为 `keyof T` 联合类型的子类型。**
```ts
type Todo = {
  id: number;
  text: string;
  done: boolean;
}

const todo: Todo = {
  id: 1,
  text: "Learn TypeScript keyof",
  done: false
}

function prop<T extends object, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

const id = prop(todo, "id"); // const id: number
const text = prop(todo, "text"); // const text: string
const done = prop(todo, "done"); // const done: boolean
```
很明显使用泛型，重新定义后的 `prop<T extends object, K extends keyof T>(obj: T, key: K)` 函数，已经可以正确地推导出指定键对应的类型。那么当访问 todo 对象上不存在的属性时，会出现什么情况？比如：
```ts
// Argument of type '"date"' is not assignable to parameter of type 'keyof Todo'.(2345)
const date = prop(todo, "date");
```
**keyof 与对象的数值属性**

在使用对象的数值属性时，我们也可以使用 keyof 关键字。**请记住，如果我们定义一个带有数值属性的对象，那么我们既需要定义该属性，又需要使用数组语法访问该属性。** 如下所示：
```ts
class ClassWithNumericProperty {
  [1]: string = "Semlinker";
}

let classWithNumeric = new ClassWithNumericProperty();
console.log(`${classWithNumeric[1]} `);
```
下面我们来举个示例，介绍一下在含有数值属性的对象中，如何使用 keyof 操作符来安全地访问对象的属性：
```ts
enum Currency {
  CNY = 6,
  EUR = 8,
  USD = 10
}

const CurrencyName = {
  [Currency.CNY]: "人民币",
  [Currency.EUR]: "欧元",
  [Currency.USD]: "美元"
};

console.log(`CurrencyName[Currency.CNY] = ${CurrencyName[Currency.CNY]}`); // CurrencyName[Currency.CNY] = 人民币
console.log(`CurrencyName[36] = ${CurrencyName[6]}`); //CurrencyName[36] = 人民币
```
为了方便用户能根据货币类型来获取对应的货币名称，我们来定义一个 getCurrencyName 函数，具体实现如下：
```ts
function getCurrencyName<K extends keyof T, T>(key: K, map: T): T[K] {
  return map[key];
}

console.log(`name = ${getCurrencyName(Currency.CNY, CurrencyName)}`); // "name = 人民币" 
```
同样，getCurrencyName 函数和前面介绍的 prop 函数一样，使用了泛型和泛型约束，从而来保证属性的安全访问。

### in
`in` 用来遍历枚举类型：
```ts
type U = {
  name: string;
  age: number;
}

type ABC = {
  [P in keyof U]: U[P]; // type ABC = { name: string; age: number; }
}
```
**代码详解**：
`[P in keyof U]`：这段代码表示遍历`U`中的每一个属性键，每次遍历时属性键取名为`P`。

### extends
`extends`关键字在TS中的两种用法，即接口继承和条件判断。

1. 接口继承
```ts
   interface T1 {
    name: string
  }
  
  interface T2 {
    sex: number
  }
  
  // 多重继承，逗号隔开
  interface T3 extends T1,T2 {
    age: number
  }
  
  // 合法
  const t3: T3 = {
    name: 'xiaoming',
    sex: 1,
    age: 18
  }
```
示例中，T1和T2两个接口，分别定义了name属性和sex属性，T3则使用extends使用多重继承的方式，继承了T1和T2，同时定义了自己的属性age，此时T3除了自己的属性外，还同时拥有了来自T1和T2的属性。

2. 条件判断
```ts
// 示例1
interface Animal {
  eat(): void
}

interface Dog extends Animal {
  bite(): void
}

// A的类型为string
type A = Dog extends Animal ? string : number

const a: A = 'this is string'
```
`extends`用来条件判断的语法和JS的三元表达是很相似，如果问号前面的判断为真，则将第一个类型string赋值给A，否则将第二个类型number赋值给A。

那么，接下来的问题就是，extends判断条件真假的逻辑是什么？

很简单，**如果extends前面的类型能够赋值给extends后面的类型，那么表达式判断为真，否则为假。**

上面的示例中，Dog是Animal的子类，父类比子类的限制更少，能满足子类，则一定能满足父类，Dog类型的值可以赋值给Animal类型的值，判断为真。

```ts
// 示例2
interface A1 {
  name: string
}

interface A2 {
  name: string
  age: number
}

// A的类型为string
type A = A2 extends A1 ? string : number

const a: A = 'this is string'
```
A1，A2两个接口，满足A2的接口一定可以满足A1，所以条件为真，A的类型取string。

**泛型用法**
* 分配条件类型
```ts
type A1 = 'x' extends 'x' ? string : number; // string
type A2 = 'x' | 'y' extends 'x' ? string : number; // number

type P<T> = T extends 'x' ? string : number;
type A3 = P<'x' | 'y'> // string | number
```
A1和A2是`extends`条件判断的普通用法，和上面的判断方法一样。

P是带参数T的泛型类型，其表达式和A1，A2的形式完全相同，A3是泛型类型P传入参数`'x' | 'y'`得到的类型，如果将`'x' | 'y'`带入泛型类的表达式，可以看到和A2类型的形式是完全一样的，那是不是说明，A3和A2的类型就是完全一样的呢？

:::tip
对于使用extends关键字的条件类型（即上面的三元表达式类型），如果extends前面的参数是一个泛型类型，当传入该参数的是联合类型，则使用分配律计算最终的结果。分配律是指，将联合类型的联合项拆成单项，分别代入条件类型，然后将每个单项代入得到的结果再联合起来，得到最终的判断结果。
:::
该例中，extends的前参为T，T是一个泛型参数。在A3的定义中，给T传入的是'x'和'y'的联合类型`'x' | 'y'`，满足分配律，于是'x'和'y'被拆开，分别代入`P<T>`

`P<'x' | 'y'> => P<'x'> | P<'y'>`

'x'代入得到

`'x' extends 'x' ? string : number => string`

'y'代入得到

`'y' extends 'x' ? string : number => number`

然后将每一项代入得到的结果联合起来，`得到string | number`

总之，满足两个要点即可适用分配律：第一，参数是泛型类型，第二，代入参数的是联合类型。
* 特殊的never
* 防止条件判断中的分配

### Infer
关键字用于条件中的类型推导

```ts
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;
```
理解为：如果 T 继承了 extends (...args: any[]) => any 类型，则返回类型 R，否则返回 any。其中 R 是什么呢？R 被定义在 extends (...args: any[]) => infer R 中，即 R 是从传入参数类型中推导出来的。

栗子：
```ts
type ArrayElementType<T> = T extends (infer E)[] ? E : T;
// type of item1 is `number`
type item1 = ArrayElementType<number[]>;
// type of item2 is `{name: string}`
type item2 = ArrayElementType<{ name: string }>;
```

item1是满足结构的，所以条件类型中的条件为true，因为 `numer[]` 匹配 `(infer E)[]`，所以返回的类型是 `E` 即为 `number` 类型。

item2不满足结构的，所以条件类型的条件为false，因为 `{name: string}` 不匹配 `(infer E)[]`，所以返回的类型是 `T` 即为 `{name: string}`。

```ts
type item3 = ArrayElementType<[number, string]>; // number | string
```
我们用多个 `infer E（(infer E)[]` 相当于 `[infer E, infer E]...` 不就是多个变量指向同一个类型代词 E 嘛）同时接收到了 `number 和 string`，所以可以理解为 `E` 时而为 `number` 时而为 `string`，所以是或关系，这就是协变。

那如果是函数参数呢？
```ts
type Bar<T> = T extends { a: (x: infer U) => void; b: (x: infer U) => void }
  ? U : never
type T21 = Bar<{ a: (x: string) => void; b: (x: number) => void }>; // string & number
```
发现结果是 `string & number`，也就是逆变。但这个例子也是同一个 `U` 时而为 `string` 时而为 `number` 呀，为什么是且的关系，而不是或呢？

其实协变或逆变与 `infer` 参数位置有关。在 TypeScript 中，**对象、类、数组和函数的返回值类型都是协变关系，而函数的参数类型是逆变关系**，所以 `infer` 位置如果在函数参数上，就会遵循逆变原则。

**逆变与协变：**
* 协变(co-variant)：类型收敛。
* 逆变(contra-variant)：类型发散。

## 索引类型
在实际开发中，我们经常能遇到这样的场景，在对象中获取一些属性的值，然后建立对应的集合。

```ts
const person = {
  name: 'Christine',
  age: 18
}

function getValues(person: any, keys: string[]) {
  return keys.map(key => person[key])
}

console.log(getValues(person, ['name', 'age'])) // ['Christine', 18]
console.log(getValues(person, ['gender'])) // [undefined]
```
在上述例子中，可以看到getValues(persion, ['gender'])打印出来的是[undefined]，但是ts编译器并没有给出报错信息，那么如何使用ts对这种模式进行类型约束呢？这里就要用到了索引类型,改造一下getValues函数，通过 `「索引类型查询」`和 `「索引访问」` 操作符：

```ts
function getValues<T, K extends keyof T>(person: T, keys: K[]): T[K][] {
  return keys.map(key => person[key]);
}

interface Person {
  name: string;
  age: number;
}

const person: Person = {
  name: 'Christine',
  age: 18
}

getValues(person, ['name']) // ['Christine']
getValues(person, ['gender']) // 报错：
// Argument of Type '"gender"[]' is not assignable to parameter of type '("name" | "age")[]'.
// Type "gender" is not assignable to type "name" | "age".
```
编译器会检查传入的值是否是Person的一部分。通过下面的概念来理解上面的代码：
```ts
T[K]表示对象T的属性K所表示的类型，在上述例子中，T[K][] 表示变量T取属性K的值的数组

// 通过[]索引类型访问操作符, 我们就能得到某个索引的类型
class Person {
    name:string;
    age:number;
 }
 type MyType = Person['name'];  //Person中name的类型为string type MyType = string
```
首先看泛型，这里有T和K两种类型，根据类型推断，第一个参数person就是person，类型会被推断为Person。而第二个数组参数的类型推断（K extends keyof T），keyof关键字可以获取T，也就是Person的所有属性名，即['name', 'age']。而extends关键字让泛型K继承了Person的所有属性名，即['name', 'age']。

## 映射类型
> 根据旧的类型创建出新的类型, 我们称之为映射类型

```ts
interface TestInterface {
  name:string,
  age:number
}
```

假设需要把上面定义的接口里面的属性全部变成可选，该怎么实现呢？

答案如下：
```ts
// 我们可以通过+/-来指定添加还是删除

type OptionalTestInterface<T> = {
  [p in keyof T]+?:T[p]
}

方法一：
type newTestInterface = OptionalTestInterface<TestInterface>

方法二：
type newTestInterface = {
  name?:string,
  age?:number
}
```

如果我们还想再加上只读属性呢？

```ts
type OptionalTestInterface<T> = {
 +readonly [p in keyof T]+?:T[p]
}

type newTestInterface = OptionalTestInterface<TestInterface>

type newTestInterface = {
  readonly name?:string,
  readonly age?:number
}
```