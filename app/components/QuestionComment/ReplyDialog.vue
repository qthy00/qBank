<template>
  <el-dialog
    v-model="dialogVisible"
    :title="`回复 (${total})`"
    width="600px"
    :close-on-click-modal="false"
    destroy-on-close
    class="reply-dialog"
  >
    <div class="reply-list max-h-[400px] overflow-y-auto">
      <!-- 回复列表 -->
      <div
        v-for="reply in replyList"
        :key="reply.id"
        class="reply-item py-3 border-b border-(--color-border) last:border-b-0"
      >
        <div class="flex gap-3">
          <!-- 头像 -->
          <div class="flex-shrink-0">
            <img
              :src="reply.avatar || '/images/default-avatar.png'"
              class="w-8 h-8 rounded-full object-cover"
              alt="avatar"
            >
          </div>

          <!-- 内容 -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-medium text-(--color-text-primary) text-sm">{{ reply.nickname }}</span>
              <span class="text-xs text-(--color-text-secondary)">{{ reply.area }}</span>
            </div>

            <div class="text-sm mb-1">
              <span class="text-(--color-text-secondary)">回复</span>
              <span class="text-(--color-text-primary) font-medium"> {{ reply.toNickname }}</span>
              <span class="text-(--color-text-secondary)">：</span>
              <span class="text-(--color-text-primary)">{{ reply.content }}</span>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-xs text-(--color-text-secondary)">{{ formatTime(reply.createTime) }}</span>

              <div class="flex items-center gap-3">
                <!-- 点赞 -->
                <button
                  class="flex items-center gap-1 text-xs transition-colors"
                  :class="reply.likedByCurrentUser ? 'text-(--color-danger)' : 'text-(--color-text-secondary) hover:text-(--color-text-primary)'"
                  @click="handleReplyLike(reply)"
                >
                  <Icon name="ep:caret-top" class="text-base" />
                  <span>{{ reply.likeCount || '点赞' }}</span>
                </button>

                <!-- 回复按钮 -->
                <button
                  class="text-xs text-(--color-text-secondary) hover:text-(--color-text-primary) transition-colors"
                  @click="handleReplyToUser(reply)"
                >
                  回复
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载更多 -->
      <div v-if="hasMore" class="text-center py-4">
        <el-button
          :loading="loading"
          link
          type="primary"
          @click="loadMore"
        >
          加载更多
        </el-button>
      </div>

      <!-- 空状态 -->
      <el-empty v-if="replyList.length === 0 && !loading" description="暂无回复" />
    </div>

    <!-- 回复表单 -->
    <div class="mt-4 pt-4 border-t border-(--color-border)">
      <CommentForm
        :question-id="questionId"
        :comment-id="commentId"
        :to-uid="replyToUid"
        :reply-to-user="replyToNickname"
        placeholder="写下你的回复..."
        submit-text="回复"
        show-cancel
        :max-length="200"
        @submit="handleSubmitReply"
        @cancel="handleCancelReply"
      />
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import type { CommentReplyItem } from '~/types/question-comment'
import { getCommentReplyList } from '~/api/question-comment'
import CommentForm from './CommentForm.vue'

interface Props {
  questionId: number
  commentId: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submitReply: [content: string, toUid: number]
  likeReply: [replyId: number, isLiked: boolean]
}>()

/* 弹窗可见性 */
const dialogVisible = ref(false)

/* 数据 */
const replyList = ref<CommentReplyItem[]>([])
const loading = ref(false)
const pageNum = ref(1)
const pageSize = 20
const total = ref(0)

/* 回复表单状态 */
const replyToUid = ref(0)
const replyToNickname = ref('')

/* 是否有更多 */
const hasMore = computed(() => {
  return replyList.value.length < total.value
})

/* 格式化时间 */
const formatTime = (time: string): string => {
  const date = new Date(time)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`
  } else if (diff < 7 * day) {
    return `${Math.floor(diff / day)}天前`
  } else {
    return date.toLocaleDateString('zh-CN')
  }
}

/* 打开弹窗 */
const open = async () => {
  dialogVisible.value = true
  pageNum.value = 1
  replyList.value = []
  total.value = 0
  await loadReplies()
}

/* 关闭弹窗 */
const close = () => {
  dialogVisible.value = false
}

/* 加载回复列表 */
const loadReplies = async () => {
  if (loading.value) return
  loading.value = true

  try {
    /* 调用API获取回复列表 */
    const res = await getCommentReplyList(props.commentId, {
      pageNum: pageNum.value,
      pageSize,
    })

    if (res.code === 0 && res.data) {
      const { list, total: t } = res.data
      replyList.value.push(...list)
      total.value = t
    } else {
      message.error(res.msg || '获取回复列表失败')
    }
  } catch {
    message.error('获取回复列表失败')
  } finally {
    loading.value = false
  }
}

/* 加载更多 */
const loadMore = () => {
  pageNum.value++
  loadReplies()
}

/* 回复点赞 */
const handleReplyLike = (reply: CommentReplyItem) => {
  emit('likeReply', reply.id, reply.likedByCurrentUser)
  /* 本地更新状态 */
  reply.likedByCurrentUser = !reply.likedByCurrentUser
  reply.likeCount += reply.likedByCurrentUser ? 1 : -1
}

/* 点击回复按钮 */
const handleReplyToUser = (reply: CommentReplyItem) => {
  replyToUid.value = reply.uid
  replyToNickname.value = reply.nickname
}

/* 提交回复 */
const handleSubmitReply = (content: string) => {
  emit('submitReply', content, replyToUid.value || 0)
  /* 重置回复目标 */
  replyToUid.value = 0
  replyToNickname.value = ''
  /* 刷新列表 */
  pageNum.value = 1
  replyList.value = []
  loadReplies()
}

/* 取消回复 */
const handleCancelReply = () => {
  replyToUid.value = 0
  replyToNickname.value = ''
}

/* 暴露方法 */
defineExpose({
  open,
  close,
})
</script>

<style scoped lang="scss">
.reply-dialog :deep(.el-dialog__body) {
  padding-top: 10px;
  padding-bottom: 20px;
}

.reply-list {
  scrollbar-width: thin;
  scrollbar-color: var(--color-border) transparent;
}
</style>
