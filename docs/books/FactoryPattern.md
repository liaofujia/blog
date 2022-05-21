# 工厂模式

## 工场模式介绍

> 所谓工厂模式就是像工厂一样重复的产生类似的产品，工厂模式只需要我们传入正确的参数，就能生产类似的产品；
> 工厂模式根据抽象程度依次分为简单工厂模式、工厂方法模式、抽象工厂模式。

## 简单工厂模式

> 又叫静态工厂方法，由一个工厂对象决定创建某一种产品对象类的实例。主要用来创建同一类对象。

### 对不同的类实例化

```js
// 篮球基类
function Basketball() {
  this.intro = '篮球流行于美国';
}
Basketball.prototype = {
  getBallsize: function(){
    console.log('篮球很大');
  }
}

// 足球基类
function Football() {
  this.intro = '足球在世界范围内很流行';
}
Football.prototype = {
  getBallsize: function(){
    console.log('足球很大');
  }
}

// 网球基类
function Tennis() {
  this.intro = '每年有很多网球系列赛';
}
Tennis.prototype = {
  getBallsize: function(){
    console.log('网球很小');
  }
}

// 运动工厂
function sportsFactory(name) {
  switch(name) {
    case 'NBA':
      return new Basketball();

    case 'wordcup':
      return new Football();

    case 'Frenchopen':
      return new Tennis();
  }
}

const basketball = sportsFactory('NBA')
console.log(basketball); // { intro: '篮球流行于美国' }
console.log(basketball.intro); // 篮球流行于美国
basketball.getBallsize(); // 篮球很大
```

### 创建相似对象 (相似东西提取，不相似的针对性处理)

> 你只需简单创建一个对象即可，然后通过对这个对象大量拓展方法和属性，并在最终将对象返回出来。

```js
// 工厂模式
function sportsFactory(name, intro, detail) {
  const o = new Object(); // 创建一个对象，并对对象拓展属性和方法

  o.intro = intro;

  o.getBallsize = function() {
    console.log(detail)
  }

  if (name === 'NBA') {
    o.nba = true;
  }

  if (name === 'wordcup') {
    o.wordcup = true;
  }

  if (name === 'Frenchopen') {
    o.frenchopen = true;
  }

  return o
}

const arr = [
  { name: 'NBA', intro: '篮球流行于美国', detail: '篮球很大'},
  { name: 'wordcup', intro: '足球在世界范围内很流行', detail: '足球很大'},
  { name: 'Frenchopen', intro: '每年有很多网球系列赛', detail: '网球很小'},
]
arr.forEach(item => {
  const { name, intro, detail } = item
  const balls = sportsFactory(name, intro, detail)
  console.log(balls);
})
执行结果如下：
{ intro: '篮球流行于美国', getBallsize: [Function (anonymous)], nba: true };
{
  intro: '足球在世界范围内很流行',
  getBallsize: [Function (anonymous)],
  wordcup: true
};
{
  intro: '每年有很多网球系列赛',
  getBallsize: [Function (anonymous)],
  frenchopen: true
}
```

**结论**：
第一种是通过类实例化对象创建的，第二种是通过创建一个新对象然后包装增强其属性和功能来实现的。他们之间的差异性也造成前面通过类创建的对象，如果这些类继承同一父类，那么他们的父类原型上的方法是可以共用的。而后面寄生方式创建的对象都是一个新的个体，所以他们的方法就不能共用了。

## 工厂方法模式

> 本意是说将实际创建对象工作推迟到子类当中。

### 安全模式类

> 可以屏蔽对类的错误使用造成的错误。

```js
function Demo() {}
Demo.prototype = {
  show: function() {
    console.log('成功获取！')
  }
}

const d = new Demo();
d.show(); // 成功获取！

const d = Demo();
d.show(); // TypeError: Cannot read property 'show' of undefined
```

解决上面报错的方式很简单，就是在构造函数开始时先判断当前对象this指代是不是类（Demo），如果是则通过new关键字创建对象，如果不是说明类在全局作用域中执行（通常情况下），那么既然在全局作用域中执行当然this就会指向window了（通常情况下，如非浏览器环境可为其他全局对象），这样我们就要重新返回新创建的对象了。

```js
function Demo() {
  if(!(this instanceof Demo)) {
    return new Demo();
  }
}
Demo.prototype = {
  show: function() {
    console.log('成功获取！')
  }
}

const d = Demo();
d.show(); // 成功获取！
```

