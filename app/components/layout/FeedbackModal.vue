<!-- 反馈模态窗 -->
<template>

  <Dialog v-model="dialogVisible" title="反馈内容" :width="650" max-height="700" @close="closeFeedbackModal">
    <el-form
      ref="feedbackFormRef"
      :model="reportData"
      :rules="reportRules"
      label-width="80px"
      label-position="top"
      class="grid grid-cols-1 gap-5 w-full"
    >
      <!-- 选择类型 -->
      <div>
        <h4 class="text-sm font-medium text-gray-500 mb-3">选择类型</h4>
        <div class="flex justify-evenly pb-2">
          <!-- 功能改进 -->
          <label class="custom-radio-card group w-1/3 cursor-pointer" for="radio-improvement">
            <input
              type="radio"
              id="radio-improvement"
              name="reportType"
              value="功能改进"
              class="report-radio absolute top-0 left-0 w-full h-full z-20 cursor-pointer opacity-0"
              v-model="reportData.type"
            />
            <div
              class="check-icon absolute inset-0 bg-blue-500 rounded-xl opacity-0 group-hover:opacity-5 transition-opacity radio-checked:opacity-10"
            ></div>
            <div
              class="relative flex flex-col items-center justify-center h-full text-center p-1 border-2 border-transparent rounded-xl group-hover:border-blue-200 transition-all"
            >
              <div
                v-if="reportData.type === '功能改进'"
                class="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white"
              >
                <el-icon>
                  <Check />
                </el-icon>
              </div>
              <div
                class="w-12 h-12 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
              >
                <Icon name="mdi:lightbulb-on-outline" :size="25" />
              </div>
              <span class="font-medium text-gray-800 mb-1 truncate">功能改进</span>
              <p class="text-xs text-gray-500 truncate text-wrap line-clamp-2">功能优化建议或新功能想法</p>
            </div>
          </label>
          <!-- 内容不当 -->
          <label class="custom-radio-card group w-1/3 cursor-pointer" for="radio-inappropriate">
            <input
              type="radio"
              id="radio-inappropriate"
              name="reportType"
              value="内容不当"
              class="report-radio absolute top-0 left-0 w-full h-full z-20 cursor-pointer opacity-0"
              v-model="reportData.type"
            />
            <div
              class="check-icon absolute inset-0 bg-blue-500 rounded-xl opacity-0 group-hover:opacity-5 transition-opacity"
            ></div>
            <div
              class="relative flex flex-col items-center justify-center h-full text-center p-2 border-2 border-transparent rounded-xl group-hover:border-blue-200 transition-all"
            >
              <div
                v-if="reportData.type === '内容不当'"
                class="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white"
              >
                <el-icon>
                  <Check />
                </el-icon>
              </div>
              <div
                class="w-12 h-12 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
              >
                <el-icon size="22">
                  <Warning />
                </el-icon>
              </div>
              <span class="font-medium text-gray-800 mb-1 truncate">内容不当</span>
              <p class="text-xs text-gray-500 truncate text-wrap line-clamp-2">包含违法/暴力/不适当内容</p>
            </div>
          </label>
          <!-- 侵权版权 -->
          <label class="custom-radio-card group w-1/3 cursor-pointer" for="radio-copyright">
            <input
              type="radio"
              id="radio-copyright"
              name="reportType"
              value="侵权版权"
              class="report-radio absolute top-0 left-0 w-full h-full z-20 cursor-pointer opacity-0"
              v-model="reportData.type"
            />
            <div
              class="check-icon absolute inset-0 bg-blue-500 rounded-xl opacity-0 group-hover:opacity-5 transition-opacity"
            ></div>
            <div
              class="relative flex flex-col items-center justify-center h-full text-center p-2 border-2 border-transparent rounded-xl group-hover:border-blue-200 transition-all"
            >
              <div
                v-if="reportData.type === '侵权版权'"
                class="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white"
              >
                <el-icon>
                  <Check />
                </el-icon>
              </div>
              <div
                class="w-12 h-12 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
              >
                <el-icon size="22">
                  <Document />
                </el-icon>
              </div>
              <span class="font-medium text-gray-800 mb-1 truncate">侵权版权</span>
              <p class="text-xs text-gray-500 truncate text-wrap line-clamp-2">涉及抄袭或侵犯知识产权</p>
            </div>
          </label>
          <!-- 其他 -->
          <label class="custom-radio-card group w-1/3 cursor-pointer" for="radio-other">
            <input
              type="radio"
              id="radio-other"
              name="reportType"
              value="其他问题"
              class="report-radio absolute top-0 left-0 w-full h-full z-20 cursor-pointer opacity-0"
              v-model="reportData.type"
            />
            <div
              class="check-icon absolute inset-0 bg-blue-500 rounded-xl opacity-0 group-hover:opacity-5 transition-opacity"
            ></div>
            <div
              class="relative flex flex-col items-center justify-center h-full text-center p-2 border-2 border-transparent rounded-xl group-hover:border-blue-200 transition-all"
            >
              <div
                v-if="reportData.type === '其他问题'"
                class="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white"
              >
                <el-icon>
                  <Check />
                </el-icon>
              </div>
              <div
                class="w-12 h-12 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
              >
                <el-icon size="22">
                  <Icon name="ep:brush" />
                </el-icon>
              </div>
              <span class="font-medium text-gray-800 mb-1 truncate">其他问题</span>
              <p class="text-xs text-gray-500 truncate text-wrap line-clamp-2">其他要反馈的问题</p>
            </div>
          </label>
        </div>
      </div>
      <!-- 举报详情 -->
      <el-form-item label="详细描述" prop="description">
        <el-input
          type="textarea"
          :rows="6"
          v-model="reportData.description"
          placeholder="请详细描述您的反馈内容，提供越详细的信息越有助于我们改进..."
          :maxlength="500"
          show-word-limit
          class="resize-none transition-all focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
        />
        <p class="text-xs text-gray-500 mt-1 ml-2">请提供足够的信息，以便我们更好地处理您的反馈</p>
      </el-form-item>
      <el-form-item label="上传附件（可选）" prop="">
        <UploadImg v-model="reportData.files" :limit="3" width="100px" height="100px">
          <template #empty>
            <div class="text-center text-gray-400">
              <Icon name="ep:upload-filled" :size="25" />
              <p class="text-xs">点击上传</p>
            </div>
          </template>
          <template #tip>
            <div class="text-xs text-gray-500 ml-2">
              支持 JPG, PNG, PDF 格式，最大 5MB，最多上传3个文件
            </div>
          </template>
        </UploadImg>
      </el-form-item>
      <div class="space-y-2">
        <!-- 确认条款 -->
        <div class="mb-6">
          <el-checkbox v-model="agreeTerms">
            <div class="text-wrap line-height-normal text-xs">
              我确认所提供的信息真实有效，且提交并非出于恶意。我理解虚假反馈可能导致我的账号受到处罚。
            </div>

          </el-checkbox>
        </div>

        <!-- 操作按钮 -->
        <div class="flex justify-center">
          <el-button @click="dialogVisible = false" class="hover:bg-gray-50 mr-5"> 取消</el-button>
          <el-button
            type="primary"
            @click="handleSubmit"
            :disabled="formLoading"
            class="hover:bg-blue-600 shadow-lg hover:shadow-xl disabled:opacity-50 hover:-translate-y-0.5 active:translate-y-0"
          >
            <span class="flex items-center" v-if="!formLoading"><Icon name="ep:promotion" class="mr-1" />提交举报</span>
            <span v-if="formLoading"> <Icon name="ep:loading" class="mr-1" /> 提交中... </span>
          </el-button>
        </div>
      </div>
    </el-form>
  </Dialog>
