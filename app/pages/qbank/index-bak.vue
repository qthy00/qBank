<script setup lang="ts">
import {questionApi} from '~/api/qbank'
import type {QbankInfoVO, QbankListReqVO} from '~/types/qbank'

/**
 * 题库列表页
 * 使用 Nuxt 4 规范：
 * 1. definePageMeta 定义页面元数据
 * 2. useFetch/useAsyncData 进行数据获取（避免 SSR 双次请求）
 * 3. 使用 watch 依赖自动刷新数据
 */

/* ==================== 页面元数据 ==================== */

definePageMeta({
  title: '题库中心',
  description: '精选优质题库，助力高效备考',
})

useHead({
  title: '题库中心',
  meta: [
    { name: 'description', content: '精选优质题库，助力高效备考' }
  ]
})

/* ==================== 状态定义 ==================== */

const router = useRouter()
const message = useMessage()

/* 搜索和筛选参数 */
const queryParams = reactive<QbankListReqVO>({
  keyword: '',
  categoryId: undefined,
  subjectId: undefined,
  difficulty: undefined,
  sort: 'newest',
  page: 1,
  limit: 12
})

/* 难度选项 */
const difficultyOptions = [
  {label: '全部', value: undefined},
  {label: '简单', value: 1},
  {label: '中等', value: 2},
  {label: '困难', value: 3}
]

/* 排序选项 */
const sortOptions = [
  {label: '最新', value: 'newest'},
  {label: '最热', value: 'hot'},
  {label: '价格从低到高', value: 'price_asc'},
  {label: '价格从高到低', value: 'price_desc'}
]

/* ==================== 数据获取（Nuxt 4 规范） ==================== */

/**
 * 使用 useAsyncData 获取分类列表
 * key: 缓存键，用于数据去重和复用
 * server: false 表示仅在客户端获取（避免 SSR 水合问题）
 */
const { data: categories, error: categoriesError } = await useAsyncData(
  'qbank-categories',
  () => questionApi.getCategories(),
  {
    server: false, /* 分类数据在客户端获取，避免 SSR 水合不匹配 */
    default: () => [],
    transform: (data) => data || []
  }
)

/**
 * 使用 useAsyncData 获取题库列表
 * key 包含查询参数，参数变化时自动重新获取
 * watch: 监听 queryParams 变化自动刷新
 */
const { data: listData, pending: loading, error: listError, refresh: refreshList } = await useAsyncData(
  () => `qbank-list-${JSON.stringify(queryParams)}`,
  () => questionApi.getQbankList({ ...queryParams }),
  {
    server: false, /* 题库列表在客户端获取，支持筛选交互 */
    default: () => ({ list: [], total: 0 }),
    watch: [queryParams], /* 监听 queryParams 变化自动刷新 */
  }
)

/* ==================== 计算属性 ==================== */

const qbankList = computed<QbankInfoVO[]>(() => listData.value?.list || [])
const total = computed(() => listData.value?.total || 0)

/* ==================== 方法定义 ==================== */

/**
 * 搜索题库
 */
const handleSearch = () => {
  queryParams.page = 1
  /* queryParams 变化会自动触发 useAsyncData 刷新 */
}

/**
 * 切换分类
 */
const handleCategoryChange = (categoryId: number | undefined) => {
  queryParams.categoryId = categoryId
  queryParams.page = 1
}

/**
 * 切换难度
 */
const handleDifficultyChange = (difficulty: number | undefined) => {
  queryParams.difficulty = difficulty
  queryParams.page = 1
}

/**
 * 切换排序
 */
const handleSortChange = (sort: string) => {
  queryParams.sort = sort as any
  queryParams.page = 1
}

/**
 * 页码变化
 */
const handlePageChange = (page: number) => {
  queryParams.page = page
}

/**
 * 跳转到题库详情
 */
const goToQbankDetail = (id: number) => {
  router.push(`/qbank/${id}`)
}

/**
 * 购买题库
 */
const handleBuy = (qbank: QbankInfoVO) => {
  router.push(`/order/pay?qbankId=${qbank.id}`)
}

/**
 * 开始练习
 */
const handlePractice = (qbank: QbankInfoVO) => {
  router.push(`/practice/${qbank.id}`)
}

