/**
 * 练习相关 Mock 数据
 */
import type { QuestionVO, ChapterVO, SectionVO } from '~/types/qBank'

/* 题型定义 */
export const questionTypes: Record<number, string> = {
  0: '单选题',
  1: '多选题',
  2: '不定项选择题',
  3: '判断题',
  4: '填空题',
  5: '简答题',
  6: '案例题',
  7: '论述题',
  8: '复合题',
}

/* Mock 章节数据 */
export const mockChapters: ChapterVO[] = [
  {
    id: 1,
    name: '第一章 建设工程基本法律知识',
    total: 45,
    completedCount: 12,
    accuracyRate: 68,
    sectionList: [
      { id: 11, name: '1.1 建设工程法律体系', total: 8, chapterId: 1, chapterName: '第一章' },
      { id: 12, name: '1.2 建设工程法人制度', total: 12, chapterId: 1, chapterName: '第一章' },
      { id: 13, name: '1.3 建设工程代理制度', total: 10, chapterId: 1, chapterName: '第一章' },
      { id: 14, name: '1.4 建设工程物权制度', total: 15, chapterId: 1, chapterName: '第一章' },
    ]
  },
  {
    id: 2,
    name: '第二章 施工许可法律制度',
    total: 38,
    completedCount: 0,
    accuracyRate: 0,
    sectionList: [
      { id: 21, name: '2.1 建设工程施工许可制度', total: 18, chapterId: 2, chapterName: '第二章' },
      { id: 22, name: '2.2 施工企业从业资格制度', total: 12, chapterId: 2, chapterName: '第二章' },
      { id: 23, name: '2.3 建造师注册执业制度', total: 8, chapterId: 2, chapterName: '第二章' },
    ]
  },
  {
    id: 3,
    name: '第三章 建设工程发承包法律制度',
    total: 52,
    completedCount: 25,
    accuracyRate: 72,
    sectionList: [
      { id: 31, name: '3.1 建设工程招标投标制度', total: 25, chapterId: 3, chapterName: '第三章' },
      { id: 32, name: '3.2 建设工程承包制度', total: 15, chapterId: 3, chapterName: '第三章' },
      { id: 33, name: '3.3 建筑市场信用体系建设', total: 12, chapterId: 3, chapterName: '第三章' },
    ]
  },
  {
    id: 4,
    name: '第四章 建设工程合同和劳动合同法律制度',
    total: 68,
    completedCount: 30,
    accuracyRate: 65,
    sectionList: [
      { id: 41, name: '4.1 建设工程合同制度', total: 35, chapterId: 4, chapterName: '第四章' },
      { id: 42, name: '4.2 劳动合同及劳动者权益保护制度', total: 20, chapterId: 4, chapterName: '第四章' },
      { id: 43, name: '4.3 相关合同制度', total: 13, chapterId: 4, chapterName: '第四章' },
    ]
  },
  {
    id: 5,
    name: '第五章 建设工程施工环境保护、节约能源和文物保护法律制度',
    total: 32,
    completedCount: 0,
    accuracyRate: 0,
    sectionList: [
      { id: 51, name: '5.1 施工现场环境保护制度', total: 15, chapterId: 5, chapterName: '第五章' },
      { id: 52, name: '5.2 施工节约能源制度', total: 10, chapterId: 5, chapterName: '第五章' },
      { id: 53, name: '5.3 施工文物保护制度', total: 7, chapterId: 5, chapterName: '第五章' },
    ]
  },
  {
    id: 6,
    name: '第六章 建设工程安全生产法律制度',
    total: 78,
    completedCount: 45,
    accuracyRate: 75,
    sectionList: [
      { id: 61, name: '6.1 施工安全生产许可证制度', total: 12, chapterId: 6, chapterName: '第六章' },
      { id: 62, name: '6.2 施工安全生产责任和安全生产教育培训制度', total: 28, chapterId: 6, chapterName: '第六章' },
      { id: 63, name: '6.3 施工现场安全防护制度', total: 25, chapterId: 6, chapterName: '第六章' },
      { id: 64, name: '6.4 施工安全事故的应急救援与调查处理', total: 13, chapterId: 6, chapterName: '第六章' },
    ]
  },
  {
    id: 7,
    name: '第七章 建设工程质量法律制度',
    total: 58,
    completedCount: 0,
    accuracyRate: 0,
    sectionList: [
      { id: 71, name: '7.1 工程建设标准', total: 15, chapterId: 7, chapterName: '第七章' },
      { id: 72, name: '7.2 施工单位的质量责任和义务', total: 25, chapterId: 7, chapterName: '第七章' },
      { id: 73, name: '7.3 建设单位及相关单位的质量责任和义务', total: 18, chapterId: 7, chapterName: '第七章' },
    ]
  },
  {
    id: 8,
    name: '第八章 解决建设工程纠纷法律制度',
    total: 48,
    completedCount: 20,
    accuracyRate: 70,
    sectionList: [
      { id: 81, name: '8.1 建设工程纠纷主要种类和法律解决途径', total: 18, chapterId: 8, chapterName: '第八章' },
      { id: 82, name: '8.2 民事诉讼制度', total: 20, chapterId: 8, chapterName: '第八章' },
      { id: 83, name: '8.3 仲裁制度', total: 10, chapterId: 8, chapterName: '第八章' },
    ]
  },
]

