import { VirtualList } from 'dumi2-demo'
import React, { memo, useEffect, useState } from 'react'

const App: React.FC = () => {
  const [isClipOpen, setIsClipOpen] = useState<boolean>(false)
  // 子组件
  const Item: React.FC<{ id: any }> = ({ id }) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center', padding: 5 }}>
        <img
          src='https://business.xiongmaoboshi.com/customer/image/1673332135870_1671157999964_1671157999961.webp'
          width={80}
          height={60}
          alt=''
        />
        列表{id}
      </div>
    )
  }
  // 子组件memo化
  const MemoizedItem = memo(Item, (prevProps, nextProps) => {
    // 只有当id没有发生变化时，才返回true，表示不需要重新渲染
    return prevProps.id === nextProps.id
  })
  // 渲染的数据--初始化50条，后续请求数据
  const [list, setList] = useState<Array<number>>([])
  useEffect(() => {
    let arr: number[] = []
    for (let i = 0; i < 50; i++) {
      arr.push(i)
    }
    setList(arr)
  }, [])
  // 请求数据--每次请求50条
  const onRequest = async () => {
    let arr: number[] = []
    for (let i = 0; i < 50; i++) {
      arr.push(i)
    }
    return arr
  }

  return (
    <>
      <div
        onClick={() => {
          setIsClipOpen(true)
        }}
        style={{ cursor: 'pointer' }}
      >
        点我
      </div>
      <VirtualList
        width={500}
        height={800}
        itemHeight={60}
        open={isClipOpen}
        data={list}
        onRequest={onRequest}
        onClose={() => {
          setIsClipOpen(false)
        }}
        subComponent={MemoizedItem}
      />
    </>
  )
}

export default App
