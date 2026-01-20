<script setup lang="ts">
import {CmsCategoryApi} from '~/api/category'
import {ArticleApi} from "~/api/article";

// 禁用所有布局
definePageMeta({
  layout: false
})

const useSystemTitleText = ref(useSystemTitle().value ?? '')

useHead({
  title: '首页' + useSystemTitleText.value
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
  limit: 12,
}, true)
// const news = ref([])


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

// if(categories.value && categories.value[0].id) {
//   const {data} = await CmsCategoryApi.getCategoryList({
//     id: categories.value[0].id,
//     level: 'Child',
//     limit: 5
//   })
//   subCategories.value = data
// }

const slides = [
  // {image: 'https://dd.qthy.cc/102/hyserver//image/232411/94b9c7049777f64ee4af0dc1c18b2d8a.jpg', title: '', desc: ''},
  // {image: 'https://dd.qthy.cc/102/hyserver//image/202411/44523192f6fb63e1a394a046dc34b9b5.jpg', title: '', desc: ''},
  {image: 'https://dd.qthy.cc/102/hyserver/image/202601/ae51ed22822ec07541d147fedb2b37d9.jpg', title: '', desc: ''},
  {image: 'https://dd.qthy.cc/102/hyserver/cms/image/072506/64be7567510c464765059f244d2ccaa9.jpg', title: '', desc: ''}
]



