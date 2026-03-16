export interface UserShareVO {
    spm: string
    shareId: string
    page: string
    query: UserShareQuery
}

interface UserShareQuery {
    series: string
}

export interface UserVO {
    id: number
    uid?: string
    avatar: string
    nickname: string
    userName?: string
    mobile?: string
    email?: string
    sex?: number
    birthday?: number
    point?: number
    experience?: number
    loginIp?: string
    loginDate?: number
    createTime?: number
    level?: LevelVO
    slogan?: string
    description?: string
    name?: string
    areaName?: string
}

interface LevelVO {
    id: number
    level: number
    name: string
    icon: string
}
export interface UserProfileUpdateReqVO {
    nickname: string
    email: string
    mobile: string
    sex: number
    birthday: number
    areaId: number
    slogan: string
}


export interface FavoriteVO {
    type: string
    dataId: number
    isFavorite: boolean
}

export interface FeedbackQuestionVO {
    dataId: number
    question: string
    description: string
    attachments: string[]
    category: number
}

export interface SecurityDataVO {
    totalScore: number
    level: string
    items: SecurityItem[]
}

export interface SecurityItem {
    key: string
    value: string
    enabled: boolean
}

export interface PackageAccessVO {
    toolId: number
    hasAccess: boolean // 是否有使用权限
    type: 'subscription' | 'count' | 'lifetime' | 'trial' | 'free'// 权限类型
    remainingUses?: number // 剩余次数（按次）
    trialUsesLeft?: number // 剩余试用次数
    expiredAt?: string // 订阅过期时间
}

export interface DeviceItem {
    id: number
    browser: string
    os: string
    area: string
    ip: string
    loginTime: string
    icon: string | VNode
    trusted: boolean
}