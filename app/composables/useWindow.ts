import { useRouter } from '#imports'

export const useWindow = (path: string) => {

    const reloadPage = () => {
        if (import.meta.client) {
            window.location.reload()
        }
    }

    const openNewWindow = (path: string) => {
        if (import.meta.client) {
            // 使用路由工具生成完整路径（处理 baseURL 等配置）
            const {resolve} = useRouter()
            const fullPath = resolve({ path }).href
            // 打开新窗口
            window.open(fullPath, '_blank')
        }
    }

    return {
        reloadPage,
        openNewWindow
    }


}