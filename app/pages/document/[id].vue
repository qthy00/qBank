<script setup lang="ts">
import {DocumentApi} from '~/api/document'
import type {DocumentDetailVO} from '~/types/document'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const router = useRouter()
const message = useMessage()

/* 文档详情 */
const document = ref<DocumentDetailVO | null>(null)
const loading = ref(false)

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
  } catch (error) {
    console.error('获取文档详情失败:', error)
    message.error('文档不存在')
    router.push('/document')
  } finally {
    loading.value = false
  }
}

/* 返回列表 */
const handleBack = () => {
  router.push('/document')
}

/* 下载文档 */
const handleDownload = async () => {
  if (!document.value) return

  /* 检查是否需要付费 */
  if (!document.value.isFree && !document.value.isVip) {
    /* 需要购买 */
    message.info('请先购买后再下载')
    return
  }

  try {
    /* 增加下载次数 */
    await DocumentApi.incrementDownloadCount(document.value.id)

    /* 获取下载链接 */
    const url = await DocumentApi.getDownloadUrl(document.value.id)

    /* 模拟下载 */
    const link = document.value.createElement('a')
    link.href = url
    link.download = document.value.title + '.' + document.value.fileType?.toLowerCase()
    link.click()

    message.success('开始下载')
  } catch (error) {
    message.error('下载失败')
  }
}

/* 格式化文件大小 */
const formatFileSize = (bytes?: number): string => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

/* 格式化下载次数 */
const formatDownloadCount = (count: number): string => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + 'w'
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k'
  }
  return count.toString()
}

/* 初始化 */
onMounted(() => {
  fetchDocumentDetail()
})
</script>

