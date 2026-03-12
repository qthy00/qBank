import {httpGet, httpPost } from "~/composables/useHttp";
import type {examsInfoVO, examsItemVO} from "~/types/qBank/examInfo";
import type {QbankListReqVO, QbankListRespVO, QbankDetailVO, QbankAccessVO} from "~/types/qBank/index";
import {
  mockCategories,
  getMockQbankList,
  getMockQbankDetail,
  getMockQbankAccess,
} from './mock'

/* 是否使用模拟数据 */
const USE_MOCK = true

export const typeNames: Record<number, string> = {
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

export interface SubjectVO {
  id: number
  name: string
  aliasName: string
}

export interface ChapterVO {
  id: number
  name: string
  sectionList?: SectionVO[]
  total: number
  completedCount: number
  accuracyRate: number
}

export interface Chapter extends ChapterVO {
  isCompleted: boolean
  completionRate: number
  sectionCount: number
}

export interface SectionVO {
  id: number
  name: string
  total: number
  chapterId: number
  chapterName: string
}

export interface QuestionReqVO {
  status?: number
  pageSize: number
  type: number
  random: boolean
  categoryId?: number
  subjectId?: number
  chapterId?: number
  sectionId?: number
  mastery?: boolean
}



export const questionApi = {

  getSubjectList: async (id: number, server: boolean = false) => {
    return await httpGet('getSubjectList', `/cms/subject/list`, {query: {id}}, server)
  },

  getChapterList: async (subjectId: number) => {
    return await httpGet('getChapterList', `/cms/chapter/list?subjectId=${subjectId}`)
  },

  getQuestionList: async (data: QuestionReqVO) => {
    return await httpPost('getQuestionList', '/cms/question/list', data )
  },

  getWrongQuestionList: async (data: any) => {
    return await httpPost('getWrongQuestionList', '/cms/question/wrong-list', data )
  },

  getQuestion: async (id: number) => {
    return await httpGet('getQuestion', `/cms/question/get?id=${id}`)
  },

  submitCurrentQuestion: async (data: any) => {
    return await httpPost('submitCurrentQuestion', '/member/qBank/record', data )
  },

  submitBatchStats: async (data: any) => {
    return await httpPost('submitBatchStats', '/member/qBank/batch-stats', data )
  },

  getSubjectPaperInfo: async (subjectId: number) => {
    return await httpGet('getSubjectPaperInfo', `/cms/subject/paper-info?id=${subjectId}`)
  },

  getExamInfo: async (categoryId: number) => {
    return await httpGet('getExamInfo', `/cms/subject/exam-info?id=${categoryId}`)
  },

  getQuestionType: async (subjectId: number) => {
    return await httpGet('getQuestionType', `/cms/subject/question-type?id=${subjectId}`)
  },


  generatePaper: async (data: any) => {
    return await httpPost('generatePaper', '/cms/paper/generate', data )
  },

  submitPaper: async (data: any) => {
    return await httpPost('submitPaper', '/member/paper/submit', data )
  },

  getPaperReport: async (data: any) => {
    return await httpPost('getPaperReport', '/member/paper/report', data )
  },

  getPaperReportDetail: async (data: any) => {
    return await httpPost('getPaperReportDetail', '/member/paper/report-detail', data )
  },

  getMistakeStats: async (categoryId: number) => {
    return await httpGet('getMistakeStats', `/member/mistakes/stats?categoryId=${categoryId}`)
  },

  getExamInfoList: async (query:any, server: boolean = false) => {
    return await httpGet('getExamInfoList', `/cms/qBank/exam-info`, {query}, server)
  },

  getSimpleQuestions: async (query:any, server: boolean = false) => {
    return await httpGet('getSimpleQuestions', `/cms/qBank/simple-questions`, {query}, server)
  },

  /* 获取首页考试详情数据 */
  getHomeExamDetail: async (catalogId?: number, server: boolean = false): Promise<examsItemVO[]> => {
    return await httpGet('getHomeExamDetail', `/cms/qBank/exam-detail`, {query: {catalogId}}, server)
  },

  /* ==================== 题库列表相关接口（支持模拟数据） ==================== */

  /**
   * 获取分类列表
   */
  getCategories: async () => {
    if (USE_MOCK) {
      return mockCategories
    }
    return await httpGet('getCategories', '/cms/category/list')
  },

  /**
   * 获取题库列表
   * @param params 查询参数
   * @param server 是否在服务端执行
   */
  getQbankList: async (params: QbankListReqVO, server: boolean = false): Promise<QbankListRespVO> => {
    if (USE_MOCK) {
      return getMockQbankList(
        params.keyword,
        params.categoryId,
        params.difficulty,
        params.sort,
        params.page,
        params.limit
      )
    }
    return await httpGet('getQbankList', '/member/qbank/list', {query: params}, server)
  },

  /**
   * 获取题库详情
   * @param id 题库ID
   * @param server 是否在服务端执行
   */
  getQbankDetail: async (id: number, server: boolean = false): Promise<QbankDetailVO> => {
    if (USE_MOCK) {
      const detail = getMockQbankDetail(id)
      if (!detail) {
        throw new Error('题库不存在')
      }
      return detail
    }
    return await httpGet('getQbankDetail', '/member/qbank/get', {query: {id}}, server)
  },

  /**
   * 检查用户题库权限
   * @param qbankId 题库ID
   */
  checkQbankAccess: async (qbankId: number): Promise<QbankAccessVO> => {
    if (USE_MOCK) {
      return getMockQbankAccess(qbankId)
    }
    return await httpGet('checkQbankAccess', '/member/qbank/access', {query: {qbankId}})
  },
}
