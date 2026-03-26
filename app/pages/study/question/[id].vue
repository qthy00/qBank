<script setup lang="ts">
import {questionApi} from '~/api/qbank'
import {getNoteList, createNote, updateNote, deleteNote} from '~/api/note'
import type {QuestionVO} from '~/types/qBank'
import type {NoteVO, NoteFormVO} from '~/types/note'
import {createImageViewer} from '~/components/ImageViewer'
import {typeNames} from '~/api/qbank'
import QuestionNote from '~/components/Note/QuestionNote.vue'

/**
 * 题目详情页（带笔记功能）
 * 用于从笔记列表点击查看题目详情
 */

/* ==================== 路由参数 ==================== */
const route = useRoute()
const router = useRouter()
const questionId = computed(() => Number(route.params.id))
const noteId = computed(() => Number(route.query.noteId) || undefined)

/* ==================== 状态定义 ==================== */
const loading = ref(false)
const question = ref<QuestionVO | null>(null)
const note = ref<NoteVO | null>(null)
const showNotePanel = ref(true)
const message = useMessage()

/* ==================== 题目类型名称 ==================== */
const typeName = computed(() => {
  if (!question.value) return ''
  return typeNames[question.value.type] || '单选题'
})

/* ==================== 获取题目详情 ==================== */
const fetchQuestion = async () => {
  if (!questionId.value) return

  loading.value = true
  try {
    /* 尝试从API获取题目详情 */
    const data = await questionApi.getQuestion(questionId.value)
    /* 如果API返回空数据，使用mock数据 */
    if (!data || Object.keys(data).length === 0) {
      message.warning('接口未返回数据，使用演示数据')
      question.value = getMockQuestion(questionId.value)
    } else {
      question.value = data
    }
  } catch (error) {
    console.error('获取题目详情失败:', error)
    message.warning('接口数据获取失败，使用演示数据')
    /* 使用mock数据作为备选 */
    question.value = getMockQuestion(questionId.value)
  } finally {
    loading.value = false
  }
}

/* ==================== 获取笔记详情 ==================== */
const fetchNote = async () => {
  if (!noteId.value) {
    /* 如果没有指定noteId，尝试查询该题目的笔记 */
    await fetchQuestionNote()
    return
  }

  try {
    /* 通过笔记列表接口获取笔记详情（因为通常没有单独的获取笔记详情接口） */
    const res = await getNoteList({page: 1, limit: 100})
    const foundNote = res.list.find(n => n.id === noteId.value)
    if (foundNote) {
      note.value = foundNote
    } else {
      /* 如果找不到指定笔记，尝试获取该题目的笔记 */
      await fetchQuestionNote()
    }
  } catch (error) {
    console.error('获取笔记详情失败:', error)
    /* 使用mock数据 */
    note.value = getMockNote(noteId.value, questionId.value)
  }
}

/* ==================== 获取该题目的笔记 ==================== */
const fetchQuestionNote = async () => {
  try {
    const res = await getNoteList({
      page: 1,
      limit: 10,
      questionId: questionId.value
    })
    if (res.list.length > 0) {
      note.value = res.list[0]
    }
  } catch (error) {
    console.error('获取题目笔记失败:', error)
    /* 使用mock数据 */
    note.value = getMockNote(1, questionId.value)
  }
}