<template>
  <div class="min-h-screen bg-(--color-bg-container)">
    <!-- 顶部渐变背景 -->
    <div class="relative h-56 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-(--color-primary) via-(--color-primary-light) to-(--color-primary-lighter)"/>
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2"/>
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2"/>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 -mt-32 relative z-10 pb-12">
      <!-- 面包屑导航 -->
      <div class="flex items-center text-sm text-white/80 mb-6">
        <span class="cursor-pointer hover:text-white transition-colors" @click="router.push('/')">首页</span>
        <Icon name="ep:arrow-right" class="mx-2 text-xs" />
        <span class="cursor-pointer hover:text-white transition-colors" @click="handleBack">文档下载</span>
        <Icon name="ep:arrow-right" class="mx-2 text-xs" />
        <span class="text-white line-clamp-1 max-w-xs">{{ document?.title || '文档详情' }}</span>
      </div>

      <div v-loading="loading" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 左侧主要内容 -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-2xl shadow-lg shadow-(--color-shadow)/50 overflow-hidden">
            <!-- 文档头部信息 -->
            <div class="p-8 border-b border-(--color-border-light)">
              <div class="flex gap-8">
                <!-- 封面图 -->
                <div class="flex-shrink-0">
                  <div class="w-44 h-56 rounded-xl overflow-hidden shadow-xl bg-gradient-to-br from-(--color-primary-light) to-(--color-primary-lighter) relative group">
                    <img
                      v-if="document?.coverImage"
                      :src="document.coverImage"
                      :alt="document.title"
                      class="w-full h-full object-cover"
                    >
                    <div v-else class="w-full h-full flex items-center justify-center">
                      <Icon name="ep:document" class="text-6xl text-(--color-primary)" />
                    </div>
                    <!-- 文件类型角标 -->
                    <div class="absolute top-3 left-3">
                      <span class="px-3 py-1.5 text-xs font-bold text-white bg-(--color-primary) rounded-full shadow-md">
                        {{ document?.fileType }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- 文档信息 -->
                <div class="flex-1">
                  <!-- 标签组 -->
                  <div class="flex items-center gap-2 mb-4">
                    <span
                      v-if="document?.isFree"
                      class="px-3 py-1.5 text-xs font-bold text-white bg-(--color-success) rounded-full shadow-md flex items-center gap-1"
                    >
                      <Icon name="ep:present" />
                      免费
                    </span>
                    <span
                      v-else-if="document?.isVip"
                      class="px-3 py-1.5 text-xs font-bold text-white bg-(--color-warning) rounded-full shadow-md flex items-center gap-1"
                    >
                      <Icon name="ep:medal" />
                      VIP专享
                    </span>
                    <span
                      v-else
                      class="px-3 py-1.5 text-xs font-bold text-white bg-(--color-danger) rounded-full shadow-md flex items-center gap-1"
                    >
                      <Icon name="ep:money" />
                      ¥{{ document?.price }}
                    </span>
                    <span class="px-3 py-1.5 text-xs font-bold text-(--color-primary) bg-(--color-primary-light) rounded-full">
                      {{ document?.categoryName }}
                    </span>
                    <span class="px-3 py-1.5 text-xs font-bold text-(--color-text-secondary) bg-(--color-bg-container) rounded-full">
                      {{ document?.year }}年
                    </span>
                  </div>

                  <!-- 标题 -->
                  <h1 class="text-2xl font-bold text-(--color-text-primary) mb-4">
                    {{ document?.title }}
                  </h1>

                  <!-- 摘要 -->
                  <p class="text-sm text-(--color-text-secondary) mb-5 leading-relaxed">
                    {{ document?.summary }}
                  </p>

                  <!-- 元信息网格 -->
                  <div class="grid grid-cols-2 gap-4 text-sm mb-6">
                    <div class="flex items-center gap-3 p-3 bg-(--color-bg-container) rounded-lg">
                      <div class="w-10 h-10 rounded-lg bg-(--color-primary-light) flex items-center justify-center">
                        <Icon name="ep:document" class="text-(--color-primary)" />
                      </div>
                      <div>
                        <div class="text-xs text-(--color-text-tertiary)">文件大小</div>
                        <div class="font-semibold text-(--color-text-primary)">{{ formatFileSize(document?.fileSize) }}</div>
                      </div>
                    </div>
                    <div class="flex items-center gap-3 p-3 bg-(--color-bg-container) rounded-lg">
                      <div class="w-10 h-10 rounded-lg bg-(--color-success-light) flex items-center justify-center">
                        <Icon name="ep:files" class="text-(--color-success)" />
                      </div>
                      <div>
                        <div class="text-xs text-(--color-text-tertiary)">页数</div>
                        <div class="font-semibold text-(--color-text-primary)">{{ document?.pages }}页</div>
                      </div>
                    </div>
                    <div class="flex items-center gap-3 p-3 bg-(--color-bg-container) rounded-lg">
                      <div class="w-10 h-10 rounded-lg bg-(--color-warning-light) flex items-center justify-center">
                        <Icon name="ep:download" class="text-(--color-warning)" />
                      </div>
                      <div>
                        <div class="text-xs text-(--color-text-tertiary)">下载次数</div>
                        <div class="font-semibold text-(--color-text-primary)">{{ formatDownloadCount(document?.downloadCount || 0) }}</div>
                      </div>
                    </div>
                    <div class="flex items-center gap-3 p-3 bg-(--color-bg-container) rounded-lg">
                      <div class="w-10 h-10 rounded-lg bg-(--color-info-light) flex items-center justify-center">
                        <Icon name="ep:calendar" class="text-(--color-info)" />
                      </div>
                      <div>
                        <div class="text-xs text-(--color-text-tertiary)">发布年份</div>
                        <div class="font-semibold text-(--color-text-primary)">{{ document?.year }}年</div>
                      </div>
                    </div>
                  </div>

                  <!-- 操作按钮 -->
                  <div class="flex items-center gap-3">
                    <button
                      v-if="document?.isFree"
                      class="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-(--color-success) to-(--color-success-dark) text-white rounded-xl hover:shadow-lg hover:shadow-(--color-success)/30 transition-all duration-300 transform hover:-translate-y-0.5"
                      @click="handleDownload"
                    >
                      <Icon name="ep:download" class="text-lg" />
                      <span class="font-semibold">立即下载</span>
                    </button>
                    <button
                      v-else-if="document?.isVip"
                      class="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-(--color-warning) to-(--color-warning-dark) text-white rounded-xl hover:shadow-lg hover:shadow-(--color-warning)/30 transition-all duration-300 transform hover:-translate-y-0.5"
                      @click="handleDownload"
                    >
                      <Icon name="ep:medal" class="text-lg" />
                      <span class="font-semibold">VIP下载</span>
                    </button>
                    <button
                      v-else
                      class="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-(--color-danger) to-(--color-danger-dark) text-white rounded-xl hover:shadow-lg hover:shadow-(--color-danger)/30 transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      <Icon name="ep:shopping-cart" class="text-lg" />
                      <span class="font-semibold">购买下载 (¥{{ document?.price }})</span>
                    </button>

                    <button
                      class="flex items-center gap-2 px-6 py-3 border-2 border-(--color-border) text-(--color-text-secondary) rounded-xl hover:bg-(--color-bg-container) hover:border-(--color-primary) hover:text-(--color-primary) transition-all duration-300"
                      @click="handleBack"
                    >
                      <Icon name="ep:arrow-left" />
                      <span>返回列表</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 文档内容/介绍 -->
            <div class="p-8">
              <div class="flex items-center gap-2 mb-6">
                <div class="w-1 h-6 bg-(--color-primary) rounded-full"/>
                <h2 class="text-lg font-bold text-(--color-text-primary)">文档介绍</h2>
              </div>
              <div class="prose prose-base max-w-none document-content" v-html="document?.content"/>

              <!-- 标签 -->
              <div v-if="document?.tags && document.tags.length > 0" class="mt-8 pt-6 border-t border-(--color-border-light)">
                <div class="flex items-center gap-3 flex-wrap">
                  <span class="text-sm text-(--color-text-secondary)">
                    <Icon name="ep:price-tag" class="mr-1" />
                    标签：
                  </span>
                  <span
                    v-for="tag in document.tags"
                    :key="tag"
                    class="px-4 py-1.5 text-sm text-(--color-primary) bg-(--color-primary-light) rounded-full hover:bg-(--color-primary) hover:text-white cursor-pointer transition-all duration-300"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧侧边栏 -->
        <div class="lg:col-span-1 space-y-6">
          <!-- 下载提示 -->
          <div class="bg-white rounded-2xl shadow-lg shadow-(--color-shadow)/50 p-6">
            <h3 class="text-lg font-semibold text-(--color-text-primary) mb-5 flex items-center gap-2">
              <Icon name="ep:info-filled" class="text-(--color-primary)" />
              下载说明
            </h3>
            <div class="space-y-4 text-sm">
              <div class="flex items-start gap-3 p-3 bg-(--color-primary-light) rounded-lg">
                <div class="w-8 h-8 rounded-full bg-(--color-primary) flex items-center justify-center shrink-0">
                  <span class="text-white text-xs font-bold">1</span>
                </div>
                <div>
                  <div class="font-medium text-(--color-text-primary)">文件格式</div>
                  <div class="text-(--color-text-secondary)">下载后请使用PDF阅读器打开</div>
                </div>
              </div>
              <div class="flex items-start gap-3 p-3 bg-(--color-success-light) rounded-lg">
                <div class="w-8 h-8 rounded-full bg-(--color-success) flex items-center justify-center shrink-0">
                  <span class="text-white text-xs font-bold">2</span>
                </div>
                <div>
                  <div class="font-medium text-(--color-text-primary)">学习建议</div>
                  <div class="text-(--color-text-secondary)">建议打印后学习，便于做笔记</div>
                </div>
              </div>
              <div class="flex items-start gap-3 p-3 bg-(--color-warning-light) rounded-lg">
                <div class="w-8 h-8 rounded-full bg-(--color-warning) flex items-center justify-center shrink-0">
                  <span class="text-white text-xs font-bold">3</span>
                </div>
                <div>
                  <div class="font-medium text-(--color-text-primary)">使用声明</div>
                  <div class="text-(--color-text-secondary)">资料仅供个人学习使用</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 相关文档 -->
          <div v-if="document?.relatedDocuments && document.relatedDocuments.length > 0" class="bg-white rounded-2xl shadow-lg shadow-(--color-shadow)/50 p-6">
            <h3 class="text-lg font-semibold text-(--color-text-primary) mb-5 flex items-center gap-2">
              <Icon name="ep:collection" class="text-(--color-primary)" />
              相关文档
            </h3>
            <div class="space-y-4">
              <div
                v-for="item in document.relatedDocuments"
                :key="item.id"
                class="group cursor-pointer"
                @click="router.push(`/document/${item.id}`)"
              >
                <div class="flex gap-3">
                  <div class="w-16 h-20 rounded-lg overflow-hidden bg-(--color-bg-container) flex-shrink-0">
                    <img
                      v-if="item.coverImage"
                      :src="item.coverImage"
                      :alt="item.title"
                      class="w-full h-full object-cover"
                    >
                    <div v-else class="w-full h-full flex items-center justify-center text-(--color-primary)">
                      <Icon name="ep:document" class="text-lg" />
                    </div>
                  </div>
                  <div class="flex-1 min-w-0 py-1">
                    <h4 class="text-sm font-medium text-(--color-text-primary) line-clamp-2 group-hover:text-(--color-primary) transition-colors">
                      {{ item.title }}
                    </h4>
                    <div class="flex items-center gap-2 mt-2">
                      <span
                        v-if="item.isFree"
                        class="px-2 py-0.5 text-xs text-white bg-(--color-success) rounded-full"
                      >
                        免费
                      </span>
                      <span
                        v-else-if="item.isVip"
                        class="px-2 py-0.5 text-xs text-white bg-(--color-warning) rounded-full"
                      >
                        VIP
                      </span>
                      <span v-else class="px-2 py-0.5 text-xs text-white bg-(--color-danger) rounded-full">
                        ¥{{ item.price }}
                      </span>
                      <span class="text-xs text-(--color-text-tertiary)">{{ formatDownloadCount(item.downloadCount) }}下载</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- VIP推广 -->
          <div class="bg-gradient-to-br from-(--color-warning) to-(--color-warning-dark) rounded-2xl shadow-lg shadow-(--color-warning)/30 p-6 text-white">
            <div class="flex items-center gap-2 mb-3">
              <Icon name="ep:medal" class="text-2xl" />
              <h3 class="text-lg font-semibold">开通VIP会员</h3>
            </div>
            <p class="text-sm text-white/90 mb-5">畅享所有文档免费下载，专属客服支持，更多会员权益等你来享</p>
            <button class="w-full py-3 bg-white text-(--color-warning) rounded-xl font-semibold hover:bg-white/90 transition-colors shadow-lg">
              立即开通
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.document-content {
  line-height: 1.9;
  color: var(--color-text-primary);
}

.document-content :deep(p) {
  margin-bottom: 1.25rem;
  text-align: justify;
}

.document-content :deep(h2) {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.document-content :deep(ul) {
  margin-bottom: 1.25rem;
  padding-left: 1.5rem;
  list-style-type: disc;
}

.document-content :deep(ol) {
  margin-bottom: 1.25rem;
  padding-left: 1.5rem;
  list-style-type: decimal;
}

.document-content :deep(li) {
  margin-bottom: 0.5rem;
}

.document-content :deep(blockquote) {
  border-left: 4px solid var(--color-primary);
  padding: 1rem 1.5rem;
  margin: 1rem 0;
  background-color: var(--color-bg-container);
  border-radius: 0 0.5rem 0.5rem 0;
  color: var(--color-text-secondary);
  font-style: italic;
}

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
