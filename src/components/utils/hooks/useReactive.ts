import { useRef } from 'react'
import useCreation from './useCreation'
import useUpdate from './useUpdate'

/**
 * @description // 封装了一个useReactive的hook，用于响应式数据
 * @param initialVal // 初始值
 * @param cb // 回调函数
 * @returns // 返回一个响应式的对象
 */

// 传入的 initialState 必须是一个拥有字符串类型键和任意类型值的对象
const observer = <T extends Record<string, any>>(initialVal: T, cb: () => void): T => {
  const proxy = new Proxy<T>(initialVal, {
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver)
      return typeof res === 'object' ? observer(res, cb) : Reflect.get(target, key)
    },
    set(target, key, val) {
      const ret = Reflect.set(target, key, val)
      cb()
      return ret
    },
  })

  return proxy
}

const useReactive = <T extends Record<string, any>>(initialState: T): T => {
  const ref = useRef<T>(initialState)
  const update = useUpdate()

  const state = useCreation(() => {
    // state 中的属性发生变化时，会触发更新视图的回调函数 update。
    return observer(ref.current, () => {
      update()
    })
  }, [])

  return state
}

export default useReactive
