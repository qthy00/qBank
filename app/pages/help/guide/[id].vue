<template>
  <div class="guide-detail-page">
    <!-- 页面头部 -->
    <div class="page-header bg-gradient-to-r from-blue-500 to-blue-600 py-10">
      <div class="container mx-auto px-4">
        <div class="flex items-center gap-2 text-white/80 mb-2">
          <NuxtLink to="/help" class="hover:text-white">帮助中心</NuxtLink>
          <Icon name="ep:arrow-right" class="text-sm" />
          <NuxtLink to="/help/guide" class="hover:text-white">使用指南</NuxtLink>
          <Icon name="ep:arrow-right" class="text-sm" />
          <span>详情</span>
        </div>
        <h1 class="text-2xl font-bold text-white line-clamp-1">{{ guide?.title || '指南详情' }}</h1>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- 左侧内容 -->
        <div class="flex-1">
          <el-skeleton v-if="loading" :rows="10" animated />

          <div v-else-if="!guide" class="empty-state py-16 text-center bg-(--color-bg-container) rounded-lg border border-(--color-border)">
            <Icon name="ep:document" class="text-6xl text-gray-300 mb-4" />
            <p class="text-(--color-text-secondary)">指南不存在或已被删除</p>
            <el-button type="primary" class="mt-4" @click="navigateTo('/help/guide')">
              返回指南列表
            </el-button>
          </div>

          <div v-else class="bg-(--color-bg-container) rounded-lg border border-(--color-border) overflow-hidden">
            <!-- 封面图 -->
            <div v-if="guide.coverImage" class="h-64 overflow-hidden">
              <img
                :src="guide.coverImage"
                :alt="guide.title"
                class="w-full h-full object-cover"
              >
            </div>

            <!-- 内容区域 -->
            <div class="p-6">
              <!-- 标题和标签 -->
              <div class="flex items-center gap-2 mb-4">
                <el-tag v-if="guide.isTop" type="success">置顶</el-tag>
                <el-tag type="info">{{ guide.categoryName }}</el-tag>
              </div>

              <h1 class="text-2xl font-bold text-(--color-text-primary) mb-4">{{ guide.title }}</h1>

              <!-- 元信息 -->
              <div class="flex items-center gap-6 text-sm text-(--color-text-secondary) mb-6 pb-6 border-b border-(--color-border)">
                <span class="flex items-center gap-1">
                  <Icon name="ep:user" />
                  {{ guide.author }}
                </span>
                <span class="flex items-center gap-1">
                  <Icon name="ep:calendar" />
                  {{ guide.publishTime }}
                </span>
                <span class="flex items-center gap-1">
                  <Icon name="ep:view" />
                  {{ formatNumber(guide.viewCount) }} 阅读
                </span>
              </div>

              <!-- 正文内容 -->
              <div class="guide-content" v-html="guide.content" />
            </div>
          </div>
        </div>

        <!-- 右侧侧边栏 -->
        <div class="w-full lg:w-80 flex-shrink-0 space-y-6">
          <!-- 相关指南 -->
          <div class="bg-(--color-bg-container) rounded-lg border border-(--color-border) p-4">
            <h3 class="font-bold text-(--color-text-primary) mb-4 flex items-center gap-2">
              <Icon name="ep:document" />
              相关指南
            </h3>
            <el-skeleton v-if="relatedLoading" :rows="4" animated />
            <div v-else-if="relatedGuides.length === 0" class="text-center py-4 text-(--color-text-secondary)">
              暂无相关指南
            </div>
            <div v-else class="space-y-3">
              <NuxtLink
                v-for="item in relatedGuides"
                :key="item.id"
                :to="`/help/guide/${item.id}`"
                class="related-item flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <img
                  :src="item.coverImage || '/images/default-guide.jpg'"
                  :alt="item.title"
                  class="w-16 h-12 object-cover rounded flex-shrink-0"
                >
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-medium text-(--color-text-primary) line-clamp-2 hover:text-blue-500 transition-colors">{{ item.title }}</h4>
                  <p class="text-xs text-(--color-text-secondary) mt-1">{{ formatDate(item.publishTime) }}</p>
                </div>
              </NuxtLink>
            </div>
          </div>

          <!-- 常见问题 -->
          <div class="bg-(--color-bg-container) rounded-lg border border-(--color-border) p-4">
            <h3 class="font-bold text-(--color-text-primary) mb-4 flex items-center gap-2">
              <Icon name="ep:question-filled" />
              热门问题
            </h3>
            <div class="space-y-2">
              <NuxtLink
                v-for="i in 5"
                :key="i"
                to="/help/faq"
                class="hot-faq-item flex items-center gap-2 p-2 rounded hover:bg-gray-50 transition-colors"
              >
                <span
