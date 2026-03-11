<script setup lang="ts">
import {ArticleApi} from '~/api/article'
import type {ArticleDetailVO} from '~/types/article'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const router = useRouter()

/* 资讯详情 */
const article = ref<ArticleDetailVO | null>(null)
const loading = ref(false)

/* 相关资讯 */
const relatedArticles = ref<ArticleDetailVO[]>([])

/* 获取资讯详情 */
const fetchArticleDetail = async () => {
  const id = Number(route.params.id)
  if (!id) {
    router.push('/article')
    return
  }

  loading.value = true
  try {
    const data = await ArticleApi.getArticleDetailById(id)
    article.value = data

    /* 设置页面标题 */
    if (data?.title) {
      useHead({
        title: data.title
      })
    }

    /* 增加浏览量 */
    ArticleApi.incrementViewCount(id).catch(() => {})
  } catch (error) {
    console.error('获取资讯详情失败:', error)
  } finally {
    loading.value = false
  }
}

/* 获取相关资讯 */
const fetchRelatedArticles = async () => {
  try {
    const data = await ArticleApi.getArticleList({
      page: 1,
      limit: 5,
    })
    /* 过滤掉当前文章 */
    relatedArticles.value = (data.list || [])
      .filter(item => item.id !== Number(route.params.id))
      .slice(0, 4)
  } catch (error) {
    console.error('获取相关资讯失败:', error)
  }
}

/* 返回列表 */
const handleBack = () => {
  router.push('/article')
}

