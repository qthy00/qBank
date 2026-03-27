<template>
  <ClientOnly>
    <div class="min-h-screen bg-gray-50">
      <!-- 整体用el-card包裹，保持风格统一 -->
      <el-card class="border border-gray-200 shadow-sm">
        <!-- 页面标题区 -->
        <div class="flex justify-between">
          <div class="p-6 border-b border-gray-100">
            <h1 class="text-2xl md:text-3xl font-bold text-gray-800">{{ examInfo.name }}</h1>
            <p class="text-gray-500 mt-1">最后更新：{{ examInfo.lastUpdated }}</p>
          </div>
          <el-button
              class="flex items-center bg-blue-400  text-white px-3 py-1 rounded-lg transition-colors text-sm font-medium shadow-sm hover:shadow"
              @click="navigateTo(`/t/${qPackage.series}`)"
          >
            <Icon name="icon-park-outline:return" class="mr-1.5"/>
            返回
          </el-button>
        </div>

        <!-- 主要内容区 -->
        <div class="p-6">
          <!-- 报考流程概览 -->
          <div class="mb-10">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">报考流程概览</h2>
            <div class="bg-indigo-50 border-l-4 border-indigo-500 p-4 mb-6">
              <p class="text-gray-700 italic">
                报考流程包括注册账号、填写信息、上传材料、缴纳费用、打印准考证等步骤，请考生提前了解并做好准备。
              </p>
            </div>

            <!-- 步骤流程 -->
            <div class="relative">
              <!-- 连接线 -->
              <div class="hidden md:block absolute top-6 left-0 right-0 h-0.5 bg-gray-200 -z-10"/>

              <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                <!-- 动态渲染流程步骤 -->
                <div v-for="(step, index) in applicationSteps" :key="index" class="flex flex-col items-center">
                  <div
                      class="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center font-medium mb-3 z-10">
                    {{ index + 1 }}
                  </div>
                  <div class="bg-white border border-gray-200 rounded-lg p-3 text-center shadow-sm w-full">
                    <h3 class="font-medium text-gray-800 text-sm mb-1">{{ step.title }}</h3>
                    <p class="text-gray-500 text-xs">{{ step.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 报考时间安排 -->
          <div class="mb-10">
            <h2 class="text-xl font-semibold text-gray-800 mb-6">报考时间安排</h2>

            <div class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div class="overflow-x-auto">
                <table class="min-w-full">
                  <thead>
                  <tr class="bg-gray-50 border-b border-gray-200">
                    <th class="py-3 px-4 text-left text-sm font-medium text-gray-700">事项</th>
                    <th class="py-3 px-4 text-left text-sm font-medium text-gray-700">时间</th>
                    <th class="py-3 px-4 text-left text-sm font-medium text-gray-700">备注</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr
v-for="(schedule, index) in scheduleItems" :key="index"
                      class="border-b border-gray-200 hover:bg-gray-50"
                      :class="{ 'border-0': index === scheduleItems.length - 1 }">
                    <td class="py-3 px-4 text-sm text-gray-800 font-medium">{{ schedule.event }}</td>
                    <td class="py-3 px-4 text-sm text-gray-600">{{ schedule.time }}</td>
                    <td class="py-3 px-4 text-sm text-gray-600">{{ schedule.notes }}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- 报考条件 -->
          <div class="mb-10">
            <h2 class="text-xl font-semibold text-gray-800 mb-6">报考条件</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- 基本条件 -->
              <div class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div class="bg-gray-50 px-5 py-3 border-b border-gray-200">
                  <h3 class="font-medium text-gray-800">基本条件</h3>
                </div>
                <div class="p-5">
                  <ul class="space-y-3">
                    <li v-for="(condition, index) in basicConditions" :key="index" class="flex items-start">
                      <Icon name="material-symbols:check-circle" class="text-green-500 mt-0.5 mr-2 flex-shrink-0"/>
                      <span class="text-gray-600 text-sm">{{ condition }}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- 学历要求 -->
              <div class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div class="bg-gray-50 px-5 py-3 border-b border-gray-200">
                  <h3 class="font-medium text-gray-800">学历与专业要求</h3>
                </div>
                <div class="p-5">
                  <ul class="space-y-3">
                    <li v-for="(requirement, index) in educationRequirements" :key="index" class="flex items-start">
                      <Icon name="material-symbols:school" class="text-blue-500 mt-0.5 mr-2 flex-shrink-0"/>
                      <span class="text-gray-600 text-sm">{{ requirement }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- 报考材料 -->
          <div class="mb-10">
            <h2 class="text-xl font-semibold text-gray-800 mb-6">报考所需材料</h2>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
v-for="(material, index) in requiredMaterials" :key="index"
                   class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div class="flex items-center mb-3">
                  <div
:class="material.iconBgClass"
                       class="w-10 h-10 rounded-full flex items-center justify-center mr-3">
                    <Icon :name="material.icon" :class="material.iconColorClass" :size="20"/>
                  </div>
                  <h3 class="font-medium text-gray-800">{{ material.title }}</h3>
                </div>
                <ul class="space-y-2 text-gray-600 text-sm pl-13">
                  <li v-for="(item, i) in material.items" :key="i">{{ item }}</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- 常见问题 -->
          <div>
            <h2 class="text-xl font-semibold text-gray-800 mb-6">报考常见问题</h2>

            <div class="space-y-4">
              <div
v-for="(faq, index) in faqItems" :key="index"
                   class="border border-gray-200 rounded-lg overflow-hidden">
                <div class="bg-gray-50 px-5 py-3 cursor-pointer" @click="toggleFAQ(index)">
                  <div class="flex justify-between items-center">
                    <h3 class="font-medium text-gray-800">{{ faq.question }}</h3>
                    <Icon
                        :name="expandedFAQs[index] ? 'material-symbols:expand-less' : 'material-symbols:expand-more'"
                        class="text-gray-500"
                    />
                  </div>
                </div>

                <div v-if="expandedFAQs[index]" class="p-5 border-t border-gray-200">
                  <p class="text-gray-600 text-sm">
                    {{ faq.answer }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import {formatDate} from '@/utils/formatTime.ts'
import {questionApi} from '@/api/qbank'

const packageStore = usePackageStore()
const {qPackage} = storeToRefs(packageStore)



useHead({
  title: `报考指南-${qPackage.value.title}`,
  meta: [
    { name: 'keywords', content:  qPackage.value?.title },
    { name: 'description', content: qPackage.value?.description },
    { name: 'author', content: '好游科技' }
  ],
})


const currentYear = new Date().getFullYear();
// 考试基本信息 - 可根据不同考试类型修改
const examInfo = reactive({
  name: `${currentYear}年度 ${qPackage.value?.title.replace('刷题', '')}报考指南`,
  lastUpdated: `${currentYear}年1月1日`
})

// 报考流程步骤 - 可动态调整
const applicationSteps = reactive([
  {title: '网上注册', description: '创建报考账号'},
  {title: '填写信息', description: '完善个人资料'},
  {title: '上传材料', description: '提交证明文件'},
  {title: '缴纳费用', description: '完成报考缴费'},
  {title: '打印准考证', description: '考前准备工作'}
])

// 时间安排 - 可根据不同考试类型修改
const scheduleItems = reactive([
  {event: '报名开始时间', time: '2024年3月1日 9:00', notes: '官网开放报名系统'},
  {event: '报名截止时间', time: '2024年3月31日 17:00', notes: '逾期不再受理'},
  {event: '考试时间', time: '2024年5月25日', notes: '具体场次见准考证'},
  {event: '查分时间', time: '2024年5月25日', notes: '建议等待官方通知'}
])

// 基本条件
const basicConditions = reactive([
  '具有中华人民共和国国籍',
  '遵守宪法和法律，具有良好的品行',
  '具有正常履行职责的身体条件',
  '具备规定的学历和专业要求'
])

// 学历要求
const educationRequirements = reactive([
  '本科及以上学历，相关专业毕业',
  '专科毕业需从事相关工作满2年',
  '在校研究生可凭本科学历报考',
  '非相关专业需提供培训证明'
]);

// 所需材料
const requiredMaterials = reactive([
  {
    title: '身份证明',
    icon: 'material-symbols:person',
    iconBgClass: 'bg-blue-100',
    iconColorClass: 'text-blue-600',
    items: [
      '身份证正反面扫描件',
      '港澳台居民需提供通行证',
      '外籍考生需提供护照'
    ]
  },
  {
    title: '学历证明',
    icon: 'material-symbols:menu-book',
    iconBgClass: 'bg-green-100',
    iconColorClass: 'text-green-600',
    items: [
      '毕业证书扫描件',
      '学位证书扫描件',
      '学信网学历认证报告'
    ]
  },
  {
    title: '照片',
    icon: 'material-symbols:photo-camera',
    iconBgClass: 'bg-purple-100',
    iconColorClass: 'text-purple-600',
    items: [
      '近期免冠彩色证件照',
      '尺寸：295×413像素',
      '格式：JPG/JPEG，大小20-50KB'
    ]
  },
  {
    title: '工作证明',
    icon: 'material-symbols:work',
    iconBgClass: 'bg-yellow-100',
    iconColorClass: 'text-yellow-600',
    items: [
      '工作经历证明（专科考生）',
      '单位盖章的在职证明',
      '岗位相关证明文件'
    ]
  },
  {
    title: '其他材料',
    icon: 'material-symbols:description',
    iconBgClass: 'bg-red-100',
    iconColorClass: 'text-red-600',
    items: [
      '非相关专业培训证明',
      '学历认证报告（境外学历）',
      '符合优惠政策的证明材料'
    ]
  }
])

// 常见问题
const faqItems = reactive([
  {
    question: '报名信息填写错误可以修改吗？',
    answer: '报名信息在缴费前可自行修改，缴费成功后部分关键信息（如姓名、身份证号、报考级别等）将无法修改。如需修改重要信息，请在规定的信息修改期内提交书面申请，经审核通过后方可修改。建议报名时仔细核对信息，确保准确无误。'
  },
  {
    question: '照片上传有什么具体要求？',
    answer: '照片须为近期免冠彩色证件照，背景为白色或浅蓝色；尺寸为295×413像素（宽×高），相当于1寸证件照；格式为JPG/JPEG，文件大小在20-50KB之间；照片清晰，头部占比合适，面部特征完整可见，不得佩戴帽子、墨镜等饰品。建议使用官方提供的照片处理工具进行裁剪和压缩，避免因照片不符合要求导致报名失败。'
  },
  {
    question: '如何查询报名状态和审核结果？',
    answer: '考生可登录报名系统，在"个人中心-我的报名"中查询报名状态。报名状态分为：未提交、待审核、审核通过、审核不通过、已缴费、报名成功等。审核结果通常在提交报名信息后1-3个工作日内公布，审核不通过的考生会收到具体原因提示，请根据提示修改后重新提交。缴费成功后，报名状态将显示为"报名成功"。'
  },
  {
    question: '报名后可以更改考试地点吗？',
    answer: '报名缴费成功后原则上不允许更改考试地点。如确有特殊情况需要变更，需在规定时间前提交书面申请，并提供相关证明材料，经考试机构审核批准后方可变更，且仅能变更至尚有考位的考点。变更考试地点可能产生额外费用，请考生在报名时慎重选择考试地点。'
  },
  {
    question: '报名费用可以退还吗？',
    answer: '已缴纳的报名费用，在以下情况可申请退还：报名信息审核未通过；因不可抗力导致考试取消。其他情况（如个人原因无法参加考试）不予退费。退费申请需在规定时间内提交，经审核通过后，费用将按原支付路径退回，到账时间约为1-2周。请考生合理安排时间，慎重报名缴费。'
  }
])

// 控制FAQ展开/折叠状态
const expandedFAQs = ref(Array(faqItems.length).fill(false))

// 切换FAQ展开/折叠状态
const toggleFAQ = (index) => {
  expandedFAQs.value[index] = !expandedFAQs.value[index];
}

const getSchedule = async () => {
  if (!qPackage.value?.relationCategoryId) return
  try {
    const data = await questionApi.getExamInfo(qPackage.value.relationCategoryId)
    scheduleItems[0].time = formatDate(data.registerTimes[0], 'YYYY年MM月DD日 HH:mm')
    scheduleItems[1].time = formatDate(data.registerTimes[1], 'YYYY年MM月DD日 HH:mm')
    scheduleItems[2].time = formatDate(data.examTimes, 'YYYY年MM月DD日')
    scheduleItems[3].time = formatDate(data.scoreTimes, 'YYYY年MM月DD日')
  } catch (e) {
  }
}

onMounted(() => {
  getSchedule()
})
</script>

<style scoped>
/* 通用样式，与备考计划页面保持一致 */
.text-sm {
  font-size: 0.875rem;
}

.text-xs {
  font-size: 0.75rem;
}

/* 表格样式 */
table {
  border-collapse: collapse;
}

/* 标记样式，保持统一的色彩系统 */
.bg-blue-50 {
  background-color: #eff6ff;
}

.text-blue-700 {
  color: #1d4ed8;
}

.bg-yellow-50 {
  background-color: #fef3c7;
}

.text-yellow-700 {
  color: #b45309;
}

.bg-gray-100 {
  background-color: #f3f4f6;
}

</style>