/* 生成单选题 */
const generateSingleChoice = (id: number, _chapterId: number): QuestionVO => {
  const options: Record<string, string> = {
    'A': ['建设单位', '设计单位', '施工单位', '监理单位'][Math.floor(Math.random() * 4)],
    'B': ['施工单位', '建设单位', '监理单位', '设计单位'][Math.floor(Math.random() * 4)],
    'C': ['监理单位', '施工单位', '设计单位', '建设单位'][Math.floor(Math.random() * 4)],
    'D': ['设计单位', '监理单位', '建设单位', '施工单位'][Math.floor(Math.random() * 4)],
  }

  return {
    id,
    contentId: id,
    type: 0,
    typeName: '单选题',
    content: `【单选题】第${id}题：根据《建设工程质量管理条例》，建设工程发生质量事故，有关单位应当在多长时间内向当地建设行政主管部门和其他有关部门报告？`,
    options,
    parentQuestion: '',
    answer: 'C',
    point: '建设工程质量管理条例相关知识',
    analysis: '根据《建设工程质量管理条例》规定，建设工程发生质量事故，有关单位应当在24小时内向当地建设行政主管部门和其他有关部门报告。',
    parentSonType: 0,
    parentSonOrder: 0,
    questionList: [],
    isRepeat: 0,
  }
}

/* 生成多选题 */
const generateMultipleChoice = (id: number, _chapterId: number): QuestionVO => {
  return {
    id,
    contentId: id,
    type: 1,
    typeName: '多选题',
    content: `【多选题】第${id}题：根据《建筑法》的规定，申请领取施工许可证，应当具备的条件包括哪些？`,
    options: {
      'A': '已经办理该建筑工程用地批准手续',
      'B': '在城市规划区的建筑工程，已经取得规划许可证',
      'C': '需要拆迁的，其拆迁进度符合施工要求',
      'D': '已经确定建筑施工企业',
      'E': '有满足施工需要的施工图纸及技术资料',
    },
    parentQuestion: '',
    answer: 'ABCDE',
    point: '建筑法施工许可条件',
    analysis: '根据《建筑法》第八条的规定，申请领取施工许可证应当具备以下条件：1.已经办理该建筑工程用地批准手续；2.在城市规划区的建筑工程，已经取得规划许可证；3.需要拆迁的，其拆迁进度符合施工要求；4.已经确定建筑施工企业；5.有满足施工需要的施工图纸及技术资料；6.有保证工程质量和安全的具体措施；7.建设资金已经落实。',
    parentSonType: 0,
    parentSonOrder: 0,
    questionList: [],
    isRepeat: 0,
  }
}

