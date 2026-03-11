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
  { id: 0, name: '全部信息' },
])
const activeCategory = ref(0)

/* 获取分类列表 */
const fetchCategories = async () => {
  try {
    const data = await ArticleApi.getArticleCategories()
    categories.value = [{ id: 0, name: '全部信息' }, ...data]
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
  <div class="min-h-screen bg-gray-50">
    <!-- 页面标题区 -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-6xl mx-auto px-4 py-6">
        <h1 class="text-2xl font-bold text-gray-800">资讯中心</h1>
        <p class="text-sm text-gray-500 mt-2">获取最新考试资讯、政策解读和备考指南</p>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 py-6">
      <!-- 分类标签栏 -->
      <div class="bg-white rounded-xl shadow-sm mb-6">
        <div class="flex items-center px-6 py-4 border-b border-gray-100">
          <div class="flex-1 flex items-center space-x-1">
            <button
              v-for="category in categories"
              :key="category.id"
              class="px-5 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
              :class="activeCategory === category.id
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'"
              @click="handleCategoryChange(category.id)"
            >
              {{ category.name }}
            </button>
          </div>

          <!-- 搜索框 -->
          <div class="flex items-center">
            <el-input
              v-model="queryParams.keyword"
              placeholder="搜索资讯..."
              class="w-64"
              clearable
              @keyup.enter="handleSearch"
            >
              <template #suffix>
                <Icon name="ep:search" class="text-gray-400 cursor-pointer" @click="handleSearch" />
              </template>
            </el-input>
          </div>
        </div>
      </div>

      <!-- 资讯列表 -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div v-loading="loading" class="divide-y divide-gray-100">
          <!-- 空状态 -->
          <el-empty v-if="articleList.length === 0 && !loading" description="暂无资讯" class="py-12" />

          <!-- 资讯卡片 -->
          <div
            v-for="article in articleList"
            :key="article.id"
            class="p-6 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
            @click="handleViewDetail(article.id)"
          >
            <div class="flex gap-5">
              <!-- 封面图片 -->
              <div class="flex-shrink-0">
                <div class="w-48 h-32 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    v-if="article.coverImage"
                    :src="article.coverImage"
                    :alt="article.title"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                    <Icon name="ep:picture" class="text-3xl" />
                  </div>
                </div>
              </div>

              <!-- 内容区 -->
              <div class="flex-1 min-w-0">
                <!-- 标题 -->
                <h3 class="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                  {{ article.title }}
                </h3>

                <!-- 摘要 -->
                <p class="text-sm text-gray-500 mb-3 line-clamp-2">
                  {{ article.summary || '暂无摘要' }}
                </p>

                <!-- 标签和元信息 -->
                <div class="flex items-center justify-between">
                  <!-- 标签 -->
                  <div class="flex items-center gap-2">
                    <span
                      v-if="article.categoryName"
                      class="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded"
                    >
                      {{ article.categoryName }}
                    </span>
                    <template v-if="article.tags">
                      <span
                        v-for="tag in article.tags.slice(0, 2)"
                        :key="tag"
                        class="px-2 py-1 text-xs font-medium text-green-600 bg-green-50 rounded"
                      >
                        {{ tag }}
                      </span>
                    </template>
                  </div>

                  <!-- 浏览量和时间 -->
                  <div class="flex items-center gap-4 text-xs text-gray-400">
                    <span class="flex items-center gap-1">
                      <Icon name="ep:view" class="text-sm" />
                      {{ formatViewCount(article.viewCount || 0) }}
                    </span>
                    <span>{{ article.publishTime ? formatDate(article.publishTime) : '' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div v-if="total > 0" class="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <span class="text-sm text-gray-500">
            共 {{ total }} 条
          </span>
          <el-pagination
            v-model:current-page="queryParams.page"
            :page-size="queryParams.limit"
            :total="total"
            layout="prev, pager, next"
            @change="handlePageChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 卡片悬停效果 */
.bg-white.rounded-xl.shadow-sm .divide-y > div:hover {
  background-color: #f9fafb;
}

/* 标题悬停效果 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
