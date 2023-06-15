// 二分查找
const binarySearch = (list: any[], value: any) => {
  let start: number = 0
  let end: number = list.length - 1
  let tempIndex = null
  while (start <= end) {
    let midIndex = parseInt(String((start + end) / 2))
    let midValue = list[midIndex].bottom
    if (midValue === value) {
      return midIndex + 1
    } else if (midValue < value) {
      start = midIndex + 1
    } else if (midValue > value) {
      if (tempIndex === null || tempIndex > midIndex) {
        tempIndex = midIndex
      }
      end = end - 1
    }
  }
  return tempIndex
}

export default binarySearch
