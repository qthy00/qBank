<script setup lang="ts">
import {DocumentApi} from '~/api/document'
import type {DocumentDetailVO, DocumentVO} from '~/types/document'
import {fileSizeFormatter, formatCount} from "~/utils";

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const router = useRouter()
const message = useMessage()

/* 文档详情 */
const document = ref<DocumentDetailVO | null>(null)
const loading = ref(false)

/* 热门文档排行 */
const hotDocuments = ref<DocumentVO[]>([])

/* 控制底部固定栏显示 */
const showFixedBar = ref(false)

/* 获取文档详情 */
const fetchDocumentDetail = async () => {
  const id = Number(route.params.id)
  if (!id) {
    router.push('/document')
    return
  }

  loading.value = true
  try {
    const data = await DocumentApi.getDocumentDetail(id)
    document.value = data

    /* 设置页面标题 */
    if (data?.title) {
      useHead({
        title: data.title
      })
    }
  } catch {
    message.error('文档不存在')
    router.push('/document')
  } finally {
    loading.value = false
  }
}

/* 获取热门文档 */
const fetchHotDocuments = async () => {
  try {
    const data = await DocumentApi.getDocumentList({
      pageNo: 1,
      pageSize: 5,
      sort: 'downloads'
    })
    hotDocuments.value = data.list || []
  } catch {
    /* 静默处理 */
  }
}

/* 返回列表 */
const handleBack = () => {
  router.push('/document')
}

