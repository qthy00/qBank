<script setup lang="ts">
import {DocumentApi} from '~/api/document'
import type {DocumentVO, DocumentCategoryVO, ExamTypeVO, YearOptionVO} from '~/types/document'
import type {DocumentType} from '~/types/document'

definePageMeta({
  layout: 'default'
})

useHead({
  title: '文档下载'
})

const route = useRoute()
const router = useRouter()

/* 当前文档类型 */
const activeTab = ref<DocumentType>('real')

/* 分类数据 */
const categories = ref<DocumentCategoryVO[]>([])
const activeCategory = ref<number>(0)

/* 考试类型 */
const examTypes = ref<ExamTypeVO[]>([])
const activeExamType = ref<string>('')

/* 年份筛选 */
const yearOptions = ref<YearOptionVO[]>([])
const activeYear = ref<number>(0)

/* 列表数据 */
const loading = ref(false)
const documentList = ref<DocumentVO[]>([])
const total = ref(0)

/* 查询参数 */
const queryParams = reactive({
  page: 1,
  limit: 12,
  docType: 'real' as DocumentType,
  categoryId: undefined as number | undefined,
  examType: undefined as string | undefined,
  year: undefined as number | undefined,
  keyword: '',
})

/* 切换文档类型 */
const handleTabChange = (tab: DocumentType) => {
  activeTab.value = tab
  queryParams.docType = tab
  queryParams.page = 1
  activeCategory.value = 0
  queryParams.categoryId = undefined
  fetchCategories()
  fetchDocumentList()
}

/* 获取分类列表 */
const fetchCategories = async () => {
  try {
    const data = await DocumentApi.getDocumentCategories(activeTab.value)
    categories.value = [{ id: 0, name: '全部', icon: 'ep:menu' }, ...data]
  } catch (error) {
    console.error('获取分类失败:', error)
  }
}

/* 获取考试类型 */
const fetchExamTypes = async () => {
  try {
    const data = await DocumentApi.getExamTypes()
    examTypes.value = data
  } catch (error) {
    console.error('获取考试类型失败:', error)
  }
}

/* 获取年份选项 */
const fetchYearOptions = async () => {
  try {
    const data = await DocumentApi.getYearOptions()
    yearOptions.value = data
  } catch (error) {
    console.error('获取年份选项失败:', error)
  }
}

/* 获取文档列表 */
const fetchDocumentList = async () => {
  loading.value = true
  try {
    const data = await DocumentApi.getDocumentList(queryParams)
    documentList.value = data.list || []
    total.value = data.total || 0
  } catch (error) {
    console.error('获取文档列表失败:', error)
  } finally {
    loading.value = false
  }
}

/* 切换分类 */
const handleCategoryChange = (categoryId: number) => {
  activeCategory.value = categoryId
  queryParams.categoryId = categoryId === 0 ? undefined : categoryId
  queryParams.page = 1
  fetchDocumentList()
}

/* 切换考试类型 */
const handleExamTypeChange = (examType: string) => {
  activeExamType.value = examType === activeExamType.value ? '' : examType
  queryParams.examType = activeExamType.value || undefined
  queryParams.page = 1
  fetchDocumentList()
}

/* 切换年份 */
const handleYearChange = (year: number) => {
  activeYear.value = year === activeYear.value ? 0 : year
  queryParams.year = activeYear.value || undefined
  queryParams.page = 1
  fetchDocumentList()
}

/* 搜索 */
const handleSearch = () => {
  queryParams.page = 1
  fetchDocumentList()
}

/* 分页 */
const handlePageChange = (page: number) => {
  queryParams.page = page
  fetchDocumentList()
}

