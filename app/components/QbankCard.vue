<script setup lang="ts">
import type {QbankInfoVO} from '~/types/qbank'

/**
 * 题库卡片组件
 * 用于在列表中展示题库基本信息
 */

interface Props {
  /** 题库数据 */
  qbank: QbankInfoVO
  /** 是否显示购买按钮 */
  showBuy?: boolean
  /** 是否显示练习按钮 */
  showPractice?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showBuy: true,
  showPractice: true
})

const emit = defineEmits<{
  /** 点击卡片 */
  click: [id: number]
  /** 点击购买按钮 */
  buy: [qbank: QbankInfoVO]
  /** 点击练习按钮 */
  practice: [qbank: QbankInfoVO]
}>()

/**
 * 格式化价格
 */
const formatPrice = (price: number) => {
  return (price / 100).toFixed(2)
}

/**
 * 获取难度标签类型
 */
const getDifficultyType = (difficulty?: number): any => {
  if (!difficulty) return 'info'
  if (difficulty === 1) return 'success'
  if (difficulty === 2) return 'warning'
  return 'danger'
}

/**
 * 点击卡片
 */
const handleClick = () => {
  emit('click', props.qbank.id)
}

/**
 * 点击购买
 */
const handleBuy = (event: MouseEvent) => {
  event.stopPropagation()
  emit('buy', props.qbank)
}

/**
 * 点击练习
 */
const handlePractice = (event: MouseEvent) => {
  event.stopPropagation()
  emit('practice', props.qbank)
}
</script>

<template>
  <div
      class="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group"
      @click="handleClick"
  >
    <!-- 封面图 -->
    <div class="h-40 bg-gray-200 overflow-hidden relative">
      <img
          :src="qbank.coverImage || '/images/default-qbank.jpg'"
          :alt="qbank.name"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          @error="$event.target.src = '/images/default-qbank.jpg'"
      >
      <!-- 难度标签 -->
      <div class="absolute top-2 right-2">
        <el-tag
            v-if="qbank.difficulty"
            :type="getDifficultyType(qbank.difficulty)"
            size="small"
            effect="dark"
        >
          {{ qbank.difficultyName }}
        </el-tag>
      </div>
      <!-- 免费标签 -->
      <div v-if="qbank.price === 0" class="absolute top-2 left-2">
        <el-tag type="success" size="small" effect="dark">免费</el-tag>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="p-4">
      <!-- 标题 -->
      <h3
          class="font-bold text-[var(--color-text-primary)] mb-2 line-clamp-1"
          :title="qbank.name"
      >
        {{ qbank.name }}
      </h3>

      <!-- 描述 -->
      <p class="text-sm text-[var(--color-text-secondary)] mb-3 line-clamp-2 h-10">
        {{ qbank.description || '暂无描述' }}
      </p>

      <!-- 统计信息 -->
      <div class="flex items-center gap-4 text-xs text-[var(--color-text-secondary)] mb-3">
        <span class="flex items-center gap-1">
          <Icon name="ep:document"/>
          {{ qbank.questionCount || 0 }} 题
        </span>
        <span v-if="qbank.categoryName" class="flex items-center gap-1">
          <Icon name="ep:folder"/>
          {{ qbank.categoryName }}
        </span>
      </div>

      <!-- 价格和操作 -->
      <div class="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
        <!-- 价格 -->
        <div class="flex items-baseline gap-2">
          <template v-if="qbank.price > 0">
            <span class="text-[var(--color-danger)] font-bold text-lg">
              ¥{{ formatPrice(qbank.price) }}
            </span>
            <span
                v-if="qbank.originalPrice && qbank.originalPrice > qbank.price"
                class="text-[var(--color-text-disabled)] line-through text-sm"
            >
              ¥{{ formatPrice(qbank.originalPrice) }}
            </span>
          </template>
          <span v-else class="text-[var(--color-success)] font-bold text-lg">免费</span>
        </div>

        <!-- 操作按钮 -->
        <div class="flex gap-2">
          <el-button
              v-if="showBuy && qbank.price > 0"
              type="primary"
              size="small"
              @click="handleBuy"
          >
            购买
          </el-button>
          <el-button
              v-if="showPractice"
              :type="qbank.price === 0 ? 'primary' : 'success'"
              size="small"
              @click="handlePractice"
          >
            练习
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