</template>

<script setup lang="ts">
import { Check, Warning, Document } from '@element-plus/icons-vue'
import { submitFeedback, type FeedbackQuestionVO } from '@/api/user'

const message = useMessage()
const {closeFeedbackModal} = useModalFunction()
const dialogVisible = ref(false)
const formLoading = ref(false)

const feedbackFormRef = ref()
const agreeTerms = ref(false)
const reportData = ref({
  type: '功能改进',
  description: '',
  files: []
})
const reportRules = reactive({
  description: [
    { required: true, message: '请填写反馈内容', trigger: 'blur' },
    { min: 1, max: 500, message: '请填写1-500个字符的内容', trigger: 'blur' },
  ],
})
let dataId = 0
/** 打开弹窗 */
const open = async (id: number) => {
  dialogVisible.value = true
  dataId = id
  resetForm()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const category = ref(1)
watch(()=> reportData.value.type, (val) => {
  if (val === '功能改进') {
    category.value = 1
  } else if (val === '内容不当') {
    category.value = 5
  } else if (val === '侵权版权') {
    category.value = 3
  } else {
    category.value = 4
  }
})

const handleSubmit = async () => {
  if (!agreeTerms.value) {
    message.error('请先勾选确认信息')
    return
  }
  // 校验表单
  await feedbackFormRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data: FeedbackQuestionVO = {
      dataId,
      question: reportData.value.type,
      description: reportData.value.description,
      attachments: reportData.value.files,
      category: category.value
    }
    await submitFeedback(data)
    message.success('提交成功')
    dialogVisible.value = false
  } catch (e) {
    message.error('提交失败：', e)
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  reportData.value = {
    type: 'improvement',
    description: '',
    files: [],
  }
  feedbackFormRef.value?.resetFields()
  agreeTerms.value = false
}



</script>

<style scoped>
.el-dialog__body {
  padding: 10px !important;
}

.custom-radio-card input:checked ~ .check-icon {
  opacity: 10%;
}

.custom-radio-card {
  position: relative;
  width: 25%;
  transition: transform 0.2s ease-in-out;
}

.custom-radio-card:hover {
  transform: translateY(-3px);
}

.custom-radio-card input:checked ~ div {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.custom-radio-card input:checked ~ div .w-12 {
  transform: scale(1.1);
}

/* 上传文件预览样式优化 */
#previewContainer .relative {
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
}

#previewContainer .relative:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
}

