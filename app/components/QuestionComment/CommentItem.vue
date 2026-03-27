<template>
  <div class="comment-item py-4 border-b border-(--color-border) last:border-b-0">
    <!-- 用户头像和信息 -->
    <div class="flex gap-3">
      <!-- 头像 -->
      <div class="flex-shrink-0">
        <img
          :src="comment.avatar || '/images/default-avatar.png'"
          class="w-10 h-10 rounded-full object-cover"
          alt="avatar"
        />
      </div>

      <!-- 内容区域 -->
      <div class="flex-1 min-w-0">
        <!-- 用户名和属地 -->
        <div class="flex items-center gap-2 mb-1">
          <span class="font-medium text-(--color-text-primary)">{{ comment.nickname }}</span>
          <span class="text-xs text-(--color-text-secondary)">{{ comment.area }}</span>
        </div>

        <!-- 评论内容 -->
        <p class="text-(--color-text-primary) text-sm leading-relaxed mb-2">{{ comment.content }}</p>

        <!-- 图片列表 -->
        <div v-if="comment.media && comment.media.length > 0" class="flex gap-2 mb-3">
          <img
            v-for="(url, index) in comment.media"
            :key="index"
            :src="url"
            class="w-20 h-20 rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
            @click="previewImage(url)"
          />
        </div>

        <!-- 时间和操作栏 -->
        <div class="flex items-center justify-between">
          <span class="text-xs text-(--color-text-secondary)">{{ formatTime(comment.createTime) }}</span>

          <div class="flex items-center gap-4">
            <!-- 点赞按钮 -->
            <button
              class="flex items-center gap-1 text-xs transition-colors"
              :class="comment.likedByCurrentUser ? 'text-(--color-danger)' : 'text-(--color-text-secondary) hover:text-(--color-text-primary)'"
              @click="handleLike"
            >
              <Icon :name="comment.likedByCurrentUser ? 'ep:caret-top' : 'ep:caret-top'" class="text-base" />
              <span>{{ comment.likeCount || '点赞' }}</span>
            </button>

            <!-- 回复按钮 -->
            <button
              class="flex items-center gap-1 text-xs text-(--color-text-secondary) hover:text-(--color-text-primary) transition-colors"
              @click="handleReply"
            >
              <Icon name="ep:chat-dot-round" class="text-base" />
              <span>{{ comment.replyCount > 0 ? comment.replyCount : '回复' }}</span>
            </button>

            <!-- 删除按钮（仅自己的评论） -->
            <button
              v-if="isMyComment"
              class="flex items-center gap-1 text-xs text-(--color-text-secondary) hover:text-(--color-danger) transition-colors"
              @click="handleDelete"
            >
              <Icon name="ep:delete" class="text-base" />
              <span>删除</span>
            </button>
          </div>
        </div>

        <!-- 热门回复列表 -->
        <div v-if="comment.replyList && comment.replyList.length > 0" class="mt-3 bg-(--color-bg-container-hover) rounded-lg p-3">
          <div
            v-for="reply in comment.replyList"
            :key="reply.id"
            class="text-sm mb-2 last:mb-0"
          >
            <span class="text-(--color-text-primary) font-medium">{{ reply.nickname }}</span>
            <span class="text-(--color-text-secondary)"> 回复 </span>
            <span class="text-(--color-text-primary) font-medium">{{ reply.toNickname }}</span>
            <span class="text-(--color-text-secondary)">：</span>
            <span class="text-(--color-text-primary)">{{ reply.content }}</span>
          </div>
          <!-- 查看更多回复 -->
          <button
            v-if="comment.replyCount > comment.replyList.length"
            class="text-xs text-(--color-btn-primary) hover:text-(--color-btn-hover) mt-2"
            @click="handleViewMoreReplies"
          >
            查看全部 {{ comment.replyCount }} 条回复
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QuestionCommentItem } from '~/types/question-comment'

interface Props {
  comment: QuestionCommentItem
  currentUserId?: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  like: [commentId: number, isLiked: boolean]
  reply: [comment: QuestionCommentItem]
  delete: [commentId: number]
  viewReplies: [comment: QuestionCommentItem]
  previewImage: [url: string]
}>()

/* 是否是我的评论 */
const isMyComment = computed(() => {
  return props.currentUserId && props.comment.uid === props.currentUserId
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

/* 点赞 */
const handleLike = () => {
  emit('like', props.comment.id, props.comment.likedByCurrentUser)
}

/* 回复 */
const handleReply = () => {
  emit('reply', props.comment)
}

/* 删除 */
const handleDelete = () => {
  emit('delete', props.comment.id)
}

/* 查看更多回复 */
const handleViewMoreReplies = () => {
  emit('viewReplies', props.comment)
}

/* 预览图片 */
const previewImage = (url: string) => {
  emit('previewImage', url)
}
</script>