/* 生成判断题 */
const generateTrueFalse = (id: number, _chapterId: number): QuestionVO => {
  const isTrue = Math.random() > 0.5
  return {
    id,
    contentId: id,
    type: 3,
    typeName: '判断题',
    content: `【判断题】第${id}题：${isTrue ? '建设工程招标分为公开招标和邀请招标两种方式。' : '建设工程招标分为公开招标、邀请招标和议标三种方式。'}`,
    options: {
      'A': '正确',
      'B': '错误',
    },
    parentQuestion: '',
    answer: isTrue ? 'A' : 'B',
    point: '建设工程招标方式',
    analysis: `根据《招标投标法》第十条规定，招标分为公开招标和邀请招标。${isTrue ? '因此本题说法正确。' : '招标方式只有两种，不包括议标，因此本题说法错误。'}`,
    parentSonType: 0,
    parentSonOrder: 0,
    questionList: [],
    isRepeat: 0,
  }
}

/* 生成题目 */
const generateQuestions = (count: number, chapterId: number, startId: number = 1): QuestionVO[] => {
  const questions: QuestionVO[] = []
  for (let i = 0; i < count; i++) {
    const id = startId + i
    const type = i % 5
    if (type === 0 || type === 1 || type === 2) {
      questions.push(generateSingleChoice(id, chapterId))
    } else if (type === 3) {
      questions.push(generateMultipleChoice(id, chapterId))
    } else {
      questions.push(generateTrueFalse(id, chapterId))
    }
  }
  return questions
}

/* Mock 题目数据存储 */
const questionsMap: Map<number, QuestionVO[]> = new Map()

/* 获取章节题目 */
export const getChapterQuestions = (chapterId: number, count: number = 10): QuestionVO[] => {
  if (!questionsMap.has(chapterId)) {
    questionsMap.set(chapterId, generateQuestions(count, chapterId, chapterId * 1000))
  }
  return questionsMap.get(chapterId) || []
}

/* 获取小节题目 */
export const getSectionQuestions = (sectionId: number, count: number = 5): QuestionVO[] => {
  if (!questionsMap.has(sectionId)) {
    questionsMap.set(sectionId, generateQuestions(count, sectionId, sectionId * 100))
  }
  return questionsMap.get(sectionId) || []
}

/* 获取每日练习题目（随机抽取） */
export const getDailyQuestions = (count: number = 10): QuestionVO[] => {
  const allQuestions: QuestionVO[] = []
  mockChapters.forEach((chapter, index) => {
    const questions = generateQuestions(Math.ceil(count / mockChapters.length), chapter.id, (index + 1) * 1000)
    allQuestions.push(...questions)
  })

  /* 随机打乱 */
  return allQuestions.sort(() => Math.random() - 0.5).slice(0, count)
}

/* 提交答案（Mock） */
export const submitAnswers = (answers: Record<number, string>): {
  correctCount: number
  wrongCount: number
  correctIds: number[]
  wrongIds: number[]
} => {
  let correctCount = 0
  let wrongCount = 0
  const correctIds: number[] = []
  const wrongIds: number[] = []

  /* 模拟答题结果（70%正确率） */
  Object.entries(answers).forEach(([questionId, _answer]) => {
    const isCorrect = Math.random() > 0.3
    if (isCorrect) {
      correctCount++
      correctIds.push(Number(questionId))
    } else {
      wrongCount++
      wrongIds.push(Number(questionId))
    }
  })

  return {
    correctCount,
    wrongCount,
    correctIds,
    wrongIds,
  }
}

/* 保存练习记录（Mock） */
export const savePracticeRecord = (data: {
  chapterId?: number
  sectionId?: number
  questionCount: number
  correctCount: number
  spendTime: number
}): boolean => {
  console.log('保存练习记录:', data)
  return true
}

/* 获取章节列表（Mock） */
export const getMockChapterList = (): ChapterVO[] => {
  return mockChapters
}

/* 获取章节详情（Mock） */
export const getMockChapterDetail = (chapterId: number): ChapterVO | null => {
  return mockChapters.find(c => c.id === chapterId) || null
}

/* 获取小节详情（Mock） */
export const getMockSectionDetail = (sectionId: number): SectionVO | null => {
  for (const chapter of mockChapters) {
    const section = chapter.sectionList?.find(s => s.id === sectionId)
    if (section) return section
  }
  return null
}
