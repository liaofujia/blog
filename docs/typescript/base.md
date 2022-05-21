# TypeScript基础

## JS的八种内置类型
```ts
let str: string = "Hello, world"
let num: number = 520
let bool: boolean = true
let big: bigint = 100n;
let u: undefined = undefined
let n: null = null
let obj: object = {age: 18}
let sym: symbol = Symbol("you")
```
:::warning 注意
bigint支持的JavaScript版本不能低于ES2020
:::

### number和bigint
```ts
let big: bigint = 100n;
let num: number = 6;
big = num //Type 'number' is not assignable to type 'bigint'.(2322)
num = big //Type 'bigint' is not assignable to type 'number'.(2322)
```

### null和undefined
:::warning 前置条件
在tsconfig.json指定`"strictNullChecks": false`
:::

`strictNullChecks`为`false`的情况下，`null`和`undefined`是所有类型的子类型。也就是说你也可以把`null`和`undefined`赋值给任意类型。
```ts
// null和undefined赋值给string
let str: string = 'hi'
str = null
str = undefined

// null和undefined赋值给number
let num:number = 520;
num = null
num= undefined

// null和undefined赋值给object
let obj:object ={};
obj = null
obj= undefined

// null和undefined赋值给Symbol
let sym: symbol = Symbol("me"); 
sym = null
sym= undefined

// null和undefined赋值给boolean
let isDone: boolean = false;
isDone = null
isDone= undefined

// null和undefined赋值给bigint
let big: bigint =  100n;
big = null
big= undefined
```
:::tip
如果你在tsconfig.json指定`"strictNullChecks": true`，`null`只能赋值给`any`和`null`，`undefined`能赋值给`any`、`void`和`undefined`。
:::

栗子🌰
```ts
let val1: void;
let val2: null = null;
let val3: undefined = undefined;
let val4: void;
let val5: any = null
let val6: any = undefined

val1 = val2; //Type 'null' is not assignable to type 'void'.(2322)
val1 = val3;
val1 = val4;
```

## void
`void`表示没有任何类型，和其他类型是平等关系，不能直接赋值：

```ts
let a: void; 
let b: number = a; //Type 'void' is not assignable to type 'number'.(2322)
```

在tsconfig.json指定`"strictNullChecks": false`，只能将`null`和`undefined`赋值给`void`类型的变量。
```ts
let val1: void;
let val2: null = null;
let val3: undefined = undefined;

val1 = val2;
val1 = val3;
```

::: tip 注意
方法没有返回值将得到`undefined`， 但是我们需要定义成void类型，而不是undefined类型。
:::
```ts
// A function whose declared type is neither 'void' nor 'any' must return a value.
function add(): undefined {
    console.log('hello')
}
```

## any
在 TypeScript 中，任何类型都可以被归为 any 类型。这让 any 类型成为了类型系统的顶级类型.

如果是一个number类型，在赋值过程中改变类型是不被允许的：

```ts
let tsNumber: number = 123
tsNumber = '123'
```
但如果是 any 类型，则允许被赋值为任意类型。

```ts
let a: any = 666;
a = "Semlinker";
a = false;
a = 66
a = undefined
a = null
a = []
a = {}
```

如果我们定义了一个变量，没有指定其类型，也没有初始化，那么它默认为any类型：

```ts
// 以下代码是正确的，编译成功
let value
value = 520
value = '520'
```

## never
`never`类型表示的是那些永不存在的值的类型。

值会永不存在的两种情况：
* 如果一个函数执行时抛出了异常，那么这个函数永远不存在返回值（因为抛出异常会直接中断程序运行，这使得程序运行不到返回值那一步，即具有不可达的终点，也就永不存在返回了）；
* 函数中执行无限循环的代码（死循环），使得程序永远无法运行到函数返回值那一步，永不存在返回。
  
