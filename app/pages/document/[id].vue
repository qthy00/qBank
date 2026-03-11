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
    const link = document.createElement('a')
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
  <div class="min-h-screen bg-gray-50">
    <!-- 面包屑导航 -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-6xl mx-auto px-4 py-4">
        <div class="flex items-center text-sm text-gray-500">
          <span class="cursor-pointer hover:text-blue-600" @click="handleBack">首页</span>
          <Icon name="ep:arrow-right" class="mx-2 text-xs" />
          <span class="cursor-pointer hover:text-blue-600" @click="handleBack">文档下载</span>
          <Icon name="ep:arrow-right" class="mx-2 text-xs" />
          <span class="text-gray-800 line-clamp-1 max-w-md">{{ document?.title || '文档详情' }}</span>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 py-6">
      <div v-loading="loading" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 左侧主要内容 -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <!-- 文档头部信息 -->
            <div class="p-6 border-b border-gray-100">
              <div class="flex gap-6">
                <!-- 封面图 -->
                <div class="flex-shrink-0">
                  <div class="w-40 h-52 rounded-lg overflow-hidden bg-gray-100 shadow-md">
                    <img
                      v-if="document?.coverImage"
                      :src="document.coverImage"
                      :alt="document.title"
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                      <Icon name="ep:document" class="text-5xl" />
                    </div>
                  </div>
                </div>

                <!-- 文档信息 -->
                <div class="flex-1">
                  <!-- 标签 -->
                  <div class="flex items-center gap-2 mb-3">
                    <span
                      v-if="document?.isFree"
                      class="px-2 py-1 text-xs font-medium text-white bg-green-500 rounded"
                    >
                      免费
                    </span>
                    <span
                      v-else-if="document?.isVip"
                      class="px-2 py-1 text-xs font-medium text-white bg-orange-500 rounded"
                    >
                      VIP专享
                    </span>
                    <span
                      v-else
                      class="px-2 py-1 text-xs font-medium text-white bg-blue-500 rounded"
                    >
                      ¥{{ document?.price }}
                    </span>
                    <span class="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded">
                      {{ document?.categoryName }}
                    </span>
                    <span class="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded">
                      {{ document?.fileType }}
                    </span>
                  </div>

                  <!-- 标题 -->
                  <h1 class="text-xl font-bold text-gray-800 mb-4">
                    {{ document?.title }}
                  </h1>

                  <!-- 摘要 -->
                  <p class="text-sm text-gray-500 mb-4">
                    {{ document?.summary }}
                  </p>

                  <!-- 元信息 -->
                  <div class="grid grid-cols-2 gap-3 text-sm text-gray-500 mb-4">
                    <div class="flex items-center gap-2">
                      <Icon name="ep:document" />
                      <span>文件大小：{{ formatFileSize(document?.fileSize) }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <Icon name="ep:files" />
                      <span>页数：{{ document?.pages }}页</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <Icon name="ep:download" />
                      <span>下载次数：{{ formatDownloadCount(document?.downloadCount || 0) }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <Icon name="ep:calendar" />
                      <span>年份：{{ document?.year }}年</span>
                    </div>
                  </div>

                  <!-- 下载按钮 -->
                  <div class="flex items-center gap-3">
                    <button
                      v-if="document?.isFree"
                      class="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      @click="handleDownload"
                    >
                      <Icon name="ep:download" />
                      <span>立即下载</span>
                    </button>
                    <button
                      v-else-if="document?.isVip"
                      class="flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                      @click="handleDownload"
                    >
                      <Icon name="ep:download" />
                      <span>VIP下载</span>
                    </button>
                    <button
                      v-else
                      class="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Icon name="ep:shopping-cart" />
                      <span>购买下载 (¥{{ document?.price }})</span>
                    </button>

                    <button
                      class="flex items-center gap-2 px-6 py-2.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
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
            <div class="p-6">
              <h2 class="text-lg font-semibold text-gray-800 mb-4">文档介绍</h2>
              <div class="prose prose-base max-w-none document-content" v-html="document?.content"></div>

              <!-- 标签 -->
              <div v-if="document?.tags && document.tags.length > 0" class="mt-6 pt-6 border-t border-gray-100">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="text-sm text-gray-500">标签：</span>
                  <span
                    v-for="tag in document.tags"
                    :key="tag"
                    class="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 cursor-pointer transition-colors"
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
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">下载说明</h3>
            <div class="space-y-3 text-sm text-gray-600">
              <div class="flex items-start gap-2">
                <Icon name="ep:info-filled" class="text-blue-500 mt-0.5" />
                <span>下载后请使用PDF阅读器打开</span>
              </div>
              <div class="flex items-start gap-2">
                <Icon name="ep:info-filled" class="text-blue-500 mt-0.5" />
                <span>建议打印后学习，便于做笔记</span>
              </div>
              <div class="flex items-start gap-2">
                <Icon name="ep:info-filled" class="text-blue-500 mt-0.5" />
                <span>资料仅供个人学习使用</span>
              </div>
            </div>
          </div>

          <!-- 相关文档 -->
          <div v-if="document?.relatedDocuments && document.relatedDocuments.length > 0" class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">相关文档</h3>
            <div class="space-y-4">
              <div
                v-for="item in document.relatedDocuments"
                :key="item.id"
                class="group cursor-pointer"
                @click="router.push(`/document/${item.id}`)"
              >
                <div class="flex gap-3">
                  <div class="w-16 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      v-if="item.coverImage"
                      :src="item.coverImage"
                      :alt="item.title"
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                      <Icon name="ep:document" class="text-lg" />
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {{ item.title }}
                    </h4>
                    <div class="flex items-center gap-2 mt-1">
                      <span v-if="item.isFree" class="text-xs text-green-600">免费</span>
                      <span v-else-if="item.isVip" class="text-xs text-orange-600">VIP</span>
                      <span v-else class="text-xs text-blue-600">¥{{ item.price }}</span>
                      <span class="text-xs text-gray-400">{{ formatDownloadCount(item.downloadCount) }}下载</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 广告位/推广 -->
          <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
            <h3 class="text-lg font-semibold mb-2">开通VIP会员</h3>
            <p class="text-sm text-blue-100 mb-4">畅享所有文档免费下载，专属客服支持</p>
            <button class="w-full py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
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
  line-height: 1.8;
  color: #374151;
}

.document-content :deep(p) {
  margin-bottom: 1rem;
}

.document-content :deep(h2) {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.document-content :deep(ul) {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
  list-style-type: disc;
}

.document-content :deep(ol) {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
  list-style-type: decimal;
}

.document-content :deep(li) {
  margin-bottom: 0.5rem;
}

.document-content :deep(blockquote) {
  border-left: 4px solid #e5e7eb;
  padding-left: 1rem;
  margin: 1rem 0;
  color: #6b7280;
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
