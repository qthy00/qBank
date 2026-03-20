import {toNumber} from 'lodash-es'


/**
 *
 * @param component 需要注册的组件
 * @param alias 组件别名
 * @returns any
 */
export const withInstall = <T>(component: T, alias?: string) => {
  const comp = component as any
  comp.install = (app: any) => {
    app.component(comp.name || comp.displayName, component)
    if (alias) {
      app.config.globalProperties[alias] = component
    }
  }
  return component as T & Plugin
}

/**
 * @param str 需要转下划线的驼峰字符串
 * @returns 字符串下划线
 */
export const humpToUnderline = (str: string): string => {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

/**
 * @param str 需要转驼峰的下划线字符串
 * @returns 字符串驼峰
 */
export const underlineToHump = (str: string): string => {
  if (!str) return ''
  return str.replace(/\-(\w)/g, (_, letter: string) => {
    return letter.toUpperCase()
  })
}

/**
 * 驼峰转横杠
 */
export const humpToDash = (str: string): string => {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

export const setCssVar = (prop: string, val: any, dom = document.documentElement) => {
  dom.style.setProperty(prop, val)
}

/**
 * 查找数组对象的某个下标
 * @param {Array} ary 查找的数组
 * @param {Functon} fn 判断的方法
 */
// eslint-disable-next-line
export const findIndex = <T = Recordable>(ary: Array<T>, fn: Fn): number => {
  if (ary.findIndex) {
    return ary.findIndex(fn)
  }
  let index = -1
  ary.some((item: T, i: number, ary: Array<T>) => {
    const ret: T = fn(item, i, ary)
    if (ret) {
      index = i
      return ret
    }
  })
  return index
}

export const trim = (str: string) => {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}


/**
 * 生成随机字符串
 */
export function toAnyString() {
  return 'xxxxx-xxxxx-4xxxx-yxxxx-xxxxx'.replace(/[xy]/g, (c: string) => {
    const r: number = (Math.random() * 16) | 0
    const v: number = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString()
  })
}

/**
 * 首字母大写
 */
export function firstUpperCase(str: string) {
  return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
}

export const generateUUID = () => {
  if (typeof crypto === 'object') {
    if (typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID()
    }
    if (typeof crypto.getRandomValues === 'function' && typeof Uint8Array === 'function') {
      const callback = (c: any) => {
        const num = Number(c)
        return (num ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (num / 4)))).toString(
          16,
        )
      }
      return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, callback)
    }
  }
  let timestamp = new Date().getTime()
  let performanceNow =
    (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    let random = Math.random() * 16
    if (timestamp > 0) {
      random = (timestamp + random) % 16 | 0
      timestamp = Math.floor(timestamp / 16)
    } else {
      random = (performanceNow + random) % 16 | 0
      performanceNow = Math.floor(performanceNow / 16)
    }
    return (c === 'x' ? random : (random & 0x3) | 0x8).toString(16)
  })
}

/**
 * element plus 的文件大小 Formatter 实现
 *
 * @param cellValue 字段值
 */
// @ts-ignore
export const fileSizeFormatter = (cellValue: string | number) => {
  const fileSize = cellValue
  const unitArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const srcSize = parseFloat(fileSize as string)
  const index = Math.floor(Math.log(srcSize) / Math.log(1024))
  const size = srcSize / Math.pow(1024, index)
  const sizeStr = size.toFixed(2) //保留的小数位数
  return sizeStr + ' ' + unitArr[index]
}

/**
 * 将值复制到目标对象，且以目标对象属性为准，例：target: {a:1} source:{a:2,b:3} 结果为：{a:2}
 * @param target 目标对象
 * @param source 源对象
 */
export const copyValueToTarget = (target: any, source: any) => {
  const newObj = Object.assign({}, target, source)
  // 删除多余属性
  Object.keys(newObj).forEach((key) => {
    // 如果不是target中的属性则删除
    if (Object.keys(target).indexOf(key) === -1) {
      delete newObj[key]
    }
  })
  // 更新目标对象值
  Object.assign(target, newObj)
}

/**
 * 获取链接的参数值
 * @param key 参数键名
 * @param urlStr 链接地址，默认为当前浏览器的地址
 */
export const getUrlValue = (key: string, urlStr: string = location.href): string => {
  if (!urlStr || !key) return ''
  const url = new URL(decodeURIComponent(urlStr))
  return url.searchParams.get(key) ?? ''
}

/**
 * 获取链接的参数值（值类型）
 * @param key 参数键名
 * @param urlStr 链接地址，默认为当前浏览器的地址
 */
export const getUrlNumberValue = (key: string, urlStr: string = location.href): number => {
  return toNumber(getUrlValue(key, urlStr))
}

