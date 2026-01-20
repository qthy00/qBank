import type { TokenType } from '@/api/login/types'


const AccessTokenKey = 'ACCESS_TOKEN'
const RefreshTokenKey = 'REFRESH_TOKEN'
const {wsCache} = useCache()
// 获取token
export const getAccessToken = () => {
  return wsCache.get(AccessTokenKey)
}

// 刷新token
export const getRefreshToken = () => {
  return wsCache.get(RefreshTokenKey)
}

// 设置token
export const setToken = (token: TokenType) => {
  wsCache.set(RefreshTokenKey, token.refreshToken)
  wsCache.set(AccessTokenKey, token.accessToken)
}

// 删除token
export const removeToken = () => {
  wsCache.delete(AccessTokenKey)
  wsCache.delete(RefreshTokenKey)
}




