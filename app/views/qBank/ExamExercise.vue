<template>
    <div class="min-h-screen bg-gray-50">
      <!-- 整体用el-card包裹，保持风格统一 -->
      <el-card class="border border-gray-200 shadow-sm bg-white relative">
        <!-- 固定位置的返回按钮 - 在所有设备上都显示在右上角 -->

        <div class="absolute top-4 right-4 z-10">
          <div class="flex items-center">
            <button
                class="flex items-center hover:bg-amber-100 rounded-full shadow-sm hover:shadow transition-colors p-1 mr-2"
                @click="handleSetting"
            >
              <Icon name="ep:setting" class="text-amber-600" :size="22"/>
            </button>
            <button
                class="flex items-center bg-blue-400 hover:bg-blue-500 text-white px-3 py-1 rounded-lg transition-colors text-sm font-medium shadow-sm hover:shadow"
                @click="navigateTo(`/t/${qPackage.series}`)"
            >
              <Icon name="icon-park-outline:return" class="mr-1.5"/>
              返回
            </button>
          </div>
        </div>

        <!-- 主要内容区 -->
        <div class="p-6 pt-8">
          <!-- 章节筛选和搜索 -->
          <div class="mb-8 bg-gray-50 border border-gray-200 rounded-lg p-3 shadow-sm">
            <div class="flex flex-col md:flex-row md:items-center justify-between">
              <div class="mb-3 md:mb-0">
                <h3 class="font-medium text-gray-800 mb-2">科目筛选</h3>
                <div class="flex flex-wrap gap-2">
                  <button
                      v-for="(course, index) in subjects"
                      :key="course.id"
                      :class="[
                    'px-3 py-1.5 text-sm rounded-full transition-colors',
                    activeCourse === index
                      ? 'bg-blue-400 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
                  ]"
                      @click="activeCourse = index"
                  >
                    {{ course.aliasName || course.name }}
                  </button>
                </div>
              </div>
            </div>
          </div>


          <div v-loading="loadingChapter" element-loading-text="正在加载...">
            <template v-if="chapters.length > 0">
              <!-- 章节列表 -->
              <div class="mb-6">
                <div class="flex items-center justify-between mb-6">
                  <h2 class="text-xl font-semibold text-gray-800">
                    {{ subjects[activeCourse]?.aliasName || subjects[activeCourse]?.name }}
                    章节练习
                    <span class="text-sm font-normal text-gray-500 ml-2">
                  (共 {{ chapters.length }} 章)
                </span>
                  </h2>
                </div>

                <!-- 章节卡片网格 -->
                <div
                    v-if="chapters.length"
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  <div
                      v-for="(chapter, index) in chapters"
                      :key="chapter.id"
                      class="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                  >
                    <!-- 章节头部 -->
                    <div class="p-5 border-b border-gray-100">
                      <div class="flex justify-between items-start mb-3">
                        <!-- 章节标题 - 处理溢出不换行 -->
                        <h3
                            class="font-semibold text-gray-800 text-lg flex items-center flex-1 min-w-0"
                        >
                      <span
                          class="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-sm font-medium mr-2 flex-shrink-0"
                      >
                        {{ index + 1 }}
                      </span>
                          <span class="truncate whitespace-nowrap overflow-hidden">
                        {{ chapter.name }}
                      </span>
                        </h3>
                        <div
                            v-if="chapter.isCompleted"
                            class="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full whitespace-nowrap ml-2 flex-shrink-0"
                        >
                          已完成
                        </div>
                      </div>

                      <p class="text-gray-500 text-sm mb-4">
                    <span v-if="chapter.sectionCount > 0">
                      该章节下有 {{ chapter.sectionCount }} 个小节
                    </span>
                        <span v-else>.</span>
                      </p>

                      <!-- 章节进度 -->
                      <div class="mt-2">
                        <div class="flex justify-between items-center mb-1">
                          <span class="text-xs text-gray-500">完成进度</span>
                        </div>
                        <el-progress
                            :percentage="chapter.completionRate > 100 ? 100 : chapter.completionRate"
                            :stroke-width="8"
                            :stroke="chapter.isCompleted ? '#10b981' : '#60a5fa'"
                            bg-color="#e5e7eb"
                        />
                      </div>
                    </div>

                    <!-- 章节详情 -->
                    <div class="p-5">
                      <div class="grid grid-cols-3 gap-2 mb-4 text-center">
                        <div class="bg-white p-2 rounded shadow-sm">
                          <p class="text-xs text-gray-500">总题数</p>
                          <p class="text-gray-800 font-medium">{{ chapter.total }}</p>
                        </div>
                        <div class="bg-white p-2 rounded shadow-sm">
                          <p class="text-xs text-gray-500">已完成</p>
                          <p class="text-gray-800 font-medium">{{ chapter.completedCount || 0 }}</p>
                        </div>
                        <div class="bg-white p-2 rounded shadow-sm">
                          <p class="text-xs text-gray-500">正确率</p>
                          <p class="text-green-600 font-medium">{{ chapter.accuracyRate || '--' }}%</p>
                        </div>
                      </div>

                      <div class="flex gap-2">
                        <el-button
                            :disabled="chapter.total == 0"
                            class="flex-1 py-2 bg-blue-400 hover:bg-blue-500 text-white rounded-full text-sm font-medium transition-colors flex items-center justify-center shadow-sm hover:shadow"
                            @click="startPractice(chapter)"
                        >
                          <Icon name="material-symbols:motion-play-outline" class="mr-1.5"/>
                          {{ chapter.isCompleted ? '重新练习' : '开始练习' }}
                        </el-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 学习统计 -->
              <div>
                <h2 class="text-xl font-semibold text-gray-800 mb-6">学习统计</h2>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <!-- 总体进度 -->
                  <div
                      class="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden shadow-sm lg:col-span-2"
                  >
                    <div class="bg-gray-100 px-5 py-3 border-b border-gray-200">
                      <h3 class="font-medium text-gray-800">课程完成情况</h3>
                    </div>
                    <div class="p-5">
                      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <!-- 环形进度图（使用Element组件） -->
                        <div class="flex flex-col items-center justify-center">
                          <el-progress
                              type="circle"
                              :percentage="completionRate > 100 ? 100 : completionRate"
                              :stroke-width="8"
                              stroke="#60a5fa"
                              bg-color="#e5e7eb"
                              class="mb-4"
                              :width="160"
                          >
                            <template #default>
                              <div class="text-center">
                                <p class="text-3xl font-bold text-gray-800">{{ completionRate }}%</p>
                                <p class="text-xs text-gray-500">已完成</p>
                              </div>
                            </template>
                          </el-progress>
                          <div class="text-center">
                            <p class="text-sm text-gray-600">预计剩余用时</p>
                            <p class="text-base font-medium text-gray-800 mt-1">{{ needTime }}</p>
                          </div>
                        </div>

                        <!-- 详细统计数据 -->
                        <div class="md:col-span-2">
                          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                            <div class="bg-white p-3 rounded-lg text-center shadow-sm">
                              <p class="text-xs text-gray-500">总章节</p>
                              <p class="text-xl font-bold text-blue-500 mt-1">{{ chapters.length }}</p>
                            </div>
                            <div class="bg-white p-3 rounded-lg text-center shadow-sm">
                              <p class="text-xs text-gray-500">已完成</p>
                              <p class="text-xl font-bold text-green-500 mt-1">
                                {{ completedChapters }}
                              </p>
                            </div>
                            <div class="bg-white p-3 rounded-lg text-center shadow-sm">
                              <p class="text-xs text-gray-500">总题数</p>
                              <p class="text-xl font-bold text-orange-500 mt-1">
                                {{ totalQuestionsCount }}
                              </p>
                            </div>
                            <div class="bg-white p-3 rounded-lg text-center shadow-sm">
                              <p class="text-xs text-gray-500">已做题</p>
                              <p class="text-xl font-bold text-blue-500 mt-1">
                                {{ completedQuestionsCount }}
                              </p>
                            </div>
                          </div>

                          <!-- 各章节完成情况（限制显示7行，溢出滚动） -->
                          <div>
                            <h4 class="text-gray-800 font-bold text-sm mb-3">各章节完成进度</h4>
                            <div class="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                              <div
                                  v-for="chapter in chapters"
                                  :key="chapter.id"
                                  class="flex items-center gap-3"
                              >
                                <div class="w-38 text-sm text-gray-700 truncate line-clamp-1">
                                  {{ chapter.name }}
                                </div>
                                <div class="flex-1">
                                  <el-progress
                                      :percentage="chapter.completionRate"
                                      :stroke-width="8"
                                      :stroke="chapter.isCompleted ? '#10b981' : '#60a5fa'"
                                      bg-color="#e5e7eb"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 学习效率分析 -->
                  <div class="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <div class="bg-gray-100 px-5 py-3 border-b border-gray-200">
                      <h3 class="font-medium text-gray-800">学习效率分析</h3>
                    </div>
                    <div class="p-5">
                      <!-- 核心指标 -->
                      <div class="space-y-5 mb-6">
                        <div>
                          <div class="flex justify-between items-center mb-1">
                            <span class="text-sm text-gray-700">平均正确率</span>
                          </div>
                          <el-progress
                              :percentage="averageAccuracy"
                              :stroke-width="8"
                              stroke="#10b981"
                              bg-color="#e5e7eb"
                          />
                        </div>

                        <div>
                          <div class="flex justify-between items-center mb-1">
                            <span class="text-sm text-gray-700">章节掌握度</span>
                          </div>
                          <el-progress
                              :percentage="masteryLevel"
                              :stroke-width="8"
                              stroke="#60a5fa"
                              bg-color="#e5e7eb"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="flex justify-center items-center h-full">
                <el-empty description="暂无数据"/>
              </div>
            </template>
          </div>
        </div>
      </el-card>
    </div>

    <PracticeSetting ref="settingRef"/>
