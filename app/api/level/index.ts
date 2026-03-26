import type {
  MemberLevelVO,
  ExperienceRecordVO,
  ExperienceRecordPageRespVO,
  ExperienceRecordPageReqVO
} from '~/types/level'
import { httpGet } from '~/composables/useHttp'
import {
  mockLevelList,
  mockExperienceRecords,
  getMockLevelList,
  getMockExperienceRecordPage
} from './mock'

/* 是否启用Mock数据 */
const ENABLE_MOCK = true

/**
 * 获取会员等级列表
 * @returns 所有启用的会员等级列表
 */
export const getLevelList = async (): Promise<MemberLevelVO[]> => {
  if (ENABLE_MOCK) {
    return getMockLevelList()
  }
  return httpGet<MemberLevelVO[]>('LevelList', '/member/level/list')
}

/**
 * 获取会员经验记录
 * @param params 查询参数
 * @returns 经验记录分页数据
 */
export const getExperienceRecord = async (
  params: ExperienceRecordPageReqVO = {}
): Promise<ExperienceRecordPageRespVO> => {
  if (ENABLE_MOCK) {
    return getMockExperienceRecordPage(params)
  }
  return httpGet<ExperienceRecordPageRespVO>('ExperienceRecord', '/member/experience-record/page', {
    query: {
      pageNo: params.pageNo || 1,
      pageSize: params.pageSize || 10
    }
  })
}