/* ==================== Mock数据 - 题目 ==================== */
const getMockQuestion = (id: number): QuestionVO => {
  /* 预定义的mock题目（用于展示更丰富的内容） */
  const mockQuestions: Record<number, QuestionVO> = {
    1: {
      id: id,
      content: '以下关于建筑工程项目管理的说法，正确的是（　　）',
      type: 0,
      options: {
        'A': '项目管理的核心是成本控制',
        'B': '项目管理的目标是实现项目的质量、进度和成本目标',
        'C': '项目管理只关注施工阶段',
        'D': '项目管理不需要考虑风险管理'
      },
      answer: 'B',
      analysis: '项目管理的目标是实现项目的质量、进度和成本目标，同时还需要考虑安全、环保等多方面因素。项目管理贯穿项目的全生命周期，包括决策阶段、实施阶段和使用阶段。',
      point: '建筑工程项目管理',
      difficulty: 2,
      subjectName: '建设工程项目管理',
      chapterName: '项目管理概论'
    },
    2: {
      id: id,
      content: '根据《建设工程安全生产管理条例》，施工单位应当对管理人员和作业人员每年至少进行（　　）次安全生产教育培训。',
      type: 0,
      options: {
        'A': '1',
        'B': '2',
        'C': '3',
        'D': '4'
      },
      answer: 'A',
      analysis: '根据《建设工程安全生产管理条例》第三十六条规定，施工单位应当对管理人员和作业人员每年至少进行一次安全生产教育培训。',
      point: '建设工程安全生产管理',
      difficulty: 1,
      subjectName: '建设工程法规及相关知识',
      chapterName: '安全生产法律制度'
    },
    3: {
      id: id,
      content: '关于建设工程合同的说法，正确的有（　　）',
      type: 1,
      options: {
        'A': '建设工程合同应当采用书面形式',
        'B': '建设工程合同包括工程勘察、设计、施工合同',
        'C': '建设工程合同是不要式合同',
        'D': '建设工程合同可以口头约定',
        'E': '建设工程合同是双务合同'
      },
      answer: 'A,B,E',
      analysis: '建设工程合同应当采用书面形式，属于要式合同。建设工程合同包括工程勘察、设计、施工合同。建设工程合同是双务合同，当事人互负对待给付义务。',
      point: '建设工程合同制度',
      difficulty: 3,
      subjectName: '建设工程法规及相关知识',
      chapterName: '合同法律制度'
    }
  }

  /* 如果ID在预定义列表中，返回预定义的题目 */
  if (mockQuestions[id]) {
    return mockQuestions[id]
  }

  /* 对于任何其他ID，返回一个基于ID生成的mock题目 */
  const types = [0, 0, 0, 1, 3] /* 单选题、多选题、判断题 */
  const type = types[id % types.length]
  const difficulties = [1, 2, 2, 3]
  const difficulty = difficulties[id % difficulties.length]

  return {
    id: id,
    content: type === 3
        ? '这道判断题考查的是相关知识点，请判断正误。（Mock演示数据）'
        : `这是一道示例题目（Mock数据）<br/><br/>题目ID: ${id}<br/>此数据为演示数据，用于展示题目详情页功能。在实际项目中，此处会显示真实的题目内容。`,
    type: type,
    options: type === 3 ? undefined : {
      'A': '选项A：这是第一个选项的内容描述',
      'B': '选项B：这是第二个选项的内容描述',
      'C': type === 1 ? '选项C：这是第三个选项（多选题专用）' : '选项C：这是第三个选项的内容描述',
      'D': type === 1 ? '选项D：这是第四个选项（多选题专用）' : '选项D：这是第四个选项的内容描述',
      ...(type === 1 ? {'E': '选项E：这是第五个选项（多选题专用）'} : {})
    },
    answer: type === 3 ? '1' : type === 1 ? 'A,B' : 'A',
    analysis: `<p><strong>解析说明（Mock数据）：</strong></p>
<p>这是一道${type === 0 ? '单选题' : type === 1 ? '多选题' : type === 3 ? '判断题' : '其他题型'}的解析示例。</p>
<p><strong>正确答案：</strong>${type === 3 ? '正确' : type === 1 ? 'A、B' : 'A'}</p>
<p><strong>考点分析：</strong>此题主要考查相关知识点的理解和应用。在实际项目中，此处会显示详细的解题思路和知识点说明。</p>
<p><strong>学习建议：</strong>建议结合教材相关章节进行复习，并通过类似题目进行巩固练习。</p>`,
    point: '示例考点（Mock数据）',
    difficulty: difficulty,
    subjectName: '示例科目（Mock数据）',
    chapterName: '示例章节（Mock数据）'
  }
}

/* ==================== Mock数据 - 笔记 ==================== */
const getMockNote = (noteId: number, qId: number): NoteVO => {
  return {
    id: noteId,
    userId: 1,
    questionId: qId,
    qbankId: 1,
    qbankName: '一级建造师',
    questionContent: 'Mock题目内容',
    content: '<p>这是一份<strong>示例笔记</strong>，用于演示笔记功能。</p><p>在实际使用中，用户可以在这里记录：</p><ul><li>解题思路</li><li>易错点提醒</li><li>相关知识点</li><li>个人理解</li></ul>',
    tags: '重点,易错点',
    tagList: ['重点', '易错点'],
    isPublic: false,
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString()
  }
}

/* ==================== 笔记操作回调 ==================== */
const handleNoteSaved = (noteData: NoteFormVO) => {
  message.success('笔记保存成功')
  /* 刷新笔记数据 */
  fetchNote()
}

const handleNoteDeleted = () => {
  message.success('笔记已删除')
  note.value = null
}

/* ==================== 图片预览 ==================== */
const imagePreview = (imgUrl: string) => {
  createImageViewer({
    zIndex: 9999999,
    urlList: [imgUrl],
  })
}

const handleImageClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (target.tagName === 'IMG') {
    e.stopPropagation()
    imagePreview((target as HTMLImageElement).src)
  }
}

/* ==================== 返回 ==================== */
const goBack = () => {
  /* 优先返回笔记列表页 */
  if (window.history.length > 1) {
    router.back()
  } else {
    navigateTo('/account/notes')
  }
}

/* ==================== 初始化 ==================== */
onMounted(() => {
  fetchQuestion()
  fetchNote()
})

/* ==================== 页面标题 ==================== */
useHead({
  title: '题目详情 - 学习笔记',
  meta: [
    {
      name: 'description',
      content: '查看题目详情和相关学习笔记'
    }
  ]
})
</script>

