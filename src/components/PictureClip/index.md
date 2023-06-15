---
toc: content # 导航在内容区才显示，在左侧导航栏不显示
title: 图片裁剪 # 组件的标题，会在菜单侧边栏展示
nav: 组件 # 约定式路由
---

# PictureClip

## 介绍

图片裁剪组件

## 示例

<!-- 可以通过code加载示例代码，dumi会帮我们做解析 -->

​ <code src="./demo/base.tsx">基础用法</code>

## API

| 属性 | 说明 | 类型 | 默认值 | 是否必须 |
| :-: | :-: | :-: | :-: | :-: |
| resource | 裁剪源数据 | string ｜ File | - | true |
| imgType | 图片类型 | string | `image/png` | false |
| imgName | 图片名称 | string | - | false |
| encoderOptions | 裁剪后图片质量 | number | `0.92` | false |
| defaultClipBox | 默认裁剪盒子信息 | { width: number,height:number } | - | false |
| acceptRatio | 默认的裁剪比例 | number | - | false |
| clipMethod | 裁剪方式 | 'manual'｜'fixed' ｜'custom' | `manual` | false |
| open | 显示裁剪 | boolean | `false` | false |
| onClip | 裁剪后触发 | (clipInfo: { url: string; width: number; height: number; file: File }) => void | - | false |
| onClose | 点击关闭按钮触发 | (position: 'close' ｜'clip') => void | `false` | false |