/* 查看详情 */
const handleViewDetail = (id: number) => {
  router.push(`/document/${id}`)
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
  fetchCategories()
  fetchExamTypes()
  fetchYearOptions()
  fetchDocumentList()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 页面标题区 -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-6xl mx-auto px-4 py-6">
        <h1 class="text-2xl font-bold text-gray-800">文档下载</h1>
        <p class="text-sm text-gray-500 mt-2">历年真题、模拟试题、考试大纲、教材讲义等备考资料</p>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 py-6">
      <!-- 类型切换标签 -->
      <div class="bg-white rounded-xl shadow-sm mb-6">
        <div class="flex items-center px-6 border-b border-gray-100">
          <button
            class="px-6 py-4 text-base font-medium border-b-2 transition-colors duration-200"
            :class="activeTab === 'real'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'"
            @click="handleTabChange('real')"
          >
            <div class="flex items-center gap-2">
              <Icon name="ep:collection" />
              <span>真题资料</span>
            </div>
          </button>
          <button
            class="px-6 py-4 text-base font-medium border-b-2 transition-colors duration-200"
            :class="activeTab === 'material'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'"
            @click="handleTabChange('material')"
          >
            <div class="flex items-center gap-2">
              <Icon name="ep:reading" />
              <span>学习资料</span>
            </div>
          </button>
        </div>

        <div class="p-6">
          <!-- 分类筛选 -->
          <div class="mb-4">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-sm text-gray-500 mr-2">分类：</span>
              <button
                v-for="category in categories"
                :key="category.id"
                class="px-4 py-1.5 text-sm rounded-full transition-colors duration-200"
                :class="activeCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                @click="handleCategoryChange(category.id)"
              >
                {{ category.name }}
              </button>
            </div>
          </div>

          <!-- 考试类型筛选 -->
          <div class="mb-4">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-sm text-gray-500 mr-2">考试类型：</span>
              <button
                v-for="exam in examTypes"
                :key="exam.code"
                class="px-4 py-1.5 text-sm rounded-full transition-colors duration-200"
                :class="activeExamType === exam.code
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                @click="handleExamTypeChange(exam.code)"
              >
                {{ exam.name }}
              </button>
            </div>
          </div>

          <!-- 年份筛选 -->
          <div class="mb-4">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-sm text-gray-500 mr-2">年份：</span>
              <button
                v-for="year in yearOptions"
                :key="year.year"
                class="px-4 py-1.5 text-sm rounded-full transition-colors duration-200"
                :class="activeYear === year.year
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                @click="handleYearChange(year.year)"
              >
                {{ year.year }}年
              </button>
            </div>
          </div>

          <!-- 搜索框 -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-500">共 {{ total }} 个文档</span>
            </div>
            <el-input
              v-model="queryParams.keyword"
              placeholder="搜索文档..."
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

      <!-- 文档列表 -->
      <div v-loading="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <!-- 空状态 -->
        <el-empty v-if="documentList.length === 0 && !loading" description="暂无文档" class="col-span-full py-12" />

        <!-- 文档卡片 -->
        <div
          v-for="doc in documentList"
          :key="doc.id"
          class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer group"
          @click="handleViewDetail(doc.id)"
        >
          <!-- 封面图 -->
          <div class="relative h-40 overflow-hidden bg-gray-100">
            <img
              v-if="doc.coverImage"
              :src="doc.coverImage"
              :alt="doc.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
              <Icon name="ep:document" class="text-4xl" />
            </div>

            <!-- VIP/免费标签 -->
            <div class="absolute top-2 right-2">
              <span
                v-if="doc.isFree"
                class="px-2 py-1 text-xs font-medium text-white bg-green-500 rounded"
              >
                免费
              </span>
              <span
                v-else-if="doc.isVip"
                class="px-2 py-1 text-xs font-medium text-white bg-orange-500 rounded"
              >
                VIP
              </span>
              <span
                v-else
                class="px-2 py-1 text-xs font-medium text-white bg-blue-500 rounded"
              >
                ¥{{ doc.price }}
              </span>
            </div>

            <!-- 文件类型标签 -->
            <div class="absolute bottom-2 left-2">
              <span class="px-2 py-1 text-xs font-medium text-white bg-black/50 rounded">
                {{ doc.fileType }}
              </span>
            </div>
          </div>

          <!-- 内容区 -->
          <div class="p-4">
            <!-- 标题 -->
            <h3 class="text-sm font-medium text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors h-10">
              {{ doc.title }}
            </h3>

            <!-- 文档信息 -->
            <div class="flex items-center gap-3 text-xs text-gray-500 mb-3">
              <span class="flex items-center gap-1">
                <Icon name="ep:document" class="text-xs" />
                {{ formatFileSize(doc.fileSize) }}
              </span>
              <span class="flex items-center gap-1">
                <Icon name="ep:download" class="text-xs" />
                {{ formatDownloadCount(doc.downloadCount) }}
              </span>
              <span v-if="doc.pages">{{ doc.pages }}页</span>
            </div>

            <!-- 底部信息 -->
            <div class="flex items-center justify-between">
              <span class="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {{ doc.categoryName }}
              </span>
              <span class="text-xs text-gray-400">{{ doc.year }}年</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="total > 0" class="flex items-center justify-center mt-8">
        <el-pagination
          v-model:current-page="queryParams.page"
          :page-size="queryParams.limit"
          :total="total"
          layout="prev, pager, next, jumper"
          @change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