/**
 * 构建排序字段
 * @param prop 字段名称
 * @param order 顺序
 */
export const buildSortingField = ({ prop, order }) => {
  return { field: prop, order: order === 'ascending' ? 'asc' : 'desc' }
}

// ========== NumberUtils 数字方法 ==========

/**
 * 数组求和
 *
 * @param values 数字数组
 * @return 求和结果，默认为 0
 */
export const getSumValue = (values: number[]): number => {
  return values.reduce((prev, curr) => {
    const value = Number(curr)
    if (!Number.isNaN(value)) {
      return prev + curr
    } else {
      return prev
    }
  }, 0)
}

// ========== 金额转换工具函数 ==========

/**
 * 分转元
 * 将分为单位的金额转换为元，保留2位小数
 * @param fen 金额（分）
 * @returns 格式化后的金额字符串（元）
 * @example fenToYuan(100) // "1.00"
 * @example fenToYuan(599) // "5.99"
 */
export const fenToYuan = (fen: string | number): string => {
  if (fen === '' || fen === null || fen === undefined) return '0.00'
  const num = typeof fen === 'string' ? parseFloat(fen) : fen
  if (isNaN(num)) return '0.00'
  return (num / 100).toFixed(2)
}

/**
 * 元转分
 * 将元为单位的金额转换为分，四舍五入取整
 * @param yuan 金额（元）
 * @returns 整数金额（分）
 * @example yuanToFen(1.00) // 100
 * @example yuanToFen(5.99) // 599
 */
export const yuanToFen = (yuan: string | number): number => {
  if (yuan === '' || yuan === null || yuan === undefined) return 0
  const num = typeof yuan === 'string' ? parseFloat(yuan) : yuan
  if (isNaN(num)) return 0
  return Math.round(num * 100)
}

/**
 * 格式化金额显示
 * 将数字格式化为保留2位小数的金额字符串
 * @param amount 金额
 * @returns 格式化后的金额字符串
 * @example formatAmount(100) // "100.00"
 * @example formatAmount(5.9) // "5.90"
 */
export const formatAmount = (amount: string | number | undefined): string => {
  if (amount === '' || amount === null || amount === undefined) return '0.00'
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  if (isNaN(num)) return '0.00'
  return num.toFixed(2)
}

/**
 * 计算环比
 *
 * @param value 当前数值
 * @param reference 对比数值
 */
export const calculateRelativeRate = (value?: number, reference?: number) => {
  // 防止除0
  if (!reference || reference == 0) return 0

  return ((100 * ((value || 0) - reference)) / reference).toFixed(0)
}

// ========== ERP 专属方法 ==========

const ERP_COUNT_DIGIT = 3
const ERP_PRICE_DIGIT = 2

/**
 * 【ERP】格式化 Input 数字
 *
 * 例如说：库存数量
 *
 * @param num 数量
 * @package digit 保留的小数位数
 * @return 格式化后的数量
 */
export const erpNumberFormatter = (num: number | string | undefined, digit: number) => {
  if (num == null) {
    return ''
  }
  if (typeof num === 'string') {
    num = parseFloat(num)
  }
  // 如果非 number，则直接返回空串
  if (isNaN(num)) {
    return ''
  }
  return num.toFixed(digit)
}

/**
 * 【ERP】格式化数量，保留三位小数
 *
 * 例如说：库存数量
 *
 * @param num 数量
 * @return 格式化后的数量
 */
export const erpCountInputFormatter = (num: number | string | undefined) => {
  return erpNumberFormatter(num, ERP_COUNT_DIGIT)
}

// noinspection JSCommentMatchesSignature
/**
 * 【ERP】格式化数量，保留三位小数
 *
 * @param cellValue 数量
 * @return 格式化后的数量
 */
export const erpCountTableColumnFormatter = (_, __, cellValue: any, ___) => {
  return erpNumberFormatter(cellValue, ERP_COUNT_DIGIT)
}

/**
 * 【ERP】格式化金额，保留二位小数
 *
 * 例如说：库存数量
 *
 * @param num 数量
 * @return 格式化后的数量
 */
export const erpPriceInputFormatter = (num: number | string | undefined) => {
  return erpNumberFormatter(num, ERP_PRICE_DIGIT)
}

// noinspection JSCommentMatchesSignature
/**
 * 【ERP】格式化金额，保留二位小数
 *
 * @param cellValue 数量
 * @return 格式化后的数量
 */
export const erpPriceTableColumnFormatter = (_, __, cellValue: any, ___) => {
  return erpNumberFormatter(cellValue, ERP_PRICE_DIGIT)
}

/**
 * 【ERP】价格计算，四舍五入保留两位小数
 *
 * @param price 价格
 * @param count 数量
 * @return 总价格。如果有任一为空，则返回 undefined
 */
