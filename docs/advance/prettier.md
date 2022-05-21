# Perttier配置

## Perttier使用
prettier作为开发依赖记录在package.json里，跟着项目走，版本统一，既可以使用官方的默认配置，也可以指定一套内容的配置项。适合团队协作。

## 安装依赖
```shell
npm i prettier -D
```

## 运行命令
```shell
npx prettier --write ./src/App.tsx
```

:::tip
我们也可以不指定具体文件名，直接运行`npx prettier --write .` ,表示当前目录下的所有文件都会被格式化。
:::

::: tip 注意
`prettier`默认不会处理`node_modules`里的文件，如果我们想忽略其他的文件或目录，可以在项目根目录下新建.prettierignore文件，表示忽略某些文件或文件夹，具体格式跟.gitignore类似.
:::

## Prettier配置项
首先在项目根目录新建一个`.prettierrc.js`的文件，结构如下：
```js
module.exports = {
  trailingComma: "es5",
  tabWidth: 2,
  semi: false,
  singleQuote: true,
};
```

**主要有以下项**：
* printWidth. 条件允许时每行字符长度大于该值时进行换行（prettier不会强行换行：比如将一个引号包裹的字符串折行）。默认为80
* tabWidth. 缩进空格数；默认为2
* semi. 语句末尾是否带分号
* singleQuote. 是否将双引号转换为单引号。双引号里包含单引号时不会被格式化。
* quoteProps. 对象属性引号的配置
* jsxSingleQuote. jsx文件里使用单引号
* bracketSpacing. 圆括号之间添加空格，如{ a: b }
* arrowParens. 箭头函数，参数添加圆括号，如(x)=>y
* parser. 指定解析器，我们一般不需要默认的就行
* 等等
更详细的介绍可查看文档[Perttier](https://prettier.io/docs/en/options.html)

## Git集成
目前，我们已经配置好了prettier的项，接下来就剩运行格式化的时机了，什么运行最好呢？*当然是代码提交的时候*。

我们需要在开发提交代码时，运行prettier格式化`staged`的代码，之后再提交，这就需要用到Git Hooks了，不过已经有工具帮我们集成了，我们只需安装并简单配置以下即可。 这里介绍两种：

**pre-commit**

* 安装依赖： `npm i pre-commit -D`
* 配置脚本：
```json
//package.json
{
  "scripts": {
    "prettier": "npx prettier --write ."
  },
  "pre-commit": ["prettier"]
}
```

完成安装和配置后，当开发者完成代码，执行`git add文件名或路径后`（即`stage`改变）的时候，会自动运行配置的`prettier`脚本，执行格式化，开发再将格式化后的新改变添加最后提交即可。

**lint-staged**

详细介绍请看下一遍ESlint配置的lint-staged!!!