
# vscode常见问题

## vscode 代码尾部添加分号

### 设置setting.json

```json
"editor.codeActionsOnSave": {
  "source.fixAll.eslint": true
},
"editor.formatOnSave": true,
"editor.formatOnSaveMode": "modifications",
```

:::tip
prettierrc.js文件 `semi` 默认值为 `true`
:::
