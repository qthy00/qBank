/**
 * 题目评论模块类型定义
 * @description 题目评论、回复、点赞相关类型
 */

/** 题目评论项 */
export interface QuestionCommentItem {
  /** 评论ID */
  id: number
  /** 用户ID */
  uid: number
  /** 用户昵称 */
  nickname: string
  /** 用户头像URL */
  avatar: string
  /** 题目ID */
  questionId: number
  /** 评论内容 */
  content: string
  /** 图片URL列表 */
  media: string[]
  /** IP地址 */
  ip: string
  /** IP属地（如：北京） */
  area: string
  /** 点赞数 */
  likeCount: number
  /** 点踩数 */
  dislikeCount: number
  /** 回复数 */
  replyCount: number
  /** 当前用户是否点赞 */
  likedByCurrentUser: boolean
  /** 当前用户是否点踩 */
  dislikedByCurrentUser: boolean
  /** 创建时间（ISO 8601格式） */
  createTime: string
  /** 热门回复列表（最多3条） */
  replyList: CommentReplyItem[]
}

/** 评论回复项 */
export interface CommentReplyItem {
  /** 回复ID */
  id: number
  /** 所属评论ID */
  commentId: number
  /** 回复用户ID */
  uid: number
  /** 回复用户昵称 */
  nickname: string
  /** 回复用户头像 */
  avatar: string
  /** 被回复用户ID */
  toUid: number
  /** 被回复用户昵称 */
  toNickname: string
  /** 回复内容 */
  content: string
  /** IP属地 */
  area: string
  /** 点赞数 */
  likeCount: number
  /** 当前用户是否点赞 */
  likedByCurrentUser: boolean
  /** 创建时间 */
  createTime: string
}

/** 分页结果 */
export interface PageResult<T> {
  /** 数据列表 */
  list: T[]
  /** 总条数 */
  total: number
}

/** 题目评论分页结果 */
export interface QuestionCommentPageResult {
  /** 评论列表 */
  list: QuestionCommentItem[]
  /** 总条数 */
  total: number
}

/** 评论回复分页结果 */
export interface CommentReplyPageResult {
  /** 回复列表 */
  list: CommentReplyItem[]
  /** 总条数 */
  total: number
}

/** 提交评论请求参数 */
export interface SubmitCommentReqVO {
  /** 题目ID */
  questionId: number
  /** 评论内容（1-500字） */
  content: string
  /** 图片URL列表（最多3张） */
  media?: string[]
}

/** 提交评论响应结果 */
export interface SubmitCommentResult {
  /** 是否成功 */
  success: boolean
  /** 评论ID（成功时返回） */
  commentId?: number
}

/** 提交回复请求参数 */
export interface SubmitReplyReqVO {
  /** 主评论ID */
  commentId: number
  /** 被回复用户ID */
  toUid: number
  /** 回复内容（1-200字） */
  content: string
}

/** 提交回复响应结果 */
export interface SubmitReplyResult {
  /** 是否成功 */
  success: boolean
  /** 回复ID（成功时返回） */
  replyId?: number
}

/** 点赞操作请求参数 */
export interface LikeCommentReqVO {
  /** 评论ID */
  commentId: number
  /** 操作类型：1=点赞 2=取消点赞 3=点踩 4=取消点踩 */
  type: 1 | 2 | 3 | 4
}

/** 点赞操作响应结果 */
export interface LikeResult {
  /** 是否成功 */
  success: boolean
  /** 当前点赞数 */
  likeCount: number
  /** 当前点踩数 */
  dislikeCount: number
}

/** 删除评论响应结果 */
export interface DeleteCommentResult {
  /** 是否成功 */
  success: boolean
}

/** 获取评论列表请求参数 */
export interface GetCommentListReqVO {
  /** 题目ID */
  questionId: number
  /** 页码，默认1 */
  pageNum?: number
  /** 每页条数，默认10，最大50 */
  pageSize?: number
}

/** 获取回复列表请求参数 */
export interface GetReplyListReqVO {
  /** 页码，默认1 */
  pageNum?: number
  /** 每页条数，默认20，最大50 */
  pageSize?: number
}
