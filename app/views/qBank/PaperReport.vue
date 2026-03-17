<template>
  <div ref="contentRef" class="flex flex-col gap-5 bg-white">
    <!-- 得分概览卡片 -->
    <el-card>
      <div class="p-5">
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <!-- 总分信息 -->
          <div class="lg:col-span-2 flex flex-col justify-center">
            <h3 class="text-slate-500 font-medium mb-2 text-sm uppercase tracking-wide">
              最终得分
            </h3>
            <div class="flex items-baseline gap-4">
              <span class="text-[clamp(2.5rem,5vw,4rem)] font-bold text-primary">{{
                report.score
              }}</span>
              <div>
                <span class="text-slate-500">/ {{ report.totalScore }}分</span>
                <div
                  class="mt-1 flex items-center text-success text-sm"
                  v-if="report.relativeScore"
                >
                  <Icon name="raphael:arrowup" class="text-success mr-1" />
                  <span
                    >较上次 {{ report.relativeScore > 0 ? '+' : '' }}
                    {{ report.relativeScore }} 分</span
                  >
                  <span v-if="report.avgScore"> | 同城考试平均: {{ report.avgScore }}分</span>
                </div>
              </div>
            </div>

            <div class="mt-4 grid grid-cols-3 gap-4">
              <div class="bg-blue-50 rounded-lg p-3 border border-blue-100 shadow-sm">
                <p class="text-xs uppercase tracking-wider">用时：</p>
                <p class="font-semibold mt-1 text-blue-500 text-center">
                  {{ formatPast2(report.spendTime) }}
                </p>
              </div>
              <div
                v-if="report.rank"
                class="bg-blue-50 rounded-lg p-3 border border-blue-100 shadow-sm"
              >
                <p class="text-xs uppercase tracking-wider">排名：</p>
                <p class="font-semibold mt-1 text-blue-500 text-center">{{ report.rank }}</p>
              </div>
              <div class="bg-blue-50 rounded-lg p-3 border border-blue-100 shadow-sm">
                <p class="text-xs uppercase tracking-wider">完成率：</p>
                <p class="font-semibold mt-1 text-blue-500 text-center">
                  {{ report.completionRate }}%
                </p>
              </div>
            </div>
          </div>

          <!-- 得分分布图表 - 修复移动端显示问题 -->
          <div class="lg:col-span-3">
            <h3 class="text-slate-500 font-medium text-sm uppercase tracking-wide mb-3">
              得分与用时分布
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <!-- 添加明确的高度设置，确保在各种设备上都能显示 -->
              <Echart :options="scoreOptions" :height="220" />
              <Echart :options="timeOptions" :height="220" />
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 答题情况与知识点掌握 -->
    <div class="grid gap-5 mb-5">
      <!-- 答题情况 -->
      <el-card
        class="lg:col-span-2 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden"
      >
        <div class="p-6">
          <h3 class="text-base font-semibold mb-5 flex items-center text-slate-700">
            <Icon name="gg:list" class="text-primary mr-2" />
            答题情况分析
          </h3>

          <div class="space-y-5">
            <!-- 各题型得分 -->
            <div>
              <h4 class="text-slate-600 font-medium mb-4 text-sm">各题型得分详情</h4>
              <div class="space-y-5">
                <div v-for="item in report.distribution" :key="item.type">
                  <div class="flex justify-between mb-2">
                    <div class="flex items-center">
                      <span class="text-sm">{{ item.displayName }}</span>
                      <el-tooltip
                        :content="`共${item.count}题，每题${item.score}分`"
                        placement="top"
                      >
                        <Icon name="fe:question" class="text-slate-400 ml-1 cursor-help" />
                      </el-tooltip>
                    </div>
                    <span class="text-sm font-medium">{{ item.obtainScore }}/{{ item.totalScore }}</span>
                  </div>
                  <el-progress
                    :percentage="item.accuracy"
                    :stroke-width="6"
                    stroke-linecap="round"
                    class="h-1.5"
                  >
                    <span class="text-xs text-slate-500">正确率: {{ item.accuracy }}%</span>
                  </el-progress>
                </div>
              </div>
            </div>
            <!-- 正确率统计 -->
            <div>
              <h4 class="text-slate-600 font-medium mb-4 text-sm">正确率统计</h4>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <el-card
                  class="bg-slate-50 border border-slate-100 rounded-lg p-4 text-center hover:shadow-sm transition-all"
                >
                  <div class="text-3xl font-bold text-primary mb-1">{{ report.accuracy }}%</div>
                  <p class="text-slate-500 text-xs">总正确率</p>
                </el-card>

                <el-card
                  class="bg-slate-50 border border-slate-100 rounded-lg p-4 text-center hover:shadow-sm transition-all"
                >
                  <div class="text-3xl font-bold text-danger mb-1">
                    {{ 100 - report.accuracy }}%
                  </div>
                  <p class="text-slate-500 text-xs">错误率</p>
                </el-card>

                <el-card
                  class="bg-slate-50 border border-slate-100 rounded-lg p-4 text-center hover:shadow-sm transition-all"
                >
                  <div class="text-3xl font-bold text-primary mb-1">{{ report.totalAmount }}</div>
                  <p class="text-slate-500 text-xs">总题数</p>
                </el-card>

                <el-card
                  class="bg-slate-50 border border-slate-100 rounded-lg p-4 text-center hover:shadow-sm transition-all"
                >
                  <div class="text-3xl font-bold text-warning mb-1">
                    {{ report.incorrectAmount }}
                  </div>
                  <p class="text-slate-500 text-xs">错题数</p>
                </el-card>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 错题分布分析 -->
