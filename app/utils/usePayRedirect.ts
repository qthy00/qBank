import { useRouter, useRoute } from 'vue-router'
import { shallowRef } from 'vue'

const cartRef = shallowRef<any>(null) // 单例，全局弹窗引用

export function usePayWithPopup() {
  const router = useRouter()
  const route = useRoute()

  const redirectToPay = async (tool: {
    id: number
    paid: boolean
    paymentType: number
  },  returnUrl?: string ) => {
    if(!returnUrl) {
      returnUrl = route.fullPath
    }

    if (tool.paid && tool.paymentType !== 1) {
      cartRef.value?.open(tool, returnUrl)
      return
    }
    await navigateTo({
      path: '/order/pay',
      query: {
        id: tool.id,
        returnUrl: encodeURIComponent(returnUrl),
      },
    })
  }

  // 提供注册弹窗的入口（只在 Layout 中调用一次）
  const registerCartRef = (el: any) => {
    cartRef.value = el
  }

  return {
    redirectToPay,
    registerCartRef,
  }
}
