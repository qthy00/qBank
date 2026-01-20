/**
 * 从服务端获取路由数据
 * 注意：开发环境可直接请求外部接口，生产环境若需内网请求可走 Nuxt 服务器路由
 */
import {getRouters} from '~/api/login'
import qs from 'qs'

const modules = import.meta.glob('~~/app/views/**/*.{vue,tsx}')
export const Layout = () => import('~/layouts/default.vue')


export const fetchServerRoutes = async () => {
    try {
        // 方式1：请求外部接口（前端直连）
        const {data} = await getRouters()
        return generateRoute(data.value)
    } catch (error) {
        console.error('获取服务端路由失败：', error)
        return []
    }
}

const generateRoute = (routes: AppCustomRouteRecordRaw[]): AppRouteRecordRaw[] => {
    const res: AppRouteRecordRaw[] = []
    const modulesRoutesKeys = Object.keys(modules)
    for (const route of routes) {
        // 1. 生成 meta 菜单元数据
        const meta = {
            title: route.name,
            description: route.description,
            icon: route.icon,
            toolId: route.series,
            requiresAuth: false,
            id: route.id,
        } as any
        // 特殊逻辑：如果后端配置的 MenuDO.component 包含 ?，则表示需要传递参数
        // 此时，我们需要解析参数，并且将参数放到 meta.query 中
        // 这样，后续在 Vue 文件中，可以通过 const { currentRoute } = useRouter() 中，通过 meta.query 获取到参数
        if (route.component && route.component.indexOf('?') > -1) {
            const query = route.component.split('?')[1]
            route.component = route.component.split('?')[0]
            meta.query = qs.parse(query)
        }

        // 2. 生成 data（AppRouteRecordRaw）
        // 路由地址转首字母大写驼峰，作为路由名称，适配keepAlive
        let data: AppRouteRecordRaw = {
            path: route.path.indexOf('?') > -1 && !isUrl(route.path) ? route.path.split('?')[0] : route.path, // 注意，需要排除 http 这种 url，避免它带 ? 参数被截取掉
            name: toCamelCase(route.path, true),
            redirect: route.redirect,
            meta: meta
        }
        //处理顶级非目录路由
        if (!route.children && route.parentId == 0 && route.component) {
            // data.component = Layout
            data.name = toCamelCase(route.path, true) + 'Parent'
            data.redirect = ''
            meta.alwaysShow = true
            const childrenData: AppRouteRecordRaw = {
                path: '',
                name: toCamelCase(route.path, true),
                redirect: route.redirect,
                meta: meta
            }
            const index = modulesRoutesKeys.findIndex((ev) => ev.includes(route.component))
            childrenData.component = modules[modulesRoutesKeys[index]]
            data.children = [childrenData]
        } else {
            // 目录
            if (route.children?.length) {
                // data.component = Layout
                data.redirect = getRedirect(route.path, route.children)
                // 外链
            } else if (isUrl(route.path)) {
                data = {
                    path: '/external-link',
                    // component: Layout,
                    meta: {
                        name: route.name
                    },
                    children: [data]
                } as AppRouteRecordRaw
                // 菜单
            } else {
                // 新增：判断series是否在600-800之间
                if (route.series && route.series >= 600 && route.series <= 800) {
                    // 固定使用tools/601/index.vue组件
                    const targetComponentKey = modulesRoutesKeys.find(key => key.includes("tools/601/index.vue"));
                    data.component = targetComponentKey ? modules[targetComponentKey] : null;
                } else {
                    // 原有逻辑：根据后端提供的component匹配组件
                    // 对后端传component组件路径和不传做兼容（如果后端传component组件路径，那么path可以随便写，如果不传，component组件路径会根path保持一致）
                    const index = modulesRoutesKeys.findIndex(ev => ev.includes(route.component));
                    data.component = modules[modulesRoutesKeys[index]];
                }
            }
            if (route.children) {
                data.children = generateRoute(route.children)
            }
        }
        res.push(data as AppRouteRecordRaw)
    }
    return res
}

const toCamelCase = (str: string, upperCaseFirst: boolean) => {
    str = (str || '')
        .replace(/-(.)/g, function (group1: string) {
            return group1.toUpperCase()
        })
        .replace('-', '')
        .replace('/', '')

    if (upperCaseFirst && str) {
        str = str.charAt(0).toUpperCase() + str.slice(1)
    }

    return str
}

export const getRedirect = (parentPath: string, children: AppCustomRouteRecordRaw[]) => {
    if (!children || children.length == 0) {
        return parentPath
    }
    const path = generateRoutePath(parentPath, children[0].path)
    // 递归子节点
    if (children[0].children) return getRedirect(path, children[0].children)
}

const generateRoutePath = (parentPath: string, path: string) => {
    if (parentPath.endsWith('/')) {
        parentPath = parentPath.slice(0, -1) // 移除默认的 /
    }
    if (!path.startsWith('/')) {
        path = '/' + path
    }
    return parentPath + path
}