```ts
function err(msg: string): never { // OK
  throw new Error(msg); 
  let run = '永远执行不到'
}

// 死循环
function loopForever(): never { // OK
  while (true) {
  };
  let run = '永远执行不到'
} 
```
`never`类型不是任何类型的子类型，也不能赋值给任何类型。

在 TypeScript 中，可以利用 never 类型的特性来实现全面性检查，具体示例如下：
```ts
type Foo = string | number;

function controlFlowAnalysisWithNever(foo: Foo) {
  if (typeof foo === "string") {
    // 这里 foo 被收窄为 string 类型
  } else if (typeof foo === "number") {
    // 这里 foo 被收窄为 number 类型
  } else {
    // foo 在这里是 never
    const check: never = foo;
  }
}
```
注意在 else 分支里面，我们把收窄为 `never` 的 foo 赋值给一个显示声明的 `never` 变量。如果一切逻辑正确，那么这里应该能够编译通过。但是假如后来有一天修改了 Foo 的类型：
```ts
type Foo = string | number | boolean;
```
然而忘记同时修改 `controlFlowAnalysisWithNever` 方法中的控制流程，这时候 else 分支的 foo 类型会被收窄为 `boolean` 类型，导致无法赋值给 `never` 类型，这时就会产生一个编译错误。通过这个方式，我们可以得出一个结论：使用 `never` 避免出现新增了联合类型没有对应的实现，目的就是写出类型绝对安全的代码。

::: tip 注意
如果一个联合类型中存在never，那么实际的联合类型并不会包含never。
:::
```ts
// 'name' | 'age'
type test = 'name' | 'age' | never

```
## unknown
就像所有类型都可以被归为 `any`，所有类型也都可以被归为 `unknown`。这使得 `unknown` 成为 TypeScript 类型系统的另一种顶级类型（另一种是 `any`）。

`unknown`与`any`的最大区别是： 任何类型的值可以赋值给`any`，同时`any`类型的值也可以赋值给任何类型。任何类型的值都可以赋值给`unknown` ，但`unknown` 只能赋值给`unknown`和`any`
```ts
let notSure: unknown = 4
let unk: unknown = true
let sure: any = 'hh'
sure = notSure
notSure = sure
notSure = unk
notSure = 'heel'
notSure = Symbol()
notSure = {}
notSure = []
let num: void
num = notSure //Type 'unknown' is not assignable to type 'void'.(2322)
```
如果不缩小类型，就无法对`unknown`类型执行任何操作：
```ts
function getDog() {
 return '123'
}
 
const dog: unknown = {hello: getDog};
dog.hello(); // Object is of type 'unknown'.(2571)
```

这是 `unknown` 类型的主要价值主张：TypeScript 不允许我们对类型为 unknown 的值执行任意操作。相反，我们必须首先执行某种类型检查以缩小我们正在使用的值的类型范围。

这种机制起到了很强的预防性，更安全，这就要求我们必须缩小类型，我们可以使用`typeof`、` instanceof `、`类型断言`等方式来缩小未知范围：

```ts
function getDogName() {
 let x: unknown;
 return x;
};
const dogName = getDogName();
// 直接使用
const upName = dogName.toLowerCase(); // Error
// typeof
if (typeof dogName === 'string') {
  const upName = dogName.toLowerCase(); // OK
}
// 类型断言 
const upName = (dogName as string).toLowerCase(); // OK
```

## Array
对数组的定义有两种：
* 类型＋[]
```ts
let arr:string[] = ['hello', 'world']
```
* 泛型
```ts
let arr2: Array<string> = ['hello','world']
```

