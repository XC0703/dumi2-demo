---
title: useDebounce
toc: content
nav: 工具
group:
  title: 自定义hooks
---

# useDebounce

## 介绍

用来处理函数防抖的 Hook。

## 基础用法

```typescript
import { useDebounce } from 'dumi2-demo';
const fn = useDebounce(
  fn: (...args: any[]) => any,
  wait: number
);
```

## Params

| 参数 |         说明         |           类型            | 默认值 |
| :--: | :------------------: | :-----------------------: | :----: |
|  fn  |  需要防抖执行的函数  | `(...args: any[]) => any` |   -    |
| wait | 等待时间，单位为毫秒 |         `number`          |   -    |

## Result

| 参数 |   说明   |           类型            |
| :--: | :------: | :-----------------------: |
|  fn  | 触发执行 | `(...args: any[]) => any` |
