import { CloseCircleOutlined } from '@ant-design/icons'
import { Button, Card, InputNumber, message, Radio, RadioChangeEvent, Space } from 'antd'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import useDebounce from '../utils/hooks/useDebounce'
import './styles/index.less'
import { clipMethodType, handleValueType, IPictureClipProps } from './types'
import { getFileName, getImageFileFromUrl, imageFileToBase64, saveImageToFile } from './utils'

const PictureClip: React.FC<IPictureClipProps> = props => {
  /**
   * @description: 获取传入的参数
   */
  const {
    resource,
    onClip,
    encoderOptions = 0.92,
    defaultClipBox,
    clipMethod = 'manual',
    acceptRatio,
    imgName,
    open = false,
    onClose,
  } = props

  /**
   * @description: useRef创建的变量
   */
  // 是否在移动中
  const isMoveDown = useRef<boolean>(false)
  // 是否在修改宽高
  const isResizeDown = useRef<boolean>(false)
  // 操作容器宽度
  const containerWidth = useRef<number>(1000)
  // 操作容器高度
  const containerHeight = useRef<number>(800)
  // 图片类型
  const imgType = useRef<string>('image/png')
  // 裁剪盒子定位坐标，左上角
  const leftTopPos = useRef<Record<'left' | 'top', number>>({
    left: 0,
    top: 0,
  })
  // 裁剪盒子
  const cutBox = useRef<HTMLDivElement>(null)
  // 原始图片
  const pictureDom = useRef<HTMLImageElement>(null)

  /**
   * @description: useState创建的变量
   */
  // 图片高度
  const [imgHeight, setImgHeight] = useState<number>(0)
  // 图片宽度
  const [imgWidth, setImgWidth] = useState<number>(0)
  // 裁剪盒子top值
  const [cutBoxTop, setCutBoxTop] = useState<number>(0)
  // 裁剪盒子top值
  const [cutBoxLeft, setCutBoxLeft] = useState<number>(0)
  // 裁剪盒子top值
  const [cutBoxRight, setCutBoxRight] = useState<number>(0)
  // 裁剪盒子top值
  const [cutBoxBottom, setCutBoxBottom] = useState<number>(0)
  // 裁剪图片信息
  const [currentClipWidth, setCurrentClipWidth] = useState<number>(0)
  const [currentClipHeight, setCurrentClipHeight] = useState<number>(0)
  // 比例尺
  const [comparingRule, setComparingRule] = useState<number>(1)
  // 操作栏操作类型
  const [handleType, setHandleType] = useState<handleValueType>(1)
  // 自定义宽度
  const [customWidth, setCustomWidth] = useState<number>()
  // 自定义高度
  const [customHeight, setCustomHeight] = useState<number>()
  // 显示
  const [visible, setVisible] = useState<boolean>(open)
  // 图片地址
  const [clipImgUrl, setClipImgUrl] = useState<string>()
  // 图片名称
  const [fileName, setFileName] = useState<string>()

  /**
   * @description 裁剪盒子定位坐标
   */
  const getElementPosition = useDebounce(element => {
    if (!element) return
    let top = element.offsetTop // 这是获取元素距父元素顶部的距离
    let left = element.offsetLeft
    let current = element.offsetParent // 这是获取父元素
    while (current) {
      // 当它上面有元素时就继续执行
      top += current.offsetTop // 这是获取父元素距它的父元素顶部的距离累加起来
      left += current.offsetLeft
      current = current.offsetParent // 继续找父元素
    }
    leftTopPos.current.left = left
    leftTopPos.current.top = top
    return {
      top,
      left,
    }
  }, 500)
  /**
   * @description 获取裁剪图片信息
   */
  const getImgClipInfo = (
    imgW: number = imgWidth,
    imgH: number = imgHeight,
    top: number = cutBoxTop,
    right: number = cutBoxRight,
    bottom: number = cutBoxBottom,
    left: number = cutBoxLeft,
    zoom: number = comparingRule,
  ) => {
    const height = imgH - bottom - top
    const width = imgW - right - left
    setCurrentClipWidth(Math.round(width / zoom))
    setCurrentClipHeight(Math.round(height / zoom))
  }
  /**
   * @description 如果存在对裁剪比列的限制且当前图片比例不等于规定比例 需要根据比例设置裁剪框
   */
  const maxAcceptRatio = useCallback(
    (width: number, height: number, ratio: number) => {
      if (width / height === ratio) {
        return { width, height }
      }
      if (width / height < ratio) {
        return { width, height: width / ratio }
      }
      return { width: ratio * height, height }
    },
    [acceptRatio, imgHeight, imgWidth],
  )
  /**
   * @description 根据图片信息设置默认裁剪框与图片一样大
   */
  const setDefaultClip = (imgW: number, imgH: number, zoom: number) => {
    // 存在传入的裁剪盒子尺寸
    if (defaultClipBox && defaultClipBox?.width && defaultClipBox?.height) {
      let width = (defaultClipBox?.width || 0) * zoom
      let height = (defaultClipBox?.height || 0) * zoom
      // 大于图片宽高，即为图片最大宽度
      if (width >= imgW) {
        width = imgW
      }
      if (height >= imgH) {
        height = imgH
      }
      setCutBoxTop(0)
      setCutBoxLeft(0)
      setCutBoxRight(imgW - width)
      setCutBoxBottom(imgH - height)
      getImgClipInfo(imgW, imgH, 0, imgW - width, imgH - height, 0, zoom)
    } else if (acceptRatio) {
      /** 如果存在对裁剪比列的限制且当前图片比例不等于规定比例 需要根据比例设置裁剪框 */
      const { width, height } = maxAcceptRatio(imgW, imgH, acceptRatio)
      setCutBoxTop(0)
      setCutBoxLeft(0)
      setCutBoxRight(imgW - width)
      setCutBoxBottom(imgH - height)
      getImgClipInfo(imgW, imgH, 0, imgW - width, imgH - height, 0, zoom)
    } else {
      setCutBoxTop(0)
      setCutBoxLeft(0)
      setCutBoxRight(0)
      setCutBoxBottom(0)
      getImgClipInfo(imgW, imgH, 0, 0, 0, 0, zoom)
    }
  }
  /**
   * @description 根据base64获取设置图片信息
   */
  const getBaseData = (base64: string) => {
    const image = new Image()
    image.src = base64
    image.onload = () => {
      const imgW = image.width
      const imgH = image.height
      // 计算比例尺
      const zoom = Math.min(containerWidth.current / imgW, containerHeight.current / imgH)
      // zoom = zoom > 1 ? 1 : zoom
      setComparingRule(zoom)
      setImgHeight(imgH * zoom)
      setImgWidth(imgW * zoom)
      setTimeout(() => {
        getElementPosition(cutBox.current)
      })
      setDefaultClip(imgW * zoom, imgH * zoom, zoom)
    }
  }
  /**
   * @description 设置top位置
   */
  const setTop = (top: number, bottom: number = cutBoxBottom, isMove = false) => {
    let value = top
    if (top < 0) {
      value = 0
    } else if (top >= imgHeight && bottom === 0) {
      value = imgHeight
    } else if (top + bottom >= imgHeight) {
      value = imgHeight - bottom
    }
    // 如果存在比例限制 需要等比例缩放
    if (acceptRatio && !isMove) {
      const height = imgHeight - cutBoxBottom - value
      const nWidth = height * acceptRatio
      const { width: maxWidth, height: maxHeight } = maxAcceptRatio(
        imgWidth,
        imgHeight,
        acceptRatio,
      )
      if (height <= maxHeight && nWidth <= maxWidth) {
        setCutBoxRight(imgWidth - cutBoxLeft - nWidth)
        setCutBoxTop(value)
      }
    } else {
      setCutBoxTop(value)
    }
  }
  /**
   * @description 设置right位置
   */
  const setRight = (right: number, left: number = cutBoxLeft, isMove = false) => {
    let value = right
    if (right <= 0) {
      value = 0
    } else if (right >= imgWidth && left === 0) {
      value = imgWidth
    } else if (right + left >= imgWidth) {
      value = imgWidth - left
    }
    // 如果存在比例限制 需要等比例缩放
    if (acceptRatio && !isMove) {
      const width = imgWidth - value - cutBoxLeft
      const nHeight = width / acceptRatio
      const { width: maxWidth, height: maxHeight } = maxAcceptRatio(
        imgWidth,
        imgHeight,
        acceptRatio,
      )
      if (nHeight <= maxHeight && width <= maxWidth) {
        setCutBoxBottom(imgHeight - cutBoxTop - nHeight)
        setCutBoxRight(value)
      }
    } else {
      setCutBoxRight(value)
    }
  }
  /**
   * @description 设置bottom位置
   */
  const setBottom = (bottom: number, top: number = cutBoxTop, isMove = false) => {
    let value = bottom
    if (bottom <= 0) {
      value = 0
    } else if (bottom >= imgHeight && top === 0) {
      value = imgHeight
    } else if (bottom + top >= imgHeight) {
      value = imgHeight - top
    }
    // 如果存在比例限制 需要等比例缩放
    if (acceptRatio && !isMove) {
      const height = imgHeight - value - cutBoxTop
      const nWidth = height * acceptRatio
      const { width: maxWidth, height: maxHeight } = maxAcceptRatio(
        imgWidth,
        imgHeight,
        acceptRatio,
      )
      if (height <= maxHeight && nWidth <= maxWidth) {
        setCutBoxRight(imgWidth - cutBoxLeft - nWidth)
        setCutBoxBottom(value)
      }
    } else {
      setCutBoxBottom(value)
    }
  }
  /**
   * @destription 设置left位置
   */
  const setLeft = (left: number, right: number = cutBoxRight, isMove = false) => {
    let value = left
    if (left < 0) {
      value = 0
    } else if (left >= imgWidth && right === 0) {
      value = imgWidth
    } else if (left + right >= imgWidth) {
      value = imgWidth - right
    }
    // 如果存在比例限制 需要等比例缩放
    if (acceptRatio && !isMove) {
      const width = imgWidth - cutBoxRight - value
      const nHeight = width / acceptRatio
      const { width: maxWidth, height: maxHeight } = maxAcceptRatio(
        imgWidth,
        imgHeight,
        acceptRatio,
      )
      if (nHeight <= maxHeight && width <= maxWidth) {
        setCutBoxBottom(imgHeight - cutBoxTop - nHeight)
        setCutBoxLeft(value)
      }
    } else {
      setCutBoxLeft(value)
    }
  }
  /**
   * @description 处理裁剪盒子位置逻辑，对每个位置执行不同操作
   */
  const resizeDown = (clientX: number, clientY: number, type: string) => {
    switch (type) {
      case 'topleft':
        setTop(clientY - leftTopPos.current.top)
        setLeft(clientX - leftTopPos.current.left)
        break
      case 'topright':
        setTop(clientY - leftTopPos.current.top)
        setRight(leftTopPos.current.left + imgWidth - clientX)
        break
      case 'bottomleft':
        setBottom(leftTopPos.current.top + imgHeight - clientY)
        setLeft(clientX - leftTopPos.current.left)
        break
      case 'bottomright':
        setRight(leftTopPos.current.left + imgWidth - clientX)
        setBottom(leftTopPos.current.top + imgHeight - clientY)
        break
      case 'topmiddle':
        setTop(clientY - leftTopPos.current.top)
        break
      case 'bottommiddle':
        setBottom(leftTopPos.current.top + imgHeight - clientY)
        break
      case 'leftmiddle':
        setLeft(clientX - leftTopPos.current.left)
        break
      case 'rightmiddle':
        setRight(leftTopPos.current.left + imgWidth - clientX)
        break
      default:
        break
    }
  }
  /**
   * @description 手动拖拽改变裁剪框大小
   */
  const handlePointer = (e: React.MouseEvent, type: string) => {
    e.stopPropagation()

    // 自定义中输入尺寸和固定尺寸不允许手动调节边框
    if (handleType === handleValueType.custom || clipMethod === clipMethodType.fixed) return
    isResizeDown.current = true
    if (isResizeDown.current) {
      document.onmousemove = docEvent => {
        resizeDown(docEvent.clientX, docEvent.clientY, type)
      }
      document.onmouseup = () => {
        document.onmousemove = () => {}
        isResizeDown.current = false
      }
    }
  }
  /**
   * @description 裁剪盒子的移动逻辑
   */
  const cutBoxMouseDown = (event: React.MouseEvent) => {
    event.stopPropagation()
    isMoveDown.current = true
    // 获取剪裁盒子宽高
    const cutBoxHeight = imgHeight - cutBoxBottom - cutBoxTop
    const cutBoxWidth = imgWidth - cutBoxRight - cutBoxLeft
    document.onmousemove = docEvent => {
      const disX = docEvent.clientX - event.clientX
      const disY = docEvent.clientY - event.clientY
      let top = cutBoxTop + disY
      let left = cutBoxLeft + disX
      // 处理边界问题
      if (top >= imgHeight - cutBoxHeight) {
        top = imgHeight - cutBoxHeight
      } else if (top <= 0) {
        top = 0
      }
      if (left >= imgWidth - cutBoxWidth) {
        left = imgWidth - cutBoxWidth
      } else if (left <= 0) {
        left = 0
      }
      const bottom = imgHeight - cutBoxHeight - top
      const right = imgWidth - left - cutBoxWidth
      if (isMoveDown.current) {
        setBottom(bottom, top, true)
        setRight(right, left, true)
        setTop(top, bottom, true)
        setLeft(left, right, true)
      }
      docEvent.preventDefault()
    }
    document.onmouseup = () => {
      isMoveDown.current = false
    }
  }
  /**
   * @description 操作方式改变
   */
  const onHandleTypeChange = (value: handleValueType) => {
    setHandleType(value)
    if (value === 2) {
      setCustomWidth(currentClipWidth)
      setCustomHeight(currentClipHeight)
    } else {
      setCustomWidth(undefined)
      setCustomHeight(undefined)
    }
  }
  /**
   * @description 自定义宽度改变
   */
  const customWidthChnage = (value: number | null) => {
    if (value) {
      if (acceptRatio) {
        let nHeight = value / acceptRatio
        const { width, height } = maxAcceptRatio(imgWidth, imgHeight, acceptRatio)
        if (value > width / comparingRule || nHeight > height / comparingRule) {
          nHeight = height
          // eslint-disable-next-line no-param-reassign
          value = width
        }
        setCustomWidth(value)
        setCustomHeight(nHeight)
      } else {
        setCustomWidth(value)
      }
    }
  }
  /**
   * @description 自定义高度改变
   */
  const customHeightChange = (value: number | null) => {
    if (value) {
      if (acceptRatio) {
        let nWidth = value * acceptRatio
        const { width, height } = maxAcceptRatio(imgWidth, imgHeight, acceptRatio)
        if (value > height / comparingRule || nWidth > width / comparingRule) {
          nWidth = width
          // eslint-disable-next-line no-param-reassign
          value = height
        }
        setCustomHeight(value)
        setCustomWidth(nWidth)
      } else {
        setCustomHeight(value)
      }
    }
  }
  /**
   * @description 确定自定义
   */
  const comfirmCustom = () => {
    if (customWidth && customHeight) {
      const width = customWidth * comparingRule
      const height = customHeight * comparingRule
      setCutBoxTop(0)
      setCutBoxLeft(0)
      setCutBoxRight(imgWidth - width)
      setCutBoxBottom(imgHeight - height)
    }
  }
  /**
   * @description 创建画布
   */
  const createNewCanvas = (content: ImageData, width: number, height: number) => {
    const nCanvas = document.createElement('canvas')
    const nCtx = nCanvas.getContext('2d')
    nCanvas.width = width
    nCanvas.height = height
    nCtx!.putImageData(content, 0, 0) // 将画布上指定矩形的像素数据，通过 putImageData() 方法将图像数据放回画布
    return nCanvas.toDataURL(imgType.current, encoderOptions)
  }
  /**
   * @description 确认裁剪
   */
  const comfirmClip = () => {
    if (currentClipWidth === 0 || currentClipHeight === 0) {
      message.warning('请裁剪正确尺寸的图片！！！')
      return
    }
    // 可能存在图片还未加载完成，所以需要延迟一下
    if (!pictureDom.current) return
    const copyCanvas = document.createElement('canvas')
    const ctx = copyCanvas.getContext('2d')
    // 还原图片
    const imgH = imgHeight / comparingRule
    const imgW = imgWidth / comparingRule
    copyCanvas.height = imgH
    copyCanvas.width = imgW
    ctx!.drawImage(pictureDom.current, 0, 0, imgW, imgH)

    const cutImage = ctx!.getImageData(
      cutBoxLeft / comparingRule,
      cutBoxTop / comparingRule,
      currentClipWidth,
      currentClipHeight,
    )
    const newImageBase64 = createNewCanvas(cutImage, currentClipWidth, currentClipHeight)
    // 将裁剪后的图片保存到本地
    saveImageToFile(newImageBase64, fileName || 'clippedPicture').then(() => {})
    // 获取图片对应的file对象
    getImageFileFromUrl(resource, newImageBase64, imgType).then(file => {
      // 裁剪结束执行的回调
      onClip?.({
        url: newImageBase64,
        width: currentClipWidth,
        height: currentClipHeight,
        file,
      })
      setVisible(false)
      onClose?.('clip')
    })
  }

  /**
   * @description: 用到useEffect的情况
   */
  // 默认打开的情况初始化为手动尺寸
  useEffect(() => {
    if (visible && clipMethod === clipMethodType.custom) {
      onHandleTypeChange(handleValueType.manual)
    }
  }, [visible, clipMethod])
  // 屏幕宽度改变时，重新计算定位
  useEffect(() => {
    window.addEventListener('resize', () => {
      getElementPosition(cutBox.current)
    })
  }, [])
  // 将图片转为base64
  useEffect(() => {
    setVisible(open)
    if (open) {
      // 获取图片的名称--如果传入imgName，则使用传入的名称，否则使用图片的名称
      if (imgName) {
        setFileName(imgName)
      } else {
        setFileName(getFileName(resource))
      }
      // 如果传入的是文件类型，则要转为base64
      if (resource instanceof File) {
        imgType.current = resource.type
        imageFileToBase64(resource, base64 => {
          getBaseData(base64)
          setClipImgUrl(base64)
        })
      } else if (typeof resource === 'string') {
        if (resource.startsWith('http')) {
          // 线上图片，也需要转成base64，否则canvas有跨域问题
          const arr = resource.split('.')
          imgType.current = `image/${arr[arr.length - 1]}`
          // 此时的resource是图片的url
          const url = resource
          getImageFileFromUrl(resource, url, imgType).then(res => {
            imageFileToBase64(res, base64 => {
              getBaseData(base64)
              setClipImgUrl(base64)
            })
          })
        } else if (resource.startsWith('data:')) {
          getBaseData(resource)
          setClipImgUrl(resource)
        }
      }
    }
  }, [open, resource])
  // 获得裁剪的图片宽高
  useEffect(() => {
    // 判断是否正在移动盒子中
    if (!isMoveDown.current) {
      getImgClipInfo()
    }
  }, [cutBoxTop, cutBoxLeft, cutBoxRight, cutBoxBottom])
  // 裁剪方式为固定尺寸时，需传入默认的裁剪框大小否则报错
  useEffect(() => {
    if (clipMethod === clipMethodType.fixed) {
      if (!defaultClipBox || !defaultClipBox?.width || !defaultClipBox?.height) {
        throw new Error('裁剪方式为固定尺寸时，需传入默认的裁剪框大小')
      }
    }
  }, [clipMethod])

  return (
    <>
      {visible && (
        <div className='custom-mask'>
          <div className='content-box'>
            <div className='picture-clip'>
              <CloseCircleOutlined
                onClick={() => {
                  setVisible(false)
                  onClose?.('close')
                }}
                className='picture-clip-close'
              />
              <div
                style={{
                  height: `${containerHeight.current}px`,
                  width: `${containerWidth.current}px`,
                }}
                className='picture-clip-img-container'
              >
                <div
                  style={{ height: `${imgHeight}px`, width: `${imgWidth}px` }}
                  className='picture-clip-img-warp'
                >
                  <img
                    style={{ height: `${imgHeight}px`, width: `${imgWidth}px` }}
                    ref={pictureDom}
                    className='picture-clip-img-bg'
                    src={clipImgUrl}
                  />
                  <img
                    style={{
                      clipPath: `polygon(${cutBoxLeft}px ${cutBoxTop}px,${
                        imgWidth - cutBoxRight
                      }px ${cutBoxTop}px,${imgWidth - cutBoxRight}px ${
                        imgHeight - cutBoxBottom
                      }px,${cutBoxLeft}px ${imgHeight - cutBoxBottom}px)`,
                      height: `${imgHeight}px`,
                      width: `${imgWidth}px`,
                    }}
                    className='picture-clip-img-show'
                    src={clipImgUrl}
                  />
                  <div
                    style={{
                      top: `${cutBoxTop}px`,
                      left: `${cutBoxLeft}px`,
                      bottom: `${cutBoxBottom}px`,
                      right: `${cutBoxRight}px`,
                      cursor: 'move',
                    }}
                    ref={cutBox}
                    onMouseDown={cutBoxMouseDown}
                    className='picture-cut-box'
                  >
                    {!acceptRatio && (
                      <>
                        <div
                          onMouseDown={e => {
                            handlePointer(e, 'topleft')
                          }}
                          className='box-corner topleft'
                          style={{ cursor: 'nwse-resize' }}
                        />
                        <div
                          onMouseDown={e => {
                            handlePointer(e, 'topright')
                          }}
                          className='box-corner topright'
                          style={{ cursor: 'nesw-resize' }}
                        />
                        <div
                          onMouseDown={e => {
                            handlePointer(e, 'bottomright')
                          }}
                          className='box-corner bottomright'
                          style={{ cursor: 'nwse-resize' }}
                        />
                        <div
                          onMouseDown={e => {
                            handlePointer(e, 'bottomleft')
                          }}
                          className='box-corner bottomleft'
                          style={{ cursor: 'nesw-resize' }}
                        />
                      </>
                    )}
                    <div
                      onMouseDown={e => {
                        handlePointer(e, 'topmiddle')
                      }}
                      className='box-middle topmiddle'
                      style={{ cursor: 'row-resize' }}
                    />
                    <div
                      onMouseDown={e => {
                        handlePointer(e, 'bottommiddle')
                      }}
                      className='box-middle bottommiddle'
                      style={{ cursor: 'row-resize' }}
                    />
                    <div
                      onMouseDown={e => {
                        handlePointer(e, 'leftmiddle')
                      }}
                      className='box-middle leftmiddle'
                      style={{ cursor: 'col-resize' }}
                    />
                    <div
                      onMouseDown={e => {
                        handlePointer(e, 'rightmiddle')
                      }}
                      className='box-middle rightmiddle'
                      style={{ cursor: 'col-resize' }}
                    />
                  </div>

                  {clipMethod === clipMethodType.custom && (
                    <div className='img-clip-info'>
                      <Card>
                        <div className='pixel-info'>
                          宽（像素）：{currentClipWidth} 高（像素）：
                          {currentClipHeight}
                        </div>
                        <Space direction='vertical'>
                          <Radio.Group
                            onChange={(e: RadioChangeEvent) => onHandleTypeChange(e.target.value)}
                            value={handleType}
                          >
                            <Space direction='vertical'>
                              <Radio value={handleValueType.manual}>手动尺寸</Radio>
                              <Radio value={handleValueType.custom}>输入尺寸</Radio>
                            </Space>
                          </Radio.Group>
                          <Space>
                            <InputNumber
                              min={1}
                              precision={0}
                              disabled={handleType !== handleValueType.custom}
                              max={imgWidth / comparingRule}
                              value={customWidth}
                              onChange={customWidthChnage}
                            />
                            *
                            <InputNumber
                              value={customHeight}
                              min={1}
                              precision={0}
                              disabled={handleType !== handleValueType.custom}
                              max={imgHeight / comparingRule}
                              onChange={customHeightChange}
                            />
                            <Button
                              disabled={handleType !== handleValueType.custom}
                              onClick={comfirmCustom}
                              block={false}
                              shape='round'
                              type='primary'
                            >
                              确认
                            </Button>
                          </Space>
                          <Button shape='round' onClick={comfirmClip} type='primary'>
                            确认裁剪
                          </Button>
                        </Space>
                      </Card>
                    </div>
                  )}
                </div>
              </div>
              {clipMethod !== clipMethodType.custom && (
                <Button
                  onClick={comfirmClip}
                  className='picture-clip-btn'
                  block={false}
                  type='primary'
                >
                  确认裁剪
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PictureClip
