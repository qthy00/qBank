import type {
  QuestionCommentItem,
  CommentReplyItem,
  QuestionCommentPageResult,
  CommentReplyPageResult,
  SubmitCommentResult,
  SubmitReplyResult,
  LikeResult,
  DeleteCommentResult,
} from '~/types/question-comment'

/**
 * 题目评论 Mock 数据
 * @description 题目评论、回复、点赞相关 Mock 数据
 */

/* ==================== Mock 用户数据 ==================== */

const mockUsers = [
  { id: 2001, nickname: '学习小王子', avatar: 'https://picsum.photos/100/100?random=1' },
  { id: 2002, nickname: '题库管理员', avatar: 'https://picsum.photos/100/100?random=2' },
  { id: 2003, nickname: '学霸小明', avatar: 'https://picsum.photos/100/100?random=3' },
  { id: 2004, nickname: '考试达人', avatar: 'https://picsum.photos/100/100?random=4' },
  { id: 2005, nickname: '学习小能手', avatar: 'https://picsum.photos/100/100?random=5' },
  { id: 2006, nickname: '考证路上', avatar: 'https://picsum.photos/100/100?random=6' },
  { id: 2007, nickname: '知识探索者', avatar: 'https://picsum.photos/100/100?random=7' },
  { id: 2008, nickname: '每日一练', avatar: 'https://picsum.photos/100/100?random=8' },
]

const areas = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '西安']

/* ==================== Mock 回复数据 ==================== */

const generateMockReplies = (commentId: number, count: number): CommentReplyItem[] => {
  const replies: CommentReplyItem[] = []
  const replyUsers = mockUsers.slice(1, 4)
  const mainUser = mockUsers[0]

  for (let i = 0; i < count; i++) {
    const replyUser = replyUsers[i % replyUsers.length]
    replies.push({
      id: 5000 + i,
      commentId,
      uid: replyUser.id,
      nickname: replyUser.nickname,
      avatar: replyUser.avatar,
      toUid: mainUser.id,
      toNickname: mainUser.nickname,
      content: [
        '我觉得解析已经挺清楚了，你再仔细看看',
        '答案已核实无误，请仔细审题',
        '感谢反馈，我们会持续改进',
        '这道题确实有点难，建议多看几遍',
        '可以参考教材第3章的内容',
        '这个问题我之前也遇到过，后来搞懂了',
      ][i % 6],
      area: areas[i % areas.length],
      likeCount: Math.floor(Math.random() * 20),
      likedByCurrentUser: false,
      createTime: new Date(Date.now() - i * 3600000).toISOString(),
    })
  }

  return replies
}

/* ==================== Mock 评论数据 ==================== */

const generateMockComments = (questionId: number, count: number): QuestionCommentItem[] => {
  const comments: QuestionCommentItem[] = []

  for (let i = 0; i < count; i++) {
    const user = mockUsers[i % mockUsers.length]
    const replyCount = Math.floor(Math.random() * 8)
    const hasMedia = Math.random() > 0.7

    comments.push({
      id: 1000 + i,
      uid: user.id,
      nickname: user.nickname,
      avatar: user.avatar,
      questionId,
      content: [
        '这道题答案是不是有问题？',
        '解析不够详细，建议补充',
        '终于搞懂了，感谢分享',
        '有人知道这道题考的是什么知识点吗？',
        '这道题我之前做错了，现在明白了',
        '建议增加类似的练习题',
        '这个选项为什么不对？',
        '收藏了，回头再看',
        '做题思路很清晰，学到了',
        '有没有更简单的解法？',
      ][i % 10],
      media: hasMedia
        ? [
            `https://picsum.photos/400/300?random=${10 + i}`,
            `https://picsum.photos/400/300?random=${20 + i}`,
          ].slice(0, Math.floor(Math.random() * 2) + 1)
        : [],
      ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      area: areas[i % areas.length],
      likeCount: Math.floor(Math.random() * 100),
      dislikeCount: Math.floor(Math.random() * 5),
      replyCount,
      likedByCurrentUser: i === 0,
      dislikedByCurrentUser: false,
      createTime: new Date(Date.now() - i * 86400000).toISOString(),
      replyList: replyCount > 0 ? generateMockReplies(1000 + i, Math.min(replyCount, 3)) : [],
    })
  }

  return comments
}

/* ==================== Mock 数据存储 ==================== */

let mockCommentList: QuestionCommentItem[] = []
let mockReplyList: CommentReplyItem[] = []
let commentIdCounter = 1100
let replyIdCounter = 5100

/* ==================== 查询函数 ==================== */

/**
 * 获取题目评论列表（Mock）
 * @param params 查询参数
 */
