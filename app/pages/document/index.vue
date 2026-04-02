<script setup lang="ts">
import {DocumentApi} from '~/api/document'
import type {
  DocumentVO,
  YearOptionVO
} from '~/types/document'
import {CmsCategoryApi} from "~/api/category";
import {fileSizeFormatter, formatCount} from "~/utils";


definePageMeta({
  layout: 'default'
})

useHead({
  title: '文档下载 - 学次元在线题库'
})

/* ==================== 状态定义 ==================== */
const authStore = useAuthStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const {openModal} = useModal()

/* 大类筛选 */
const activeMajor = ref<number>()
/* 考试类型筛选 */
const activeExamType = ref<number>(0)
/* 年份筛选 */
const yearOptions = ref<YearOptionVO[]>([])
const activeYear = ref<number>()

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

/* 查询参数 */
const queryParams = reactive({
  pageNo: 1,
  pageSize: 12,
  catalogId: undefined as number | undefined,
  tags: [],
  sort: 'comprehensive' as string | undefined,
  keyword: undefined as string | undefined,
})

/* ==================== 方法定义 ==================== */

/* 获取大类列表 */
const {data: categories} = await CmsCategoryApi.getCategoryList()
const {data: hotDocuments} = await useAsyncData(
    async () => {
      const data = await DocumentApi.getDocumentList({
        pageNo: 1,
        pageSize: 6
      })
      return data.list
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
    const data = await DocumentApi.getYearOptions()
    yearOptions.value = [{ id: 0, word: undefined }, ...data]
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
  if(activeYear.value){
    queryParams.tags = [activeYear.value]
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
  queryParams.sort = activeSort.value
  queryParams.pageNo = 1
  fetchDocumentList()
}

/* 查看详情 */
const handleViewDetail = (id: number) => {
  navigateTo(`/document/${id}`)
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
                      v-for="(catalog, index) in categories" :key="index"
                    :class="activeMajor === catalog.id
                      ? 'bg-(--color-btn-primary) text-white'
                      : 'text-(--color-text-secondary) hover:text-(--color-btn-primary)'
                    "
                    class="px-3 py-1 text-sm rounded-full transition-all duration-200"
                    @click="handleMajorChange(catalog.id)"
                  >
                    {{ catalog.name }}
                  </button>
                </div>
              </div>

              <!-- 考试 -->
              <div class="flex items-start gap-3">
                <span class="text-sm font-medium text-(--color-text-secondary) pt-1.5 shrink-0 w-12">考试</span>
                <div class="flex items-center gap-2 flex-wrap">
                  <button
                    :class="activeExamType === 0
                      ? 'bg-(--color-btn-primary) text-white'
                      : 'text-(--color-text-secondary) hover:text-(--color-btn-primary)'
                    "
                    class="px-3 py-1 text-sm rounded-full transition-all duration-200"
                    @click="handleExamTypeChange(0)"
                  >
                    全部
                    </button>
                  <button
                    v-for="exam in subCategories"
                    :key="exam.id"
                    :class="activeExamType === exam.id
                      ? 'bg-(--color-btn-primary) text-white'
                      : 'text-(--color-text-secondary) hover:text-(--color-btn-primary)'
                    "
                    class="px-3 py-1 text-sm rounded-full transition-all duration-200"
                    @click="handleExamTypeChange(exam.id)"
                  >
                    {{ exam.name }}
                  </button>
                </div>
              </div>

<!--              &lt;!&ndash; 等级 &ndash;&gt;-->
<!--              <div class="flex items-start gap-3">-->
<!--                <span class="text-sm font-medium text-(&#45;&#45;color-text-secondary) pt-1.5 shrink-0 w-12">等级</span>-->
<!--                <div class="flex items-center gap-2 flex-wrap">-->
<!--                  <button-->
<!--                    v-for="level in levelOptions"-->
<!--                    :key="level.value"-->
<!--                    :class="activeLevel === level.value-->
<!--                      ? 'bg-(&#45;&#45;color-btn-primary) text-white'-->
<!--                      : 'text-(&#45;&#45;color-text-secondary) hover:text-(&#45;&#45;color-btn-primary)'-->
<!--                    "-->
<!--                    class="px-3 py-1 text-sm rounded-full transition-all duration-200"-->
<!--                    @click="handleLevelChange(level.value)"-->
<!--                  >-->
<!--                    {{ level.label }}-->
<!--                  </button>-->
<!--                </div>-->
<!--              </div>-->

<!--              &lt;!&ndash; 类型 &ndash;&gt;-->
<!--              <div class="flex items-start gap-3">-->
<!--                <span class="text-sm font-medium text-(&#45;&#45;color-text-secondary) pt-1.5 shrink-0 w-12">类型</span>-->
<!--                <div class="flex items-center gap-2 flex-wrap">-->
<!--                  <button-->
<!--                    v-for="type in materialTypes.slice(0, 8)"-->
<!--                    :key="type.value"-->
<!--                    :class="activeMaterialType === type.value-->
<!--                      ? 'bg-(&#45;&#45;color-btn-primary) text-white'-->
<!--                      : 'text-(&#45;&#45;color-text-secondary) hover:text-(&#45;&#45;color-btn-primary)'-->
<!--                    "-->
<!--                    class="px-3 py-1 text-sm rounded-full transition-all duration-200"-->
<!--                    @click="handleMaterialTypeChange(type.value)"-->
<!--                  >-->
<!--                    {{ type.label }}-->
<!--                  </button>-->
<!--                </div>-->
<!--              </div>-->

<!--              &lt;!&ndash; 状态 &ndash;&gt;-->
<!--              <div class="flex items-start gap-3">-->
<!--                <span class="text-sm font-medium text-(&#45;&#45;color-text-secondary) pt-1.5 shrink-0 w-12">状态</span>-->
<!--                <div class="flex items-center gap-2 flex-wrap">-->
<!--                  <button-->
<!--                    v-for="status in statusOptions"-->
<!--                    :key="status.value"-->
<!--                    :class="activeStatus === status.value-->
<!--                      ? 'bg-(&#45;&#45;color-btn-primary) text-white'-->
<!--                      : 'text-(&#45;&#45;color-text-secondary) hover:text-(&#45;&#45;color-btn-primary)'-->
<!--                    "-->
<!--                    class="px-3 py-1 text-sm rounded-full transition-all duration-200"-->
<!--                    @click="handleStatusChange(status.value)"-->
<!--                  >-->
<!--                    {{ status.label }}-->
<!--                  </button>-->
<!--                </div>-->
<!--              </div>-->
            </div>

            <!-- 搜索和排序 -->
            <div class="px-5 py-3 bg-gray-50 border-t border-(--color-border) flex items-center justify-between">
              <div class="flex items-center gap-3">
                <el-select v-model="activeSort" size="small" class="!w-28" @change="handleSortChange">
                  <el-option
                    v-for="opt in sortOptions"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value"
                  />
                </el-select>
                <el-select v-model="activeYear" size="small" class="!w-28" placeholder="全部年份" @change="handleYearChange">
                  <el-option
                    v-for="year in yearOptions"
                    :key="year.id"
                    :label="year.word ? year.word + '年' : '全部年份'"
                    :value="year.id"
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
                      <span>{{ fileSizeFormatter(doc.fileSize) }}</span>
                      <span>下载数: {{ formatCount(doc.downloadCount) }}</span>
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
              v-model:current-page="queryParams.pageNo"
              :page-size="queryParams.pageSize"
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
          <ClientOnly>
            <template v-if="authStore.isLogin">
              <div class="bg-white rounded-xl shadow-sm border border-(--color-border) p-4">
                <!-- 用户基本信息 -->
                <div class="flex items-center gap-3">
                  <el-avatar :size="48" :src="user?.avatar" class="shrink-0" />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <span class="font-medium text-(--color-text-primary) truncate">{{ user?.nickname || '新用户' }}</span>
                    </div>
                    <div class="flex items-center gap-2 mt-1">
                      <el-tag size="small" type="primary" effect="plain">
                        {{ user?.level?.name || '普通会员' }}
                      </el-tag>
                    </div>
                  </div>
                </div>
                <!-- 积分/下载币信息 -->
                <div class="mt-4 grid grid-cols-2 gap-2">
                  <div class="bg-gray-50 rounded-lg p-3 text-center">
                    <div class="text-lg font-bold text-(--color-btn-primary)">{{ user?.point || 0 }}</div>
                    <div class="text-xs text-(--color-text-secondary) mt-0.5">我的积分</div>
                  </div>
                  <div class="bg-gray-50 rounded-lg p-3 text-center">
                    <div class="text-lg font-bold text-orange-500">{{ user?.experience || 0 }}</div>
                    <div class="text-xs text-(--color-text-secondary) mt-0.5">我的经验</div>
                  </div>
                </div>
                <!-- 快捷入口 -->
                <div class="mt-4 pt-4 border-t border-(--color-border)">
                  <div class="grid grid-cols-3 gap-2">
                    <a href="/account/profile" class="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <Icon name="ep:user-filled" class="text-xl text-(--color-btn-primary)" />
                      <span class="text-xs text-(--color-text-secondary)">个人中心</span>
                    </a>
                    <a href="/account/favorites" class="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <Icon name="ep:star-filled" class="text-xl text-yellow-500" />
                      <span class="text-xs text-(--color-text-secondary)">我的收藏</span>
                    </a>
                    <a href="/account/orders" class="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <Icon name="ep:shopping-cart" class="text-xl text-green-500" />
                      <span class="text-xs text-(--color-text-secondary)">我的订单</span>
                    </a>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="bg-white rounded-xl shadow-sm border border-(--color-border) p-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Icon name="ep:user" class="text-xl text-blue-500" />
                    </div>
                    <span class="font-medium text-(--color-text-primary) cursor-pointer hover:text-(--color-btn-primary) transition-colors" @click="openModal('login')">立即登录</span>
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
            </template>
          </ClientOnly>

          <!-- 下载币 -->
<!--          <div class="bg-white rounded-xl shadow-sm border border-(&#45;&#45;color-border) p-4">-->
<!--            <div class="flex items-center gap-2 mb-3">-->
<!--              <span class="font-medium text-(&#45;&#45;color-text-primary)">获取更多下载币</span>-->
<!--              <Icon name="material-symbols:coin" class="text-yellow-500 text-xl" />-->
<!--            </div>-->
<!--            <div class="space-y-3">-->
<!--              <div class="flex items-center justify-between">-->
<!--                <div class="flex items-center gap-2">-->
<!--                  <Icon name="ep:user" class="text-(&#45;&#45;color-text-secondary)" />-->
<!--                  <span class="text-sm text-(&#45;&#45;color-text-secondary)">邀请好友得30下载币</span>-->
<!--                </div>-->
<!--                <button class="px-3 py-1 text-xs text-(&#45;&#45;color-btn-primary) border border-(&#45;&#45;color-btn-primary) rounded-full hover:bg-(&#45;&#45;color-btn-primary) hover:text-white transition-colors">-->
<!--                  邀请好友-->
<!--                </button>-->
<!--              </div>-->
<!--              <div class="flex items-center justify-between">-->
<!--                <div class="flex items-center gap-2">-->
<!--                  <Icon name="ep:document" class="text-(&#45;&#45;color-text-secondary)" />-->
<!--                  <span class="text-sm text-(&#45;&#45;color-text-secondary)">兑换下载币</span>-->
<!--                </div>-->
<!--                <button class="px-3 py-1 text-xs text-(&#45;&#45;color-btn-primary) border border-(&#45;&#45;color-btn-primary) rounded-full hover:bg-(&#45;&#45;color-btn-primary) hover:text-white transition-colors">-->
<!--                  去兑换-->
<!--                </button>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->

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
                    <span>下载数: {{ formatCount(doc.downloadCount) }}</span>
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
