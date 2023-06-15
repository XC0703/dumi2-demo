import { MutableRefObject } from 'react'

/**
 * @description 图片文件转base64
 * @param file
 * @param callBack
 */
export const imageFileToBase64 = (file: File, callBack: (url: string) => void) => {
  const reader = new FileReader()
  reader.addEventListener(
    'load',
    () => {
      callBack?.(reader.result as string)
    },
    false,
  )
  reader.readAsDataURL(file)
}

/**
 * @description 根据图片url获取图片文件(包括网络图片和base64形式的url图片)
 * @param file
 * @param callBack
 * @param imgType
 */
export const getImageFileFromUrl = (
  resource: string | File,
  url: string,
  imgType: MutableRefObject<string>,
) => {
  let imageName = ''
  // 截取图片名称
  if (typeof resource === 'string' && resource.startsWith('http')) {
    const arr = resource.split('/')
    imageName = arr[arr.length - 1]
  }
  if (resource instanceof File) {
    imageName = resource.name
  }
  const suffixName = imageName

  return new Promise<File>((resolve, reject) => {
    let blob = null
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.setRequestHeader('Accept', imgType.current)
    xhr.responseType = 'blob'
    xhr.onload = () => {
      blob = xhr.response
      const imgFile = new File([blob], suffixName, { type: imgType.current })
      resolve(imgFile)
    }
    xhr.onerror = e => {
      reject(e)
    }
    xhr.send()
  })
}
/**
 * @description 保存图片到本地
 * @param imageData
 * @param filename
 */
export const saveImageToFile = (imageData: string, filename: string) => {
  return new Promise<void>(resolve => {
    const anchorEl = document.createElement('a')
    anchorEl.href = imageData
    anchorEl.download = filename
    document.body.appendChild(anchorEl)
    anchorEl.click()
    document.body.removeChild(anchorEl)
    resolve()
  })
}
/**
 * @description 获取图片名称
 * @param image
 */
export const getFileName = (image: string | File) => {
  if (typeof image === 'string') {
    return image.split('/').pop() // 如果是字符串链接，则以"/"分割字符串并返回最后一个元素
  } else if (image instanceof File) {
    return image.name // 如果是文件类型，则返回文件的名称属性
  } else {
    return undefined // 如果都不是则返回null
  }
}