代码详解：

```js
if (this instanceof Factory) {
  return new this[role]();
}
return new Factory(role);
当构造函数没有使用new关键字调用时不仅不能创建实例，还会声明全局变量
```

### 安全的工厂方法

```js
// 安全模式创建的工厂类
function SportsFactory(type, intro) {
  if(this instanceof SportsFactory) {
    return new this[type](intro);
  }
  return new SportsFactory(type, intro)
}

// 工厂原型中设置创建所有类型数据对象的基类
SportsFactory.prototype = {
  Basketball: function(intro) {
    this.intro = intro
  },
  Football: function(intro) {
    this.intro = intro
  },
  Tennis: function(intro) {
    this.intro = intro
  }
}

const sportsFactory = new SportsFactory('Basketball', '篮球流行于美国');
console.log(sportsFactory.intro) // 篮球流行于美国

const sportsFactory1 = SportsFactory('Basketball', '篮球流行于美国');
console.log(sportsFactory1.intro) // 篮球流行于美国
```

:::tip
不是所有的函数都可以当做箭头函数
Factory.prototype = {
  Basketball(intro) {
    this.intro = intro;
  }
}
new Basketball() // Basketball is not a constructor
:::

## 抽象工厂模式

> 通过对类的工厂抽象，使其业务用于对产品类簇的抽象，而不负责某一类产品的实例。

### 抽象工厂方法

抽象类说白了就是类的类，定义一个抽象类其实就相当于ts中定义了一个接口，然后让子类继承抽象类相当于用这个接口去约束子类。

比如化妆品可以按品牌分为很多类。

```ts
// CHANEL
function CHANEL(price, capacity) {
  this.price = price
  this.capacity = capacity
}

// Dior
function Dior(price, capacity) {
  this.price = price
  this.capacity = capacity
}

// and so on
```

如果希望给所有品牌定义一个总的Toilet类（抽象类），约束这些子类都有共同的type和两个方法。

```js
function Toilet() {
  this.type = 'toilet'
}

Toilet.prototype = {
  getPrice() {
    return new Error('抽象方法不能调用')
  },
  getCapacity() {
    return new Error('抽象方法不能调用')
  }
}
```

抽象工厂方法就可以派上用场，它的作用就是使CHANEL、Dior这些子类去继承Toilet。

首先定义抽象工厂方法以及抽象类Toilet。

```js
/**
 * subType 需要继承父类的子类
 * superType 父类的标识
/
function AbstructFactory(subType, superType){
  // 判断抽象工厂中是否有该抽象类
  if(typeof AbstructFactory[superType] === 'function') {
    // 创建过渡类F
    function F() {}

    // 将父类的实例挂载到过渡类的原型上
    F.prototype = new AbstructFactory[superType]()

    // 将过渡类的实例挂载到子类的原型上
    subType.prototype = new F()
  } else {
    return new new Error('抽象方法不能调用')
  }
}

AbstructFactory.Toilet = function() {
  this.type = 'toilet'
}
AbstructFactory.Toilet.getPrice = function() {
  return new Error('抽象方法不能调用')
}
AbstructFactory.Toilet.getCapacity = function() {
  return new Error('抽象方法不能调用')
}

// 普通CHANEL子类
function CHANEL(price, capacity) {
  this.price = price
  this.capacity = capacity
}

AbstructFactory(CHANEL, 'Toilet')

const chanel = new CHANEL(300, '50ML')
console.log(chanel.__proto__.constructor) // F() {}
```

:::tip

在最后一行console中发现一个问题，chanel实例原型对象的constructor指向的是过渡函数F，而不是其构造函数CHANEL。
:::

在抽象工厂方法中添加一行代码修正指向：

```js
function AbstructFactory(subType, superType){
  // 判断抽象工厂中是否有该抽象类
  if(typeof AbstructFactory[superType] === 'function') {
    // 创建过渡类F
    function F() {}

    // 将父类的实例挂载到过渡类的原型上
    F.prototype = new AbstructFactory[superType]()
    // 修正子类原型对象constructor的指向
    F.prototype.constructor = subType

    // 将过渡类的实例挂载到子类的原型上
    subType.prototype = new F()
  } else {
    return new new Error('抽象方法不能调用')
  }
}
```

```js
// 指向正确
console.log(chanel.__proto__.constructor) // CHANEL(price, capacity) {this.price = price;this.capacity = capacity}
```
