# ESLint配置
:::tip
前置条件：vscode安装并开启`eslint`插件
:::
## 安装eslint及依赖包
```shell
{
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^5.6.0",
    "@typescript-eslint/parser": "^5.8.1",
    "eslint": "^8.3.0",
    "eslint-config-airbnb": "^19.0.2", // Airbnb的标准（配置文件中的extends里没有用Airbnb的话可以不装）
    "eslint-plugin-import": "^2.25.3", // Airbnb标准必需
    "eslint-plugin-jsx-a11y": "^6.5.1", // Airbnb标准必需，用来校验import的，比如不能添加后缀 .js
    "eslint-config-prettier": "^8.3.0",
    "eslint-import-resolver-typescript": "^2.5.0",
    "eslint-plugin-react": "^7.28.0", // 支持react语法
  }
}
```

## 配置.eslintrc.js
rules规则说明：

* "off" 或 0：关闭规则
* "warn" 或 1：开启规则，使用警告级别的提示（程序不会奔溃）
* "error" 或 2：开启规则，使用错误级别的提示（触发时，程序会奔溃）

```js
module.exports = {
    // 指定脚本的运行环境，一个环境定义了一组预定义的全局变量
    env: {
        "browser": true, //浏览器环境中的全局变量
        "es6": true, //启用除了modules以外的所有ES6特性（该选项会自动设置 ecmaVersion 解析器选项为 6）
        "node": true, //Node.js 全局变量和 Node.js 作用域
    },
    extends: ['airbnb', 'prettier', 'plugin:@typescript-eslint/recommended'],
    // 设置全局变量
    globals: {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    // 指定解析器
    parser: '@typescript-eslint/parser', // 定义ESLint的解析器
    // 指定解析器选项
    parserOptions: {
        // ts 版本的提示信息
        warnOnUnsupportedTypeScriptVersion: false,
    },
    // 第三方插件
    plugins: ['@typescript-eslint'],
    rules: {
        "quotes": [2, "single"], //单引号
        "no-console": 0, //不禁用console
        "no-debugger": 2, //禁用debugger
        "no-var": 0, //对var警告
        "semi": 0, //不强制使用分号
        "no-irregular-whitespace": 0, //不规则的空白不允许
        "no-trailing-spaces": 1, //一行结束后面有空格就发出警告
        "eol-last": 0, //文件以单一的换行符结束
        "no-unused-vars": [2, { "vars": "all", "args": "after-used" }], //不能有声明后未被使用的变量或参数
        "no-underscore-dangle": 0, //标识符不能以_开头或结尾
        "no-alert": 2, //禁止使用alert confirm prompt
        "no-lone-blocks": 0, //禁止不必要的嵌套块
        "no-class-assign": 2, //禁止给类赋值
        "no-cond-assign": 2, //禁止在条件表达式中使用赋值语句
        "no-const-assign": 2, //禁止修改const声明的变量
        "no-delete-var": 2, //不能对var声明的变量使用delete操作符
        "no-dupe-keys": 2, //在创建对象字面量时不允许键重复
        "no-duplicate-case": 2, //switch中的case标签不能重复
        "no-dupe-args": 2, //函数参数不能重复
        "no-empty": 2, //块语句中的内容不能为空
        "no-func-assign": 2, //禁止重复的函数声明
        "no-invalid-this": 0, //禁止无效的this，只能用在构造器，类，对象字面量
        "no-redeclare": 2, //禁止重复声明变量
        "no-spaced-func": 2, //函数调用时 函数名与()之间不能有空格
        "no-this-before-super": 0, //在调用super()之前不能使用this或super
        "no-undef": 2, //不能有未定义的变量
        "no-use-before-define": 2, //未定义前不能使用
        "camelcase": 0, //强制驼峰法命名
        "jsx-quotes": [2, "prefer-double"], //强制在JSX属性（jsx-quotes）中一致使用双引号
        "react/display-name": 0, //防止在React组件定义中丢失displayName
        "react/forbid-prop-types": [2, { "forbid": ["any"] }], //禁止某些propTypes
        "react/jsx-boolean-value": 2, //在JSX中强制布尔属性符号
        "react/jsx-closing-bracket-location": 1, //在JSX中验证右括号位置
        "react/jsx-curly-spacing": [2, { "when": "never", "children": true }], //在JSX属性和表达式中加强或禁止大括号内的空格。
        "react/jsx-indent-props": [2, 4], //验证JSX中的props缩进
        "react/jsx-key": 2, //在数组或迭代器中验证JSX具有key属性
        "react/jsx-max-props-per-line": [1, { "maximum": 1 }], // 限制JSX中单行上的props的最大数量
        "react/jsx-no-bind": 0, //JSX中不允许使用箭头函数和bind
        "react/jsx-no-duplicate-props": 2, //防止在JSX中重复的props
        "react/jsx-no-literals": 0, //防止使用未包装的JSX字符串
        "react/jsx-no-undef": 1, //在JSX中禁止未声明的变量
        "react/jsx-pascal-case": 0, //为用户定义的JSX组件强制使用PascalCase
        "react/jsx-sort-props": 2, //强化props按字母排序
        "react/jsx-uses-react": 1, //防止反应被错误地标记为未使用
        "react/jsx-uses-vars": 2, //防止在JSX中使用的变量被错误地标记为未使用
        "react/no-danger": 0, //防止使用危险的JSX属性
        "react/no-did-mount-set-state": 0, //防止在componentDidMount中使用setState
        "react/no-did-update-set-state": 1, //防止在componentDidUpdate中使用setState
        "react/no-direct-mutation-state": 2, //防止this.state的直接变异
        "react/no-multi-comp": 2, //防止每个文件有多个组件定义
        "react/no-set-state": 0, //防止使用setState
        "react/no-unknown-property": 2, //防止使用未知的DOM属性
        "react/prefer-es6-class": 2, //为React组件强制执行ES5或ES6类
        "react/prop-types": 0, //防止在React组件定义中丢失props验证
        "react/react-in-jsx-scope": 2, //使用JSX时防止丢失React
        "react/self-closing-comp": 0, //防止没有children的组件的额外结束标签
        "react/sort-comp": 2, //强制组件方法顺序
        "no-extra-boolean-cast": 0, //禁止不必要的bool转换
        "react/no-array-index-key": 0, //防止在数组中遍历中使用数组key做索引
        "react/no-deprecated": 1, //不使用弃用的方法
        "react/jsx-equals-spacing": 2, //在JSX属性中强制或禁止等号周围的空格
        "no-unreachable": 1, //不能有无法执行的代码
        "comma-dangle": 2, //对象字面量项尾不能有逗号
        "no-mixed-spaces-and-tabs": 0, //禁止混用tab和空格
        "prefer-arrow-callback": 0, //比较喜欢箭头回调
        "arrow-parens": 0, //箭头函数用小括号括起来
        "arrow-spacing": 0, //=>的前/后括号
        /* ts */
        'no-unused-expressions': [
        'warn',
        { allowShortCircuit: true, allowTernary: true },
        ],// 允许 短路运算和三元运算 其他warning
        /* js */
        'max-len': ['error', { code: 150 }],// 最大行字符数
        semi: 'off',// 允许 行尾无分号
        /* react */
        'react-hooks/exhaustive-deps': 'off',// 允许 react-hooks 依赖不全
        'react/no-array-index-key': 'off',// 允许 用 index 做key
        'react/function-component-definition': [
        2,
        { namedComponents: 'arrow-function' },
        ],// 默认 用箭头函数定义函数组件
        'react/jsx-filename-extension': 'off',// 允许 tsx里面不带类型定义
        'react/require-default-props': 'off',// 允许 没有默认值
        'react/react-in-jsx-scope': 'off',// 允许 React不带import React 
        /* import */
        'import/extensions': 'off',// 允许 不带扩展名
        'import/prefer-default-export': 'off',// 允许 不用export default
        'import/resolver': 'off',// 关闭 eslint 模块解析（已经有ts做了依赖解析）
        'jsx-a11y/mouse-events-have-key-events': 'off',
        'jsx-a11y/no-noninteractive-element-interactions': 'off',
        'jsx-a11y/click-events-have-key-events': 'off',
    },
    // 依赖解析用 ts
    settings: {
        'import/parser': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        'import/resolver': {
        typescript: {},
        },
    },
};

```

