import { defineStore } from 'pinia'

export const usePayDialogStore = defineStore('payDialog', () => {

  const visible = ref(false)
  const title = ref('请使用微信扫码支付')
  const url = ref('')

  const show = (uri: string, titleInfo?: string) => {
    url.value = uri
    if(titleInfo) title.value = titleInfo
    visible.value = true
  }

  const hide = () => {
    visible.value = false
  }

  return { visible, title, url, show, hide }

})
