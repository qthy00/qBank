import type {
  AnnouncementListReqVO,
  AnnouncementListRespVO,
  AnnouncementVO,
  HomeAnnouncementVO
} from '~/types/announcement'
import { AnnouncementTypeEnum, AnnouncementStatusEnum } from '~/types/announcement'

/**
 * Mock 公告列表数据
 */
const mockAnnouncements: AnnouncementVO[] = [
  {
    id: 1,
    title: '系统升级维护通知',
    content: '尊敬的用户，您好！为了提供更好的服务，我们将于今晚22:00-次日02:00进行系统升级维护。维护期间部分功能可能无法使用，请提前安排好您的学习计划。给您带来的不便，敬请谅解。',
    type: AnnouncementTypeEnum.SYSTEM,
    status: AnnouncementStatusEnum.PUBLISHED,
    isTop: true,
    viewCount: 1256,
    publishTime: Date.now() - 86400000 * 2,
    createTime: Date.now() - 86400000 * 3,
    typeName: '系统公告',
    statusName: '已发布',
    summary: '尊敬的用户，您好！为了提供更好的服务，我们将于今晚22:00-次日02:00进行系统升级维护...'
  },
  {
    id: 2,
    title: '新功能上线：错题本功能正式发布',
    content: '好消息！备受期待的错题本功能现已正式上线。您可以在练习过程中自动记录错题，随时查看错题列表并进行针对性练习。功能特点：1. 自动记录错题 2. 错题分类管理 3. 错题重做模式 4. 掌握程度标记。快来体验吧！',
    type: AnnouncementTypeEnum.UPDATE,
    status: AnnouncementStatusEnum.PUBLISHED,
    isTop: true,
    viewCount: 2341,
    publishTime: Date.now() - 86400000 * 5,
    createTime: Date.now() - 86400000 * 6,
    typeName: '更新日志',
    statusName: '已发布',
    summary: '好消息！备受期待的错题本功能现已正式上线。您可以在练习过程中自动记录错题...'
  },
  {
    id: 3,
    title: '春季学习活动：打卡领积分',
    content: '春季学习季开启！即日起至3月31日，每日完成学习打卡即可获得积分奖励。连续打卡7天额外赠送100积分，连续打卡30天赠送500积分+VIP周卡。积分可用于兑换题库、参与抽奖等活动。快来参与吧！',
    type: AnnouncementTypeEnum.ACTIVITY,
    status: AnnouncementStatusEnum.PUBLISHED,
    isTop: false,
    viewCount: 3892,
    publishTime: Date.now() - 86400000 * 7,
    createTime: Date.now() - 86400000 * 8,
    typeName: '活动通知',
    statusName: '已发布',
    summary: '春季学习季开启！即日起至3月31日，每日完成学习打卡即可获得积分奖励...'
  },
  {
    id: 4,
    title: '关于调整部分题库价格的公告',
    content: '由于内容更新和版权成本增加，我们将对部分题库的价格进行调整。调整将于4月1日起生效。已购买的用户不受影响。具体调整内容请查看详情页。如有疑问，请联系客服。',
    type: AnnouncementTypeEnum.SYSTEM,
    status: AnnouncementStatusEnum.PUBLISHED,
    isTop: false,
    viewCount: 1567,
    publishTime: Date.now() - 86400000 * 10,
    createTime: Date.now() - 86400000 * 11,
    typeName: '系统公告',
    statusName: '已发布',
    summary: '由于内容更新和版权成本增加，我们将对部分题库的价格进行调整...'
  },
  {
    id: 5,
    title: 'APP新版本发布：v2.0.0',
    content: '学次元APP v2.0.0 正式发布！本次更新内容：1. 全新UI设计，体验更流畅 2. 新增模拟考试功能 3. 优化题库加载速度 4. 修复已知问题。请前往应用商店更新体验。',
    type: AnnouncementTypeEnum.UPDATE,
    status: AnnouncementStatusEnum.PUBLISHED,
    isTop: false,
    viewCount: 4521,
    publishTime: Date.now() - 86400000 * 15,
    createTime: Date.now() - 86400000 * 16,
    typeName: '更新日志',
    statusName: '已发布',
    summary: '学次元APP v2.0.0 正式发布！本次更新内容：1. 全新UI设计，体验更流畅...'
  }
]

/**
 * 获取Mock公告列表
 */
export const getMockAnnouncementList = (params: AnnouncementListReqVO): AnnouncementListRespVO => {
  let list = [...mockAnnouncements]

  /* 按类型筛选 */
  if (params.type) {
    list = list.filter(item => item.type === params.type)
  }

  /* 置顶公告排在前面 */
  list.sort((a, b) => {
    if (a.isTop !== b.isTop) {
      return b.isTop ? 1 : -1
    }
    return b.publishTime - a.publishTime
  })

  /* 分页 */
  const pageNo = params.pageNo || 1
  const pageSize = params.pageSize || 10
  const start = (pageNo - 1) * pageSize
  const end = start + pageSize

  return {
    list: list.slice(start, end),
    total: list.length
  }
}

/**
 * 获取Mock公告详情
 */
export const getMockAnnouncementDetail = (id: number): AnnouncementVO | null => {
  const announcement = mockAnnouncements.find(item => item.id === id)
  return announcement || null
}

/**
 * 获取Mock首页公告
 */
export const getMockHomeAnnouncements = (): HomeAnnouncementVO[] => {
  return mockAnnouncements
    .filter(item => item.isTop || item.publishTime > Date.now() - 86400000 * 7)
    .sort((a, b) => {
      if (a.isTop !== b.isTop) {
        return b.isTop ? 1 : -1
      }
      return b.publishTime - a.publishTime
    })
    .slice(0, 5)
    .map(item => ({
      id: item.id,
      title: item.title,
      type: item.type,
      isTop: item.isTop
    }))
}

/**
 * 增加浏览次数
 */
export const incrementMockViewCount = (id: number): void => {
  const announcement = mockAnnouncements.find(item => item.id === id)
  if (announcement) {
    announcement.viewCount++
  }
}
