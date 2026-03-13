<script setup lang="ts">
import {type Chapter, questionApi} from '~/api/qbank'
import type {ChapterVO} from '~/types/qbank'
import type {examsItemVO, PaperInfo, StudyMaterial, PracticeMode} from '~/types/qBank/examInfo'
import {CmsCategoryApi} from "~/api/category"
import type {QbankDetailVO} from "~/types/qBank"

/**
 * 题库详情页 - 重构版
 * 参考设计图中的布局和样式
 */
/* ==================== 页面元数据 ==================== */
const route = useRoute()
const qbankId = computed(() => Number(route.params.id))

/* ==================== 模拟数据（根据图片设计） ==================== */
const examData = ref<examsItemVO>({
  id: qbankId.value,
  name: '一级建造师',
  image: '/images/exam1.jpg',
  daysLeft: 57,
  examDate: '2023-11-05',
  subjects: [
    {
      id: 1,
      name: '建筑工程管理与实务',
      alias: '建筑实务',
      totalQuestions: 300,
      completedQuestions: 0,
      progress: 0,
      chapters: []
    },
    {
      id: 2,
      name: '建设工程法规及相关知识',
      alias: '法规',
      totalQuestions: 300,
      completedQuestions: 0,
      progress: 0,
      chapters: []
    },
    {
      id: 3,
      name: '建设工程项目管理',
      alias: '管理',
      totalQuestions: 300,
      completedQuestions: 0,
      progress: 0,
      chapters: []
    },
    {id: 4, name: '建设工程经济', alias: '经济', totalQuestions: 300, completedQuestions: 0, progress: 0, chapters: []},
  ],
  news: [
    {title: '希赛荣获2024年度项目管理优秀合作培训机构奖', publishDate: '2023-07-10', source: '中国人事考试网'},
    {title: '2024年一级建造师考试大纲解读', publishDate: '2023-07-10', source: '中国人事考试网'},
    {title: '住建部发布新版《建造师职业资格制度规定》，2023年10...', publishDate: '2023-07-10', source: '中国人事考试网'},
    {title: '2023年一级建造师考试报名入口今日开通，这些事项需注意', publishDate: '2023-07-10', source: '中国人事考试网'},
    {title: '2023年一级建造师考试大纲修订', publishDate: '2023-07-10', source: '中国人事考试网'},
  ],
  materials: [
    {title: '一级建造师题库', image: '/images/material1.jpg'},
    {title: '高频考点精讲', image: '/images/material2.jpg'},
    {title: '历年真题解析', image: '/images/material3.jpg'},
  ],
  questionBanks: ['章节练习', '历年真题', '高频考点', '模拟试卷'],
  registrationItems: [
    {tag: '考试介绍', url: '/'},
    {tag: '报考指南', url: '/'},
    {tag: '报名指引', url: '/'},
    {tag: '常见问题', url: '/'},
  ],
  examItems: [
    {tag: '视频课程', url: '/'},
    {tag: '章节练习', url: '/'},
    {tag: '模拟考试', url: '/'},
    {tag: '历年真题', url: '/'},
  ],
  scoreItems: [
    {tag: '查询成绩', url: '/'},
    {tag: '合格标准', url: '/'},
  ],
  recommendedPapers: [
    {id: 1, title: '2023年一级建造师模拟试卷（一）', duration: 120, questionCount: 100, examCount: 12345, rating: 3},
    {id: 2, title: '2022年一级建造师真题试卷', duration: 120, questionCount: 100, examCount: 128000, rating: 3},
  ],
  studyMaterials: [
    {id: 1, title: '2023年一级建造师考试大纲解析', publishDate: '2023-03-15', fileSize: '2.4MB', fileType: 'word'},
    {id: 2, title: '2023年一级建造师考试大纲解析', publishDate: '2023-03-15', fileSize: '2.4MB', fileType: 'ppt'},
    {id: 3, title: '2023年一级建造师考试大纲解析', publishDate: '2023-03-15', fileSize: '2.4MB', fileType: 'excel'},
    {id: 4, title: '2023年一级建造师考试大纲解析', publishDate: '2023-03-15', fileSize: '2.4MB', fileType: 'pdf'},
  ],
})