class="w-5 h-5 flex items-center justify-center rounded text-xs font-bold"
                      :class="i <= 3 ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-500'">
                  {{ i }}
                </span>
                <span class="text-sm text-(--color-text-primary) line-clamp-1 hover:text-blue-500 transition-colors">
                  热门问题 {{ i }}
                </span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GuideVO } from '~/types/help'
import { getMockGuideDetail, getMockGuideList } from '~/api/help/mock'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const loading = ref(true)
const relatedLoading = ref(true)
const guide = ref<GuideVO | null>(null)
const relatedGuides = ref<GuideVO[]>([])

/* 获取指南详情 */
const fetchGuideDetail = async () => {
  loading.value = true
  try {
    const id = parseInt(route.params.id as string)
    if (!id) {
      guide.value = null
      return
    }
    const data = await getMockGuideDetail(id)
    guide.value = data
  } finally {
    loading.value = false
  }
}

/* 获取相关指南 */
const fetchRelatedGuides = async () => {
  relatedLoading.value = true
  try {
    const res = await getMockGuideList({ page: 1, pageSize: 4 })
    /* 过滤掉当前指南 */
    const currentId = parseInt(route.params.id as string)
    relatedGuides.value = res.list.filter(item => item.id !== currentId).slice(0, 3)
  } finally {
    relatedLoading.value = false
  }
}

/* 格式化数字 */
const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toString()
}

/* 格式化日期 */
const formatDate = (date: string) => {
  return date.split(' ')[0]
}

onMounted(() => {
  fetchGuideDetail()
  fetchRelatedGuides()
})
</script>

<style scoped lang="scss">
.page-header {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.guide-content {
  :deep(h2) {
    font-size: 20px;
    font-weight: bold;
    color: var(--color-text-primary);
    margin: 24px 0 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--color-border);
  }

  :deep(h3) {
    font-size: 16px;
    font-weight: bold;
    color: var(--color-text-primary);
    margin: 20px 0 12px;
  }

  :deep(p) {
    color: var(--color-text-secondary);
    line-height: 1.8;
    margin: 12px 0;
  }

  :deep(ul), :deep(ol) {
    color: var(--color-text-secondary);
    line-height: 1.8;
    margin: 12px 0;
    padding-left: 24px;
  }

  :deep(li) {
    margin: 8px 0;
  }

  :deep(strong) {
    color: var(--color-text-primary);
  }

  :deep(a) {
    color: #3b82f6;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  :deep(img) {
    max-width: 100%;
    border-radius: 8px;
    margin: 16px 0;
  }

  :deep(blockquote) {
    border-left: 4px solid #3b82f6;
    padding-left: 16px;
    margin: 16px 0;
    color: var(--color-text-secondary);
    background: #f8fafc;
    padding: 12px 16px;
    border-radius: 4px;
  }

  :deep(code) {
    background: #f1f5f9;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: monospace;
  }

  :deep(pre) {
    background: #1e293b;
    color: #e2e8f0;
    padding: 16px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 16px 0;

    code {
      background: transparent;
      padding: 0;
    }
  }
}

.related-item {
  text-decoration: none;
}

.hot-faq-item {
  text-decoration: none;
}
</style>
