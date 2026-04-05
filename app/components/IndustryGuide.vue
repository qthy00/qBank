<template>
  <Dialog
    v-model="visible"
    :title="dialogTitle"
    width="800px"
    :scroll="false"
    class="industry-guide-dialog"
  >
    <!-- 步骤1：选择行业 -->
    <div v-if="step === 1" class="step-container">
      <div class="text-center mb-6">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
          <Icon name="ep:office-building" class="text-3xl text-blue-500"/>
        </div>
        <h3 class="text-lg font-medium text-slate-800 mb-2">选择您所在的行业</h3>
        <p class="text-sm text-slate-500">我们将为您推荐相关的考试和资料</p>
      </div>

      <div class="grid grid-cols-4 md:grid-cols-5 gap-4">
        <button
          v-for="category in categories"
          :key="category.id"
          :class="selectedIndustry?.id === category.id
            ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200'
            : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'
          "
          class="p-4 rounded-xl border-2 transition-all duration-200 text-center group"
          @click="selectIndustry(category)"
        >
          <div class="w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icon name="ep:folder-opened" class="text-2xl text-blue-500"/>
          </div>
          <h4 class="font-medium text-slate-800">{{ category.name }}</h4>
          <p v-if="category.children?.length" class="text-xs text-slate-500 mt-1">
            {{ category.children.length }} 个考试
          </p>
        </button>
      </div>

      <div class="flex justify-between items-center mt-6">
        <el-button
          v-if="canSkip"
          link
          type="info"
          @click="handleSkip"
        >
          暂不选择
        </el-button>
      </div>
    </div>

    <!-- 步骤2：选择考试 -->
    <div v-else class="step-container">
      <div class="text-center mb-6">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
          <Icon name="ep:document-checked" class="text-3xl text-emerald-500"/>
        </div>
        <h3 class="text-lg font-medium text-slate-800 mb-2">选择您要参加的考试</h3>
        <p class="text-sm text-slate-500">当前行业：{{ selectedIndustry?.name }}</p>
      </div>

      <div class="grid grid-cols-4 md:grid-cols-5 gap-4 max-h-80 overflow-y-auto p-2">
        <button
          v-for="exam in selectedIndustry?.children || []"
          :key="exam.id"
          :class="selectedExam?.id === exam.id
            ? 'ring-2 ring-emerald-500 bg-emerald-50 border-emerald-200'
            : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
          "
          class="p-4 rounded-xl border-2 transition-all duration-200 text-center group"
          @click="selectExam(exam)"
        >
          <div class="w-10 h-10 mx-auto mb-2 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icon name="ep:edit" class="text-xl text-emerald-500"/>
          </div>
          <h4 class="font-medium text-slate-800 text-sm">{{ exam.name }}</h4>
        </button>
      </div>

      <div class="flex justify-between items-center mt-6">
        <el-button
          link
          type="info"
          @click="goToStep1"
        >
          上一步
        </el-button>
        <el-button
          type="primary"
          size="large"
          :disabled="!selectedExam"
          class="px-8"
          @click="handleConfirm"
        >
          确定选择
        </el-button>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import type { CategoryVO } from '~/types/category'
import {CmsCategoryApi} from "~/api/category";

interface Props {
  modelValue: boolean
  canSkip?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  canSkip: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'select': [industry: CategoryVO, exam: CategoryVO]
  'skip': []
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

/* 当前步骤：1-选行业，2-选考试 */
const step = ref(1)
const selectedIndustry = ref<CategoryVO | null>(null)
const selectedExam = ref<CategoryVO | null>(null)

const dialogTitle = computed(() => {
  return step.value === 1 ? '选择行业' : '选择考试'
})

const categories = ref<CategoryVO[]>([])
const getCategories = async () => {
  categories.value = await CmsCategoryApi.getCategoryList({}, false)
}


const selectIndustry = (industry: CategoryVO) => {
  selectedIndustry.value = industry
  if (selectedIndustry.value) {
    step.value = 2
  }
}

const selectExam = (exam: CategoryVO) => {
  selectedExam.value = exam
}

const goToStep1 = () => {
  step.value = 1
  selectedExam.value = null
}

const handleConfirm = () => {
  if (selectedIndustry.value && selectedExam.value) {
    emit('select', selectedIndustry.value, selectedExam.value)
    visible.value = false
  }
}

const handleSkip = () => {
  emit('skip')
  visible.value = false
}

/* 重置状态 */
const reset = () => {
  step.value = 1
  selectedIndustry.value = null
  selectedExam.value = null
}

/* 打开时重置 */
watch(visible, (newVal) => {
  if (newVal) {
    reset()
  }
})

defineExpose({
  reset
})

onMounted(() => {
  getCategories()
})
</script>

<style scoped lang="scss">
:deep(.industry-guide-dialog .el-dialog__header) {
  text-align: center;
  padding-top: 24px;

  .el-dialog__title {
    font-size: 20px;
    font-weight: 600;
  }
}

:deep(.industry-guide-dialog .el-dialog__body) {
  padding: 20px 24px;
}

.step-container {
  min-height: 300px;
}
</style>
