<template>
  <el-dialog
    v-model="visible"
    width="400px"
    align-center
    :show-close="false"
    class="rounded-xl"
    :close-on-click-modal="false"
    lock-scroll
  >
    <template #header>
      <div class="text-xl font-semibold text-[#409EFF] flex items-center gap-2">
        <Icon name="material-symbols:magic-button" class="text-2xl" />
        {{ title }}
      </div>
    </template>

    <div class="flex flex-col items-center text-center py-4">
      <!-- 动图 -->
      <img
        src="../assets/images/loading.gif"
        alt="生成中"
        class="w-80 h-32 object-contain mb-4"
      />

      <div class="text-sm text-gray-600">
        {{ description }}
        <br />
        <br />
        请稍候，预计耗时约 <b>10~30 秒</b>。
      </div>

      <!-- 进度模拟 -->
      <el-progress
        :percentage="progress"
        class="w-full mt-6"
        striped
        striped-flow
        :show-text="false"
        color="#409EFF"
      />
    </div>
  </el-dialog>
</template>

<script setup lang="ts">

const visible = defineModel<boolean>()
const progress = ref(0);

defineProps({
  title: {
    type: String,
    default: '智能 AI 正在生成测试报告',
    required: false
  },
  description: {
    type: String,
    default: '正在分析您的问卷，智能生成个性化测试报告。',
    required: false
  }
})

onMounted(() => {
  let timer = setInterval(() => {
    if (progress.value >= 100) {
      clearInterval(timer);
    } else {
      progress.value += Math.random() * 10 + 5;
      if (progress.value > 100) progress.value = 100;
    }
  }, 400);
});
</script>

<style scoped>
.el-dialog {
  border-radius: 1rem;
}
</style>
