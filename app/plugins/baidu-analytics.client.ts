export default defineNuxtPlugin(() => {
    // 确保在客户端执行
    // if (import.meta.client) {
    //     // 初始化百度统计
    //     window._hmt = window._hmt || [];
    //
    //     // 创建并插入脚本
    //     const hm = document.createElement("script");
    //     hm.src = "https://hm.baidu.com/hm.js?bb1f3f39797e174fa30ed09f160eaf59";
    //     hm.defer = true;
    //     const s = document.getElementsByTagName("script")[0];
    //     s.parentNode?.insertBefore(hm, s);
    // }
});