<template>
  <div class="min-h-screen bg-[var(--color-bg-page)]">
    <!-- 页面头部 -->
    <div class="bg-white shadow-sm sticky top-0 z-30">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-4">
            <el-button link @click="goBack">
              <Icon name="ep:arrow-left" class="mr-1"/>
              返回
            </el-button>
            <h1 class="text-lg font-semibold text-gray-800">题目详情</h1>
          </div>

          <!-- 笔记面板开关 -->
          <el-button
              type="primary"
              link
              @click="showNotePanel = !showNotePanel"
          >
            <Icon :name="showNotePanel ? 'ep:hide' : 'ep:view'" class="mr-1"/>
            {{ showNotePanel ? '隐藏笔记' : '显示笔记' }}
          </el-button>
        </div>
      </div>
    </div>

    <!-- 主体内容 -->
    <div class="container mx-auto px-4 py-6">
      <div class="grid gap-6" :class="showNotePanel ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'">
        <!-- 左侧题目区域 -->
        <div :class="showNotePanel ? 'lg:col-span-2' : 'col-span-1'">
          <el-card v-loading="loading" class="min-h-[600px]">
            <div v-if="question" class="space-y-6">
              <!-- 题目头部 -->
              <div class="flex items-center justify-between pb-4 border-b border-gray-100">
                <div class="flex items-center gap-3">
                  <el-tag type="primary" effect="light">
                    {{ typeName }}
                  </el-tag>
                  <el-tag
                      v-if="question.difficulty"
                      :type="question.difficulty === 1 ? 'success' : question.difficulty === 2 ? 'warning' : 'danger'"
                      effect="light"
                  >
                    {{ question.difficulty === 1 ? '简单' : question.difficulty === 2 ? '中等' : '困难' }}
                  </el-tag>
                </div>
                <div class="text-sm text-gray-500">
                  题目ID: {{ question.id }}
                </div>
              </div>

              <!-- 题目内容 -->
              <div class="space-y-4">
                <div
                    class="text-lg font-medium text-gray-800 leading-relaxed"
                    @click="handleImageClick"
                    v-html="question.content"
                />

                <!-- 选项 -->
                <div v-if="question.options" class="space-y-3 mt-6">
                  <div
                      v-for="(value, key) in question.options"
                      :key="key"
                      class="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <span class="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-medium">
                      {{ key }}
                    </span>
                    <div class="flex-1 text-gray-700 leading-relaxed" v-html="value" @click="handleImageClick"/>
                  </div>
                </div>

                <!-- 填空题提示 -->
                <div v-if="question.type === 4" class="p-4 bg-blue-50 rounded-lg">
                  <p class="text-blue-700">请在下方输入您的答案...</p>
                </div>

                <!-- 简答题/案例题提示 -->
                <div v-if="[5, 6, 7].includes(question.type)" class="p-4 bg-blue-50 rounded-lg">
                  <p class="text-blue-700">请在笔记面板中记录您的答题思路...</p>
                </div>
              </div>

              <!-- 答案和解析 -->
              <div class="mt-8 space-y-4">
                <!-- 正确答案 -->
                <div class="bg-green-50 rounded-lg p-4 border border-green-100">
                  <div class="flex items-center gap-2 mb-2">
                    <Icon name="ep:check" class="text-green-600"/>
                    <span class="font-medium text-green-800">正确答案</span>
                  </div>
                  <div class="text-green-700 pl-6">
                    {{ question.answer }}
                  </div>
                </div>

                <!-- 考点 -->
                <div v-if="question.point" class="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <div class="flex items-center gap-2 mb-2">
                    <Icon name="ep:collection" class="text-blue-600"/>
                    <span class="font-medium text-blue-800">考点</span>
                  </div>
                  <div class="text-blue-700 pl-6">
                    {{ question.point }}
                  </div>
                </div>

                <!-- 解析 -->
                <div class="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div class="flex items-center gap-2 mb-2">
                    <Icon name="ep:document" class="text-gray-600"/>
                    <span class="font-medium text-gray-800">解析</span>
                  </div>
                  <div
                      class="text-gray-700 pl-6 leading-relaxed"
                      @click="handleImageClick"
                      v-html="question.analysis || '暂无解析'"
                  />
                </div>

                <!-- 题目来源信息 -->
                <div class="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t border-gray-100">
                  <span v-if="question.subjectName">
                    <Icon name="ep:folder" class="mr-1"/>
                    {{ question.subjectName }}
                  </span>
                  <span v-if="question.chapterName">
                    <Icon name="ep:files" class="mr-1"/>
                    {{ question.chapterName }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 空状态 -->
            <el-empty v-else-if="!loading" description="暂无题目数据"/>
          </el-card>
        </div>

        <!-- 右侧笔记区域 -->
        <div v-if="showNotePanel" class="lg:col-span-1">
          <QuestionNote
              :question-id="questionId"
              :qbank-id="question?.packageId || note?.qbankId"
              :qbank-name="question?.packageName || note?.qbankName"
              :question-content="question?.content || note?.questionContent"
              :existing-note="note || undefined"
              @saved="handleNoteSaved"
              @deleted="handleNoteDeleted"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* 题目内容样式优化 */
:deep(.question-content) {
  p {
    margin-bottom: 0.5rem;
  }

  img {
    max-width: 100%;
    height: auto;
    cursor: zoom-in;
  }
}

/* 选项样式 */
.option-item {
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--color-bg-container-hover);
  }
}
</style>
