<template>
  <div class="flex flex-col gap-5">
    <el-card>
      <!-- 页面标题区域 -->
      <div
        class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-500 p-4 sm:p-6 shadow-md"
      >
        <div class="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"/>
        <div
          class="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"
        />
        <div class="relative z-10">
          <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">针对性错题训练</h1>
          <p class="text-indigo-50 max-w-2xl text-center">
            聚焦知识薄弱点，快速提升你的学习效率和成绩
          </p>
        </div>
        <button
          class="float-end flex items-center bg-blue-400 hover:bg-blue-500 text-white px-3 py-1 rounded-lg transition-colors text-sm font-medium shadow-sm hover:shadow"
          @click="navigateTo(`/t/${qPackage.series}`)"
        >
          <Icon name="icon-park-outline:return" class="mr-1.5" />
          返回
        </button>
      </div>

      <!-- 数据概览卡片组 -->
      <div class="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <!-- 总错题数 -->
        <div
          v-for="item in summary"
          :key="item.title"
          class="bg-blue-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
        >
          <div class="p-5">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-neu-500 text-sm font-medium">{{ item.title }}</p>
                <h3 class="text-3xl font-bold text-primary mt-2 transition-colors duration-300">
                  {{ item.value }}
                </h3>
              </div>
              <div
                class="w-12 h-12 rounded-full bg-blue-300 flex items-center justify-center text-white shadow-sm transition-colors duration-300"
              >
                <Icon :name="item.icon" :size="22" />
              </div>
            </div>
            <div class="mt-3 text-xs text-slate-500">
              <span class="flex items-center" :class="item.color">
                <Icon :name="item.relIcon" class="mr-1" />
                {{ item.desc }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 错题类型分布 -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-5 mb-8">
        <h2 class="text-lg font-semibold text-slate-800 mb-5">错题类型分布</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <!-- 单选题 -->
          <div
            v-for="item in distribution"
            :key="item.name"
            class="bg-slate-50 rounded-lg p-4 hover:shadow-sm transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs text-slate-500 font-medium">{{ item.name }}</p>
                <p class="text-lg font-semibold text-slate-800 mt-1">{{ item.value }}</p>
              </div>
              <div
                class="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center"
                :class="`text-${item.color}-600 bg-${item.color}-100`"
              >
                <Icon :name="item.icon" :size="18" />
              </div>
            </div>
            <el-progress
              class="mt-3 w-full"
              :percentage="item.percentage"
              :stroke-width="8"
              :show-text="false"
              :color="item.color"/>
          </div>
        </div>
      </div>

      <!-- 一键训练按钮 -->
      <div class="mb-8 flex justify-center">
        <el-button
          size="large"
          type="primary"
          :disabled="!wrongQuestions || wrongQuestions.length === 0"
          class="gap-3 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl text-white px-12 py-6 rounded-full text-lg font-medium transform hover:scale-105 active:scale-98"
          @click="handlePractice()"
        >
          <Icon name="mage:play-circle-fill" :size="24" class="mr-1" />
          <span class="">开始智能错题训练</span>
        </el-button>
      </div>

      <!-- 错题列表区域 -->
      <div v-loading="loading" class="bg-blue-50 shadow-sm overflow-hidden mb-8">
        <!-- 优化的筛选区域 -->
        <div class="p-5">
          <!-- 优化后的列表标题栏 -->
          <div class="py-3 border-b border-slate-100 flex justify-between items-center">
            <h3 class="text-sm font-semibold text-slate-800">错题列表</h3>
            <div class="flex items-center">
              <span
                class="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full flex items-center"
              >
                <span class="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-1.5"/>
                共 {{ total }} 题
              </span>
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <el-select
              v-model="queryParams.subjectId"
              placeholder="选择科目"
              size="small"
              class="w-full border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              @change="loadWrongQuestion"
            >
              <el-option label="全部科目" value="" />
              <el-option
                v-for="subject in subjects"
                :key="subject.id"
                :label="subject.aliasName"
                :value="subject.id"
              />
            </el-select>
            <el-select
              v-model="queryParams.type"
              placeholder="题目类型"
              size="small"
              class="w-full border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              @change="loadWrongQuestion"
            >
              <el-option label="全部类型" :value="-1"/>
              <el-option
                v-for="type in typeMap"
                :key="type.value"
                :label="type.type"
                :value="type.value"
              />
            </el-select>
          </div>
        </div>

        <!-- 优化的错题卡片列表 - 更紧凑统一 -->
        <div class="p-2 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
          <div v-for="question in wrongQuestions" :key="question.id">
            <el-card>
              <!-- 题型标签 - 明确显示在顶部 -->
              <div class="flex justify-between items-start mb-2">
                <span
                  :class="getSubQuestionTypeClass(question.type)"
                  class="px-2 py-0.5 rounded-full text-xs font-medium">
                  {{ typeNames[question.type] }}
                </span>
                <div class="flex items-center gap-1">
                  <span class="text-slate-500 text-xs">难度:</span>
                  <el-rate
                    v-model="question.difficulty"
                    disabled
                    size="small"
                  />
                </div>
              </div>

              <!-- eslint-disable-next-line vue/no-v-html -->
              <div class="text-sm text-slate-700 line-clamp-2 mb-2" v-html="question.content" />

              <!-- 错误信息 - 紧凑布局 -->
              <div
                class="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100"
              >
                <div class="flex items-center gap-4">
                  <span class="flex items-center">
                    <Icon name="typcn:warning-outline" :size="15" class="mr-1 text-error" />
                    {{ question.mistakeCount }}次
                  </span>
                  <span class="flex items-center">
                    <Icon name="clarity:clock-line" :size="15" class="mr-1 text-primary" />
                    {{ formatDate(question.lastReviewTime, 'YYYY-MM-DD') }}
                  </span>
                </div>

                <div class="flex gap-1">
                  <el-button
                    type="primary"
                    class="bg-blue-100 text-blue-700 hover:text-white hover:bg-blue-600 p-1 px-3 rounded transition-all text-xs h-5"
                    @click="handlePractice(question.id)"
                  >
                    单刷错题
                  </el-button>
                </div>
              </div>
            </el-card>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="wrongQuestions.length === 0" class="py-16 text-center">
          <div
            class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Icon name="mingcute:empty-box-line" :size="32" class="text-slate-400" />
          </div>
          <h3 class="text-lg font-medium text-slate-700 mb-1">暂无错题数据</h3>
          <p class="text-slate-500 text-sm max-w-md mx-auto">
            当前筛选条件下没有找到错题，请尝试调整筛选条件或开始新的练习
          </p>
        </div>

        <!-- 分页 -->
        <Pagination
          v-model:limit="queryParams.pageSize"
          v-model:page="queryParams.pageNo"
          :total="total"
          @pagination="loadWrongQuestion"
        />

      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { questionApi, type SubjectVO, typeNames } from '@/api/qbank'
import { getSubQuestionTypeClass, typeMap } from './func.ts'
import type { WrongQuestion } from '~/types/qBank'
import { formatDate } from '@/utils/formatTime.ts'

const stat = useStatistics()

const packageStore = usePackageStore()
const {qPackage} = storeToRefs(packageStore)

const questionStore = useQBankStore()


const loading = ref(false)
const summary = reactive([
  {
    title: '总错题数',
    value: 86,
    icon: 'solar:document-broken',
    color: 'text-success',
    relIcon: 'mdi:arrow-up-bold',
    desc: '较上周增加12题',
  },
  {
    title: '已掌握',
    value: 32,
    icon: 'iconoir:learning',
    color: 'text-success',
    relIcon: 'eos-icons:master-outlined',
    desc: '掌握率提升8%',
  },
  {
    title: '未掌握',
    value: 54,
    icon: 'eos-icons:master-outlined',
    color: 'text-warning',
    relIcon: 'fluent:important-32-regular',
    desc: '重点攻克内容',
  },
  {
    title: '正确率',
    value: '37%',
    icon: 'streamline:heart-rate-search-remix',
    color: 'text-success',
    relIcon: 'mdi:arrow-up-bold',
    desc: '较上周提升5%',
  },
])

const distribution = ref([])

// 筛选条件
const queryParams = reactive({
  pageSize: 24,
  pageNo: 1,
  categoryId: qPackage.value.relationCategoryId,
  subjectId: undefined,
  type: undefined,
  random: false,
  mastery: false,
})

const subjects = ref<SubjectVO[]>([])
const loadSubjects = async () => {
  if(!queryParams.categoryId) return
  try {
    subjects.value = await questionApi.getSubjectList(queryParams.categoryId)
  } catch (err) {
    console.log(err)
  }
}

const total = ref(0)
// 错题数据
const wrongQuestions = ref<WrongQuestion[]>([])

const loadWrongQuestion = async () => {
  if (!queryParams.categoryId && !queryParams.subjectId ) return

  const params = {
    ...queryParams,
    subjectId: queryParams.subjectId === '' ? undefined : queryParams.subjectId,
    status: 13
  }
  loading.value = true
  try {
    const data = await questionApi.getWrongQuestionList(params)
    total.value = data.total
    wrongQuestions.value = data.list
  } catch {
    /* empty */
  } finally {
    loading.value = false
  }
}

const loadSummary = async () => {
  if(!queryParams.categoryId) return
  try{
    const data = await questionApi.getMistakeStats(queryParams.categoryId)
    summary[0].value = data.totalCount
    summary[0].desc = data.countDiff > 0 ? `较上周增加${data.countDiff}题` : `较上周减少${data.countDiff}题`
    summary[0].relIcon = data.countDiff > 0 ? `mdi:arrow-up-bold` : `mdi:arrow-down-bold`
    summary[0].color = data.countDiff > 0 ? 'text-success' : 'text-error'
    summary[1].value = data.masteredCount
    summary[1].desc = `掌握率${data.masteredRate}%`
    summary[2].value = data.totalCount - data.masteredCount || 0
    summary[3].value = data.accuracy || 0 + '%'
    summary[3].desc = data.accuracyDiff > 0 ? `较上周提升${data.accuracyDiff}%` : `较上周降低${data.accuracyDiff}%`
    summary[3].color = data.accuracyDiff > 0 ? 'text-success' : 'text-error'
    summary[3].relIcon = data.accuracyDiff > 0 ? `mdi:arrow-up-bold` : `mdi:arrow-down-bold`

    distribution.value = data.typeStats.map((item) => {
      return {
        name: typeNames[item.questionType],
        value: item.count,
        color: typeMap[item.questionType].color,
        icon: typeMap[item.questionType].icon,
        percentage: Math.round(item.percentage),
      }
    })
  }catch {
    /* empty */
  }

}

// 前往详情页
const handlePractice = async (id?: number) => {
  questionStore.setChapter( undefined, undefined, '')
  const route:any = {
    name: 'ExamPractice',
    params: { toolId: qPackage.value.id, examMode: 'mistake' },
  }
  if(id) {
    route.query = { qid: id }
  }
  await stat.toolsUsageStat()
  await navigateTo(route)
}


useHead({
  title: `错题训练-${qPackage.value.title}`,
})

onMounted(async () => {
  await Promise.all([
    loadSummary(),
    loadSubjects(),
    loadWrongQuestion()
  ])
})
</script>

<style scoped>
/* 文本截断样式 - 固定2行 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.5em; /* 确保即使只有一行也保持相同高度 */
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(148, 163, 184, 0.5);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(148, 163, 184, 0.8);
}

/* Element UI 组件样式优化 */
:deep(.el-select .el-input__wrapper),
:deep(.el-input .el-input__wrapper) {
  border-radius: 6px;
  box-shadow: none;
  transition: all 0.2s ease;
}

:deep(.el-select .el-input__wrapper:hover),
:deep(.el-input .el-input__wrapper:hover) {
  border-color: #94a3b8;
  box-shadow: none;
}

:deep(.el-select .el-input__wrapper:focus-within),
:deep(.el-input .el-input__wrapper:focus-within) {
  border-color: #6366f1;
  box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.2);
}

:deep(.el-button) {
  border-radius: 6px;
  transition: all 0.2s ease;
}

:deep(.el-card) {
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

:deep(.el-dropdown-menu) {
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  animation: fade-in 0.2s ease-out;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

:deep(.el-dropdown-item) {
  transition: all 0.15s ease;
}

:deep(.el-dropdown-item:hover) {
  background-color: #f8fafc;
  color: #6366f1;
}

:deep(.el-rate__icon) {
  transition: all 0.2s ease;
}

:deep(.el-switch) {
  --el-switch-on-color: #10b981;
  --el-switch-off-color: #f59e0b;
}
</style>