## 配置.prettierrc.js
在项目的根目录下添加 `.prettierrc` 或 `.prettierrc.js` 或 `.prettier.config.js` 和 `.prettierrc.toml` 文件。

JSON:

```json
{
  "trailingComma": "es5",
  "tabWidth": 2,
  "semi": false,
  "singleQuote": true
}
```

JS:

```js
// prettier.config.js or .prettierrc.js
module.exports = {
  trailingComma: "es5",
  tabWidth: 2,
  semi: false,
  singleQuote: true,
};
```

YAML:

```yaml
# .prettierrc or .prettierrc.yaml
trailingComma: "es5"
tabWidth: 2
semi: false
singleQuote: true
```

TOML:

```toml
# .prettierrc.toml
trailingComma = "es5"
tabWidth = 2
semi = false
singleQuote = true
```

## 添加脚本
```json
// package.json
"scripts": {
    "lint": "eslint src/**/*.{js,jsx,ts,tsx}  --no-error-on-unmatched-pattern",
}
```

## mrm
`mrm`是一个自动化工具。

它将根据package.json依赖项中的代码质量工具来安装和配置husky和lint-staged，因此请确保在此之前安装（npm install -D）并配置所有代码质量工具，如`Prettier`和`ESlint`。
## lint-staged
> lint-staged 是一个在git暂存文件上运行linters的工具，当然如果你觉得每次修改一个文件就给所有文件执行一次lint检查不恶心的话，这个工具对你来说就没有什么意义了，请直接关闭即可。
```shell
npm i mrm -D
npx mrm lint-staged
```
运行完上述命令你会发现：
* `package.json`里多了两个开发依赖（`husky`和`lint-staged`）和一个`prepare`脚本：
```json
{
  "scripts": {
    "prepare": "husky install"
  },
  "devDependencies": {
    "husky": "^7.0.4",
    "lint-staged": "^12.1.7",
    "mrm": "^3.0.10",
    "prettier": "^2.5.1",
  },
  "lint-staged": {
    "*.js": "eslint --cache --fix",
    "*.{js,css,md}": "prettier --write"
  }
}
```
* 根目录多了一个`.husky`的文件

可以根据项目的需要自行修改，比如可以改为：

```json
// 所有目录下包含后缀的都会开启ESLint检测
"lint-staged": {
    "**/*.less": "stylelint --syntax less",
    "**/*.{js,jsx,ts,tsx}": "npm run lint-staged:js",
    "**/*.{js,jsx,tsx,ts,less,md,json}": ["prettier --write"]
}

// 指定下包含后缀的都会开启ESLint检测
// 这里其实是不需要跑npm run lint的，因为如果这样在commit时会全量检测所有src下的文件，然而其实我们只需要检测修改的文件即可。
"lint-staged": {
    "src/**/*.{js,jsx,ts,tsx}": [
      "npm run lint"
    ],

    "src/**/*.{js,jsx,ts,tsx}": [
      "eslint"
    ]
    
}

```
完成安装和配置后，当开发者完成代码，执行`git commit -m 'xxx'`时，会自动开启ESlint检查。