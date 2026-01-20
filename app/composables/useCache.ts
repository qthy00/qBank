/**
 * 配置浏览器本地存储的方式，可直接存储对象数组。
 */

import WebStorageCache from 'web-storage-cache'

// 项目默认缓存方式
type CacheType = 'localStorage' | 'sessionStorage'

export const CACHE_KEY = {
  // 用户相关
  ROUTERS: 'routers',
  USER: 'user',
  SHARE_LOG: 'shareLog',

  // 工具相关
  TOOL: 'tool',
  TEST: 'test',

  // 系统设置
  IS_DARK: 'isDark',
  LANG: 'lang',
  THEME: 'theme',
  LAYOUT: 'layout',
  DICT_CACHE: 'dictCache',
  TenantId: 'tenantId',
  // 收藏
  FAVORITES_TOOLS: 'favorites_tools',
  // 搜索
  SEARCH_HISTORY: 'searchHistory',
  // 罗马数字转换器
  ROMAN_TRANSFER_HISTORY: 'romanNumeralHistory'
}

export const useCache = (type: CacheType = 'localStorage') => {
// 服务端环境直接返回空对象或提示，避免执行浏览器 API
  if (import.meta.server) {
    return {
      wsCache: {
        get: () => null,
        set: () => {},
        delete: () => {},
        // 其他需要的方法（空实现，避免报错）
      }
    }
  }

  // 仅在客户端初始化缓存实例
  const wsCache = new WebStorageCache({
    storage: type
  })

  return {
    wsCache
  }
}

export const deleteUserCache = () => {
  const { wsCache } = useCache()
  wsCache.delete(CACHE_KEY.USER)
  wsCache.delete(CACHE_KEY.TOOL)
  wsCache.delete(CACHE_KEY.TEST)
  wsCache.delete(CACHE_KEY.ROUTERS)
  wsCache.delete(CACHE_KEY.FAVORITES_TOOLS)

  // 注意，不要清理 LoginForm 登录表单
}
