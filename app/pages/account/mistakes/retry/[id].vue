<script setup lang="ts">
import { questionApi } from '~/api/qbank'
import type { QuestionVO } from '~/types/qBank'

/**
 * 错题重做页面
 */
definePageMeta({
  layout: 'default'
})

useHead({
  title: '错题重做 - 学次元在线题库'
})

const route = useRoute()
const router = useRouter()
const message = useMessage()

// 是否使用Mock数据
const USE_MOCK = true

// 模式：单题重做 / 批量重做
const _mode = computed(() => route.query.mode as string || 'single')
const questionId = computed(() => Number(route.params.id))

// 题目数据
const question = ref<QuestionVO | null>(null)
const loading = ref(false)
const userAnswer = ref('')
const showAnalysis = ref(false)
const isCorrect = ref<boolean | null>(null)

// 获取题目详情
const fetchQuestion = async () => {
  if (!questionId.value) return

  loading.value = true
  try {
    if (USE_MOCK) {
      // 使用模拟数据
      const { getMockMistakeDetail } = await import('~/api/mistake/mock')
      const mistake = getMockMistakeDetail(questionId.value)
      question.value = mistake?.question || null
    } else {
      question.value = await questionApi.getQuestion(questionId.value)
    }
  } finally {
    loading.value = false
  }
}

// 提交答案
const handleSubmit = async () => {
  if (!userAnswer.value) {
    message.warning('请选择答案')
    return
  }

  // 判断对错
  isCorrect.value = userAnswer.value === question.value?.answer
  showAnalysis.value = true

  // Mock 模式下不提交到后端
  if (!USE_MOCK) {
    try {
      await questionApi.submitCurrentQuestion({
        questionId: questionId.value,
        answer: userAnswer.value,
        isCorrect: isCorrect.value,
        source: 'mistake_retry'
      })
    } catch (error) {
      console.error('提交答案失败:', error)
    }
  }
}

// 标记掌握
const handleMarkMastered = async () => {
  try {
    if (USE_MOCK) {
      const { mockMarkMastered } = await import('~/api/mistake/mock')
      mockMarkMastered(questionId.value, true)
    } else {
      const { markMistakeMastered } = await import('~/api/mistake')
      await markMistakeMastered({
        questionId: questionId.value,
        isMastered: true
      })
    }
    message.success('已标记为掌握')
    router.back()
  } catch {
    message.error('标记失败')
  }
}

// 继续下一题
const handleNext = () => {
  // 返回错题本列表
  router.push('/account/mistakes')
}

onMounted(() => {
  fetchQuestion()
})
</script>

