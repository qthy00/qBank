<script setup lang="ts">
import type { NoteVO, NoteTagStatVO } from '~/types/note'
import { getNoteList, getNoteStatistics, getNoteTagStats, deleteNote } from '~/api/note'

/**
 * 学习笔记页面
 */
definePageMeta({
  layout: 'member',
})

/* 加载状态 */
const loading = ref(false)
const deleteLoading = ref<number | null>(null)

/* 笔记列表 */
const notes = ref<NoteVO[]>([])
const total = ref(0)

/* 笔记统计 */
const statistics = ref({
  totalCount: 0,
  todayCount: 0,
  weekCount: 0,
  tagCount: 0,
})

/* 标签统计 */
const tagStats = ref<NoteTagStatVO[]>([])

/* 查询参数 */
const query = reactive({
  page: 1,
  limit: 10,
  qbankId: undefined as number | undefined,
  keyword: '',
  tag: '',
})

/* 当前选中的标签 */
const selectedTag = ref('')

/* 路由 */
const router = useRouter()

/* 消息提示 */
const message = useMessage()

/* ==================== 方法 ==================== */

/**
 * 获取笔记列表
 */
const fetchNotes = async () => {
  loading.value = true
  try {
    const res = await getNoteList(query)
    notes.value = res.list
    total.value = res.total
  } catch (error) {
    console.error('获取笔记列表失败:', error)
    message.error('获取笔记列表失败')
  } finally {
    loading.value = false
  }
}

/**
 * 获取笔记统计
 */
const fetchStatistics = async () => {
  try {
    const res = await getNoteStatistics()
    statistics.value = res
  } catch (error) {
    console.error('获取笔记统计失败:', error)
  }
}

/**
 * 获取标签统计
 */
const fetchTagStats = async () => {
  try {
    const res = await getNoteTagStats()
    tagStats.value = res
  } catch (error) {
    console.error('获取标签统计失败:', error)
  }
}

/**
 * 处理搜索
 */
const handleSearch = () => {
  query.page = 1
  fetchNotes()
}

/**
 * 处理重置
 */
const handleReset = () => {
  query.keyword = ''
  query.tag = ''
  selectedTag.value = ''
  query.page = 1
  fetchNotes()
}

/**
 * 按标签筛选
 */
const handleTagFilter = (tag: string) => {
  if (selectedTag.value === tag) {
    /* 取消筛选 */
    selectedTag.value = ''
    query.tag = ''
  } else {
    selectedTag.value = tag
    query.tag = tag
  }
  query.page = 1
  fetchNotes()
}

/**
 * 处理分页变化
 */
const handlePageChange = (page: number) => {
  query.page = page
  fetchNotes()
}

/**
 * 格式化日期
 */
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) {
    return '今天'
  }
  if (days === 1) {
    return '昨天'
  }
  if (days < 7) {
    return `${days}天前`
  }
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
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

/**
 * 查看笔记详情
 */
const handleViewDetail = (note: NoteVO) => {
  /* 跳转到题目详情页，并带上笔记ID */
  navigateTo(`/study/question/${note.questionId}?noteId=${note.id}`)
}

/**
 * 编辑笔记
 */
const handleEdit = (note: NoteVO) => {
  navigateTo(`/study/question/${note.questionId}?noteId=${note.id}&edit=1`)
}

/**
 * 删除笔记
 */
