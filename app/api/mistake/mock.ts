/**
 * 错题本模拟数据
 * 用于开发和测试
 */
import type {
  MistakeVO,
  MistakeListRespVO,
  MistakeStatsVO,
  MistakeQueryReqVO,
} from '~/types/mistake'
import type { QuestionVO } from '~/types/qbank'

/**
 * 模拟题目数据
 */
const mockQuestions: QuestionVO[] = [
  {
    id: 1,
    contentId: 1,
    type: 0,
    typeName: '单选题',
    content: '在建筑工程项目管理中，以下哪个选项是项目进度控制的主要方法？',
    options: {
      'A': '关键路径法（CPM）',
      'B': '随机抽样法',
      'C': '头脑风暴法',
      'D': '德尔菲法'
    },
    parentQuestion: '',
    answer: 'A',
    point: '项目管理,进度控制',
    analysis: '关键路径法（Critical Path Method，CPM）是项目进度控制的核心方法，通过识别项目中的关键路径来确定最短工期和浮动时间。',
    parentSonType: 0,
    parentSonOrder: 0,
    questionList: [],
    isRepeat: 0,
    difficulty: 2,
  },
  {
    id: 2,
    contentId: 2,
    type: 0,
    typeName: '单选题',
    content: '根据《建设工程质量管理条例》，建设工程的保修期自何时起计算？',
    options: {
      'A': '合同签订之日',
      'B': '竣工验收合格之日',
      'C': '工程开工之日',
      'D': '工程交付使用之日'
    },
    parentQuestion: '',
    answer: 'B',
    point: '法规,质量管理条例',
    analysis: '《建设工程质量管理条例》规定，建设工程的保修期自竣工验收合格之日起计算。',
    parentSonType: 0,
    parentSonOrder: 0,
    questionList: [],
    isRepeat: 0,
    difficulty: 1,
  },
  {
    id: 3,
    contentId: 3,
    type: 1,
    typeName: '多选题',
    content: '下列关于建设工程合同类型的说法，正确的有？',
    options: {
      'A': '总价合同适用于工程量明确的项目',
      'B': '单价合同适用于工程量可能变动的项目',
      'C': '成本加酬金合同适用于紧急工程',
      'D': '固定价格合同没有任何风险'
    },
    parentQuestion: '',
    answer: 'ABC',
    point: '合同管理,合同类型',
    analysis: '固定价格合同并非没有任何风险，承包商仍面临成本上涨等风险，因此D选项错误。',
    parentSonType: 0,
    parentSonOrder: 0,
    questionList: [],
    isRepeat: 0,
    difficulty: 2,
  },
  {
    id: 4,
    contentId: 4,
    type: 3,
    typeName: '判断题',
    content: '施工组织设计只需在施工前编制一次，施工过程中无需调整。',
    options: {
      'A': '正确',
      'B': '错误'
    },
    parentQuestion: '',
    answer: 'B',
    point: '施工管理,施工组织设计',
    analysis: '施工组织设计应根据工程实际情况动态调整，特别是在施工条件发生重大变化时需要及时修订。',
    parentSonType: 0,
    parentSonOrder: 0,
    questionList: [],
    isRepeat: 0,
    difficulty: 1,
  },
  {
    id: 5,
    contentId: 5,
    type: 0,
    typeName: '单选题',
    content: '在会计核算中，资产负债表反映的是企业哪个时点的财务状况？',
    options: {
      'A': '一定期间的经营成果',
      'B': '特定日期的财务状况',
      'C': '现金流量的变动',
      'D': '所有者权益的变动'
    },
    parentQuestion: '',
    answer: 'B',
    point: '会计,财务报表',
    analysis: '资产负债表是静态报表，反映企业在特定日期的财务状况。',
    parentSonType: 0,
    parentSonOrder: 0,
    questionList: [],
    isRepeat: 0,
    difficulty: 1,
  },
  {
    id: 6,
    contentId: 6,
    type: 0,
    typeName: '单选题',
    content: '下列各项中，属于企业非流动资产的是？',
    options: {
      'A': '库存现金',
      'B': '应收账款',
      'C': '固定资产',
      'D': '存货'
    },
    parentQuestion: '',
    answer: 'C',
    point: '会计,资产分类',
    analysis: '固定资产属于非流动资产，而库存现金、应收账款、存货均属于流动资产。',
    parentSonType: 0,
    parentSonOrder: 0,
    questionList: [],
    isRepeat: 0,
    difficulty: 1,
  },
  {
    id: 7,
    contentId: 7,
    type: 0,
    typeName: '单选题',
    content: '根据《执业医师法》，执业医师注册的有效期为？',
    options: {
      'A': '1年',
      'B': '2年',
      'C': '3年',
      'D': '5年'
    },
    parentQuestion: '',
    answer: 'B',
    point: '卫生法规,执业医师',
    analysis: '《执业医师法》规定，执业医师注册的有效期为2年。',
    parentSonType: 0,
    parentSonOrder: 0,
    questionList: [],
    isRepeat: 0,
    difficulty: 2,
  },
  {
    id: 8,
    contentId: 8,
    type: 1,
    typeName: '多选题',
    content: '下列属于二级建造师执业范围的有？',
    options: {
      'A': '大型房屋建筑工程',
      'B': '中型房屋建筑工程',
      'C': '小型房屋建筑工程',
      'D': '各类房屋建筑工程'
    },
    parentQuestion: '',
    answer: 'BC',
    point: '建造师,执业范围',
    analysis: '二级建造师可以承担中小型项目的项目负责人，不能承担大型项目。',
    parentSonType: 0,
    parentSonOrder: 0,
    questionList: [],
    isRepeat: 0,
    difficulty: 2,
  },
  {
    id: 9,
    contentId: 9,
    type: 0,
    typeName: '单选题',
    content: '在TCP/IP协议栈中，HTTP协议工作在？',
    options: {
      'A': '网络层',
      'B': '传输层',
      'C': '应用层',
      'D': '数据链路层'
    },
    parentQuestion: '',
    answer: 'C',
    point: '计算机网络,协议栈',
    analysis: 'HTTP（超文本传输协议）工作在TCP/IP协议栈的应用层。',
    parentSonType: 0,
    parentSonOrder: 0,
    questionList: [],
    isRepeat: 0,
    difficulty: 1,
  },
  {
    id: 10,
    contentId: 10,
    type: 3,
    typeName: '判断题',
    content: '在数据库设计中，第三范式（3NF）要求消除非主属性对主属性的传递依赖。',
    options: {
      'A': '正确',
      'B': '错误'
    },
    parentQuestion: '',
    answer: 'A',
    point: '数据库,范式',
    analysis: '第三范式（3NF）要求满足第二范式，并且消除非主属性对主属性的传递函数依赖。',
    parentSonType: 0,
    parentSonOrder: 0,
    questionList: [],
    isRepeat: 0,
    difficulty: 3,
  },
  {
    id: 11,
    contentId: 11,
    type: 0,
    typeName: '单选题',
    content: '幼儿园教育活动的基本形式是？',
    options: {
      'A': '课堂教学',
      'B': '游戏',
      'C': '观察',
      'D': '操作'
    },
    parentQuestion: '',
    answer: 'B',
    point: '幼儿教育,教育活动',
    analysis: '游戏是幼儿园教育活动的基本形式，符合幼儿身心发展特点。',
    parentSonType: 0,
    parentSonOrder: 0,
    questionList: [],
    isRepeat: 0,
    difficulty: 1,
  },
  {
    id: 12,
    contentId: 12,
    type: 0,
    typeName: '单选题',
    content: '根据《合同法》，要约可以撤销，但是有下列哪种情形的除外？',
    options: {
      'A': '要约人确定了承诺期限',
      'B': '要约以对话方式作出',
      'C': '要约以书面形式作出',
      'D': '要约内容不明确'
    },
    parentQuestion: '',
    answer: 'A',
    point: '合同法,要约',
    analysis: '《合同法》规定，要约人确定了承诺期限的要约不可撤销。',
    parentSonType: 0,
    parentSonOrder: 0,
    questionList: [],
    isRepeat: 0,
    difficulty: 2,
  },
]

