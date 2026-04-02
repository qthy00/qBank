/**
 * 认证中间件
 * 检查用户是否登录，未登录则弹出登录窗口
 */
export default defineNuxtRouteMiddleware((to, _from) => {
  // 服务端不检查，避免 hydration 问题
  if (import.meta.server) {
    return
  }

  const authStore = useAuthStore()

  // 检查是否是账户相关页面
  if (to.path.startsWith('/account')) {
    // 如果未登录，标记需要登录
    if (!authStore.isLogin) {
      // 使用 query 参数标记需要登录，页面组件会读取并弹出登录框
      if (!to.query.needLogin) {
        return navigateTo({
          path: to.path,
          query: { ...to.query, needLogin: '1' }
        })
      }
    }
  }
})
