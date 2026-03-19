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
  <div class="min-h-screen bg-(--color-bg-container)">
    <!-- 顶部渐变背景 -->
    <div class="relative h-48 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-(--color-primary) via-(--color-primary-light) to-(--color-primary-lighter)"></div>
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 -mt-24 relative z-10">
      <!-- 面包屑导航 -->
      <div class="flex items-center text-sm text-white/80 mb-6">
        <span class="cursor-pointer hover:text-white transition-colors" @click="router.push('/')">首页</span>
        <Icon name="ep:arrow-right" class="mx-2 text-xs" />
        <span class="cursor-pointer hover:text-white transition-colors" @click="handleBack">资讯中心</span>
        <Icon name="ep:arrow-right" class="mx-2 text-xs" />
        <span class="text-white line-clamp-1 max-w-xs">{{ article?.title || '资讯详情' }}</span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
        <!-- 左侧主要内容 -->
        <div class="lg:col-span-2">
          <div v-loading="loading" class="bg-white rounded-2xl shadow-lg shadow-(--color-shadow)/50 overflow-hidden">
            <!-- 文章头部 -->
            <div class="p-8 border-b border-(--color-border-light)">
              <!-- 分类标签 -->
              <div class="flex items-center gap-3 mb-4">
                <span
                  v-if="article?.categoryName"
                  class="px-4 py-1.5 text-sm font-medium text-white bg-(--color-primary) rounded-full shadow-md shadow-(--color-primary)/30"
                >
                  {{ article.categoryName }}
                </span>
                <span
                  v-if="article?.isTop"
                  class="px-3 py-1.5 text-xs font-medium text-white bg-(--color-danger) rounded-full"
                >
                  <Icon name="ep:top" class="mr-1" />
                  置顶
                </span>
                <span
                  v-if="article?.isHot"
                  class="px-3 py-1.5 text-xs font-medium text-white bg-(--color-warning) rounded-full"
                >
                  <Icon name="ep:fire" class="mr-1" />
                  热门
                </span>
              </div>

              <!-- 标题 -->
              <h1 class="text-2xl font-bold text-(--color-text-primary) mb-6 leading-tight">
                {{ article?.title }}
              </h1>

              <!-- 元信息 -->
              <div class="flex items-center gap-6 text-sm text-(--color-text-secondary)">
                <span v-if="article?.author" class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-(--color-primary-light) flex items-center justify-center">
                    <Icon name="ep:user" class="text-(--color-primary)" />
                  </div>
                  {{ article.author }}
                </span>
                <span v-if="article?.publishTime" class="flex items-center gap-2">
                  <Icon name="ep:clock" class="text-(--color-primary)" />
                  {{ formatDate(article.publishTime) }}
                </span>
                <span class="flex items-center gap-2">
                  <Icon name="ep:view" class="text-(--color-primary)" />
                  {{ article?.viewCount || 0 }} 阅读
                </span>
                <span v-if="article?.source" class="flex items-center gap-2">
                  <Icon name="ep:link" class="text-(--color-primary)" />
                  来源：{{ article.source }}
                </span>
              </div>
            </div>

            <!-- 文章内容 -->
            <div class="p-8">
              <!-- 封面图 -->
              <div v-if="article?.coverImage" class="mb-8 rounded-xl overflow-hidden shadow-lg">
                <img
                  :src="article.coverImage"
                  :alt="article.title"
                  class="w-full h-80 object-cover"
                />
              </div>

              <!-- 正文 -->
              <div class="prose prose-lg max-w-none article-content" v-html="article?.content"></div>

              <!-- 标签 -->
              <div v-if="article?.tags && article.tags.length > 0" class="mt-10 pt-6 border-t border-(--color-border-light)">
                <div class="flex items-center gap-3 flex-wrap">
                  <span class="text-sm text-(--color-text-secondary)">
                    <Icon name="ep:price-tag" class="mr-1" />
                    标签：
                  </span>
                  <span
                    v-for="tag in article.tags"
                    :key="tag"
                    class="px-4 py-1.5 text-sm text-(--color-primary) bg-(--color-primary-light) rounded-full hover:bg-(--color-primary) hover:text-white cursor-pointer transition-all duration-300"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 文章底部导航 -->
            <div class="px-8 py-5 bg-(--color-bg-container) border-t border-(--color-border-light)">
              <div class="flex items-center justify-between">
                <!-- 上一篇 -->
                <button
                  v-if="article?.prevArticle"
                  class="flex items-center gap-2 text-sm text-(--color-text-secondary) hover:text-(--color-primary) transition-colors group"
                  @click="handleViewDetail(article.prevArticle.id)"
                >
                  <Icon name="ep:arrow-left" class="group-hover:-translate-x-1 transition-transform" />
                  <span class="line-clamp-1 max-w-xs">{{ article.prevArticle.title }}</span>
                </button>
                <div v-else></div>
                <!-- 下一篇 -->
                <button
                  v-if="article?.nextArticle"
                  class="flex items-center gap-2 text-sm text-(--color-text-secondary) hover:text-(--color-primary) transition-colors group"
                  @click="handleViewDetail(article.nextArticle.id)"
                >
                  <span class="line-clamp-1 max-w-xs">{{ article.nextArticle.title }}</span>
                  <Icon name="ep:arrow-right" class="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧侧边栏 -->
        <div class="lg:col-span-1 space-y-6">
          <!-- 分享卡片 -->
          <div class="bg-white rounded-2xl shadow-lg shadow-(--color-shadow)/50 p-6">
            <h3 class="text-lg font-semibold text-(--color-text-primary) mb-5 flex items-center gap-2">
              <Icon name="ep:share" class="text-(--color-primary)" />
              分享资讯
            </h3>
            <div class="grid grid-cols-3 gap-3">
              <button
                class="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-(--color-success-light) transition-colors group"
                @click="handleShare('wechat')"
              >
                <div class="w-12 h-12 rounded-full bg-(--color-success-light) flex items-center justify-center group-hover:bg-(--color-success) transition-colors">
                  <Icon name="fa:weixin" class="text-(--color-success) group-hover:text-white text-xl transition-colors" />
                </div>
                <span class="text-xs text-(--color-text-secondary)">微信</span>
              </button>
              <button
                class="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-(--color-danger-light) transition-colors group"
                @click="handleShare('weibo')"
              >
                <div class="w-12 h-12 rounded-full bg-(--color-danger-light) flex items-center justify-center group-hover:bg-(--color-danger) transition-colors">
                  <Icon name="ri:weibo-fill" class="text-(--color-danger) group-hover:text-white text-xl transition-colors" />
                </div>
                <span class="text-xs text-(--color-text-secondary)">微博</span>
              </button>
              <button
                class="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-(--color-primary-light) transition-colors group"
                @click="handleShare('link')"
              >
                <div class="w-12 h-12 rounded-full bg-(--color-primary-light) flex items-center justify-center group-hover:bg-(--color-primary) transition-colors">
                  <Icon name="ep:link" class="text-(--color-primary) group-hover:text-white text-xl transition-colors" />
                </div>
                <span class="text-xs text-(--color-text-secondary)">复制链接</span>
              </button>
            </div>
          </div>

          <!-- 相关资讯 -->
          <div class="bg-white rounded-2xl shadow-lg shadow-(--color-shadow)/50 p-6">
            <h3 class="text-lg font-semibold text-(--color-text-primary) mb-5 flex items-center gap-2">
              <Icon name="ep:reading" class="text-(--color-primary)" />
              相关资讯
            </h3>
            <div class="space-y-4">
              <div
                v-for="item in relatedArticles"
                :key="item.id"
                class="group cursor-pointer"
                @click="handleViewDetail(item.id)"
              >
                <div class="flex gap-3">
                  <div class="w-20 h-14 rounded-lg overflow-hidden bg-(--color-bg-container) flex-shrink-0">
                    <img
                      v-if="item.coverImage"
                      :src="item.coverImage"
                      :alt="item.title"
                      class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center text-(--color-primary)">
                      <Icon name="ep:picture" class="text-sm" />
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="text-sm font-medium text-(--color-text-primary) line-clamp-2 group-hover:text-(--color-primary) transition-colors">
                      {{ item.title }}
                    </h4>
                    <span class="text-xs text-(--color-text-tertiary) mt-1">
                      {{ item.publishTime ? formatDate(item.publishTime) : '' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 返回列表 -->
          <div class="bg-gradient-to-r from-(--color-primary) to-(--color-primary-light) rounded-2xl shadow-lg shadow-(--color-primary)/30 p-6 text-white">
            <h3 class="text-lg font-semibold mb-2">查看更多资讯</h3>
            <p class="text-sm text-white/80 mb-4">浏览更多考试动态和备考资讯</p>
            <button
              class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-(--color-primary) rounded-xl hover:bg-white/90 transition-colors font-medium"
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
  line-height: 1.9;
  color: var(--color-text-primary);
}

.article-content :deep(p) {
  margin-bottom: 1.25rem;
  text-align: justify;
}

.article-content :deep(h1),
.article-content :deep(h2),
.article-content :deep(h3),
.article-content :deep(h4) {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.article-content :deep(h2) {
  font-size: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--color-border-light);
}

.article-content :deep(h3) {
  font-size: 1.25rem;
}

.article-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.75rem;
  margin: 1.5rem 0;
  box-shadow: 0 4px 6px -1px var(--color-shadow);
}