定义联合类型的数组
```ts
let arr: (number | string)[];
arr = [0,'hi', 1, 'world']
```
在数组中不仅可以存储基础数据类型，还可以存储对象类型，如果需要存储对象类型，可以用如下方式进行定义：
```ts
// 只允许存储对象仅有name和age，且name为string类型，age为number类型的对象
let objArray: ({ name: string, age: number })[] = [
  { name: 'AAA', age: 23 }
]
```
对象类型可以使用interface定义
```ts
interface ObjArray {
  name: string;
  age: number
}

// 对象+[]的写法
let objArray: ObjArray[] = [
  { name: 'AAA', age: 23 }
]
// 泛型的写法
let objArray: Array<ObjArray> = [
  { name: 'AAA', age: 23 }
]
```
为了更加方便的撰写代码，我们可以使用类型别名的方式来管理以上类型：
```ts
type ObjArray = {
  name: string;
  age: number
}

// 对象+[]的写法
let objArray: ObjArray[] = [
  { name: 'AAA', age: 23 }
]
// 泛型的写法
let objArray: Array<ObjArray> = [
  { name: 'AAA', age: 23 }
]
```
## Tuple(元组)
### 元组定义
众所周知，数组一般由同种类型的值组成，但有时我们需要在单个变量中存储不同类型的值，这时候我们就可以使用元组。在 JavaScript 中是没有元组的，元组是 TypeScript 中特有的类型，其工作方式类似于数组。

元组最重要的特性是可以限制 `数组元素的个数和类型` ，它特别适合用来实现多值返回。

元组用于保存定长定数据类型的数据
```ts
let x: [string, number]; 
// 类型必须匹配且个数必须为2

x = ['hello', 10]; // OK 
x = ['hello', 10,10]; // Error 
x = [10, 'hello']; // Error
```
:::tip 注意
元组类型只能表示一个已知元素数量和类型的数组，长度已指定，越界访问会提示错误。如果一个数组中可能有多种类型，数量和类型都不确定，那就直接any[]
:::
### 元组类型的解构赋值
我们可以通过下标的方式来访问元组中的元素，当元组中的元素较多时，这种方式并不是那么便捷。其实元组也是支持解构赋值的：
```ts
let tupleArr: [number, string] = [520, "Christine"];
let [id, username] = tupleArr;
console.log(id); //520
console.log(username); //Christine
```
```ts
let tupleArr: [number, string] = [520, "Christine"];
let [id, username, age] = tupleArr; //Error
```
:::tip 注意
在解构赋值时，如果解构数组元素的个数超过元组中元素的个数，会报错。
:::

### 元组类型的可选元素
```ts
let tupleArr: [string, boolean?];
tupleArr = ['hi', true]
tupleArr = ['hi']
```
在上面代码中，我们定义了一个名为 `tupleArr` 的变量，该变量的类型要求包含一个必须的字符串属性和一个可选布尔属性。
那么在实际工作中，声明可选的元组元素有什么作用？这里我们来举一个例子，在三维坐标轴中，一个坐标点可以使用 `(x, y, z) `的形式来表示，对于二维坐标轴来说，坐标点可以使用 `(x, y)` 的形式来表示，而对于一维坐标轴来说，只要使用 `(x)` 的形式来表示即可。针对这种情形，在 TypeScript 中就可以利用元组类型可选元素的特性来定义一个元组类型的坐标点，具体实现如下：
```ts
type Point = [number, number?, number?];

const x: Point = [10]; // 一维坐标点
const xy: Point = [10, 20]; // 二维坐标点
const xyz: Point = [10, 20, 10]; // 三维坐标点

console.log(x.length); // 1
console.log(xy.length); // 2
console.log(xyz.length); // 3
```
### 元组类型的剩余元素
元组类型里最后一个元素可以是剩余元素，形式为 `...X`，这里 `X` 是数组类型。剩余元素代表元组类型是开放的，可以有零个或多个额外的元素。 例如，[number, ...string[]] 表示带有一个 `number` 元素和任意数量`string` 类型元素的元组类型。为了能更好的理解，我们来举个具体的例子：
```ts
type RestTupleType = [number, ...string[]];
let restTuple: RestTupleType = [666, "Semlinker", "Kakuqo", "Lolo"];
console.log(restTuple[0]); //666
console.log(restTuple[1]); //Semlinker
```
### 只读的元组类型
TypeScript 3.4 还引入了对只读元组的新支持。我们可以为任何元组类型加上 `readonly` 关键字前缀，以使其成为只读元组。具体的示例如下：
```ts
const point: readonly [number, number] = [10, 20];
```
在使用 `readonly` 关键字修饰元组类型之后，任何企图修改元组中元素的操作都会抛出异常：
```ts
// Cannot assign to '0' because it is a read-only property.
point[0] = 1;
// Property 'push' does not exist on type 'readonly [number, number]'.
point.push(0);
// Property 'pop' does not exist on type 'readonly [number, number]'.
point.pop();
// Property 'splice' does not exist on type 'readonly [number, number]'.
point.splice(1, 1);
```

