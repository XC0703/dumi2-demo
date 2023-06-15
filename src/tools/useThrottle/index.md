---
title: useThrottle
toc: content
nav: 工具
group:
  title: 自定义hooks
---

# useThrottle

## 介绍

用来处理函数节流的 Hook。

## 基础用法

```typescript
import { useThrottle } from 'dumi2-demo';
const fn = useThrottle(
  fn: (...args: any[]) => any,
  wait: number
);
```

## Params

| 参数 |         说明         |           类型            | 默认值 |
| :--: | :------------------: | :-----------------------: | :----: |
|  fn  |  需要节流执行的函数  | `(...args: any[]) => any` |   -    |
| wait | 等待时间，单位为毫秒 |         `number`          |   -    |

## Result

| 参数 |   说明   |           类型            |
| :--: | :------: | :-----------------------: |
|  fn  | 触发执行 | `(...args: any[]) => any` |
