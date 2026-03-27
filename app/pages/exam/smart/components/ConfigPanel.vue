<template>
  <div class="config-panel">
    <!-- 题目数量 -->
    <div class="config-item">
      <label class="config-label">题目数量</label>
      <el-radio-group v-model="config.questionCount" size="large">
        <el-radio-button :value="10">10题</el-radio-button>
        <el-radio-button :value="20">20题</el-radio-button>
        <el-radio-button :value="30">30题</el-radio-button>
        <el-radio-button :value="50">50题</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 难度筛选 -->
    <div class="config-item">
      <label class="config-label">
        难度筛选
        <el-tooltip content="选择允许出现的题目难度">
          <Icon name="ep:question-filled" class="tooltip-icon" />
        </el-tooltip>
      </label>
      <el-checkbox-group v-model="config.difficulty">
        <el-checkbox :value="1">简单</el-checkbox>
        <el-checkbox :value="2">中等</el-checkbox>
        <el-checkbox :value="3">困难</el-checkbox>
      </el-checkbox-group>
    </div>

    <!-- 题型筛选 -->
    <div class="config-item">
      <label class="config-label">
        题型筛选
        <el-tooltip content="选择允许出现的题型">
          <Icon name="ep:question-filled" class="tooltip-icon" />
        </el-tooltip>
      </label>
      <el-checkbox-group v-model="config.questionTypes">
        <el-checkbox :value="1">单选题</el-checkbox>
        <el-checkbox :value="2">多选题</el-checkbox>
        <el-checkbox :value="3">判断题</el-checkbox>
        <el-checkbox :value="4">填空题</el-checkbox>
      </el-checkbox-group>
    </div>

    <!-- 薄弱程度 -->
    <div class="config-item">
      <label class="config-label">
        薄弱程度
        <el-tooltip content="选择要针对的薄弱程度知识点">
          <Icon name="ep:question-filled" class="tooltip-icon" />
        </el-tooltip>
      </label>
      <el-checkbox-group v-model="config.weakLevel">
        <el-checkbox :value="'high'">
          <el-tag type="danger" size="small">高危薄弱</el-tag>
        </el-checkbox>
        <el-checkbox :value="'medium'">
          <el-tag type="warning" size="small">中度薄弱</el-tag>
        </el-checkbox>
        <el-checkbox :value="'low'">
          <el-tag type="info" size="small">轻度薄弱</el-tag>
        </el-checkbox>
      </el-checkbox-group>
    </div>

    <!-- 预计用时 -->
    <div class="config-item estimated-time">
      <label class="config-label">预计用时</label>
      <div class="time-display">
        <Icon name="ep:clock" class="time-icon" />
        <span class="time-value">{{ estimatedTime }} 分钟</span>
        <span class="time-desc">（按每题1.5分钟计算）</span>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="config-actions">
      <el-button
        type="primary"
        size="large"
        :loading="loading"
        :disabled="!canGenerate"
        @click="handleGenerate"
      >
        <Icon name="ep:magic-stick" />
        智能组卷
      </el-button>
      <el-button
        size="large"
        :disabled="loading"
        @click="handleReset"
      >
        重置配置
      </el-button>
    </div>

    <!-- 提示信息 -->
    <el-alert
      v-if="!canGenerate"
      title="请至少选择一种薄弱程度和一种题型"
      type="warning"
      :closable="false"
      class="mt-4"
    />
  </div>
</template>

<script setup lang="ts">
import type { SmartExamParams } from '~/types/smart-exam'

interface Config extends SmartExamParams {
  weakLevel: ('high' | 'medium' | 'low')[]
}

interface Props {
  loading?: boolean
}

const _props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  /* 生成试卷 */
  generate: [config: Config]
  /* 重置配置 */
  reset: []
}>()

/* 默认配置 */
const defaultConfig: Config = {
  questionCount: 20,
  difficulty: [1, 2, 3],
  questionTypes: [1, 2, 3, 4],
  weakLevel: ['high', 'medium']
}

/* 当前配置 */
const config = reactive<Config>({ ...defaultConfig })

/* 预计用时 */
const estimatedTime = computed(() => {
  return Math.ceil(config.questionCount * 1.5)
})

/* 是否可以生成 */
const canGenerate = computed(() => {
  return config.weakLevel.length > 0 && config.questionTypes.length > 0
})

/* 生成试卷 */
const handleGenerate = () => {
  if (!canGenerate.value) return
  emit('generate', { ...config })
}

/* 重置配置 */
const handleReset = () => {
  Object.assign(config, defaultConfig)
  emit('reset')
}
</script>

<style scoped lang="scss">
.config-panel {
  padding: 16px;
}

.config-item {
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
}

.config-label {
  display: block;
  font-weight: 500;
  margin-bottom: 12px;
  color: var(--el-text-color-primary);
  font-size: 14px;

  .tooltip-icon {
    margin-left: 4px;
    color: var(--el-text-color-secondary);
    cursor: help;
  }
}

/* 预计用时 */
.estimated-time {
  .time-display {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background: var(--el-fill-color-light);
    border-radius: 8px;

    .time-icon {
      color: var(--el-color-primary);
      font-size: 18px;
    }

    .time-value {
      font-size: 18px;
      font-weight: bold;
      color: var(--el-color-primary);
    }

    .time-desc {
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }
  }
}

/* 操作按钮 */
.config-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--el-border-color-lighter);

  .el-button {
    flex: 1;

    :deep(.el-icon) {
      margin-right: 4px;
    }
  }
}
</style>
