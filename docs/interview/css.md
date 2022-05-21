# CSS 知识点

## Flex布局

### flex

> 设置了弹性项目如何增大或缩小以适应其弹性容器中可用的空间。

**属性值**：

* flex-grow：定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大
* flex-shrink：定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小
* flex-basis：给上面两个属性分配多余空间之前, 计算项目是否有多余空间, 默认值为 auto, 即项目本身的大小

**语法**：

```css
/* 关键字值 */
flex: auto;
flex: initial;
flex: none;

/* 一个值, 无单位数字: flex-grow */
flex: 2;

/* 一个值, width: flex-basis */
flex: 30px;

/* 两个值: flex-grow | flex-basis */
flex: 1 30px;

/* 两个值: flex-grow | flex-shrink */
flex: 2 2;

/* 三个值: flex-grow | flex-shrink | flex-basis */
flex: 2 2 10%;

/*全局属性值 */
flex: inherit;
flex: initial;
flex: unset;
```

* **单值语法**：值必须为以下其中之一:
  * 一个无单位数(`<number>`): 它会被当作flex:`<number> 1 0`; `<flex-shrink>`的值被假定为1，然后`<flex-basis>` 的值被假定为0。
  * 一个有效的宽度(width)值: 它会被当作 `<flex-basis>` 的值。
  * 关键字**none**：元素会根据自身宽高来设置尺寸。它是完全非弹性的：既不会缩短，也不会伸长来适应 flex 容器。相当于将属性设置为"`flex: 0 0 auto`"。
  * 关键字**auto**：元素会根据自身的宽度与高度来确定尺寸，但是会伸长并吸收 flex 容器中额外的自由空间，也会缩短自身来适应 flex 容器。这相当于将属性设置为 "`flex: 1 1 auto`"。
  * 关键字**initial**：元素会根据自身宽高设置尺寸。它会缩短自身以适应 flex 容器，但不会伸长并吸收 flex 容器中的额外自由空间来适应 flex 容器 。相当于将属性设置为"`flex: 0 1 auto`"。

* **双值语法**：第一个值必须为一个无单位数，并且它会被当作 `<flex-grow>` 的值。第二个值必须为以下之一：
  * 一个无单位数：它会被当作 `<flex-shrink>` 的值。
  * 一个有效的宽度值: 它会被当作 `<flex-basis>` 的值。

* **三值语法**：
  * 第一个值必须为一个无单位数，并且它会被当作 `<flex-grow>` 的值。
  * 第二个值必须为一个无单位数，并且它会被当作 `<flex-shrink>` 的值。
  * 第三个值必须为一个有效的宽度值， 并且它会被当作 `<flex-basis>` 的值。

栗子：

```html
<style>
  .container {
    display: flex;
    height: 300px;
    width: 400px;
  }

  .left {
    flex: 1 2 300px;
    background: red;
  }

  .right {
    flex: 2 1 200px;
    background: yellow;
  }
</style>

<div class="container">
  <div class="left"></div>
  <div class="right"></div>
</div>
```

详解：

* 因为父容器的宽度小于子容器总和的宽度，所以 left 和 right 容器将缩小以适应其弹性容器中可用的空间，left 收缩的比例为`flex-shrink的比例 * flex-basis的比例 = 2/3 * 3/5`，right 收缩的比例为`flex-shrink的比例 * flex-basis的比例 = 1/3 * 2/5`，即 left 收缩(父容器宽度 - 子容器总宽度差值的)3/4，right 收缩(父容器宽度 - 子容器总宽度差值的)1/4

![alt](/blog/flex1.jpg)
![alt](/blog/flex2.jpg)

栗子：

```html
<style>
  .container {
    display: flex;
    height: 300px;
    width: 600px;
  }

  .left {
    flex: 1 2 300px;
    background: red;
  }

  .right {
    flex: 2 1 200px;
    background: yellow;
  }
</style>

<div class="container">
  <div class="left"></div>
  <div class="right"></div>
</div>
```

![alt](/blog/flex3.jpg)
![alt](/blog/flex4.jpg)
