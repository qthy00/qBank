<template>
    <!-- 时间显示 -->
    <div
      class="flex items-center px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 transition-all duration-300"
      :class="isWarning ? 'bg-amber-50 border-amber-200' : ''"
    >
      <div class="w-3 h-3 rounded-full bg-red-500 mr-2 animate-pulse"></div>
      <span class="text-sm font-medium text-slate-700 md:hidden xl:block">
        {{ timer?.timeMode === 'countdown' ? '剩余时间：' : '已用时间：' }}
      </span>
      <span
        :class="
          isWarning
            ? 'text-amber-600 font-bold text-xl ml-1'
            : 'text-slate-800 font-semibold text-xl ml-1'
        "
      >
        {{ formattedTime }}
      </span>
    </div>
</template>

<script setup lang="ts">
// 接收父组件传入的计时器ID和索引
const props = defineProps<{
  timerId: string
  index: number
}>()

const timerStore = useTimerStore()
const timer = computed(() => timerStore.getTimer(props.timerId))

// 确保计时器存在
if (!timer.value) {
  throw new Error(`计时器 ${props.timerId} 不存在`)
}

// 计算属性
const formattedTime = computed(() => {
  if (!timer.value) return '00:00'
  return timerStore.formatTime(timer.value.currentSeconds, timer.value.totalSeconds)
})

const isWarning = computed(() => {
  if(!timer.value) return false
  return timer.value.timeMode === 'countdown' &&
    timer.value.currentSeconds > 0 &&
    timer.value.currentSeconds <= 15 * 60
})


onMounted(() => {
  if (timer.value) {
    timerStore.startTimer(timer.value.id)
  }
})

// 组件卸载时停止计时器
onUnmounted(() => {
  if (timer.value) {
    timerStore.stopTimer(timer.value.id)
  }
})
</script>

<style scoped>
.timer-name-input {
  width: 140px;
}

.mode-radio-group {
  display: flex;
  gap: 10px;
}

.duration-input {
  width: 120px;
}
</style>
