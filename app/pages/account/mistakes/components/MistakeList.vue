<script setup lang="ts">
import type { MistakeVO } from '~/types/mistake'
import { formatDate } from '~/utils/formatTime'

/**
 * 错题列表组件
 */
interface Props {
  list: MistakeVO[]
  loading: boolean
  selectedIds: number[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:selectedIds': [ids: number[]]
  retry: [questionId: number]
  master: [questionId: number]
  unmaster: [questionId: number]
  remove: [questionId: number]
}>()

// 全选状态
const isAllSelected = computed(() => {
  if (props.list.length === 0) return false
  return props.list.every(item => props.selectedIds.includes(item.questionId))
})

// 处理选择
const handleSelectAll = (val: boolean) => {
  if (val) {
    emit('update:selectedIds', props.list.map(item => item.questionId))
  } else {
    emit('update:selectedIds', [])
  }
}

const handleSelect = (questionId: number, checked: boolean) => {
  const newIds = checked
    ? [...props.selectedIds, questionId]
    : props.selectedIds.filter(id => id !== questionId)
  emit('update:selectedIds', newIds)
}

// 题型标签
const getQuestionTypeLabel = (type: number) => {
  const labels: Record<number, string> = {
    0: '单选',
    1: '多选',
    2: '不定项',
    3: '判断',
    4: '填空',
    5: '简答',
  }
  return labels[type] || '其他'
}

// 难度标签
const getDifficultyLabel = (difficulty: number) => {
  const labels: Record<number, { label: string; type: string }> = {
    1: { label: '简单', type: 'success' },
    2: { label: '中等', type: 'warning' },
    3: { label: '困难', type: 'danger' },
  }
  return labels[difficulty] || { label: '未知', type: 'info' }
}
</script>

<template>
  <div v-loading="loading" class="mistake-list">
    <!-- 表头 -->
    <div class="list-header">
      <el-checkbox
        :model-value="isAllSelected"
        :disabled="list.length === 0"
        @change="handleSelectAll"
      >
        全选
      </el-checkbox>
      <span class="header-text">题目</span>
      <span class="header-actions">操作</span>
    </div>

    <!-- 空状态 -->
    <el-empty
      v-if="!loading && list.length === 0"
      description="暂无错题，快去练习吧！"
    >
      <el-button type="primary" @click="navigateTo('/qbank')">
        去练习
      </el-button>
    </el-empty>

    <!-- 列表项 -->
    <div v-else class="list-body">
      <div
        v-for="item in list"
        :key="item.id"
        class="mistake-item"
        :class="{ mastered: item.isMastered }"
      >
        <!-- 选择框 -->
        <div class="item-checkbox">
          <el-checkbox
            :model-value="selectedIds.includes(item.questionId)"
            @change="(val: boolean) => handleSelect(item.questionId, val)"
          />
        </div>

        <!-- 题目内容 -->
        <div class="item-content" @click="$emit('retry', item.questionId)">
          <div class="content-header">
            <!-- 题型标签 -->
            <el-tag size="small" effect="plain">
              {{ getQuestionTypeLabel(item.question?.type || 0) }}
            </el-tag>

            <!-- 难度标签 -->
            <el-tag
              size="small"
              :type="getDifficultyLabel(item.question?.difficulty || 1).type"
            >
              {{ getDifficultyLabel(item.question?.difficulty || 1).label }}
            </el-tag>

            <!-- 掌握状态 -->
            <el-tag
              v-if="item.isMastered"
              size="small"
              type="success"
              effect="dark"
            >
              <Icon name="material-symbols:check" class="tag-icon" />
              已掌握
            </el-tag>
          </div>

          <div class="question-content">
            {{ item.question?.content || '题目内容加载中...' }}
          </div>

          <div class="content-footer">
            <span class="footer-item">
              <Icon name="material-symbols:book" class="footer-icon" />
              {{ item.subjectName || '未知科目' }}
            </span>
            <span v-if="item.chapterName" class="footer-item">
              <Icon name="material-symbols:folder" class="footer-icon" />
              {{ item.chapterName }}
            </span>
            <span class="footer-item">
              <Icon name="material-symbols:repeat" class="footer-icon" />
              错 {{ item.mistakeCount }} 次
            </span>
            <span class="footer-item">
              <Icon name="material-symbols:schedule" class="footer-icon" />
              {{ formatDate(item.lastMistakeTime) }}
            </span>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="item-actions">
          <el-button
            v-if="!item.isMastered"
            type="primary"
            size="small"
            @click="$emit('retry', item.questionId)"
          >
            重做
          </el-button>
          <el-button
            v-else
            type="success"
            size="small"
            @click="$emit('unmaster', item.questionId)"
          >
            取消掌握
          </el-button>

          <el-dropdown trigger="click">
            <el-button type="text" size="small">
              <Icon name="material-symbols:more-vert" />
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-if="!item.isMastered"
                  @click="$emit('master', item.questionId)"
                >
                  <Icon name="material-symbols:check-circle" class="dropdown-icon" />
                  标记掌握
                </el-dropdown-item>
                <el-dropdown-item @click="$emit('remove', item.questionId)">
                  <Icon name="material-symbols:delete" class="dropdown-icon" />
                  移除错题
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mistake-list {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.list-header {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  background: var(--el-fill-color-light);
  border-bottom: 1px solid var(--el-border-color-lighter);
  border-radius: 8px 8px 0 0;

  .header-text {
    flex: 1;
    margin-left: 12px;
    font-size: 14px;
    font-weight: 500;
    color: var(--el-text-color-regular);
  }

  .header-actions {
    width: 150px;
    text-align: center;
    font-size: 14px;
    font-weight: 500;
    color: var(--el-text-color-regular);
  }
}

.list-body {
  padding: 8px 0;
}

.mistake-item {
  display: flex;
  align-items: flex-start;
  padding: 16px 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  transition: background 0.2s;

  &:hover {
    background: var(--el-fill-color-lighter);
  }

  &:last-child {
    border-bottom: none;
  }

  &.mastered {
    opacity: 0.7;

    .question-content {
      color: var(--el-text-color-secondary);
    }
  }
}

.item-checkbox {
  padding-top: 4px;
  margin-right: 12px;
}

.item-content {
  flex: 1;
  cursor: pointer;

  .content-header {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
  }

  .question-content {
    font-size: 15px;
    line-height: 1.6;
    color: var(--el-text-color-primary);
    margin-bottom: 12px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .content-footer {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;

    .footer-item {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      color: var(--el-text-color-secondary);

      .footer-icon {
        font-size: 14px;
      }
    }
  }
}

.item-actions {
  width: 150px;
  display: flex;
  justify-content: center;
  gap: 8px;
  padding-top: 4px;
}

.tag-icon {
  margin-right: 2px;
  font-size: 12px;
}

.dropdown-icon {
  margin-right: 6px;
  font-size: 16px;
  vertical-align: middle;
}

@media (max-width: 768px) {
  .list-header {
    padding: 12px;

    .header-actions {
      display: none;
    }
  }

  .mistake-item {
    padding: 12px;
    flex-wrap: wrap;

    .item-content {
      width: calc(100% - 40px);
    }

    .item-actions {
      width: 100%;
      justify-content: flex-start;
      margin-top: 12px;
      padding-left: 28px;
    }
  }

  .content-footer {
    gap: 12px;
  }
}
</style>
