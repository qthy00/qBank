<script setup lang="ts">
import {DocumentApi} from '~/api/document'
import {fileSizeFormatter, formatCount} from "~/utils"
import {ArticleApi} from "~/api/article"
import type { DocumentPreviewVO } from '~/types/document'

const route = useRoute()
const message = useMessage()
const authStore = useAuthStore()
const userStore = useUserStore()
const {user} = storeToRefs(userStore)
const {isLogin} = storeToRefs(authStore)

/* 热门文档排行 */
const industryStore = useIndustryStore()
const { currentExam } = storeToRefs(industryStore)
const {data: hotDocuments } = await useAsyncData(
    async () => {
      const data = await DocumentApi.getDocumentList({
        catalogId: currentExam.value?.id || 1,
        pageNo: 1,
        pageSize: 5
      })
      return data.list?.slice(0, 5) || []
    }
)

/* 控制底部固定栏显示 */
const showFixedBar = ref(false)
const { data: document, pending: loading } = await useAsyncData(
    () => `articleDetail-${route.params.id}`,
    async () => {
      const currentId = Number(route.params.id)
      const data = await DocumentApi.getDocumentDetail(currentId)
      if (data?.title) {
        useHead({
          title: data.title,
          meta: [
            {
              name: "description",
              content: computed(() => data.summary ),
              tagPriority: 1
            },
            {
              name: "keywords",
              content: computed(() => data.keywords ),
              tagPriority: 1
            }
          ]
        })
      }
      return data
    },{
      watch: [() => route.params.id],
      immediate:  true
    }
)

/* 预览相关状态 */
const previewData = ref<DocumentPreviewVO | null>(null)
const previewLoading = ref(false)
const previewImages = computed(() => previewData.value?.images || [])
const totalPages = computed(() => previewData.value?.totalPages || 0)
const hasFullAccess = computed(() => previewData.value?.hasFullAccess || false)
const previewLimit = computed(() => previewData.value?.previewLimit)

/* 判断用户是否可以下载当前文档 */
const canDownload = computed(() => {
  if (!document.value) return false
  if (document.value.payMode === 0) return true
  if (document.value.payMode === 1 && hasFullAccess.value) return true
  return false
})

/* 获取预览数据 */
const loadPreview = async () => {
  if (!document.value || previewLoading.value) return
  previewLoading.value = true
  try {
    const res = await DocumentApi.getDocumentPreview(document.value.id)
    if (res) {
      previewData.value = res
    }
  } catch (e) {
    console.error('加载预览失败', e)
  } finally {
    previewLoading.value = false
  }
}

/* 监听文档加载，加载预览 */
watch(document, (doc) => {
  if (doc) {
    loadPreview()
  }
}, { immediate: true })


/* 返回列表 */
const handleBack = () => {
  navigateTo('/document')
}

/* 查看文档详情 */
const handleViewDetail = (id: number) => {
  navigateTo(`/document/${id}`)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/* 下载文档 */
const handleDownload = async () => {
  if (!document.value) return

  if (!canDownload.value) {
    if (document.value.payMode === 1) {
      navigateTo('/vip')
      return
    }
    message.info('请先购买后再下载')
    return
  }

  try {
    await DocumentApi.incrementDownloadCount(document.value.id)
    const url = await DocumentApi.getDownloadUrl(document.value.id)
    const link = document.createElement('a')
    link.href = url
    link.download = document.value.title + '.' + (document.value.fileType?.toLowerCase() || 'pdf')
    link.click()
    message.success('开始下载')
  } catch {
    message.error('下载失败')
  }
}

/* 购买文档 */
const handlePurchase = () => {
  if (!document.value) return
  navigateTo(`/order/pay?id=${document.value.id}&orderType=goods`)
}

/* 开通 VIP */
const handleOpenVip = () => {
  navigateTo('/vip')
}

/* 监听滚动显示固定栏 */
const handleScroll = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  showFixedBar.value = scrollTop > 300
}

