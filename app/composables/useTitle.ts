import { watch, ref } from 'vue'
import { isString } from '~/utils/is'
import { useAppStoreWithOut } from '~/stores/app'

const appStore = useAppStoreWithOut()

export const useTitle = (newTitle?: string) => {
  const { t } = useI18n()
  const title = ref(
    newTitle ? `${appStore.info.name} - ${t(newTitle as string)}` : appStore.info.name
  )

  watch(
    title,
    (n, o) => {
      if (isString(n) && n !== o && document) {
        document.title = n
      }
    },
    { immediate: true }
  )

  return title
}
