import {include} from './build/vite/optimize'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'

// 当前执行node命令时文件夹的地址(工作目录)
const root = process.cwd()

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devServer: {
        port: process.env.VITE_PORT ? Number(process.env.VITE_PORT) : 90,
    },
    runtimeConfig: {
        public: {
            captcha_enable: process.env.NUXT_CAPTCHA_ENABLE
        }
    },
    app: {
        head: {
            titleTemplate: '%s - 学次元_在线题库',
            title: '学次元在线题库',
            meta: [
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                {
                    name: 'keywords',
                    content: '学次元题库,在线题库系统,学习资源平台,在线智刷题题库软件,含解析的在线练习题库',
                    tagPriority: 1,
                },
                {
                    name: 'description',
                    content: '学次元题库是专业的在线题库平台，涵盖中小学、高校全学科、职业考试等练习题资源，支持智能刷题、错题整理、定制化出题等功能，为学生提供高效学习工具，为教育机构赋能数字化教学管理。',
                    tagPriority: 1,
                },
                // {  name:"baidu-site-verification", content:"codeva-w2YAhxVIdI" },
                // {  name:"msvalidate.01", content:"7638BE55E64104B446CF610E1463BC5F" }
            ],
            script: [{ src: process.env.NUXT_BAIDU_ANALYTICS }],
            link: [],
            style: [],
            noscript: []
        },
        baseURL: '/',
    },
    hooks: {
        // 构建开始前触发（nuxt build 时执行）
    },
    devtools: {enabled: true},
    modules: [
      '@pinia/nuxt',
      'pinia-plugin-persistedstate/nuxt',
      '@nuxt/eslint',
      '@nuxt/test-utils',
      '@nuxt/image',
      '@nuxt/devtools',
      '@element-plus/nuxt',
      '@unocss/nuxt',
      '@nuxt/icon',
      '@nuxtjs/sitemap',
      '@nuxtjs/i18n',
      'nuxt-swiper'
    ],
    // 图片优化配置
    image: {
        quality: 80,
        format: ['webp', 'jpg', 'png'],
        screens: {
            xs: 320,
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280,
            xxl: 1536,
        },
        presets: {
            avatar: {
                modifiers: {
                    format: 'webp',
                    width: 100,
                    height: 100,
                    fit: 'cover',
                },
            },
            thumbnail: {
                modifiers: {
                    format: 'webp',
                    width: 300,
                    height: 200,
                    fit: 'cover',
                },
            },
        },
    },
    icon: {
        localApiEndpoint: '/nuxt-icon',
        serverBundle: {
            collections: ['ep', 'mdi', 'fa', 'fa-solid', 'carbon', 'icon-park-twotone'],
        }
    },
    site: {
        url: 'https://www.xueciyuan.com',
        name: "学次元-在线题库",
    },

    components: [
        {
            path: '~/components',
            pathPrefix: false,
            global: true,
        },
    ],
    sitemap: {
        sources: ["/api/__sitemap__/urls"],
        exclude: ["/account/**", "/order/**", "/en/**"],
        // excludeAppSources: true,
        // cacheMaxAgeSeconds: 6 * 60 * 60,
        autoLastmod: true,
        autoI18n: false,
        // 添加更多配置
        defaults: {
            changefreq: "weekly",
            priority: 0.8,
            lastmod: new Date(),
        },
        // 确保sitemap可以被搜索引擎访问
        xslColumns: [
            {label: "URL", width: "50%"},
            {label: "Last Modified", select: "sitemap:lastmod", width: "25%"},
            {label: "Priority", select: "sitemap:priority", width: "12.5%"},
            {label: "Change Frequency", select: "sitemap:changefreq", width: "12.5%"},
        ],
    },
    css: [
        '~/assets/css/main.css',
        'element-plus/dist/index.css',
        'uno.css'
    ],
    vite: {
        root: root,
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@use "@/styles/variables.scss" as *;',
                    silenceDeprecations: ['legacy-js-api'],
                },
            },
        },
        resolve: {
            extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.scss', '.css'],
        },
        // 依赖优化配置
        optimizeDeps: {
            include,
        },
        ssr: {
            noExternal: ['fabric'] // 避免 SSR 解析 fabric
        },
        plugins: [
            AutoImport({
                resolvers: [ElementPlusResolver()],
            }),
            Components({
                resolvers: [ElementPlusResolver()],
            }),
        ],
    },
    build: {
        transpile: ['fabric'],
        // 代码分割优化
        splitChunks: {
            pages: true,
            vendor: true,
        },
    },
    // 实验性功能优化
    experimental: {
        // 启用组件懒加载
        componentIslands: true,
        // 启用头部优化
        headNext: true,
        // 启用payload压缩
        payloadExtraction: true,
    },
    plugins: [
        '~/plugins/fabric.client.ts',
        '~/plugins/env.ts'
    ],
    imports: {
        dirs: [
            '~/composables/**'
        ]
    },
    i18n: {
        locales: [
            {code: 'en', name: 'English', file: 'en.ts'},
            {code: 'zh', name: '中文', file: 'zh.ts'}
        ],
        defaultLocale: 'zh',
    },
    piniaPluginPersistedstate: {
        storage: 'localStorage',
    },
    nitro: {
        // 代理，前后端分离有用
        // devProxy: {
        //   "/app-api": {
        //     target: process.env.NUXT_BASE_URL,
        //     changeOrigin: true,
        //     prependPath: true,
        //   },
        // },
        // 该配置用于服务端请求转发
        routeRules: {
            "/api/**": {
                // 本地mock API，不代理
                proxy: false,
            },
            "/app-api/**": {
                // proxy: `http://127.0.0.1:38080/app-api/**`,
                proxy: process.env.NUXT_BASE_URL! + process.env.NUXT_API_URL + '/**',
            },
        },
        compressPublicAssets: {
            gzip: true,
            brotli: false,
        }, //开启压缩
        logLevel: 'verbose',
    },
    routeRules: {
        // 静态页面预渲染
        '/': { prerender: true },
        '/about': { prerender: true },
        '/contact': { prerender: true },
        '/article/**': { isr: 3600 },
        '/document/**': { isr: 3600 },
        '/qbank': { isr: 1800 },
        // 客户端渲染路由
        '/account/**': { ssr: false },
        '/qb/**': { ssr: false },
        '/study/**': { ssr: false },
        '/order/**': { ssr: false },
        // API缓存
        '/api/**': { cache: { maxAge: 60 * 5 } },
    }
})