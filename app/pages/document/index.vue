<script setup lang="ts">
import {DocumentApi} from '~/api/document'
import type {
  DocumentVO,
  DocumentCategoryVO,
  ExamTypeVO,
  YearOptionVO,
  DocumentType,
  MajorVO,
  LevelOptionVO,
  MaterialTypeOptionVO,
  StatusOptionVO,
} from '~/types/document'


definePageMeta({
  layout: 'default'
})

useHead({
  title: '文档下载 - 学次元在线题库'
})

/* ==================== 状态定义 ==================== */

/* 大类筛选 */
const majors = ref<MajorVO[]>([])
const activeMajor = ref<string>('building')

/* 考试类型筛选 */
const examTypes = ref<ExamTypeVO[]>([])
const activeExamType = ref<string>('yijian')

/* 分类数据 */
const categories = ref<DocumentCategoryVO[]>([])
const activeCategory = ref<number>(0)

/* 等级筛选 */
const levelOptions = ref<LevelOptionVO[]>([])
const activeLevel = ref<string>('')

/* 资料类型筛选 */
const materialTypes = ref<MaterialTypeOptionVO[]>([])
const activeMaterialType = ref<string>('')

/* 状态筛选 */
const statusOptions = ref<StatusOptionVO[]>([])
const activeStatus = ref<string>('')

/* 年份筛选 */
const yearOptions = ref<YearOptionVO[]>([])
const activeYear = ref<number>(0)

/* 当前文档类型 */
const activeTab = ref<DocumentType>('real')

/* 排序选项 */
const sortOptions = [
  { value: 'comprehensive', label: '综合排序' },
  { value: 'newest', label: '最新上传' },
  { value: 'downloads', label: '下载最多' },
  { value: 'price_asc', label: '价格从低到高' },
  { value: 'price_desc', label: '价格从高到低' },
]
const activeSort = ref<string>('comprehensive')

/* 列表数据 */
const loading = ref(false)
const documentList = ref<DocumentVO[]>([])
const total = ref(0)

/* 热门资料排行 */
const hotDocuments = ref<DocumentVO[]>([])

/* 查询参数 */
const queryParams = reactive({
  page: 1,
  limit: 12,
  docType: 'real' as DocumentType,
  categoryId: undefined as number | undefined,
  majorCode: 'building' as string | undefined,
  examType: 'yijian' as string | undefined,
  year: undefined as number | undefined,
  level: undefined as string | undefined,
  materialType: undefined as string | undefined,
  status: undefined as string | undefined,
  sort: 'comprehensive' as string | undefined,
  keyword: '',
})

/* ==================== 方法定义 ==================== */

/* 获取大类列表 */
const fetchMajors = async () => {
  try {
    const data = await DocumentApi.getMajors()
    majors.value = data
  } catch (error) {
    console.error('获取大类失败:', error)
  }
}

/* 获取考试类型 */
const fetchExamTypes = async () => {
  try {
    const data = await DocumentApi.getExamTypes(activeMajor.value)
    examTypes.value = data
  } catch (error) {
    console.error('获取考试类型失败:', error)
  }
}

/* 获取分类列表 */
const fetchCategories = async () => {
  try {
    const data = await DocumentApi.getDocumentCategories(activeTab.value)
    categories.value = [{ id: 0, name: '全部' }, ...data]
  } catch (error) {
    console.error('获取分类失败:', error)
  }
}

/* 获取等级选项 */
const fetchLevelOptions = async () => {
  try {
    const data = await DocumentApi.getLevelOptions()
    levelOptions.value = [{ value: '', label: '全部等级' }, ...data]
  } catch (error) {
    console.error('获取等级选项失败:', error)
  }
}

/* 获取资料类型选项 */
const fetchMaterialTypes = async () => {
  try {
    const data = await DocumentApi.getMaterialTypes()
    materialTypes.value = [{ value: '', label: '全部类型' }, ...data]
  } catch (error) {
    console.error('获取资料类型失败:', error)
  }
}

/* 获取状态选项 */
const fetchStatusOptions = async () => {
  try {
    const data = await DocumentApi.getStatusOptions()
    statusOptions.value = [{ value: '', label: '全部状态' }, ...data]
  } catch (error) {
    console.error('获取状态选项失败:', error)
  }
}

