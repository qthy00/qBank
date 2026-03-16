import {defineStore} from 'pinia'
import {addShareLog} from '~/api/login'
import avatar from '~/assets/images/avatar.jpg'
import type {PackageAccessVO, UserShareVO, UserVO} from "~/types/user"
import {getUser, getInfo, getFavoriteToolsIds, getPackageAccessList} from "~/api/user";


export const useUserStore = defineStore('user', () => {
    // 1. 定义响应式状态
    const isSetUser = ref(false)
    const user = reactive<UserVO>({
        id: 0,
        avatar: avatar,
        nickname: '新用户'
    })
    const userPackages = ref<PackageAccessVO[]>([])

    const shareLog = ref<UserShareVO>()
    const favoriteTools = ref<number[]>([])

    const message = useMessage()

    const fetchUserInfo = async () => {
        const data = await getInfo()
        if(!data) {
            message.error('获取用户信息失败')
            return
        }
        Object.assign(user, data)
        isSetUser.value = true
        // 获取用户题库权限
        try{
            userPackages.value = await getPackageAccessList()
        }
        catch (e) {
            console.log(e)
        }
        // 处理分享记录
        if (shareLog.value) {
            await addShareLog(shareLog.value)
        }
    }

    const fetchUserDetailInfo = async () => {
        const data = await getUser()
        if(!data) {
            message.error('获取用户信息失败')
            return
        }
        Object.assign(user, data)
    }

    const fetchFavoriteTools = async () => {
        if(!isSetUser.value) return
        const data = await getFavoriteToolsIds(false)
        if(!data) {
            message.error('获取用户收藏信息失败')
            return
        }
        favoriteTools.value = data
    }

    const setUserAvatar = async (avatar: string) => {
        user.avatar = avatar
    }

    const setUserNickname = async (nickname: string) => {
        user.nickname = nickname
    }

    const resetState = () => {
        isSetUser.value = false
        Object.assign(user, {
            id: 0,
            avatar: '',
            nickname: ''
        })
        favoriteTools.value = []
    }

    const addUserShareLog = async (params: UserShareVO) => {
        if (params && params.page !== '/') {
            await addShareLog({
                bindUserId: params.shareId,
                toolsSeries: params.query.series
            })
        }
        shareLog.value = undefined
    }

    // 4. 返回需要暴露的状态和方法
    return {
        // 状态
        isSetUser,
        user,
        shareLog,
        favoriteTools,
        userPackages,
        // Actions
        fetchUserInfo,
        fetchUserDetailInfo,
        setUserAvatar,
        setUserNickname,
        resetState,
        addUserShareLog,
        fetchFavoriteTools
    }
}, {
    persist: {
        paths: ['user', 'shareLog', 'favoriteTools','userPackages']
    }
})
