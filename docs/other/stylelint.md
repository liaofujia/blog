# stylelint常见问题

## stylelint警告
::: tip 注意
sans-serif是一个通用字体关键字
:::
```css
a { font-family: Helvetica; } // 报错禁止在字体名称列表中缺少通用字体关键字。

a { font-family: Helvetica, sans-serif; } // ok
```