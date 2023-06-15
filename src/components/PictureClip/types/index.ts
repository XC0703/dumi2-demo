// 图片裁剪的坐标类型
// Record是TypeScript中的一个内置工具类型（Utility Type），用于创建一个具有一组指定属性的新类型。它接受两个类型参数：第一个参数是一个字符串字面量类型，表示新类型中的属性名，第二个参数则是该属性名所对应的属性值类型。
export type handleParam = Record<'clientX' | 'clientY', number>

// 操作类型--手动/自定义
export enum handleValueType {
  manual = 1,
  custom,
}
export enum clipMethodType {
  manual = 'manual', // 手动
  fixed = 'fixed', // 固定
  custom = 'custom', // 自定义
}

// 图片裁剪时接受的参数类型
export interface IPictureClipProps {
  resource: string | File
  onClip?: (clipInfo: { url: string; width: number; height: number; file: File }) => void
  encoderOptions?: number // 裁剪后图片的质量（0-1）
  defaultClipBox?: {
    // 默认初始化裁剪框大小
    width: number
    height: number
  }
  clipMethod?: 'manual' | 'fixed' | 'custom'
  imgName?: string
  open: boolean // 显示裁剪面板
  // 固定接受的裁剪比例
  acceptRatio?: number
  onClose?: (position: 'close' | 'clip') => void
}
