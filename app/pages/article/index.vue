<script setup lang="ts">
import {ArticleApi} from '~/api/article'
import type {ArticleVO, ArticleCategoryVO} from '~/types/article'

definePageMeta({
  layout: 'default'
})

useHead({
  title: '资讯中心'
})

const route = useRoute()
const router = useRouter()

/* 分类数据 */
const categories = ref<ArticleCategoryVO[]>([
  { id: 0, name: '全部资讯' },
])
const activeCategory = ref(0)

/* 获取分类列表 */
const fetchCategories = async () => {
  try {
    const data = await ArticleApi.getArticleCategories()
    categories.value = [{ id: 0, name: '全部资讯' }, ...data]
  } catch (error) {
    console.error('获取分类列表失败:', error)
  }
}

/* 列表数据 */
const loading = ref(false)
const articleList = ref<ArticleVO[]>([])
const total = ref(0)

/* 查询参数 */
const queryParams = reactive({
  page: 1,
  limit: 10,
  categoryId: undefined as number | undefined,
  keyword: '',
})

/* 获取资讯列表 */
const fetchArticleList = async () => {
  loading.value = true
  try {
    const data = await ArticleApi.getArticleList(queryParams)
    articleList.value = data.list || []
    total.value = data.total || 0
  } catch (error) {
    console.error('获取资讯列表失败:', error)
  } finally {
    loading.value = false
  }
}

/* 切换分类 */
const handleCategoryChange = (categoryId: number) => {
  activeCategory.value = categoryId
  queryParams.categoryId = categoryId === 0 ? undefined : categoryId
  queryParams.page = 1
  fetchArticleList()
}

/* 搜索 */
const handleSearch = () => {
  queryParams.page = 1
  fetchArticleList()
}

/* 分页 */
const handlePageChange = (page: number) => {
  queryParams.page = page
  fetchArticleList()
}

/* 查看详情 */
const handleViewDetail = (id: number) => {
  router.push(`/article/${id}`)
}

/* 格式化浏览量 */
const formatViewCount = (count: number): string => {
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
  /* 从URL获取分类参数 */
  const categoryId = Number(route.query.category) || 0
  activeCategory.value = categoryId
  queryParams.categoryId = categoryId === 0 ? undefined : categoryId

  /* 获取分类和列表 */
  fetchCategories()
  fetchArticleList()
})
</script>

