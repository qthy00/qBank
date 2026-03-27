import {$t} from '~/utils/lang'
import {useToken} from "~/composables/useToken";

const message = useMessage()
const fetchConfig = {
    baseURL: '/app-api/',	// 此处无需完整url地址，需要与nuxt.config.ts代理配置一致
    headers: {
        appid: 'xueciyuan',
        'tenant-id': 1,  // 当前租户id
        'Current-Site': 4, // 当前站点
    }
}

const errorCode: Record<string, string> = {
    '401': '认证失败，无法访问系统资源',
    '403': '当前操作没有权限',
    '404': '访问资源不存在',
    'default': '系统未知错误，请反馈给管理员'
}
const request_timeout = 30000

const ignoreMsgs = [
    '无效的刷新令牌', // 刷新令牌被删除时，不用提示
    '刷新令牌已过期', // 使用刷新令牌，刷新获取新的访问令牌时，结果因为过期失败，此时需要忽略。否则，会导致继续 401，无法跳转到登出界面
]

// 是否正在刷新中
let isRefreshing = false
// 请求队列
let retryRequests: Array<(token: string) => void> = []
// 是否显示重新登录
export const reLogin = {show: false}

// 获取Token（兼容服务端/客户端）
function getToken() {
    if (import.meta.client) {
        const {accessToken} = useToken()
        return accessToken.value
    } else {
        // 服务端从请求头获取Token（需配置Nuxt服务端转发）
        const event = useRequestEvent()
        return event?.req.headers.authorization?.replace('Bearer ', '') || ''
    }
}

function getFetchOptions(data: any, options: any = {}) {
    // 基础配置
    options.baseURL = options.baseURL ?? fetchConfig.baseURL
    options.headers = {
        ...fetchConfig.headers,
        ...options.headers
    }
    // 默认配置
    options.initialCache = options.initialCache ?? false   // 缓存
    options.lazy = options.lazy ?? true  // 懒加载
    // Token处理
    const token = getToken()
    if (token) {
        options.headers.Authorization = `Bearer ${token}`
    }
    // 处理 GET 请求缓存
    if (options.method === 'GET') {
        options.headers = {
            ...options.headers,
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        }
    }
    // POST请求处理
    if (options.method == "POST" || options.method == "PUT") {
        options.body = data
        options.watch = options.watch ?? false // 关闭参数改变自动请求
    }
    // 上传处理
    if (options.upload === true && options.body) {
        const formData = new FormData()
        formData.append('file', options.body)
        options.body = formData
        options.headers = {
            ...options.headers,
            'Content-Type': 'multipart/form-data'
        }
    }

    return options
}


/**
 * 刷新Token（仅客户端执行）
 */
async function refreshToken() {
    if (!import.meta.client) return null

    const {getRefreshToken, setTokens} = useToken()

    const refreshToken = getRefreshToken()
    console.log('获取刷新TOKEN', refreshToken)
    if (!refreshToken) return null

    try {
        const result: any = await $fetch('/member/auth/refresh-token', {
            baseURL: fetchConfig.baseURL,
            method: 'POST',
            query: {refreshToken},
            headers: {
                appid: fetchConfig.headers.appid,
                'tenant-id': 1,  // 当前租户id
                'Current-Site': 4, // 当前站点
            }
        })
        console.log('result==', result)
        if (result.data) {
            setTokens(result.data.accessToken, result.data.refreshToken)
            return result.data.accessToken
        }
        return null
    } catch (error) {
        console.log('刷新Token错误：',error)
        return null
    }
}

/**
 * 处理未授权（区分环境）
 */
async function handleAuthorized() {
    // const { modalStates, openModal } = useModal()


    // if (import.meta.client){
    //     useCookie('accessToken').value = null
    //     useCookie('refreshToken').value = null
    // }
    if(import.meta.client){
        const authStore =  useAuthStore()
        await authStore.logout(false)
        reLogin.show = false
        // if (!modalStates.value.login) {
        //     openModal('login')
        // }
    }

}

// 处理错误
const handleError = (error: any, _url: string, _options: any) => {
    let msg = error.message || ''

    if (error.name === 'AbortError') {
        msg = $t('sys.apiTimeoutMessage')
    } else if (msg.includes('Failed to fetch')) {
        msg = $t('sys.errorMessage')
    } else if (msg.includes('status code')) {
        const statusCode = msg.match(/\d{3}/)?.[0]
        msg = statusCode ? $t('sys.apiRequestFailed') + statusCode : $t('sys.apiRequestFailed')
    }

    if (import.meta.client){
        console.log('请求出错啦！', msg)
    }
    return Promise.reject(error)
}


/**
 * 响应处理
 */