<!--    <el-card-->
<!--      class="border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden"-->
<!--    >-->
<!--      <div class="p-5">-->
<!--        <h3 class="text-base font-semibold flex items-center text-slate-700">-->
<!--          <Icon name="mingcute:warning-line" class="text-warning mr-2" />-->
<!--          错题分布分析-->
<!--        </h3>-->

<!--        <div class="grid gap-5">-->
<!--          <div class="h-64">-->
<!--            <Echart :options="mistakeOptions" :height="288" />-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </el-card>-->
  </div>

  <!-- 操作按钮 - 优化为4个按钮并自适应显示在一行 -->
  <div class="flex justify-center items-center px-4 pb-6 overflow-x-auto">
    <div class="flex gap-1 sm:gap-6 min-w-max">
      <el-button
        type="primary"
        plain
        size="default"
        @click="navigateTo(`/t/${qPackage.series}`)"
        class="px-2 sm:px-6 py-1 sm:py-3 text-sm sm:text-base h-auto whitespace-nowrap"
      >
        返回首页
      </el-button>

      <!--        <el-button-->
      <!--          type="success"-->
      <!--          plain-->
      <!--          size="default"-->
      <!--          class="px-2 sm:px-6 py-1 sm:py-3 text-sm sm:text-base h-auto whitespace-nowrap"-->
      <!--        >-->
      <!--          分享成绩-->
      <!--        </el-button>-->

      <!-- 导出按钮 -->
      <PdfExportButton
        :target-ref="contentRef"
        :header-info="headerInfo"
        type="warning"
        filename="试卷成绩单.pdf"
        button-text="下载成绩单"
        @success="handleSuccess"
        @error="handleError"
      />

      <el-button
        type="danger"
        plain
        size="default"
        @click="
            navigateTo({
              name: 'PaperReportDetail',
              params: { toolId: params.toolId },
              query: { p: query.p, up: query.up },
            })
          "
        class="px-2 sm:px-6 py-1 sm:py-3 text-sm sm:text-base h-auto whitespace-nowrap"
      >
        查看试卷判分
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type HeaderInfo } from '~/components/PdfExportButton/pdf-export-util'
import { questionTypes } from './func'
import type { PaperReport } from '~/types/qBank'
import { questionApi } from '@/api/qbank'
import { formatPast2 } from '@/utils/formatTime'
import logo from '@/assets/images/gj_logo.png'

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