</template>

<script setup lang="ts">
import PracticeSetting from './components/PracticeSetting.vue'
import {type Chapter, questionApi, type SubjectVO} from '@/api/qbank'
import {formatPast2} from '@/utils/formatTime.ts'

const questionStore = useQBankStore()
const packageStore = usePackageStore()
const {qPackage} = storeToRefs(packageStore)
const {title, subjectId: storeSubjectId} = storeToRefs(questionStore)
const stat = useStatistics()

const subjects = ref<SubjectVO[]>([])
const loadSubjects = async () => {
  console.log('工具信息', qPackage.value)
  if (!qPackage.value.relationCategoryId) return
  try {
    subjects.value = await questionApi.getSubjectList(qPackage.value.relationCategoryId as number)
    title.value = subjects.value[0]?.aliasName || subjects.value[0]?.name || ''
    storeSubjectId.value = subjects.value[0]?.id
  } catch (err) {
    console.log(err)
  }
}

const subjectId = computed(() => subjects.value[activeCourse.value]?.id || 0)

// 状态管理
const activeCourse = ref(0)
const chapters = ref<Chapter[]>([])
const loadingChapter = ref(false)
const loadChapters = async () => {
  if (!subjectId.value) return
  chapters.value = []
  try {
    loadingChapter.value = true
    const data: Chapter[] = await questionApi.getChapterList(subjectId.value)
    chapters.value = data.map((item) => {
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

watch(
    activeCourse,
    async (val) => {
      await loadChapters()
      title.value = subjects.value[val]?.aliasName || subjects.value[val]?.name || ''
      storeSubjectId.value = subjects.value[val]?.id
    },
    {immediate: true},
)

const completionRate = computed(() => {
  if (chapters.value.length === 0) return 0

  const total = chapters.value.reduce((sum, chapter) => sum + chapter.total, 0)
  const completed = chapters.value.reduce((sum, chapter) => sum + chapter.completedCount || 0, 0)

  return Math.round((completed / total) * 100)
})

const needTime = computed(() => {
  const total = chapters.value.reduce((sum, chapter) => sum + chapter.total, 0)
  const completed = chapters.value.reduce((sum, chapter) => sum + chapter.completedCount || 0, 0)
  const count = total - completed
  return formatPast2((count * 1000 * 60) / 2)
})
const completedChapters = computed(() => {
  return chapters.value.filter((chapter) => chapter.isCompleted).length
})
const totalQuestionsCount = computed(() => {
  return chapters.value.reduce((sum, chapter) => sum + chapter.total, 0)
})
const completedQuestionsCount = computed(() => {
  return chapters.value.reduce((sum, chapter) => sum + chapter.completedCount || 0, 0)
})
// 学习效率分析数据
const averageAccuracy = computed(() => {
  if (chapters.value.length === 0) return 0

  const filterChapter = chapters.value.filter((chapter) => chapter.completedCount > 0)
  const sum = filterChapter.reduce((total, chapter) => total + chapter.accuracyRate || 0, 0)
  return Math.round(sum / chapters.value.length)
})

const masteryLevel = computed(() => {
  // 综合完成度和正确率的掌握度计算
  return Math.round((completionRate.value + averageAccuracy.value) / 2)
})

// 开始练习
const startPractice = async (chapter: Chapter) => {
  questionStore.setChapter(subjectId.value, chapter.id, chapter.name)
  const route = {
    name: 'ExamPractice',
    params: {toolId: qPackage.value.id, examMode: 'practice'},
    query: {}
  }
  if (chapter.isCompleted) {
    route.query = {restart: 'Y'}
  }
  await navigateTo(route)
  await stat.toolsUsageStat()
}

const settingRef = ref()
const handleSetting = () => {
  settingRef.value?.open(subjectId.value)
}

useHead({
  title: `章节练习-${qPackage.value.title}`,
})

onMounted(async () => {
  await loadSubjects()
  await loadChapters()
})
</script>

<style scoped>
/* 章节标题溢出处理 */
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
