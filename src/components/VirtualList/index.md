---
toc: content # 导航在内容区才显示，在左侧导航栏不显示
title: 虚拟滚动列表 # 组件的标题，会在菜单侧边栏展示
nav: 组件 # 约定式路由
---

# VirtualList

## 介绍

虚拟滚动列表组件

<!-- 可以通过code加载示例代码，dumi会帮我们做解析 -->

## 示例

​ <code src="./demo/base.tsx">基础用法</code>

## API

| 属性 | 说明 | 类型 | 默认值 | 是否必须 |
| :-: | :-: | :-: | :-: | :-: |
| width | 虚拟列表盒子宽度 | number | - | true |
| height | 虚拟列表盒子高度 | number | - | true |
| itemHeight | 虚拟列表列表项高度，如果是子项不定高的情况则为预估高度 | number | - | true |
| subComponent | 列表渲染的子组件 | React.FC | - | true |
| data | 初始化渲染的数据 | Array | [] | false |
| onRequest | 请求数据的方法 | () => Promise | - | false |
| open | 显示虚拟列表 | boolean | `false` | false |
| onClose | 点击关闭按钮触发 | () => void | - | false |