.article-content :deep(ul),
.article-content :deep(ol) {
  margin-bottom: 1.25rem;
  padding-left: 1.5rem;
}

.article-content :deep(li) {
  margin-bottom: 0.5rem;
}

.article-content :deep(a) {
  color: var(--color-primary);
  text-decoration: none;
  border-bottom: 1px dashed var(--color-primary);
  transition: all 0.3s;
}

.article-content :deep(a:hover) {
  background-color: var(--color-primary-light);
  border-bottom-style: solid;
}

.article-content :deep(blockquote) {
  border-left: 4px solid var(--color-primary);
  padding: 1rem 1.5rem;
  margin: 1.5rem 0;
  background-color: var(--color-bg-container);
  border-radius: 0 0.5rem 0.5rem 0;
  color: var(--color-text-secondary);
  font-style: italic;
}

.article-content :deep(code) {
  background-color: var(--color-bg-container);
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-family: monospace;
  color: var(--color-danger);
}

.article-content :deep(pre) {
  background-color: var(--color-bg-container);
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1.5rem 0;
}

.article-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
}

.article-content :deep(th),
.article-content :deep(td) {
  border: 1px solid var(--color-border);
  padding: 0.75rem;
  text-align: left;
}

.article-content :deep(th) {
  background-color: var(--color-bg-container);
  font-weight: 600;
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
