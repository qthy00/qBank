
export interface AppInfo {
    name: string
    logo: string
    version: string
    copyright: string
    copyTime: string
    cdnUrl: string
    filesystem: string
}

export interface AppState {
    bind_mobile: number
    pageLoading: boolean
}

export interface ShareInfo {
    methods: string[]
    forwardInfo: ForwardInfo
    posterInfo: PosterInfo
    linkAddress: string
}

export export interface ForwardInfo {
    type?: string
    title?: string
    image?: string
    price?: number
    original_price?: number
    link?: string
}

export interface PosterInfo {
    tools_bg?: string
    user_bg?: string
}