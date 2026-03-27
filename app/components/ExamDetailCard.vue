<script setup lang="ts">
import type {examsInfoVO, examsItemVO} from "~/types/qBank/examInfo";
import {questionApi} from "~/api/qbank";
import image from '~/assets/images/a.jpg'

const props = defineProps<examsInfoVO>()
console.log(props)
const categoryId = ref<number>(props.categoryId)
const activeTab = ref<number>(props.exams[0]?.id ?? 0)

const activateTab = (tabId: number) => {
  activeTab.value = tabId
}


// const currentExam = computed(() =>
//   props.exams.find(exam => exam.id === activeTab.value) ?? props.exams[0]
// )

// const {data: currentExam} = await questionApi.getExamInfoList(props.exams[0].id, true)
const currentExam = ref<examsItemVO>()

const defaultExamsData: examsItemVO[] = [
  {
    id: 1,
    name: '一级建造师',
    image: '/images/exam1.jpg',
    daysLeft: 57,
    subjects: [
      { alias: '专业', name: '专业讲师陪伴式备考' },
      { alias: '科学', name: '从入门到进阶多方位覆盖' },
      { alias: '智能', name: '多样化在线智能题库' },
      { alias: '规划', name: '阶段化学习目标' },
      { alias: '辅导', name: '考前冲刺指导' },
      { alias: '社区', name: '备考交流群活跃互动' }
    ],
    news: [
      { title: '希赛荣获2024年度项目管理优秀合作培训机构奖' },
      { title: '2024年一级建造师考试大纲解读' }
    ],
    materials: [
      { title: '一级建造师题库', image},
      { title: '高频考点精讲', image },
      { title: '历年真题解析', image }
    ],
    questionBanks: ['章节练习', '历年真题', '高频考点', '模拟试卷']
  }
]
if(!currentExam.value) {
  currentExam.value = defaultExamsData[0]
}

const questionBanks = ['章节练习', '历年真题', '高频考点', '模拟试卷']

const rightMenu = [
    {
      title: '报名',
      items: [
        {tag: '报名时间', url: '/'},
        {tag: '报名条件', url: '/'},
        {tag: '报名流程', url: '/'},
        {tag: '报名费用', url: '/'}
      ]
    },
    {
      title: '考试',
      items: [
        {tag: '章节练习', url: '/'},
        {tag: '历年真题', url: '/'},
        {tag: '模拟考试', url: '/'},
        {tag: '高频考点', url: '/'}
      ]
    },
    {
      title: '成绩',
      items: [
        {tag: '查询成绩', url: '/'},
        {tag: '合格标准', url: '/'}
      ]
    }
]



const loadingDetail = ref(false)
const loadDetailData = async (categoryId?: number) => {
  if(!categoryId) return
  try {
    loadingDetail.value = true
    currentExam.value = await questionApi.getHomeExamDetail(categoryId)
    console.log('加载考试详情数据成功:', currentExam.value)
  } catch (err) {
    console.error('加载考试详情数据失败:', err)
    useMessage().error('加载考试详情失败，请稍后重试')
  } finally {
    loadingDetail.value = false
  }
}

watch(activeTab, () => {
  console.log(activeTab.value)
  loadDetailData(activeTab.value)
})


onMounted(()=>{
  loadDetailData(props.exams[0].id)
})
</script>

<template>
  <div class="container mx-auto px-4 my-5 bg-(--color-bg-container) ">
    <!-- 顶部导航栏 -->
    <div class="flex items-center justify-between py-4 border-b-solid border-(--color-border) ">
      <div class="text-xl font-bold">{{ categoryName }}</div>
      <!-- Tab菜单 -->
      <div class="flex flex-1 justify-center space-x-4">
        <a
            v-for="(exam) in exams.slice(0,5)"
            :key="exam.id"
            href="#"
            :class="[
            'border border-solid border-(--color-border) rounded-full  px-3 py-2 hover:bg-(--color-btn-hover) hover:text-(--color-bg-container)',
            activeTab === exam.id ? 'active-tab bg-(--color-btn-primary) text-(--color-bg-container)' : 'bg-(--color-bg-container) text-(--color-text-secondary)'
          ]"
            @click.prevent="activateTab(exam.id)"
        >
          {{ exam.name }}
        </a>
      </div>
      <!-- 右侧更多 -->
      <div class="flex justify-end">
        <NuxtLink
            :to="{ path: '/qbank', query: { categoryId } }"
           class="text-(--color-text-secondary) px-3 py-2 rounded-full flex items-center border border-solid border-(--color-border) hover:bg-(--color-disabled)">
          <span class="mr-1 ">更多</span> <i class="hy-ico-djt ic-12"/>
        </NuxtLink>
      </div>
    </div>

    <!-- Tab内容区 - 使用单个元素配合计算属性，避免重复渲染 -->
    <div v-if="currentExam" class="flex flex-wrap gap-3 mt-3">
      <!-- 左侧内容 -->
      <div class="flex-1 mb-4">
        <div class="bg-(--color-bg-container-hover) p-4 h-full flex flex-col">
          <img src="~/assets/images/a.jpg" alt="学习方案图片" class="w-full rounded mb-4">
          <div class="text-(--color-text-primary) font-black text-lg mb-3">考试科目</div>
          <div class="overflow-y-auto rounded p-3 mb-4 max-h-60">
            <ul class="space-y-3 text-sm text-(--color-text-secondary) font-medium">
              <li v-for="(subject, subIndex) in currentExam.subjects" :key="subIndex">
                <span class="font-bold">{{ String(subIndex + 1).padStart(2, '0') }}</span>
                <span class="ml-2">{{ subject.name }}</span>
