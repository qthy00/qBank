<script setup lang="ts">
import {cloneDeep} from 'lodash-es'
import {questionApi, type SubjectVO} from '@/api/qbank'
import {getCurrentDate} from '@/utils/formatTime.ts'

const message = useMessage()
const router = useRouter()

const authStore = useAuthStore()
const {isLogin} = storeToRefs(authStore)

const packageStore = usePackageStore()
const {qPackage} = storeToRefs(packageStore)

const questionStore = useQBankStore()
const {mockSetting} = storeToRefs(questionStore)

const {openModal} = useModal()



const dialogVisible = ref(false)
const activeCourse = ref(0)
const subjects = ref<SubjectVO[]>([])
let subjectId = 0
// 保存原始设置用于重置
let originalSettings = {
  subjectId,
  durationMinutes: 60,
  timeMode: 'countdown', // countdown 倒计时, countup 正计时
  questionInfo: [
    { displayName: '单选题', type: 0, count: 20, score: 1, totalScore: 20},
    { displayName: '多选题', type: 1, count: 20, score: 2, totalScore: 40},
    { displayName: '判断题', type: 3, count: 20, score: 1, totalScore: 20},
    { displayName: '填空题', type: 4, count: 10, score: 2, totalScore: 20},
  ],
  randomQuestions: true,
  difficulty: 3,
  passScore: undefined,
}
const state = ref(cloneDeep(originalSettings) )
const loadSubjects = async () => {
  const categoryId = qPackage.value?.relationCategoryId as number
  if(!categoryId) return
  try {
    subjects.value = await questionApi.getSubjectList(categoryId)
    subjectId = subjects.value[0].id
  } catch (err) {
    console.log(err)
  }
}
const loadSubjectInfo = async () => {
  if(!subjectId) return
  try {
    const data = await questionApi.getSubjectPaperInfo(subjectId)
    let questionInfo = originalSettings.questionInfo
    if(data.questionInfo) {
      questionInfo = data.questionInfo
    }
    originalSettings = {
      ...originalSettings,
      questionInfo,
      passScore: data.condition.pass ?? undefined,
      durationMinutes: data.condition.time ?? state.value.durationMinutes,
    }
    state.value = cloneDeep(originalSettings)
  }catch (err) {
    console.log(err)
  }
}

watch(
  activeCourse,
  async (val) => {
    console.log('activeCourse', val, activeCourse.value)
    subjectId = subjects.value[val]?.id || 0
    await loadSubjectInfo()
  },
  { immediate: true },
)


//  实时计算总题数
const totalQuestions = computed(() => {
  return state.value.questionInfo.reduce((sum, item) => sum + item.count, 0);
});

// 实时计算总分
const totalScore = computed(() => {
  return state.value.questionInfo.reduce((sum, item) => sum + (item.count * item.score), 0);
});

// 难度设置相关
const difficultyLabels = ['简单', '较易', '中等', '较难', '困难']
const difficultyMarks = {
  1: '1',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
}