/* 获取年份选项 */
const fetchYearOptions = async () => {
  try {
    const data = await DocumentApi.getYearOptions()
    yearOptions.value = [{ year: 0, count: 0 }, ...data]
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

/* 获取热门文档 */
const fetchHotDocuments = async () => {
  try {
    const data = await DocumentApi.getDocumentList({
      page: 1,
      limit: 10,
      docType: activeTab.value,
      sort: 'downloads',
    })
    hotDocuments.value = data.list?.slice(0, 5) || []
  } catch (error) {
    console.error('获取热门文档失败:', error)
  }
}

/* 切换大类 */
const handleMajorChange = (code: string) => {
  activeMajor.value = code
  queryParams.majorCode = code
  queryParams.page = 1
  /* 重新获取考试类型 */
  fetchExamTypes()
  fetchDocumentList()
}

/* 切换考试类型 */
const handleExamTypeChange = (code: string) => {
  activeExamType.value = code
  queryParams.examType = code
  queryParams.page = 1
  fetchDocumentList()
}

/* 切换分类 */
const handleCategoryChange = (categoryId: number) => {
  activeCategory.value = categoryId
  queryParams.categoryId = categoryId === 0 ? undefined : categoryId
  queryParams.page = 1
  fetchDocumentList()
}

/* 切换等级 */
const handleLevelChange = (value: string) => {
  activeLevel.value = value
  queryParams.level = value || undefined
  queryParams.page = 1
  fetchDocumentList()
}

/* 切换资料类型 */
const handleMaterialTypeChange = (value: string) => {
  activeMaterialType.value = value
  queryParams.materialType = value || undefined
  queryParams.page = 1
  fetchDocumentList()
}

/* 切换状态 */
const handleStatusChange = (value: string) => {
  activeStatus.value = value
  queryParams.status = value || undefined
  queryParams.page = 1
  fetchDocumentList()
}

/* 切换年份 */
const handleYearChange = (year: number) => {
  activeYear.value = year
  queryParams.year = year || undefined
  queryParams.page = 1
  fetchDocumentList()
}

/* 切换文档类型 */
const handleTabChange = (tab: DocumentType) => {
  activeTab.value = tab
  queryParams.docType = tab
  queryParams.page = 1
  fetchCategories()
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

/* 排序变化 */
const handleSortChange = () => {
  queryParams.sort = activeSort.value
  queryParams.page = 1
  fetchDocumentList()
}

/* 查看详情 */
const handleViewDetail = (id: number) => {
  navigateTo(`/document/${id}`)
}

/* 格式化文件大小 */
const formatFileSize = (bytes?: number): string => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/* 格式化下载次数 */
const formatDownloadCount = (count?: number): string => {
  if (!count) return '0'
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + 'w'
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k'
  }
  return count.toString()
}

/* 获取排名样式 */
const getRankStyle = (index: number) => {
  if (index === 0) return 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white'
  if (index === 1) return 'bg-gradient-to-br from-gray-300 to-gray-400 text-white'
  if (index === 2) return 'bg-gradient-to-br from-orange-300 to-orange-400 text-white'
  return 'bg-gray-100 text-gray-500'
}

/* 获取当前大类名称 */
const currentMajorName = computed(() => {
  return majors.value.find(m => m.code === activeMajor.value)?.name || ''
})

/* 初始化 */
onMounted(() => {
  fetchMajors()
  fetchExamTypes()
  fetchCategories()
  fetchLevelOptions()
  fetchMaterialTypes()
  fetchStatusOptions()
  fetchYearOptions()
  fetchDocumentList()
  fetchHotDocuments()
})
</script>

<template>
  <div class="min-h-screen bg-(--color-bg-container)">
    <!-- 页面标题区 -->
    <div class="bg-white border-b border-(--color-border)">
      <div class="mx-auto px-6 pt-6">
        <div class="flex items-center gap-4">
          <h1 class="text-2xl font-bold text-(--color-text-primary)">{{ currentMajorName }}</h1>
        </div>
      </div>
    </div>

    <div class="mx-auto px-6 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- 左侧主要内容区 -->
        <div class="lg:col-span-3 space-y-4">
          <!-- 筛选卡片 -->
          <div class="bg-white rounded-xl shadow-sm border border-(--color-border) overflow-hidden">
            <!-- 筛选内容 -->
            <div class="p-5 space-y-4">
              <!-- 大类 -->
              <div class="flex items-start gap-3">
                <span class="text-sm font-medium text-(--color-text-secondary) pt-1.5 shrink-0 w-12">大类</span>
                <div class="flex items-center gap-2 flex-wrap">
                  <button
                    v-for="major in majors"
                    :key="major.code"
                    :class="activeMajor === major.code
                      ? 'bg-(--color-btn-primary) text-white'
                      : 'text-(--color-text-secondary) hover:text-(--color-btn-primary)'
                    "
                    class="px-3 py-1 text-sm rounded-full transition-all duration-200"
                    @click="handleMajorChange(major.code)"
                  >
                    {{ major.name }}
                  </button>
                </div>
              </div>

              <!-- 考试 -->
              <div class="flex items-start gap-3">
                <span class="text-sm font-medium text-(--color-text-secondary) pt-1.5 shrink-0 w-12">考试</span>
                <div class="flex items-center gap-2 flex-wrap">
                  <button
                    v-for="exam in examTypes"
                    :key="exam.code"
                    :class="activeExamType === exam.code
                      ? 'bg-(--color-btn-primary) text-white'
                      : 'text-(--color-text-secondary) hover:text-(--color-btn-primary)'
                    "
                    class="px-3 py-1 text-sm rounded-full transition-all duration-200"
                    @click="handleExamTypeChange(exam.code)"
                  >
                    {{ exam.name }}
                  </button>
                </div>
              </div>

              <!-- 科目 -->
              <div class="flex items-start gap-3">
                <span class="text-sm font-medium text-(--color-text-secondary) pt-1.5 shrink-0 w-12">科目</span>
                <div class="flex items-center gap-2 flex-wrap">
                  <button
                    :class="activeCategory === 0
                      ? 'bg-(--color-btn-primary) text-white'
                      : 'text-(--color-text-secondary) hover:text-(--color-btn-primary)'
                    "
                    class="px-3 py-1 text-sm rounded-full transition-all duration-200"
                    @click="handleCategoryChange(0)"
                  >
                    全部
                  </button>
                  <button
                    v-for="category in categories.slice(1)"
                    :key="category.id"
                    :class="activeCategory === category.id
                      ? 'bg-(--color-btn-primary) text-white'
                      : 'text-(--color-text-secondary) hover:text-(--color-btn-primary)'
                    "
                    class="px-3 py-1 text-sm rounded-full transition-all duration-200"
                    @click="handleCategoryChange(category.id)"
                  >
                    {{ category.name }}
                  </button>
                </div>
              </div>

              <!-- 等级 -->
              <div class="flex items-start gap-3">
                <span class="text-sm font-medium text-(--color-text-secondary) pt-1.5 shrink-0 w-12">等级</span>
                <div class="flex items-center gap-2 flex-wrap">
                  <button
                    v-for="level in levelOptions"
                    :key="level.value"
                    :class="activeLevel === level.value
                      ? 'bg-(--color-btn-primary) text-white'
                      : 'text-(--color-text-secondary) hover:text-(--color-btn-primary)'
                    "
                    class="px-3 py-1 text-sm rounded-full transition-all duration-200"
                    @click="handleLevelChange(level.value)"
                  >
                    {{ level.label }}
                  </button>
                </div>
              </div>

              <!-- 类型 -->
              <div class="flex items-start gap-3">
                <span class="text-sm font-medium text-(--color-text-secondary) pt-1.5 shrink-0 w-12">类型</span>
                <div class="flex items-center gap-2 flex-wrap">
                  <button
                    v-for="type in materialTypes.slice(0, 8)"
                    :key="type.value"
                    :class="activeMaterialType === type.value
                      ? 'bg-(--color-btn-primary) text-white'
                      : 'text-(--color-text-secondary) hover:text-(--color-btn-primary)'
                    "
                    class="px-3 py-1 text-sm rounded-full transition-all duration-200"
                    @click="handleMaterialTypeChange(type.value)"
                  >
                    {{ type.label }}
                  </button>
                </div>
              </div>

              <!-- 状态 -->
              <div class="flex items-start gap-3">
                <span class="text-sm font-medium text-(--color-text-secondary) pt-1.5 shrink-0 w-12">状态</span>
                <div class="flex items-center gap-2 flex-wrap">
                  <button
                    v-for="status in statusOptions"
                    :key="status.value"
                    :class="activeStatus === status.value
                      ? 'bg-(--color-btn-primary) text-white'
                      : 'text-(--color-text-secondary) hover:text-(--color-btn-primary)'
                    "
                    class="px-3 py-1 text-sm rounded-full transition-all duration-200"
                    @click="handleStatusChange(status.value)"
                  >
                    {{ status.label }}
                  </button>
                </div>
              </div>
            </div>

            <!-- 搜索和排序 -->
            <div class="px-5 py-3 bg-gray-50 border-t border-(--color-border) flex items-center justify-between">
              <div class="flex items-center gap-3">
                <el-select v-model="activeSort" size="small" class="w-28" @change="handleSortChange">
                  <el-option
                    v-for="opt in sortOptions"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value"
                  />
                </el-select>
                <el-select size="small" class="w-28" placeholder="全部主题">
                  <el-option label="全部主题" value="" />
                </el-select>
                <el-select size="small" class="w-28" placeholder="全部考期">
                  <el-option
                    v-for="year in yearOptions"
                    :key="year.year"
                    :label="year.year ? year.year + '年' : '全部考期'"
                    :value="year.year"
                  />
                </el-select>
              </div>
              <div class="flex items-center gap-2">
                <el-input
                  v-model="queryParams.keyword"
                  placeholder="搜索资料名称"
                  size="small"
                  clearable
                  class="w-48"
                  @keyup.enter="handleSearch"
                >
                  <template #suffix>
                    <Icon name="ep:search" class="text-(--color-text-secondary) cursor-pointer" @click="handleSearch" />
                  </template>
                </el-input>
              </div>
            </div>
          </div>

          <!-- 文档列表 -->
          <div v-loading="loading" class="space-y-4">
            <!-- 空状态 -->
            <el-empty v-if="documentList.length === 0 && !loading" description="暂无文档" class="py-16 bg-white rounded-xl" />

            <!-- 文档组（按主题分组） -->
            <div class="bg-white rounded-xl shadow-sm border border-(--color-border)">
              <!-- 组标题 -->
              <div class="px-5 py-4 border-b border-(--color-border)">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <Icon name="ep:remove" class="text-red-500 text-xl" />
                    <h3 class="font-bold text-(--color-text-primary)">摸底测试！3月模考大赛试卷及答案</h3>
                  </div>
                  <button class="text-sm text-(--color-text-secondary) hover:text-(--color-btn-primary) flex items-center gap-1">
                    收起
                    <Icon name="ep:arrow-up" />
                  </button>
                </div>
                <div class="flex items-center gap-4 mt-2 text-sm text-(--color-text-secondary)">
                  <span>共 {{ documentList.length }} 套</span>
                  <span>/</span>
                  <span>下载数: {{ formatDownloadCount(documentList.reduce((sum, doc) => sum + doc.downloadCount, 0)) }}</span>
                </div>
              </div>

              <!-- 文档项列表 -->
              <div class="divide-y divide-(--color-border)">
                <div
                  v-for="(doc, index) in documentList"
                  :key="doc.id"
                  class="p-5 flex items-start gap-4 hover:bg-gray-50 transition-colors"
                >
                  <!-- 文档图标 -->
                  <div class="relative shrink-0">
                    <div class="w-16 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                      <Icon name="ep:document" class="text-3xl text-orange-400" />
                    </div>
                    <div v-if="index < 3" class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded flex items-center justify-center">
                      {{ ['一', '二', '三'][index] }}
                    </div>
                  </div>

                  <!-- 文档信息 -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start gap-2">
                      <span
                        v-if="index < 2"
                        class="px-2 py-0.5 text-xs text-white bg-red-500 rounded"
                      >
                        推荐
                      </span>
                      <h4 class="font-medium text-(--color-text-primary) line-clamp-1">
                        {{ doc.title }}
                      </h4>
                    </div>

                    <div class="flex items-center gap-4 mt-2 text-sm text-(--color-text-secondary)">
                      <span v-if="doc.isFree" class="text-red-500 font-medium">免费</span>
                      <span v-else-if="doc.isVip" class="text-orange-500 font-medium">VIP</span>
                      <span v-else class="text-red-500 font-medium">¥{{ doc.price }}</span>
                      <span>{{ formatFileSize(doc.fileSize) }}</span>
                      <span>下载数: {{ formatDownloadCount(doc.downloadCount) }}</span>
                      <span
                        v-if="doc.categoryName"
                        class="px-2 py-0.5 text-xs text-red-500 border border-red-500 rounded"
                      >
                        {{ doc.categoryName }}▶
                      </span>
                    </div>
                  </div>

                  <!-- 下载按钮 -->
                  <div class="shrink-0">
                    <button
                      class="px-6 py-2 text-sm text-(--color-btn-primary) border border-(--color-btn-primary) rounded-full hover:bg-(--color-btn-primary) hover:text-white transition-colors"
                      @click="handleViewDetail(doc.id)"
                    >
                      下载
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 分页 -->
          <div v-if="total > 0" class="flex items-center justify-center pt-4">
            <el-pagination
              v-model:current-page="queryParams.page"
              :page-size="queryParams.limit"
              :total="total"
              layout="prev, pager, next"
              prev-text="上一页"
              next-text="下一页"
              background
              @change="handlePageChange"
            />
          </div>
        </div>

        <!-- 右侧侧边栏 -->
        <div class="lg:col-span-1 space-y-4">
          <!-- Banner广告 -->
<!--          <div class="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-4 text-white">-->
<!--            <div class="text-xs opacity-80 mb-1">在线题库网 | 一建新教材1月发布</div>-->
<!--            <h3 class="text-lg font-bold mb-2">2026一建新课火热开播</h3>-->
<!--            <p class="text-xs opacity-80 mb-3">新课低至6.4折，买课送【书籍大礼包】</p>-->
<!--            <button class="px-4 py-1.5 text-sm bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">-->
<!--              立即下单▶-->
<!--            </button>-->
<!--          </div>-->

          <!-- 用户信息卡片 -->
          <div class="bg-white rounded-xl shadow-sm border border-(--color-border) p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Icon name="ep:user" class="text-xl text-blue-500" />
                </div>
                <span class="font-medium text-(--color-text-primary)">未登录</span>
              </div>
              <a href="/account" class="text-sm text-(--color-btn-primary) hover:underline flex items-center">
                我的资料
                <Icon name="ep:arrow-right" />
              </a>
            </div>
            <div class="mt-3 pt-3 border-t border-(--color-border)">
              <p class="text-sm text-(--color-text-secondary)">
                权益介绍：可下载免费资料，用下载币兑换精品...
                <Icon name="ep:arrow-right" class="text-xs" />
              </p>
            </div>
          </div>

          <!-- 下载币 -->
          <div class="bg-white rounded-xl shadow-sm border border-(--color-border) p-4">
            <div class="flex items-center gap-2 mb-3">
              <span class="font-medium text-(--color-text-primary)">获取更多下载币</span>
              <Icon name="material-symbols:coin" class="text-yellow-500 text-xl" />
            </div>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <Icon name="ep:user" class="text-(--color-text-secondary)" />
                  <span class="text-sm text-(--color-text-secondary)">邀请好友得30下载币</span>
                </div>
                <button class="px-3 py-1 text-xs text-(--color-btn-primary) border border-(--color-btn-primary) rounded-full hover:bg-(--color-btn-primary) hover:text-white transition-colors">
                  邀请好友
                </button>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <Icon name="ep:document" class="text-(--color-text-secondary)" />
                  <span class="text-sm text-(--color-text-secondary)">兑换下载币</span>
                </div>
                <button class="px-3 py-1 text-xs text-(--color-btn-primary) border border-(--color-btn-primary) rounded-full hover:bg-(--color-btn-primary) hover:text-white transition-colors">
                  去兑换
                </button>
              </div>
            </div>
          </div>

          <!-- 热门资料排行榜 -->
          <div class="bg-white rounded-xl shadow-sm border border-(--color-border) p-4">
            <h3 class="font-bold text-(--color-text-primary) mb-4">热门资料排行榜</h3>
            <div class="space-y-4">
              <div
                v-for="(doc, index) in hotDocuments"
                :key="doc.id"
                class="flex items-start gap-3"
              >
                <div
                  :class="getRankStyle(index)"
                  class="w-6 h-6 rounded flex items-center justify-center text-sm font-bold shrink-0"
                >
                  {{ index + 1 }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-(--color-text-primary) line-clamp-2 hover:text-(--color-btn-primary) cursor-pointer" @click="handleViewDetail(doc.id)">
                    {{ doc.title }}
                  </p>
                  <div class="flex items-center justify-between mt-2 text-xs text-(--color-text-secondary)">
                    <span v-if="doc.isFree" class="text-red-500">免费</span>
                    <span v-else-if="doc.isVip" class="text-orange-500">VIP专享</span>
                    <span v-else class="text-red-500">¥{{ doc.price }}</span>
                    <span>下载数: {{ formatDownloadCount(doc.downloadCount) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* 自定义分页样式 */
:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background-color: var(--color-btn-primary);
  color: white;
}

:deep(.el-pagination.is-background .el-pager li:not(.is-disabled):hover) {
  color: var(--color-btn-primary);
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