<!--                <div class="ml-6">{{ subject.name }}</div>-->
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
      <div class="flex-[2] mb-4">
        <div class="bg-(--color-bg-container-hover) p-4 h-full flex flex-col justify-between space-y-5">
         <div class="flex flex-col space-y-5">
           <!-- 头条部分 -->
           <a v-for="(newsItem, newsIndex) in currentExam.news" :key="newsIndex" href="" class="flex items-center space-x-2">
             <div
:class="[
              'text-white px-2 py-1 rounded-full text-sm',
              newsIndex === 0 ? 'bg-(--color-warning)' : 'bg-(--color-text-hover)'
            ]">
               {{ newsIndex === 0 ? '头条' : '推荐' }}
             </div>
             <div class="relative inline-block text-(--color-text-primary) hover:text-(--color-text-hover) font-medium after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full">
               {{ newsItem.title }}
             </div>
           </a>

           <!-- 备考资料 -->
           <div class="border-b-1 border-(--color-border)">
             <div class="text-(--color-text-primary) font-bold mb-3">备考资料</div>
             <div class="grid grid-cols-3 gap-3 mb-3">
               <!-- 图文块 -->
               <a v-for="(material, matIndex) in currentExam.materials" :key="matIndex" href="#" class="block group">
                 <div class="flex flex-col items-center text-center">
                   <div class="overflow-hidden w-full h-32 mb-2">
                     <img
:src="material.image" alt=""
                          class="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110">
                   </div>
                   <div class="text-sm text-(--color-text-secondary) hover:text-(--color-text-hover) line-clamp-2 text-wrap">
                     {{ material.title }}
                   </div>
                 </div>
               </a>
             </div>
           </div>
         </div>

          <!-- 题库 -->
          <div class="mt-auto">
            <div class="text-(--color-text-primary) font-bold mb-2">{{ currentExam.name }}题库</div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a
                  v-for="(questionBank, bankIndex) in questionBanks"
                  :key="bankIndex"
                  href="#"
                  class="bg-(--color-btn-primary) text-center py-3 text-sm text-(--color-btn-text) hover:bg-(--color-btn-hover) hover:text-(--color-bg-container) transition-all">
                {{ questionBank }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧区域 -->
      <div class="flex-1 mb-4 bg-(--color-bg-container-hover)">
        <div>
          <div class="relative bg-gradient-to-br from-[var(--color-btn-primary-70)] to-[var(--color-btn-hover-90)] p-1 mb-2 shadow-md overflow-hidden">
            <!-- 装饰元素 -->
            <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/4 -translate-y-1/4"/>
            <div class="relative z-10 text-(--color-bg-container) text-lg mb-3 pt-2 text-center">距离考试剩余</div>
            <div class="relative z-10 flex justify-center items-center space-x-3 pb-2 text-(--color-bg-container)">
              <div>还有</div>
              <div class="bg-(--color-bg-container-hover) px-5 py-2 rounded-full text-2xl font-bold text-(--color-btn-primary)">
                {{ currentExam.daysLeft }}
              </div>
              <div>天</div>
            </div>
          </div>

          <div class="space-y-4 p-4">
            <div v-for="(menu,index) in rightMenu" :key="index" class="mb-5">
              <!-- 分类标题 -->
              <div class="mb-1 pb-1 flex items-center">
                <div class="w-1.5 h-6 bg-(--color-btn-primary) rounded-full mr-3"/>
                <h3 class="text-lg tracking-tight">{{ menu.title }}</h3>
              </div>
              <div class="flex flex-wrap pl-2 gap-3">
                <a
                    v-for="(item, idx) in menu.items"
                    :key="idx"
                    :href="item.url"
                    class="px-3 py-1 rounded hover:text-(--color-btn-hover) text-(--color-text-secondary) transition-transform duration-200 hover:scale-110 inline-block">
                  {{ item.tag }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="py-10 text-center text-(--color-text-secondary)">
      暂无考试数据
    </div>
  </div>
</template>

<style scoped>

</style>