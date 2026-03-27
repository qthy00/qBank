import qs from 'qs'
import {config} from './config'
import errorCode from './errorCode'
import {getAccessToken, getRefreshToken, removeToken, setToken} from '@/utils/auth'
import {deleteUserCache} from '~/composables/useCache'
import {$t} from '~/utils/lang'

const message = useMessage()
const {result_code, base_url, request_timeout} = config

// 需要忽略的提示。忽略后，自动 Promise.reject('error')
const ignoreMsgs = [
    '无效的刷新令牌', // 刷新令牌被删除时，不用提示
    '刷新令牌已过期', // 使用刷新令牌，刷新获取新的访问令牌时，结果因为过期失败，此时需要忽略。否则，会导致继续 401，无法跳转到登出界面
]
// 是否显示重新登录
export const reLogin = {show: false}
// 请求队列
let requestList: any[] = []
// 是否正在刷新中
let isRefreshToken = false
// 请求白名单，无须token的接口
const whiteList: string[] = ['/login', '/refresh-token']
// 检查是否在白名单中
const isInWhiteList = (url: any) => {
    if (typeof url !== 'string') {
        return false
    }
    return whiteList.some(v => url.indexOf(v) > -1)
}
// 处理请求配置
const handleRequestConfig = (url: string, options: any = {}) => {
    const { method = 'GET', headers = {}, params = {}, body = {} } = options
    // 合并默认 headers
    const defaultHeaders: any = {
        'tenant-id': 1,
        'Current-Site': 4,
    }
    // 是否需要设置 token
    let isToken = headers.isToken === false
    if (!isToken && isInWhiteList(url)) {
        isToken = false
    }
    if (getAccessToken() && !isToken) {
        defaultHeaders['Authorization'] = 'Bearer ' + getAccessToken()
    }
    // 处理 GET 请求缓存
    if (method.toUpperCase() === 'GET') {
        defaultHeaders['Cache-Control'] = 'no-cache'
        defaultHeaders['Pragma'] = 'no-cache'
    }
    // 处理 POST 请求
    if (method.toUpperCase() === 'POST') {
        const contentType = headers['Content-Type'] || headers['content-type'] || 'application/json'
        defaultHeaders['Content-Type'] = contentType
        // 处理表单数据
        if (contentType === 'application/x-www-form-urlencoded' && typeof body === 'object') {
            options.body = qs.stringify(body)
        }
        options.body = options.data
    }
    // 合并 headers
    options.headers = { ...defaultHeaders, ...headers }
    // 处理查询参数
    if (Object.keys(params).length > 0) {
        const queryString = qs.stringify(params, { allowDots: true })
        url += (url.includes('?') ? '&' : '?') + queryString
    }

    // 处理完整 URL
    const fullUrl = url.startsWith('http') ? url : base_url + url

    return { fullUrl, options }
}

// 刷新令牌
const refreshToken = async () => {
    const refreshToken = getRefreshToken()
    if (!refreshToken) {
        return Promise.reject('No refresh token')
    }

    return await $fetch(base_url + '/member/auth/refresh-token', {
        method: 'POST',
        headers: {
            'tenant-id': 1,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: qs.stringify({ refreshToken })
    })
}

// 处理未授权
const handleAuthorized = () => {
    deleteUserCache() // 删除用户缓存
    removeToken()
    reLogin.show = false

    return Promise.reject($t('sys.timeoutMessage'))
}


// 处理响应
const handleResponse = async (data: any, url: string, options: any) => {
    if (!data) {
        throw new Error('[HTTP]请求没有返回值')
    }

    const code = data.code || result_code

    // 获取错误信息
    const msg = data.msg || errorCode[code] || errorCode['default']

    if (ignoreMsgs.indexOf(msg) !== -1) {
        return Promise.reject(msg)
    }
    else if (code === 401) {
        // 处理 401 错误，刷新令牌
        if (!isRefreshToken) {
            isRefreshToken = true

            // 如果没有刷新令牌，执行登出
            if (!getRefreshToken()) {
                return handleAuthorized()
            }

            try {
                // 刷新令牌
                const refreshTokenRes = await refreshToken()
                setToken(refreshTokenRes.data)

                // 重新执行队列中的请求
                requestList.forEach(cb => cb())
                requestList = []

                // 重新执行当前请求
                return service(url, options)
            } catch {
                // 刷新令牌失败，执行登出
                requestList.forEach(cb => cb())
                return handleAuthorized()
            } finally {
                requestList = []
                isRefreshToken = false
            }
        } else {
            // 等待令牌刷新后重新请求
            return new Promise(resolve => {
                requestList.push(() => {
                    resolve(service(url, options))
                })
            })
        }
    }
    else if (code === 500) {
        message.error($t('sys.errMsg500'))
        return Promise.reject(new Error(msg))
    }
    else if (code === 901) {
        message.error({
            offset: 300,
            dangerouslyUseHTMLString: true,
            message:
                '<div>' +
                $t('sys.api.errMsg901') +
                '</div>' +
                '<div> &nbsp; </div>' +
                '<div>参考 https://doc.iocoder.cn/ 教程</div>' +
                '<div> &nbsp; </div>' +
                '<div>5 分钟搭建本地环境</div>',
        })
        return Promise.reject(new Error(msg))
    }
    else if (code !== 0) {
        if (msg === '无效的刷新令牌') {
            return handleAuthorized()
        } else {
            message.error(msg)
        }
        return Promise.reject(msg)
    } else {
        return data
    }
}

// 处理错误
const handleError = (error: any) => {
    console.log('err' + error)
    const { _t } = useI18n()
    let msg = error.message || ''

    if (error.name === 'AbortError') {
        msg = $t('sys.apiTimeoutMessage')
    } else if (msg.includes('Failed to fetch')) {
        msg = $t('sys.errorMessage')
    } else if (msg.includes('status code')) {
        const statusCode = msg.match(/\d{3}/)?.[0]
        msg = statusCode ? $t('sys.apiRequestFailed') + statusCode : $t('sys.apiRequestFailed')
    }

    message.error(msg)
    return Promise.reject(error)
}

// 封装 $fetch
const service = async (url: string, options: any = {}) => {


    const { fullUrl, options: fetchOptions } = handleRequestConfig(url, options)

    const { method = 'GET', responseType } = fetchOptions

    try {
        // 处理超时
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), request_timeout)

        // 对于二进制类型，使用原生 fetch 而非 $fetch，因为 $fetch 会自动解析 JSON
        if (responseType === 'blob' || responseType === 'arraybuffer') {
            const response = await fetch(fullUrl, {
                ...fetchOptions,
                signal: controller.signal,
                method,
            })

            clearTimeout(timeoutId)

            if (!response.ok) {
                throw new Error(`Request failed with status code ${response.status}`)
            }

            // 检查是否是 JSON 类型的错误响应
            const contentType = response.headers.get('content-type') || ''
            if (contentType.includes('application/json')) {
                const data = await response.json()
                return handleResponse(data, fullUrl, fetchOptions)
            }

            // 返回二进制数据
            return responseType === 'blob' ? await response.blob() : await response.arrayBuffer()
        }

        // 普通请求使用 $fetch
        const response = await $fetch(fullUrl, {
            ...fetchOptions,
            signal: controller.signal,
            method,
        })

        clearTimeout(timeoutId)
        return handleResponse(response, fullUrl, fetchOptions)
    } catch (error: any) {
        return handleError(error, fullUrl, fetchOptions)
    }
}

export { service }

