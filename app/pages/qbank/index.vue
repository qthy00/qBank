<script setup lang="ts">
import {questionApi} from '~/api/qbank'
import type {CategoryWithChildren} from '~/api/qbank/mock'
import {CmsCategoryApi} from "~/api/category";

/**
 * 题库封面页 - 左右分栏布局
 * 左侧：一级分类导航
 * 右侧：二级分类卡片网格
 */

/* ==================== 页面元数据 ==================== */

useHead({
  title: '智慧题库',
  meta: [
    { name: 'description', content: '海量题库资源，覆盖各类职业资格考试', tagPriority: 1 }
  ]
})

/* ==================== 状态定义 ==================== */

const router = useRouter()
const message = useMessage()

/* 当前选中的一级分类 */
const activeCategoryId = ref<number | null>(null)

/* ==================== 数据获取 ==================== */

// const { data: categories, pending: loading, error } = await useAsyncData(
//     'qbank-cover-categories',
//     async () => {
//       const {mockCategoriesWithChildren} = await import('~/api/qbank/mock')
//       return mockCategoriesWithChildren as CategoryWithChildren[]
//     },
//     {
//       server: false,
//       default: () => [],
//     }
// )
const iconList = ["jz", "ck", "jr", "yl", "kg", "zige", "zc", "sh", "xl", "wy"]

const {data: categories, pending: loading, error} = await CmsCategoryApi.getCategoryList()

/* ==================== 计算属性 ==================== */

/**
 * 当前选中的分类
 */
const activeCategory = computed(() => {
  if (!activeCategoryId.value) return null
  return categories.value?.find(c => c.id === activeCategoryId.value) || null
})

/**
 * 当前展示的子分类列表
 */
const displaySubCategories = computed(() => {
  if (!categories.value) return []

  if (activeCategory.value) {
    return activeCategory.value.children || []
  }

  /* 未选择时展示所有子分类 */
  return categories.value.flatMap(c =>
      (c.children || []).map(child => ({
        ...child,
        parentName: c.name,
        parentIcon: c.icon ?? 'ep:menu',
        parentId: c.id
      }))
  )
})

/**
 * 获取总题库数量
 */
const totalQbanks = computed(() => {
  return categories.value?.reduce((sum, cat) => {
    const childrenCount = cat.children?.reduce((s, child) => s + (child.count || 0), 0) || 0
    return sum + childrenCount
  }, 0) || 0
})

/* ==================== 方法定义 ==================== */

const handleCategoryChange = (categoryId: number | null) => {
  activeCategoryId.value = categoryId
}

const goToSubCategory = (parentId: number, subCategoryId: number, subCategoryName: string) => {
  router.push({
    path: '/qbank',
    query: {
      categoryId: parentId.toString(),
      subjectId: subCategoryId.toString(),
      subjectName: subCategoryName
    }
  })
}

const goToQbankList = () => {
  if (activeCategory.value) {
    router.push({
      path: '/qbank',
      query: { categoryId: activeCategory.value.id.toString() }
    })
  } else {
    router.push('/qbank')
  }
}

/* ==================== 错误处理 ==================== */

