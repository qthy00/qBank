<script setup lang="ts">
import {DocumentApi} from '~/api/document'
import type {
  DocumentVO,
  TagOptionVO
} from '~/types/document'
import {CmsCategoryApi} from "~/api/category";
import {fileSizeFormatter, formatCount} from "~/utils";


definePageMeta({
  layout: 'default'
})

useHead({
  title: '文档下载'
})

const authStore = useAuthStore()
const userStore = useUserStore()
const {user} = storeToRefs(userStore)
const {openModal} = useModal()

/* ==================== 状态定义 ==================== */

/* 大类筛选 */
const activeMajor = ref<number>()
/* 考试类型筛选 */
const activeExamType = ref<number>(0)
/* 年份筛选 */
const yearOptions = ref<TagOptionVO[]>([])
const activeYear = ref<number>()

/* 排序选项 */
const sortOptions = [
  {value: 'comprehensive', label: '综合排序'},
  {value: 'newest', label: '最新上传'},
  {value: 'downloads', label: '下载最多'},
  {value: 'price_asc', label: '价格从低到高'},
  {value: 'price_desc', label: '价格从高到低'},
]
const activeSort = ref<string>('comprehensive')

/* 列表数据 */
const loading = ref(false)
const documentList = ref<DocumentVO[]>([])
const total = ref(0)

/* 查询参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  catalogId: undefined as number | undefined,
  tags: [] as number[],
  sortType: 'comprehensive' as string | undefined,
  keyword: undefined as string | undefined,
})

/* 获取排名样式 */
const getRankStyle = (index: number) => {
  if (index === 0) return 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white'
  if (index === 1) return 'bg-gradient-to-br from-gray-300 to-gray-400 text-white'
  if (index === 2) return 'bg-gradient-to-br from-orange-300 to-orange-400 text-white'
  return 'bg-gray-100 text-gray-500'
}

/* ==================== 方法定义 ==================== */

/* 获取大类列表 */
const {data: categories} = await CmsCategoryApi.getCategoryList()
const {data: hotDocuments} = await useAsyncData(
    async () => {
      const data = await DocumentApi.getDocumentList({
        pageNo: 1,
        pageSize: 5
      })
      return data.list?.slice(0, 5) || []
    }
)
const subCategories = computed(() => {
  const data = categories.value.filter(c => c.id === activeMajor.value)
  if (!data || !data[0] || !data[0].children) {
    return []
  }
  return data[0].children
})

/* 获取年份选项 */
const fetchYearOptions = async () => {
  try {
    const data = await DocumentApi.getInfoTags('YEAR')
    yearOptions.value = [{id: 0, word: undefined}, ...data]
  } catch {
    // 获取年份选项失败时静默处理
  }
}

/* 获取文档列表 */
const fetchDocumentList = async () => {
  loading.value = true
  try {
    const data = await DocumentApi.getDocumentList(queryParams)
    documentList.value = data.list || []
    total.value = data.total || 0
  } catch {
    // 获取文档列表失败时静默处理
  } finally {
    loading.value = false
  }
}

/* 切换大类 */
const handleMajorChange = (catalogId: number) => {
  activeMajor.value = catalogId
  queryParams.catalogId = catalogId
  queryParams.pageNo = 1
  activeExamType.value = 0
  fetchDocumentList()
}

/* 切换考试类型 */
const handleExamTypeChange = (catalogId: number) => {
  activeExamType.value = catalogId
  queryParams.catalogId = catalogId
  queryParams.pageNo = 1
  fetchDocumentList()
}


/* 切换年份 */
const handleYearChange = () => {
  if (activeYear.value) {
    queryParams.tags = [activeYear.value]
  } else {
    queryParams.tags = []
  }
  queryParams.pageNo = 1
  fetchDocumentList()
}

/* 搜索 */
const handleSearch = () => {
  queryParams.pageNo = 1
  fetchDocumentList()
}

/* 分页 */
const handlePageChange = (page: number) => {
  queryParams.pageNo = page
  fetchDocumentList()
}

