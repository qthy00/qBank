import type { ToolDetailVO } from '~/types/tools'

/**
 * 跨 SSR/客户端共享的 toolInfo 状态
 */
export const useToolState = () => {
    // 唯一 key：toolInfo（Nuxt 会基于此 key 序列化到客户端）
    return useState<ToolDetailVO>('toolInfo', () => null)
}