if (error.value) {
  console.error('加载分类失败:', error.value)
  message.error('加载分类失败')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
    <!-- 菜单部分 -->
    <MainMenu/>
    <!-- Hero 区域 -->
    <div class="container relative overflow-hidden">
      <!-- 背景装饰 -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"/>
        <div class="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-200/20 to-blue-200/20 rounded-full blur-3xl"/>
      </div>

      <div class="relative container mx-auto px-4 py-12">
        <div class="text-center max-w-3xl mx-auto">
          <!-- 标题 -->
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-medium mb-4">
            <Icon name="ep:collection" class="text-base"/>
            <span>专业题库平台</span>
          </div>
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            智慧题库
            <span class="text-[var(--color-primary)]">中心</span>
          </h1>
          <p class="text-lg text-gray-600 mb-8">
            海量题库资源，覆盖 <span class="font-semibold text-[var(--color-primary)]">{{ categories?.length || 0 }}</span> 大分类，
            <span class="font-semibold text-[var(--color-primary)]">{{ totalQbanks }}</span>+ 套精选题库，助力高效备考
          </p>
        </div>
      </div>
    </div>

    <!-- 主体内容区域 -->
    <div class="container mt-4 mx-auto px-4 pb-16">
      <div class="flex gap-6">
        <!-- 左侧分类导航 -->
        <div class="w-72 shrink-0">
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-4">
            <!-- 标题 -->
            <div class="px-5 py-4 border-b border-gray-100">
              <h2 class="font-bold text-gray-900 flex items-center gap-2">
                <Icon name="ep:menu" class="text-[var(--color-primary)]"/>
                题库分类
              </h2>
            </div>

            <!-- 分类列表 -->
            <div class="p-3">
              <!-- 全部 -->
              <div
                  class="flex items-center gap-3 px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-200 mb-1"
                  :class="activeCategoryId === null
                    ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]/80 text-white shadow-md shadow-[var(--color-primary)]/20'
                    : 'hover:bg-gray-50 text-gray-700'"
                  @click="handleCategoryChange(null)"
              >
                <div
                    class="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                    :class="activeCategoryId === null ? 'bg-white/20' : 'bg-[var(--color-primary)]/10'"
                >
                  <Icon
                      name="ep:grid"
                      class="text-lg"
                      :class="activeCategoryId === null ? 'text-white' : 'text-[var(--color-primary)]'"
                  />
                </div>
                <div class="flex-1">
                  <div class="font-medium">全部题库</div>
                  <div
                      class="text-xs"
                      :class="activeCategoryId === null ? 'text-white/70' : 'text-gray-400'"
                  >
                    {{ totalQbanks }} 套题库
                  </div>
                </div>
                <Icon
                    name="ep:arrow-right-bold"
                    class="text-sm transition-opacity"
                    :class="activeCategoryId === null ? 'text-white opacity-100' : 'text-gray-300 opacity-0'"
                />
              </div>

              <!-- 分类项 -->
              <div
                  v-for="(cat, index) in categories"
                  :key="cat.id"
                  class="flex items-center gap-3 px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-200 mb-1 group"
                  :class="activeCategoryId === cat.id
                    ? 'bg-gradient-to-r from-[var(--color-btn-primary)] to-[var(--color-btn-hover-90)] text-white shadow-md shadow-[var(--color-primary)]/20'
                    : 'hover:bg-gray-50 text-gray-700'"
                  @click="handleCategoryChange(cat.id)"
              >
                <div
                    class="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                    :class="activeCategoryId === cat.id ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-[var(--color-primary)]/10'"
                >
                  <i :class="`hy-ico-${iconList[index]}`" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-medium truncate">{{ cat.name }}</div>
                  <div
                      class="text-xs"
                      :class="activeCategoryId === cat.id ? 'text-white/70' : 'text-gray-400'"
                  >
                    {{ cat.children?.length || 0 }} 个子分类
                  </div>
                </div>
                <Icon
                    name="ep:arrow-right-bold"
                    class="text-sm transition-all"
                    :class="activeCategoryId === cat.id ? 'text-white opacity-100 translate-x-0' : 'text-gray-300 opacity-0 -translate-x-2'"
                />
              </div>
            </div>

            <!-- 底部统计 -->
            <div class="px-5 py-4 bg-gray-50/80 border-t border-gray-100">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">题库总数</span>
                <span class="font-bold text-[var(--color-primary)]">{{ totalQbanks }}+</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧内容区 -->
        <div class="flex-1 min-w-0">
          <div v-loading="loading" class="min-h-[600px]">
            <template v-if="displaySubCategories.length > 0">
              <!-- 头部信息 -->
              <div class="flex items-center justify-between mb-6">
                <div>
                  <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <template v-if="activeCategory">
                      <Icon :name="activeCategory.icon" class="text-[var(--color-primary)]"/>
                      {{ activeCategory.name }}
                    </template>
                    <template v-else>
                      <Icon name="ep:grid" class="text-[var(--color-primary)]"/>
                      全部题库
                    </template>
                  </h2>
                  <p class="text-gray-500 mt-1">
                    共 {{ displaySubCategories.length }} 个子分类
                  </p>
                </div>

                <!-- 快捷操作 -->
                <div class="flex items-center gap-3">
                  <el-button
                      type="primary"
                      plain
                      round
                      @click="goToQbankList"
                  >
                    <Icon name="ep:list" class="mr-1"/>
                    查看列表
                  </el-button>
                </div>
              </div>

              <!-- 二级分类卡片网格 -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <div
                    v-for="(sub, index) in displaySubCategories"
                    :key="sub.id"
                    class="group relative bg-white rounded-2xl p-5 border border-gray-100 hover:border-[var(--color-primary)]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--color-primary)]/5 cursor-pointer overflow-hidden"
                    :class="{ 'opacity-0': false }"
                    @click="goToSubCategory(sub.parentId || activeCategory?.id || 0, sub.id, sub.name)"
                >
                  <!-- 背景装饰 -->
                  <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>

                  <!-- 图标 -->
                  <div class="relative mb-4">
                    <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-primary)]/5 flex items-center justify-center group-hover:scale-110 group-hover:from-[var(--color-primary)]/20 group-hover:to-[var(--color-primary)]/10 transition-all duration-300">
                      <Icon
                          :name="sub.parentIcon || activeCategory?.icon || 'ep:folder'"
                          class="text-2xl text-[var(--color-primary)]"
                      />
                    </div>
                    <!-- 数量徽章 -->
                    <div class="absolute -top-1 -right-1 px-2 py-0.5 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-sm">
                      {{ sub.count || 0 }}
                    </div>
                  </div>

                  <!-- 内容 -->
                  <h3 class="font-bold text-gray-900 mb-1 group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">
                    {{ sub.name }}
                  </h3>
                  <p class="text-sm text-gray-500 mb-4">
                    {{ sub.count || 0 }} 套精选题库
                  </p>

                  <!-- 操作按钮 -->
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-400 flex items-center gap-1">
                      <Icon name="ep:folder-opened" class="text-xs"/>
                      {{ sub.parentName || activeCategory?.name || '全部' }}
                    </span>
                    <div class="flex items-center text-[var(--color-primary)] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                      进入
                      <Icon name="ep:arrow-right" class="ml-1"/>
                    </div>
                  </div>

                  <!-- 悬停边框效果 -->
                  <div class="absolute inset-0 rounded-2xl border-2 border-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"/>
                </div>
              </div>

              <!-- 快速入口 - 仅在选中分类时显示 -->
              <div v-if="activeCategory" class="mt-10">
                <div class="bg-gradient-to-r from-[var(--color-primary)]/5 to-purple-500/5 rounded-2xl p-6 border border-[var(--color-primary)]/10">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                      <div class="w-14 h-14 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        <Icon :name="activeCategory.icon" class="text-2xl text-[var(--color-primary)]"/>
                      </div>
                      <div>
                        <h3 class="font-bold text-gray-900">探索更多 {{ activeCategory.name }} 题库</h3>
                        <p class="text-gray-500 text-sm">查看该分类下的所有题库资源</p>
                      </div>
                    </div>
                    <el-button
                        type="primary"
                        size="large"
                        round
                        class="shadow-lg shadow-[var(--color-primary)]/30"
                        @click="goToQbankList"
                    >
                      查看全部
                      <Icon name="ep:arrow-right" class="ml-1"/>
                    </el-button>
                  </div>
                </div>
              </div>
            </template>

            <!-- 空状态 -->
            <el-empty
                v-else
                description="暂无分类数据"
                class="py-20"
            >
              <el-button type="primary" @click="handleCategoryChange(null)">
                查看全部
              </el-button>
            </el-empty>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
