// stores/auth.ts
import {defineStore} from 'pinia'
import {encrypt, decrypt} from '@/utils/jsencrypt'
import {useUserStore} from "~/stores/user";
import * as LoginApi from "~/api/login";

// 定义类型
interface LoginFormType {
    account: string
    password: string
    rememberMe: boolean
}

// 组合式 API 写法：第二个参数是 setup 函数
export const useAuthStore = defineStore('auth', () => {
    const userStore = useUserStore()
    const {setTokens, clearTokens} = useToken()

    // 1. 定义响应式状态
    const isLogin = ref(false)
    const loginForm = reactive<LoginFormType>({
        account: '',
        password: '',
        rememberMe: true
    })
    const openid = ref<string>()
    const wxCode = ref<string>()

    // 2. 定义 Getter（计算属性，使用 computed）
    const decryptedLoginForm = computed(() => {
        return {
            ...loginForm,
            password: loginForm.password ? decrypt(loginForm.password) as string : ''
        }
    })

    // 3. 定义 Action（业务逻辑方法）
    const setLoginForm = (data: LoginFormType) => {
        // 加密密码后更新表单
        loginForm.account = data.account
        loginForm.password = data.password ? encrypt(data.password) as string : ''
        loginForm.rememberMe = data.rememberMe
    }

    const removeLoginForm = () => {
        loginForm.account = ''
        loginForm.password = ''
        loginForm.rememberMe = false
    }

    const login = async (data: any) => {
        const res = await LoginApi.login(data)
        if (!res) {
            throw new Error('登录失败')
        }
        isLogin.value = true
        openid.value = res.openid
        setTokens(res.accessToken, res.refreshToken)
        await userStore.fetchUserInfo()
    }

    const socialLogin = async (type: number, code: string, state: string) => {
        const res = await LoginApi.socialLogin(type, code, state)
        if (!res) {
            throw new Error('登录失败')
        }
        isLogin.value = true
        openid.value = res.openid
        setTokens(res.accessToken, res.refreshToken)
        await userStore.fetchUserInfo()
    }

    const logout = async (api: boolean = true) => {
        if(api) {
            await LoginApi.logout()
        }
        // 清空状态
        isLogin.value = false
        loginForm.account = ''
        loginForm.password = ''
        loginForm.rememberMe = true
        clearTokens()
        openid.value = undefined
        userStore.resetState()
        // TODO: 清空工具、测试等缓存
    }

    // 4. 返回需要暴露的状态和方法（核心：必须返回才能在组件中使用）
    return {
        isLogin,
        loginForm,
        decryptedLoginForm,
        openid,
        wxCode,
        setLoginForm,
        removeLoginForm,
        login,
        socialLogin,
        logout
    }
}, {
    // 持久化配置
    persist: {
        paths: ['isLogin', 'loginForm', 'openid','wxCode'],
    }
})