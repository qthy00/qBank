// 工具函数：解析 Cookie（服务端专用）
export const parseCookie = (cookieStr: string | undefined) => {
    if (!cookieStr) return {}
    return cookieStr.split(';').reduce((acc, item) => {
        const [key, value] = item.trim().split('=')
        acc[key] = decodeURIComponent(value)
        return acc
    }, {} as Record<string, string>)
}