useHead({
  title: computed(() => examData.value?.name ? `${examData.value.name} - 题库详情` : '题库详情'),
  meta: [
    {
      name: 'description',
      content: computed(() => examData.value?.name ? `${examData.value.name}在线题库，提供章节练习、历年真题、模拟试卷、每日一练等多种练习模式` : '题库详情页面')
    }
  ]
})

/* ==================== 数据获取 ==================== */
const categories = ref()
const qbankDetail = ref<QbankDetailVO | null>(null)

/* 获取题库详情 */
const loadQbankDetail = async () => {
  try {
    qbankDetail.value = await questionApi.getQbankDetail(qbankId.value)
  } catch (err) {
    console.log('获取题库详情失败', err)
  }
}

const {data: category} = await CmsCategoryApi.getCategory(qbankId.value, true)
const {data: subjects} = await questionApi.getSubjectList(qbankId.value, true)
console.log('subjects===', subjects.value)
const {data: accessData} = await useAsyncData(
    () => `qbank-access-${qbankId.value}`,
    () => questionApi.checkQbankAccess(qbankId.value),
    {
      server: false,
      default: () => ({qbankId: qbankId.value, hasAccess: false, accessType: 'free'}),
      watch: [qbankId],
    }
)

/* ==================== 状态定义 ==================== */
const authStore = useAuthStore()
const {openModal} = useModal()
const message = useMessage()
const isOpen = ref(false)
const {isLogin} = storeToRefs(authStore)

/* 当前选中的科目 */
const activeSubjectId = ref<number>(0)
/* 展开的章节 */
const expandedChapters = ref<number[]>([])


/* 练习模式 */
const practiceModes: PracticeMode[] = [
  {key: 'chapter', name: '章节练习', icon: 'ep:document', url: '#'},
  {key: 'past', name: '历年真题', icon: 'ep:timer', url: '#'},
  {key: 'mock', name: '模拟试卷', icon: 'ep:copy-document', url: '#'},
  {key: 'daily', name: '每日一练', icon: 'ep:calendar', url: '#'},
]

/* 章节数据（从题库详情获取） */
const chaptersData = ref<ChapterVO[]>([])
const loadingChapter = ref(false)

/* ==================== 计算属性 ==================== */
const hasAccess = computed(() => {
  /* 免费题库直接有权限 */
  if (qbankDetail.value?.price === 0) return true
  /* 已购买的题库有权限 */
  if (qbankDetail.value?.isPurchased) return true
  /* 否则使用 accessData 的判断 */
  return accessData.value?.hasAccess || false
})

/* ==================== 方法定义 ==================== */
const toggleOpen = () => {
  isOpen.value = !isOpen.value;
}

const handleClickOutside = (e) => {
  const container = document.getElementById('hy-container');
  // 只有打开状态 + 点击容器外部才关闭
  if (isOpen.value && container && !container.contains(e.target)) {
    isOpen.value = false;
  }
};

const goBack = () => {
  navigateTo('/qbank')
}
const loadCategoryData = async (categoryId: number) => {
  categories.value = await CmsCategoryApi.getCategoryListCustom({
    level: 'Last',
    id: categoryId,
  })
}

const handleCategoryChange = (categoryId: number) => {
  navigateTo(`/qbank/${categoryId}`)
}

const loadSubjects = async () => {
  // console.log('loadSubjects', categoryId)
  try {
    subjects.value = await questionApi.getSubjectList(qbankId.value)
    activeSubjectId.value = subjects.value[0].id || 0
    await loadChapters()
  } catch (err) {
    console.log(err)
  }
}

const handleSubjectChange = async (subjectId: number) => {
  activeSubjectId.value = subjectId
  await loadChapters()
}

const loadChapters = async () => {
  // console.log('loadChapters', activeSubjectId.value)
  if (!activeSubjectId.value) return
  if (!isLogin.value) {
    openModal('login')
    return
  }
  chaptersData.value = []
  try {
    loadingChapter.value = true
    const data: Chapter[] = await questionApi.getChapterList(activeSubjectId.value)
    chaptersData.value = data.map((item) => {
      return {
        ...item,
        completedCount: item.completedCount > item.total ? item.total : item.completedCount,
        isCompleted: item.completedCount >= item.total && item.total > 0,
        completionRate: item.completedCount
            ? Math.round((item.completedCount / item.total) * 100)
            : 0,
      }
    })
  } catch (err) {
    console.log(err)
  } finally {
    loadingChapter.value = false
  }
}

