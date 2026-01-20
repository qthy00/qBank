import {defineStore} from 'pinia'
import type {AppInfo, AppState, ShareInfo} from '~/types/app'


export const useAppStore = defineStore('app', () => {

    const appInfo = ref<AppInfo>({
        name: '在线工具库', // 名称
        logo: '', // logo
        version: '1.0.0', // 版本号
        copyright: '在线工具网，保留所有权利', // 版权信息 I
        copyTime: 'Copyright© 2022-2025', // 版权信息 II
        cdnUrl: '', // 云存储域名
        filesystem: '', // 云存储平台
    })
    const appState = ref<AppState>({
        bind_mobile: 0, // 登陆后绑定手机号提醒 (弱提醒，可手动关闭)
        pageLoading: false, // 路由跳转loading
    })
    const appShareInfo = ref<ShareInfo>({
        methods: ['poster', 'link'], // 支持的分享方式
        forwardInfo: {}, // 默认转发信息
        posterInfo: {
            "user_bg": "/src/assets/images/user-poster-bg.png",
            "tools_bg": "/src/assets/images/goods-poster-bg.png",
        }, // 海报信息
        linkAddress: 'https://www.gongjua.cn/', // 复制链接地址
    })
    const isMobile = ref<boolean>(false)


    const checkIsMobile = () => {
        if (!import.meta.client) {
            return
        }
        // 检测userAgent中的移动设备特征
        const isMobileAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        // 结合屏幕宽度判断
        const isSmallScreen = window.innerWidth <= 768;
        // 综合判断：如果是移动设备特征或者小屏幕，则认为是手机端
        isMobile.value = isMobileAgent || isSmallScreen;
    }
    const init = () => {
        if (!import.meta.client) {
            return
        }
        checkIsMobile()
        window.addEventListener('resize', checkIsMobile)
        // 页面卸载时移除事件监听，避免内存泄漏
        window.addEventListener('beforeunload', () => {
            window.removeEventListener('resize', checkIsMobile);
        })
    }

    return {
        appInfo,
        appState,
        appShareInfo,
        isMobile,
        init
    }
}, {
    persist: true,
})