## 函数
在JavaScript中，定义函数有三种表现形式：
* 函数声明。
* 函数表达式。
* 箭头函数
```js
// 函数声明
function func1 () {
  console.log('Hello, world')
}
// 函数表达式
const func2 = function () {
  console.log('Hello, world')
}
// 箭头函数
const func3 = () => {
  console.log('Hello, world')
}
```
如果函数有参数，则必须在`TypeScript`中为其定义具体的类型：
```ts
function sum(a: number, b:number): number {
  return a + b
}
console.log(sum(1, 2))    // 输出3
console.log(sum(1, '2'))  // 报错
```
### 用接口定义函数类型
```ts
interface SumType {
  (x: number, y: number): number
}
const sum: SumType = function (x: number, y: number): number {
  return x + y
}
console.log(sum(1, 2))    // 输出3
```
采用函数表达式接口定义函数的方式时，对等号左侧进行类型限制，可以保证以后对函数名赋值时保证参数的个数、参数类型、返回值类型不变。
```ts
sum = function (a: number, b: number): number {
  return a + b
}
```
### 可选参数
```ts
function familyName(firstName: string, lastName?: string) {
  if (lastName) {
    return firstName + ' ' + lastName;
  } else {
    return firstName;
  }
}

console.log(familyName('Christine', 'Tang')) //Christine Tang
console.log(familyName('Christine')) //Christine
```
:::tip
可选参数必须放在最后一个位置，否则会报错。
:::
```ts
// 编辑报错 
function buildName(firstName: string, lastName?: string, _abc: number) {
  if (lastName) {
    return firstName + ' ' + lastName;
  } else {
    return firstName;
  }
}
```
在`JavaScript`中，函数允许我们给参数设置默认值，因此另外一种处理可选参数的方式是: 为参数提供一个默认值，此时TypeScript将会把该参数识别为可选参数：
```ts
function getArea (a: number, b: number = 1): number {
  return  a * b
}
console.log(getArea(4))     // 4
console.log(getArea(4, 5))  // 20
```
:::tip
给一个参数设置了默认值后，就不再受`TypeScript`可选参数必须在最后一个位置的限制了。
:::
```ts
function getArea (b: number = 1, a: number): number {
  return  a * b
}
// 此时必须显示的传递一个undefined进行占位
console.log(getArea(undefined,4)) // 4
console.log(getArea(4, 5))        // 20
```
### 剩余参数
```ts
function push(array: Array<number>, ...items: any[]) {
    items.forEach(function(item) {
        array.push(item);
    });
}
let arr = [0];
push(arr, 1, 2, 3);
console.log(arr) //[0, 1, 2, 3] 
```

### 函数重载
> 函数重载或方法重载是使用相同名称和不同参数数量或类型创建多个方法的一种能力。