/**
 * 模拟错题数据
 */
const generateMockMistakes = (): MistakeVO[] => {
  const subjects = [
    { id: 1, name: '建筑工程' },
    { id: 2, name: '财务会计' },
    { id: 3, name: '医药卫生' },
    { id: 4, name: '教师资格' },
    { id: 5, name: 'IT认证' },
  ]

  const chapters = [
    { id: 1, name: '第一章 基础知识' },
    { id: 2, name: '第二章 核心概念' },
    { id: 3, name: '第三章 实践应用' },
    { id: 4, name: '第四章 案例分析' },
  ]

  return mockQuestions.map((question, index) => {
    const subject = subjects[index % subjects.length]
    const chapter = chapters[index % chapters.length]
    const isMastered = index < 3 // 前3题已掌握

    return {
      id: index + 1,
      questionId: question.id,
      question: question,
      subjectId: subject.id,
      subjectName: subject.name,
      chapterId: chapter.id,
      chapterName: chapter.name,
      mistakeCount: Math.floor(Math.random() * 5) + 1,
      lastMistakeTime: Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000),
      isMastered: isMastered,
      masteredTime: isMastered ? Date.now() - Math.floor(Math.random() * 3 * 24 * 60 * 60 * 1000) : undefined,
      createTime: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
    }
  })
}

