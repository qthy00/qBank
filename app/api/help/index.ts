/**
 * 帮助中心 API 接口
 */
import type {
  FAQCategoryVO,
  FAQVO,
  FAQListReqVO,
  FAQListRespVO,
  GuideCategoryVO,
  GuideVO,
  GuideListReqVO,
  GuideListRespVO,
  HelpSearchReqVO,
  HelpSearchRespVO,
  FeedbackReqVO,
  FeedbackTypeVO,
  HelpHomeVO
} from '~/types/help'
import { httpGet, httpPost } from '~/composables/useHttp'

/* ==================== FAQ 相关接口 ==================== */

/**
 * 获取 FAQ 分类列表
 */
export const getFAQCategories = () => {
  return httpGet<FAQCategoryVO[]>('FAQCategories', '/member/help/faq/categories')
}

/**
 * 获取 FAQ 列表
 * @param params 查询参数
 */
export const getFAQList = (params: FAQListReqVO) => {
  return httpGet<FAQListRespVO>('FAQList', '/member/help/faq/list', { query: params })
}

/**
 * 获取 FAQ 详情
 * @param id FAQ ID
 */
export const getFAQDetail = (id: number) => {
  return httpGet<FAQVO>('FAQDetail', `/member/help/faq/get/${id}`)
}

/**
 * 获取热门 FAQ
 * @param limit 数量限制
 */
export const getHotFAQs = (limit: number = 10) => {
  return httpGet<FAQVO[]>('HotFAQs', '/member/help/faq/hot', { query: { limit } })
}

/* ==================== 使用指南相关接口 ==================== */

/**
 * 获取指南分类列表
 */
export const getGuideCategories = () => {
  return httpGet<GuideCategoryVO[]>('GuideCategories', '/member/help/guide/categories')
}

/**
 * 获取指南列表
 * @param params 查询参数
 */
export const getGuideList = (params: GuideListReqVO) => {
  return httpGet<GuideListRespVO>('GuideList', '/member/help/guide/list', { query: params })
}

/**
 * 获取指南详情
 * @param id 指南 ID
 */
export const getGuideDetail = (id: number) => {
  return httpGet<GuideVO>('GuideDetail', `/member/help/guide/get/${id}`)
}

/**
 * 获取热门指南
 * @param limit 数量限制
 */
export const getHotGuides = (limit: number = 5) => {
  return httpGet<GuideVO[]>('HotGuides', '/member/help/guide/hot', { query: { limit } })
}

/* ==================== 搜索相关接口 ==================== */

/**
 * 搜索帮助内容
 * @param params 搜索参数
 */
export const searchHelp = (params: HelpSearchReqVO) => {
  return httpGet<HelpSearchRespVO>('HelpSearch', '/member/help/search', { query: params })
}

/**
 * 获取搜索建议
 * @param keyword 关键词
 */
export const getSearchSuggestions = (keyword: string) => {
  return httpGet<string[]>('SearchSuggestions', '/member/help/search/suggestions', {
    query: { keyword }
  })
}

/* ==================== 反馈相关接口 ==================== */

/**
 * 获取反馈类型列表
 */
export const getFeedbackTypes = () => {
  return httpGet<FeedbackTypeVO[]>('FeedbackTypes', '/member/help/feedback/types')
}

/**
 * 提交问题反馈
 * @param data 反馈数据
 */
export const submitFeedback = (data: FeedbackReqVO) => {
  return httpPost('SubmitFeedback', '/member/help/feedback/create', data)
}

/* ==================== 首页相关接口 ==================== */

/**
 * 获取帮助中心首页数据
 */
export const getHelpHomeData = () => {
  return httpGet<HelpHomeVO>('HelpHomeData', '/member/help/home')
}