/** 打开弹窗 */
const open = async () => {
  dialogVisible.value = true
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
const emits = defineEmits(['success', 'cancel'])
const confirm = () => {
  // 基本验证
  if (totalQuestions.value <= 0) {
    message.error('至少需要设置一种题型的数量')
    return
  }

  const {durationMinutes, questionInfo, timeMode, difficulty, passScore} = state.value

  const subjectName = subjects.value[activeCourse.value]?.aliasName || subjects.value[activeCourse.value]?.name
  const title = `智能组卷·${subjectName}·${getCurrentDate('YYYY-MM-DD')}`

  // 这里只是示例，实际项目中可以导航到考试页面
  mockSetting.value = {
    title,
    subjectId,
    durationMinutes,
    totalScore: totalScore.value,
    questionInfo,
    timeMode,
    difficulty,
    passScore,
  }
  emits('success')
  dialogVisible.value = false
}

const resetSettings = () => {
  state.value = cloneDeep(originalSettings)
  message.info('已恢复默认设置')
}
const handleClose = () => {
  emits('cancel')
  dialogVisible.value = false
}


const calculateTotalScore = (index: number) => {
  const item = state.value.questionInfo[index]
  if(!item.count || !item.score) return
  // 确保count和score都是数字，避免NaN
  const count = Number(item.count) || 0
  const score = Number(item.score) || 0
  // 计算总分并保留一位小数
  item.totalScore = Number((count * score).toFixed(1))
}

watch(isLogin, async (val) => {
  if(val){
    await Promise.all([loadSubjects(), loadSubjectInfo()])
  }
})

onMounted(async () => {
  await nextTick()
  if(!isLogin.value){
    openModal('login')
    return
  }
  await Promise.all([loadSubjects(), loadSubjectInfo()])
})
</script>

<template>
  <Dialog
    v-model="dialogVisible"
    title="模拟考试参数设置"
    width="500px"
    max-height="500px"
    :before-close="handleClose"
  >
    <!-- 弹窗内容 -->
    <div class="space-y-4">

      <!-- 科目设置 -->
      <el-card
        class="px-2 border-gray-100 overflow-hidden"
      >
        <div class="flex items-center mb-4 ">
          <h3 class="font-medium text-gray-800 text-lg">选择科目</h3>
        </div>
        <div class="flex flex-wrap justify-center items-center">
          <el-button
            v-for="(course, index) in subjects"
            :key="course.id"
            :class="[
                    'm-3 px-3 py-1.5 transition-colors',
                    activeCourse === index
                      ? '!bg-blue-400 !text-white'
                      : '!bg-gray-200 text-gray-700 hover:bg-gray-300',
                  ]"
            @click="state.subjectId = course.id; activeCourse = index"
          >
            {{ course.aliasName || course.name }}
          </el-button>
        </div>
      </el-card>

      <!-- 难度设置 -->
      <el-card
        class="px-2 pb-6 border-gray-100 overflow-hidden"
      >
        <div class="flex items-center mb-4 ">
          <h3 class="font-medium text-gray-800 text-lg">难度设置</h3>
        </div>
        <div class="px-2 space-y-4">
          <el-row :gutter="10" class="items-center">
            <el-col :span="18">
              <el-slider
                v-model="state.difficulty"
                :min="1"
                :max="5"
                :marks="difficultyMarks"
                class="w-full"
              />
            </el-col>
            <el-col :span="6" class="text-center">
              <span class="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {{ difficultyLabels[state.difficulty - 1] }}
              </span>
            </el-col>
          </el-row>
        </div>
      </el-card>

      <!-- 题目设置 -->
      <el-card
        class="px-2 py-3 border-gray-100 overflow-hidden"
      >
        <div class="flex items-center mb-4">
          <h3 class="font-medium text-gray-800 text-lg">题目设置</h3>
        </div>

        <div class="space-y-4">
            <el-row v-for="(item, index) in state.questionInfo" :gutter="10">
              <el-col :span="12">
                <el-form-item
                  label-width="55px"
                  :label="item.displayName"
                >
                  <el-input-number
                    v-model="item.count"
                    :min="0"
                    :max="999"
                    class="w-full"
                    @change="calculateTotalScore(index)"
                  >
                    <template #suffix>
                      <span>题</span>
                    </template>
                  </el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="分值" label-width="40px" size="default">
                  <el-input-number
                    v-model="item.score"
                    :min="0"
                    :max="50"
                    :precision="1"
                    class="w-full"
                    @change="calculateTotalScore(index)"
                  />
                </el-form-item>
              </el-col>
            </el-row>
        </div>

        <!-- 题目统计 -->
        <div class="p-4 border-solid border-gray-100 bg-gray-50 rounded-lg">
          <div class="flex justify-between text-sm px-10">
            <span class="text-gray-600">总题数：
              <span class="font-semibold text-red-400">{{ totalQuestions }}</span>
            </span>
            <span class="text-gray-600">总分值：
              <span class="font-semibold text-red-400">{{ totalScore }}分</span>
            </span>
            <span v-if="state.passScore" class="text-gray-600">合格分：
              <span class="font-semibold text-red-400">{{ state.passScore }}分</span>
            </span>
          </div>
        </div>
      </el-card>

      <!-- 时间设置 -->
      <el-card
        class="px-2 border-gray-100 overflow-hidden"
      >
        <div class="flex items-center mb-4">
          <h3 class="font-medium text-gray-800 text-lg">时间设置</h3>
        </div>

        <div class="space-y-4">
          <el-form size="default" class="space-y-4">
            <el-form-item label="考试时长" label-width="100px">
              <el-row :gutter="10" class="items-center">
                <el-col :span="20">
                  <el-input-number
                    v-model="state.durationMinutes"
                    :min="5"
                    :max="300"
                    :step="5"
                    :precision="0"
                    class="w-full"
                    placeholder="请输入考试时长"
                  />
                </el-col>
                <el-col :span="4" class="text-gray-500 text-nowrap">分钟</el-col>
              </el-row>
            </el-form-item>

            <el-form-item class="px-8">
              <el-radio-group v-model="state.timeMode">
                <el-radio value="countdown" class="text-gray-700 py-1">
                  <div class="flex items-center">
                    <span class="mr-2">倒计时模式</span>
                    <el-tooltip effect="dark" content="时间结束后自动提交试卷" placement="right">
                      <Icon name="ep:info-filled" />
                    </el-tooltip>
                  </div>
                </el-radio>
                <el-radio value="countup" class="text-gray-700 py-1">
                  <div class="flex items-center">
                    <span class="mr-2">正计时模式</span>
                    <el-tooltip effect="dark" content="允许考试超时，不自动提交" placement="right">
                      <Icon name="ep:info-filled" />
                    </el-tooltip>
                  </div>
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>

    <!-- 弹窗底部按钮 -->
    <template #footer>
      <div class="flex justify-between ml-4">
        <el-button type="warning" plain size="large" class="px-7" @click="resetSettings">
          恢复默认
        </el-button>
        <div>
          <el-button
            type="info"
            plain
            size="large"
            class="px-7 bg-gray-200 hover:bg-gray-300 text-gray-700"
            @click="router.back()"
          >
            取 消
          </el-button>
          <el-button
            type="primary"
            size="large"
            class="px-7 bg-gradient-to-r from-blue-600 to-blue-400 border-none text-white shadow-md hover:opacity-80"
            @click="confirm()"
          >
            开始考试
          </el-button>
        </div>
      </div>
    </template>
  </Dialog>
</template>

<style scoped></style>
