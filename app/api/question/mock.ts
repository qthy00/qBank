import type {
  QuestionSearchReqVO,
  QuestionSearchRespVO,
  QuestionFilterVO,
  QuestionSearchResultItem,
  QuestionHotSearchItem,
} from '~/types/question'

/**
 * 题目搜索 Mock 数据
 */

/* ==================== 基础数据 ==================== */

/* 题型选项 */
const mockTypeOptions = [
  { value: 1, label: '单选题', count: 1250 },
  { value: 2, label: '多选题', count: 680 },
  { value: 3, label: '判断题', count: 420 },
  { value: 4, label: '填空题', count: 280 },
  { value: 5, label: '主观题', count: 180 }
]

/* 难度选项 */
const mockDifficultyOptions = [
  { value: 1, label: '简单', count: 1500 },
  { value: 2, label: '中等', count: 980 },
  { value: 3, label: '困难', count: 330 }
]

/* 知识点选项 */
const mockPointOptions = [
  { value: 1, label: '高等数学', count: 580 },
  { value: 2, label: '线性代数', count: 320 },
  { value: 3, label: '概率论与数理统计', count: 280 },
  { value: 4, label: '微积分', count: 450 },
  { value: 5, label: '离散数学', count: 180 },
  { value: 6, label: '数学分析', count: 220 }
]

/* 题库选项 */
const mockQbankOptions = [
  { value: 1, label: '2025年考研数学', count: 1200 },
  { value: 2, label: '高等数学期末考试', count: 800 },
  { value: 3, label: '线性代数练习题', count: 450 },
  { value: 4, label: '概率论精选题库', count: 360 }
]

/* 热门搜索关键词 */
const mockHotKeywords: QuestionHotSearchItem[] = [
  { keyword: '微积分', searchCount: 2356 },
  { keyword: '极限', searchCount: 1890 },
  { keyword: '导数', searchCount: 1650 },
  { keyword: '积分', searchCount: 1420 },
  { keyword: '矩阵', searchCount: 1280 },
  { keyword: '概率', searchCount: 1150 },
  { keyword: '泰勒公式', searchCount: 980 },
  { keyword: '微分方程', searchCount: 850 }
]

