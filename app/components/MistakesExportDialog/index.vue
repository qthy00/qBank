<script setup lang="ts">
import { ref, reactive, watch, onUnmounted } from 'vue'
import type { MistakeExportReqVO, MistakeExportFilterVO } from '~/types/mistake/export'
import { exportMistakes, getExportTaskStatus } from '~/api/mistakes/export'

/**
 * 错题导出弹窗组件
 */
interface Props {
  visible: boolean
  selectedIds?: number[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  success: []
}>()

const message = useMessage()

// 导出表单数据
const exportForm = reactive<MistakeExportReqVO>({
  exportType: 'pdf',
  filters: {},
  questionIds: props.selectedIds
})

// 是否导出选中项
const exportSelected = ref(props.selectedIds && props.selectedIds.length > 0)

// 题型选项
const questionTypeOptions = [
  { value: 0, label: '单选题' },
  { value: 1, label: '多选题' },
  { value: 2, label: '不定项' },
  { value: 3, label: '判断题' },
  { value: 4, label: '填空题' },
  { value: 5, label: '简答题' }
]

// 难度选项
const difficultyOptions = [
  { value: 1, label: '简单' },
  { value: 2, label: '中等' },
  { value: 3, label: '困难' }
]

// 掌握状态选项
const masteredOptions = [
  { value: null, label: '全部' },
  { value: false, label: '未掌握' },
  { value: true, label: '已掌握' }
]

// 加载状态
const loading = ref(false)

// 导出任务状态轮询
let statusTimer: NodeJS.Timeout | null = null

// 处理导出
const handleExport = async () => {
  // 构建请求参数
  const reqData: MistakeExportReqVO = {
    exportType: exportForm.exportType
  }

  // 如果选择导出选中项
  if (exportSelected.value && props.selectedIds && props.selectedIds.length > 0) {
    reqData.questionIds = props.selectedIds
  } else {
    // 否则使用筛选条件
    const filters: MistakeExportFilterVO = {}
    if (exportForm.filters?.questionType !== undefined) {
      filters.questionType = exportForm.filters.questionType
    }
    if (exportForm.filters?.difficulty !== undefined) {
      filters.difficulty = exportForm.filters.difficulty
    }
    if (exportForm.filters?.isMastered !== undefined && exportForm.filters?.isMastered !== null) {
      filters.isMastered = exportForm.filters.isMastered
    }
    if (exportForm.filters?.startTime) {
      filters.startTime = exportForm.filters.startTime
    }
    if (exportForm.filters?.endTime) {
      filters.endTime = exportForm.filters.endTime
    }
    if (Object.keys(filters).length > 0) {
      reqData.filters = filters
    }
  }

  loading.value = true
  try {
    const res = await exportMistakes(reqData)

    if (res.status === 'completed' && res.downloadUrl) {
      // 立即完成，直接下载
      downloadFile(res.downloadUrl, res.fileName || `错题导出.${res.fileName?.endsWith('.docx') ? 'docx' : 'pdf'}`)
      message.success('导出成功')
      emit('success')
      handleClose()
    } else {
      // 需要等待处理，开始轮询状态
      message.info('导出任务已提交，正在处理中...')
      startStatusPolling(res.taskId)
    }
  } catch {
    message.error('导出失败，请重试')
  } finally {
    loading.value = false
  }
}

// 轮询导出状态
const startStatusPolling = (taskId: string) => {
  if (statusTimer) clearInterval(statusTimer)

  statusTimer = setInterval(async () => {
    try {
      const res = await getExportTaskStatus(taskId)

      if (res.status === 'completed' && res.downloadUrl) {
        // 完成，停止轮询并下载
        if (statusTimer) clearInterval(statusTimer)
        downloadFile(res.downloadUrl, res.fileName || `错题导出.${res.fileName?.endsWith('.docx') ? 'docx' : 'pdf'}`)
        message.success('导出成功')
        emit('success')
        handleClose()
      } else if (res.status === 'failed') {
        // 失败，停止轮询
        if (statusTimer) clearInterval(statusTimer)
        message.error(res.errorMsg || '导出失败')
      }
    } catch {
      // 轮询出错，继续尝试
    }
  }, 2000)
}

// 下载文件
const downloadFile = (url: string, filename: string) => {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 关闭弹窗
const handleClose = () => {
  if (statusTimer) {
    clearInterval(statusTimer)
    statusTimer = null
  }
  emit('update:visible', false)
}

// 重置表单
const resetForm = () => {
  exportForm.exportType = 'pdf'
  exportForm.filters = {}
  exportForm.questionIds = undefined
  exportSelected.value = false
}

// 监听visible变化
watch(() => props.visible, (val) => {
  if (val) {
    // 打开弹窗时，如果有选中项，默认选中导出选中项
    exportSelected.value = !!(props.selectedIds && props.selectedIds.length > 0)
  } else {
    resetForm()
  }
})

// 组件卸载时清理定时器
onUnmounted(() => {
  if (statusTimer) {
    clearInterval(statusTimer)
  }
})
</script>

<template>
  <el-dialog
    :model-value="visible"
    title="导出错题"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="export-dialog-content">
      <!-- 导出方式选择 -->
      <div v-if="selectedIds && selectedIds.length > 0" class="export-mode-section">
        <el-radio-group v-model="exportSelected">
          <el-radio :value="true">
            导出选中题目（{{ selectedIds.length }}道）
          </el-radio>
          <el-radio :value="false">
            按条件筛选导出
          </el-radio>
        </el-radio-group>
      </div>

      <!-- 筛选条件 -->
      <el-form
        v-if="!exportSelected"
        :model="exportForm"
        label-width="100px"
        class="export-form"
      >
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="exportForm.filters!.startTime"
            type="date"
            placeholder="开始时间"
            value-format="YYYY-MM-DD"
            class="date-picker"
          />
          <span class="date-separator">至</span>
          <el-date-picker
            v-model="exportForm.filters!.endTime"
            type="date"
            placeholder="结束时间"
            value-format="YYYY-MM-DD"
            class="date-picker"
          />
        </el-form-item>

        <el-form-item label="题型">
          <el-select
            v-model="exportForm.filters!.questionType"
            placeholder="全部题型"
            clearable
            class="form-select"
          >
            <el-option
              v-for="opt in questionTypeOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="难度">
          <el-select
            v-model="exportForm.filters!.difficulty"
            placeholder="全部难度"
            clearable
            class="form-select"
          >
            <el-option
              v-for="opt in difficultyOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="掌握状态">
          <el-select
            v-model="exportForm.filters!.isMastered"
            placeholder="全部状态"
            clearable
            class="form-select"
          >
            <el-option
              v-for="opt in masteredOptions"
              :key="String(opt.value)"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <!-- 导出格式 -->
      <div class="export-format-section">
        <div class="section-title">导出格式</div>
        <el-radio-group v-model="exportForm.exportType">
          <el-radio value="pdf">
            <div class="format-option">
              <Icon name="material-symbols:picture-as-pdf" class="format-icon pdf" />
              <div class="format-info">
                <div class="format-name">PDF格式</div>
                <div class="format-desc">适合打印，排版精美</div>
              </div>
            </div>
          </el-radio>
          <el-radio value="word">
            <div class="format-option">
              <Icon name="material-symbols:description" class="format-icon word" />
              <div class="format-info">
                <div class="format-name">Word格式</div>
                <div class="format-desc">可编辑，便于二次整理</div>
              </div>
            </div>
          </el-radio>
        </el-radio-group>
      </div>

      <!-- 导出说明 -->
      <div class="export-tips">
        <el-alert type="info" :closable="false">
          <template #title>
            <div class="tips-content">
              <Icon name="material-symbols:info" class="tips-icon" />
              <span>导出内容包含题目、正确答案、您的答案和详细解析</span>
            </div>
          </template>
        </el-alert>
      </div>
    </div>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button
        type="primary"
        :loading="loading"
        @click="handleExport"
      >
        <Icon name="material-symbols:download" class="btn-icon" />
        开始导出
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.export-dialog-content {
  padding: 0 20px;
}

.export-mode-section {
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);

  .el-radio-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .el-radio {
    height: auto;
    padding: 8px 0;
  }
}

.export-form {
  margin-bottom: 24px;

  .date-picker {
    width: 140px;
  }

  .date-separator {
    margin: 0 8px;
    color: var(--el-text-color-secondary);
  }

  .form-select {
    width: 200px;
  }
}

.export-format-section {
  margin-bottom: 20px;

  .section-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--el-text-color-primary);
    margin-bottom: 12px;
  }

  .el-radio-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .el-radio {
    height: auto;
    margin-right: 0;
  }
}

.format-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;

  .format-icon {
    font-size: 32px;

    &.pdf {
      color: #f56c6c;
    }

    &.word {
      color: #409eff;
    }
  }

  .format-info {
    .format-name {
      font-size: 14px;
      font-weight: 500;
      color: var(--el-text-color-primary);
    }

    .format-desc {
      font-size: 12px;
      color: var(--el-text-color-secondary);
      margin-top: 2px;
    }
  }
}

.export-tips {
  .tips-content {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .tips-icon {
    font-size: 14px;
  }
}

.btn-icon {
  margin-right: 4px;
  font-size: 16px;
}

@media (max-width: 768px) {
  .export-form {
    .date-picker {
      width: 120px;
    }

    .form-select {
      width: 100%;
    }
  }
}
</style>