由于 JavaScript 是一个动态语言，我们通常会使用不同类型的参数来调用同一个函数，该函数会根据不同的参数而返回不同的类型的调用结果：
```ts
function add(x, y) {
 return x + y;
}
add(1, 2); // 3
add("1", "2"); //"12"
```
由于 TypeScript 是 JavaScript 的超集，因此以上的代码可以直接在 TypeScript 中使用，但当 tsconfig.json中指定 `"noImplicitAny": true` 的配时，以上代码会提示以下错误信息：
```ts
Parameter 'x' implicitly has an 'any' type.
Parameter 'y' implicitly has an 'any' type.
```
该信息告诉我们参数 x 和参数 y 隐式具有 `any` 类型。为了解决这个问题，我们可以为参数设置一个类型。因为我们希望 `add` 函数同时支持 `string` 和 `number` 类型，因此我们可以定义一个 `string | number` 联合类型，同时我们为该联合类型取个别名：
```ts
type Combinable = string | number;
```
在定义完 Combinable 联合类型后，我们来更新一下 `add` 函数：
```ts
type Combinable = string | number;
function add(x:Combinable, y: Combinable): Combinable {
  if(typeof x === 'number' && typeof y === "number") {
    return x + y;
  }
  return String(x) + String(y)
}
console.log(add(1, 2)) // 3
console.log(add("1", "2")) //"12"
```
为 `add` 函数的参数显式设置类型之后，之前错误的提示消息就消失了。那么此时的 `add` 函数就完美了么，我们来实际测试一下：
```ts
const result = add('Semlinker', ' Kakuqo');
result.split(' ');
```
在上面代码中，我们分别使用 `Semlinker` 和 `Kakuqo` 这两个字符串作为参数调用 add 函数，并把调用结果保存到一个名为 `result` 的变量上，这时候我们想当然的认为此时 result 的变量的类型为 string，所以我们就可以正常调用字符串对象上的 `split` 方法。但这时 TypeScript 编译器又出现以下错误信息了：
```ts
Property 'split' does not exist on type 'number'.
```
很明显 `number` 类型的对象上并不存在 `split` 属性。问题又来了，那如何解决呢？这时我们就可以利用 TypeScript 提供的函数重载特性。
```ts
type Combinable = string | number;
// 函数声明
function add(a: number, b: number): string;
function add(a: string, b: string): string;
function add(a: string, b: number): string;
function add(a: number, b: string): string;

//函数实现
function add(a: Combinable, b: Combinable) {
  if (typeof a === 'number' || typeof b === 'number') {
    return a.toString() + ' ' + b.toString();
  }
  return a + b;
}
const result = add(1, '3');
console.log(result.split(' ')) // ['1', '3']
```
:::tip
在有函数重载时，会优先从第一个进行逐一匹配，因此如果重载函数有包含关系，应该将最精准的函数定义写在最前面。
:::

## Number、String、Boolean、Symbol
首先，我们来回顾一下初学 TypeScript 时，很容易和原始类型 number、string、boolean、symbol 混淆的首字母大写的 Number、String、Boolean、Symbol 类型，后者是相应原始类型的`包装对象`，姑且把它们称之为对象类型。

从类型兼容性上看，原始类型兼容对应的对象类型，反过来对象类型不兼容对应的原始类型。

```ts
let num: number = 3;
let Num: Number = Number(4);
Num = num; // ok
num = Num; // ts(2322)报错
```
在示例中的第 3 行，我们可以把 number 赋给类型 Number，但在第 4 行把 Number 赋给 number 就会提示 ts(2322) 错误。

::: tip
我们需要铭记不要使用对象类型来注解值的类型，因为这没有任何意义。
:::