onMounted(() => {

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
                <li v-for="item in currentSubmenu.items" :key="item.id" @mouseenter="handleSubmenuItemEnter(item, $event)">
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
    <div class="container mx-auto grid grid-cols-12 gap-5 min-h-[316px]">
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
                  class="px-3 text-nowrap bg-(--color-btn-primary) text-(--color-bg-container) hover:bg-(--color-btn-hover) rounded-full mr-2">一级建造师</a>
              <a
                  href="#"
                  class="min-w-0 flex items-center text-(--color-text-primary) hover:text-(--color-text-hover) transition-colors duration-200">
                <span class="flex-1 truncate whitespace-nowrap overflow-hidden">
                 {{item.title}}
                </span>
              </a>
              <span class="text-(--color-text-primary) whitespace-nowrap ml-2 flex-shrink-0">
                {{ formatDate(item.createTime, 'YYYY-MM-DD') }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧考试日历区域 -->
      <div class="hidden lg:flex lg:col-span-3 bg-(--color-bg-container) p-4 flex-col min-h-0">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">考试日历</h2>
          <a
              href="#"
              class="text-(--color-text-secondary) px-3 rounded-full flex items-center border border-(--color-border) hover:bg-(--color-disabled)">
            <span class="mr-1">全部</span> <i class="hy-ico-djt ic-12"/>
          </a>
        </div>

        <!-- 滚动内容区域 -->
        <div class="flex-grow min-h-0 overflow-y-auto max-h-full custom-scrollbar pr-1 overscroll-contain">
          <div>
            <!-- 考试日历条目 -->
            <div class="flex justify-between items-center border-b border-(--color-border) py-2">
              <a
                  href="#"
                  class="flex-1 text-(--color-text-primary) truncate hover:text-(--color-text-hover) transition-colors duration-200">
                数学
              </a>
              <span class="text-(--color-text-primary) whitespace-nowrap ml-2">2025-04-25</span>
            </div>
            <div class="flex justify-between items-center border-b border-(--color-border) py-2">
              <a
                  href="#"
                  class="flex-1 text-(--color-text-primary) truncate hover:text-(--color-text-hover) transition-colors duration-200">
                英语
              </a>
              <span class="text-(--color-text-primary) whitespace-nowrap ml-2">2025-04-26</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 考试类型详情卡片 -->
    <div class="container mx-auto px-4 my-5 bg-(--color-bg-container) ">
      <!-- 顶部导航栏 -->
      <div class="flex items-center justify-between py-4 border-b border-(--color-border) ">
        <div class="text-xl font-bold">建筑工程</div>
        <!-- Tab菜单 -->
        <div id="tab-menu" class="flex-1 flex justify-center space-x-4">
          <a
              href="#" data-tab="tab1" class="tab-link active-tab border border-(--color-border) rounded-full bg-(--color-bg-container) text-(--color-text-secondary) px-3 py-1
            hover:bg-(--color-btn-hover) hover:text-(--color-bg-container)">
            一级建造师
          </a>
          <a
              href="#" data-tab="tab2" class="tab-link active-tab border border-(--color-border) rounded-full bg-(--color-bg-container) text-(--color-text-secondary) px-3 py-1
            hover:bg-(--color-btn-hover) hover:text-(--color-bg-container)">
            二级建造师
          </a>
          <a
              href="#" data-tab="tab3" class="tab-link active-tab border border-(--color-border) rounded-full bg-(--color-bg-container) text-(--color-text-secondary) px-3 py-1
            hover:bg-(--color-btn-hover) hover:text-(--color-bg-container)">
            造价工程师
          </a>

        </div>
        <!-- 右侧更多 -->
        <div class="flex justify-end">
          <a
              href="#"
              class="text-(--color-text-secondary) px-3 rounded-full flex items-center border border-(--color-border) hover:bg-(--color-disabled)">
            <span class="mr-1 ">更多</span> <i class="hy-ico-djt ic-12"/>
          </a>
        </div>
      </div>

      <div class="relative">
        <!-- 主体内容区，分左右布局 -->
        <div id="tab1" class="flex flex-wrap gap-3 mt-3 tab-content">

          <!-- 左侧内容 -->
          <div class="flex-1 w-1/4 mb-4 lg:block md:hidden hidden">
            <div class="bg-(--color-bg-container-hover) p-4  h-full flex flex-col">
              <img src="~/assets/images/a.jpg" alt="学习方案图片" class="w-full rounded mb-4">
              <div class="text-(--color-text-primary) font-black text-lg mb-3">考试科目</div>
              <div class="overflow-y-auto  rounded p-3 mb-4 max-h-60">
                <ul class="space-y-3 text-sm text-(--color-text-secondary) font-medium">
                  <li>
                    <span class="font-bold">01</span>
                    <span class="ml-2 ">专业</span>
                    <div class="ml-6">专业讲师陪伴式备考</div>
                  </li>
                  <li>
                    <span class="font-bold">02</span>
                    <span class="ml-2 ">科学</span>
                    <div class="ml-6">从入门到进阶多方位覆盖</div>
                  </li>
                  <li>
                    <span class="font-bold">03</span>
                    <span class="ml-2 ">智能</span>
                    <div class="ml-6">多样化在线智能题库</div>
                  </li>
                  <li>
                    <span class="font-bold">04</span>
                    <span class="ml-2">规划</span>
                    <div class="ml-6">阶段化学习目标</div>
                  </li>
                  <li>
                    <span class="font-bold">05</span>
                    <span class="ml-2">辅导</span>
                    <div class="ml-6">考前冲刺指导</div>
                  </li>
                  <li>
                    <span class="font-bold">06</span>
                    <span class="ml-2 ">社区</span>
                    <div class="ml-6">备考交流群活跃互动</div>
                  </li>
                </ul>
              </div>
              <!-- 固定底部按钮 -->
              <div class="mt-auto">
                <a
                    href="#" class="block bg-(--color-btn-primary) text-(--color-btn-text) px-4 py-2 hover:-translate-y-1 text-center hover:bg-(--color-btn-hover)
                  hover:text-(--color-bg-container) transition-all">
                  查看详情
                </a>
              </div>
            </div>
          </div>

          <!-- 中间区域 -->
          <div class="flex-2 w-2/4 mb-4">
            <div class="bg-(--color-bg-container-hover) p-4 h-full flex flex-col space-y-5">
              <!-- 头条部分 -->
              <a href="" class="flex items-center space-x-2">
                <div class="bg-(--color-warning) text-white px-2 py-1 rounded-full text-sm">头条</div>
                <div
                    class="relative text-(--color-text-primary) hover:text-(--color-text-hover) font-medium
        after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-current
        after:transition-all after:duration-300 hover:after:w-full truncate">
                  希赛荣获2024年度项目管理优秀合作培训机构奖
                  希赛荣获2024年度项目管理优秀合作培训机构奖
                </div>
              </a>
              <a href="" class="flex items-center space-x-2">
                <div class="bg-(--color-text-hover) text-white px-2 py-1 rounded-full text-sm">推荐</div>
                <div
                    class="relative text-(--color-text-primary) hover:text-(--color-text-hover) font-medium
        after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-current
        after:transition-all after:duration-300 hover:after:w-full truncate">
                  希赛荣获2024年度项目管理优秀合作培训机构奖
                  希赛荣获2024年度项目管理优秀合作培训机构奖
                </div>
              </a>

              <!-- 备考资料 -->
              <div class="border-b-1 border-(--color-border)">
                <div class="text-(--color-text-primary)  font-bold mb-3">备考资料</div>
                <div class="grid grid-cols-3 gap-3 mb-3">
                  <!-- 每个图文块 -->
                  <a href="#" class="block group">
                    <div class="flex flex-col items-center text-center">
                      <div class="overflow-hidden w-full h-32 mb-2">
                        <img
                            src="~/assets/images/a.jpg" alt=""
                            class="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110">
                      </div>
                      <div
                          class="text-sm text-(--color-text-secondary) hover:text-(--color-text-hover) line-clamp-2 text-wrap ">
                        一级建造师题库一级建一级建造师题库造师题库一级建造师题库
                      </div>
                    </div>
                  </a>
                  <a href="#" class="block group">
                    <div class="flex flex-col items-center text-center">
                      <div class="overflow-hidden w-full h-32 mb-2">
                        <img
                            src="~/assets/images/a.jpg" alt=""
                            class="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110">
                      </div>
                      <div
                          class="text-sm text-(--color-text-secondary) hover:text-(--color-text-hover) line-clamp-2 text-wrap ">
                        一级建造师题库一级建
                      </div>
                    </div>
                  </a>
                  <a href="#" class="block group">
                    <div class="flex flex-col items-center text-center">
                      <div class="overflow-hidden w-full h-32 mb-2">
                        <img
                            src="~/assets/images/a.jpg" alt=""
                            class="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110">
                      </div>
                      <div
                          class="text-sm text-(--color-text-secondary) hover:text-(--color-text-hover) line-clamp-2 text-wrap ">
                        一级建造师题库一级建一级建造师题库造师题
                      </div>
                    </div>
                  </a>

                </div>
              </div>

              <!-- 题库 -->
              <div class="mt-auto">
                <div class="text-(--color-text-primary) font-bold mb-2">一级建造师题库</div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <a
                      href="#"
                      class="bg-(--color-btn-primary) text-center py-3 text-sm text-(--color-btn-text)
          hover:bg-(--color-btn-hover) hover:text-(--color-bg-container) transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md">章节练习</a>
                  <a
                      href="#"
                      class="bg-(--color-btn-primary) text-center py-3 text-sm text-(--color-btn-text)
          hover:bg-(--color-btn-hover) hover:text-(--color-bg-container) transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md">历年真题</a>
                  <a
                      href="#"
                      class="bg-(--color-btn-primary) text-center py-3 text-sm text-(--color-btn-text)
          hover:bg-(--color-btn-hover) hover:text-(--color-bg-container) transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md">高频考点</a>
                  <a
                      href="#"
                      class="bg-(--color-btn-primary) text-center py-3 text-sm text-(--color-btn-text)
          hover:bg-(--color-btn-hover) hover:text-(--color-bg-container) transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md">模拟试卷</a>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧区域 -->
          <div class="flex-1 w-1/4 mb-4 bg-(--color-bg-container-hover) xl:block lg:hidden hidden">
            <div class="space-y-6 ">
              <div class="bg-gradient-to-br from-(--color-btn-primary)/70 to-(--color-btn-hover)/90 p-1 mb-2 shadow-md">
                <!-- 装饰元素 -->
                <div
                    class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/4 -translate-y-1/4"/>
                <div class="text-(--color-bg-container) text-lg mb-3 pt-2 text-center ">距离考试剩余</div>
                <div class="flex justify-center items-center space-x-3 pb-2 text-(--color-bg-container)">
                  <div class="">
                    还有
                  </div>
                  <div
                      class="bg-(--color-bg-container-hover) px-5 py-2 rounded-full text-2xl font-bold text-(--color-btn-primary)">
                    57
                  </div>
                  <div class="">
                    天
                  </div>
                </div>
              </div>

              <div class="space-y-4">

                <div class="mb-5">
                  <!-- 分类标题 -->
                  <div class="mb-1 pb-1 flex items-center">
                    <div class="w-1.5 h-6 bg-(--color-btn-primary) rounded-full mr-3"/>
                    <h3 class="text-lg tracking-tight">报名</h3>
                  </div>
                  <div class="flex flex-wrap pl-2 gap-3">
                    <a
                        href="#"
                        class="group bg-(--color-btn-primary) text-sm text-(--color-btn-text) hover:bg-(--color-btn-hover) px-2 py-0.5 transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow transform hover:-translate-y-0.5">
                      <span class=" transition-colors whitespace-nowrap">报考指南</span>
                    </a>
                    <a
                        href="#"
                        class="group bg-(--color-btn-primary) text-sm text-(--color-btn-text) hover:bg-(--color-btn-hover) px-2 py-0.5 transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow transform hover:-translate-y-0.5">
                      <span class="transition-colors whitespace-nowrap">政策解读</span>
                    </a>
                    <a
                        href="#"
                        class="group bg-(--color-btn-primary) text-sm text-(--color-btn-text) hover:bg-(--color-btn-hover) px-2 py-0.5 transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow transform hover:-translate-y-0.5">
                      <span class="transition-colors whitespace-nowrap">考证含金量</span>
                    </a>
                    <a
                        href="#"
                        class="group bg-(--color-btn-primary) text-sm text-(--color-btn-text) hover:bg-(--color-btn-hover) px-2 py-0.5 transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow transform hover:-translate-y-0.5">
                      <span class="transition-colors whitespace-nowrap">材料准备</span>
                    </a>
                  </div>
                </div>

                <div class="mb-5">
                  <!-- 分类标题 -->
                  <div class="mb-1 pb-1 flex items-center">
                    <div class="w-1.5 h-6 bg-(--color-btn-primary) rounded-full mr-3"/>
                    <h3 class="text-lg tracking-tight">考试</h3>
                  </div>
                  <div class="flex flex-wrap pl-2 gap-3">
                    <a
                        href="#"
                        class="group bg-(--color-btn-primary) text-sm text-(--color-btn-text) hover:bg-(--color-btn-hover) px-2 py-0.5 transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow transform hover:-translate-y-0.5">
                      <span class="transition-colors whitespace-nowrap">章节练习</span>
                    </a>
                    <a
                        href="#"
                        class="group bg-(--color-btn-primary) text-sm text-(--color-btn-text) hover:bg-(--color-btn-hover) px-2 py-0.5 transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow transform hover:-translate-y-0.5">
                      <span class="transition-colors whitespace-nowrap">历年真题</span>
                    </a>
                    <a
                        href="#"
                        class="group bg-(--color-btn-primary) text-sm text-(--color-btn-text) hover:bg-(--color-btn-hover) px-2 py-0.5 transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow transform hover:-translate-y-0.5">
                      <span class="transition-colors whitespace-nowrap">模拟考试</span>
                    </a>
                    <a
                        href="#"
                        class="group bg-(--color-btn-primary) text-sm text-(--color-btn-text) hover:bg-(--color-btn-hover) px-2 py-0.5 transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow transform hover:-translate-y-0.5">
                      <span class="transition-colors whitespace-nowrap">高频考点</span>
                    </a>
                  </div>
                </div>

                <div class="mb-5">
                  <!-- 分类标题 -->
                  <div class="mb-1 pb-1 flex items-center">
                    <div class="w-1.5 h-6 bg-(--color-btn-primary) rounded-full mr-3"/>
                    <h3 class="text-lg tracking-tight">成绩</h3>
                  </div>
                  <div class="flex flex-wrap pl-2 gap-3">
                    <a
                        href="#"
                        class="group bg-(--color-btn-primary) text-sm text-(--color-btn-text) hover:bg-(--color-btn-hover) px-2 py-0.5 transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow transform hover:-translate-y-0.5">
                      <span class="transition-colors whitespace-nowrap">查询成绩</span>
                    </a>
                    <a
                        href="#"
                        class="group bg-(--color-btn-primary) text-sm text-(--color-btn-text) hover:bg-(--color-btn-hover) px-2 py-0.5 transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow transform hover:-translate-y-0.5">
                      <span class="transition-colors whitespace-nowrap">合格标准</span>
                    </a>

                  </div>
                </div>


              </div>
            </div>
          </div>

        </div>

        <div id="tab2" class="flex flex-wrap mt-3 hidden tab-content">
          <div class="w-full text-center py-10 text-gray-500">这里是 <strong>二级建造师</strong> 模拟内容区域。</div>
        </div>

        <div id="tab3" class="flex flex-wrap mt-3 hidden tab-content">
          <div class="w-full text-center py-10 text-gray-500">这里是 <strong>造价工程师</strong> 模拟内容区域。</div>
        </div>

      </div>
    </div>

    <!-- 题目列表 -->
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
        <div class="border-b border-(--color-border) pb-3">
          <div class="text-sm text-(--color-text-secondary) mb-1">二级建造师 · 单选题</div>
          <div
              class="text-(--color-text-primary) hover:text-(--color-text-hover) cursor-pointer transition-colors duration-200
                      truncate whitespace-nowrap overflow-hidden">
            建设工程项目总投资包括哪几项费用？
          </div>
        </div>
        <div class="border-b border-(--color-border) pb-3">
          <div class="text-sm text-(--color-text-secondary) mb-1">监理工程师 · 判断题</div>
          <div
              class="text-(--color-text-primary) hover:text-(--color-text-hover) cursor-pointer transition-colors duration-200
                      truncate whitespace-nowrap overflow-hidden">
            施工组织总设计是施工阶段的重要技术。
          </div>
        </div>
        <div class="border-b border-(--color-border) pb-3">
          <div class="text-sm text-(--color-text-secondary) mb-1">一级建造师 · 多选题</div>
          <div
              class="text-(--color-text-primary) hover:text-(--color-text-hover) cursor-pointer transition-colors duration-200
                      truncate whitespace-nowrap overflow-hidden">
            下列哪些属于建筑工程施工质量事故？
          </div>
        </div>

        <div class="border-b border-(--color-border) pb-3">
          <div class="text-sm text-(--color-text-secondary) mb-1">二级建造师 · 单选题</div>
          <div
              class="text-(--color-text-primary) hover:text-(--color-text-hover) cursor-pointer transition-colors duration-200
                      truncate whitespace-nowrap overflow-hidden">
            建设工程项目总投资包括哪几项费用？
          </div>
        </div>
        <div class="border-b border-(--color-border) pb-3">
          <div class="text-sm text-(--color-text-secondary) mb-1">监理工程师 · 判断题</div>
          <div
              class="text-(--color-text-primary) hover:text-(--color-text-hover) cursor-pointer transition-colors duration-200
                      truncate whitespace-nowrap overflow-hidden">
            施工组织总设计是施工阶段的重要技术。
          </div>
        </div>
        <div class="border-b border-(--color-border) pb-3">
          <div class="text-sm text-(--color-text-secondary) mb-1">一级建造师 · 多选题</div>
          <div
              class="text-(--color-text-primary) hover:text-(--color-text-hover) cursor-pointer transition-colors duration-200
                      truncate whitespace-nowrap overflow-hidden">
            下列哪些属于建筑工程施工质量事故？
          </div>
        </div>

      </div>

    </div>

    <!-- 底部 -->
    <Footer/>
  </div>
</template>

<style scoped>

</style>