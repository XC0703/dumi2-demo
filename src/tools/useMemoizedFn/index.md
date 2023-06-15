---
title: useMemoizedFn
toc: content
nav: 工具
group:
  title: 自定义hooks
---

# useMemoizedFn

## 介绍

用来处理函数缓存的 Hook。

## 基础用法

```typescript
import { useMemoizedFn } from 'dumi2-demo';
const fn = useMemoizedFn(
  fn: (...args: any[]) => any,
);
```

## Params

| 参数 |      说明      |           类型            | 默认值 |
| :--: | :------------: | :-----------------------: | :----: |
|  fn  | 需要缓存的函数 | `(...args: any[]) => any` |   -    |

## Result

| 参数 |   说明   |           类型            |
| :--: | :------: | :-----------------------: |
|  fn  | 缓存函数 | `(...args: any[]) => any` |
