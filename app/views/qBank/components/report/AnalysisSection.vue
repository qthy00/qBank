<template>
  <div class="analysis-section bg-slate-50 p-2 sm:p-3 rounded-lg border border-slate-200 text-xs sm:text-sm">
    <div class="analysis-header flex flex-wrap justify-between items-center mb-1.5 gap-2">
      <p class="analysis-title font-medium text-slate-700 flex items-center">
        <Icon name="solar:document-add-broken" class="mr-1 text-slate-700" :size="14" />
        解析：
      </p>
      <div v-if="show" class="answers-container flex flex-wrap items-center gap-x-4 gap-y-1">
        <span class="user-answer text-primary flex items-center">
          你的答案：<span class="font-medium ml-1">{{ userAnswer || '未作答' }}</span>
        </span>
        <span class="correct-answer text-success flex items-center">
          正确答案：<span class="font-medium ml-1">{{ correctAnswer }}</span>
        </span>
      </div>
    </div>
<!--    <div v-if="point" >考点： {{ point }}</div>-->
    <div class="analysis-content text-slate-500 leading-tight" v-html="analysis || '暂无解析'" />
  </div>
</template>

<script setup lang="ts">

defineProps({
  userAnswer: {
    type: String,
    required: false,
  },
  correctAnswer: {
    type: String,
    required: false,
  },
  analysis: {
    type: String,
    required: false,
  },
  point: {
    type: String,
    required: false,
  },
  show: {
    type: Boolean,
    required: true,
  },

})


</script>

<style scoped>
.analysis-section {
  transition: all 0.2s ease;
}

.analysis-section:hover {
  border-color: #e2e8f0;
  background-color: #f8fafc;
}
</style>
