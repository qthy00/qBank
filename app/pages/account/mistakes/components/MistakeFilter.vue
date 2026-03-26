<script setup lang="ts">
import type { MistakeFilterVO } from '~/types/mistake'
import { typeNames } from '~/api/qbank'

/**
 * 错题筛选组件
 */
const props = defineProps<{
  modelValue: MistakeFilterVO
}>()

const emit = defineEmits<{
  'update:modelValue': [value: MistakeFilterVO]
}>()

// 本地筛选条件
const filter = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 题型选项
const questionTypes = [
  { value: 0, label: '单选题' },
  { value: 1, label: '多选题' },
  { value: 2, label: '不定项选择题' },
  { value: 3, label: '判断题' },
  { value: 4, label: '填空题' },
  { value: 5, label: '简答题' },
  { value: 6, label: '案例题' },
]

// 难度选项
const difficulties = [
  { value: 1, label: '简单' },
  { value: 2, label: '中等' },
  { value: 3, label: '困难' },
]

// 掌握状态
const masteryOptions = [
  { value: null, label: '全部' },
  { value: false, label: '未掌握' },
  { value: true, label: '已掌握' },
]
</script>

<template>
  <div class="mistake-filter">
    <div class="filter-row">
      <!-- 题型筛选 -->
      <div class="filter-item">
        <span class="filter-label">题型</span>
        <el-select
          v-model="filter.questionType"
          placeholder="全部题型"
          clearable
          style="width: 140px"
        >
          <el-option
            v-for="type in questionTypes"
            :key="type.value"
            :label="type.label"
            :value="type.value"
          />
        </el-select>
      </div>

      <!-- 难度筛选 -->
      <div class="filter-item">
        <span class="filter-label">难度</span>
        <el-select
          v-model="filter.difficulty"
          placeholder="全部难度"
          clearable
          style="width: 120px"
        >
          <el-option
            v-for="item in difficulties"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>

      <!-- 掌握状态 -->
      <div class="filter-item">
        <span class="filter-label">状态</span>
        <el-radio-group v-model="filter.isMastered">
          <el-radio-button
            v-for="opt in masteryOptions"
            :key="String(opt.value)"
            :label="opt.value"
          >
            {{ opt.label }}
          </el-radio-button>
        </el-radio-group>
      </div>

      <!-- 快捷筛选标签 -->
      <div class="filter-tags">
        <el-tag
          v-if="filter.questionType !== undefined"
          closable
          @close="filter.questionType = undefined"
        >
          {{ typeNames[filter.questionType] }}
        </el-tag>
        <el-tag
          v-if="filter.difficulty !== undefined"
          closable
          @close="filter.difficulty = undefined"
        >
          {{ difficulties.find(d => d.value === filter.difficulty)?.label }}
        </el-tag>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mistake-filter {
  background: white;
  border-radius: 8px;
  padding: 16px 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;

  .filter-label {
    font-size: 14px;
    color: var(--el-text-color-regular);
    white-space: nowrap;
  }
}

.filter-tags {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

@media (max-width: 768px) {
  .mistake-filter {
    padding: 12px;
  }

  .filter-row {
    gap: 12px;
  }

  .filter-item {
    .filter-label {
      display: none;
    }
  }

  .filter-tags {
    width: 100%;
    margin-left: 0;
    margin-top: 8px;
  }
}
</style>
