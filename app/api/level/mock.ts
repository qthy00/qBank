import type {
  MemberLevelVO,
  ExperienceRecordVO,
  ExperienceRecordPageRespVO,
  ExperienceRecordPageReqVO
} from '~/types/level'

/**
 * 会员等级 Mock 数据
 */

/* ==================== 等级列表数据 ==================== */

/**
 * Mock 会员等级列表
 */
export const mockLevelList: MemberLevelVO[] = [
  {
    name: '普通会员',
    level: 1,
    experience: 0,
    discountPercent: 100,
    icon: 'https://picsum.photos/100/100?random=level1',
    backgroundUrl: 'https://picsum.photos/400/200?random=bg1'
  },
  {
    name: '铜牌会员',
    level: 2,
    experience: 500,
    discountPercent: 98,
    icon: 'https://picsum.photos/100/100?random=level2',
    backgroundUrl: 'https://picsum.photos/400/200?random=bg2'
  },
  {
    name: '银牌会员',
    level: 3,
    experience: 2000,
    discountPercent: 95,
    icon: 'https://picsum.photos/100/100?random=level3',
    backgroundUrl: 'https://picsum.photos/400/200?random=bg3'
  },
  {
    name: '金牌会员',
    level: 4,
    experience: 5000,
    discountPercent: 90,
    icon: 'https://picsum.photos/100/100?random=level4',
    backgroundUrl: 'https://picsum.photos/400/200?random=bg4'
  },
  {
    name: '钻石会员',
    level: 5,
    experience: 15000,
    discountPercent: 85,
    icon: 'https://picsum.photos/100/100?random=level5',
    backgroundUrl: 'https://picsum.photos/400/200?random=bg5'
  }
]

/* ==================== 经验记录数据 ==================== */

/**
 * Mock 经验记录列表
 */
export const mockExperienceRecords: ExperienceRecordVO[] = [
  {
    title: '每日签到',
    experience: 10,
    description: '每日签到增加10经验',
    createTime: '2026-03-26 10:30:00'
  },
  {
    title: '完成订单',
    experience: 50,
    description: '订单消费增加50经验',
    createTime: '2026-03-25 15:20:00'
  },
  {
    title: '完成练习',
    experience: 20,
    description: '完成一次章节练习',
    createTime: '2026-03-25 14:00:00'
  },
  {
    title: '每日签到',
    experience: 10,
    description: '每日签到增加10经验',
    createTime: '2026-03-24 09:15:00'
  },
  {
    title: '错题重做',
    experience: 15,
    description: '完成错题重做并获得满分',
    createTime: '2026-03-23 16:45:00'
  },
  {
    title: '模拟考试',
    experience: 100,
    description: '完成一次模拟考试',
    createTime: '2026-03-22 10:00:00'
  },
  {
    title: '每日签到',
    experience: 10,
    description: '每日签到增加10经验',
    createTime: '2026-03-22 08:30:00'
  },
  {
    title: '连续学习',
    experience: 30,
    description: '连续学习7天奖励',
    createTime: '2026-03-21 20:00:00'
  },
  {
    title: '分享题库',
    experience: 20,
    description: '成功分享题库给好友',
    createTime: '2026-03-20 14:20:00'
  },
  {
    title: '完善资料',
    experience: 50,
    description: '首次完善个人信息',
    createTime: '2026-03-19 11:00:00'
  },
  {
    title: '绑定手机',
    experience: 30,
    description: '首次绑定手机号',
    createTime: '2026-03-19 10:30:00'
  },
  {
    title: '注册会员',
    experience: 100,
    description: '注册成为会员',
    createTime: '2026-03-19 10:00:00'
  }
]

/* ==================== 查询函数 ==================== */

/**
 * 获取 Mock 等级列表
 * @returns 所有等级数据
 */
export const getMockLevelList = (): Promise<MemberLevelVO[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockLevelList])
    }, 300)
  })
}

/**
 * 获取 Mock 经验记录分页数据
 * @param params 查询参数
 * @returns 经验记录分页数据
 */
export const getMockExperienceRecordPage = (
  params: ExperienceRecordPageReqVO = {}
): Promise<ExperienceRecordPageRespVO> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { pageNo = 1, pageSize = 10 } = params

      /* 按时间倒序排序 */
      const sortedList = [...mockExperienceRecords].sort(
        (a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
      )

      /* 分页 */
      const total = sortedList.length
      const start = (pageNo - 1) * pageSize
      const end = start + pageSize
      const list = sortedList.slice(start, end)

      resolve({
        list,
        total
      })
    }, 300)
  })
}
