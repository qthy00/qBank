<script setup lang="ts">
import {CmsCategoryApi} from '~/api/category'
import {ArticleApi} from "~/api/article";
import {questionApi} from "~/api/qbank";

// 禁用所有布局
definePageMeta({
  layout: false
})

const useSystemTitleText = ref(useSystemTitle().value ?? '')

useHead({
  title: {name: '首页' + useSystemTitleText.value, tagPriority: 1 }
})

const iconList = ["jz", "ck", "jr", "yl", "kg", "zige", "zc", "sh", "xl", "wy"]
const loading = useState<boolean>('indexLoading', () => false);


const categories = ref([])
// 初始加载（SSR）
const initLoad = async () => {
  if (categories.value?.length) return // 避免重复加载
  loading.value = true
  try {
    const {data} = await CmsCategoryApi.getCategoryList()
    if (data.value) {
      categories.value = data.value
    }
  } catch (err) {
    console.error('Failed to load categories:', err)
    categories.value = []
  } finally {
    loading.value = false
  }
}

const isFirstLoad = ref(true)
const route = useRoute()
// 监听路由变化，标记非首次加载
watch(route, () => {
  isFirstLoad.value = false
}, {immediate: false})
// 仅首次加载（SSR + 客户端首次进入）执行
if (isFirstLoad.value) {
  await initLoad()
}

const {data: news} = await ArticleApi.getContentList({
  contentType: 'article',
  sort: "Recent",
  tag: '考试动态',
  status: 0,
  limit: 14,
}, true)
const {data: examCalendar} = await questionApi.getExamInfoList({group: true}, true)


// 控制悬浮详情显示/隐藏
const showSubmenu = ref(false)
// 当前悬浮详情的渲染数据
const currentSubmenu = reactive({
  title: '一级建造师',
  items: categories.value[0].children
})
// 防抖计时器（防止 hover 闪烁）
let hoverTimer: number | null = null
// 鼠标进入左侧列表项
const handleMouseEnter = (catalog: any, e: MouseEvent) => {
  console.log('进入', catalog)
  // 清除之前的防抖计时器
  if (hoverTimer) clearTimeout(hoverTimer)
  // 更新当前详情数据
  currentSubmenu.title = catalog.name
  currentSubmenu.items = catalog.children
  // 显示悬浮区域（防抖：避免快速 hover 闪烁）
  hoverTimer = window.setTimeout(() => {
    showSubmenu.value = true
  }, 50)
}

// 鼠标离开左侧列表项
const handleMouseLeave = () => {
  if (hoverTimer) clearTimeout(hoverTimer)
  // 延迟隐藏：防止鼠标从列表移到悬浮区域时直接隐藏
  hoverTimer = window.setTimeout(() => {
    showSubmenu.value = false
  }, 200)
}

const handleSubmenuItemEnter = (catalog: any, e: MouseEvent) => {
  currentSubmenu.title = catalog.name
}

// 鼠标进入悬浮区域（取消隐藏）
const handleSubmenuEnter = () => {
  if (hoverTimer) clearTimeout(hoverTimer)
  showSubmenu.value = true
}

// 鼠标离开悬浮区域（隐藏）
const handleSubmenuLeave = () => {
  showSubmenu.value = false
}

const currentDetail = ref(categories.value[0])
// Tab切换
const activeTab = ref(categories.value ? categories.value[0]?.children[0]?.id : '1')
const switchTab = async (tabId: string) => {
  activeTab.value = tabId
  // 更新当前 Tab 的激活状态
  currentDetail.value.children.forEach(tab => {
    tab.active = tab.id === tabId
  })
  // 加载对应的详情数据
 // currentDetail
}

// 加载详情数据
const loadDetailData = async (tabId: string) => {
  try {
    loading.value = true
    // 这里可以根据需要调用 getExamDetail(tabId) 获取单个 Tab 的详情
    // 现在的逻辑是从全部数据中获取对应 Tab 的详情
    const result = await getExamData()
    if (result.code === 200) {
      currentDetail.value = result.data.details[tabId]
    }
  } catch (err) {
    error.value = '加载详情数据失败'
    console.error('加载详情数据失败:', err)
  } finally {
    loading.value = false
  }
}
console.log('currentDetail===', currentDetail.value)
// if(categories.value && categories.value[0].id) {
//   const {data} = await CmsCategoryApi.getCategoryList({
//     id: categories.value[0].id,
//     level: 'Child',
//     limit: 5
//   })
//   subCategories.value = data
// }

