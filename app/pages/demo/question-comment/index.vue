<template>
  <div class="page-container p-4">
    <!-- 题目信息卡片 -->
    <el-card class="mb-4" shadow="never">
      <template #header>
        <div class="flex items-center gap-2">
          <Icon name="ep:document" class="text-(--color-btn-primary)" />
          <span class="font-medium">题目详情</span>
        </div>
      </template>

      <div class="space-y-4">
        <h2 class="text-lg font-medium text-(--color-text-primary)">
          这是一道示例题目的标题
        </h2>
        <p class="text-(--color-text-secondary)">
          这是一道示例题目的描述内容，用于演示题目评论功能。在实际使用时，这里会显示真实的题目内容。
        </p>

        <!-- 选项示例 -->
        <div class="space-y-2">
          <div class="flex items-center gap-2 p-3 bg-(--color-bg-container-hover) rounded-lg">
            <span class="w-6 h-6 flex items-center justify-center bg-(--color-btn-primary) text-white rounded-full text-sm">A</span>
            <span class="text-(--color-text-primary)">选项A内容</span>
          </div>
          <div class="flex items-center gap-2 p-3 bg-(--color-bg-container-hover) rounded-lg">
            <span class="w-6 h-6 flex items-center justify-center bg-(--color-border) text-(--color-text-secondary) rounded-full text-sm">B</span>
            <span class="text-(--color-text-primary)">选项B内容</span>
          </div>
          <div class="flex items-center gap-2 p-3 bg-(--color-bg-container-hover) rounded-lg">
            <span class="w-6 h-6 flex items-center justify-center bg-(--color-border) text-(--color-text-secondary) rounded-full text-sm">C</span>
            <span class="text-(--color-text-primary)">选项C内容</span>
          </div>
          <div class="flex items-center gap-2 p-3 bg-(--color-bg-container-hover) rounded-lg">
            <span class="w-6 h-6 flex items-center justify-center bg-(--color-border) text-(--color-text-secondary) rounded-full text-sm">D</span>
            <span class="text-(--color-text-primary)">选项D内容</span>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 评论组件 -->
    <QuestionComment
      ref="commentRef"
      :question-id="questionId"
      :current-user-id="2001"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  title: '题目评论演示',
})

/* 题目ID（实际使用时从路由参数获取） */
const questionId = 123

/* 评论组件引用 */
const commentRef = ref<InstanceType<typeof QuestionComment>>()
</script>

<style scoped lang="scss">
.page-container {
  max-width: 800px;
  margin: 0 auto;
}
</style>
