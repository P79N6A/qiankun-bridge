export const isDuplicate = (keys: string[], key: string): boolean => keys.includes(key) // 查重

export const array2obj = (array: any[], primaryKey: string = 'key') => {
  const obj: any = {}
  array.forEach((item, index) => {
    const keyValue = item[primaryKey]
    obj[keyValue] = item
  })
  return obj
}