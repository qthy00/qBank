export interface ActivationTool {
    id: number
    name: string
    description: string
    icon: string
}

export interface ActivationCode {
    id: number
    dataName: string
    code: string
    codeStatus: '已激活' | '已过期' | '即将过期'
    activatedTime: number
    expiryDate: number
    dataLogo: string
    dataInfo: string
}
