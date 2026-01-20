import type {RouterConfig} from '@nuxt/schema'
import remainingRouter from '@/router/remaining.ts'
// import {fetchServerRoutes} from '~/composables/useServerRoutes'


export default {
    routes: async (defaultRoutes) => {
        // 1. 从服务端获取路由数据
        // const serverRoutes = await fetchServerRoutes();
        // 3. 合并：服务端路由 + 自定义静态路由 + 默认路由
        return [
            // 自定义静态路由
            ...remainingRouter,
            // 服务端动态路由
            // ...serverRoutes,
            // 保留 Nuxt 默认路由（pages 目录自动生成的）
            ...defaultRoutes
        ]
    }
} satisfies RouterConfig