const toggleChapter = (chapterId: number) => {
  const index = expandedChapters.value.indexOf(chapterId)
  if (index > -1) {
    expandedChapters.value.splice(index, 1)
  } else {
    expandedChapters.value.push(chapterId)
  }
}

const handlePractice = (mode: PracticeMode) => {
  if (!hasAccess.value && (qbankDetail.value?.price || 0) > 0) {
    message.warning('请先购买题库')
    return
  }
  // navigateTo(`/practice/${qbankId.value}?mode=${mode.key}`)
}

const handleChapterPractice = (chapter: ChapterVO) => {
  if (!hasAccess.value && (qbankDetail.value?.price || 0) > 0) {
    message.warning('请先购买题库')
    return
  }
  navigateTo(`/practice/chapter?chapterId=${chapter.id}`)
}

const handleStartPaper = (paper: PaperInfo) => {
  if (!hasAccess.value && (qbankDetail.value?.price || 0) > 0) {
    message.warning('请先购买题库')
    return
  }
  navigateTo(`/paper/${paper.id}`)
}

const handleDownloadMaterial = (material: StudyMaterial) => {
  message.info(`开始下载: ${material.title}`)
}

const handlePurchase = () => {
  if (!isLogin.value) {
    openModal('login')
    return
  }
  /* TODO: 跳转到支付页面 */
  message.info('正在跳转到支付页面...')
  /* 示例：导航到支付页面 */
  // navigateTo(`/payment?qbankId=${qbankId.value}`)
}

const handlePurchasePrompt = () => {
  if (!isLogin.value) {
    openModal('login')
    return
  }
  if ((qbankDetail.value?.price || 0) === 0) {
    message.info('登录后即可免费使用')
  } else {
    message.warning('请先购买题库以解锁练习功能')
  }
}

const handleFreeAccess = () => {
  if (!isLogin.value) {
    openModal('login')
    return
  }
  message.success('免费题库已解锁！')
  /* 刷新页面以更新权限状态 */
  window.location.reload()
}

const getFileIconClass = (fileType: string) => {
  const map: Record<string, string> = {
    'word': 'file-word',
    'ppt': 'file-powerpoint',
    'excel': 'file-excel',
    'pdf': 'file-pdf',
  }
  return map[fileType] || 'document'
}

const getFileIconColor = (fileType: string) => {
  const map: Record<string, string> = {
    'word': '#2b579a',
    'ppt': '#d24726',
    'excel': '#217346',
    'pdf': '#e74c3c',
  }
  return map[fileType] || '#666'
}

/* ==================== 初始化 ==================== */
onMounted(async () => {
  await loadQbankDetail()
  if (category.value) {
    await loadCategoryData(category.value.parentId)
  }
  if (subjects.value?.length > 0) {
    activeSubjectId.value = subjects.value[0].id || 0
    await loadChapters()
  } else {
    await loadSubjects()
  }

  document.addEventListener('click', handleClickOutside);
})
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

</script>

