# styleLint配置
:::tip
前置条件：vscode安装并开启`stylelint`插件
:::

## 安装stylelint及依赖包
```json
"devDependencies": {
    "stylelint": "^13.13.1",
    "stylelint-config-css-modules": "^2.2.0",
    "stylelint-config-idiomatic-order": "^8.1.0",
    "stylelint-config-prettier": "^8.0.1",
    "stylelint-config-standard": "^20.0.0",
    "stylelint-declaration-block-no-ignored-properties": "^2.1.0",
    "stylelint-order": "^5.0.0",
}
```

## 根目录创建 `.stylelintrc.js` 文件
```js
module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-css-modules',
    'stylelint-config-prettier',
    'stylelint-config-idiomatic-order', // 排序规则的插件
  ],
  plugins: [
    'stylelint-declaration-block-no-ignored-properties', // 互斥或不生效的属性校验
    'stylelint-order', // 属性顺序校验
  ],
  rules: {
    'function-url-quotes': 'always',
    'selector-attribute-quotes': 'always',
    'unit-no-unknown': [true, { ignoreUnits: ['rpx'] }],
    //大小写
    'value-keyword-case': 'lower',
    'plugin/declaration-block-no-ignored-properties': true,
    'selector-class-pattern': '^[a-z]+(-|[a-zA-Z0-9])*[a-zA-Z0-9]+$', // 类名兼容小驼峰和短横线
    'rule-empty-line-before': 'always-multi-line', // 在多行规则之前必须有一行空行
    'declaration-block-trailing-semicolon': 'always', // 要求声明块后面有分号
  },
  ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.tsx', '**/*.ts'], // 忽略检查的文件
}
```

## 添加lint脚本
```json
{
  "scripts": {
    "lint:style": "stylelint \"src/**/*.less\"",
  }
}
```

## commit检测
```json
// package.json

"lint-staged": {
    "*.{ts,tsx}": [
      "eslint"
    ],
    "*.less": [
      "stylelint"
    ]
}
```
:::tip
这里其实是不需要跑`npm run lint:style`的，因为如果执行了`npm run lint:style`，在commit时会全量检测所有src下的样式，然而其实我们只需要检测修改的文件即可。
:::

## 修复单个文件
```shell
npx stylelint --fix ./src/components/xxx/index.less
```