<template>
  <div class="mistake-retry-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-button text @click="router.push('/account/mistakes')">
        <Icon name="material-symbols:arrow-back" class="btn-icon" />
        返回错题本
      </el-button>
      <h2 class="page-title">错题重做</h2>
    </div>

    <!-- 题目内容 -->
    <div v-loading="loading" class="question-container">
      <template v-if="question">
        <!-- 题目信息 -->
        <div class="question-header">
          <el-tag size="small">{{ question.typeName }}</el-tag>
          <span class="question-id">ID: {{ question.id }}</span>
        </div>

        <!-- 题目内容 -->
        <div class="question-content">
          {{ question.content }}
        </div>

        <!-- 选项 -->
        <div class="question-options">
          <el-radio-group
            v-model="userAnswer"
            class="options-group"
            :disabled="showAnalysis"
          >
            <el-radio
              v-for="(value, key) in question.options"
              :key="key"
              :label="key"
              class="option-item"
              :class="{
                'is-correct': showAnalysis && key === question.answer,
                'is-wrong': showAnalysis && userAnswer === key && key !== question.answer
              }"
            >
              <span class="option-key">{{ key }}</span>
              <span class="option-value">{{ value }}</span>
            </el-radio>
          </el-radio-group>
        </div>

        <!-- 操作按钮 -->
        <div class="question-actions">
          <template v-if="!showAnalysis">
            <el-button type="primary" size="large" @click="handleSubmit">
              提交答案
            </el-button>
          </template>
          <template v-else>
            <el-button
              v-if="isCorrect"
              type="success"
              size="large"
              @click="handleMarkMastered"
            >
              <Icon name="material-symbols:check-circle" class="btn-icon" />
              标记掌握
            </el-button>
            <el-button size="large" @click="handleNext">
              返回错题本
            </el-button>
          </template>
        </div>

        <!-- 答案解析 -->
        <div v-if="showAnalysis" class="analysis-section">
          <el-divider />

          <div class="analysis-header">
            <el-tag
              :type="isCorrect ? 'success' : 'danger'"
              size="large"
              effect="dark"
            >
              {{ isCorrect ? '回答正确' : '回答错误' }}
            </el-tag>
            <div class="correct-answer">
              正确答案：<strong>{{ question.answer }}</strong>
            </div>
          </div>

          <div class="analysis-content">
            <h4>答案解析</h4>
            <div class="analysis-text">{{ question.analysis || '暂无解析' }}</div>

            <h4>知识点</h4>
            <div class="point-tags">
              <el-tag
                v-for="point in question.point?.split(',')"
                :key="point"
                type="info"
                effect="plain"
              >
                {{ point.trim() }}
              </el-tag>
            </div>
          </div>
        </div>
      </template>

      <!-- 空状态 -->
      <el-empty v-else-if="!loading" description="题目不存在" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.mistake-retry-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px 16px;
}

.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;

  .page-title {
    font-size: 20px;
    font-weight: 600;
    margin-left: 16px;
  }

  .btn-icon {
    margin-right: 4px;
    font-size: 18px;
  }
}

.question-container {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.question-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;

  .question-id {
    font-size: 13px;
    color: var(--el-text-color-secondary);
  }
}

.question-content {
  font-size: 16px;
  line-height: 1.8;
  color: var(--el-text-color-primary);
  margin-bottom: 32px;
  padding: 20px;
  background: var(--el-fill-color-lighter);
  border-radius: 8px;
}

.question-options {
  margin-bottom: 32px;

  .options-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
  }

  .option-item {
    padding: 16px;
    border: 1px solid var(--el-border-color);
    border-radius: 8px;
    transition: all 0.2s;

    &:hover {
      border-color: var(--el-color-primary);
      background: var(--el-color-primary-light-9);
    }

    &.is-correct {
      border-color: var(--el-color-success);
      background: var(--el-color-success-light-9);
    }

    &.is-wrong {
      border-color: var(--el-color-danger);
      background: var(--el-color-danger-light-9);
    }

    :deep(.el-radio__input) {
      display: none;
    }

    :deep(.el-radio__label) {
      padding-left: 0;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .option-key {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--el-fill-color);
      border-radius: 50%;
      font-weight: 600;
    }

    .option-value {
      flex: 1;
      font-size: 15px;
    }
  }
}

.question-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;

  .btn-icon {
    margin-right: 4px;
  }
}

.analysis-section {
  .analysis-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;

    .correct-answer {
      font-size: 15px;
    }
  }

  .analysis-content {
    h4 {
      font-size: 15px;
      font-weight: 600;
      margin: 16px 0 8px;
      color: var(--el-text-color-primary);
    }

    .analysis-text {
      font-size: 14px;
      line-height: 1.8;
      color: var(--el-text-color-regular);
      padding: 16px;
      background: var(--el-fill-color-lighter);
      border-radius: 8px;
    }

    .point-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
  }
}

@media (max-width: 768px) {
  .question-container {
    padding: 20px;
  }

  .question-content {
    font-size: 15px;
    padding: 16px;
  }

  .question-options {
    .option-item {
      padding: 12px;
    }
  }
}
</style>