async function handleResponse(data: any, originalRequest?: any) {
    // console.log('data===========', data)
    console.log('data===========', data.code)
    if (!data) {
        throw new Error('[HTTP]请求没有返回值')
    }
    const code: number = data.code || 0
    // 业务成功：直接返回数据
    if (code === 0) return data.data
    // 获取错误信息
    const msg = data.msg || errorCode[code] || errorCode['default']

    if (import.meta.server) throw new Error(msg)

    if (ignoreMsgs.indexOf(msg) !== -1) {
        console.log('请求出错啦！!', msg)
        void (import.meta.client && message.error(msg))
    } else if (code === 401) {
        // 如果没有刷新令牌，删除现有用户信息等缓存
        const {getRefreshToken} = useToken()
        if (!getRefreshToken() || originalRequest?.url?.includes('refresh-token')){
            return handleAuthorized()
        }
        // 正在刷新Token：将请求加入队列等待重试
        if (isRefreshing) {
            return new Promise((resolve) => {
                retryRequests.push((newToken: string) => {
                    // 更新原请求的Token并重试
                    originalRequest.headers.Authorization = `Bearer ${newToken}`
                    resolve(retryOriginalRequest(originalRequest))
                })
            })
        }
        // 开始刷新Token
        isRefreshing = true

        try {
            const newToken = await refreshToken()
            console.log('新的TOKEN====', newToken)
            if (newToken) {
                // 刷新成功：重试队列中的所有请求
                retryRequests.forEach((cb) => cb(newToken))
                retryRequests = []

                // 重试当前请求
                if (originalRequest) {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`
                    return retryOriginalRequest(originalRequest)
                }
            } else {
                // 刷新失败：引导登录
                return handleAuthorized()
            }
        } catch {
            return handleAuthorized()
        } finally {
            isRefreshing = false
        }
    } else if (code === 500) {
        message.error($t('sys.errMsg500'))
        // throw new Error(msg)
    } else if (code === 901) {
        message.error($t('sys.api.errMsg901'))
        // throw new Error(msg)
    } else if (code !== 0) {
        console.log('请求出错啦！！！', msg)
        message.error(msg)
        throw new Error(msg)
    }
}

/**
 * 重试原请求
 * @param requestConfig 原请求配置
 */
async function retryOriginalRequest(requestConfig: any) {
    const res = await $fetch(requestConfig.url, {
        method: requestConfig.method,
        headers: requestConfig.headers,
        body: requestConfig.body,
        query: requestConfig.query,
        baseURL: requestConfig.baseURL
    }) // 直接返回重试结果（已通过业务校验）
    if (res.code === 0) return res.data
    throw new Error(res.msg)
}


export async function useHttp(key: string | undefined,
                              url: string,
                              data: any = {},
                              options: any = {},
                              retry: boolean = false,
                              orignal: boolean = false) {
    // key值用户懒加载时使用，一般使用不到
    if(!retry) {
        options = getFetchOptions(data, options)
        options.key = key
    }
    // 保存原请求配置（用于重试）
    const originalRequest = {
        url,
        method: options.method,
        headers: options.headers,
        body: options.body,
        query: options.query,
        baseURL: options.baseURL
    }
    try {
        // 处理超时
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), request_timeout)

        const {responseType} = options
        // 对于二进制类型，使用原生 fetch 而非 $fetch，因为 $fetch 会自动解析 JSON
        if (responseType === 'blob' || responseType === 'arraybuffer') {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            })
            clearTimeout(timeoutId)
            if (!response.ok) {
                throw new Error(`Request failed with status code ${response.status}`)
            }
            // 检查是否是 JSON 类型的错误响应
            const contentType = response.headers.get('content-type') || ''
            if (contentType.includes('application/json')) {
                const resData = await response.json()
                return handleResponse(resData, url)
            }
            // 返回二进制数据
            return responseType === 'blob' ? await response.blob() : await response.arrayBuffer()
        }

        if (options?.$) {
            // 使用$fetch直接请求的情况
            try {
                console.log('使用$fetch直接请求的情况', url)
                const response = await $fetch(url, {
                    ...options,
                    signal: controller.signal
                })
                clearTimeout(timeoutId)
                // 传递原请求配置给业务处理函数
                if(orignal) {
                    return response
                } else {
                    return await handleResponse(response, originalRequest)
                }
            } catch (err: any) {
                clearTimeout(timeoutId)
                // import.meta.client && message.error(err.msg || '请求失败')
                return handleError(err, url, options)
            }
        } else {
            console.log('使用useFetch请求的情况', url)
            return useFetch(url, {
                ...options,
                async onResponse({response}) {
                    // 传递原请求配置
                    response._data = await handleResponse(response._data, originalRequest)
                },
                async onResponseError({response}) {
                    clearTimeout(timeoutId)
                    console.log('HTTP错误=====', response)
                    void (import.meta.client && message.error(`HTTP错误：${response.status}`))
                    throw new Error(`HTTP错误：${response.status}`)
                }
            })
        }
    } catch (error: any) {
        return handleError(error, url, options)
    }

}

/**
 * GET请求
 */
export function httpGet(key: string, url: string, options: any = {}, server: boolean = false) {
    options.method = 'GET'
    options.$ = !server // 使用$fetch直接请求
    options.server = server
    return useHttp(key, url, {}, options)
}

/**
 * POST请求
 */
export function httpPost(key: string, url: string, data: any = {}, options: any = {}) {
    options.method = 'POST'
    options.$ = true // 使用$fetch直接请求
    return useHttp(key, url, data, options)
}

/**
 * POST请求
 */
export function postOriginal(key: string, url: string, data: any = {}, options: any = {}) {
    options.method = 'POST'
    options.$ = true // 使用$fetch直接请求
    return useHttp(key, url, data, options, false, true)
}

/**
 * PUT请求
 */
export function httpPut(key: string, url: string, data: any = {}, options: any = {}) {
    options.method = 'PUT'
    options.$ = true // 使用$fetch直接请求
    return useHttp(key, url, data, options)
}

/**
 * DELETE请求
 */
export function httpDelete(key: string, url: string, options: any = {}) {
    options.method = 'DELETE'
    return useHttp(key, url, {}, options)
}

/**
 * 上传文件
 */
export function httpUpload(key: string, url: string, file: File, options: any = {}) {
    options.method = 'POST'
    options.$ = true
    options.upload = true
    return useHttp(key, url, file, options)
}

/**
 * 下载文件
 */
export function httpDownload(key: string, url: string, options: any = {}) {
    options.method = 'GET'
    options.$ = true
    options.responseType = 'blob'
    return useHttp(key, url, options)
}
