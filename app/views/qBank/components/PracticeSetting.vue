<script setup lang="ts">
import { typeMap } from '~/views/qBank/func.ts'
import type { BaseType } from '~/types/qBank'
import { questionApi } from '@/api/qbank'

const questionStore = useQBankStore()
const dialogVisible = ref(false)
// 存储选中的值，每个分组对应一个选中值
const selectedValues = ref<number[]>([-1, 12, 30]) // 默认选中：全部题型、全部、30题

// 选择状态数据
const SELECTION_TYPES: BaseType[] = [
  { type: '全部', value: 10 },
  { type: '已答题', value: 11 },
  { type: '未答题', value: 12 },
  { type: '错题', value: 13 },
]

// 题量数据
const QUESTION_QUANTITIES: BaseType[] = [
  { type: '30 题', value: 30 },
  { type: '50 题', value: 50 },
  { type: '100 题', value: 100 },
]

// 按钮组数据
const buttons = ref([
  {
    type: '题型',
    list: [{ type: '全部', value: -1 }, ...typeMap],
  },
  { type: '选择', list: SELECTION_TYPES },
  { type: '题量', list: QUESTION_QUANTITIES },
])

/** 打开弹窗 */
const open = async (subjectId: number) => {
  // 获取用户设置
  const userSetting = questionStore.userSetting
  if (userSetting) {
    selectedValues.value = [userSetting.type, userSetting.status, userSetting.amount]
  }
  await loadSubjectInfo(subjectId)
  dialogVisible.value = true
}

// 检查按钮是否被选中
const isSelected = (groupIndex: number, value: number) => {
  return selectedValues.value[groupIndex] === value
}

// 点击按钮事件
const onClickBtn = (groupIndex: number, value: number) => {
  selectedValues.value[groupIndex] = value
}

// 开始练习
const startPractice = () => {
  questionStore.setUserSetting(selectedValues.value)
  // 关闭弹窗
  dialogVisible.value = false
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

// 处理按钮列表数据（提取公共逻辑为函数）
const getButtonList = (typeItems: any) => [
  { type: '全部', value: -1 },
  ...typeItems.map((item: any) => ({
    type: item.displayName || typeMap[item.type]?.type || '',
    value: item.type
  }))
]

const loadSubjectInfo = async (subjectId: number) => {
  try {
    // 优先获取试卷信息
    const paperInfo = await questionApi.getSubjectPaperInfo(subjectId)
    // 校验试卷信息是否有效
    if(paperInfo?.questionInfo?.length && paperInfo.questionInfo[0].type !== null) {
      // 使用试卷中的题目类型
      buttons.value[0].list = getButtonList(paperInfo.questionInfo)
    }else{
      // 试卷信息无效时，获取独立的题目类型列表
      const typeIds = await questionApi.getQuestionType(subjectId);
      if (typeIds?.length) {
        // 转换类型ID为按钮列表项
        const typeItems = typeIds.map((id: number) => ({ type: id }))
        buttons.value[0].list = getButtonList(typeItems)
      } else {
        // 无任何类型时，仅保留"全部"选项
        buttons.value[0].list = [{ type: '全部', value: -1 }];
      }
    }
  }catch (err) {
    console.log(err)
  }
}

</script>

<template>
  <Dialog v-model="dialogVisible" title="练习筛选设置" width="500px" :scroll="false">
    <div class="container-list p-4">
      <div v-for="(group, groupIndex) in buttons" :key="groupIndex" class="mb-6">
        <!-- 分组标题 -->
        <div class="text-sm font-semibold text-gray-800 mb-3 flex items-center">
          <div class="w-1.5 h-4 bg-blue-500 rounded-full mr-2"></div>
          {{ group.type }}
        </div>

        <!-- 选项按钮组 -->
        <div class="option-row flex flex-wrap justify-start gap-2">
          <el-button
            :class="['option-btn', isSelected(groupIndex, btn.value) ? 'selected' : 'default']"
            v-for="(btn, i) in group.list"
            :key="i"
            @click="onClickBtn(groupIndex, btn.value)"
          >
            {{ btn.type }}
          </el-button>
        </div>
      </div>
    </div>

    <el-button
      type="primary"
      @click="startPractice()"
      class="float-end m-4 bg-gradient-to-r from-blue-600 to-blue-400 border-none text-white rounded-full shadow-md hover:opacity-90"
      size="large"
    >
      确 定
    </el-button>
  </Dialog>
</template>

<style scoped>
.container-list {
  max-height: 400px;
  overflow-y: auto;
}

.option-btn {
  border-radius: 20px;
  padding: 4px 16px;
  transition: all 0.2s ease;
}

.default {
  background-color: #f5f7fa;
  color: #606266;
  border: 1px solid #e4e7ed;
}

.default:hover {
  background-color: #e9ecef;
  color: #409eff;
  border-color: #c6e2ff;
}

.selected {
  background-color: #ecf5ff;
  color: #409eff;
  border-color: #93c5fd;
}

.selected:hover {
  background-color: #dcefff;
}
</style>
