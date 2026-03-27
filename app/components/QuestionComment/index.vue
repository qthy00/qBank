<template>
  <div class="question-comment bg-(--color-bg-container) rounded-lg">
    <!-- 头部标题 -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-(--color-border)">
      <div class="flex items-center gap-2">
        <Icon name="ep:chat-dot-square" class="text-lg text-(--color-btn-primary)" />
        <span class="font-medium text-(--color-text-primary)">题目讨论</span>
        <span v-if="total > 0" class="text-sm text-(--color-text-secondary)">({{ total }})</span>
      </div>
      <el-button
        v-if="!showForm"
        type="primary"
        link
        @click="showForm = true"
      >
        <Icon name="ep:edit" class="mr-1" />
        写评论
      </el-button>
    </div>

    <!-- 评论表单 -->
    <div v-if="showForm" class="p-4 border-b border-(--color-border)">
      <CommentForm
        :question-id="questionId"
        placeholder="发表你对这道题的看法..."
        submit-text="发表评论"
        @submit="handleSubmitComment"
        @cancel="showForm = false"
      />
    </div>

    <!-- 评论列表 -->
    <div class="comment-list p-4">
      <!-- 加载状态 -->
      <div v-if="loading && commentList.length === 0" class="py-8">
        <el-skeleton :rows="3" animated />
      </div>

      <!-- 评论项 -->
      <template v-else-if="commentList.length > 0">
        <CommentItem
          v-for="comment in commentList"
          :key="comment.id"
          :comment="comment"
          :current-user-id="currentUserId"
          @like="handleLike"
          @reply="handleReply"
          @delete="handleDelete"
          @view-replies="handleViewReplies"
          @preview-image="handlePreviewImage"
        />
      </template>

      <!-- 空状态 -->
      <el-empty
        v-else
        description="暂无评论，来发表第一条评论吧"
        class="py-8"
      >
        <el-button type="primary" @click="showForm = true">发表评论</el-button>
      </el-empty>

      <!-- 加载更多 -->
      <div v-if="hasMore" class="text-center pt-4">
        <el-button
          :loading="loading"
          link
          type="primary"
          @click="loadMore"
        >
          加载更多
        </el-button>
      </div>
    </div>

    <!-- 回复弹窗 -->
    <ReplyDialog
      ref="replyDialogRef"
      :question-id="questionId"
      :comment-id="currentCommentId"
      @submit-reply="handleSubmitReply"
      @like-reply="handleReplyLike"
    />

    <!-- 图片预览 -->
    <el-image-viewer
      v-if="previewVisible"
      :url-list="previewImages"
      :initial-index="previewIndex"
      @close="previewVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import type { QuestionCommentItem, CommentReplyItem } from '~/types/question-comment'
import {
  getQuestionCommentPage,
  submitQuestionComment,
  submitCommentReply,
  deleteMyComment,
  likeComment,
} from '~/api/question-comment'
import CommentItem from './CommentItem.vue'
import CommentForm from './CommentForm.vue'
import ReplyDialog from './ReplyDialog.vue'

interface Props {
  questionId: number
  currentUserId?: number
}

const props = defineProps<Props>()

const message = useMessage()

/* 数据 */
const commentList = ref<QuestionCommentItem[]>([])
const loading = ref(false)
const showForm = ref(false)
const pageNum = ref(1)
const pageSize = 10
const total = ref(0)
const currentCommentId = ref(0)

/* 回复弹窗引用 */
const replyDialogRef = ref<InstanceType<typeof ReplyDialog>>()

/* 图片预览 */
const previewVisible = ref(false)
const previewImages = ref<string[]>([])
const previewIndex = ref(0)

/* 是否有更多 */
const hasMore = computed(() => {
  return commentList.value.length < total.value
})

/* 加载评论列表 */
const loadComments = async () => {
  if (loading.value) return
  loading.value = true

  try {
    const res = await getQuestionCommentPage({
      questionId: props.questionId,
      pageNum: pageNum.value,
      pageSize,
    })

    if (res.code === 0 && res.data) {
      const { list, total: t } = res.data
      commentList.value.push(...list)
      total.value = t
    }
  } catch (error) {
    message.error('加载评论失败')
  } finally {
    loading.value = false
  }
}

/* 加载更多 */
const loadMore = () => {
  pageNum.value++
  loadComments()
}

/* 刷新列表 */
const refresh = async () => {
  pageNum.value = 1
  commentList.value = []
  total.value = 0
  await loadComments()
}

/* 提交评论 */
const handleSubmitComment = async (content: string, media: string[]) => {
  try {
    const res = await submitQuestionComment({
      questionId: props.questionId,
      content,
      media,
    })

    if (res.code === 0 && res.data?.success) {
      message.success('评论发表成功')
      showForm.value = false
      /* 刷新列表 */
      await refresh()
    } else {
      message.error(res.msg || '评论发表失败')
    }
  } catch (error) {
    message.error('评论发表失败')
  }
}

/* 点赞 */
const handleLike = async (commentId: number, isLiked: boolean) => {
  try {
    const type = isLiked ? 2 : 1 /* 已点赞则取消，否则点赞 */
    const res = await likeComment({
      commentId,
      type,
    })

    if (res.code === 0 && res.data?.success) {
      /* 更新本地状态 */
      const comment = commentList.value.find((c) => c.id === commentId)
      if (comment) {
        comment.likedByCurrentUser = !isLiked
        comment.likeCount = res.data.likeCount
      }

      if (!isLiked) {
        message.success('点赞成功')
      }
    } else {
      message.error(res.msg || '操作失败')
    }
  } catch (error) {
    message.error('操作失败')
  }
}

/* 回复 */
const handleReply = (comment: QuestionCommentItem) => {
  currentCommentId.value = comment.id
  replyDialogRef.value?.open()
}

/* 查看回复 */
const handleViewReplies = (comment: QuestionCommentItem) => {
  currentCommentId.value = comment.id
  replyDialogRef.value?.open()
}

/* 提交回复 */
const handleSubmitReply = async (content: string, toUid: number) => {
  try {
    const res = await submitCommentReply({
      commentId: currentCommentId.value,
      toUid,
      content,
    })

    if (res.code === 0 && res.data?.success) {
      message.success('回复成功')
    } else {
      message.error(res.msg || '回复失败')
    }
  } catch (error) {
    message.error('回复失败')
  }
}

/* 回复点赞 */
const handleReplyLike = async (replyId: number, isLiked: boolean) => {
  try {
    /* 注意：这里可能需要调用不同的API或传参区分主评论和回复 */
    /* 暂时使用相同的API */
    const type = isLiked ? 2 : 1
    await likeComment({
      commentId: replyId,
      type,
    })
  } catch (error) {
    message.error('操作失败')
  }
}

/* 删除评论 */
const handleDelete = async (commentId: number) => {
  try {
    await message.confirm('确定要删除这条评论吗？', '提示')

    const res = await deleteMyComment(commentId)
    if (res.code === 0 && res.data?.success) {
      message.success('删除成功')
      /* 从列表中移除 */
      const index = commentList.value.findIndex((c) => c.id === commentId)
      if (index > -1) {
        commentList.value.splice(index, 1)
        total.value--
      }
    } else {
      message.error(res.msg || '删除失败')
    }
  } catch {
    /* 取消删除 */
  }
}

/* 预览图片 */
const handlePreviewImage = (url: string) => {
  previewImages.value = [url]
  previewIndex.value = 0
  previewVisible.value = true
}

/* 初始化 */
onMounted(() => {
  loadComments()
})

/* 暴露方法 */
defineExpose({
  refresh,
  loadComments,
})
</script>