<template>
  <div class="min-h-screen bg-[var(--color-bg-page)]">
    <!-- 菜单部分 -->
    <MainMenu/>
    <!-- 腰线 -->
    <div class="relative h-32 ">
      <div id="hy-container" class="container mx-auto relative h-full">
        <div class="flex gap-5 whitespace-nowrap h-full relative bg-(--color-nav-bg)">

          <!-- 题库类型 -->
          <div
              class="group flex items-center gap-1 p-3 z-50 cursor-pointer text-(--color-nav-text) "
              @click="toggleOpen"
          >
            <i class="hy-ico-qh ic-20  group-hover:scale-120 transition-transform duration-300 ease-out"></i>
            <span class="font-bold font-semibold">{{ category?.name }}</span>
          </div>

          <!-- 分割线 -->
          <div id="anchor" class="relative flex items-center ">
            <span class="h-2/3 border-solid border-r border-(--color-border)"></span>
          </div>

          <!-- 弹出浮层区域，仅替代右侧内容区域 -->
          <template v-if="isOpen">
            <div class="relative z-40 flex-1 h-full">
              <div
                  class="absolute left-0 top-0 w-full h-full bg-(--color-nav-mask) text-(--color-bg-container) p-2
                transition-all duration-300 ease-in-out transform
                overflow-y-auto "
                  :class="{
                'opacity-0 scale-95 pointer-events-none': !isOpen,
                'opacity-100 scale-100 pointer-events-auto': isOpen
                }"

              >
                <div class="flex gap-3 flex-wrap">
                  <el-button
                      v-for="cat in categories" :key="cat.id"
                      plain
                      type="primary"
                      @click="handleCategoryChange(cat.id)"
                      class="px-3 py-1 bg-(--color-btn-primary) rounded-lg hover:bg-(--color-btn-hover) transition">
                    {{ cat.name }}
                  </el-button>
                </div>
              </div>
            </div>
          </template>
          <!-- 剩余原有内容：点击时隐藏 -->
          <template v-else>
            <div class="flex flex-1/12 flex-col justify-center items-center p-5 text-(--color-nav-text)">
              <span class="mb-2">距离考试时间</span>
              <div class="flex items-center gap-3">
                <span>剩</span>
                <span class="py-1 px-5 rounded-4 bg-(--color-btn-primary) text-(--color-disabled) text-xl">{{
                    examData.daysLeft
                  }}</span>
                <span class="">天</span>
              </div>
            </div>

            <!-- 分割线 -->
            <div class="relative flex items-center">
              <span class="h-2/3 border-solid border-r border-(--color-border)"></span>
            </div>

            <!-- 报考指南 -->
            <div class="flex flex-5/12 justify-around  gap-4 p-3 pt-6 pb-6 text-(--color-nav-text)">
              <div class="flex flex-col flex-wrap justify-center items-center md:flex sm:hidden">
                <i class="hy-ico-bkzn ic-26"></i>
                <span class="mt-2">报考指南</span>
              </div>

              <div class="flex flex-wrap content-center justify-around gap-2 max-h-[5rem] overflow-hidden">
                <a
                    v-for="item in examData.registrationItems"
                    :key="item.tag"
                    :href="item.url"
                    class="p-2 hover:text-(--color-nav-text-hover) line-clamp-2">
                  {{ item.tag }}
                </a>
              </div>
            </div>

            <!-- 分割线 -->
            <div class="relative flex items-center md:flex sm:hidden">
              <span class="h-2/3 border-solid border-r border-(--color-border)"></span>
            </div>

            <!-- 备考学习 -->
            <div class="flex flex-5/12 justify-around gap-4 p-3 pt-6 pb-6 text-(--color-nav-text)">
              <div class="flex flex-col flex-wrap justify-center items-center md:flex sm:hidden">
                <i class="hy-ico-beikao ic-26"></i>
                <span class="mt-2">备考学习</span>
              </div>
              <div class="flex flex-wrap content-center justify-between gap-2 max-h-[5rem] overflow-hidden">
                <a
                    v-for="item in examData.examItems"
                    :key="item.tag"
                    :href="item.url"
                    class="p-2 hover:text-(--color-nav-text-hover) line-clamp-2">
                  {{ item.tag }}
                </a>
              </div>
            </div>
          </template>

        </div>
      </div>
    </div>

    <!-- 主体内容区 -->
    <div class="container mx-auto px-4 py-6">
      <div class="flex gap-6">
        <!-- 左侧主内容区 -->
        <div class="flex-1">
          <!-- 返回按钮 -->
          <div class="mb-4">
            <el-button link @click="goBack">
              <Icon name="ep:arrow-left" class="mr-1"/>
              返回题库列表
            </el-button>
          </div>

          <!-- 科目选择区 -->
          <div class="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div class="flex items-center gap-3">
              <span
                  v-for="subject in subjects"
                  :key="subject.id"
                  class="px-4 py-2 rounded-full cursor-pointer transition-all border border-[var(--color-border)]"
                  :class="activeSubjectId === subject.id
                  ? 'bg-[var(--color-btn-primary)] text-white border-[var(--color-btn-primary)]'
                  : 'bg-white text-[var(--color-text-secondary)] hover:border-[var(--color-btn-primary)] hover:text-[var(--color-btn-primary)]'"
                  @click="handleSubjectChange(subject.id)"
              >
                {{ subject.aliasName }}
              </span>
            </div>
            <!--            <div class="mt-3 text-right text-sm">-->
            <!--              <span class="text-[var(&#45;&#45;color-text-secondary)]">找不到想要的题库？</span>-->
            <!--              <a href="#" class="text-[var(&#45;&#45;color-btn-primary)] hover:underline">点击反馈</a>-->
            <!--            </div>-->
          </div>

          <!-- 练习模式区 -->
          <div class="bg-white rounded-lg shadow-sm p-5 mb-4">
            <div class="flex items-center gap-4">
              <span class="text-[var(--color-text-primary)] font-medium whitespace-nowrap">练习模式：</span>
              <div class="flex gap-3 flex-1">
                <div
                    v-for="mode in practiceModes"
                    :key="mode.key"
                    class="flex-1 min-w-[80px] rounded-lg py-3 px-2 cursor-pointer transition-all group text-center"
                    :class="[
                    hasAccess
                      ? 'bg-[var(--color-btn-primary)] text-white hover:bg-[var(--color-btn-hover)]'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  ]"
                    @click="hasAccess ? handlePractice(mode) : handlePurchasePrompt()"
                >
                  <Icon :name="mode.icon"
                        class="text-2xl opacity-90 mb-1 group-hover:scale-110 transition-transform mx-auto block"/>
                  <span class="text-sm font-medium whitespace-nowrap">{{ mode.name }}</span>
                  <Icon
                      v-if="!hasAccess"
                      name="ep:lock"
                      class="text-xs ml-1"
                  />
                </div>
              </div>
            </div>
            <div v-if="!hasAccess" class="mt-3 text-center text-xs text-[var(--color-text-secondary)]">
              <span>{{
                  (qbankDetail?.price || 0) === 0 ? '登录后即可免费使用全部功能' : '购买题库后可解锁全部练习模式'
                }}</span>
              <el-button v-if="(qbankDetail?.price || 0) > 0" type="primary" link size="small" @click="handlePurchase">
                立即购买
              </el-button>
            </div>
          </div>

          <!-- 章节列表 -->
          <ClientOnly>
            <div class="bg-white rounded-lg shadow-sm p-6">
              <div v-loading="loadingChapter">
                <div
                    v-for="chapter in chaptersData"
                    :key="chapter.id"
                    class="border-b border-[var(--color-border)] last:border-b-0"
                >
                  <!-- 章节标题行 -->
                  <div
                      class="flex items-center justify-between py-4 cursor-pointer hover:bg-[var(--color-bg-container-hover)] transition-colors px-2 rounded"
                      @click="toggleChapter(chapter.id)"
                  >
                    <div class="flex items-center gap-2">
                      <Icon
                          name="ep:arrow-right-bold"
                          class="text-[var(--color-text-secondary)] transition-transform"
                      />
                      <!--                    <Icon-->
                      <!--                        name="ep:arrow-right-bold"-->
                      <!--                        class="text-[var(&#45;&#45;color-text-secondary)] transition-transform"-->
                      <!--                        :class="expandedChapters.includes(chapter.id) ? 'rotate-90' : ''"-->
                      <!--                    />-->
                      <span class="text-[var(--color-text-primary)] font-medium">{{ chapter.name }}</span>
                    </div>
                    <div class="flex items-center gap-4">
                      <!-- 进度条 -->
                      <div class="flex items-center gap-2">
                        <div class="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                              class="h-full bg-[var(--color-btn-primary)] rounded-full transition-all"
                              :style="{ width: `${((chapter.completedCount || 0) / (chapter.total || 1)) * 100}%` }"
                          />
                        </div>
                        <span class="text-sm text-[var(--color-text-secondary)]">
                        {{ chapter.completedCount || 0 }} / {{ chapter.total || 0 }}道
                      </span>
                      </div>
                      <el-button
                          type="primary"
                          size="small"
                          @click.stop="handleChapterPractice(chapter)"
                      >
                        开始做题
                      </el-button>
                    </div>
                  </div>

                  <!-- 子章节列表 -->
                  <!--                <div-->
                  <!--                  v-if="expandedChapters.includes(chapter.id) && chapter.sectionList && chapter.sectionList.length > 0"-->
                  <!--                  class="pl-8 pr-2 pb-2"-->
                  <!--                >-->
                  <!--                  <div-->
                  <!--                    v-for="section in chapter.sectionList"-->
                  <!--                    :key="section.id"-->
                  <!--                    class="flex items-center justify-between py-3 px-4 hover:bg-[var(&#45;&#45;color-bg-container-hover)] rounded transition-colors"-->
                  <!--                  >-->
                  <!--                    <div class="flex items-center gap-4">-->
                  <!--                      <span class="text-[var(&#45;&#45;color-text-secondary)]">{{ section.name }}</span>-->
                  <!--                      <span class="text-sm text-[var(&#45;&#45;color-text-secondary)]">-->
                  <!--                        {{ section.total || 0 }} 题-->
                  <!--                      </span>-->
                  <!--                    </div>-->
                  <!--                    <el-button-->
                  <!--                      type="primary"-->
                  <!--                      link-->
                  <!--                      size="small"-->
                  <!--                      @click="handleChapterPractice(chapter)"-->
                  <!--                    >-->
                  <!--                      开始练习-->
                  <!--                    </el-button>-->
                  <!--                  </div>-->
                  <!--                </div>-->
                </div>
              </div>
              <el-empty v-if="chaptersData.length === 0" description="暂无章节数据">
                <template #default>
                  <div class="text-center">
                    <Icon name="ep:lock" class="text-4xl text-[var(--color-text-secondary)] mb-2"/>
                    <p class="text-[var(--color-text-secondary)] mb-4">{{
                        hasAccess ? '暂无章节数据' : '购买后可查看全部章节'
                      }}</p>
                    <el-button
                        v-if="!hasAccess && (qbankDetail?.price || 0) > 0"
                        type="primary"
                        @click="handlePurchase"
                    >
                      <Icon name="ep:shopping-cart" class="mr-1"/>
                      立即购买
                    </el-button>
                    <el-button
                        v-else-if="!hasAccess && (qbankDetail?.price || 0) === 0"
                        type="success"
                        @click="handleFreeAccess"
                    >
                      <Icon name="ep:unlock" class="mr-1"/>
                      免费解锁
                    </el-button>
                  </div>
                </template>
              </el-empty>
            </div>
          </ClientOnly>
        </div>

        <!-- 右侧边栏 -->
        <div class="w-80 space-y-4">
          <!-- 题库购买信息 -->
          <div class="bg-white rounded-lg shadow-sm p-4 mt-8">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm text-[var(--color-text-secondary)]">题库状态</span>
              <el-tag
                  :type="hasAccess ? 'success' : 'warning'"
                  size="small"
              >
                {{ hasAccess ? '已购买' : '未购买' }}
              </el-tag>
            </div>

            <!-- 价格信息 -->
            <div v-if="!hasAccess && (qbankDetail?.price || 0) > 0" class="mb-4">
              <div class="flex items-baseline gap-2">
                <span class="text-2xl font-bold text-[var(--color-danger)]">
                  ¥{{ ((qbankDetail?.price || 0) / 100).toFixed(2) }}
                </span>
                <span v-if="(qbankDetail?.originalPrice || 0) > 0"
                      class="text-sm text-[var(--color-text-secondary)] line-through">
                  ¥{{ ((qbankDetail?.originalPrice || 0) / 100).toFixed(2) }}
                </span>
              </div>
              <div class="text-xs text-[var(--color-text-secondary)] mt-1">
                购买后可解锁全部章节练习
              </div>
            </div>

            <!-- 免费题库提示 -->
            <div v-else-if="!hasAccess && (qbankDetail?.price || 0) === 0" class="mb-4">
              <div class="text-lg font-bold text-[var(--color-success)]">
                免费题库
              </div>
              <div class="text-xs text-[var(--color-text-secondary)] mt-1">
                登录后即可免费使用全部功能
              </div>
            </div>

            <!-- 购买/使用按钮 -->
            <el-button
                v-if="!hasAccess && (qbankDetail?.price || 0) > 0"
                type="primary"
                size="large"
                class="w-full"
                @click="handlePurchase"
            >
              <Icon name="ep:shopping-cart" class="mr-1"/>
              立即购买
            </el-button>
            <el-button
                v-else-if="hasAccess"
                type="success"
                size="large"
                class="w-full"
                disabled
            >
              <Icon name="ep:check" class="mr-1"/>
              {{ (qbankDetail?.price || 0) === 0 ? '免费使用' : '已购买' }}
            </el-button>
          </div>

          <!-- 推荐试卷 -->
          <div class="bg-white rounded-lg shadow-sm p-4">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <div class="w-1 h-5 bg-[var(--color-btn-primary)] rounded-full"/>
                <h3 class="font-bold text-[var(--color-text-primary)]">推荐试卷</h3>
              </div>
              <a href="#"
                 class="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-btn-primary)] flex items-center gap-1">
                更多
                <Icon name="ep:arrow-right" class="text-xs"/>
              </a>
            </div>
            <div class="space-y-4">
              <div
                  v-for="paper in examData.recommendedPapers"
                  :key="paper.id"
                  class="border-b border-[var(--color-border)] last:border-b-0 pb-3 last:pb-0"
              >
                <h4 class="text-[var(--color-text-primary)] font-medium mb-2 line-clamp-2">{{ paper.title }}</h4>
                <div class="flex items-center gap-3 text-xs text-[var(--color-text-secondary)] mb-2">
                  <span class="flex items-center gap-1">
                    <Icon name="ep:timer"/> {{ paper.duration }}分钟
                  </span>
                  <span class="flex items-center gap-1">
                    <Icon name="ep:document"/> {{ paper.questionCount }}题
                  </span>
                  <span class="flex items-center gap-1">
                    <Icon name="ep:user"/> {{
                      paper.examCount >= 10000 ? (paper.examCount / 10000).toFixed(1) + '万人' : paper.examCount
                    }}已考
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1">
                    <Icon
                        v-for="n in 5"
                        :key="n"
                        name="ep:star-filled"
                        class="text-xs"
                        :class="n <= paper.rating ? 'text-[var(--color-warning)]' : 'text-gray-300'"
                    />
                  </div>
                  <el-button
                      type="primary"
                      size="small"
                      plain
                      @click="handleStartPaper(paper)"
                  >
                    开始考试
                  </el-button>
                </div>
              </div>
            </div>
          </div>

          <!-- 学习文档 -->
          <div class="bg-white rounded-lg shadow-sm p-4">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <div class="w-1 h-5 bg-[var(--color-btn-primary)] rounded-full"/>
                <h3 class="font-bold text-[var(--color-text-primary)]">学习文档</h3>
              </div>
              <a href="#"
                 class="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-btn-primary)] flex items-center gap-1">
                更多
                <Icon name="ep:arrow-right" class="text-xs"/>
              </a>
            </div>
            <div class="space-y-3">
              <div
                  v-for="material in examData.studyMaterials"
                  :key="material.id"
                  class="flex items-start gap-3 p-2 hover:bg-[var(--color-bg-container-hover)] rounded transition-colors cursor-pointer"
                  @click="handleDownloadMaterial(material)"
              >
                <div
                    class="w-10 h-10 rounded flex items-center justify-center text-white text-lg shrink-0"
                    :style="{ backgroundColor: getFileIconColor(material.fileType) }"
                >
                  <Icon :name="`mdi:${getFileIconClass(material.fileType)}`"/>
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="text-[var(--color-text-primary)] text-sm font-medium line-clamp-2 mb-1">{{
                      material.title
                    }}</h4>
                  <div class="flex items-center gap-3 text-xs text-[var(--color-text-secondary)]">
                    <span class="flex items-center gap-1">
                      <Icon name="ep:calendar"/> {{ material.publishDate }}
                    </span>
                    <span class="flex items-center gap-1">
                      <Icon name="ep:folder"/> {{ material.fileSize }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 考试资讯 -->
          <div class="bg-white rounded-lg shadow-sm p-4">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <div class="w-1 h-5 bg-[var(--color-btn-primary)] rounded-full"/>
                <h3 class="font-bold text-[var(--color-text-primary)]">考试资讯</h3>
              </div>
              <a href="#"
                 class="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-btn-primary)] flex items-center gap-1">
                更多
                <Icon name="ep:arrow-right" class="text-xs"/>
              </a>
            </div>
            <div class="space-y-4">
              <div
                  v-for="(news, index) in examData.news"
                  :key="index"
                  class="border-b border-[var(--color-border)] last:border-b-0 pb-3 last:pb-0"
              >
                <a href="#"
                   class="text-[var(--color-text-primary)] hover:text-[var(--color-btn-primary)] transition-colors line-clamp-2 mb-2">
                  {{ news.title }}
                </a>
                <div class="flex items-center gap-3 text-xs text-[var(--color-text-secondary)]">
                  <span class="flex items-center gap-1">
                    <Icon name="ep:calendar"/> {{ news.publishDate }}
                  </span>
                  <span class="flex items-center gap-1">
                    <Icon name="ep:office-building"/> {{ news.source }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
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

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
