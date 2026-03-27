<template>
  <el-button
    :type="isFavorite ? 'warning' : 'default'"
    :loading="loading"
    class="favorite-btn"
    @click="handleToggle"
  >
    <Icon :name="isFavorite ? 'ep:star-filled' : 'ep:star'" />
    <span class="ml-1">{{ isFavorite ? '已收藏' : '收藏' }}</span>
  </el-button>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { addQuestionFavorite, removeQuestionFavorite, getQuestionFavoriteStatus } from '@/api/question/favorite'

const message = useMessage()

/* Props */
interface Props {
  questionId: number
  qbankId?: number
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  qbankId: undefined
})

/* 状态 */
const isFavorite = ref(false)
const loading = ref(false)

/* 切换收藏状态 */
const handleToggle = async () => {
  if (loading.value) return

  try {
    loading.value = true
    if (isFavorite.value) {
      await removeQuestionFavorite(props.questionId)
      message.success('取消收藏成功')
      isFavorite.value = false
    } else {
      if (!props.qbankId) {
        message.error('缺少题库信息')
        return
      }
      await addQuestionFavorite(props.questionId, props.qbankId)
      message.success('收藏成功')
      isFavorite.value = true
    }
  } catch {
    message.error('操作失败，请重试')
  } finally {
    loading.value = false
  }
}

/* 初始化收藏状态 */
onMounted(async () => {
  try {
    const status = await getQuestionFavoriteStatus(props.questionId)
    isFavorite.value = status
  } catch {
    /* 忽略错误 */
  }
})
</script>

<style scoped lang="scss">
.favorite-btn {
  /* 收藏按钮样式 */
}
</style>
