import { useEffect } from 'react'
import useDebounce from './useDebounce'
import useThrottle from './useThrottle'

/**
 * @description // 封装了一个useEventListener的hook，用于监听事件
 * @param event // 事件名称
 * @param handler // 事件处理函数
 * @param target // 监听的目标
 * @returns // 无返回值
 */
const useEventListener = (event: string, handler: (...e: any) => void, target: any = window) => {
  const throttledHandler = useThrottle(handler, 200)
  const debouncedHandler = useDebounce(handler, 200)
  useEffect(() => {
    const targetElement = 'current' in target ? target.current : window
    const useEventListener = (event: Event) => {
      if (['scroll', 'resize', 'mousemove'].includes(event.type)) {
        throttledHandler(event)
      } else {
        debouncedHandler(event)
      }
    }
    targetElement.addEventListener(event, useEventListener)
    return () => {
      // 销毁的时候需要移除对应的监听事件
      targetElement.removeEventListener(event, useEventListener)
    }
  }, [event])
}

export default useEventListener
