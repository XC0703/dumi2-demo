import { useMemo, useRef } from 'react'

/**
 * @description // 封装了一个useMemoizedFn的hook，用于缓存函数
 * @param fn // 需要缓存的函数
 * @returns // 返回一个缓存的函数
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type noop = (this: any, ...args: any[]) => any

// 通过 PickFunction 类型来确保某个函数类型符合我们的要求，从而避免类型错误。
type PickFunction<T extends noop> = (
  this: ThisParameterType<T>,
  ...args: Parameters<T>
) => ReturnType<T>

function useMemoizedFn<T extends noop>(fn: T) {
  const fnRef = useRef<T>(fn)
  // 使用 useMemo 缓存一个可用的函数引用，每次 fn 改变时更新缓存
  fnRef.current = useMemo(() => fn, [fn])

  const memoizedFn = useRef<PickFunction<T>>()
  if (!memoizedFn.current) {
    // eslint-disable-next-line func-names
    memoizedFn.current = function (this, ...args) {
      return fnRef.current.apply(this, args)
    }
  }

  // 返回一个 memoizedFn 的引用
  return memoizedFn.current as T // 把返回类型断言为 T 类型
}

export default useMemoizedFn