export const erpPriceMultiply = (price: number, count: number) => {
  if (price == null || count == null) {
    return undefined
  }
  return parseFloat((price * count).toFixed(ERP_PRICE_DIGIT))
}

/**
 * 【ERP】百分比计算，四舍五入保留两位小数
 *
 * 如果 total 为 0，则返回 0
 *
 * @param value 当前值
 * @param total 总值
 */
export const erpCalculatePercentage = (value: number, total: number) => {
  if (total === 0) return 0
  return ((value / total) * 100).toFixed(2)
}

/**
 * 适配 echarts map 的地名
 *
 * @param areaName 地区名称
 */
export const areaReplace = (areaName: string) => {
  if (!areaName) {
    return areaName
  }
  return areaName
    .replace('维吾尔自治区', '')
    .replace('壮族自治区', '')
    .replace('回族自治区', '')
    .replace('自治区', '')
    .replace('省', '')
}

/**
 * 解析 JSON 字符串
 *
 * @param str
 */
export function jsonParse(str: string) {
  try {
    return JSON.parse(str)
  } catch (e) {
    console.error(`str[${str}] 不是一个 JSON 字符串`)
    return ''
  }
}

export const maskEmail = (email: string) => email.replace(/^(.{2}).+(@.+)$/, '$1******$2')
export const maskPhone = (phone: string) => phone.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
export const maskQQ = (qq: string) => `QQ****${qq}`

/**
 * 高亮关键词
 * @param text 要处理的文本
 * @param keyword 要高亮的关键词
 * @param tag 可选，高亮包裹的标签，默认是 <mark>
 * @returns 已包裹高亮标签的 HTML 字符串
 */
export function highlightKeyword(text: string, keyword: string, tag: string = 'mark'): string {
  if (!keyword.trim()) return text

  // 转义正则特殊字符
  const escapedKeyword = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
  const regex = new RegExp(escapedKeyword, 'gi')

  const openTag = `<${tag}>`
  const closeTag = `</${tag}>`

  return text.replace(regex, (match) => `${openTag}${match}${closeTag}`)
}

// 复制到剪贴板
export const copyToClipboard = async (val?: string) => {
  if (!val) return
  const message = useMessage()
  try{
    await navigator.clipboard.writeText(val)
    message.success('结果已复制到剪贴板')
  } catch (error) {
    message.error('复制失败，请手动复制')
  }
}

/**
 * 通用下载函数
 * @param options 下载参数
 *  - content: 字符串或 Blob（用于生成文件）
 *  - url: 远程文件地址（可选，content 和 url 至少传一个）
 *  - filename: 文件名（必填）
 *  - mimeType: MIME 类型（用于 Blob，仅当 content 存在时使用）
 */
export const downloadFile = (options: {
  content?: string | Blob
  url?: string
  filename: string
  mimeType?: string
}) => {
  const { content, url, filename, mimeType = 'text/plain' } = options
  const message = useMessage()

  try {
    let downloadUrl = ''

    if (content) {
      const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType })
      downloadUrl = URL.createObjectURL(blob)
    } else if (url) {
      downloadUrl = url
    } else {
      throw new Error('请提供 content 或 url 中的一个')
    }

    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // 若是 blob，需要释放 URL
    if (content) {
      URL.revokeObjectURL(downloadUrl)
    }
  } catch (err: any) {
    console.error('下载失败:', err)
    message.error(`下载失败: ${err.message || '未知错误'}`)
  }
}


export function stripHtmlTags(str) {
  // 检查输入是否为字符串
  if (typeof str !== 'string') {
    return str;
  }

  // 正则表达式匹配所有HTML标签并替换为空
  // /<[^>]*>/g 匹配所有以<开头、>结尾的标签
  return str.replace(/<[^>]*>/g, '');
}


/**
 * 将100以内的整数转换为中文数字表示
 * @param num 要转换的数字，必须是1-99之间的整数
 * @returns 中文数字字符串，如12转换为"十二"
 * @throws 如果输入数字不在1-99范围内，将抛出错误
 */
export function numberToChinese(num: number): string {
  // 验证输入范围
  if (!Number.isInteger(num) || num < 1 || num > 99) {
    throw new Error("请输入1到99之间的整数");
  }

  // 基本数字对应表
  const digits = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];

  // 处理个位数
  if (num < 10) {
    return digits[num - 1];
  }

  // 处理两位数
  const tens = Math.floor(num / 10); // 十位数字
  const units = num % 10; // 个位数字

  // 十位数的处理
  let result = tens === 1 ? '十' : `${digits[tens - 1]}十`;

  // 个位数的处理（0的话不需要额外添加）
  if (units !== 0) {
    result += digits[units - 1];
  }

  return result;
}
