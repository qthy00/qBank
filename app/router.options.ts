import type {RouterConfig} from '@nuxt/schema'
import remainingRouter from '@/router/remaining.ts'

export default {
    routes: (_defaultRoutes) => {
        return [
            ..._defaultRoutes,
            ...remainingRouter,
        ]
    }
} satisfies RouterConfig
