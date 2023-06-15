import { CloseCircleOutlined } from '@ant-design/icons'
import React, { useEffect, useRef, useState } from 'react'
import HOC from './HOC'
import './styles/index.less'

interface IVirtualListProps {
  width: number
  height: number
  itemHeight: number
  subComponent: React.FC<any>
  data?: Array<any>
  onRequest?: () => Promise<any>
  open?: boolean
  onClose?: () => void
}

const VirtualList: React.FC<IVirtualListProps> = props => {
  const { width, height, itemHeight, subComponent, data, onRequest, open, onClose } = props
  // 操作容器宽度
  const containerWidth = useRef<number>(width)
  // 操作容器高度
  const containerHeight = useRef<number>(height)
  // 列表项高度
  const itemHeightRef = useRef<number>(itemHeight)
  // 显示
  const [visible, setVisible] = useState<boolean>(open || false)
  useEffect(() => {
    setVisible(open || false)
  }, [open])
  // 虚拟滚动列表
  const ItemHoc = HOC(subComponent)

  const Index: React.FC<any> = () => {
    if (!data || data.length === 0) return <></>

    return (
      <div>
        <ItemHoc
          list={data}
          containerHeight={containerHeight}
          itemHeightRef={itemHeightRef}
          onRequest={onRequest}
        />
      </div>
    )
  }
  return (
    <>
      {visible && (
        <div className='custom-mask'>
          <div className='content-box'>
            <CloseCircleOutlined
              onClick={() => {
                setVisible(false)
                onClose?.()
              }}
              className='virtualList-close'
            />
            <div
              style={{
                height: `${containerHeight.current}px`,
                width: `${containerWidth.current}px`,
              }}
              className='virtualList-container'
            >
              <Index />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default VirtualList
