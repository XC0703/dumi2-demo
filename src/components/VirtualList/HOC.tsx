/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useRef, useState } from 'react'
import useCreation from '../utils/hooks/useCreation'
import useEventListener from '../utils/hooks/useEventListener'
import useReactive from '../utils/hooks/useReactive'
import binarySearch from './utils/binarySearch'

// 定义state的类型
interface State {
  data: any[]
  scrollAllHeight: string
  listHeight: number
  itemHeight: number
  renderCount: number
  bufferCount: number
  start: number
  end: number
  currentOffset: number
  positions: {
    index: number
    height: number
    top: number
    bottom: number
    dHeight: number
  }[]
  initItemHeight: number
}
const HOC = (Component: any) => (props: any) => {
  const { list, containerHeight, itemHeightRef, onRequest } = props
  const [totalList, setTotalList] = useState(list)
  const [prelist, setPrelist] = useState([])
  const state: State = useReactive({
    data: [], //渲染的数据
    scrollAllHeight: containerHeight.current + 'px', // 容器的初始高度
    listHeight: 0, //列表高度
    itemHeight: 0, // 子组件的高度
    renderCount: 0, // 需要渲染的数量
    bufferCount: 6, // 缓冲的个数
    start: 0, // 起始索引
    end: 0, // 终止索引
    currentOffset: 0, // 偏移量
    positions: [
      //需要记录每一项的高度
      // index         // 当前pos对应的元素的下标
      // top;          // 顶部位置
      // bottom        // 底部位置
      // height        // 元素高度
      // dHeight        // 用于判断是否需要改变
    ],
    initItemHeight: itemHeightRef.current, // 预计高度
  })

  const allRef = useRef<any>(null) // 容器的ref
  const scrollRef = useRef<any>(null) // 检测该盒子里面的滚动实践
  const ref = useRef<any>(null) // 检测内容滚动事件

  /**
   * 初始化positions数组--渲染的数组发生变化时，重新计算
   */
  const initPositions = () => {
    // 只需要重新计算新增的部分
    const data = []
    for (let i = prelist.length; i < totalList.length; i++) {
      if (state.positions.length === 0) {
        data.push({
          index: i,
          height: state.initItemHeight,
          top: i * state.initItemHeight,
          bottom: (i + 1) * state.initItemHeight,
          dHeight: 0,
        })
      } else {
        data.push({
          index: i,
          height: state.initItemHeight,
          top:
            state.positions[prelist.length - 1].bottom +
            (i - prelist.length) * state.initItemHeight,
          bottom:
            state.positions[prelist.length - 1].bottom +
            (i - prelist.length + 1) * state.initItemHeight,
          dHeight: 0,
        })
      }
    }

    state.positions = [...state.positions, ...data]
    // 此时才去更新prelist
    setPrelist(totalList)
  }
  useEffect(() => {
    // 初始高度--用预估高度*总数
    initPositions()
  }, [totalList.length])

  /**
   * 初始化数据
   */
  useEffect(() => {
    // 子列表高度--默认是预估高度
    const ItemHeight = state.initItemHeight
    // 容器的高度
    const scrollAllHeight = allRef.current.offsetHeight
    // 列表高度--positions最后一项的bottom
    const listHeight = state.positions[state.positions.length - 1].bottom
    //渲染节点的数量
    const renderCount = Math.ceil(scrollAllHeight / ItemHeight) + state.bufferCount

    // 更新状态
    state.renderCount = renderCount
    state.end = renderCount + 1
    state.listHeight = listHeight
    state.itemHeight = ItemHeight
    state.data = totalList.slice(state.start, state.end)
  }, [allRef])

  /**
   * 监听内容的变化，更新positions数组，用实际的高度替换预估的高度
   */
  const setPostition = () => {
    const nodes = ref.current.childNodes
    if (nodes.length === 0) return
    nodes.forEach((node: HTMLDivElement) => {
      if (!node) return
      const rect = node.getBoundingClientRect() // 获取对应的元素信息
      const index = +node.id // 可以通过id，来取到对应的索引
      const oldHeight = state.positions[index].height // 旧的高度
      const dHeight = oldHeight - rect.height // 差值
      if (dHeight) {
        state.positions[index].height = rect.height //真实高度
        state.positions[index].bottom = state.positions[index].bottom - dHeight
        state.positions[index].dHeight = dHeight //将差值保留
      }
    })

    //  重新计算整体的高度
    const startId = +nodes[0].id

    const positionLength = state.positions.length
    let startHeight = state.positions[startId].dHeight
    state.positions[startId].dHeight = 0

    for (let i = startId + 1; i < positionLength; ++i) {
      const item = state.positions[i]
      state.positions[i].top = state.positions[i - 1].bottom
      state.positions[i].bottom = state.positions[i].bottom - startHeight
      if (item.dHeight !== 0) {
        startHeight += item.dHeight
        item.dHeight = 0
      }
    }

    // 重新计算子列表的高度
    state.itemHeight = state.positions[positionLength - 1].bottom
  }
  useEffect(() => {
    setPostition()
  }, [ref.current])

  /**
   * 结合useMemo和useRef封装useCreation，既可以判断刷新条件，又可以缓存数据，增强了渲染的性能，防止无关的state改变的时候也去重新渲染造成性能的浪费
   */
  useCreation(() => {
    state.data = totalList.slice(state.start, state.end)
    // 初始化的时候，需要重新计算一下
    if (ref.current) {
      setPostition()
    }
  }, [state.start])

  /**
   * 监听滚动事件，第一个event是事件（如：click、keydown），第二个回调函数（所以不需要出参），第三个就是目标（是某个节点还是全局）
   */
  useEventListener(
    'scroll',
    () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
      // 利用二分查找到当前应该渲染的开始项，|| Math.floor(scrollTop / state.itemHeight)是为了防止出现null的情况
      state.start = state.start =
        binarySearch(state.positions, scrollTop) || Math.floor(scrollTop / state.itemHeight)
      // 计算结束项--开始项+渲染的数量
      state.end = state.start + state.renderCount + 1
      // 计算偏移量
      state.currentOffset = state.start > 0 ? state.positions[state.start - 1].bottom : 0
      // 距离底部的高度 = 滚动条的高度 - 默认的高度 - 距离顶部的高度---下拉到底部进行刷新
      const button = scrollHeight - clientHeight - scrollTop
      // 没必要==0滚动到底部才去请求数据，否则会导致渲染不及时问题（监听滚动事件才去触发的重新渲染，如果==0，就一直无法向下滚动造成体验问题）
      if (button <= 100 && onRequest) {
        onRequest()
          .then((res: any) => {
            const newArr = res.map((num: number) => num + totalList[totalList.length - 1] + 1) // 从最后一个元素的下一个位置开始插入新数
            setTotalList([...totalList, ...newArr])
          })
          .catch((err: any) => {
            console.log(err)
          })
      }
    },
    scrollRef,
  )

  return (
    <div ref={allRef}>
      <div
        style={{
          height: state.scrollAllHeight,
          overflow: 'scroll',
          overflowX: 'hidden',
          position: 'relative',
        }}
        ref={scrollRef}
      >
        {/* 占位，初始化列表的总高度，用于生成滚动条 */}
        <div
          style={{ height: state.listHeight, position: 'absolute', left: 0, top: 0, right: 0 }}
        ></div>
        {/* 内容区域 */}
        <div
          ref={ref}
          style={{
            transform: `translate3d(0, ${state.currentOffset}px, 0)`,
            position: 'relative',
            left: 0,
            top: 0,
            right: 0,
          }}
        >
          {/* 渲染区域 */}
          {state.data.map((item: any) => (
            <div key={item}>
              {/* 子组件 */}
              <Component id={item} {...props} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HOC