## object、Object 和 {}
小 object 代表的是引用类型，也就是说我们不能把 number、string、boolean、symbol等 原始类型赋值给 object。在严格模式下，null 和 undefined 类型也不能赋给 object。
```ts
let lowerCaseObject: object;
lowerCaseObject = 1; // ts(2322)
lowerCaseObject = 'a'; // ts(2322)
lowerCaseObject = true; // ts(2322)
lowerCaseObject = null; // ts(2322)
lowerCaseObject = undefined; // ts(2322)
lowerCaseObject = {}; // ok
```
大Object 代表所有拥有 toString、hasOwnProperty 方法的类型，所以所有原始类型、引用类型都可以赋给 Object。同样，在严格模式下，null 和 undefined 类型也不能赋给 Object。
```ts
let upperCaseObject: Object;
upperCaseObject = 1; // ok
upperCaseObject = 'a'; // ok
upperCaseObject = true; // ok
upperCaseObject = null; // ts(2322)
upperCaseObject = undefined; // ts(2322)
upperCaseObject = {}; // ok
```
{}空对象类型和大 Object 一样，也是表示原始类型和引用类型的集合，并且在严格模式下，null 和 undefined 也不能赋给 {} ，如下示例：
```ts
let ObjectLiteral: {};
ObjectLiteral = 1; // ok
ObjectLiteral = 'a'; // ok
ObjectLiteral = true; // ok
ObjectLiteral = null; // ts(2322)
ObjectLiteral = undefined; // ts(2322)
ObjectLiteral = {}; // ok
```
综上结论：{}、大 Object 是比小 object 更宽泛的类型（least specific），{} 和大 Object 可以互相代替，用来表示原始类型（null、undefined 除外）和引用类型；而小 object 则表示引用类型。

## 类型推断
在 TypeScript 中，具有初始化值的变量、有默认值的函数参数、函数返回的类型都可以根据上下文推断出来。比如我们能根据 return 语句推断函数返回的类型，如下代码所示：
```ts
/** 根据参数的类型，推断出返回值的类型也是 number */
function add1(a: number, b: number) {
  return a + b;
}
const x1= add1(1, 1); // 推断出 x1 的类型也是 number

/** 推断参数 b 的类型是数字或者 undefined，返回值的类型也是数字 */
function add2(a: number, b = 1) {
  return a + b;
}
const x2 = add2(1);
const x3 = add2(1, '1'); // ts(2345) Argument of type "1" is not assignable to parameter of type 'number | undefined
```
如果定义的时候没有赋值，不管之后有没有赋值，都会被推断成 `any` 类型而完全不被类型检查：
```ts
let myFavoriteNumber;
myFavoriteNumber = 'seven';
myFavoriteNumber = 7;
```

## 类型断言
```ts
const arrayNumber: number[] = [1, 2, 3, 4];
const greaterThan2: number = arrayNumber.find(num => num > 2); // 提示 ts(2322)
```
其中，greaterThan2 一定是一个数字（确切地讲是 3），因为 arrayNumber 中明显有大于 2 的成员，但静态类型对运行时的逻辑无能为力。

在 TypeScript 看来，greaterThan2 的类型既可能是数字，也可能是 undefined，所以上面的示例中提示了一个 ts(2322) 错误，此时我们不能把类型 undefined 分配给类型 number。

不过，我们可以使用一种笃定的方式——类型断言（类似仅作用在类型层面的强制类型转换）告诉 TypeScript 按照我们的方式做类型检查。

```ts
const arrayNumber: number[] = [1, 2, 3, 4];
const greaterThan2: number = arrayNumber.find(num => num > 2) as number;
```
### 非空断言
在上下文中当类型检查器无法断定类型时，一个新的后缀表达式操作符` ! `可以用于断言操作对象是非 `null` 和非 `undefined` 类型。**具体而言，x! 将从 x 值域中排除 null 和 undefined** 。

```ts
let mayNullOrUndefinedOrString: null | undefined | string;
mayNullOrUndefinedOrString!.toString(); // ok
mayNullOrUndefinedOrString.toString(); // ts(2531)
```

```ts
type NumGenerator = () => number;

function myFunc(numGenerator: NumGenerator | undefined) {
  // Object is possibly 'undefined'.(2532)
  // Cannot invoke an object which is possibly 'undefined'.(2722)
  const num1 = numGenerator(); // Error
  const num2 = numGenerator!(); //OK
}
```

