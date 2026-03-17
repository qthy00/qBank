import {StatApi} from '@/api/stat'
import {updateToolAccess} from '@/api/user'
import {usePayWithPopup} from '~/composables/usePayRedirect.ts'
import {usePackageStore} from '~/stores/qPackage.ts'


export const useStatistics = () => {
    const {meta} = useRoute()
    let toolId: number = meta?.id as unknown as number
    const {redirectToPay} = usePayWithPopup()
    const packageStore = usePackageStore()
    const {qPackage} = storeToRefs(packageStore)

    if (!toolId && qPackage.value) {
        toolId = qPackage.value.id
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
            console.log('统计工具使用次数失败', e)
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
            } else if (qPackage.value) {
                await redirectToPay(qPackage.value, `/t/${qPackage.value.series}`)
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