export const getMockQuestionCommentPage = (params: {
  questionId: number
  pageNum?: number
  pageSize?: number
}): QuestionCommentPageResult => {
  const { questionId, pageNum = 1, pageSize = 10 } = params

  /* 初始化数据 */
  if (mockCommentList.length === 0 || mockCommentList[0]?.questionId !== questionId) {
    mockCommentList = generateMockComments(questionId, 45)
  }

  /* 分页 */
  const total = mockCommentList.length
  const start = (pageNum - 1) * pageSize
  const end = start + pageSize
  const list = mockCommentList.slice(start, end)

  return {
    list,
    total,
  }
}

/**
 * 提交题目评论（Mock）
 * @param data 评论数据
 */
export const submitMockQuestionComment = (data: {
  questionId: number
  content: string
  media?: string[]
}): SubmitCommentResult => {
  const newComment: QuestionCommentItem = {
    id: commentIdCounter++,
    uid: 2001,
    nickname: '我',
    avatar: 'https://picsum.photos/100/100?random=99',
    questionId: data.questionId,
    content: data.content,
    media: data.media || [],
    ip: '192.168.1.1',
    area: '本地',
    likeCount: 0,
    dislikeCount: 0,
    replyCount: 0,
    likedByCurrentUser: false,
    dislikedByCurrentUser: false,
    createTime: new Date().toISOString(),
    replyList: [],
  }

  mockCommentList.unshift(newComment)

  return {
    success: true,
    commentId: newComment.id,
  }
}

/**
 * 获取评论回复列表（Mock）
 * @param commentId 评论ID
 * @param params 分页参数
 */
export const getMockCommentReplyList = (
  commentId: number,
  params?: { pageNum?: number; pageSize?: number }
): CommentReplyPageResult => {
  const { pageNum = 1, pageSize = 20 } = params || {}

  /* 初始化回复数据 */
  if (mockReplyList.length === 0) {
    mockReplyList = generateMockReplies(commentId, 15)
    mockReplyList.forEach((reply) => {
      reply.commentId = commentId
    })
  }

  /* 筛选该评论的回复 */
  const filteredReplies = mockReplyList.filter((reply) => reply.commentId === commentId)

  /* 分页 */
  const total = filteredReplies.length
  const start = (pageNum - 1) * pageSize
  const end = start + pageSize
  const list = filteredReplies.slice(start, end)

  return {
    list,
    total,
  }
}

/**
 * 提交评论回复（Mock）
 * @param data 回复数据
 */
export const submitMockCommentReply = (data: {
  commentId: number
  toUid: number
  content: string
}): SubmitReplyResult => {
  const toUser = mockUsers.find((u) => u.id === data.toUid) || mockUsers[0]

  const newReply: CommentReplyItem = {
    id: replyIdCounter++,
    commentId: data.commentId,
    uid: 2001,
    nickname: '我',
    avatar: 'https://picsum.photos/100/100?random=99',
    toUid: data.toUid,
    toNickname: toUser.nickname,
    content: data.content,
    area: '本地',
    likeCount: 0,
    likedByCurrentUser: false,
    createTime: new Date().toISOString(),
  }

  mockReplyList.push(newReply)

  /* 更新评论的回复数 */
  const comment = mockCommentList.find((c) => c.id === data.commentId)
  if (comment) {
    comment.replyCount += 1
  }

  return {
    success: true,
    replyId: newReply.id,
  }
}

/**
 * 删除我的评论（Mock）
 * @param commentId 评论ID
 */
export const deleteMockMyComment = (commentId: number): DeleteCommentResult => {
  const index = mockCommentList.findIndex((c) => c.id === commentId)
  if (index > -1) {
    mockCommentList.splice(index, 1)
  }

  return {
    success: true,
  }
}

/**
 * 点赞/取消点赞评论（Mock）
 * @param data 点赞数据
 */
export const mockLikeComment = (data: {
  commentId: number
  type: 1 | 2 | 3 | 4
}): LikeResult => {
  const comment = mockCommentList.find((c) => c.id === data.commentId)

  if (!comment) {
    return {
      success: false,
      likeCount: 0,
      dislikeCount: 0,
    }
  }

  let likeCount = comment.likeCount
  let dislikeCount = comment.dislikeCount

  switch (data.type) {
    case 1: /* 点赞 */
      if (!comment.likedByCurrentUser) {
        likeCount += 1
        comment.likedByCurrentUser = true
      }
      break
    case 2: /* 取消点赞 */
      if (comment.likedByCurrentUser) {
        likeCount -= 1
        comment.likedByCurrentUser = false
      }
      break
    case 3: /* 点踩 */
      if (!comment.dislikedByCurrentUser) {
        dislikeCount += 1
        comment.dislikedByCurrentUser = true
      }
      break
    case 4: /* 取消点踩 */
      if (comment.dislikedByCurrentUser) {
        dislikeCount -= 1
        comment.dislikedByCurrentUser = false
      }
      break
  }

  comment.likeCount = likeCount
  comment.dislikeCount = dislikeCount

  return {
    success: true,
    likeCount,
    dislikeCount,
  }
}
