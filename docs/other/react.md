# React常见问题

## useState

```tsx
interface IObject {
  num: number;
}

第一种写法
const [count, setCount] = useState<IObject | null>(null);

第二种写法
const [count, setCount] = useState<IObject>({} as IObject);

第三种写法
const [count, setCount] = useState<IObject>({num: 0});
```

:::tip
如果没有初始值,那么可以使用联合属性将初始值设置为null，例如`<number | null>`，但是在这里需要注意，后续使用state的时候需要进行空值判断,通常使用可选链来进行访问 a?.b -> a && a.b
:::

## useRef

```ts
const inputEl = useRef<HTMLInputElement>(null);
  const onButtonClick = () => {
    if (inputEl.current) {
      inputEl.current.focus()  // Works!
    }
    // ref?.current?.focus()
    // inputEl.current!.focus() 或者用这种写法也可以解决编译报错的问题
  };
```

## 设置source-map后在chrome中仍无法显示webpack://的问题

需要勾选下图圈起来的选项

![alt](/blog/sourceMap.jpg)
