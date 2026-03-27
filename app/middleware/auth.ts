/**
 * 认证中间件
 * 检查用户是否登录，未登录则重定向到登录页
 */
export default defineNuxtRouteMiddleware((to, _from) => {
  // Mock 模式下跳过认证检查（用于开发测试）
  const USE_MOCK = true
  if (USE_MOCK) {
    console.log('[Auth Middleware] Mock 模式，跳过认证检查')
    return
  }

  // 实际项目中检查登录状态
  const token = useCookie('token')
  if (!token.value && to.path !== '/login') {
    return navigateTo('/login')
  }
})