// 生成错题数据
const mockMistakes = generateMockMistakes()

/**
 * 获取错题列表（支持筛选和分页）
 */
export const getMockMistakeList = (params: MistakeQueryReqVO): MistakeListRespVO => {
  let list = [...mockMistakes]

  // 题型筛选
  if (params.questionType !== undefined) {
    list = list.filter(item => item.question?.type === params.questionType)
  }

  // 难度筛选
  if (params.difficulty !== undefined) {
    list = list.filter(item => item.question?.difficulty === params.difficulty)
  }

  // 掌握状态筛选
  if (params.isMastered !== undefined) {
    list = list.filter(item => item.isMastered === params.isMastered)
  }

  // 科目筛选
  if (params.subjectId !== undefined) {
    list = list.filter(item => item.subjectId === params.subjectId)
  }

  // 章节筛选
  if (params.chapterId !== undefined) {
    list = list.filter(item => item.chapterId === params.chapterId)
  }

  // 关键词搜索
  if (params.keyword) {
    const keyword = params.keyword.toLowerCase()
    list = list.filter(item =>
      item.question?.content?.toLowerCase().includes(keyword) ||
      item.subjectName?.toLowerCase().includes(keyword) ||
      item.chapterName?.toLowerCase().includes(keyword)
    )
  }

  // 分页
  const page = params.page || 1
  const limit = params.limit || 20
  const start = (page - 1) * limit
  const end = start + limit

  return {
    list: list.slice(start, end),
    total: list.length,
  }
}

/**
 * 获取错题统计
 */
export const getMockMistakeStats = (): MistakeStatsVO => {
  const totalCount = mockMistakes.length
  const masteredCount = mockMistakes.filter(m => m.isMastered).length
  const unMasteredCount = totalCount - masteredCount
  const todayCount = mockMistakes.filter(m => {
    const today = new Date().toDateString()
    const mistakeDate = new Date(m.lastMistakeTime).toDateString()
    return today === mistakeDate
  }).length

  // 科目统计
  const subjectMap = new Map<number, { name: string; count: number }>()
  mockMistakes.forEach(m => {
    if (!subjectMap.has(m.subjectId)) {
      subjectMap.set(m.subjectId, { name: m.subjectName || '未知', count: 0 })
    }
    subjectMap.get(m.subjectId)!.count++
  })

  const subjectStats = Array.from(subjectMap.entries()).map(([id, data]) => ({
    subjectId: id,
    subjectName: data.name,
    count: data.count,
    percentage: Math.round((data.count / totalCount) * 100),
  }))

  // 题型统计
  const typeMap = new Map<number, { name: string; count: number }>()
  mockMistakes.forEach(m => {
    const type = m.question?.type || 0
    const typeName = m.question?.typeName || '其他'
    if (!typeMap.has(type)) {
      typeMap.set(type, { name: typeName, count: 0 })
    }
    typeMap.get(type)!.count++
  })

  const typeStats = Array.from(typeMap.entries()).map(([type, data]) => ({
    type,
    typeName: data.name,
    count: data.count,
    percentage: Math.round((data.count / totalCount) * 100),
  }))

  return {
    totalCount,
    unMasteredCount,
    masteredCount,
    todayCount,
    weekCount: Math.floor(Math.random() * 5) + 1,
    subjectStats,
    typeStats,
  }
}

/**
 * 标记掌握/取消掌握
 */
export const mockMarkMastered = (questionId: number, isMastered: boolean): boolean => {
  const mistake = mockMistakes.find(m => m.questionId === questionId)
  if (mistake) {
    mistake.isMastered = isMastered
    mistake.masteredTime = isMastered ? Date.now().toString() : undefined
    return true
  }
  return false
}

/**
 * 移除错题
 */
export const mockRemoveMistake = (questionId: number): boolean => {
  const index = mockMistakes.findIndex(m => m.questionId === questionId)
  if (index > -1) {
    mockMistakes.splice(index, 1)
    return true
  }
  return false
}

/**
 * 获取错题详情
 */
export const getMockMistakeDetail = (questionId: number): MistakeVO | null => {
  return mockMistakes.find(m => m.questionId === questionId) || null
}
