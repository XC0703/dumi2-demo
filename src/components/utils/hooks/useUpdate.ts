import { useCallback, useState } from 'react'

/**
 * @description // 封装了一个useUpdate的hook，用于强制组件更新
 * @returns // 返回一个函数，调用这个函数会触发组件的更新
 */
const useUpdate = () => {
  const [, setState] = useState({})

  return useCallback(() => setState({}), [])
}

export default useUpdate
