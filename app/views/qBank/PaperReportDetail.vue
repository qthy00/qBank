<template>
  <div ref="contentRef" class="flex flex-col gap-5 bg-white">
    <!-- 试卷基本信息卡片 - 合并题型得分概述 -->
    <el-card>
      <div class="p-4 sm:p-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-4 sm:mb-6">
          <div>
            <h1 class="text-xl sm:text-2xl font-bold text-slate-800 mb-2">
              {{ report.paperTitle }}
            </h1>
            <p class="text-slate-500">考试时间: {{ formatDate(report.startTime) }}</p>
          </div>

          <div class="mt-4 md:mt-0 flex flex-wrap items-center gap-3 sm:gap-4">
            <div
              class="text-center bg-blue-50 px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-sm border border-slate-100 min-w-[90px] sm:min-w-[100px]"
            >
              <p class="text-xs sm:text-sm text-slate-500">总分</p>
              <p class="text-2xl sm:text-3xl font-bold text-primary mt-1">
                {{ report.totalScore }}分
              </p>
            </div>
            <div
              class="text-center bg-blue-50 px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-sm border border-slate-100 min-w-[90px] sm:min-w-[100px]"
            >
              <p class="text-xs sm:text-sm text-slate-500">你的得分</p>
              <p class="text-2xl sm:text-3xl font-bold text-success mt-1">{{ report.score }}分</p>
            </div>
            <div
              class="text-center bg-blue-50 px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-sm border border-slate-100 min-w-[90px] sm:min-w-[100px]"
            >
              <p class="text-xs sm:text-sm text-slate-500">用时</p>
              <p class="text-2xl sm:text-3xl font-bold text-slate-700 mt-1">
                {{ formatPast2(report.spendTime) }}
              </p>
            </div>
          </div>
        </div>

        <!-- 题型得分概况 - 原图表位置 -->
        <div>
          <h2 class="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4">
            题型得分概况
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            <el-card
              v-for="item in report.distribution"
              :key="item.type"
              class="bg-blue-50 border-blue-100 overflow-hidden transition-all hover:shadow-md"
            >
              <div class="p-3 sm:p-4">
                <div class="flex justify-between items-start">
                  <div>
                    <p class="text-xs sm:text-sm text-blue-600">{{ getTypeName(item.type) }}</p>
                    <p class="text-xl sm:text-2xl font-bold mt-1">
                      {{ item.score }}/{{ item.totalScore }}
                    </p>
                  </div>
                  <div
                    class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center"
                  >
                    <Icon name="ep:circle-check" class="text-blue-600" :size="16" />
                  </div>
                </div>
                <el-progress :percentage="80" :stroke-width="3" class="mt-2 sm:mt-3"/>
                <p class="text-[10px] sm:text-xs text-slate-500 mt-1 sm:mt-2">
                  正确率: {{ item.accuracy }}%
                </p>
              </div>
            </el-card>
          </div>
        </div>
      </div>
    </el-card>
    <!-- 题目列表及判分详情 -->
    <el-card class="mb-5 sm:mb-6 border-0 shadow-md">
      <div class="p-4 sm:p-6">
        <h2 class="text-base sm:text-lg font-semibold text-slate-800 mb-4 sm:mb-6">
          题目详情与判分
        </h2>

        <!-- 题目分类列表 -->
        <div
          v-for="(category, categoryIndex) in list"
          :key="categoryIndex"
          class="category-section"
        >
          <!-- 分类标题 -->
          <CategoryHeader
            :index="categoryIndex"
            :type="category.type"
            :total="category.total"
            :score="category.score"
            :type-name="category.typeName"
          />
          <!-- 复合题 -->
          <template v-if="[6, 8].includes(category.type)">
            <div  v-for="question in category.questions" :key="question.id" class="mb-4 sm:mb-5">
              <div class="p-3 sm:p-4 bg-indigo-50 border-b border-indigo-100 rounded-2xl mt-3">
                <h4 class="font-medium text-indigo-800 mb-2 text-sm sm:text-base">
                  第{{question.sort}}题 {{ category.type === 6 ? '案例背景' : '通用题干' }}
                </h4>
                <div
                  class="text-slate-700 text-sm leading-relaxed"
                  v-html="question.parentQuestion"
                />
              </div>
              <div class="questions-container space-y-4 mt-3">
                <QuestionItem
                  v-for="q in question.questionList"
                  :key="q.id"
                  :question="q"
                  :type="q.parentSonType"
                  :sort="q.parentSonOrder"
                  :single-score="category.score"
                />
              </div>
            </div>
          </template>
          <template v-else>
            <!-- 题目列表 -->
            <div class="questions-container space-y-4 mt-3">
              <QuestionItem
                v-for="question in category.questions"
                :key="question.id"
                :question="question"
                :type="question.type"
                :sort="question.sort"
                :single-score="category.score"
              />
            </div>
          </template>
        </div>

      </div>
    </el-card>
  </div>
  <!-- 操作按钮 - 优化为4个按钮并自适应显示在一行 -->
  <div class="flex justify-center items-center px-4 pb-6 overflow-x-auto">
    <div class="flex gap-1 sm:gap-6 min-w-max">
      <el-button
        type="primary"
        plain
        size="default"
        class="px-2 sm:px-6 py-1 sm:py-3 text-sm sm:text-base h-auto whitespace-nowrap"
        @click="navigateTo(`/t/${qPackage.series}`)"
      >
        返回首页
      </el-button>

