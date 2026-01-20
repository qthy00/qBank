import { defineStore } from 'pinia'

import type { ToolDetailVO } from '~/types/tools'
import type { ToolAccessVO } from '~/api/user'
import {formatDate} from '~/utils/formatTime'


export const useToolStore = defineStore('tool', () => {

  const toolState = useToolState() // 跨环境状态
  const toolInfo = ref<ToolDetailVO>()

  const toolAccess = ref<ToolAccessVO>()
  const canUseTool = ref(false)
  const usageInfo = ref('')

  // 2. 同步状态的方法（供组件调用）
  const syncToolStateToPinia = () => {
    if (!toolInfo.value && toolState.value) {
      toolInfo.value = toolState.value
    }
  }

  // 3. 更新 toolInfo
  const setToolInfo = (data: any) => {
    toolInfo.value = data
    toolState.value = data // 同步到跨环境状态（避免后续路由切换重复请求）
  }




  const setToolAccess = (toolAccess: ToolAccessVO) =>{
    toolAccess.value = toolAccess
    switch (toolAccess.value.type) {
      case 'free':
        usageInfo.value = '免费工具'
        canUseTool.value = true
        break
      case 'lifetime':
        usageInfo.value = '已购买'
        canUseTool.value = true
        break
      case 'subscription':
        usageInfo.value = `有效期至：${formatDate(toolAccess.expiredAt)}`
        canUseTool.value = true
        break
      case 'count':
        usageInfo.value = `剩余使用次数：${toolAccess.remainingUses}`
        canUseTool.value = true
        break
      case 'trial':
        if (toolAccess.trialUsesLeft && toolAccess.trialUsesLeft > 0) {
          // usageInfo =  `试用中，剩余试用次数：${toolAccess.trialUsesLeft}`
          usageInfo.value = `试用中`
          canUseTool.value = true
        } else {
          usageInfo.value = '试用次数已用完，请购买'
          canUseTool.value = false
        }
        break
      default:
        usageInfo.value = '付费工具'
        canUseTool.value = false
        break
    }
  }

  const clear = () => {
    toolInfo.value = null
    toolState.value = null
  }

  return {
    toolInfo,
    toolAccess,
    canUseTool,
    usageInfo,
    setToolInfo,
    setToolAccess,
    syncToolStateToPinia,
    clear
  }
  
},{
  persist: {
    paths: ['toolInfo']
  }
})