/* 查看文档详情 */
const handleViewDetail = (id: number) => {
  router.push(`/document/${id}`)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/* 下载文档 */
const handleDownload = async () => {
  if (!document.value) return

  /* 检查是否需要付费 */
  if (!document.value.isFree && !document.value.isVip) {
    message.info('请先购买后再下载')
    return
  }

  try {
    await DocumentApi.incrementDownloadCount(document.value.id)
    const url = await DocumentApi.getDownloadUrl(document.value.id)
    const link = document.createElement('a')
    link.href = url
    link.download = document.value.title + '.' + document.value.fileType?.toLowerCase()
    link.click()
    message.success('开始下载')
  } catch {
    message.error('下载失败')
  }
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
  fetchDocumentDetail()
  fetchHotDocuments()
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
          <span class="cursor-pointer hover:text-white transition-colors" @click="router.push('/document')">资料中心</span>
          <Icon name="ep:arrow-right" class="mx-2 text-xs" />
          <span class="cursor-pointer hover:text-white transition-colors" @click="router.push('/document')">{{ document?.categoryName || '分类' }}</span>
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
                    <span v-if="document?.isFree">免费</span>
                    <span v-else-if="document?.isVip">VIP专享</span>
                    <span v-else>¥{{ document?.price }}</span>
                  </span>
                  <span>{{ fileSizeFormatter(document?.fileSize) }}</span>
                  <span>下载数：{{ document?.downloadCount || 0 }}</span>
                  <span>更新时间：{{ formatDate(document?.updateTime, 'YYYY-MM-DD') }}</span>
                </div>
              </div>

              <!-- 右侧下载按钮 -->
              <div class="flex flex-col items-end gap-2 shrink-0">
                <button
                  v-if="document?.isFree"
                  class="px-8 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full font-medium hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/30"
                  @click="handleDownload"
                >
                  立即下载
                </button>
                <button
                  v-else-if="document?.isVip"
                  class="px-8 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-medium hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/30"
                  @click="handleDownload"
                >
                  VIP下载
                </button>
                <button
                  v-else
                  class="px-8 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full font-medium hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/30"
                >
                  购买下载
                </button>
                <span class="text-xs text-blue-500 cursor-pointer hover:underline">新人注册即送30个下载币</span>
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
            <div class="document-preview p-8 min-h-[500px]">
              <!-- 模拟PDF内容预览 -->
              <div class="max-w-none document-content" v-html="document?.content"/>

              <!-- 如果没有内容，显示默认预览 -->
              <div v-if="!document?.content" class="flex flex-col items-center justify-center py-20 text-slate-400">
                <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center mb-4">
                  <Icon name="ep:document" class="text-4xl text-blue-400" />
                </div>
                <p>文档内容预览区域</p>
                <p class="text-sm mt-2">下载后可查看完整内容</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧侧边栏 -->
        <div class="lg:col-span-3 space-y-6">
          <!-- 广告Banner -->
          <div class="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-5 text-white overflow-hidden shadow-lg shadow-blue-200">
            <div class="text-xs text-white/80 mb-1">在线题库网 | 一建新教材1月发布</div>
            <h3 class="text-lg font-bold mb-2">2026一建新课火热开播</h3>
            <p class="text-xs text-white/80 mb-3">新课低至6.4折，买课送【书籍大礼包】</p>
            <button class="px-4 py-1.5 text-sm bg-white text-blue-600 rounded-full hover:bg-white/90 transition-colors font-medium">
              立即下单▶
            </button>
          </div>

          <!-- 看过的人都在学 -->
          <div class="bg-white rounded-2xl shadow-lg shadow-blue-100/50 border border-blue-100 p-5">
            <h3 class="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Icon name="ep:fire" class="text-red-500" />
              看过的人都在学
            </h3>
            <div class="space-y-4">
              <div class="flex gap-3">
                <div class="w-20 h-14 rounded-lg overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100 shrink-0 flex items-center justify-center">
                  <Icon name="ep:alarm-clock" class="text-amber-500 text-xl" />
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-medium text-slate-700 line-clamp-2 mb-2">
                    6月17日报名！2026年一建报考答疑+备考指导
                  </h4>
                  <button class="px-4 py-1 text-xs text-blue-600 border border-blue-200 bg-blue-50 rounded-full hover:bg-blue-500 hover:text-white transition-colors">
                    免费报名
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 加学霸君 -->
          <div class="bg-white rounded-2xl shadow-lg shadow-blue-100/50 border border-blue-100 p-5">
            <h3 class="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Icon name="ep:user" class="text-blue-500" />
              加学霸君 距考过更近一步
            </h3>
            <div class="flex items-start gap-3">
              <div class="w-24 h-24 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl flex items-center justify-center shrink-0">
                <Icon name="ep:qr-code" class="text-4xl text-blue-400" />
              </div>
              <div class="text-sm text-slate-500 space-y-1">
                <p>免费领精品资料</p>
                <p>掌握考情信息</p>
                <p>知晓资料更新进度</p>
              </div>
            </div>
          </div>

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
          <div class="bg-white rounded-2xl shadow-lg shadow-blue-100/50 border border-blue-100 p-5">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-bold text-slate-800 flex items-center gap-2">
                <Icon name="ep:edit" class="text-cyan-500" />
                其他考友都在做
              </h3>
              <span class="text-sm text-blue-500 cursor-pointer hover:underline">更多</span>
            </div>
            <div class="space-y-3">
              <div class="flex items-center gap-3 cursor-pointer group">
                <div class="w-8 h-10 bg-gradient-to-br from-red-100 to-pink-100 rounded flex items-center justify-center shrink-0">
                  <span class="text-red-500 text-xs font-bold">真题</span>
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm text-slate-700 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    2025年一级建造师考试《建设工程项目管理》真题及解析
                  </h4>
                </div>
              </div>
            </div>
          </div>
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
                  <span v-if="document?.isFree">免费</span>
                  <span v-else-if="document?.isVip">VIP专享</span>
                  <span v-else>¥{{ document?.price }}</span>
                </span>
                <span>{{ fileSizeFormatter(document?.fileSize) }}</span>
                <span>下载数：{{ document?.downloadCount || 0 }}</span>
                <span>更新时间：{{ formatDate(document?.updateTime, 'YYYY-MM-DD') }}</span>
              </div>
            </div>

            <!-- 右侧下载按钮 -->
            <div class="flex items-center gap-3 shrink-0">
              <span class="hidden md:block text-xs text-blue-500 cursor-pointer hover:underline">新人注册即送30个下载币</span>
              <button
                v-if="document?.isFree"
                class="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-sm font-medium hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/30"
                @click="handleDownload"
              >
                立即下载
              </button>
              <button
                v-else-if="document?.isVip"
                class="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-sm font-medium hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/30"
                @click="handleDownload"
              >
                VIP下载
              </button>
              <button
                v-else
                class="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-sm font-medium hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/30"
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
/* 文档内容样式 */
.document-content {
  line-height: 1.8;
  color: var(--color-text-primary);
}

.document-content :deep(p) {
  margin-bottom: 1rem;
  text-align: justify;
}

.document-content :deep(h1),
.document-content :deep(h2),
.document-content :deep(h3) {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.document-content :deep(h2) {
  font-size: 1.25rem;
}

.document-content :deep(h3) {
  font-size: 1.125rem;
}

.document-content :deep(ul),
.document-content :deep(ol) {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.document-content :deep(li) {
  margin-bottom: 0.5rem;
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