const handleDelete = async (note: NoteVO) => {
  try {
    await message.confirm(`确定要删除这条笔记吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    deleteLoading.value = note.id
    const success = await deleteNote(note.id)
    if (success) {
      message.success('删除成功')
      fetchNotes()
      fetchStatistics()
      fetchTagStats()
    } else {
      message.error('删除失败')
    }
  } catch {
    /* 取消删除 */
  } finally {
    deleteLoading.value = null
  }
}

/**
 * 清空富文本HTML标签，获取纯文本摘要
 */
const getTextSummary = (html: string, maxLength: number = 100): string => {
  const text = html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ')
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/* ==================== 初始化 ==================== */

onMounted(() => {
  fetchNotes()
  fetchStatistics()
  fetchTagStats()
})
</script>

<template>
  <div class="page-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-title">
        <Icon name="ep:edit-pen" class="title-icon" />
        <h1>学习笔记</h1>
      </div>
      <p class="header-desc">记录学习心得，整理重点难点</p>
    </div>

    <!-- 统计卡片 -->
    <div class="statistics-cards">
      <div class="stat-card">
        <div class="stat-value">{{ statistics.totalCount }}</div>
        <div class="stat-label">笔记总数</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color: #22c55e;">{{ statistics.todayCount }}</div>
        <div class="stat-label">今日新增</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color: #3b82f6;">{{ statistics.weekCount }}</div>
        <div class="stat-label">本周新增</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color: #8b5cf6;">{{ statistics.tagCount }}</div>
        <div class="stat-label">标签数量</div>
      </div>
    </div>

    <!-- 标签筛选 -->
    <div v-if="tagStats.length > 0" class="tag-filter-section">
      <span class="tag-label">标签筛选：</span>
      <div class="tag-list">
        <el-tag
          v-for="stat in tagStats"
          :key="stat.tag"
          :type="selectedTag === stat.tag ? 'primary' : 'info'"
          class="filter-tag"
          @click="handleTagFilter(stat.tag)"
        >
          {{ stat.tag }} ({{ stat.count }})
        </el-tag>
      </div>
    </div>

    <!-- 搜索区域 -->
    <div class="search-section">
      <el-input
        v-model="query.keyword"
        placeholder="搜索笔记内容"
        clearable
        @keyup.enter="handleSearch"
      >
        <template #prefix>
          <Icon name="ep:search" />
        </template>
      </el-input>
      <el-button type="primary" @click="handleSearch">
        <Icon name="ep:search" />
        搜索
      </el-button>
      <el-button @click="handleReset">
        <Icon name="ep:refresh" />
        重置
      </el-button>
    </div>

    <!-- 笔记列表 -->
    <div v-loading="loading" class="notes-list">
      <el-empty v-if="notes.length === 0" description="暂无笔记，去练习页面添加笔记吧" />

      <template v-else>
        <div
          v-for="note in notes"
          :key="note.id"
          class="note-card"
        >
          <!-- 笔记头部 -->
          <div class="note-header">
            <div class="header-left">
              <span class="qbank-name">{{ note.qbankName }}</span>
              <el-tag v-if="note.isPublic" type="success" size="small">公开</el-tag>
              <el-tag v-else type="info" size="small">私有</el-tag>
            </div>
            <span class="note-time">{{ formatDate(note.updateTime) }}</span>
          </div>

          <!-- 关联题目 -->
          <div class="question-section">
            <div class="question-label">关联题目：</div>
            <p class="question-content">{{ note.questionContent }}</p>
          </div>

          <!-- 笔记内容 -->
          <div class="note-content">
            <p class="content-text">{{ getTextSummary(note.content, 150) }}</p>
          </div>

          <!-- 笔记标签 -->
          <div v-if="note.tagList.length > 0" class="note-tags">
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

          <!-- 操作按钮 -->
          <div class="note-actions">
            <el-button type="primary" link @click="handleViewDetail(note)">
              <Icon name="ep:view" />
              查看详情
            </el-button>
            <el-button type="primary" link @click="handleEdit(note)">
              <Icon name="ep:edit" />
              编辑
            </el-button>
            <el-button
              type="danger"
              link
              :loading="deleteLoading === note.id"
              @click="handleDelete(note)"
            >
              <Icon name="ep:delete" />
              删除
            </el-button>
          </div>
        </div>

        <!-- 分页 -->
        <div class="pagination-wrapper">
          <el-pagination
            v-model:current-page="query.page"
            :page-size="query.limit"
            :total="total"
            layout="prev, pager, next, jumper"
            @current-change="handlePageChange"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-container {
  padding: 0 16px 16px;
}

.page-header {
  margin-bottom: 20px;
  padding-top: 8px;

  .header-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;

    .title-icon {
      font-size: 22px;
      color: var(--el-color-primary);
    }

    h1 {
      font-size: 18px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
  }

  .header-desc {
    font-size: 13px;
    color: var(--el-text-color-secondary);
  }
}

/* 统计卡片 */
.statistics-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.stat-card {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  padding: 16px 12px;
  text-align: center;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }

  .stat-value {
    font-size: 24px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    margin-bottom: 4px;
  }

  .stat-label {
    font-size: 13px;
    color: var(--el-text-color-secondary);
  }
}

/* 标签筛选 */
.tag-filter-section {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  padding: 12px 16px;
  background: var(--el-fill-color-light);
  border-radius: 8px;

  .tag-label {
    font-size: 14px;
    color: var(--el-text-color-secondary);
    white-space: nowrap;
  }

  .tag-list {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .filter-tag {
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      transform: scale(1.05);
    }
  }
}

/* 搜索区域 */
.search-section {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
  flex-wrap: wrap;

  .el-input {
    flex: 1;
    min-width: 200px;
  }
}

/* 笔记列表 */
.notes-list {
  min-height: 200px;
}

.note-card {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  }
}

/* 笔记头部 */
.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  .header-left {
    display: flex;
    align-items: center;
    gap: 8px;

    .qbank-name {
      font-size: 14px;
      font-weight: 500;
      color: var(--el-color-primary);
    }
  }

  .note-time {
    font-size: 13px;
    color: var(--el-text-color-secondary);
  }
}

/* 关联题目 */
.question-section {
  margin-bottom: 12px;
  padding: 10px 12px;
  background: var(--el-fill-color-light);
  border-radius: 6px;

  .question-label {
    font-size: 12px;
    color: var(--el-text-color-secondary);
    margin-bottom: 4px;
  }

  .question-content {
    font-size: 13px;
    color: var(--el-text-color-primary);
    margin: 0;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

/* 笔记内容 */
.note-content {
  margin-bottom: 12px;

  .content-text {
    font-size: 14px;
    color: var(--el-text-color-primary);
    line-height: 1.6;
    margin: 0;
  }
}

/* 笔记标签 */
.note-tags {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;

  .el-tag {
    border: none;
  }
}

/* 操作按钮 */
.note-actions {
  display: flex;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--el-border-color-lighter);

  .el-button {
    padding: 4px 8px;
  }
}

/* 分页 */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding-top: 20px;
  margin-top: 20px;
  border-top: 1px solid var(--el-border-color-light);
}
</style>
