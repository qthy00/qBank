// copy to vben-admin

const toString = Object.prototype.toString

export const is = (val: unknown, type: string) => {
  return toString.call(val) === `[object ${type}]`
}

export const isDef = <T = unknown>(val?: T): val is T => {
  return typeof val !== 'undefined'
}

export const isUnDef = <T = unknown>(val?: T): val is T => {
  return !isDef(val)
}

export const isObject = (val: any): val is Record<any, any> => {
  return val !== null && is(val, 'Object')
}

export const isEmpty = (val: any): boolean => {
  if (val === null || val === undefined || typeof val === 'undefined') {
    return true
  }
  if (isArray(val) || isString(val)) {
    return val.length === 0
  }

  if (val instanceof Map || val instanceof Set) {
    return val.size === 0
  }

  if (isObject(val)) {
    return Object.keys(val).length === 0
  }

  return false
}

export const isDate = (val: unknown): val is Date => {
  return is(val, 'Date')
}

export const isNull = (val: unknown): val is null => {
  return val === null
}

export const isNullAndUnDef = (val: unknown): val is null | undefined => {
  return isUnDef(val) && isNull(val)
}

export const isNullOrUnDef = (val: unknown): val is null | undefined => {
  return isUnDef(val) || isNull(val)
}

export const isNumber = (val: any): boolean => {
  if(!val) return false
  if(typeof val === 'number') return true
  return !isNaN(Number(val))
}

export const isStringNumber = (val: string): boolean => {
  if (!isString(val)) {
    return false
  }
  return !Number.isNaN(Number(val))
}


export const isPromise = <T = any>(val: unknown): val is Promise<T> => {
  return is(val, 'Promise') && isObject(val) && isFunction(val.then) && isFunction(val.catch)
}

export const isString = (val: unknown): val is string => {
  return is(val, 'String')
}

export const isFunction = (val: unknown): val is (...args: any[]) => any => {
  return typeof val === 'function'
}

export const isBoolean = (val: unknown): val is boolean => {
  return is(val, 'Boolean')
}

export const isRegExp = (val: unknown): val is RegExp => {
  return is(val, 'RegExp')
}

export const isArray = (val: any): val is Array<any> => {
  return val && Array.isArray(val)
}

export const isWindow = (val: any): val is Window => {
  return typeof window !== 'undefined' && is(val, 'Window')
}

export const isElement = (val: unknown): val is Element => {
  return isObject(val) && !!val.tagName
}

export const isMap = (val: unknown): val is Map<any, any> => {
  return is(val, 'Map')
}

export const isServer = typeof window === 'undefined'

export const isClient = !isServer

export const isUrl = (path: string): boolean => {
  const reg =
  /(((^https?:(?:\/\/)?)(?:[-:&=+$ ,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-:&=+$ ,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%#/.\w-_]*)?\??(?:[-+=&%@.\w_]*)#?(?:[\w]*))?)$/
  return reg.test(path)
}

export const isDark = (): boolean => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

// 是否是图片链接
export const isImgPath = (path: string): boolean => {
  return /(https?:\/\/|data:image\/).*?\.(png|jpg|jpeg|gif|svg|webp|ico)/gi.test(path)
}

export const isImage = (filename: string): boolean =>  {
  if (!filename || filename.indexOf('.') < 0) {
    return false;
  }
  const suffix = filename.substring(filename.lastIndexOf('.'));
  return ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.tiff', '.svg'].indexOf(suffix) > -1
}

export const isEmptyVal = (val: any): boolean => {
  return val === '' || val === null || val === undefined
}

export const isExternal = (path: string) => {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export const isEmail = (email: string) => {
  return /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(email)
}

export const isMobileNumber = (mobile: string) => {
  return  /^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(mobile)
}
// 检查MD5格式是否有效
export function isValidMd5(md5: string): boolean {
  return /^[0-9a-fA-F]{32}$/.test(md5) || /^[0-9a-fA-F]{64}$/.test(md5)
}

/**
 * 判断是否为微信浏览器
 * @returns boolean
 */
export function isWxBrowser(): boolean {
  if (typeof navigator === 'undefined') {
    return false;
  }
  return /MicroMessenger/i.test(navigator.userAgent)
}

/**
 * 判断是否为移动端（H5端）
 * @returns boolean
 */
export function isMobile(): boolean {
  if (typeof navigator === 'undefined') {
    return false;
  }
  const isMobileAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  // 结合屏幕宽度判断
  const isSmallScreen = window.innerWidth <= 768
  // 检测常见移动设备的User Agent
  return isMobileAgent || isSmallScreen
}


/**
 * 比较两个数组（原始类型元素）是否值一致（不拘顺序、个数相同）
 * @param arr1 第一个数组
 * @param arr2 第二个数组
 * @returns 布尔值：true=一致，false=不一致
 */
export function isArrayValueEqual<T extends number | string | boolean | null | undefined>(arr1: T[], arr2: T[]): boolean {
  // 1. 先判断长度：长度不同直接返回false（快速排除）
  if (arr1.length !== arr2.length) return false;

  // 2. 用Map统计第一个数组的元素频次
  const valueCountMap = new Map<T, number>();
  for (const value of arr1) {
    // 统计：存在则次数+1，不存在则初始化为1
    valueCountMap.set(value, (valueCountMap.get(value) || 0) + 1);
  }

  // 3. 遍历第二个数组，抵消频次
  for (const value of arr2) {
    // 若元素不在Map中，或频次已为0（说明数量不匹配），直接返回false
    if (!valueCountMap.has(value) || valueCountMap.get(value) === 0) {
      return false;
    }
    // 频次-1
    valueCountMap.set(value, valueCountMap.get(value)! - 1);
  }

  // 4. 所有元素频次抵消完毕，返回true
  return true;
}
