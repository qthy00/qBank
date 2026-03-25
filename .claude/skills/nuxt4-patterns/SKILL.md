---
name: nuxt4-patterns
description: Nuxt 4 应用模式，包括 hydration 安全、性能优化、路由规则、懒加载，以及使用 useFetch 和 useAsyncData 的 SSR 安全数据获取

---

# Nuxt 4 模式

在构建或调试具有 SSR、混合渲染、路由规则或页面级数据获取的 Nuxt 4 应用时使用。

## 何时激活

- 服务器 HTML 和客户端状态之间的 hydration 不匹配
- 路由级渲染决策，如预渲染、SWR、ISR 或仅客户端部分
- 关于懒加载、懒 hydration 或 payload 大小的性能优化
- 使用 `useFetch`、`useAsyncData` 或 `$fetch` 的页面或组件数据获取
- 与路由参数、中间件或 SSR/客户端差异相关的 Nuxt 路由问题

## Hydration 安全

- 保持首次渲染确定性。不要直接将 `Date.now()`、`Math.random()`、仅浏览器 API 或存储读取放入 SSR 渲染的模板状态。
- 将仅浏览器逻辑放在 `onMounted()`、`import.meta.client`、`ClientOnly` 后面，或当服务器无法生成相同标记时使用 `.client.vue` 组件。
- 使用 Nuxt 的 `useRoute()` 组合式函数，而不是 `vue-router` 中的。
- 不要使用 `route.fullPath` 驱动 SSR 渲染的标记。URL 片段仅客户端可用，可能导致 hydration 不匹配。
- 将 `ssr: false` 视为真正的仅浏览器区域的逃生舱，而不是 hydration 不匹配的默认修复。

## 数据获取

- 在页面和组件中优先使用 `await useFetch()` 进行 SSR 安全的 API 读取。它将服务器获取的数据转发到 Nuxt payload，避免 hydration 时的第二次获取。
- 当获取器不是简单的 `$fetch()` 调用、需要自定义键或组合多个异步源时使用 `useAsyncData()`。
- 为 `useAsyncData()` 提供稳定的键，以便缓存复用和可预测的刷新行为。
- 保持 `useAsyncData()` 处理程序无副作用。它们可以在 SSR 和 hydration 期间运行。
- 对于用户触发的写入或仅客户端操作使用 `$fetch()`，而不是应从 SSR 进行 hydration 的顶级页面数据。
- 对于不会阻塞导航的非关键数据，使用 `lazy: true`、`useLazyFetch()` 或 `useLazyAsyncData()`。在 UI 中处理 `status === 'pending'`。
- 仅对不需要 SEO 或首次渲染的数据使用 `server: false`。
- 使用 `pick` 修剪 payload 大小，当不需要深层响应式时优先使用浅层 payload。

```ts
const route = useRoute()

const { data: article, status, error, refresh } = await useAsyncData(
  () => `article:${route.params.slug}`,
  () => $fetch(`/api/articles/${route.params.slug}`),
)

const { data: comments } = await useFetch(`/api/articles/${route.params.slug}/comments`, {
  lazy: true,
  server: false,
})
```

## 路由规则

在 `nuxt.config.ts` 中使用 `routeRules` 进行渲染和缓存策略：

```ts
export default defineNuxtConfig({
  routeRules: {
    '/': { prerender: true },
    '/products/**': { swr: 3600 },
    '/blog/**': { isr: true },
    '/admin/**': { ssr: false },
    '/api/**': { cache: { maxAge: 60 * 60 } },
  },
})
```

- `prerender`：构建时的静态 HTML
- `swr`：提供缓存内容并在后台重新验证
- `isr`：在支持的平台上进行增量静态再生
- `ssr: false`：客户端渲染路由
- `cache` 或 `redirect`：Nitro 级响应行为

为路由组选择路由规则，而不是全局。营销页面、目录、仪表板和 API 通常需要不同的策略。

## 懒加载和性能

- Nuxt 已经按路由代码分割页面。在进行组件分割微优化之前，保持路由边界有意义。
- 使用 `Lazy` 前缀动态导入非关键组件。
- 使用 `v-if` 条件渲染懒组件，以便在实际需要 UI 时才加载 chunk。
- 对首屏下方或非关键交互 UI 使用懒 hydration。

```vue
<template>
  <LazyRecommendations v-if="showRecommendations" />
  <LazyProductGallery hydrate-on-visible />
</template>
```

- 对于自定义策略，使用 `defineLazyHydrationComponent()` 配合可见性或空闲策略。
- Nuxt 懒加载在单文件组件上工作。向懒加载组件传递新 props 会立即触发 hydration。
- 使用 `NuxtLink` 进行内部导航，以便 Nuxt 可以预取路由组件和生成的 payload。

## 审查检查清单

- 首次 SSR 渲染和 hydration 后的客户端渲染产生相同的标记
- 页面数据使用 `useFetch` 或 `useAsyncData`，而不是顶级的 `$fetch`
- 非关键数据是懒加载的，并有明确的加载 UI
- 路由规则匹配页面的 SEO 和新鲜度需求
- 重型交互区域是懒加载或懒 hydration 的
