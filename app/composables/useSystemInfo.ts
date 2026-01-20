// 定义系统配置类型接口
interface SystemConfig {
	title?: string;
	title_abbr?: string;
	platform?: string;
	keywords?: string;
	description?: string;
	icp?: string;
	logo?: string;
}

// 定义带value嵌套的系统配置类型（适配cookie中的数据结构）
interface SystemConfigWithValue {
	title?: { value?: string };
	title_abbr?: { value?: string };
	platform?: { value?: string };
	keywords?: { value?: string };
	description?: { value?: string };
	icp?: { value?: string };
	logo?: { value?: string };
}


export const useSystem = () => useState<SystemConfigWithValue | null>('systemConfig', () => null)	// 系统配置
export const useSystemTitle = () => useState<string | null>('systemTitle', () => null)	 // 平台名称
export const useTitleAbbr = () => useState<string>('systemTitleAbbr', () => '工具啊在线平台')	// 平台名称
export const usePlatform = () => useState<string | null>('systemPlatform', () => null)	// 网站标题
export const useKeywords = () => useState<string | null>('systemKeywords', () => null)	// 关键词
export const useDescription = () => useState<string | null>('systemDescription', () => null)	// 描述
export const useIcp = () => useState<string | null>('systemIcp', () => null)
export const useLogo = () => useState<string | null>('systemLogo', () => null)



// 系统配置
export async function useSystemInfo() {
	const systemConfigInfo = useCookie<SystemConfigWithValue | string>('systemConfig')
	if (systemConfigInfo.value && typeof systemConfigInfo.value === 'object') {
		const systemHyConfig = useSystem()
		systemHyConfig.value = systemConfigInfo.value

		// 平台标题
		if (systemConfigInfo.value.title?.value) {
			console.log('cccc');
			const systemTitle = useSystemTitle();
			systemTitle.value = systemConfigInfo.value.title.value;
		}
		// 平台简称
		if (systemConfigInfo.value.title_abbr?.value) {
			const titleAbbr = useTitleAbbr();
			titleAbbr.value = systemConfigInfo.value.title_abbr.value;
		}
		// 网站平台类型
		if (systemConfigInfo.value.platform?.value) {
			const platform = usePlatform();
			platform.value = systemConfigInfo.value.platform.value;
		}
		// 关键词
		if (systemConfigInfo.value.keywords?.value) {
			const keywords = useKeywords();
			keywords.value = systemConfigInfo.value.keywords.value;
		}
		// 描述
		if (systemConfigInfo.value.description?.value) {
			const description = useDescription();
			description.value = systemConfigInfo.value.description.value;
		}
		// ICP备案
		if (systemConfigInfo.value.icp?.value) {
			const icp = useIcp();
			icp.value = systemConfigInfo.value.icp.value;
		}
		// Logo
		if (systemConfigInfo.value.logo?.value) {
			const logo = useLogo();
			logo.value = systemConfigInfo.value.logo.value;
		}
	}

}