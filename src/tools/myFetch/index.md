---
title: myFetch
toc: content
nav: 工具
group:
  title: 常用方法和类
---

# myFetch

## 介绍

二次封装的 fetch。（添加了拦截器配置）

## 基础用法

```typescript
import { myFetch, IRequestOptions } from from 'dumi2-demo';
import { paramsType, resType } from './type';

export async function fetchData(params: paramsType): Promise<resType> {
  const options: IRequestOptions = {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN_HERE',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params),
  }
  const res: resType = await myFetch('https://api.example.com/data', options);
  return res;
}
```

## Params

|    参数    |       说明       |                    类型                    | 默认值 | 是否必须 |
| :--------: | :--------------: | :----------------------------------------: | :----: | :------: |
|   params   |    请求的参数    |                `paramsType`                |   -    | `false`  |
| paramsType |  请求的参数类型  |                   `any`                    |   -    | `false`  |
|  resType   | 要获取的数据类型 | `{code: number, message: string, data: T}` |   -    |  `true`  |
|    url     |    请求的地址    |                  `string`                  |   -    |  `true`  |
|  options   |    请求头配置    |             `IRequestOptions`              |   -    |  `true`  |

## Result

| 名称 |    说明    |        类型        |
| :--: | :--------: | :----------------: |
| res  | 请求的结果 | `Promise<resType>` |
