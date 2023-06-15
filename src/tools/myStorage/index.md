---
title: myStorage
toc: content
nav: 工具
group:
  title: 常用方法和类
---

# myStorage

## 介绍

对本地存储 sessionStorage 进行封装，类型推导，自动序列化，类型转换，使用起来更方便，也便于维护管理本地存储。

## 基础用法

```typescript
import { SessionStorage } from 'dumi2-demo'

// 定义实例
const storage = new SessionStorage('key', 'defaultValue')
// 设置值
storage.setItem('value')
// 获取值
storage.getItem()
// 删除值
storage.removeItem()
```

## Params

|     参数     |    说明     |   类型   | 默认值 | 是否必须 |
| :----------: | :---------: | :------: | :----: | :------: |
|     key      | 存储 key 名 | `string` |   -    |  `true`  |
| defaultValue |   初始值    |  `any`   |   -    |  `true`  |

## 实例方法

|    方法    |  说明  |        类型         | 返回值 |
| :--------: | :----: | :-----------------: | :----: |
|  setItem   | 设置值 | `(value: T)=> void` |   -    |
|  getItem   | 获取值 |      `()=> T`       |  `T`   |
| removeItem | 删除值 |     `()=> void`     |   -    |
