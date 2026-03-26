<script setup lang="ts">
import type { NoteVO, NoteCreateReqVO, NoteUpdateReqVO } from '~/types/note'
import { getNoteDetail, createNote, updateNote } from '~/api/note'

/**
 * 题目笔记组件
 * 用于在题目详情页显示和编辑笔记
 */

/* 组件属性 */
const props = defineProps<{
  /** 题目ID */
  questionId: number
  /** 题库ID */
  qbankId: number
  /** 题库名称 */
  qbankName: string
  /** 题目内容（用于笔记关联显示） */
  questionContent?: string
}>()

/* 组件事件 */
const emit = defineEmits<{
  /** 笔记保存成功 */
  (e: 'success'): void
  /** 取消编辑 */
  (e: 'cancel'): void
}>()

/* 消息提示 */
const message = useMessage()

/* 加载状态 */
const loading = ref(false)
const saveLoading = ref(false)

/* 笔记数据 */
const note = ref<NoteVO | null>(null)
const isEditing = ref(false)

/* 表单数据 */
const formData = reactive<{
  content: string
  tags: string
  isPublic: boolean
}>({
  content: '',
  tags: '',
  isPublic: false,
})

/* 预定义标签 */
const predefinedTags = ['重点', '难点', '易错', '技巧', '公式']

/* ==================== 方法 ==================== */

/**
 * 获取笔记详情
 */
const fetchNoteDetail = async () => {
  /* 如果有笔记ID从URL参数获取 */
  const route = useRoute()
  const noteId = Number(route.query.noteId)

  if (!noteId) {
    /* 检查是否已有笔记 */
    /* 这里应该调用查询接口检查该题目是否已有笔记 */
    return
  }

  loading.value = true
  try {
    const res = await getNoteDetail(noteId)
    if (res) {
      note.value = res
      /* 填充表单 */
      formData.content = res.content
      formData.tags = res.tags
      formData.isPublic = res.isPublic
    }
  } catch (error) {
    console.error('获取笔记详情失败:', error)
  } finally {
    loading.value = false
  }
}

/**
 * 开始编辑
 */
const handleEdit = () => {
  if (note.value) {
    formData.content = note.value.content
    formData.tags = note.value.tags
    formData.isPublic = note.value.isPublic
  }
  isEditing.value = true
}

/**
 * 取消编辑
 */
const handleCancel = () => {
  isEditing.value = false
  emit('cancel')
}

/**
 * 保存笔记
 */
const handleSave = async () => {
  /* 验证 */
  if (!formData.content.trim()) {
    message.error('笔记内容不能为空')
    return
  }

  saveLoading.value = true
  try {
    if (note.value) {
      /* 更新现有笔记 */
      const updateData: NoteUpdateReqVO = {
        id: note.value.id,
        content: formData.content,
        tags: formData.tags,
        isPublic: formData.isPublic,
      }
      const success = await updateNote(updateData)
      if (success) {
        message.success('笔记更新成功')
        note.value.content = formData.content
        note.value.tags = formData.tags
        note.value.isPublic = formData.isPublic
        isEditing.value = false
        emit('success')
      } else {
        message.error('更新失败')
      }
    } else {
      /* 创建新笔记 */
      const createData: NoteCreateReqVO = {
        questionId: props.questionId,
        qbankId: props.qbankId,
        content: formData.content,
        tags: formData.tags,
        isPublic: formData.isPublic,
      }
      const newId = await createNote(createData)
      if (newId) {
        message.success('笔记创建成功')
        /* 设置笔记ID */
        note.value = {
          id: newId,
          userId: 1,
          questionId: props.questionId,
          qbankId: props.qbankId,
          qbankName: props.qbankName,
          questionContent: props.questionContent || '',
          content: formData.content,
          tags: formData.tags,
          tagList: formData.tags.split(',').filter(Boolean),
          isPublic: formData.isPublic,
          createTime: new Date().toISOString(),
          updateTime: new Date().toISOString(),
        }
        isEditing.value = false
        emit('success')
      } else {
        message.error('创建失败')
      }
    }
  } catch (error) {
    console.error('保存笔记失败:', error)
    message.error('保存失败')
  } finally {
    saveLoading.value = false
  }
}

/**
 * 添加标签
 */
const handleAddTag = (tag: string) => {
  const currentTags = formData.tags.split(',').filter(Boolean)
  if (!currentTags.includes(tag)) {
    currentTags.push(tag)
    formData.tags = currentTags.join(',')
  }
}

/**
 * 获取文本摘要
 */
