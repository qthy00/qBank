export default defineNuxtPlugin((nuxtApp) => {
    // 获取环境变量
    const runtimeConfig = nuxtApp.$config
    // 将 baseUrl 挂载到全局（window 或 nuxtApp 实例）
    if (import.meta.client) {
        window.__BASE_URL__ = runtimeConfig.public.baseUrl
        window.__API_URL__ = runtimeConfig.public.apiUrl
    }
    // 也可挂载到 nuxtApp 实例供服务端使用（静态生成模式下服务端仅在构建时执行）
    nuxtApp.provide('baseUrl', runtimeConfig.public.baseUrl)
    nuxtApp.provide('apiUrl', runtimeConfig.public.apiUrl)
})