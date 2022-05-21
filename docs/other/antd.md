# antd常见问题

## Select

场景： 最多选三个值，最少选中一个。删除每一个值的时候都要弹窗并且Select组件下拉框支持选中。
```jsx
import { useState, useEffect, useMemo } from 'react';
import { Form, Tag, Select, Checkbox, message } from 'antd';

const data = [
  {
    label: 'A',
    checked: false,
    disabled: false,
  },
  {
    label: 'B',
    checked: true,
    disabled: false,
  },
  {
    label: 'C',
    checked: false,
    disabled: false,
  },
  {
    label: 'D',
    checked: false,
    disabled: false,
];

const Index = () => {
  const [form] = Form.useForm();
  const [selectOptions, setSelectOptions] = useState(data);

  const handleChangeChecked = (name) => {
    const newSelectOptions = selectOptions.map((item) => {
      let { checked } = item;
      const { label, disabled } = item;
      if (item.label === name) {
        checked = !checked;
      }
      return { label, checked, disabled };
    });
    setSelectOptions(newSelectOptions);
  };

  const propertyIndustryList = useMemo(() => (form.getFieldValue('values') ? form.getFieldValue('values') : []), [
    form.getFieldValue('values'),
  ]);
  const selectOptionsEqualOne = useMemo(() => {
    const list = selectOptions.filter((item) => item.checked);
    return list.length === 1;
  }, [selectOptions]);

  const onChange = (e, name) => {
    if (selectOptionsEqualOne && !e.target.checked) {
      message.warning('至少保留一个值');
    } else {
      handleChangeChecked(name);
      if (e.target.checked) {
        form.setFieldsValue({ values: [...propertyIndustryList, name] });
      } else {
        form.setFieldsValue({ values: propertyIndustryList.filter((item) => item !== name) });
      }
    }
  };

  useEffect(() => {
    const list = selectOptions.map((item) => {
      let { disabled } = item;
      const { label, checked } = item;
      if (!propertyIndustryList.includes(label) && propertyIndustryList.length > 2) {
        disabled = true;
      } else {
        disabled = false;
      }
      return { label, checked, disabled };
    });
    setSelectOptions(list);
  }, [propertyIndustryList]);

  // 至少选中2个值
  const onMoreThanOneOk = (label: string) => {
    const idx = propertyIndustryList.indexOf(label);
    const newProList = [...propertyIndustryList];
    newProList.splice(idx, 1);
    handleChangeChecked(label);
    form.setFieldsValue({ values: newProList });
  };

  const tagRender = ({ label, closable }) => {
    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    const onCloseChange = (e) => {
      e.preventDefault();
      if (propertyIndustryList.length > 1) {
        ModalConfirm({
          title: '确定要删除该值吗？',
          content: '删除该值将清空所有与其相关的数据。',
          onOk: () => onMoreThanOneOk(label),
          type: 'confirm',
        });
      } else {
        message.warning('至少保留一个值');
      }
    };
    return (
      <Tag onMouseDown={onPreventMouseDown} closable={closable} onClose={onCloseChange} style={{ marginRight: 3 }}>
        {label}
      </Tag>
    );
  };

  const dropdownRender = () => (
    <div>
      {selectOptions.map((item) => {
        const { label, checked, disabled } = item;
        return (
          <div key={label} style={{ padding: '4px 8px' }}>
            <Checkbox disabled={disabled} checked={checked} onChange={(e) => onChange(e, label)}>
              {label}
            </Checkbox>
          </div>
        );
      })}
    </div>
  );

  return (
    <Form form={form}>
      <Form.Item label="值" name="values" rules={[{ required: true, message: '' }]}>
        <Select
          mode="multiple"
          style={{ width: 352 }}
          tagRender={tagRender}
          dropdownRender={dropdownRender}
          showArrow
        />
      </Form.Item>
    </Form>
  );
};

export default Index;
```

## antd Form.Item
> `Form.Item`中的tooltip替换icon
```jsx
<Form.Item
  label="替换icon"
  name="replace"
  tooltip={{ title: '成功替换', icon: <InfoCircleOutlined /> }}
>
```

## antd Anchor
```jsx
<div style={{ display: 'flex' }}>
  <div style={{ width: '80vw' }}>
    <div id="first" style={{ height: 800, border: '1px solid red' }}>
      第一行
    </div>
    <div id="second" style={{ height: 600, border: '1px solid green' }}>
      第二行
    </div>
    <div id="third" style={{ height: 480, border: '1px solid blue' }}>
      第三行
    </div>
    <div id="fourth" style={{ height: 100, border: '1px solid pink' }}>
      第四行
    </div>
  </div>
  <Anchor>
    <Link href="#first" title="第一行" />
    <Link href="#second" title="第二行" />
    <Link href="#third" title="第三行" />
    <Link href="#fourth" title="第四行" />
  </Anchor>
</div>
```

## antd Tabs 闪动
> 记得查看是否是自己写的样式覆盖了自带的样式导致的！！！

## antd Select
:::tip
菜单渲染父节点。默认渲染到 body 上，如果遇到菜单滚动定位问题，修改滚动的区域的父元素，并设置相对其定位。
:::
```jsx
<div style={{ padding: 100, height: 1000, background: '#eee', position: 'relative' }} id="area">
  <h4>可滚动的区域 / scrollable area</h4>
  <Select
    defaultValue="lucy"
    style={{ width: 120 }}
    getPopupContainer={() => document.getElementById('area')}
  >
    <Option value="jack">Jack</Option>
    <Option value="lucy">Lucy</Option>
    <Option value="yiminghe">yiminghe</Option>
  </Select>
</div>
```

## Input 组件取消自动显示输入历史
:::tip
Form默认开启 autoComplete 功能，当submit时会记录输入历史，
取消自动补充功能，只需在 `Form` 上加 `autoComplete="off"` 即可关闭自动提示输入历史
:::

## Form
:::tip
Form.Item组件里面的<Select />，如果声明在FormSelect.tsx文件，会导致在父组件中通过 `form.validateFields()`获取不到该字段的值，应该把<Form.Item><Select /></Form.Item>FormSelect.tsx文件。
:::

```tsx
// FormSelect.tsx
const FormSelect = <Item name="types" label='性别' rules={[{ required: true, message: `请选择性别!` }]}>
  <Select
    placeholder='请选择性别'
    style={{ width: 360 }}
    showArrow
    options={options}
    mode="multiple"
  />
</Item>


<Form form={form} autoComplete="off" labelCol={{ span: 5 }}>
  <Item name="name" label="姓名" rules={[{ required: true, message: '请填写姓名!' }]}>
    <Input placeholder="请填写姓名" style={{ width: 360 }} />
  </Item>
  <FormSelect form={form} />
</Form>
```