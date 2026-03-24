import type { QuestionVO } from '~/types/qBank'
import { httpGet, httpPost, httpDelete } from '~/composables/useHttp'

/**
 * 题目收藏查询参数
 */
export interface QuestionFavoriteQueryVO {
  page?: number
  pageSize?: number
  qbankId?: number
}

/**
 * 题目收藏视图对象
 */
export interface QuestionFavoriteVO {
  id: number
  questionId: number
  question: QuestionVO
  qbankId: number
  qbankName: string
  createTime: string
}

/**
 * 题目收藏分页响应
 */
export interface QuestionFavoritePageVO {
  list: QuestionFavoriteVO[]
  total: number
}

/**
 * 添加题目收藏
 * @param questionId 题目ID
 * @param qbankId 题库ID
 */
export const addQuestionFavorite = (questionId: number, qbankId: number) => {
  return httpPost<number>('AddQuestionFavorite', '/member/question/favorite', {
    questionId,
    qbankId,
  })
}

/**
 * 取消题目收藏
 * @param questionId 题目ID
 */
export const removeQuestionFavorite = (questionId: number) => {
  return httpDelete('RemoveQuestionFavorite', `/member/question/favorite/${questionId}`)
}

/**
 * 获取题目收藏状态
 * @param questionId 题目ID
 */
export const getQuestionFavoriteStatus = (questionId: number) => {
  return httpGet<boolean>('QuestionFavoriteStatus', `/member/question/favorite/status`, {
    query: { questionId }
  })
}

/**
 * 获取用户题目收藏分页
 * @param query 查询参数
 */
export const getQuestionFavorites = (query: QuestionFavoriteQueryVO) => {
  return httpGet<QuestionFavoritePageVO>('QuestionFavorites', '/member/question/favorites', { query })
}

/**
 * 获取用户收藏的题目ID列表
 */
export const getFavoriteQuestionIds = () => {
  return httpGet<number[]>('FavoriteQuestionIds', '/member/question/favorites/ids')
}
