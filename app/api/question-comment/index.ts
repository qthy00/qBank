import type {
  QuestionCommentPageResult,
  CommentReplyPageResult,
  SubmitCommentReqVO,
  SubmitCommentResult,
  SubmitReplyReqVO,
  SubmitReplyResult,
  LikeCommentReqVO,
  LikeResult,
  DeleteCommentResult,
  GetCommentListReqVO,
  GetReplyListReqVO,
} from '~/types/question-comment'
import { httpGet, httpPost, httpDelete } from '~/composables/useHttp'
import {
  getMockQuestionCommentPage,
  submitMockQuestionComment,
  getMockCommentReplyList,
  submitMockCommentReply,
  deleteMockMyComment,
  mockLikeComment,
} from './mock'

/**
 * 题目评论API模块
 * @description 题目评论、回复、点赞相关接口
 */

/* 是否使用模拟数据 - 通过环境变量控制 */
const USE_MOCK = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 获取题目评论列表（分页）
 * @param params 查询参数
 * @returns 评论分页结果
 */
export const getQuestionCommentPage = (params: GetCommentListReqVO) => {
  if (USE_MOCK) {
    return Promise.resolve({
      code: 0,
      msg: 'success',
      data: getMockQuestionCommentPage(params),
    })
  }
  return httpGet<QuestionCommentPageResult>('QuestionCommentPage', '/cms/question-comment/page', {
    query: params,
  })
}

/**
 * 提交题目评论
 * @param data 评论数据
 * @returns 提交结果
 */
export const submitQuestionComment = (data: SubmitCommentReqVO) => {
  if (USE_MOCK) {
    return Promise.resolve({
      code: 0,
      msg: 'success',
      data: submitMockQuestionComment(data),
    })
  }
  return httpPost<SubmitCommentResult>('SubmitQuestionComment', '/cms/question-comment/submit', data)
}

/**
 * 获取评论回复列表（分页）
 * @param commentId 评论ID
 * @param params 分页参数
 * @returns 回复分页结果
 */
export const getCommentReplyList = (commentId: number, params?: GetReplyListReqVO) => {
  if (USE_MOCK) {
    return Promise.resolve({
      code: 0,
      msg: 'success',
      data: getMockCommentReplyList(commentId, params),
    })
  }
  return httpGet<CommentReplyPageResult>('CommentReplyList', `/cms/question-comment/reply/${commentId}`, {
    query: params,
  })
}

/**
 * 提交评论回复
 * @param data 回复数据
 * @returns 提交结果
 */
export const submitCommentReply = (data: SubmitReplyReqVO) => {
  if (USE_MOCK) {
    return Promise.resolve({
      code: 0,
      msg: 'success',
      data: submitMockCommentReply(data),
    })
  }
  return httpPost<SubmitReplyResult>('SubmitCommentReply', '/cms/question-comment/reply/submit', data)
}

/**
 * 删除我的评论
 * @param commentId 评论ID
 * @returns 删除结果
 */
export const deleteMyComment = (commentId: number) => {
  if (USE_MOCK) {
    return Promise.resolve({
      code: 0,
      msg: 'success',
      data: deleteMockMyComment(commentId),
    })
  }
  return httpDelete<DeleteCommentResult>('DeleteMyComment', `/cms/question-comment/${commentId}`)
}

/**
 * 点赞/取消点赞评论
 * @param data 点赞操作数据
 * @returns 点赞结果
 */
export const likeComment = (data: LikeCommentReqVO) => {
  if (USE_MOCK) {
    return Promise.resolve({
      code: 0,
      msg: 'success',
      data: mockLikeComment(data),
    })
  }
  return httpPost<LikeResult>('LikeComment', '/cms/question-comment/like', data)
}
