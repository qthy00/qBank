<template>
  <div
    class="option-item flex min-w-[120px] sm:min-w-[140px] flex items-center p-2 sm:p-2.5 rounded-lg relative transition-all duration-200"
    :class="getOptionClass"
  >
    <!-- 正确/错误标识 -->
    <div v-if="isCorrect || isWrong" class="option-marker absolute top-0 right-0">
      <div
        class="w-5 h-5 rounded-bl-lg flex items-center justify-center"
        :class="isCorrect ? 'bg-success/60' : 'bg-error/60'"
      >
        <Icon
          :name="isCorrect ? 'ep:check' : 'ep:close'"
          class="text-white"
          :size="12"
        />
      </div>
    </div>

    <!-- 选项字母 -->
    <span
      v-if="showKey"
      class="option-letter w-5 h-5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center mr-2 sm:mr-2.5 flex-shrink-0 text-xs"
      :class="getLetterClass"
    >
      {{ optionKey }}
    </span>

    <!-- 选项内容 -->
    <span class="option-text text-sm whitespace-normal">{{ optionValue }}</span>
  </div>
</template>

<script setup lang="ts">

// 接收props
const props = defineProps<{
  optionKey: string
  optionValue: string
  isCorrect: boolean
  isWrong: boolean
  showKey: boolean
}>();

// 选项样式计算
const getOptionClass = computed(() => {
  if (props.isCorrect) {
    return 'border-2 border-success bg-success/5';
  } else if (props.isWrong) {
    return 'border-2 border-error bg-error/5';
  }
  return 'border bg-slate-100 border-slate-200 hover:border-slate-300';
});

// 选项字母样式计算
const getLetterClass = computed(() => {
  if (props.isCorrect) {
    return 'bg-success/20 border border-success/30 text-success';
  } else if (props.isWrong) {
    return 'bg-error/20 border border-error/30 text-error';
  }
  return 'bg-slate-100 text-slate-700';
});
</script>

<style scoped>
.option-item {
  cursor: default;
}

.option-item:hover {
  transform: translateY(-1px);
}
</style>
