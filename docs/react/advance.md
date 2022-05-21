# React 进阶

## 虚拟DOM实现原理

![alt](/blog/vdom.png)

按照图中的流程，我们依次来分析`虚拟DOM`的实现原理。

### JSX和createElement

我们在实现一个`React`组件时可以选择两种编码方式

* 第一种是使用`JSX`编写：

```jsx
class Hello extends Component {
  render() {
    return <div>Hello Christine</div>;
  }
}
```

* 第二种是直接使用`React.createElement`编写：

```js
class Hello extends Component {
  render() {
    return React.createElement('div', null, `Hello Christine`);
  }
}
```

实际上，上面两种写法是等价的，`JSX`只是为 `React.createElement(component, props, ...children)`方法提供的语法糖。也就是说所有的`JSX`代码最后都会转换成`React.createElement(...)`，`Babel`帮助我们完成了这个转换的过程。

如下面的`JSX`

```jsx
<div>
  <img src="avatar.png" className="profile" />
  <Hello />
</div>
```

将会被`Babel`转换为

```js
React.createElement("div", null, React.createElement("img", {
  src: "avatar.png",
  className: "profile"
}), React.createElement(Hello, null));
```

:::tip
`babel`在编译时会判断`JSX`中组件的首字母，当首字母为小写时，其被认定为原生`DOM`标签，`createElement`的第一个变量被编译为字符串；当首字母为大写时，其被认定为自定义组件，`createElement`的第一个变量被编译为对象；
:::

另外，由于`JSX`提前要被`Babel`编译，所以`JSX`是不能在运行时动态选择类型的，比如下面的代码：

```jsx
function Story(props) {
  // Wrong! JSX type can't be an expression.
  return <components[props.storyType] story={props.story} />;
}
```

需要变成下面的写法：

```jsx
function Story(props) {
  // Correct! JSX type can be a capitalized variable.
  const SpecificStory = components[props.storyType];
  return <SpecificStory story={props.story} />;
}
```

所以，使用`JSX`你需要安装`Babel`插件`babel-plugin-transform-react-jsx`

```js
{
  "plugins": [
    ["transform-react-jsx", {
      "pragma": "React.createElement"
    }]
  ]
}
```

### 创建虚拟DOM

下面我们来看看虚拟`DOM`的真实模样，将下面的`JSX`代码在控制台打印出来：

```jsx
<div className="title">
  <span>Hello Christine</span>
  <ul>
    <li>苹果</li>
    <li>橘子</li>
  </ul>
</div>
```

![alt](/blog/vdom2.jpg)