<template>
  <div class="min-h-screen bg-(--color-bg-container)">
    <!-- 页面标题区 -->
    <div class="relative overflow-hidden">
      <!-- 背景渐变 -->
      <div class="absolute inset-0 bg-gradient-to-br from-(--color-primary) via-(--color-primary-light) to-(--color-primary-lighter)"/>
      <!-- 装饰图案 -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2"/>
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2"/>
      </div>
      <!-- 内容 -->
      <div class="relative max-w-6xl mx-auto px-4 py-12">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-white mb-3">资讯中心</h1>
          <p class="text-white/80 text-base max-w-2xl mx-auto">获取最新考试资讯、政策解读和备考指南，掌握第一手考试动态</p>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 py-8 -mt-6">
      <!-- 搜索和筛选卡片 -->
      <div class="bg-white rounded-2xl shadow-lg shadow-(--color-shadow)/50 overflow-hidden mb-8">
        <!-- 分类标签栏 -->
        <div class="px-6 py-5 border-b border-(--color-border-light)">
          <div class="flex items-center gap-3">
            <span class="text-sm font-medium text-(--color-text-secondary) mr-2">分类：</span>
            <div class="flex-1 flex items-center gap-2 flex-wrap">
              <button
                v-for="category in categories"
                :key="category.id"
                class="px-4 py-2 text-sm font-medium rounded-full transition-all duration-300"
                :class="activeCategory === category.id
                  ? 'bg-(--color-primary) text-white shadow-md shadow-(--color-primary)/30'
                  : 'bg-(--color-bg-container) text-(--color-text-secondary) hover:bg-(--color-primary-light) hover:text-(--color-primary)'"
                @click="handleCategoryChange(category.id)"
              >
                {{ category.name }}
              </button>
            </div>
          </div>
        </div>

        <!-- 搜索框 -->
        <div class="px-6 py-4 bg-(--color-bg-container)">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Icon name="ep:document" class="text-(--color-primary) text-lg" />
              <span class="text-sm text-(--color-text-secondary)">共 <span class="text-(--color-primary) font-semibold">{{ total }}</span> 篇资讯</span>
            </div>
            <div class="flex items-center gap-3">
              <el-input
                v-model="queryParams.keyword"
                placeholder="搜索资讯关键词..."
                class="w-72"
                clearable
                @keyup.enter="handleSearch"
              >
                <template #prefix>
                  <Icon name="ep:search" class="text-(--color-text-placeholder)" />
                </template>
              </el-input>
              <button
                class="px-5 py-2 bg-(--color-primary) text-white rounded-lg hover:bg-(--color-primary-dark) transition-colors duration-300 flex items-center gap-2"
                @click="handleSearch"
              >
                <Icon name="ep:search" class="text-sm" />
                <span>搜索</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 资讯列表 -->
      <div v-loading="loading" class="space-y-4">
        <!-- 空状态 -->
        <el-empty v-if="articleList.length === 0 && !loading" description="暂无资讯" class="py-16 bg-white rounded-2xl" />

        <!-- 资讯卡片 -->
        <div
          v-for="(article, index) in articleList"
          :key="article.id"
          class="group bg-white rounded-xl shadow-md shadow-(--color-shadow)/30 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-(--color-shadow)/50 hover:-translate-y-1"
          :style="{ animationDelay: `${index * 50}ms` }"
          @click="handleViewDetail(article.id)"
        >
          <div class="flex gap-0">
            <!-- 封面图片 -->
            <div class="flex-shrink-0 w-56 h-40 relative overflow-hidden">
              <img
                v-if="article.coverImage"
                :src="article.coverImage"
                :alt="article.title"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              >
              <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-(--color-primary-light) to-(--color-primary-lighter)">
                <Icon name="ep:picture" class="text-4xl text-(--color-primary)" />
              </div>
              <!-- 分类标签 -->
              <div v-if="article.categoryName" class="absolute top-3 left-3">
                <span class="px-3 py-1 text-xs font-medium text-white bg-(--color-primary)/90 backdrop-blur-sm rounded-full">
                  {{ article.categoryName }}
                </span>
              </div>
            </div>

            <!-- 内容区 -->
            <div class="flex-1 p-5 flex flex-col">
              <!-- 标题 -->
              <h3 class="text-lg font-semibold text-(--color-text-primary) mb-2 line-clamp-2 group-hover:text-(--color-primary) transition-colors duration-300">
                {{ article.title }}
              </h3>

              <!-- 摘要 -->
              <p class="text-sm text-(--color-text-secondary) mb-4 line-clamp-2 flex-1">
                {{ article.summary || '暂无摘要' }}
              </p>

              <!-- 标签和元信息 -->
              <div class="flex items-center justify-between">
                <!-- 标签 -->
                <div class="flex items-center gap-2">
                  <template v-if="article.tags">
                    <span
                      v-for="tag in article.tags.slice(0, 2)"
                      :key="tag"
                      class="px-2 py-0.5 text-xs text-(--color-success) bg-(--color-success-light) rounded-full"
                    >
                      {{ tag }}
                    </span>
                  </template>
                </div>

                <!-- 浏览量和时间 -->
                <div class="flex items-center gap-4 text-xs text-(--color-text-tertiary)">
                  <span class="flex items-center gap-1">
                    <Icon name="ep:view" class="text-sm" />
                    {{ formatViewCount(article.viewCount || 0) }}
                  </span>
                  <span class="flex items-center gap-1">
                    <Icon name="ep:clock" class="text-sm" />
                    {{ article.publishTime ? formatDate(article.publishTime) : '' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 右侧箭头 -->
            <div class="w-12 flex items-center justify-center bg-(--color-bg-container) border-l border-(--color-border-light)">
              <Icon name="ep:arrow-right" class="text-(--color-text-tertiary) group-hover:text-(--color-primary) group-hover:translate-x-1 transition-all duration-300" />
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="total > 0" class="flex items-center justify-center mt-10">
        <el-pagination
          v-model:current-page="queryParams.page"
          :page-size="queryParams.limit"
          :total="total"
          layout="prev, pager, next"
          prev-text="上一页"
          next-text="下一页"
          class="custom-pagination"
          @change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 自定义分页样式 */
:deep(.custom-pagination) {
  --el-pagination-hover-color: var(--color-primary);
  --el-pagination-button-color: var(--color-text-secondary);
}

:deep(.custom-pagination .el-pager li.is-active) {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
  border-radius: 8px;
}

:deep(.custom-pagination .el-pager li:hover) {
  color: var(--color-primary);
}

/* 卡片悬停效果 */
.bg-white.rounded-xl {
  animation: fadeInUp 0.5s ease-out forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 标题悬停效果 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
