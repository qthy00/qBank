import type {
  NoteVO,
  NoteListRespVO,
  NoteCreateReqVO,
  NoteUpdateReqVO,
  NoteStatisticsRespVO,
  NoteTagStatVO,
} from '~/types/note'

/**
 * 笔记模块 Mock 数据
 */

/* ==================== 基础数据 ==================== */

/**
 * Mock 笔记标签
 */
export const mockNoteTags = [
  { id: 1, name: '重点', color: '#ef4444' },
  { id: 2, name: '难点', color: '#f59e0b' },
  { id: 3, name: '易错', color: '#3b82f6' },
  { id: 4, name: '技巧', color: '#22c55e' },
  { id: 5, name: '公式', color: '#8b5cf6' },
]

/**
 * Mock 笔记列表数据
 */
export const mockNoteList: NoteVO[] = [
  {
    id: 1,
    userId: 1,
    questionId: 101,
    qbankId: 1,
    qbankName: '2025年一级建造师考试',
    questionContent: '关于建筑工程项目管理的目标，下列说法正确的是...',
    content: '<p>这道题考查的是项目管理的核心概念。<strong>重点记住：</strong>项目管理的目标包括质量、进度、成本、安全、环保等多个维度。</p><p>易错点：容易只记住传统的"三大目标"（质量、进度、成本），忽略了现代项目管理对安全和环保的重视。</p>',
    tags: '重点,易错',
    tagList: ['重点', '易错'],
    isPublic: false,
    createTime: '2026-03-25T10:30:00',
    updateTime: '2026-03-25T10:30:00',
  },
  {
    id: 2,
    userId: 1,
    questionId: 102,
    qbankId: 1,
    qbankName: '2025年一级建造师考试',
    questionContent: '下列关于施工组织设计的说法，错误的是...',
    content: '<p>施工组织设计的编制要求是高频考点。<strong>记忆技巧：</strong>可以用"3W1H"来记忆——What（做什么）、Why（为什么做）、When（何时做）、How（怎么做）。</p><p>特别注意：施工组织设计必须经过审批才能实施，这是很多同学容易忽略的点。</p>',
    tags: '技巧,重点',
    tagList: ['技巧', '重点'],
    isPublic: true,
    createTime: '2026-03-24T15:20:00',
    updateTime: '2026-03-24T15:20:00',
  },
  {
    id: 3,
    userId: 1,
    questionId: 201,
    qbankId: 2,
    qbankName: '2025年二级建造师考试',
    questionContent: '建筑工程中，混凝土的强度等级是指...',
    content: '<p>混凝土强度等级的定义是：<strong>混凝土立方体抗压强度的标准值</strong>。</p><p>公式：f<sub>cu,k</sub> —— 混凝土立方体抗压强度标准值</p><p>注意区分：标准值 vs 设计值 vs 平均值</p>',
    tags: '公式,重点',
    tagList: ['公式', '重点'],
    isPublic: false,
    createTime: '2026-03-23T09:15:00',
    updateTime: '2026-03-23T09:15:00',
  },
  {
    id: 4,
    userId: 1,
    questionId: 301,
    qbankId: 3,
    qbankName: 'PMP项目管理认证',
    questionContent: '在项目管理中，WBS的分解原则包括...',
    content: '<p>WBS（工作分解结构）的分解原则：</p><ol><li><strong>100%原则</strong>：WBS要包含项目的全部工作</li><li><strong>互斥原则</strong>：各工作包之间不能有重叠</li><li><strong>可交付成果导向</strong>：以产出物为导向而非活动</li></ol><p>难点：区分WBS与活动清单（WBS是做什么，活动清单是怎么做）</p>',
    tags: '难点,技巧',
    tagList: ['难点', '技巧'],
    isPublic: true,
    createTime: '2026-03-22T14:00:00',
    updateTime: '2026-03-22T14:00:00',
  },
  {
    id: 5,
    userId: 1,
    questionId: 103,
    qbankId: 1,
    qbankName: '2025年一级建造师考试',
    questionContent: '建设工程项目进度控制的措施包括...',
    content: '<p>进度控制措施的分类记忆法：</p><ul><li><strong>组织措施</strong>：人、部门、分工、流程</li><li><strong>管理措施</strong>：方法、手段、合同、模式</li><li><strong>经济措施</strong>：钱、资源、激励</li><li><strong>技术措施</strong>：方案、方法、材料、机械</li></ul><p>考试技巧：看到"措施"题，先从这四个维度去思考。</p>',
    tags: '技巧,重点,易错',
    tagList: ['技巧', '重点', '易错'],
    isPublic: false,
    createTime: '2026-03-21T16:30:00',
    updateTime: '2026-03-21T16:30:00',
  },
]

