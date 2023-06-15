---
title: myAxios
toc: content
nav: 工具
group:
  title: 常用方法和类
---

# myAxios

## 介绍

二次封装的 axios。

## 基础用法

```typescript
import { myAxios } from from 'dumi2-demo';
import { paramsType, resType } from './type';

export const axiosData = async (params: paramsType) => {
  const allRes = await myAxios.post<paramsType, resType>('/data', params);
  const res = allRes.data;
  return res;
}
```

## Params

| 参数 | 说明 | 类型 | 默认值 | 是否必须 |
| :-: | :-: | :-: | :-: | :-: |
| params | 请求的参数 | `paramsType` | - | `false` |
| paramsType | 请求的参数类型，get 请求和 delete 请求时无需传入 | `any` | - | `false` |
| resType | 要获取的数据类型，传入 `ApiResponse<T>`的泛型 T 中 | `any` | - | `true` |
| url | 请求的接口地址后缀 | `string` | - | `true` |

**注意：针对项目的实际情况到源码修改如下信息：**

接口地址默认前缀`baseURL`（默认`https://api.example.com`）、请求返回的数据类型`ApiResponse<T>`（默认 `{code: number, message: string, data: T}`)

## Result

| 名称 |    说明    |              类型               |
| :--: | :--------: | :-----------------------------: |
| res  | 请求的结果 | `Promise<ApiResponse<resType>>` |