/* 生成模拟题目数据 */
const generateMockQuestions = (count: number): QuestionSearchResultItem[] => {
  const questions: QuestionSearchResultItem[] = []
  const typeNames = ['', '单选题', '多选题', '判断题', '填空题', '主观题']
  const difficultyNames = ['', '简单', '中等', '困难']

  for (let i = 1; i <= count; i++) {
    const type = Math.floor(Math.random() * 5) + 1
    const difficulty = Math.floor(Math.random() * 3) + 1

    questions.push({
      id: i,
      contentId: i * 100,
      type,
      typeName: typeNames[type],
      content: generateQuestionContent(i, type),
      options: generateOptions(type),
      answer: generateAnswer(type),
      analysis: `这是一道${difficultyNames[difficulty]}难度的${typeNames[type]}，考察的是基础知识点。解题思路：首先理解题意，然后运用相关公式进行计算。`,
      point: `知识点${i}`,
      parentQuestion: '',
      parentSonType: 0,
      parentSonOrder: 0,
      questionList: [],
      isRepeat: 0,
      difficulty,
      difficultyName: difficultyNames[difficulty],
      qbankId: Math.floor(Math.random() * 4) + 1,
      qbankName: mockQbankOptions[Math.floor(Math.random() * mockQbankOptions.length)].label,
      pointList: [
        { id: Math.floor(Math.random() * 6) + 1, name: mockPointOptions[Math.floor(Math.random() * 6)].label }
      ],
      isFavorited: Math.random() > 0.7,
      viewCount: Math.floor(Math.random() * 5000) + 100,
      practiceCount: Math.floor(Math.random() * 2000) + 50,
      accuracyRate: Math.floor(Math.random() * 40) + 50,
      createTime: `2026-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
    })
  }

  return questions
}

/* 题目内容模板，包含热门搜索关键词 */
const questionTemplates = [
  { keyword: '微积分', content: (i: number) => `第${i}题：在微积分中，设函数f(x)在区间[a,b]上连续，在(a,b)内可导，则下列关于微积分的说法正确的是？` },
  { keyword: '极限', content: (i: number) => `第${i}题：求极限 lim(x→0) (sin x)/x 的值是多少？这是微积分中极限的基础概念。` },
  { keyword: '导数', content: (i: number) => `第${i}题：下列关于导数的说法，正确的是？导数是微积分中的重要概念。` },
  { keyword: '积分', content: (i: number) => `第${i}题：计算积分 ∫(0到1) x² dx 的值。积分为微积分的核心内容之一。` },
  { keyword: '矩阵', content: (i: number) => `第${i}题：矩阵A的特征值为1,2,3，则|A|的值为？线性代数中矩阵的性质。` },
  { keyword: '概率', content: (i: number) => `第${i}题：设随机变量X服从正态分布N(0,1)，则P(X>0)等于？概率论基础题目。` },
  { keyword: '泰勒公式', content: (i: number) => `第${i}题：使用泰勒公式将函数f(x)=e^x在x=0处展开到三阶。泰勒公式是微积分的重要工具。` },
  { keyword: '微分方程', content: (i: number) => `第${i}题：求解微分方程 dy/dx = 2x，满足初始条件y(0)=1的特解。微分方程是微积分的应用。` },
  { keyword: '线性代数', content: (i: number) => `第${i}题：判断向量组α1=(1,2,3), α2=(2,4,6), α3=(1,0,1)的线性相关性。线性代数基本概念。` },
  { keyword: '概率论', content: (i: number) => `第${i}题：已知事件A和B相互独立，P(A)=0.3, P(B)=0.4，求P(A∪B)。概率论与数理统计题目。` }
]

/* 生成题目内容 */
const generateQuestionContent = (index: number, _type: number): string => {
  const template = questionTemplates[index % questionTemplates.length]
  return template.content(index)
}

/* 生成选项 */
const generateOptions = (type: number): Record<string, string> => {
  if (type === 4 || type === 5) {
    return {}
  }
  return {
    A: '选项A的内容',
    B: '选项B的内容',
    C: '选项C的内容',
    D: '选项D的内容'
  }
}

/* 生成答案 */
const generateAnswer = (type: number): string => {
  if (type === 3) {
    return Math.random() > 0.5 ? '正确' : '错误'
  }
  if (type === 1) {
    const options = ['A', 'B', 'C', 'D']
    return options[Math.floor(Math.random() * 4)]
  }
  if (type === 2) {
    const options = ['A', 'B', 'C', 'D']
    const count = Math.floor(Math.random() * 3) + 2
    const selected = []
    for (let i = 0; i < count; i++) {
      selected.push(options[Math.floor(Math.random() * 4)])
    }
    return [...new Set(selected)].join(',')
  }
  return '略'
}

/* 模拟题目列表 */
const mockQuestionList = generateMockQuestions(100)

/* ==================== Mock 数据函数 ==================== */

/**
 * 搜索题目
 */
export const mockQuestionSearch = (params: QuestionSearchReqVO): QuestionSearchRespVO => {
  let list = [...mockQuestionList]

  /* 按关键词筛选 - 搜索题目内容和知识点名称 */
  if (params.keyword) {
    const lowerKeyword = params.keyword.toLowerCase()
    list = list.filter(item =>
      item.content.toLowerCase().includes(lowerKeyword) ||
      item.pointList?.some(p => p.name.toLowerCase().includes(lowerKeyword))
    )
  }

  /* 按题型筛选 */
  if (params.type) {
    list = list.filter(item => item.type === params.type)
  }

  /* 按难度筛选 */
  if (params.difficulty) {
    list = list.filter(item => item.difficulty === params.difficulty)
  }

  /* 按知识点筛选 */
  if (params.pointId) {
    list = list.filter(item =>
      item.pointList?.some(p => p.id === params.pointId)
    )
  }

  /* 按题库筛选 */
  if (params.qbankId) {
    list = list.filter(item => item.qbankId === params.qbankId)
  }

  /* 排序 */
  if (params.sort) {
    switch (params.sort) {
      case 'newest':
        list.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())
        break
      case 'hot':
        list.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
        break
      case 'difficulty_asc':
        list.sort((a, b) => a.difficulty - b.difficulty)
        break
      case 'difficulty_desc':
        list.sort((a, b) => b.difficulty - a.difficulty)
        break
    }
  }

  /* 分页 */
  const total = list.length
  const pageNo = params.pageNo || 1
  const pageSize = params.pageSize || 20
  const start = (pageNo - 1) * pageSize
  const end = start + pageSize
  const paginatedList = list.slice(start, end)

  return {
    list: paginatedList,
    total,
    pageNo,
    pageSize
  }
}

/**
 * 获取筛选选项
 */
export const mockGetQuestionFilterOptions = (): QuestionFilterVO => {
  return {
    types: mockTypeOptions,
    difficulties: mockDifficultyOptions,
    points: mockPointOptions,
    qbanks: mockQbankOptions
  }
}

/**
 * 获取热门搜索关键词
 */
export const mockGetHotSearchKeywords = (limit: number = 10): QuestionHotSearchItem[] => {
  return mockHotKeywords.slice(0, limit)
}

/**
 * 收藏/取消收藏题目
 */
export const mockToggleFavorite = (questionId: number, isFavorited: boolean): boolean => {
  const question = mockQuestionList.find(item => item.id === questionId)
  if (question) {
    question.isFavorited = isFavorited
    return true
  }
  return false
}
