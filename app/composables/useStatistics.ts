import {StatApi} from '@/api/stat'
import {updateToolAccess} from '@/api/user'
import {usePayWithPopup} from '~/utils/usePayRedirect.ts'
import {useToolStore} from '~/stores/tool.ts'


export const useStatistics = () => {
    const {meta} = useRoute()
    let toolId: number = meta?.id as unknown as number
    const {redirectToPay} = usePayWithPopup()
    const toolStore = useToolStore()
    const {toolInfo} = storeToRefs(toolStore)

    if (!toolId) {
        toolId = toolInfo.value.id
    }

    const visitStat = async () => {
        if (!toolId) return
        const params = {
            id: toolId,
            h: window.location.host,
            p: window.location.pathname,
        }
        try {
            await StatApi.pushVisited(params)
        } catch (e) {
        }
    }

    const toolsUsageStat = async () => {
        if (!toolId) return
        try {
            await StatApi.pushToolUsage(toolId)
        } catch (e) {
        }
    }

    const toolsUsageStatWithAccess = async () => {
        if (!toolId) return
        try {
            // 检查是否有使用权限并更新
            const data = await updateToolAccess(toolId)
            if (data.hasAccess) {
                // 统计使用次数
                await StatApi.pushToolUsage(toolId)
            } else {
                await redirectToPay(toolInfo.value, `/t/${toolInfo.value.series}`)
            }
            return data.hasAccess
        } catch (e) {
        }
    }

    return {
        visitStat,
        toolsUsageStat,
        toolsUsageStatWithAccess
    }
}
