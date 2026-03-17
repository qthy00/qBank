<template>
  <Suspense>
    <template #default>
      <div class="min-h-screen bg-gray-50 flex flex-col">
        <!-- 导航栏 -->
        <Navbar/>
        <!-- 头部 -->
        <MainMenu />
        <!-- 主内容区 -->
        <div class="container mx-auto py-5 flex-1">
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <!-- 侧边栏 -->
            <ToolSidebar :visible="visible"/>
            <!-- 核心功能区 - 子路由视图 -->
            <main :class="visible ? 'lg:col-span-3' : 'lg:col-span-4'" >
              <slot/>
            </main>
          </div>
        </div>
        <!-- 页脚 -->
        <Footer/>
      </div>
    </template>
    <template #fallback>
      <div class="flex justify-center items-center h-screen">
        <div>页面加载中。。。</div>
      </div>
    </template>
  </Suspense>

  <CartForm ref="cartRef"/>
  <FeedbackModal ref="feedbackRef"/>
</template>

<script setup lang="ts">
import {getPackageAccess} from '@/api/user'
import {usePayWithPopup} from '~/composables/usePayRedirect.ts'

const modalStore = useModalStore()
const authStore = useAuthStore()
const packageStore = usePackageStore()

const {query} = useRoute()
const resultType = computed(() => query.resultType as string === 'success')

const {isLogin} = storeToRefs(authStore)
const {qPackage, accessInfo, canUseQbank} = storeToRefs(packageStore)
const visible = computed(() => qPackage.value?.id !== undefined)


const loadToolAccess = async () => {
  if (!qPackage.value?.id || !isLogin.value || !qPackage.value?.paid) return
  try {
    const data = await getPackageAccess(qPackage.value.id, false)
    if (!data) return
    accessInfo.value = data
    packageStore.setPackageAccess(data)
  } catch (err) {
    console.error('获取工具访问权限失败', err)
  }
}

watch(accessInfo, async (val) => {
  if (resultType.value && val.type === 'trial') {
    await loadToolAccess()
  }
}, {immediate: true})


watch(isLogin, async (val) => {
  if (val) {
    await loadToolAccess()
  }
}, {immediate: true})


const canUse = computed(() => {
  if (!qPackage.value?.paid) return true // 免费工具，直接可用
  if (!isLogin.value) return false // 未登录不可用
  return accessInfo.value?.hasAccess === true
})

watch(canUse, (val) => {
  canUseQbank.value = val
})

const cartRef = ref()
const {registerCartRef} = usePayWithPopup()

// 反馈弹窗控制
const feedbackRef = ref()
const feedback = computed(() => modalStore.feedback)
watch(feedback, (val) => {
  if (val) {
    feedbackRef.value!.open()
  }
})


onMounted(async () => {
  registerCartRef(cartRef.value)
})


</script>
