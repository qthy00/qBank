export interface RegisterVO {
    userName: string
    email: string
    password: string
}

export interface UserLoginVO {
    account: string
    password: string
    captchaVerification?: string
    socialType?: string
    socialCode?: string
    socialState?: string
}

export interface TokenType {
    id: number // 编号
    accessToken: string // 访问令牌
    refreshToken: string // 刷新令牌
    userId: number // 用户编号
    userType: number //用户类型
    clientId: string //客户端编号
    expiresTime: number //过期时间
}

/**
 * 发送短信验证码的接口定义。
 * @param data 包含手机号和场景码的对象。
 */
export interface SmsCodeVO {
    mobile: string
    scene: number
}

/**
 * 发送短信验证码的接口定义。
 * @param data 包含手机号和场景码的对象。
 */
export interface EmailCodeVO {
    email: string
    scene: number
}

/**
 * 短信登录的接口定义。
 * @param mobile 用户的手机号。
 * @param code 短信验证码。
 */
export interface SmsLoginVO {
    mobile: string
    code: string
}
