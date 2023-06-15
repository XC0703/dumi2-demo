export interface IRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: { [key: string]: string }
  body?: BodyInit
}

// 定义拦截器的接口
interface Interceptor<T> {
  onFulfilled?: (value: T) => T | Promise<T>
  onRejected?: (error: any) => any
}

// 定义拦截器管理类--用于管理多个拦截器，可以通过use()方法向拦截器数组中添加一个拦截器，可以通过forEach()方法对所有的拦截器进行遍历和执行。
class InterceptorManager<T> {
  private interceptors: Array<Interceptor<T>>

  constructor() {
    this.interceptors = []
  }

  use(interceptor: Interceptor<T>) {
    this.interceptors.push(interceptor)
  }

  forEach(fn: (interceptor: Interceptor<T>) => void) {
    this.interceptors.forEach(interceptor => {
      if (interceptor) {
        fn(interceptor)
      }
    })
  }
}

// 添加拦截器的 myFetch 函数
export default async function myFetch<T>(url: string, options: IRequestOptions = {}): Promise<T> {
  const requestInterceptors = new InterceptorManager<IRequestOptions>()
  const responseInterceptors = new InterceptorManager<any>()

  // 添加请求拦截器
  requestInterceptors.use({
    onFulfilled: options => {
      // 处理请求
      console.log('请求拦截器：处理请求')
      return options
    },
    onRejected: error => {
      console.log('请求拦截器：处理错误', error)
      return error
    },
  })

  // 添加响应拦截器
  responseInterceptors.use({
    onFulfilled: response => {
      // 处理响应
      console.log('响应拦截器：处理响应')
      return response.json()
    },
    onRejected: error => {
      console.log('响应拦截器：处理错误', error)
      return error
    },
  })

  // 处理请求拦截器--遍历所有的请求拦截器，并执行onFulfilled()方法，将返回值赋值给options
  requestInterceptors.forEach(async interceptor => {
    // eslint-disable-next-line no-param-reassign
    options = (await interceptor.onFulfilled?.(options)) ?? options
  })

  let response = await fetch(url, {
    method: options.method || 'GET',
    headers: options.headers || {
      'Content-Type': 'application/json',
    },
    body: options.body,
  })

  if (!response.ok) {
    throw new Error(`Request failed with status code ${response.status}`)
  }

  // 处理响应拦截器--遍历所有的响应拦截器，并执行onFulfilled()方法，将返回值赋值给response
  responseInterceptors.forEach(interceptor => {
    response = interceptor.onFulfilled?.(response) ?? response
  })

  return response.json() as Promise<T>
}
