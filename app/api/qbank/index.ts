import {httpGet, httpPost } from "~/composables/useHttp";

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

  getSubjectList: async (id: number) => {
    return await httpGet('getSubjectList', `/cms/subject/list?id=${id}`)
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

  getExamCalendarInfo: async (query, server: boolean = false) => {
    return await httpGet('getMistakeStats', `/cms/qBank/exam-info`, {query}, server)
  },
}