const examsData = [
  {
    id: 'tab1',
    name: '一级建造师',
    image: '/images/exam1.jpg',
    daysLeft: 57,
    subjects: [
      { title: '专业', description: '专业讲师陪伴式备考' },
      { title: '科学', description: '从入门到进阶多方位覆盖' },
      { title: '智能', description: '多样化在线智能题库' },
      { title: '规划', description: '阶段化学习目标' },
      { title: '辅导', description: '考前冲刺指导' },
      { title: '社区', description: '备考交流群活跃互动' }
    ],
    news: [
      { title: '希赛荣获2024年度项目管理优秀合作培训机构奖' },
      { title: '2024年一级建造师考试大纲解读' }
    ],
    materials: [
      { title: '一级建造师题库', image: '/images/material1.jpg' },
      { title: '高频考点精讲', image: '/images/material2.jpg' },
      { title: '历年真题解析', image: '/images/material3.jpg' }
    ],
    questionBanks: ['章节练习', '历年真题', '高频考点', '模拟试卷'],
    registrationItems: ['报名时间', '报名条件', '报名流程', '报名费用'],
    examItems: ['章节练习', '历年真题', '模拟考试', '高频考点'],
    scoreItems: ['查询成绩', '合格标准']
  },
  {
    id: 'tab2',
    name: '二级建造师',
    image: '/images/exam2.jpg',
    daysLeft: 45,
    subjects: [
      { title: '专业', description: '专业讲师陪伴式备考' },
      { title: '科学', description: '从入门到进阶多方位覆盖' },
      { title: '智能', description: '多样化在线智能题库' }
    ],
    news: [
      { title: '2024年二级建造师考试时间确定' },
      { title: '二级建造师考试通过率分析' }
    ],
    materials: [
      { title: '二级建造师题库', image: '/images/material4.jpg' },
      { title: '高频考点精讲', image: '/images/material5.jpg' },
      { title: '历年真题解析', image: '/images/material6.jpg' }
    ],
    questionBanks: ['章节练习', '历年真题', '高频考点', '模拟试卷'],
    registrationItems: ['报名时间', '报名条件', '报名流程'],
    examItems: ['章节练习', '历年真题', '模拟考试'],
    scoreItems: ['查询成绩', '合格标准']
  },
  {
    id: 'tab3',
    name: '造价工程师',
    image: '/images/exam3.jpg',
    daysLeft: 78,
    subjects: [
      { title: '专业', description: '专业讲师陪伴式备考' },
      { title: '科学', description: '从入门到进阶多方位覆盖' },
      { title: '智能', description: '多样化在线智能题库' },
      { title: '规划', description: '阶段化学习目标' }
    ],
    news: [
      { title: '造价工程师考试改革新政策解读' },
      { title: '2024年造价工程师考试大纲变化' }
    ],
    materials: [
      { title: '造价工程师题库', image: '/images/material7.jpg' },
      { title: '高频考点精讲', image: '/images/material8.jpg' },
      { title: '历年真题解析', image: '/images/material9.jpg' }
    ],
    questionBanks: ['章节练习', '历年真题', '高频考点', '模拟试卷'],
    registrationItems: ['报名时间', '报名条件', '报名流程', '报名费用'],
    examItems: ['章节练习', '历年真题', '模拟考试', '高频考点'],
    scoreItems: ['查询成绩', '合格标准']
  }
]

const examItems = ref([])
const loadExamItems = async (catalogId: number) => {
  console.log('获取考试信息')

  try{
    examItems.value = await questionApi.getExamInfoList({catalogId})
  }catch (e){
    console.log(e)
  }
}


const questions = ref([])
const loadQuestions = async () => {
  console.log('获取题目')
  try{
    questions.value = await questionApi.getSimpleQuestions({ limit: 15})
  }catch (e){
    console.log(e)
  }
}

