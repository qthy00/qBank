<script setup lang="ts">
import {DocumentApi} from '~/api/document'
import type {DocumentVO, DocumentCategoryVO, ExamTypeVO, YearOptionVO,DocumentType} from '~/types/document'


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
          <h1 class="text-3xl font-bold text-white mb-3">文档下载</h1>
          <p class="text-white/80 text-base max-w-2xl mx-auto">历年真题、模拟试题、考试大纲、教材讲义等备考资料，助力考试成功</p>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 py-8 -mt-6">
      <!-- 筛选卡片 -->
      <div class="bg-white rounded-2xl shadow-lg shadow-(--color-shadow)/50 overflow-hidden mb-8">
        <!-- 类型切换标签 -->
        <div class="flex items-center border-b border-(--color-border-light)">
          <button
            class="flex-1 px-6 py-4 text-base font-medium transition-all duration-300 border-b-2"
            :class="activeTab === 'real'
              ? 'border-(--color-primary) text-(--color-primary) bg-(--color-primary-light)'
              : 'border-transparent text-(--color-text-secondary) hover:text-(--color-primary) hover:bg-(--color-bg-container)'"
            @click="handleTabChange('real')"
          >
            <div class="flex items-center justify-center gap-2">
              <Icon name="ep:collection" class="text-lg" />
              <span>真题资料</span>
            </div>
          </button>
          <button
            class="flex-1 px-6 py-4 text-base font-medium transition-all duration-300 border-b-2"
            :class="activeTab === 'material'
              ? 'border-(--color-primary) text-(--color-primary) bg-(--color-primary-light)'
              : 'border-transparent text-(--color-text-secondary) hover:text-(--color-primary) hover:bg-(--color-bg-container)'"
            @click="handleTabChange('material')"
          >
            <div class="flex items-center justify-center gap-2">
              <Icon name="ep:reading" class="text-lg" />
              <span>学习资料</span>
            </div>
          </button>
        </div>

        <div class="p-6 space-y-5">
          <!-- 分类筛选 -->
          <div>
            <div class="flex items-start gap-3">
              <span class="text-sm font-medium text-(--color-text-secondary) pt-1.5 shrink-0">
                <Icon name="ep:folder" class="mr-1" />
                分类：
              </span>
              <div class="flex items-center gap-2 flex-wrap">
                <button
                  v-for="category in categories"
                  :key="category.id"
                  class="px-4 py-1.5 text-sm rounded-full transition-all duration-300"
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

          <!-- 考试类型筛选 -->
          <div>
            <div class="flex items-start gap-3">
              <span class="text-sm font-medium text-(--color-text-secondary) pt-1.5 shrink-0">
                <Icon name="ep:suitcase" class="mr-1" />
                考试：
              </span>
              <div class="flex items-center gap-2 flex-wrap">
                <button
                  v-for="exam in examTypes"
                  :key="exam.code"
                  class="px-4 py-1.5 text-sm rounded-full transition-all duration-300"
                  :class="activeExamType === exam.code
                    ? 'bg-(--color-success) text-white shadow-md shadow-(--color-success)/30'
                    : 'bg-(--color-bg-container) text-(--color-text-secondary) hover:bg-(--color-success-light) hover:text-(--color-success)'"
                  @click="handleExamTypeChange(exam.code)"
                >
                  {{ exam.name }}
                </button>
              </div>
            </div>
          </div>

          <!-- 年份筛选 -->
          <div>
            <div class="flex items-start gap-3">
              <span class="text-sm font-medium text-(--color-text-secondary) pt-1.5 shrink-0">
                <Icon name="ep:calendar" class="mr-1" />
                年份：
              </span>
              <div class="flex items-center gap-2 flex-wrap">
                <button
                  v-for="year in yearOptions"
                  :key="year.year"
                  class="px-4 py-1.5 text-sm rounded-full transition-all duration-300"
                  :class="activeYear === year.year
                    ? 'bg-(--color-warning) text-white shadow-md shadow-(--color-warning)/30'
                    : 'bg-(--color-bg-container) text-(--color-text-secondary) hover:bg-(--color-warning-light) hover:text-(--color-warning)'"
                  @click="handleYearChange(year.year)"
                >
                  {{ year.year }}年
                </button>
              </div>
            </div>
          </div>

          <!-- 搜索框 -->
          <div class="pt-4 border-t border-(--color-border-light)">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Icon name="ep:document" class="text-(--color-primary) text-lg" />
                <span class="text-sm text-(--color-text-secondary)">共 <span class="text-(--color-primary) font-semibold">{{ total }}</span> 个文档</span>
              </div>
              <div class="flex items-center gap-3">
                <el-input
                  v-model="queryParams.keyword"
                  placeholder="搜索文档..."
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
      </div>

      <!-- 文档列表 -->
      <div v-loading="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <!-- 空状态 -->
        <el-empty v-if="documentList.length === 0 && !loading" description="暂无文档" class="col-span-full py-16 bg-white rounded-2xl" />

        <!-- 文档卡片 -->
        <div
          v-for="(doc, index) in documentList"
          :key="doc.id"
          class="group bg-white rounded-xl shadow-md shadow-(--color-shadow)/30 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-(--color-shadow)/50 hover:-translate-y-2"
          :style="{ animationDelay: `${index * 50}ms` }"
          @click="handleViewDetail(doc.id)"
        >
          <!-- 封面图 -->
          <div class="relative h-44 overflow-hidden">
            <img
              v-if="doc.coverImage"
              :src="doc.coverImage"
              :alt="doc.title"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            >
            <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-(--color-primary-light) to-(--color-primary-lighter)">
              <Icon name="ep:document" class="text-5xl text-(--color-primary)" />
            </div>

            <!-- VIP/免费/价格标签 -->
            <div class="absolute top-3 right-3">
              <span
                v-if="doc.isFree"
                class="px-3 py-1.5 text-xs font-medium text-white bg-(--color-success) rounded-full shadow-md"
              >
                <Icon name="ep:present" class="mr-1" />
                免费
              </span>
              <span
                v-else-if="doc.isVip"
                class="px-3 py-1.5 text-xs font-medium text-white bg-(--color-warning) rounded-full shadow-md"
              >
                <Icon name="ep:medal" class="mr-1" />
                VIP
              </span>
              <span
                v-else
                class="px-3 py-1.5 text-xs font-medium text-white bg-(--color-danger) rounded-full shadow-md"
              >
                <Icon name="ep:money" class="mr-1" />
                ¥{{ doc.price }}
              </span>
            </div>

            <!-- 文件类型标签 -->
            <div class="absolute bottom-3 left-3">
              <span class="px-3 py-1 text-xs font-medium text-white bg-black/60 backdrop-blur-sm rounded-full">
                {{ doc.fileType }}
              </span>
            </div>

            <!-- 下载次数 -->
            <div class="absolute bottom-3 right-3">
              <span class="px-3 py-1 text-xs font-medium text-white bg-black/60 backdrop-blur-sm rounded-full flex items-center gap-1">
                <Icon name="ep:download" />
                {{ formatDownloadCount(doc.downloadCount) }}
              </span>
            </div>
          </div>

          <!-- 内容区 -->
          <div class="p-5">
            <!-- 标题 -->
            <h3 class="text-sm font-semibold text-(--color-text-primary) mb-3 line-clamp-2 group-hover:text-(--color-primary) transition-colors duration-300 h-10">
              {{ doc.title }}
            </h3>

            <!-- 文档信息 -->
            <div class="flex items-center justify-between text-xs text-(--color-text-tertiary) mb-3">
              <span class="flex items-center gap-1">
                <Icon name="ep:document" class="text-(--color-primary)" />
                {{ formatFileSize(doc.fileSize) }}
              </span>
              <span v-if="doc.pages" class="flex items-center gap-1">
                <Icon name="ep:files" class="text-(--color-primary)" />
                {{ doc.pages }}页
              </span>
            </div>

            <!-- 底部信息 -->
            <div class="flex items-center justify-between pt-3 border-t border-(--color-border-light)">
              <span class="px-2.5 py-1 text-xs font-medium text-(--color-primary) bg-(--color-primary-light) rounded-full">
                {{ doc.categoryName }}
              </span>
              <span class="text-xs text-(--color-text-tertiary)">{{ doc.year }}年</span>
            </div>
          </div>

          <!-- 悬停覆盖层 -->
          <div class="absolute inset-0 bg-gradient-to-t from-(--color-primary)/90 via-(--color-primary)/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
            <button class="px-6 py-2.5 bg-white text-(--color-primary) rounded-full font-medium shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              查看详情
            </button>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="total > 0" class="flex items-center justify-center mt-10">
        <el-pagination
          v-model:current-page="queryParams.page"
          :page-size="queryParams.limit"
          :total="total"
          layout="prev, pager, next, jumper"
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

/* 文档卡片动画 */
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

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
