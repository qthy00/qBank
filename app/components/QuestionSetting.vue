<script setup lang="ts">

const questionStore = useQBankStore()
const dialogVisible = ref(false)
const {showAnswerSetting} = storeToRefs(questionStore)
/** 打开弹窗 */
const open = async () => {
  dialogVisible.value = true
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const confirm = () => {
  dialogVisible.value = false
}
</script>

<template>
  <Dialog v-model="dialogVisible" title="练习设置" width="500px" :scroll="false">
    <div class="flex flex-col items-center justify-center">
      <p class="text-lg mb-3 font-bold">练习时，是否自动显示答案和解析</p>
      <el-radio-group v-model="showAnswerSetting">
<!--        <el-radio :value="0">始终显示</el-radio>-->
        <el-radio :value="3">答题后显示</el-radio>
        <el-radio :value="1">仅在答错时显示</el-radio>
        <el-radio :value="2">不显示</el-radio>
      </el-radio-group>
    </div>

    <el-button
      type="primary"
      class="float-end m-4 bg-gradient-to-r from-blue-600 to-blue-400 border-none text-white rounded-full shadow-md hover:opacity-90"
      size="large"
      @click="confirm()"
    >
      确 定
    </el-button>
  </Dialog>
</template>

<style scoped>
.container-list {
  max-height: 400px;
  overflow-y: auto;
}

.option-btn {
  border-radius: 20px;
  padding: 4px 16px;
  transition: all 0.2s ease;
}

.default {
  background-color: #f5f7fa;
  color: #606266;
  border: 1px solid #e4e7ed;
}

.default:hover {
  background-color: #e9ecef;
  color: #409eff;
  border-color: #c6e2ff;
}

.selected {
  background-color: #ecf5ff;
  color: #409eff;
  border-color: #93c5fd;
}

.selected:hover {
  background-color: #dcefff;
}
</style>