<!--      <el-button-->
<!--        type="success"-->
<!--        plain-->
<!--        size="default"-->
<!--        class="px-2 sm:px-6 py-1 sm:py-3 text-sm sm:text-base h-auto whitespace-nowrap"-->
<!--      >-->
<!--        分享成绩-->
<!--      </el-button>-->

      <!-- 导出按钮 -->
      <PdfExportButton
        :target-ref="contentRef"
        :header-info="headerInfo"
        type="warning"
        filename="试卷报告.pdf"
        button-text="下载报告"
        @success="handleSuccess"
        @error="handleError"
      />

      <el-button
        type="danger"
        plain
        size="default"
        class="px-2 sm:px-6 py-1 sm:py-3 text-sm sm:text-base h-auto whitespace-nowrap"
        @click="
            navigateTo({ name: 'PaperReport', params: { toolId: params.toolId }, query: { p: query.p, up: query.up } })
          "
      >
        查看考试报告
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import CategoryHeader from './components/report/CategoryHeader.vue'
import QuestionItem from './components/report/QuestionItem.vue'
import type { HeaderInfo } from '~/components/PdfExportButton/pdf-export-util'
import type { PaperReport, QuestionAnswerVO } from '~/types/qBank'
import { getTypeName } from './func'
import { formatDate, formatPast2 } from '@/utils/formatTime'
import { questionApi } from '@/api/qbank'
import logo from '@/assets/images/gj_logo.png'

const { push } = useRouter()
const { params, query } = useRoute()
const message = useMessage()

const packageStore = usePackageStore()
const {qPackage} = storeToRefs(packageStore)

const paperId = query.p as unknown as number
const memberPaperId = query.up as unknown as number

// 内容容器的ref
const contentRef = ref<HTMLElement | null>(null);
// 页头信息
const headerInfo: HeaderInfo = {
  title: 'Paper Report',  // 报告标题
  logoUrl: logo
}
// 处理导出成功
const handleSuccess = () => {
  message.success('导出成功')
}

// 处理导出错误
const handleError = (error: Error) => {
  message.error(`导出失败: ${error.message}`);
  console.error('PDF导出错误:', error);
}

const report = ref<PaperReport>({
  paperId: undefined,
  paperTitle: '2023年度数学学科模拟考试',
  startTime: 1757932866000,
  score: 86,
  totalScore: 100,
  avgScore: 72,
  relativeScore: 5,
  spendTime: 42 * 60 * 1000,
  rank: '前15%',
  completionRate: 100,
  distribution: [],
  accuracy: 86,
  totalAmount: 43,
  incorrectAmount: 6,
  chapterErrorList: [
    { chapterId: 1, chapterName: '第1章', errorCount: 1 },
    { chapterId: 2, chapterName: '第2章', errorCount: 2 },
    { chapterId: 3, chapterName: '第3章', errorCount: 3 },
    { chapterId: 4, chapterName: '第4章', errorCount: 4 },
    { chapterId: 5, chapterName: '第5章', errorCount: 5 },
    { chapterId: 6, chapterName: '第6章', errorCount: 6 },
    { chapterId: 1, chapterName: '第1章', errorCount: 1 },
    { chapterId: 2, chapterName: '第2章', errorCount: 2 },
    { chapterId: 3, chapterName: '第3章', errorCount: 3 },
    { chapterId: 4, chapterName: '第4章', errorCount: 4 },
    { chapterId: 5, chapterName: '第5章', errorCount: 5 },
    { chapterId: 6, chapterName: '第6章', errorCount: 6 },
  ],
})

const list = ref<QuestionAnswerVO[]>([])

const loadReport = async () => {
  if(!paperId || !memberPaperId) {
    return
  }
  const res = await questionApi.getPaperReport({paperId, memberPaperId})
  const distribution = res.distribution.map((item) => {
    return {
      ...item,
      accuracy: item.accuracy * 100,
    }
  })

  report.value = {
    ...res,
    distribution,
    accuracy: res.accuracy * 100,
    completionRate: res.completionRate * 100,
  }
}

const loadReportDetail = async () => {
  if(!paperId || !memberPaperId) {
    return
  }
  list.value = await questionApi.getPaperReportDetail({paperId, memberPaperId})
  console.log(list.value)
}

useHead({
  title: `试卷报告-${qPackage.value.title}`,
})
// 初始化图表
onMounted(async () => {
  await Promise.all([
    loadReport(),
    loadReportDetail()
  ])
})


</script>

<style scoped>
/* 基础动画效果 */
.el-button {
  transition: all 0.2s ease;
}

/* 滚动条美化 */
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 题目选项悬停效果优化 */
div:deep(.el-card__body) {
  padding: 0;
}

/* 响应式调整 - 小屏幕设备 */
@media (max-width: 640px) {
  /* 强制换行，避免内容溢出 */
  .text-nowrap {
    white-space: normal !important;
  }

  /* 减小按钮内边距 */
  .el-button {
    padding: 6px 10px !important;
  }

  /* 优化小屏幕下的题型卡片布局 */
  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 超小屏幕设备 */
@media (max-width: 360px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
