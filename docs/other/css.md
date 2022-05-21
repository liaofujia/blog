# css常见问题

## less文件引入

::: tip 注意
在less文件中使用@import引用src内的文件时需要这样引入，因为 `CSS loader` 会把非根路径的url解释为相对路径， 加~前缀才会解释成模块路径。
:::
a.less 文件中引入公共文件 b.less

* 使用@import引入文件
* 语句末尾要加; 否则会报错

```less
@import '../../config';

@import "~@/assets/style/_mixin";

.ceshi{
  //文件引入后可以直接使用公共变量
  color: @themeColor;
}
```

## box-shadow

> `box-shadow`: h-shadow, v-shadow, blur, spread, color, inset;

::: details 属性值详细介绍
h-shadow：必需的。水平阴影的位置。允许负值
v-shadow：必需的。垂直阴影的位置。允许负值
blur：可选。模糊距离
spread：可选。阴影的大小
color：可选。阴影的颜色。
inset可选。默认外侧阴影，写入inset后默认内侧阴影。
:::

```css
设置左边阴影：
box-shadow：10px 0px 8px -8px darkgrey;

设置右边阴影
box-shadow：-6px 0px 5px -5px darkgrey;

设置上方阴影：
box-shadow：0px 6px 5px -5px darkgrey;

设置下方阴影：
box-shadow：0px -8px 5px -5px darkgrey;
```

## 修改光标颜色

```css
input{
  caret-color: red;
}
```

## css文字垂直居中

1. 使用`line-height`属性使文字垂直居中

```css
.box{
  width: 300px;
  height: 300px;
  background: #ddd;
  line-height:300px;
}
```

2. 将外部块格式化为表格单元格

```css
.box{
  width: 400px;
  height: 200px;
  background: #ddd;
  display: table-cell;
  vertical-align: middle;
}
```

3. flex布局

```css
.box{
  width: 300px;
  height: 200px;
  background: #ddd;
  display: flex;
  align-items: center;
}
```

## svg

1. 修改大小：在 `svg` 标签中修改`width`、`height` 属性（默认单位是px）

2. 修改颜色：在 `path` 标签中修改 `fill` 属性，值可以是 `currentValue` 或 `颜色值`

## 自定义滚动条样式

```less
/*定义滚动条样式*/
::-webkit-scrollbar {
  width: 4px;
}

/*定义滑块*/
::-webkit-scrollbar-thumb {
  background: #d8dfeb;
  cursor: pointer;
}

/*定义滚动条轨道*/
::-webkit-scrollbar-track {
  background-color: transparent;
}

/*定义水平方向滚动条样式*/
::-webkit-scrollbar:horizontal {
  height: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: @text-placeholder-color;
}
```

## 解决滚动条scrollbar出现造成的页面宽度被挤压的问题

```css
overflow-y: overlay;
```
