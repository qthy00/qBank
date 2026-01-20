/**
 * 安全获取平台信息
 * @returns 标准化的平台名称
 */
export const getPlatform = (): string => {
    // 优先使用 navigator.userAgentData（Chrome/Edge 等现代浏览器支持）
    if (navigator.userAgentData?.platform) {
        const platform = navigator.userAgentData.platform.toLowerCase();
        if (platform.includes('windows')) return 'Windows';
        if (platform.includes('mac')) return 'macOS';
        if (platform.includes('linux')) return 'Linux';
        if (platform.includes('android')) return 'Android';
        if (platform.includes('ios')) return 'iOS';
        return platform.charAt(0).toUpperCase() + platform.slice(1);
    }

    // 降级方案：解析 navigator.userAgent
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('win')) return 'Windows';
    if (ua.includes('mac')) return 'macOS';
    if (ua.includes('linux')) return 'Linux';
    if (ua.includes('android')) return 'Android';
    if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) return 'iOS';
    if (ua.includes('ios')) return 'iOS';
    if (ua.includes('freebsd')) return 'FreeBSD';
    if (ua.includes('openbsd')) return 'OpenBSD';

    // 终极降级：保留原 platform 但标记（兼容极端情况）
    return navigator.platform || '未知平台';
};

/**
 * 获取设备类型（移动端/桌面端/平板）
 * @param ua - User Agent 字符串
 */
export const getDeviceType = (ua: string): string => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const isTablet = /iPad|Tablet|Nexus Tablet|Kindle/i.test(ua) || (isMobile && screen.width >= 768);

    if (isTablet) return '平板';
    if (isMobile) return '移动端';
    return '桌面端';
};