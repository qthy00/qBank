<template>
  <div class="flex flex-col gap-5">
    <el-card>
      <div class="min-h-screen bg-gray-50 flex flex-col">
        <!-- 顶部导航 -->
        <div class="bg-white shadow-sm border-b border-gray-200">
          <div class="container mx-auto px-4 py-4 flex justify-between items-center">
            <!-- 左侧章节信息 -->
            <div>
              <h1 class="text-lg font-semibold text-gray-800">{{ title }}</h1>
              <p class="text-sm text-gray-500">{{ subtitle }}</p>
            </div>

            <div class="h-16">
              <button
                class="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg transition-colors text-sm font-medium shadow-sm"
                @click="goBackIndex(toolInfo.id)"
              >
                <Icon name="icon-park-outline:return" class="mr-1.5" />
                返回
              </button>
            </div>
          </div>
        </div>

        <!-- 主要内容 -->
        <main class="flex-1 container mx-auto px-4 py-5">
          <!-- 完成状态卡片 -->
          <div
            class="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden transform transition-all duration-300 hover:shadow-md"
          >
            <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
              <div class="flex justify-between items-start">
                <h2 class="flex items-center text-xl font-bold mb-1">已完成练习！</h2>
                <Icon name="heroicons:check-circle-20-solid" :size="30" />
              </div>
            </div>

            <!-- 练习统计信息 -->
            <div class="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="text-center">
                <el-statistic
                  title="总题数"
                  :value="animatedTotal"
                  :value-style="{
                      'font-size': '2.25rem',
                      'line-height': '2.5rem',
                      'font-weight': 700,
                    }"
                >
                  <template #suffix>
                    <span class="text-gray-800 ml-1">题</span>
                  </template>
                </el-statistic>
              </div>
              <div class="text-center">
                <el-statistic
                  title="正确率"
                  :value="animatedRate"
                  :value-style="{
                      'font-size': '2.25rem',
                      'line-height': '2.5rem',
                      'font-weight': 700,
                    }"
                >
                  <template #suffix>
                    <span class="text-gray-800 ml-1">%</span>
                  </template>
                </el-statistic>
              </div>
              <div class="text-center">
                <el-statistic
                  title="用时"
                  :value="animatedTime"
                  :value-style="{
                      'font-size': '2.25rem',
                      'line-height': '2.5rem',
                      'font-weight': 700,
                    }"
                >
                  <template #suffix>
                    <span class="text-gray-800 ml-1">分钟</span>
                  </template>
                </el-statistic>
              </div>
            </div>
          </div>

          <div class="bg-white shadow-sm border border-gray-100 mb-8 overflow-hidden">
            <div class="p-5 border-b border-gray-100">
              <h2 class="text-lg font-semibold text-gray-800">练习详情</h2>
            </div>

            <div class="p-6">
              <!-- 题型统计图表 -->
              <div class="mb-10">
                <h3 class="text-base font-medium text-gray-800 mb-4">题型占比</h3>
                <div class="bg-gray-50 rounded-xl p-4 h-80">
                  <Echart :options="pieOptions" :height="288" />
                </div>
              </div>

<!--              <div class="mb-8">-->
<!--                <h3 class="text-base font-medium text-gray-800 mb-4">章节掌握度</h3>-->
<!--                <div class="bg-gray-50 rounded-xl p-4 h-80">-->
<!--                  <Echart :options="masteryOptions" :height="288" />-->
<!--                </div>-->
<!--              </div>-->
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex justify-center">
            <button
              @click="goBackIndex(toolInfo.id)"
              class="py-3 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center w-full sm:w-auto"
            >
              <Icon name="heroicons:arrow-left-20-solid" class="mr-2" />
              返回章节列表
            </button>
          </div>
        </main>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useTransition } from '@vueuse/core'
import { goBackIndex, questionTypes } from './func'

const toolStore = useToolStore()
const {toolInfo} = storeToRefs(toolStore)

const questionStore = useQBankStore()
const {
  typeCounts,
  title,
  subtitle
} = storeToRefs(questionStore)

// 动画目标值
const targetTotal = ref(0)
const targetRate = ref(0)
const targetTime = ref(0)

const animatedTotal = useTransition(targetTotal, {
  duration: 1200,
})
const animatedRate = useTransition(targetRate, {
  duration: 1200,
})
const animatedTime = useTransition(targetTime, {
  duration: 1200,
})


// 章节知识点掌握度数据
const chapterMastery = [
  { name: '变量声明与作用域', score: 65, color: '#93c5fd' },
  { name: '数据类型与转换', score: 88, color: '#3b82f6' },
  { name: '运算符与表达式', score: 95, color: '#1d4ed8' },
  { name: '变量提升', score: 72, color: '#60a5fa' },
  { name: '类型检测', score: 80, color: '#4f46e5' },
  // 可在此处添加更多知识点
]

const pieData = computed(() => {
  const data = []
  for (const type in typeCounts.value) {
    const category = questionTypes.find(i => i.type == type)
    if(!category) continue
    const item = {
      name: category.name,
      value: typeCounts.value[type],
      itemStyle: {
        color: category.color,
      },
    }
    data.push(item)
  }
  return data
})

const masteryOptions = reactive({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
    formatter: '{b}: {c}分',
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'value',
    max: 100,
    axisLabel: {
      formatter: '{value}%',
    },
  },
  yAxis: {
    type: 'category',
    data: chapterMastery.map((item) => item.name),
    axisLabel: {
      interval: 0,
    },
  },
  series: [
    {
      name: '掌握度',
      type: 'bar',
      data: chapterMastery.map((item) => item.score),
      itemStyle: {
        color: function (params) {
          return chapterMastery[params.dataIndex].color
        },
        borderRadius: [0, 4, 4, 0],
      },
      label: {
        show: true,
        position: 'right',
        formatter: '{c}%',
      },
      barWidth: 24,
    },
  ],
})
const pieOptions = reactive({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c}题 ({d}%)',
  },
  legend: {
    orient: 'vertical',
    left: 10,
    textStyle: {
      fontSize: 12,
    },
  },
  series: [
    {
      name: '题型分布',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 4,
        borderColor: '#fff',
        borderWidth: 2,
      },
      // 显示标签（名称和比例）
      label: {
        show: true,
        position: 'outside',
        formatter: '{b}: {d}%',
        fontSize: 12,
      },
      labelLine: {
        show: true,
        length: 15,
        length2: 10,
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 14,
          fontWeight: 'bold',
        },
      },
      data: pieData,
    },
  ],
})

useHead({
  title: `练习结果-${toolInfo.value.title}`,
})


onMounted( () => {
  targetTotal.value = questionStore.totalCount
  targetRate.value = questionStore.correctRate
  targetTime.value = questionStore.pageTimes
})
</script>
