import type {
  RankingListRespVO,
  RankingStatsVO,
  UserRankingDetailVO,
  RankingType,
  TimeDimension
} from '~/types/ranking'
import { httpGet } from '~/composables/useHttp'

/**
 * 排行榜模块 API
 */

/**
 * 获取排行榜列表
 * @param type 榜单类型
 * @param dimension 时间维度
 * @param limit 榜单数量（默认10）
 * @returns 排行榜列表
 */
export const getRankingList = async (
  type: RankingType,
  dimension: TimeDimension,
  limit: number = 10
): Promise<RankingListRespVO> => {
  return await httpGet('RankingList', '/member/ranking/list', {
    query: { type, dimension, limit }
  })
}

/**
 * 获取排行榜统计信息
 * @returns 排行榜统计
 */
export const getRankingStats = async (): Promise<RankingStatsVO> => {
  return await httpGet('RankingStats', '/member/ranking/stats')
}

/**
 * 获取用户排名详情
 * @param userId 用户ID
 * @returns 用户排名详情
 */
export const getUserRankingDetail = async (
  userId: number
): Promise<UserRankingDetailVO> => {
  return await httpGet('UserRankingDetail', `/member/ranking/user/${userId}`)
}

/**
 * 获取当前用户排名
 * @returns 当前用户排名详情
 */
export const getCurrentUserRanking = async (): Promise<UserRankingDetailVO> => {
  return await httpGet('CurrentUserRanking', '/member/ranking/user/current')
}
