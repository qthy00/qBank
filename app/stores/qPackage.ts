import { defineStore } from 'pinia'

import type { PackageAccessVO } from '~/api/user'
import {formatDate} from '~/utils/formatTime'
import type {PackageVO} from "~/types/qBank";


export const usePackageStore = defineStore('QPackage', () => {
  
  const qPackage = ref<PackageVO>()

  const accessInfo = ref<PackageAccessVO>()
  const canUseQbank = ref(false)
  const usageInfo = ref('')

  // 2. 同步状态的方法（供组件调用）
  const syncToolStateToPinia = () => {
    // if (!qPackage.value && toolState.value) {
    //   qPackage.value = toolState.value
    // }
  }

  // 3. 更新 qPackage
  const setPackageInfo = (data: any) => {
    qPackage.value = data
  }




  const setPackageAccess = (accessInfo: PackageAccessVO) =>{
    accessInfo.value = accessInfo
    switch (accessInfo.value.type) {
      case 'free':
        usageInfo.value = '免费工具'
        canUseQbank.value = true
        break
      case 'lifetime':
        usageInfo.value = '已购买'
        canUseQbank.value = true
        break
      case 'subscription':
        usageInfo.value = `有效期至：${formatDate(accessInfo.expiredAt)}`
        canUseQbank.value = true
        break
      case 'count':
        usageInfo.value = `剩余使用次数：${accessInfo.remainingUses}`
        canUseQbank.value = true
        break
      case 'trial':
        if (accessInfo.value.trialUsesLeft && accessInfo.value.trialUsesLeft > 0) {
          // usageInfo =  `试用中，剩余试用次数：${accessInfo.trialUsesLeft}`
          usageInfo.value = `试用中`
          canUseQbank.value = true
        } else {
          usageInfo.value = '试用次数已用完，请购买'
          canUseQbank.value = false
        }
        break
      default:
        usageInfo.value = '付费工具'
        canUseQbank.value = false
        break
    }
  }

  const clear = () => {
    qPackage.value = null
  }

  return {
    qPackage,
    accessInfo,
    canUseQbank,
    usageInfo,
    setPackageInfo,
    setPackageAccess,
    syncToolStateToPinia,
    clear
  }
  
},{
  persist: {
    paths: ['qPackage']
  }
})
