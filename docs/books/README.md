# JavaScript设计模式

## 什么是设计模式

设计模式是解决问题的一种思想，和语言无关。在面向对象软件设计工程中，针对特定的问题简洁优雅的一种解决方案。通俗一点的说，设计模式就是符合某种场景下某个问题的解决方案，通过设计模式可以增加代码的可重用性，可扩展性，可维护性，最终使得我们的代码高内聚、低耦合。

## 设计模式五大设计原则

* 单一职责：
  * 一个程序只需要做好一件事；
  * 如果功能过于复杂就拆分开，保证每个部分的独立。
* 开放/封闭原则：
  * 对扩展开放，对修改封闭；
  * 增加需求时，扩展新代码，而不是修改源代码。这是软件设计的终极目标。
* 里氏代换原则：
  * 子类能覆盖父类；
  * 父类能出现的地方子类也能出现。
* 接口隔离原则：
  * 保持接口的单一独立，避免出现“胖接口”。这点目前在TS中运用到；
  * 类似单一职责原则，这里更关注接口。
* 依赖倒转原则：
  * 面向接口编程，依赖于抽象而不依赖于具体；
  * 使用方只专注接口而不用关注具体类的实现。俗称“鸭子类型”。

## 设计模式的类型

> 总共有23中设计模式。这些模式可以分为三大类：创建型模式、结构型模式、行为性模式。

## 创建型模式

> 这些设计模式提供了一种在创建对象的同时隐藏创建逻辑的方式，而不是使用 new 运算符直接实例化对象。这使得程序在判断针对某个给定实例需要创建哪些对象时更加灵活。

* 创建型模式：
  * 工厂模式（Factory Pattern）
  * 抽象工厂模式（Abstract Factory Pattern）
  * 单例模式（Singleton Pattern）
  * 建造者模式（Builder Pattern）
  * 原型模式（Prototype Pattern）

## 结构型模式

> 这些设计模式关注类和对象的组合。继承的概念被用来组合接口和定义组合对象获得新功能的方式。

* 结构型模式：
  * 适配器模式（Adapter Pattern）
  * 桥接模式（Bridge Pattern）
  * 过滤器模式（Filter、Criteria Pattern）
  * 组合模式（Composite Pattern）
  * 装饰器模式（Decorator Pattern）
  * 外观模式（Facade Pattern）
  * 享元模式（Flyweight Pattern）
  * 代理模式（Proxy Pattern）

## 行为型模式

> 这些设计模式特别关注对象之间的通信。

* 行为型模式
  * 责任链模式（Chain of Responsibility Pattern）
  * 命令模式（Command Pattern）
  * 解释器模式（Interpreter Pattern）
  * 迭代器模式（Iterator Pattern）
  * 中介者模式（Mediator Pattern）
  * 备忘录模式（Memento Pattern）
  * 观察者模式（Observer Pattern）
  * 状态模式（State Pattern）
  * 空对象模式（Null Object Pattern）
  * 策略模式（Strategy Pattern）
  * 模板模式（Template Pattern）
  * 访问者模式（Visitor Pattern）