const slides = [
  // {image: 'https://dd.qthy.cc/102/hyserver//image/232411/94b9c7049777f64ee4af0dc1c18b2d8a.jpg', title: '', desc: ''},
  // {image: 'https://dd.qthy.cc/102/hyserver//image/202411/44523192f6fb63e1a394a046dc34b9b5.jpg', title: '', desc: ''},
  {image: 'https://dd.qthy.cc/102/hyserver/image/202601/ae51ed22822ec07541d147fedb2b37d9.jpg', title: '', desc: ''},
  {image: 'https://dd.qthy.cc/102/hyserver/cms/image/072506/64be7567510c464765059f244d2ccaa9.jpg', title: '', desc: ''}
]


onMounted(() => {
  await Promise.all([
    loadExamItems(),
    loadQuestions()
  ])
})


</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- 导航 -->
    <Navbar/>
    <!-- 菜单部分 -->
    <MainMenu/>
    <!-- 内容部分 -->
    <!-- 页面轮播图,列表 -->
    <div class="container  mx-auto my-5">
      <div class="flex bg-white relative">
        <!-- 左侧列表 -->
        <div class="w-1/4 relative z-10">
          <ul class="divide-y divide-(--color-border)">
            <li
                v-for="(catalog, index) in categories" :key="index"
                class="hover:bg-(--color-bg-container-hover) cursor-pointer px-4 py-2 text-sm text-#2c3e50 flex justify-between items-center"
                @mouseenter="handleMouseEnter(catalog, $event)"
                @mouseleave="handleMouseLeave"
            >
              <div class="flex items-center gap-1 shrink-0 mr-2">
                <i :class="`hy-icon-${iconList[index]}`"/>
                <a
                    :href="catalog?.url" target="_blank"
                    class="font-bold hover:text-(--color-text-hover) truncate max-w-[6rem]">{{ catalog.name }}</a>
              </div>
              <div class="flex-1 min-w-0 mr-2">
                <div class="text-#7f8c8d truncate">
                  <span v-for="child in catalog.children.slice(0, 5)" :key="child.id">
                    <span class="cursor-auto">/</span>
                    <a :href="child?.url" target="_blank" class="hover:text-(--color-text-hover) mx-1">{{
                        child.name
                      }}</a>
                  </span>
                </div>
              </div>
              <i class="hy-icon-yjt shrink-0 group-hover:rotate-90 transform transition-transform bg-(--color-text-secondary)"/>
            </li>
          </ul>
        </div>

        <!-- 右侧轮播图 -->
        <div class="relative w-full h-56 overflow-hidden md:h-96">
          <Carousel :slides="slides"/>
        </div>

        <!-- 悬浮详情 -->
        <div
            id="submenu-wrapper"
            class="absolute top-0 left-[25%] w-[75%] h-full z-100 pointer-events-auto text-(--color-nav-text)"
            :class="{ hidden: !showSubmenu }"
            @mouseenter="handleSubmenuEnter"
            @mouseleave="handleSubmenuLeave"
        >
          <div
              class="submenu-detail absolute inset-0 bg-(--color-nav-mask) border-(--color-border) shadow box-border overflow-y-auto p-4">

            <!-- 顶部新增模块 -->
            <div class="bg-(--color-shadow) rounded-lg p-4 space-y-4 ">
              <ul class="flex flex-wrap gap-3 mx-3">
                <li v-for="item in currentSubmenu.items" :key="item.id"
                    @mouseenter="handleSubmenuItemEnter(item, $event)">
                  <a :href="item.url"
                     class="cursor-pointer block px-3 py-1 border border-solid border-(--color-border) rounded hover:text-(--color-nav-text-hover) hover:border-(--color-nav-text-hover) text-sm">
                    {{ item.name }}
                  </a>
                </li>
              </ul>

              <hr class="border-t border-(--color-border) mx-2">
              <div class="flex flex-col gap-4 text-sm">
                <!-- 模块 1 -->
                <div class="bg-wh1ite/10 rounded-md px-4">
                  <div class="flex items-center gap-2 mb-2">
                    <!-- <i class="hy-icon-ditu"></i> -->
                    <h4 class="font-semibold text-lg">{{ currentSubmenu.title }}</h4>
                  </div>
                  <ul class="flex flex-wrap gap-3">
                    <li><a href="#" class="hover:text-(--color-nav-text-hover) transition">考试简介</a></li>
                    <li><a href="#" class="hover:text-(--color-nav-text-hover) transition">招生对象</a></li>
                    <li><a href="#" class="hover:text-(--color-nav-text-hover) transition">考试大纲</a></li>
                    <li><a href="#" class="hover:text-(--color-nav-text-hover) transition">历年真题</a></li>
                    <li><a href="#" class="hover:text-(--color-nav-text-hover) transition">考试日历</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- 考试动态,考试日历 -->
    <div class="container mx-auto grid grid-cols-12 gap-5 h-[310px]">
      <!-- 左侧考试动态区域 -->
      <div class="col-span-12 lg:col-span-9 bg-(--color-bg-container) pt-4 pl-4 pr-4 pb-2">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">考试动态</h2>
          <a
              href="#"
              class=" text-(--color-text-secondary) px-3 rounded-full flex items-center border border-(--color-border) hover:bg-(--color-disabled) ">
            <span class="mr-1">全部</span> <i class="hy-ico-djt ic-12"/>
          </a>
        </div>
        <div class="flex flex-wrap">
          <div v-for="item in news" :key="item.id" class="w-full md:w-1/2 lg:w-1/2 px-5">
            <div class="flex justify-between items-center border-b border-(--color-border) py-2">
              <a
                  :href="item.link"
                  class="px-3 cursor-pointer text-nowrap bg-(--color-btn-primary) text-(--color-bg-container) hover:bg-(--color-btn-hover) rounded-full mr-2">
                {{ item.categoryName }}
              </a>
              <a
                  href="#"
                  class="min-w-0 flex justify-start text-(--color-text-primary) hover:text-(--color-text-hover) transition-colors duration-200">
                <span class="truncate items-start">
                 {{ item.title }}
                </span>
              </a>
              <span class="text-(--color-text-primary) whitespace-nowrap ml-2 flex-shrink-0">
                {{ formatDate(item.publishDate, 'YYYY-MM-DD') }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧考试日历区域 -->
      <div class="hidden lg:flex lg:col-span-3 bg-(--color-bg-container) p-4 flex-col h-310px">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">考试日历</h2>
          <a
              href="#"
              class="text-(--color-text-secondary) px-3 rounded-full flex items-center border border-(--color-border) hover:bg-(--color-disabled)">
            <span class="mr-1">全部</span> <i class="hy-ico-djt ic-12"/>
          </a>
        </div>

        <!-- 考试日历条目 -->
        <el-scrollbar class="h-full">
          <div
              v-for="item in examCalendar" :key="item.id"
              class="flex justify-between items-center border-b border-(--color-border) py-2">
            <a
                href="#"
                class="flex-1 text-(--color-text-primary) truncate hover:text-(--color-text-hover) transition-colors duration-200">
              {{ item.name }}
            </a>
            <span class="text-(--color-text-primary) whitespace-nowrap ml-2">
                {{ item.examTime ? formatDate(item.examTime, 'YYYY-MM-DD') : '--' }}
              </span>
          </div>
        </el-scrollbar>
      </div>
    </div>

    <!-- 考试类型详情卡片 -->
    <ExamDetailCard
        :category-name="'建筑工程'"
        :exams="examsData"
    />

    <!-- 题目列表 -->
    <ClientOnly>
      <div class="container mx-auto px-4 mt-1.5 bg-(--color-bg-container) p-4">
        <!-- 顶部标题栏 -->
        <div class="flex justify-between items-center border-b border-(--color-border) pb-2 mb-4">
          <h2 class="text-lg font-semibold text-(--color-text-primary)">最新题目</h2>
          <div class="flex justify-end">
            <a
                href="#"
                class="text-(--color-text-secondary) px-3 rounded-full flex items-center border border-(--color-border) hover:bg-(--color-disabled)">
              <span class="mr-1">更多</span> <i class="hy-ico-djt ic-12"/>
            </a>
          </div>
        </div>

        <!-- Grid 三列题目卡片布局 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
          <!-- 题目卡片 -->

          <div v-for="question in questions" :key="question.id" class="border-b border-(--color-border) pb-3">
            <div class="text-sm text-(--color-text-secondary) mb-1">{{ question.categoryName}} · {{question.typeName}}</div>
            <div
                class="text-(--color-text-primary) hover:text-(--color-text-hover) cursor-pointer transition-colors duration-200
                      truncate whitespace-nowrap overflow-hidden">
              {{question.title}}
            </div>
          </div>

        </div>

      </div>
    </ClientOnly>
    <!-- 底部 -->
    <Footer/>
  </div>
</template>

<style scoped>

</style>