const processDistributionData = (key: string) => {
  return report.value.distribution.reduce((acc, d) => {
    const category = questionTypes.find((i) => i.type === d.type)
    if (category) {
      acc.push({
        name: d.displayName,
        value:  d[key],
        itemStyle: {
          color: category.color,
        },
      })
    }
    return acc
  }, [])
}


// const chartData = {
//   chapters: report.value.chapterErrorList.map((item) => item.chapterName), // 章节名称数组
//   errorCounts: report.value.chapterErrorList.map((item) => item.errorCount), // 错题数量数组
// }

const scoreOptions = reactive({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c}分 ({d}%)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: '#eee',
    borderWidth: 1,
    textStyle: { color: '#333' },
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  legend: {
    top: 0,
    left: 'center',
    itemWidth: 10,
    itemHeight: 10,
    itemGap: 15,
    textStyle: {
      fontSize: 11,
      color: '#666',
    },
  },
  series: [
    {
      name: '得分',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '60%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 6,
        borderColor: '#fff',
        borderWidth: 2,
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
      },
      label: {
        show: true,
        position: 'center',
        formatter: function(params) {
          return `${params.seriesName}\n{total|${report.value.score}分}`;
        },
        rich: {
          total: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#165DFF',
          },
        },
      },
      labelLine: {
        show: false,
      },
      data: [],
    },
  ],
})
const timeOptions = reactive({
  tooltip: {
    trigger: 'item',
    formatter: function(params) {
      const formattedValue = formatPast2(params.value * 1000);
      // 返回最终显示的字符串
      return `${params.seriesName} <br/>${params.name}: ${formattedValue}`;
    },
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: '#eee',
    borderWidth: 1,
    textStyle: { color: '#333' },
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  legend: {
    top: 0,
    left: 'center',
    itemWidth: 10,
    itemHeight: 10,
    itemGap: 15,
    textStyle: {
      fontSize: 11,
      color: '#666',
    },
  },
  series: [
    {
      name: '用时',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '60%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 6,
        borderColor: '#fff',
        borderWidth: 2,
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
      },
      label: {
        show: true,
        position: 'center',
        formatter:  function(params) {
          return `${params.seriesName}\n{total|${formatPast2(report.value.spendTime)}}`;
        },
        rich: {
          total: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#165DFF',
          },
        },
      },
      labelLine: {
        show: false,
      },
      data: [],
    },
  ],
})
// const mistakeOptions = reactive({
//   tooltip: {
//     trigger: 'axis',
//     axisPointer: {
//       type: 'shadow',
//     },
//     formatter: '{b} 错题数: {c}',
//   },
//   grid: {
//     left: '3%',
//     right: '4%',
//     bottom: '3%',
//     containLabel: true,
//   },
//   xAxis: [
//     {
//       type: 'category',
//       data: chartData.chapters,
//       axisTick: {
//         alignWithLabel: true,
//       },
//       axisLabel: {
//         fontSize: 10,
//         interval: 0,
//       },
//     },
//   ],
//   yAxis: [
//     {
//       type: 'value',
//       min: 0,
//       tickInterval: 1,
//       axisLabel: {
//         fontSize: 12,
//       },
//     },
//   ],
//   series: [
//     {
//       name: '错题数量',
//       type: 'bar',
//       barWidth: '60%',
//       data: chartData.errorCounts,
//       itemStyle: {
//         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
//           { offset: 0, color: '#165DFF' },
//           { offset: 1, color: '#4080FF' },
//         ]),
//         borderRadius: [4, 4, 0, 0],
//       },
//     },
//   ],
// })


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

  if(scoreOptions.series && scoreOptions.series[0] && scoreOptions.series[0]['data']){
    scoreOptions.series[0]['data'] = processDistributionData('score')
  }
  if(timeOptions.series && timeOptions.series[0] && timeOptions.series[0]['data']){
    timeOptions.series[0]['data'] = processDistributionData('time')
  }

}

useHead({
  title: `试卷报告-${qPackage.value.title}`,
})


// 初始化图表
onMounted(() => {
  loadReport()
})

// 组件卸载时移除事件监听
onUnmounted(() => {})

const downloadReport = () => {}
</script>

<style scoped></style>