/* 复选框样式优化 */
.el-checkbox__input.is-checked .el-checkbox__inner {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

/* 自定义滚动条样式 */
:deep(.el-dialog__body) {
  scrollbar-width: thin;
  scrollbar-color: #c5c5c5 #f0f0f0;
}

:deep(.el-dialog__body::-webkit-scrollbar) {
  width: 6px;
}

:deep(.el-dialog__body::-webkit-scrollbar-track) {
  background: #f0f0f0;
  border-radius: 3px;
}

:deep(.el-dialog__body::-webkit-scrollbar-thumb) {
  background-color: #c5c5c5;
  border-radius: 3px;
  transition: background-color 0.2s;
}

:deep(.el-dialog__body::-webkit-scrollbar-thumb:hover) {
  background-color: #a8a8a8;
}

/* 表单元素焦点状态动画 */
:deep(.el-input__inner:focus),
:deep(.el-textarea__inner:focus) {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* 按钮悬停效果 */
:deep(.el-button.primary:not(:disabled)) {
  position: relative;
  overflow: hidden;
}

:deep(.el-button.primary:not(:disabled)::after) {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 150%;
  height: 150%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 80%);
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.5s;
}

:deep(.el-button.primary:not(:disabled):active::after) {
  transform: translate(-50%, -50%) scale(1);
}

.feedback-modal .el-dialog__header {
  padding: 0;
}

.attachment-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.attachment-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