/* 查看详情 */
const handleViewDetail = (id: number) => {
  router.push(`/article/${id}`)
  /* 滚动到顶部 */
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/* 分享功能 */
const handleShare = async (type: 'wechat' | 'weibo' | 'link') => {
  const url = window.location.href
  const title = article.value?.title || ''

  switch (type) {
    case 'wechat':
      /* 复制链接到剪贴板 */
      await navigator.clipboard.writeText(url)
      useMessage().success('链接已复制，快去分享给好友吧')
      break
    case 'weibo':
      window.open(`https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`)
      break
    case 'link':
      await navigator.clipboard.writeText(url)
      useMessage().success('链接已复制到剪贴板')
      break
  }
}

/* 初始化 */
onMounted(() => {
  fetchArticleDetail()
  fetchRelatedArticles()
})

/* 监听路由变化，切换文章时重新加载 */
watch(() => route.params.id, () => {
  if (route.params.id) {
    fetchArticleDetail()
    fetchRelatedArticles()
  }
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
          <span class="cursor-pointer hover:text-blue-600" @click="handleBack">资讯中心</span>
          <Icon name="ep:arrow-right" class="mx-2 text-xs" />
          <span class="text-gray-800 line-clamp-1 max-w-md">{{ article?.title || '资讯详情' }}</span>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 左侧主要内容 -->
        <div class="lg:col-span-2">
          <div v-loading="loading" class="bg-white rounded-xl shadow-sm overflow-hidden">
            <!-- 文章头部 -->
            <div class="p-6 border-b border-gray-100">
              <!-- 分类标签 -->
              <div class="flex items-center gap-2 mb-4">
                <span
                  v-if="article?.categoryName"
                  class="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full"
                >
                  {{ article.categoryName }}
                </span>
                <span
                  v-if="article?.isTop"
                  class="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-full"
                >
                  置顶
                </span>
                <span
                  v-if="article?.isHot"
                  class="px-3 py-1 text-xs font-medium text-orange-600 bg-orange-50 rounded-full"
                >
                  热门
                </span>
              </div>

              <!-- 标题 -->
              <h1 class="text-2xl font-bold text-gray-800 mb-4 leading-tight">
                {{ article?.title }}
              </h1>

              <!-- 元信息 -->
              <div class="flex items-center gap-6 text-sm text-gray-500">
                <span v-if="article?.author" class="flex items-center gap-1">
                  <Icon name="ep:user" />
                  {{ article.author }}
                </span>
                <span v-if="article?.publishTime" class="flex items-center gap-1">
                  <Icon name="ep:clock" />
                  {{ formatDate(article.publishTime) }}
                </span>
                <span class="flex items-center gap-1">
                  <Icon name="ep:view" />
                  {{ article?.viewCount || 0 }} 阅读
                </span>
                <span v-if="article?.source" class="flex items-center gap-1">
                  <Icon name="ep:link" />
                  来源：{{ article.source }}
                </span>
              </div>
            </div>

            <!-- 文章内容 -->
            <div class="p-6">
              <!-- 封面图 -->
              <div v-if="article?.coverImage" class="mb-6">
                <img
                  :src="article.coverImage"
                  :alt="article.title"
                  class="w-full h-64 object-cover rounded-lg"
                />
              </div>

              <!-- 正文 -->
              <div class="prose prose-lg max-w-none article-content" v-html="article?.content"></div>

              <!-- 标签 -->
              <div v-if="article?.tags && article.tags.length > 0" class="mt-8 pt-6 border-t border-gray-100">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="text-sm text-gray-500">标签：</span>
                  <span
                    v-for="tag in article.tags"
                    :key="tag"
                    class="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 cursor-pointer transition-colors"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 文章底部 -->
            <div class="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <div class="flex items-center justify-between">
                <!-- 上一篇/下一篇 -->
                <div class="flex items-center gap-4">
                  <button
                    v-if="article?.prevArticle"
                    class="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    @click="handleViewDetail(article.prevArticle.id)"
                  >
                    <Icon name="ep:arrow-left" />
                    <span class="line-clamp-1 max-w-xs">{{ article.prevArticle.title }}</span>
                  </button>
                </div>
                <div class="flex items-center gap-4">
                  <button
                    v-if="article?.nextArticle"
                    class="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    @click="handleViewDetail(article.nextArticle.id)"
                  >
                    <span class="line-clamp-1 max-w-xs">{{ article.nextArticle.title }}</span>
                    <Icon name="ep:arrow-right" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧侧边栏 -->
        <div class="lg:col-span-1 space-y-6">
          <!-- 分享卡片 -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">分享资讯</h3>
            <div class="flex items-center gap-3">
              <button
                class="flex-1 flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                @click="handleShare('wechat')"
              >
                <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Icon name="fa:weixin" class="text-green-600 text-xl" />
                </div>
                <span class="text-xs text-gray-600">微信</span>
              </button>
              <button
                class="flex-1 flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                @click="handleShare('weibo')"
              >
                <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <Icon name="ri:weibo-fill" class="text-red-600 text-xl" />
                </div>
                <span class="text-xs text-gray-600">微博</span>
              </button>
              <button
                class="flex-1 flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                @click="handleShare('link')"
              >
                <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Icon name="ep:link" class="text-blue-600 text-xl" />
                </div>
                <span class="text-xs text-gray-600">复制链接</span>
              </button>
            </div>
          </div>

          <!-- 相关资讯 -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">相关资讯</h3>
            <div class="space-y-4">
              <div
                v-for="item in relatedArticles"
                :key="item.id"
                class="group cursor-pointer"
                @click="handleViewDetail(item.id)"
              >
                <div class="flex gap-3">
                  <div class="w-20 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      v-if="item.coverImage"
                      :src="item.coverImage"
                      :alt="item.title"
                      class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                      <Icon name="ep:picture" class="text-sm" />
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {{ item.title }}
                    </h4>
                    <span class="text-xs text-gray-400 mt-1">
                      {{ item.publishTime ? formatDate(item.publishTime) : '' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 返回列表 -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <button
              class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              @click="handleBack"
            >
              <Icon name="ep:arrow-left" />
              <span>返回资讯列表</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 文章内容样式 */
.article-content {
  line-height: 1.8;
  color: #374151;
}

.article-content :deep(p) {
  margin-bottom: 1rem;
}

.article-content :deep(h1),
.article-content :deep(h2),
.article-content :deep(h3),
.article-content :deep(h4) {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.article-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

.article-content :deep(ul),
.article-content :deep(ol) {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.article-content :deep(li) {
  margin-bottom: 0.5rem;
}

.article-content :deep(a) {
  color: #2563eb;
  text-decoration: none;
}

.article-content :deep(a:hover) {
  text-decoration: underline;
}

.article-content :deep(blockquote) {
  border-left: 4px solid #e5e7eb;
  padding-left: 1rem;
  margin: 1rem 0;
  color: #6b7280;
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