const getTextSummary = (html: string, maxLength: number = 200): string => {
  const text = html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ')
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * 获取标签颜色
 */
const getTagColor = (tag: string): string => {
  const colorMap: Record<string, string> = {
    '重点': '#ef4444',
    '难点': '#f59e0b',
    '易错': '#3b82f6',
    '技巧': '#22c55e',
    '公式': '#8b5cf6',
  }
  return colorMap[tag] || '#6b7280'
}

/* ==================== 初始化 ==================== */

onMounted(() => {
  fetchNoteDetail()
})
</script>

<template>
  <div class="note-component">
    <!-- 查看模式 -->
    <div v-if="!isEditing && note" class="note-view">
      <div class="view-header">
        <div class="header-left">
          <Icon name="ep:edit-pen" class="note-icon" />
          <span class="note-title">我的笔记</span>
        </div>
        <div class="header-right">
          <el-tag v-if="note.isPublic" type="success" size="small">公开</el-tag>
          <el-tag v-else type="info" size="small">私有</el-tag>
        </div>
      </div>

      <div class="view-content" v-html="note.content" />

      <div v-if="note.tagList.length > 0" class="view-tags">
        <el-tag
          v-for="tag in note.tagList"
          :key="tag"
          size="small"
          :color="getTagColor(tag)"
          effect="dark"
        >
          {{ tag }}
        </el-tag>
      </div>

      <div class="view-actions">
        <el-button type="primary" @click="handleEdit">
          <Icon name="ep:edit" />
          编辑笔记
        </el-button>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!isEditing && !note" class="note-empty">
      <Icon name="ep:edit-pen" class="empty-icon" />
      <p class="empty-text">暂无笔记</p>
      <p class="empty-desc">记录这道题的解题思路、易错点或重点知识</p>
      <el-button type="primary" @click="isEditing = true">
        <Icon name="ep:plus" />
        添加笔记
      </el-button>
    </div>

    <!-- 编辑模式 -->
    <div v-else class="note-edit">
      <div class="edit-header">
        <Icon name="ep:edit-pen" class="edit-icon" />
        <span>{{ note ? '编辑笔记' : '添加笔记' }}</span>
      </div>

      <!-- 富文本编辑器 -->
      <el-input
        v-model="formData.content"
        type="textarea"
        :rows="6"
        placeholder="记录你的学习心得...&#10;支持换行，可以记录：&#10;- 解题思路和技巧&#10;- 易错点和注意事项&#10;- 相关知识点关联"
        resize="vertical"
      />

      <!-- 标签选择 -->
      <div class="tag-section">
        <div class="tag-label">添加标签：</div>
        <div class="predefined-tags">
          <el-tag
            v-for="tag in predefinedTags"
            :key="tag"
            size="small"
            :color="getTagColor(tag)"
            effect="dark"
            class="clickable-tag"
            @click="handleAddTag(tag)"
          >
            + {{ tag }}
          </el-tag>
        </div>
        <el-input
          v-model="formData.tags"
          placeholder="自定义标签，用逗号分隔"
          size="small"
          class="tag-input"
        />
      </div>

      <!-- 公开设置 -->
      <div class="privacy-section">
        <el-checkbox v-model="formData.isPublic">
          公开笔记（其他用户可见）
        </el-checkbox>
      </div>

      <!-- 操作按钮 -->
      <div class="edit-actions">
        <el-button @click="handleCancel">取消</el-button>
        <el-button
          type="primary"
          :loading="saveLoading"
          @click="handleSave"
        >
          {{ note ? '保存修改' : '创建笔记' }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.note-component {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  overflow: hidden;
}

/* 查看模式 */
.note-view {
  padding: 16px;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  .header-left {
    display: flex;
    align-items: center;
    gap: 8px;

    .note-icon {
      font-size: 18px;
      color: var(--el-color-primary);
    }

    .note-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
  }
}

.view-content {
  font-size: 14px;
  line-height: 1.8;
  color: var(--el-text-color-primary);
  margin-bottom: 12px;

  /* 富文本样式 */
  :deep(p) {
    margin: 0 0 8px 0;

    &:last-child {
      margin-bottom: 0;
    }
  }

  :deep(strong) {
    color: var(--el-color-primary);
  }

  :deep(ol), :deep(ul) {
    margin: 8px 0;
    padding-left: 20px;
  }

  :deep(li) {
    margin-bottom: 4px;
  }
}

.view-tags {
  display: flex;
  gap: 6px;
  margin-bottom: 16px;

  .el-tag {
    border: none;
  }
}

.view-actions {
  display: flex;
  justify-content: flex-end;
}

/* 空状态 */
.note-empty {
  padding: 40px 20px;
  text-align: center;

  .empty-icon {
    font-size: 48px;
    color: var(--el-text-color-placeholder);
    margin-bottom: 16px;
  }

  .empty-text {
    font-size: 16px;
    font-weight: 500;
    color: var(--el-text-color-primary);
    margin: 0 0 8px 0;
  }

  .empty-desc {
    font-size: 13px;
    color: var(--el-text-color-secondary);
    margin: 0 0 20px 0;
  }
}

/* 编辑模式 */
.note-edit {
  padding: 16px;
}

.edit-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);

  .edit-icon {
    font-size: 18px;
    color: var(--el-color-primary);
  }
}

.tag-section {
  margin-top: 16px;

  .tag-label {
    font-size: 13px;
    color: var(--el-text-color-secondary);
    margin-bottom: 8px;
  }

  .predefined-tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 10px;

    .clickable-tag {
      cursor: pointer;
      transition: all 0.2s;
      border: none;

      &:hover {
        transform: scale(1.05);
        opacity: 0.9;
      }
    }
  }

  .tag-input {
    width: 100%;
  }
}

.privacy-section {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-lighter);
}
</style>
