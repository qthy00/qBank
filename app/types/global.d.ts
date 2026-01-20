export {}

/**
 * 这段代码定义了一些 TypeScript 类型和接口，
 * 包括函数类型、可空类型、元素引用类型、记录类型、组件引用类型、本地化类型、超时句柄类型、间隔句柄类型、
 * Axios 请求头类型、Axios 请求方法类型、Axios 响应类型、Axios 配置接口、响应接口、分页参数接口和树形结构接口。
 **/

declare global {

  // Fn<T = any>：定义了一个函数类型，接受一个或多个参数，返回值类型为 T。
  interface Fn<T = any> {
    (...arg: T[]): T
  }

  type Nullable<T> = T | null

  type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>

  type Recordable<T = any, K = string> = Record<K extends null | undefined ? string : K, T>

  type ComponentRef<T> = InstanceType<T>

  type LocaleType = 'zh-CN' | 'en'

  declare type TimeoutHandle = ReturnType<typeof setTimeout>
  declare type IntervalHandle = ReturnType<typeof setInterval>

  type AxiosHeaders =
    | 'application/json'
    | 'application/x-www-form-urlencoded'
    | 'multipart/form-data'

  type AxiosMethod = 'get' | 'post' | 'delete' | 'put' | 'GET' | 'POST' | 'DELETE' | 'PUT'

  type AxiosResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'

  interface AxiosConfig {
    params?: any
    data?: any
    url?: string
    method?: AxiosMethod
    headersType?: string
    responseType?: AxiosResponseType
  }

  interface IResponse<T = any> {
    code: string
    data: T extends any ? T : T & any
  }

  interface PageParam {
    pageSize: number
    pageNo: number
    categoryId?: number
  }

  interface Tree {
    id: number
    name: string
    children?: Tree[] | any[]
    isLast?: boolean
  }
  // 分页数据公共返回
  interface PageResult<T> {
    list: T // 数据
    total: number // 总量
  }

  interface Option {
    key: string
    value: string
  }
}
