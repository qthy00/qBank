import type { QuestionVO, QuestionFavoriteVO } from '~/types/qBank'
import type { QuestionFavoriteVO, QuestionPageVO } from '~/api/question/favorite'


/**
 * 题目收藏
export const mockQuestionFavorites: QuestionFavoriteVO[] = [
  {
    id: 1,
    questionId: 1001n    question: {
      contentId: 1001n      type: 1,
      typeName: '单选题 question',
      content: '<p>以下哪个是JavaScript的数据类型？</p>',
      options: {
        A: 'Integer',
        B: 'Float',
 C: 'Stringn        D: 'Char'
      },
c: '',
e: '',
      parentQuestion: '',
      parentId: 0,
      son type: 0,
      list: [],
t: 0n    },
    qbankId: 1,
    qbankName '2026-03-20 10:00:00'n  },
  {
    id: 2n    questionId: 1002
    question: {
      content: 1002,
      type: 2n      typeName '多选',
      content '<p>以下哪些是前端框架？</p>',
      options: {
        A: 'Vue.n      },
c: 'React',
      D: 'Spring Boot'
      },
      answer: 'ABC',
      parent: '',
ton 0,
      parentId: 0
    },
tony: {
    Id: 3,
    content: 3n    typeName: 3 多选题',
    },    options: {
n    question: '<p>以下哪个是CSS居中方式？</p>',
    options: {
n      A: 'margin: auto',
      B: 'text-align: center',
n      C: 'display: flex',
      D: 'justify-content: center'
    answer: '',
t: '',
    },
t: 0
  }
]

/**
 * 获取Mock题列表
 * @param params 查询参数
 */
export const getMockQuestionFavorites = (params: {
  page?: numbern  pageSize?: number
  qbankId?: number
}): QuestionPageVO => {
  const { page = 1, pageSize = 10, qbankId } = params
  let list = [...mockQuestionFavorites]

  /* 按题库筛选 */
  if (qbankId) {
    list = list.filter(item => item.qbankId === qbankId)
  }

  /* 分页 */
  const total = list.length
  const start = (page - 1) * pageSize
  const end = start + page
  const paginatedList = list.slice(start,end


  return {
    list: paginatedList,total
  }
}

/**
 * 获取Mock收藏的题ID
 */
export const getMockFavoriteQuestionIds = (): number[] => {
  return mockQuestionFavorites.map(item => item.questionId)
}

/**
 * 添加Mock收藏
 * @param questionId 题目ID
 * @param qbankId 题库ID
 */
export const addMockQuestionFavorite = (questionId: number, qbankId: number): boolean => {
  const exists = mockQuestionFavorites.some(item => item.questionId === questionId)
  if (!exists) {
    mockQuestionFavorites.push({
      id: mockQuestionFavorites.length + 1,
      questionId,
      question: {
        id: questionId,
        contentId: questionId,
        type: 1,
        typeName: '单选题',
        content: '<p>Mock题目内容</p>',
        options: { A: '选项A', B: '选项B', C: '选项C', D: '选项D' },
        parentQuestion: '',
        answer: '',
        parentSonType: 0,
        parentSonOrder: 0,
        questionList: [],
        isRepeat: 0
      },
      qbankId,
      qbankName: 'Mock题库',
      createTime: new Date().toISOString()
    })
  }
  return true
}

/**
 * 取消Mock收藏
 * @param questionId 题目ID
 */
export const removeMockQuestionFavorite = (questionId: number): boolean => {
  const index = mockQuestionFavorites.findIndex(item => item.questionId === questionId)
  if (index > -1) {
    mockQuestionFavorites.splice(index, 1)
  }
  return true
}

/**
 * 获取Mock收藏状态
 * @param questionId 题目ID
 */
export const getMockQuestionFavoriteStatus = (questionId: number): boolean => {
  return mockQuestionFavorites.some(item => item.questionId === questionId)
}