/* 排序变化 */
const handleSortChange = () => {
  queryParams.sortType = activeSort.value
  queryParams.pageNo = 1
  fetchDocumentList()
}

/* 查看详情 */
const handleViewDetail = (id: number) => {
  navigateTo(`/document/${id}`)
}

/* 获取当前大类名称 */
const currentMajorName = computed(() => {
  return categories.value.find(m => m.id === activeMajor.value)?.name || ''
})

/* 初始化 */
onMounted(() => {
  activeMajor.value = categories.value ? categories.value[0].id : 0
  fetchYearOptions()
  fetchDocumentList()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
    <!-- 页面标题区 - 活泼渐变背景 -->
    <div class="relative overflow-hidden">
      <!-- 动态渐变背景 - 蓝色系 -->
      <div class="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-500 to-cyan-500"/>
      <!-- 装饰图案 -->
      <div class="absolute inset-0">
        <div class="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"/>
        <div class="absolute top-20 right-20 w-48 h-48 bg-cyan-300/20 rounded-full blur-3xl"/>
        <div class="absolute bottom-10 left-1/3 w-24 h-24 bg-blue-300/20 rounded-full blur-2xl"/>
        <div class="absolute top-1/2 right-10 w-16 h-16 bg-indigo-300/20 rounded-full blur-xl"/>
        <!-- 装饰线条 -->
        <div class="absolute top-0 left-0 w-full h-full">
          <div
              class="absolute top-20 left-20 w-20 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent transform rotate-45"/>
          <div
              class="absolute top-40 right-40 w-32 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -rotate-12"/>
        </div>
      </div>
      <!-- 内容 -->
      <div class="relative container mx-auto px-4 py-12 md:py-16">
        <div class="text-center">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
            <Icon name="ep:folder" class="text-white text-lg"/>
            <span class="text-white/90 text-sm font-medium">海量资料</span>
          </div>
          <h1 class="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">文档下载</h1>
          <p class="text-white/80 text-base md:text-lg max-w-2xl mx-auto">历年真题、考试大纲、备考资料，助力高效备考</p>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- 筛选卡片 - 彩色风格 -->
      <div class="bg-white rounded-2xl shadow-xl shadow-blue-100/50 overflow-hidden mb-8 border border-blue-100">
        <!-- 筛选内容 -->
        <div class="p-5 space-y-4">
          <!-- 大类 - 彩色标签 -->
          <div class="flex items-start gap-3">
            <span class="text-sm font-medium text-slate-500 pt-1.5 shrink-0 w-12">大类</span>
            <div class="flex items-center gap-2 flex-wrap">
              <button
                  v-for="(catalog, index) in categories" :key="index"
                  :class="activeMajor === catalog.id
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    "
                  class="px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 transform hover:scale-105"
                  @click="handleMajorChange(catalog.id)"
              >
                {{ catalog.name }}
              </button>
            </div>
          </div>

          <!-- 考试 -->
          <div class="flex items-start gap-3">
            <span class="text-sm font-medium text-slate-500 pt-1.5 shrink-0 w-12">考试</span>
            <div class="flex items-center gap-2 flex-wrap">
              <button
                  :class="activeExamType === 0
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    "
                  class="px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200"
                  @click="handleExamTypeChange(0)"
              >
                全部
              </button>
              <button
                  v-for="exam in subCategories"
                  :key="exam.id"
                  :class="activeExamType === exam.id
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    "
                  class="px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200"
                  @click="handleExamTypeChange(exam.id)"
              >
                {{ exam.name }}
              </button>
            </div>
          </div>
        </div>

        <!-- 搜索和排序 - 渐变背景 -->
        <div class="px-5 py-4 bg-gradient-to-r from-blue-50/50 via-cyan-50/50 to-blue-50/50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex items-center gap-3">
            <el-select v-model="activeSort" size="default" class="!w-32" @change="handleSortChange">
              <el-option
                  v-for="opt in sortOptions"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
              />
            </el-select>
            <el-select v-model="activeYear" size="default" class="!w-32" placeholder="全部年份"
                       clearable @change="handleYearChange">
              <el-option
                  v-for="year in yearOptions"
                  :key="year.id"
                  :label="year.word ? year.word + '年' : '全部年份'"
                  :value="year.id"
              />
            </el-select>
          </div>
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2 text-sm text-slate-600">
              <div
                  class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Icon name="ep:document" class="text-white text-sm"/>
              </div>
              <span>共 <span class="text-blue-600 font-bold text-lg">{{ total }}</span> 份资料</span>
            </div>
            <el-input
                v-model="queryParams.keyword"
                placeholder="搜索资料名称"
                size="default"
                clearable
                class="w-48"
                @keyup.enter="handleSearch"
            >
              <template #suffix>
                <Icon name="ep:search" class="text-slate-400 cursor-pointer hover:text-blue-500 transition-colors"
                      @click="handleSearch"/>
              </template>
            </el-input>
          </div>
        </div>
      </div>

      <!-- 左右分栏布局 -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- 左侧主要内容区 -->
        <div class="lg:col-span-3">
          <!-- 文档列表 -->
          <div v-loading="loading" class="space-y-4">
            <!-- 空状态 -->
            <el-empty v-if="documentList.length === 0 && !loading" description="暂无文档"
                      class="py-16 bg-white rounded-2xl shadow-lg"/>

            <!-- 文档列表 - 彩色卡片 -->
            <div class="bg-white rounded-xl shadow-lg shadow-blue-100/30 border border-blue-100 overflow-hidden">
              <div class="divide-y divide-slate-100">
                <div
                    v-for="(doc, index) in documentList"
                    :key="doc.id"
                    class="p-5 flex items-start gap-4 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-cyan-50/50 transition-all duration-300 group cursor-pointer"
                    @click="handleViewDetail(doc.id)"
                >
                  <!-- 文档图标 - 彩色 -->
                  <div class="relative shrink-0">
                    <div
                        class="w-16 h-20 bg-gradient-to-br from-blue-100 to-cyan-200 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                      <Icon name="ep:document" class="text-3xl text-blue-500"/>
                    </div>
                    <div v-if="index < 3"
                         class="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center shadow-lg">
                      {{ ['一', '二', '三'][index] }}
                    </div>
                  </div>

                  <!-- 文档信息 -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start gap-2 mb-2">
                    <span
                        v-if="index < 2"
                        class="px-2 py-0.5 text-xs text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-sm"
                    >
                      推荐
                    </span>
                      <h4 class="font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {{ doc.title }}
                      </h4>
                    </div>

                    <div class="flex items-center gap-4 text-sm text-slate-500 flex-wrap">
                    <span v-if="doc.isFree" class="text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded">免费</span>
                      <span v-else-if="doc.isVip" class="text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded">VIP</span>
                      <span v-else class="text-red-500 font-medium">¥{{ doc.price }}</span>
                      <span class="flex items-center gap-1">
                      <Icon name="ep:folder" class="text-slate-400"/>
                      {{ fileSizeFormatter(doc.fileSize) }}
                    </span>
                      <span class="flex items-center gap-1">
                      <Icon name="ep:download" class="text-slate-400"/>
                      {{ formatCount(doc.downloadCount) }}
                    </span>
                      <span
                          v-if="doc.categoryName"
                          class="px-2 py-0.5 text-xs text-blue-600 border border-blue-200 bg-blue-50 rounded-full"
                      >
                      {{ doc.categoryName }}
                    </span>
                    </div>
                  </div>

                  <!-- 下载按钮 - 彩色 -->
                  <div class="shrink-0">
                    <button
                        class="px-5 py-2 text-sm text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transform hover:-translate-y-0.5"
                        @click.stop="handleViewDetail(doc.id)"
                    >
                      下载
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 分页 - 彩色 -->
          <div v-if="total > 0" class="flex items-center justify-center mt-8">
            <el-pagination
                v-model:current-page="queryParams.pageNo"
                :page-size="queryParams.pageSize"
                :total="total"
                layout="prev, pager, next"
                prev-text="上一页"
                next-text="下一页"
                class="custom-pagination"
                @change="handlePageChange"
            />
          </div>
        </div>

        <!-- 右侧侧边栏 - PC端显示 -->
        <div class="hidden lg:block lg:col-span-1 space-y-6">
          <!-- 用户信息卡片 -->
          <ClientOnly>
            <div v-if="authStore.isLogin"
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
                  <a href="/account/profile"
                     class="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                    <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Icon name="ep:user-filled" class="text-xl text-blue-500"/>
                    </div>
                    <span class="text-xs text-slate-600">个人中心</span>
                  </a>
                  <a href="/account/favorites"
                     class="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-yellow-50 transition-colors">
                    <div class="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Icon name="ep:star-filled" class="text-xl text-yellow-500"/>
                    </div>
                    <span class="text-xs text-slate-600">我的收藏</span>
                  </a>
                  <a href="/account/downloads"
                     class="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-cyan-50 transition-colors">
                    <div class="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
                      <Icon name="ep:download" class="text-xl text-cyan-500"/>
                    </div>
                    <span class="text-xs text-slate-600">下载记录</span>
                  </a>
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

          <!-- 热门资料排行榜 -->
          <div class="bg-white rounded-xl shadow-lg shadow-blue-100/50 border border-blue-100 p-5">
            <div class="flex items-center gap-2 mb-4">
              <Icon name="mdi:fire" class="text-xl text-red-500"/>
              <h3 class="font-bold text-slate-800">热门资料</h3>
            </div>
            <div class="space-y-4">
              <div
                  v-for="(doc, index) in hotDocuments"
                  :key="doc.id"
                  class="flex items-start gap-3 cursor-pointer group"
                  @click="handleViewDetail(doc.id)"
              >
                <div
                    :class="getRankStyle(index)"
                    class="w-6 h-6 rounded flex items-center justify-center text-sm font-bold shrink-0"
                >
                  {{ index + 1 }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-slate-700 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {{ doc.title }}
                  </p>
                  <div class="flex items-center justify-between mt-2 text-xs text-slate-400">
                    <span v-if="doc.isFree" class="text-emerald-600">免费</span>
                    <span v-else-if="doc.isVip" class="text-amber-600">VIP</span>
                    <span v-else class="text-red-500">¥{{ doc.price }}</span>
                    <span>{{ formatCount(doc.downloadCount) }}次下载</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 资料分类快捷入口 -->
          <div class="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg shadow-blue-200 overflow-hidden text-white">
            <div class="p-5">
              <div class="flex items-center gap-2 mb-4">
                <Icon name="ep:collection" class="text-xl"/>
                <h3 class="font-bold text-lg">快速导航</h3>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <a href="/article"
                   class="flex flex-col items-center gap-2 p-3 rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
                  <Icon name="mdi:newspaper-variant-multiple-outline" class="text-2xl"/>
                  <span class="text-sm">考试资讯</span>
                </a>
                <a href="/qBank"
                   class="flex flex-col items-center gap-2 p-3 rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
                  <Icon name="ep:edit" class="text-2xl"/>
                  <span class="text-sm">题库练习</span>
                </a>
                <a href="/exam/smart"
                   class="flex flex-col items-center gap-2 p-3 rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
                  <Icon name="ep:magic-stick" class="text-2xl"/>
                  <span class="text-sm">智能组卷</span>
                </a>
                <a href="/ranking"
                   class="flex flex-col items-center gap-2 p-3 rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
                  <Icon name="ep:trophy" class="text-2xl"/>
                  <span class="text-sm">排行榜</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 自定义分页样式 - 彩色 */
:deep(.custom-pagination) {
  --el-pagination-hover-color: #3b82f6;
  --el-pagination-button-color: #64748b;
}

:deep(.custom-pagination .el-pager li.is-active) {
  background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
  border: none;
  color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

:deep(.custom-pagination .el-pager li:hover) {
  color: #3b82f6;
}

:deep(.custom-pagination .btn-prev),
:deep(.custom-pagination .btn-next) {
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: white;
}

:deep(.custom-pagination .btn-prev:hover),
:deep(.custom-pagination .btn-next:hover) {
  border-color: #3b82f6;
  color: #3b82f6;
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
