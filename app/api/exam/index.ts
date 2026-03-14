import type {
  MockPaperReqVO,
  MockPaperRespVO,
  SubmitPaperReqVO,
  SubmitPaperRespVO,
  ExamReportVO,
  ExamHistoryVO,
  ExamHistoryReqVO,
  SubjectVO,
  SubjectPaperInfoVO,
} from '~/types/exam/index'
import { httpGet, httpPost } from '~/composables/useHttp'

/**
 * 模拟考试相关API
 */

/**
 * 生成模拟试卷
 * @param data 试卷配置
 */
export const generateMockPaper = (data: MockPaperReqVO): Promise<MockPaperRespVO> => {
  return httpPost('GenerateMockPaper', '/member/exam/paper/generate', data)
}

/**
 * 提交试卷
 * @param data 提交数据
 */
export const submitMockPaper = (data: SubmitPaperReqVO): Promise<SubmitPaperRespVO> => {
  return httpPost('SubmitMockPaper', '/member/exam/paper/submit', data)
}

/**
 * 获取考试报告
 * @param paperId 试卷ID
 * @param userPaperId 用户试卷记录ID
 */
export const getExamReport = (paperId: number, userPaperId: number): Promise<ExamReportVO> => {
  return httpGet('ExamReport', `/member/exam/paper/report`, {
    query: { paperId, userPaperId }
  })
}

/**
 * 获取考试历史列表
 * @param params 查询参数
 */
export const getExamHistoryList = (params: ExamHistoryReqVO = {}): Promise<{
  list: ExamHistoryVO[]
  total: number
}> => {
  return httpGet('ExamHistoryList', '/member/exam/paper/history', { query: params })
}

/**
 * 获取科目列表
 * @param categoryId 分类ID
 */
export const getSubjectList = (categoryId: number): Promise<SubjectVO[]> => {
  return httpGet('SubjectList', `/member/exam/subject/list`, {
    query: { categoryId }
  })
}

/**
 * 获取科目试卷信息
 * @param subjectId 科目ID
 */
export const getSubjectPaperInfo = (subjectId: number): Promise<SubjectPaperInfoVO> => {
  return httpGet('SubjectPaperInfo', `/member/exam/subject/paper-info`, {
    query: { subjectId }
  })
}

/**
 * 继续未完成的考试
 * @param paperId 试卷ID
 */
export const getUnfinishedPaper = (paperId: number): Promise<MockPaperRespVO> => {
  return httpGet('UnfinishedPaper', `/member/exam/paper/unfinished`, {
    query: { paperId }
  })
}

/**
 * 保存考试进度
 * @param paperId 试卷ID
 * @param answers 当前答案
 */
export const saveExamProgress = (paperId: number, answers: any[]): Promise<void> => {
  return httpPost('SaveExamProgress', '/member/exam/paper/save-progress', {
    paperId,
    answers,
  })
}

/**
 * 获取推荐试卷列表
 * @param qbankId 题库ID
 * @param limit 数量限制
 */
export const getRecommendedPapers = (qbankId: number, limit: number = 5): Promise<{
  id: number
  title: string
  duration: number
  questionCount: number
  examCount: number
  rating: number
}[]> => {
  return httpGet('RecommendedPapers', `/member/exam/paper/recommended`, {
    query: { qbankId, limit }
  })
}