/* ==================== 错误处理 ==================== */

if (categoriesError.value) {
  console.error('加载分类失败:', categoriesError.value)
  message.error('加载分类失败')
}

if (listError.value) {
  console.error('加载题库列表失败:', listError.value)
  message.error('加载题库列表失败')
}
</script>

<template>
  <div class="min-h-screen bg-[var(--color-bg-container)]">
    <!-- 顶部导航 -->
    <Navbar/>

    <!-- 页面内容 -->
    <div class="container mx-auto px-4 py-6">
      <!-- 页面标题 -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-[var(--color-text-primary)]">题库中心</h1>
        <p class="text-[var(--color-text-secondary)] mt-2">精选优质题库，助力高效备考</p>
      </div>

      <!-- 搜索栏 -->
      <div class="bg-white rounded-lg shadow p-4 mb-6">
        <div class="flex gap-4">
          <el-input
              v-model="queryParams.keyword"
              placeholder="搜索题库名称"
              clearable
              @keyup.enter="handleSearch"
              class="flex-1"
          >
            <template #prefix>
              <Icon name="ep:search" class="text-gray-400"/>
            </template>
          </el-input>
          <el-button type="primary" @click="handleSearch">
            <Icon name="ep:search" class="mr-1"/>
            搜索
          </el-button>
        </div>
      </div>

      <!-- 筛选栏 -->
      <div class="bg-white rounded-lg shadow p-4 mb-6">
        <!-- 分类筛选 -->
        <div class="flex items-start gap-4 mb-4">
          <span class="text-[var(--color-text-secondary)] shrink-0 mt-1">分类：</span>
          <div class="flex flex-wrap gap-2">
            <el-button
                :type="queryParams.categoryId === undefined ? 'primary' : 'default'"
                size="small"
                @click="handleCategoryChange(undefined)"
            >
              全部
            </el-button>
            <el-button
                v-for="cat in categories"
                :key="cat.id"
                :type="queryParams.categoryId === cat.id ? 'primary' : 'default'"
                size="small"
                @click="handleCategoryChange(cat.id)"
            >
              {{ cat.name }}
            </el-button>
          </div>
        </div>

        <!-- 难度筛选 -->
        <div class="flex items-start gap-4">
          <span class="text-[var(--color-text-secondary)] shrink-0 mt-1">难度：</span>
          <div class="flex flex-wrap gap-2">
            <el-button
                v-for="opt in difficultyOptions"
                :key="opt.value ?? 'all'"
                :type="queryParams.difficulty === opt.value ? 'primary' : 'default'"
                size="small"
                @click="handleDifficultyChange(opt.value)"
            >
              {{ opt.label }}
            </el-button>
          </div>
        </div>
      </div>

      <!-- 排序和结果统计 -->
      <div class="flex justify-between items-center mb-4">
        <div class="text-[var(--color-text-secondary)]">
          共 <span class="text-[var(--color-primary)] font-bold">{{ total }}</span> 个题库
        </div>
        <div class="flex gap-2">
          <el-button
              v-for="opt in sortOptions"
              :key="opt.value"
              :type="queryParams.sort === opt.value ? 'primary' : 'default'"
              link
              @click="handleSortChange(opt.value)"
          >
            {{ opt.label }}
          </el-button>
        </div>
      </div>

      <!-- 题库列表 -->
      <div v-loading="loading" class="min-h-[400px]">
        <div v-if="qbankList.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <QbankCard
              v-for="qbank in qbankList"
              :key="qbank.id"
              :qbank="qbank"
              @click="goToQbankDetail"
              @buy="handleBuy"
              @practice="handlePractice"
          />
        </div>

        <!-- 空状态 -->
        <el-empty v-else description="暂无题库数据"/>
      </div>

      <!-- 分页 -->
      <div v-if="total > 0" class="flex justify-center mt-6">
        <el-pagination
            v-model:current-page="queryParams.page"
            v-model:page-size="queryParams.limit"
            :total="total"
            :page-sizes="[12, 24, 36]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSearch"
            @current-change="handlePageChange"
        />
      </div>
    </div>

    <!-- 底部 -->
    <Footer/>
  </div>
</template>

<style scoped>
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