### 确定赋值断言
允许在实例属性和变量声明后面放置一个 `!` 号，从而告诉 TypeScript 该属性会被明确地赋值。为了更好地理解它的作用，我们来看个具体的例子：
```ts
let x: number;
initialize();

// Variable 'x' is used before being assigned.(2454)
console.log(2 * x); // Error
function initialize() {
  x = 10;
}
```
很明显该异常信息是说变量 x 在赋值前被使用了，要解决该问题，我们可以使用确定赋值断言：
```ts
let x!: number;
initialize();

// Variable 'x' is used before being assigned.(2454)
console.log(2 * x); // Error
function initialize() {
  x = 10;
}
```

## 字面量类型
在 TypeScript 中，字面量不仅可以表示值，还可以表示类型，即所谓的字面量类型。

目前，TypeScript 支持 3 种字面量类型：字符串字面量类型、数字字面量类型、布尔字面量类型，对应的字符串字面量、数字字面量、布尔字面量分别拥有与其值一样的字面量类型，具体示例如下：

```ts
let specifiedStr: 'this is string' = 'this is string';
let specifiedNum: 1 = 1;
let specifiedBoolean: true = true;
```
比如 'this is string' （这里表示一个字符串字面量类型）类型是 string 类型（确切地说是 string 类型的子类型），而 string 类型不一定是 'this is string'（这里表示一个字符串字面量类型）类型，如下具体示例：

```ts
let specifiedStr: 'this is string' = 'this is string';
let str: string = 'any string';
specifiedStr = str; // ts(2322) 类型 '"string"' 不能赋值给类型 'this is string'
str = specifiedStr; // ok 
```

### 字符串字面量类型
一般来说，我们可以使用一个字符串字面量类型作为变量的类型，如下代码所示：
```ts
let hello: 'hello' = 'hello';
hello = 'hi'; // ts(2322) Type '"hi"' is not assignable to type '"hello"'
```
实际上，定义单个的字面量类型并没有太大的用处，它真正的应用场景是可以把多个字面量类型组合成一个联合类型（后面会讲解），用来描述拥有明确成员的实用的集合。
```ts
type eventName = 'click' | 'scroll' | 'mousemove'
function handleEvent (event: eventName) {
  console.log(event)
}
handleEvent('click')    // click
handleEvent('scroll')   // scroll
handleEvent('dbclick')  // Argument of type '"dbclick"' is not assignable to parameter of type 'eventName'.(2345)
```
通过使用字面量类型组合的联合类型，我们可以限制函数的参数为指定的字面量类型集合，然后编译器会检查参数是否是指定的字面量类型集合里的成员。

### 数字字面量类型及布尔字面量类型
数字字面量类型和布尔字面量类型的使用与字符串字面量类型的使用类似，我们可以使用字面量组合的联合类型将函数的参数限定为更具体的类型，比如声明如下所示的一个类型 Config：

```ts
interface Config {
  size: 'small' | 'big';
  isEnable:  true | false;
  margin: 0 | 2 | 4;
}
```
在上述代码中，我们限定了 size 属性为字符串字面量类型 'small' | 'big'，isEnable 属性为布尔字面量类型 true | false（布尔字面量只包含 true 和 false，true | false 的组合跟直接使用 boolean 没有区别），margin 属性为数字字面量类型 0 | 2 | 4。

### let和const分析
**const**
```ts
const str = 'hello world'; // str: 'hello world'
const num = 1; // num: 1
const bool = true; // bool: true
const arr = [1, 2]; // arr: number[]
const arr = [1, '3', true]; // arr: (number | string | boolean)[]
```
在上述代码中，我们将 const 定义为一个不可变更的常量，在缺省类型注解的情况下，TypeScript 推断出它的类型直接由赋值字面量的类型决定，这也是一种比较合理的设计。

**let**
```ts
let str = 'this is string'; // str: string
let num = 1; // num: number
let bool = true; // bool: boolean
```
这种设计符合编程预期，意味着我们可以分别赋予 str 和 num 任意值（只要类型是 string 和 number 的子集的变量）：

```ts
str = 'any string';
num = 2;
bool = false;
```