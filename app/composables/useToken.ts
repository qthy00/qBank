export const useToken = () => {
    // 从 useState 获取 Token（SSR 兼容）
    const accessToken = useState<string>('accessToken', () => {
        return import.meta.client ? localStorage.getItem('accessToken') || '' : ''
    })

    // 从 Cookie 获取 refreshToken（服务端可读取）
    const getRefreshToken = () => {
        const cookies = useCookie('refreshToken')
        return cookies.value || ''
    }

    // 存储 Token
    const setTokens = (newAccessToken: string, newRefreshToken: string) => {
        accessToken.value = newAccessToken
        if (import.meta.client) {
            localStorage.setItem('accessToken', newAccessToken)
        }
        const cookies = useCookie('refreshToken')
        cookies.value = newRefreshToken
    }

    // 清除 Token
    const clearTokens = () => {
        accessToken.value = ''
        if (import.meta.client) {
            localStorage.removeItem('accessToken')
        }
        const cookies = useCookie('refreshToken')
        cookies.value = null
    }

    return {
        accessToken,
        getRefreshToken,
        setTokens,
        clearTokens
    }
}