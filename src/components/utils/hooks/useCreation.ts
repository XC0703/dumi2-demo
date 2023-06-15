import type { DependencyList } from 'react'
import { useRef } from 'react'

/**
 * @description // 结合useMemo和useRef封装useCreation，既可以判断刷新条件，又可以缓存数据，增强了渲染的性能，防止无关的state改变的时候也去重新渲染造成性能的浪费
 * @param oldDeps // 旧的依赖
 * @param deps // 新的依赖
 * @returns // 返回是否相同
 */
const depsAreSame = (oldDeps: DependencyList, deps: DependencyList): boolean => {
  if (oldDeps === deps) return true

  for (let i = 0; i < oldDeps.length; i++) {
    // 判断两个值是否是同一个值
    if (!Object.is(oldDeps[i], deps[i])) return false
  }

  return true
}

const useCreation = <T>(fn: () => T, deps: DependencyList) => {
  const { current } = useRef({
    deps,
    obj: undefined as undefined | T,
    initialized: false,
  })

  if (current.initialized === false || !depsAreSame(current.deps, deps)) {
    current.deps = deps
    current.obj = fn()
    current.initialized = true
  }

  return current.obj as T
}

export default useCreation
