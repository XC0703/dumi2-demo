import { useEffect, useRef } from 'react'
import useMemoizedFn from './useMemoizedFn'

/**
 * @description  //防抖hook
 * @param fn // 需要防抖的函数
 * @param delay // 防抖的时间
 * @returns // 返回一个防抖的函数
 */
const useDebounce = <T extends (...args: any[]) => any>(fn: T, delay: number): T => {
  // 用 useRef 来保存函数和定时器
  const { current } = useRef<{ fn: T; timer: NodeJS.Timeout | null }>({ fn, timer: null })

  // 当传入的 fn 更新时，更新 useRef 中保存的 fn
  useEffect(() => {
    current.fn = fn
  }, [fn])

  // 使用 useMemoizedFn 缓存一个可用的函数
  return useMemoizedFn((...args) => {
    if (current.timer) {
      clearTimeout(current.timer)
    }
    current.timer = setTimeout(() => {
      current.fn.call(null, ...args)
    }, delay)
  }) as unknown as T // 函数返回值为 useMemoizedFn 的返回值，但是 return 中的函数需要断言成 T 类型(先断言为一个未知类型，以防止编译器给出错误的类型标注)
}

export default useDebounce