/* 获取排名样式 */
const getRankStyle = (index: number) => {
  if (index === 0) return 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white'
  if (index === 1) return 'bg-gradient-to-br from-gray-300 to-gray-400 text-white'
  if (index === 2) return 'bg-gradient-to-br from-orange-300 to-orange-400 text-white'
  return 'bg-gray-100 text-gray-500'
}

/* 初始化 */
onMounted(() => {
  const currentId = Number(route.params.id)
  if (!currentId) {
    navigateTo('/article')
    return
  }
  ArticleApi.incrementViewCount(currentId).catch(() => {})
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
    <!-- 蓝色渐变头部 -->
    <div class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-500 to-cyan-500"/>
      <!-- 装饰图案 -->
      <div class="absolute inset-0">
        <div class="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"/>
        <div class="absolute top-20 right-20 w-48 h-48 bg-cyan-300/20 rounded-full blur-3xl"/>
        <div class="absolute bottom-10 left-1/3 w-24 h-24 bg-blue-300/20 rounded-full blur-2xl"/>
      </div>

      <!-- 面包屑导航 -->
      <div class="relative container mx-auto px-4 py-6">
        <div class="flex items-center text-sm text-white/80">
          <span class="cursor-pointer hover:text-white transition-colors" @click="navigateTo('/document')">资料中心</span>
          <Icon name="ep:arrow-right" class="mx-2 text-xs" />
          <span class="cursor-pointer hover:text-white transition-colors" @click="navigateTo('/document')">{{ document?.categoryName || '分类' }}</span>
          <Icon name="ep:arrow-right" class="mx-2 text-xs" />
          <span class="text-white line-clamp-1 max-w-xs">{{ document?.title }}</span>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-6 pb-24">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- 左侧主要内容 -->
        <div class="lg:col-span-9 space-y-6">
          <!-- 文档标题区域 -->
          <div v-loading="loading" class="bg-white rounded-2xl shadow-lg shadow-blue-100/50 border border-blue-100 p-6">
            <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <!-- 左侧标题信息 -->
              <div class="flex-1">
                <div class="flex items-start gap-2 mb-3">
                  <span class="px-2 py-0.5 text-xs font-medium text-white bg-gradient-to-r from-red-500 to-pink-500 rounded shrink-0">推荐</span>
                  <h1 class="text-xl font-bold text-slate-800 leading-snug">
                    {{ document?.title }}
                  </h1>
                </div>

                <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
                  <span class="text-red-500 font-medium">
                    <span v-if="document?.payMode == 0">免费</span>
                    <span v-else-if="document?.payMode == 1">VIP免费</span>
                    <span v-else>¥{{ document?.downloadPrice }}</span>
                  </span>
                  <span>{{ document?.fileSize }}</span>
                  <span>下载数：{{ formatCount(document?.downloadCount) || 0 }}</span>
                  <span>更新时间：{{ formatDate(document?.publishDate, 'YYYY-MM-DD') }}</span>
                </div>
              </div>

              <!-- 右侧下载按钮 -->
              <div class="flex flex-col items-end gap-2 shrink-0">
                <button
                  v-if="document?.payMode == 0"
                  class="px-8 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full font-medium hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/30"
                  @click="handleDownload"
                >
                  立即下载
                </button>
                <button
                  v-else-if="document?.payMode == 1 && hasFullAccess"
                  class="px-8 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full font-medium hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/30"
                  @click="handleDownload"
                >
                  VIP下载
                </button>
                <button
                  v-else-if="document?.payMode == 1"
                  class="px-8 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-medium hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/30"
                  @click="handleOpenVip"
                >
                  开通VIP
                </button>
                <button
                  v-else
                  class="px-8 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full font-medium hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/30"
                  @click="handlePurchase"
                >
                  购买下载
                </button>
<!--                <span class="text-xs text-blue-500 cursor-pointer hover:underline">新人注册即送30个下载币</span>-->
              </div>
            </div>
          </div>

          <!-- 简介 -->
          <div v-if="document?.summary" class="bg-white rounded-2xl shadow-lg shadow-blue-100/50 border border-blue-100 p-6">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                <Icon name="ep:info-filled" class="text-blue-500 text-sm"/>
              </div>
              <span class="text-slate-800 font-medium">简介</span>
            </div>
            <p class="text-sm text-slate-500 leading-relaxed">{{ document?.summary }}</p>
          </div>

          <!-- 文档内容预览 -->
          <div class="bg-white rounded-2xl shadow-lg shadow-blue-100/50 border border-blue-100 overflow-hidden">
            <!-- 免费文档或已购买用户：显示完整预览 -->
            <div v-if="document?.payMode == 0 || hasFullAccess" class="p-8">
              <div class="flex items-center gap-2 mb-4">
                <Icon name="ep:document" class="text-blue-500" />
                <span class="font-medium text-slate-700">文档预览</span>
                <span v-if="totalPages" class="text-xs text-slate-400">（共 {{ totalPages }} 页）</span>
              </div>

              <!-- 预览图片列表 -->
              <div v-loading="previewLoading" element-loading-text="正在加载预览..." class="preview-pages">
                <div
                  v-for="(img, index) in previewImages"
                  :key="index"
                  class="preview-page-item"
                >
                  <img :src="img" class="w-full h-auto" :alt="`预览第${index + 1}页`" loading="lazy" />
                </div>

                <!-- 无预览数据 -->
                <div v-if="previewImages.length === 0 && !previewLoading" class="flex flex-col items-center justify-center py-12 text-slate-400">
                  <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center mb-4">
                    <Icon name="ep:document" class="text-4xl text-blue-400" />
                  </div>
                  <p>暂无预览内容</p>
                </div>
              </div>
            </div>

            <!-- 付费文档：部分预览 + 模糊遮罩 -->
            <div v-else class="document-preview-container">
              <div v-loading="previewLoading" element-loading-text="正在加载预览..." class="preview-pages">
                <div
                  v-for="(img, index) in previewImages"
                  :key="index"
                  class="preview-page-item"
                >
                  <img :src="img" class="w-full h-auto" :alt="`预览第${index + 1}页`" loading="lazy" />
                </div>

                <!-- 加载中状态 -->
                <div v-if="previewLoading" class="min-h-[300px] flex items-center justify-center">
                  <div class="text-center text-slate-400">
                    <Icon name="ep:loading" class="text-4xl animate-spin mb-2" />
                    <p class="text-sm">正在加载预览...</p>
                  </div>
                </div>

                <!-- 无预览数据 -->
                <div v-if="previewImages.length === 0 && !previewLoading" class="min-h-[300px] flex items-center justify-center">
                  <div class="text-center text-slate-400">
                    <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center mx-auto mb-4">
                      <Icon name="ep:document" class="text-4xl text-blue-400" />
                    </div>
                    <p>暂无预览内容</p>
                    <p class="text-sm mt-2">下载后可查看完整内容</p>
                  </div>
                </div>
              </div>

              <!-- 模糊遮罩 + 购买引导 -->
              <div v-if="previewImages.length > 0" class="preview-lock-overlay">
                <div class="lock-icon-wrapper">
                  <Icon name="ep:lock" class="text-3xl text-white/80" />
                </div>
                <p class="lock-text">
                  已展示前 {{ previewLimit || 3 }} 页预览，剩余 {{ totalPages - (previewLimit || 3) }} 页需{{ document?.payMode == 1 ? '开通VIP' : '购买后' }}查看
                </p>
                <div class="flex gap-3">
                  <button
                    v-if="document?.payMode == 1"
                    class="lock-btn lock-btn-vip"
                    @click="handleOpenVip"
                  >
                    <Icon name="ep:trophy" class="mr-1" />
                    开通VIP
                  </button>
                  <button
                    v-else
                    class="lock-btn lock-btn-buy"
                    @click="handlePurchase"
                  >
                    <Icon name="ep:shopping-cart" class="mr-1" />
                    购买下载
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧侧边栏 -->
        <div class="lg:col-span-3 space-y-6">
          <!-- 用户信息卡片 -->
          <ClientOnly>
            <div
                v-if="isLogin"
                class="bg-white rounded-xl shadow-lg shadow-blue-100/50 border border-blue-100 overflow-hidden">
              <!-- 头部渐变 -->
              <div class="h-20 bg-gradient-to-r from-blue-500 to-cyan-500 relative">
                <div class="absolute -bottom-8 left-4">
                  <el-avatar :size="64" :src="user?.avatar" class="border-4 border-white shadow-md"/>
                </div>
              </div>
              <!-- 用户信息 -->
              <div class="pt-10 pb-4 px-4">
                <div class="text-center mb-4">
                  <h3 class="font-bold text-slate-800 text-lg">{{ user?.nickname || '用户' }}</h3>
                  <p class="text-sm text-slate-500 mt-1">{{ user?.level?.name || '普通会员' }}</p>
                </div>
                <!-- 统计数据 -->
                <div class="grid grid-cols-2 gap-3 mb-4">
                  <div class="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3 text-center">
                    <div class="text-xl font-bold text-blue-600">{{ user?.point || 0 }}</div>
                    <div class="text-xs text-slate-500 mt-0.5">我的积分</div>
                  </div>
                  <div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-3 text-center">
                    <div class="text-xl font-bold text-emerald-600">{{ user?.experience || 0 }}</div>
                    <div class="text-xs text-slate-500 mt-0.5">我的经验</div>
                  </div>
                </div>
                <!-- 快捷入口 -->
                <div class="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100">
                  <NuxtLink
                      to="/account/profile"
                      class="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                    <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Icon name="ep:user-filled" class="text-xl text-blue-500"/>
                    </div>
                    <span class="text-xs text-slate-600">个人中心</span>
                  </NuxtLink>
                  <NuxtLink
                      to="/account/favorites"
                      class="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-yellow-50 transition-colors">
                    <div class="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Icon name="ep:star-filled" class="text-xl text-yellow-500"/>
                    </div>
                    <span class="text-xs text-slate-600">我的收藏</span>
                  </NuxtLink>
                  <NuxtLink
                      to="/account/downloads"
                      class="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-cyan-50 transition-colors">
                    <div class="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
                      <Icon name="ep:download" class="text-xl text-cyan-500"/>
                    </div>
                    <span class="text-xs text-slate-600">下载记录</span>
                  </NuxtLink>
                </div>
              </div>
            </div>

            <!-- 未登录状态 -->
            <div v-else class="bg-white rounded-xl shadow-lg shadow-blue-100/50 border border-blue-100 p-5">
              <div class="text-center">
                <div
                    class="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                  <Icon name="ep:user" class="text-3xl text-blue-500"/>
                </div>
                <h3 class="font-bold text-slate-800 mb-2">欢迎来到学次元</h3>
                <p class="text-sm text-slate-500 mb-4">登录后下载更多精品资料</p>
                <button
                    class="w-full py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg shadow-blue-500/30"
                    @click="openModal('login')"
                >
                  立即登录
                </button>
              </div>
            </div>
          </ClientOnly>

          <!-- 广告Banner -->
<!--          <div class="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-5 text-white overflow-hidden shadow-lg shadow-blue-200">-->
<!--            <div class="text-xs text-white/80 mb-1">在线题库网 | 一建新教材1月发布</div>-->
<!--            <h3 class="text-lg font-bold mb-2">2026一建新课火热开播</h3>-->
<!--            <p class="text-xs text-white/80 mb-3">新课低至6.4折，买课送【书籍大礼包】</p>-->
<!--            <button class="px-4 py-1.5 text-sm bg-white text-blue-600 rounded-full hover:bg-white/90 transition-colors font-medium">-->
<!--              立即下单▶-->
<!--            </button>-->
<!--          </div>-->

          <!-- 看过的人都在学 -->
<!--          <div class="bg-white rounded-2xl shadow-lg shadow-blue-100/50 border border-blue-100 p-5">-->
<!--            <h3 class="font-bold text-slate-800 mb-4 flex items-center gap-2">-->
<!--              <Icon name="mdi:fire" class="text-red-500" />-->
<!--              看过的人都在学-->
<!--            </h3>-->
<!--            <div class="space-y-4">-->
<!--              <div class="flex gap-3">-->
<!--                <div class="w-20 h-14 rounded-lg overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100 shrink-0 flex items-center justify-center">-->
<!--                  <Icon name="ep:alarm-clock" class="text-amber-500 text-xl" />-->
<!--                </div>-->
<!--                <div class="flex-1 min-w-0">-->
<!--                  <h4 class="text-sm font-medium text-slate-700 line-clamp-2 mb-2">-->
<!--                    6月17日报名！2026年一建报考答疑+备考指导-->
<!--                  </h4>-->
<!--                  <button class="px-4 py-1 text-xs text-blue-600 border border-blue-200 bg-blue-50 rounded-full hover:bg-blue-500 hover:text-white transition-colors">-->
<!--                    免费报名-->
<!--                  </button>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->

          <!-- 加学霸君 -->
<!--          <div class="bg-white rounded-2xl shadow-lg shadow-blue-100/50 border border-blue-100 p-5">-->
<!--            <h3 class="font-bold text-slate-800 mb-4 flex items-center gap-2">-->
<!--              <Icon name="ep:user" class="text-blue-500" />-->
<!--              加学霸君 距考过更近一步-->
<!--            </h3>-->
<!--            <div class="flex items-start gap-3">-->
<!--              <div class="w-24 h-24 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl flex items-center justify-center shrink-0">-->
<!--                <Icon name="mdi:qrcode" class="text-4xl text-blue-400" />-->
<!--              </div>-->
<!--              <div class="text-sm text-slate-500 space-y-1">-->
<!--                <p>免费领精品资料</p>-->
<!--                <p>掌握考情信息</p>-->
<!--                <p>知晓资料更新进度</p>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->

          <!-- 推荐相关资料 -->
          <div v-if="document?.relatedDocuments && document.relatedDocuments.length > 0" class="bg-white rounded-2xl shadow-lg shadow-blue-100/50 border border-blue-100 p-5">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-bold text-slate-800 flex items-center gap-2">
                <Icon name="ep:folder" class="text-blue-500" />
                推荐相关资料
              </h3>
              <span class="text-sm text-blue-500 cursor-pointer hover:underline">更多</span>
            </div>
            <div class="space-y-4">
              <div
                v-for="item in document.relatedDocuments"
                :key="item.id"
                class="cursor-pointer group"
                @click="handleViewDetail(item.id)"
              >
                <h4 class="text-sm text-slate-700 line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
                  {{ item.title }}
                </h4>
                <div class="flex items-center justify-between text-xs">
                  <span class="text-red-500">
                    <span v-if="item.isFree">免费</span>
                    <span v-else-if="item.isVip">专享</span>
                    <span v-else>¥{{ item.price }}</span>
                  </span>
                  <span class="text-slate-400">下载数：{{ item.downloadCount || 0 }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 热门资料排行榜 -->
          <div class="bg-white rounded-2xl shadow-lg shadow-blue-100/50 border border-blue-100 p-5">
            <h3 class="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Icon name="ep:trophy" class="text-amber-500" />
              热门资料排行榜
            </h3>
            <div class="space-y-4">
              <div
                v-for="(item, index) in hotDocuments"
                :key="item.id"
                class="flex items-start gap-3 cursor-pointer group"
                @click="handleViewDetail(item.id)"
              >
                <div
                  :class="getRankStyle(index)"
                  class="w-5 h-5 rounded flex items-center justify-center text-xs font-bold shrink-0"
                >
                  {{ index + 1 }}
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm text-slate-700 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {{ item.title }}
                  </h4>
                  <div class="flex items-center justify-between text-xs mt-1">
                    <span class="text-red-500">
                      <span v-if="item.isFree">免费</span>
                      <span v-else-if="item.isVip">专享</span>
                      <span v-else>¥{{ item.price }}</span>
                    </span>
                    <span class="text-slate-400">下载数：{{ item.downloadCount || 0 }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 其他考友都在做 -->
<!--          <div class="bg-white rounded-2xl shadow-lg shadow-blue-100/50 border border-blue-100 p-5">-->
<!--            <div class="flex items-center justify-between mb-4">-->
<!--              <h3 class="font-bold text-slate-800 flex items-center gap-2">-->
<!--                <Icon name="ep:edit" class="text-cyan-500" />-->
<!--                其他考友都在做-->
<!--              </h3>-->
<!--              <span class="text-sm text-blue-500 cursor-pointer hover:underline">更多</span>-->
<!--            </div>-->
<!--            <div class="space-y-3">-->
<!--              <div class="flex items-center gap-3 cursor-pointer group">-->
<!--                <div class="w-8 h-10 bg-gradient-to-br from-red-100 to-pink-100 rounded flex items-center justify-center shrink-0">-->
<!--                  <span class="text-red-500 text-xs font-bold">真题</span>-->
<!--                </div>-->
<!--                <div class="flex-1 min-w-0">-->
<!--                  <h4 class="text-sm text-slate-700 line-clamp-1 group-hover:text-blue-600 transition-colors">-->
<!--                    2025年一级建造师考试《建设工程项目管理》真题及解析-->
<!--                  </h4>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
        </div>
      </div>
    </div>

    <!-- 底部固定下载栏 -->
    <transition name="slide-up">
      <div
        v-if="showFixedBar"
        class="fixed bottom-0 left-0 right-0 bg-white border-t border-blue-100 shadow-lg z-50"
      >
        <div class="container mx-auto px-4 py-3">
          <div class="flex items-center justify-between">
            <!-- 左侧文档信息 -->
            <div class="flex items-center gap-3 overflow-hidden">
              <span class="px-2 py-0.5 text-xs font-medium text-white bg-gradient-to-r from-red-500 to-pink-500 rounded shrink-0">推荐</span>
              <h3 class="text-sm font-medium text-slate-800 truncate max-w-[300px] md:max-w-[500px]">
                {{ document?.title }}
              </h3>
              <div class="hidden md:flex items-center gap-4 text-xs text-slate-500 shrink-0">
                <span class="text-red-500">
                  <span v-if="document?.payMode == 0">免费</span>
                  <span v-else-if="document?.payMode == 1">VIP专享</span>
                  <span v-else>¥{{ document?.downloadPrice }}</span>
                </span>
                <span>{{ fileSizeFormatter(document?.fileSize) }}</span>
                <span>下载数：{{ document?.downloadCount || 0 }}</span>
                <span>更新时间：{{ formatDate(document?.publishDate, 'YYYY-MM-DD') }}</span>
              </div>
            </div>

            <!-- 右侧下载按钮 -->
            <div class="flex items-center gap-3 shrink-0">
              <span class="hidden md:block text-xs text-blue-500 cursor-pointer hover:underline">新人注册即送30个下载币</span>
              <button
                v-if="document?.payMode == 0"
                class="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-sm font-medium hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/30"
                @click="handleDownload"
              >
                立即下载
              </button>
              <button
                v-else-if="document?.payMode == 1 && hasFullAccess"
                class="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-sm font-medium hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/30"
                @click="handleDownload"
              >
                VIP下载
              </button>
              <button
                v-else-if="document?.payMode == 1"
                class="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-sm font-medium hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/30"
                @click="handleOpenVip"
              >
                开通VIP
              </button>
              <button
                v-else
                class="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-sm font-medium hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/30"
                @click="handlePurchase"
              >
                购买下载
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* 文档预览容器 */
.document-preview-container {
  position: relative;
  min-height: 500px;
}

/* 预览页面列表 */
.preview-pages {
  padding: 16px;
}

.preview-page-item {
  margin-bottom: 16px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* 完整预览时可滚动 */
.preview-pages:has(.preview-page-item) {
  max-height: 80vh;
  overflow-y: auto;
}

/* 模糊遮罩覆盖层 */
.preview-lock-overlay {
  position: relative;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.95) 20%, rgba(255, 255, 255, 1) 100%);
}

.lock-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.lock-text {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.lock-btn {
  display: inline-flex;
  align-items: center;
  padding: 8px 24px;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.lock-btn-vip {
  background: linear-gradient(to right, #f59e0b, #f97316);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.lock-btn-vip:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(245, 158, 11, 0.4);
}

.lock-btn-buy {
  background: linear-gradient(to right, #3b82f6, #06b6d4);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.lock-btn-buy:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

/* 底部栏动画 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* 文字截断 */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
