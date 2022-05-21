# React hooks

## useContext

一、React.createContext

```js
const MyContext = React.createContext(defaultValue);
```

创建一个 `Context` 对象。当 React 渲染一个订阅了这个 Context 对象的组件，这个组件会从组件树中离自身最近的那个匹配的 `Provider` 中读取到当前的 context 值。

只有当组件所处的树中没有匹配到 Provider 时，其 defaultValue 参数才会生效。此默认值有助于在不使用 Provider 包装组件的情况下对组件进行测试。注意：将 undefined 传递给 Provider 的 value 时，消费组件的 defaultValue 不会生效。

二、使用 useContext 获取上下文

接收一个 context 对象（React.createContext 的返回值）并返回该 context 的当前值。当前的 context 值由上层组件中距离当前组件最近的 <MyContext.Provider> 的 value prop 决定。

```js
const value = useContext(MyContext);
```

如果父子组件不在同一个目录中，如何共享 Mycontext这个 context实例呢？

一般这种情况下，我会通过 Context Manager 统一管理上下文的实例，然后通过 `export` 将实例导出，在子组件中在将实例 `import` 进来。

三、createContext 和 useContext 结合使用实现方法共享

```js
// a.jsx
const themes = {
  light: {
    foreground: "#000000",
    background: "#eeeeee"
  },
  dark: {
    foreground: "#ffffff",
    background: "#222222"
  }
};

export const ThemeContext = React.createContext(themes.light);
const App = () => {
  return (
    <ThemeContext.Provider value={themes.dark}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}
```

```js
// b.jsx
import { ThemeContext } from './a.jsx'
const Toolbar = () => {
  const theme = useContext(ThemeContext)
  return (
    <div style={{ background: theme.background, color: theme.foreground }}>
      I am styled by theme context!
    </div>
  );
}
```

## useRef

首先， 我们要实现一个需求 -- 点击 button 的时候 input 设置焦点。

### createRef API

```tsx
const FocusInput = () => {
  const inputElement = createRef();

  const handleFocusInput = () => {
    inputElement.current.focus();
  };

  return (
    <>
      <input type="text" ref={inputElement} />
      <button onClick={handleFocusInput}>Focus Input</button>
    </>
  );
};
```

同样的，我们可以使用 useRef 来实现完全相同的结果。

### useRef

```tsx
const FocusInputHook = () => {
  const inputElement = useRef();

  const handleFocusInput = () => {
    inputElement.current.focus();
  };

  return (
    <>
      <input type="text" ref={inputElement} />
      <button onClick={handleFocusInput}>Focus Input Hook</button>
    </>
  );
};
```

### createRef 与 useRef 的区别

* useRef 在 React Hooks 中的作用， 正如官网说的，它像一个变量， 类似于 this，它就像一个盒子，你可以存放任何东西。

* createRef 每次渲染都会返回一个新的引用，而 useRef 每次都会返回相同的引用。

## Error boundaries

> Error boundaries 是 React 组件，它会在其子组件树中的任何位置捕获 JavaScript 错误，并记录这些错误。

如果 class 组件定义了生命周期方法 `static getDerivedStateFromError()` 或 `componentDidCatch()` 中的任何一个（或两者），它就成为了 `Error boundaries`。通过生命周期更新 state 可让组件捕获树中未处理的 JavaScript 错误并展示降级 UI。

::: tip 注意
Error boundaries 仅捕获组件树中以下组件中的错误。但它本身的错误无法捕获。
:::

```js
class ErrorBoundary extends Component {
  state = {
    error: null,
  };

  static getDerivedStateFromError(error) {
    // 更新 state，下次渲染可以展示错误相关的 UI
    return { error: error };
  }

  componentDidCatch(error, info) {
    // 错误上报
    logErrorToMyService(error, info);
  }

  render() {
    if (this.state.error) {
      // 渲染出错时的 UI
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
```

* `static getDerivedStateFromError`: 在出错后有机会修改 state 触发最后一次错误 fallback 的渲染。
* `componentDidCatch`: 用于出错时副作用代码，比如错误上报等。