/* ==================== 数据生成函数 ==================== */

/**
 * 获取 Mock 笔记列表
 * @param params 查询参数
 * @returns 笔记列表
 */
export const getMockNoteList = (params: {
  page?: number
  limit?: number
  qbankId?: number
  keyword?: string
  tag?: string
}): NoteListRespVO => {
  const { page = 1, limit = 10, qbankId, keyword, tag } = params
  let list = [...mockNoteList]

  /* 按题库ID筛选 */
  if (qbankId) {
    list = list.filter(item => item.qbankId === qbankId)
  }

  /* 按关键词搜索 */
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase()
    list = list.filter(item =>
      item.content.toLowerCase().includes(lowerKeyword) ||
      item.questionContent.toLowerCase().includes(lowerKeyword) ||
      item.tags.toLowerCase().includes(lowerKeyword)
    )
  }

  /* 按标签筛选 */
  if (tag) {
    list = list.filter(item => item.tags.includes(tag))
  }

  /* 排序：按更新时间倒序 */
  list.sort((a, b) => new Date(b.updateTime).getTime() - new Date(a.updateTime).getTime())

  /* 分页 */
  const total = list.length
  const start = (page - 1) * limit
  const end = start + limit
  const paginatedList = list.slice(start, end)

  return {
    list: paginatedList,
    total,
  }
}

/**
 * 获取 Mock 笔记详情
 * @param id 笔记ID
 * @returns 笔记详情
 */
export const getMockNoteDetail = (id: number): NoteVO | null => {
  return mockNoteList.find(item => item.id === id) || null
}

/**
 * 获取 Mock 笔记统计
 * @returns 笔记统计数据
 */
export const getMockNoteStatistics = (): NoteStatisticsRespVO => {
  const today = new Date().toISOString().split('T')[0]
  const todayCount = mockNoteList.filter(item =>
    item.createTime.startsWith(today)
  ).length

  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  const weekCount = mockNoteList.filter(item =>
    new Date(item.createTime) >= weekAgo
  ).length

  /* 统计所有标签 */
  const tagSet = new Set<string>()
  mockNoteList.forEach(item => {
    item.tagList.forEach(tag => tagSet.add(tag))
  })

  return {
    totalCount: mockNoteList.length,
    todayCount,
    weekCount,
    tagCount: tagSet.size,
  }
}

/**
 * 获取 Mock 笔记标签统计
 * @returns 标签统计列表
 */
export const getMockNoteTagStats = (): NoteTagStatVO[] => {
  const tagCountMap = new Map<string, number>()

  mockNoteList.forEach(item => {
    item.tagList.forEach(tag => {
      tagCountMap.set(tag, (tagCountMap.get(tag) || 0) + 1)
    })
  })

  return Array.from(tagCountMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
}

/**
 * 创建 Mock 笔记
 * @param data 笔记数据
 * @returns 创建的笔记ID
 */
export const mockCreateNote = (data: NoteCreateReqVO): number => {
  const newId = mockNoteList.length > 0
    ? Math.max(...mockNoteList.map(item => item.id)) + 1
    : 1

  const now = new Date().toISOString()
  const tagList = data.tags ? data.tags.split(',').filter(Boolean) : []

  const newNote: NoteVO = {
    id: newId,
    userId: 1,
    questionId: data.questionId,
    qbankId: data.qbankId,
    qbankName: '未知题库',
    questionContent: '题目内容...',
    content: data.content,
    tags: data.tags || '',
    tagList,
    isPublic: data.isPublic ?? false,
    createTime: now,
    updateTime: now,
  }

  mockNoteList.unshift(newNote)
  return newId
}

/**
 * 更新 Mock 笔记
 * @param data 笔记数据
 * @returns 是否成功
 */
export const mockUpdateNote = (data: NoteUpdateReqVO): boolean => {
  const index = mockNoteList.findIndex(item => item.id === data.id)
  if (index === -1) return false

  const tagList = data.tags ? data.tags.split(',').filter(Boolean) : []

  mockNoteList[index] = {
    ...mockNoteList[index],
    content: data.content,
    tags: data.tags || '',
    tagList,
    isPublic: data.isPublic ?? mockNoteList[index].isPublic,
    updateTime: new Date().toISOString(),
  }

  return true
}

/**
 * 删除 Mock 笔记
 * @param id 笔记ID
 * @returns 是否成功
 */
export const mockDeleteNote = (id: number): boolean => {
  const index = mockNoteList.findIndex(item => item.id === id)
  if (index === -1) return false

  mockNoteList.splice(index, 1)
  return true
}
