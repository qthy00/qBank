# 蓝色渐变设计系统规范

## 何时使用

**适用场景**
- 新增 PC 端页面开发
- 重构现有页面统一风格
- 创建新的功能模块页面

**不适用场景**
- 管理后台页面（使用 Element Plus 默认风格）
- 移动端 H5 页面（使用 uni-app 项目）
- 纯功能组件（不依赖页面级样式）

---

## 设计哲学

本设计系统采用**蓝色渐变主题**，传达专业、可信赖、清新的视觉感受。核心特征：

- **统一色调**：以蓝色系为主，从深蓝到青绿的渐变
- **简约大气**：留白充足，层级清晰
- **多端自适应**：PC 端双栏布局，H5 端单栏适配
- **一致性**：所有页面保持视觉统一

---

## 色彩系统

### 主色调（头部渐变）

```vue
<!-- 头部背景 - 蓝色渐变 -->
<div class="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-500 to-cyan-500"/>
```

| 位置 | 颜色 | Tailwind 类 |
|------|------|-------------|
| 起始 | 深蓝 | `from-blue-600` |
| 中间 | 靛蓝 | `via-indigo-500` |
| 结束 | 青色 | `to-cyan-500` |

### 页面背景色

```vue
<!-- 页面背景 - 浅色渐变 -->
<div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
```

| 位置 | 颜色 | Tailwind 类 |
|------|------|-------------|
| 起始 | 石板灰 | `from-slate-50` |
| 中间 | 浅蓝 | `via-blue-50` |
| 结束 | 青色 | `to-cyan-50` |

### 装饰元素色

```vue
<!-- 头部装饰光晕 -->
<div class="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"/>
<div class="absolute top-20 right-20 w-48 h-48 bg-cyan-300/20 rounded-full blur-3xl"/>
<div class="absolute bottom-10 left-1/3 w-24 h-24 bg-blue-300/20 rounded-full blur-2xl"/>
```

### 功能色

| 用途 | 颜色 | Tailwind 类 |
|------|------|-------------|
| 主按钮 | 蓝青渐变 | `from-blue-500 to-cyan-500` |
| VIP/强调 | 琥珀橙 | `from-amber-500 to-orange-500` |
| 成功 | 翠绿 | `from-emerald-500 to-teal-500` |
| 警告 | 红色 | `from-red-500 to-pink-500` |
| 免费标签 | 红粉渐变 | `from-red-500 to-pink-500` |

---

## 头部设计模式

### 标准头部结构

```vue
<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
    <!-- 蓝色渐变头部 -->
    <div class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-500 to-cyan-500"/>

      <!-- 装饰图案 -->
      <div class="absolute inset-0">
        <div class="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"/>
        <div class="absolute top-20 right-20 w-48 h-48 bg-cyan-300/20 rounded-full blur-3xl"/>
        <div class="absolute bottom-10 left-1/3 w-24 h-24 bg-blue-300/20 rounded-full blur-2xl"/>
      </div>

      <!-- 头部内容 -->
      <div class="relative container mx-auto px-4 py-8">
        <!-- 页面标题、面包屑等 -->
      </div>
    </div>

    <!-- 页面主体内容 -->
    <div class="container mx-auto px-4 py-6">
      <!-- ... -->
    </div>
  </div>
</template>
```

### 头部高度规范

| 页面类型 | 高度 | 说明 |
|----------|------|------|
| 列表页 | `overflow-hidden` 自适应 | 包含搜索和标题 |
| 详情页 | `overflow-hidden` 自适应 | 包含面包屑 |
| 落地页 | `h-48` 或更高 | 突出展示 |

---

## 卡片设计模式

### 标准卡片

```vue
<!-- 白色卡片 -->
<div class="bg-white rounded-2xl shadow-lg shadow-blue-100/50 border border-blue-100 p-6">
  <!-- 卡片内容 -->
</div>
```

### 卡片变体

| 类型 | 样式 |
|------|------|
| 标准卡片 | `bg-white rounded-2xl shadow-lg shadow-blue-100/50 border border-blue-100` |
| 悬停效果 | `hover:shadow-xl hover:border-blue-200 transition-all duration-300` |
| 渐变边框 | `bg-gradient-to-br from-blue-500 to-cyan-500 p-0.5 rounded-2xl` |
| 毛玻璃效果 | `bg-white/10 backdrop-blur-sm rounded-xl` |

### Element Plus 卡片覆盖样式

```scss
/* 覆盖 el-card 默认样式 */
:deep(.el-card) {
  border-radius: 12px;
  border: 1px solid #dbeafe; /* blue-100 */
}

:deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}
```

---

## 按钮设计模式

### 主按钮（蓝青渐变）

```vue
<button class="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full font-medium hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/30">
  立即下载
</button>
```

### VIP/强调按钮（琥珀橙渐变）

```vue
<button class="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-medium hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/30">
  VIP下载
</button>
```

### 次要按钮（描边样式）

```vue
<button class="px-4 py-2 border border-blue-200 text-blue-600 rounded-full hover:bg-blue-50 transition-colors">
  查看详情
</button>
```

### Element Plus 按钮覆盖

```vue
<el-button type="primary" class="bg-gradient-to-r from-blue-500 to-cyan-500 border-0">
  提交
</el-button>
```

---

## 标签设计模式

### 分类标签

```vue
<span class="px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-md shadow-blue-500/30">
  分类名称
</span>
```

### 免费标签

```vue
<span class="px-2 py-0.5 text-xs font-medium text-white bg-gradient-to-r from-red-500 to-pink-500 rounded shrink-0">
  免费
</span>
```

### VIP标签

```vue
<span class="px-2 py-0.5 text-xs font-medium text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded shrink-0">
  VIP
</span>
```

---

## 布局模式

### 双栏布局（PC端）

```vue
<template>
  <div class="container mx-auto px-4 py-6">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- 左侧主内容 -->
      <div class="lg:col-span-9 space-y-6">
        <!-- 主内容区 -->
      </div>

      <!-- 右侧侧边栏 - H5端隐藏 -->
      <div class="lg:col-span-3 space-y-6 hidden lg:block">
        <!-- 侧边栏内容 -->
      </div>
    </div>
  </div>
</template>
```

### 三栏布局（PC端）

```vue
<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <!-- 左侧：榜单切换 -->
  <div class="lg:col-span-2 space-y-6">
    <!-- ... -->
  </div>

  <!-- 右侧：我的排名和说明 -->
  <div class="space-y-6">
    <!-- ... -->
  </div>
</div>
```

### 响应式断点

| 断点 | Tailwind 类 | 布局变化 |
|------|-------------|----------|
| 移动端 | 默认 | 单栏，侧边栏隐藏 |
| 平板 | `md:` | 适当调整间距 |
| PC端 | `lg:` | 双栏，显示侧边栏 |
| 大屏 | `xl:` | 增加容器宽度 |

---

## 排版规范

### 标题层级

```vue
<!-- 页面大标题 -->
<h1 class="text-3xl md:text-4xl font-bold text-white">
  页面标题
</h1>

<!-- 区块标题 -->
<h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
  <Icon name="ep:trophy" class="text-amber-500" />
  区块标题
</h2>

<!-- 卡片标题 -->
<h3 class="text-lg font-semibold text-slate-800">
  卡片标题
</h3>
```

### 正文文本

```vue
<!-- 主要文字 -->
<p class="text-slate-700 leading-relaxed">
  正文内容
</p>

<!-- 次要文字 -->
<span class="text-sm text-slate-500">
  辅助信息
</span>

<!-- 白色背景上的文字 -->
<p class="text-white/90">
  头部区域文字
</p>
```

### 文字截断

```vue
<!-- 单行截断 -->
<div class="truncate">单行文字截断</div>

<!-- 多行截断 -->
<div class="line-clamp-2">多行文字截断，最多显示两行</div>
```

---

## 图标使用规范

### 图标库

使用 `@nuxt/icon` 组件，主要使用 `ep:` (Element Plus) 前缀：

```vue
<Icon name="ep:document" />      <!-- 文档 -->
<Icon name="ep:folder" />        <!-- 文件夹 -->
<Icon name="ep:trophy" />        <!-- 奖杯/排行 -->
<Icon name="mdi:fire" />          <!-- 热门 -->
<Icon name="ep:share" />         <!-- 分享 -->
<Icon name="ep:arrow-right" />   <!-- 箭头 -->
<Icon name="ep:check" />         <!-- 勾选 -->
<Icon name="ep:warning-filled" /> <!-- 警告 -->
```

### 图标尺寸

| 场景 | 尺寸 | 示例 |
|------|------|------|
| 标题图标 | `text-xl` 或 `text-2xl` | `<Icon name="ep:trophy" class="text-2xl" />` |
| 按钮图标 | `text-sm` | `<Icon name="ep:arrow-right" class="text-sm" />` |
| 列表图标 | `text-base` | 默认大小 |

### 图标颜色

```vue
<!-- 跟随文字颜色 -->
<Icon name="ep:document" class="text-blue-500" />

<!-- 渐变背景上的白色图标 -->
<Icon name="ep:trophy" class="text-yellow-300" />

<!-- 功能色图标 -->
<Icon name="mdi:fire" class="text-red-500" />
<Icon name="ep:check" class="text-emerald-500" />
```

---

## 动画与过渡

### 标准过渡

```vue
<!-- 卡片悬停效果 -->
<div class="hover:shadow-lg hover:-translate-y-1 transition-all duration-300">

<!-- 按钮悬停 -->
<button class="hover:from-blue-600 hover:to-cyan-600 transition-all">

<!-- 图片缩放 -->
<img class="group-hover:scale-105 transition-transform duration-300">

<!-- 链接下划线动画 -->
<a class="relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full">
```

### 页面过渡

```vue
<!-- 底部栏滑入动画 -->
<transition name="slide-up">
  <div v-if="showFixedBar" class="fixed bottom-0 left-0 right-0">
    <!-- ... -->
  </div>
</transition>
```

```scss
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
```

---

## 完整页面模板

### 列表页模板

```vue
<script setup lang="ts">
/* 页面元信息 */
definePageMeta({
  layout: 'default'
})

useHead({
  title: '页面标题 - 学次元'
})

/* 状态定义 */
const loading = ref(false)
const list = ref([])

/* 数据获取 */
const fetchData = async () => {
  loading.value = true
  try {
    // API 调用
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
    <!-- 头部 -->
    <div class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-500 to-cyan-500"/>
      <div class="absolute inset-0">
        <div class="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"/>
        <div class="absolute top-20 right-20 w-48 h-48 bg-cyan-300/20 rounded-full blur-3xl"/>
        <div class="absolute bottom-10 left-1/3 w-24 h-24 bg-blue-300/20 rounded-full blur-2xl"/>
      </div>
      <div class="relative container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold text-white">页面标题</h1>
        <p class="text-white/80 mt-2">页面描述</p>
      </div>
    </div>

    <!-- 内容区 -->
    <div class="container mx-auto px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- 左侧主内容 -->
        <div class="lg:col-span-9 space-y-6">
          <!-- 筛选区 -->
          <div class="bg-white rounded-2xl shadow-lg shadow-blue-100/50 border border-blue-100 p-6">
            <!-- 筛选表单 -->
          </div>

          <!-- 列表 -->
          <div v-loading="loading" class="bg-white rounded-2xl shadow-lg shadow-blue-100/50 border border-blue-100 p-6">
            <!-- 列表内容 -->
          </div>
        </div>

        <!-- 右侧侧边栏 -->
        <div class="lg:col-span-3 space-y-6 hidden lg:block">
          <!-- 热门推荐 -->
          <div class="bg-white rounded-2xl shadow-lg shadow-blue-100/50 border border-blue-100 p-5">
            <h3 class="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Icon name="mdi:fire" class="text-red-500" />
              热门推荐
            </h3>
            <!-- ... -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
```

### 详情页模板

```vue
<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const route = useRoute()
const router = useRouter()

/* 数据获取 */
const fetchDetail = async () => {
  const id = Number(route.params.id)
  if (!id) {
    router.push('/list')
    return
  }
  // API 调用
}

onMounted(fetchDetail)
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
    <!-- 头部（含面包屑） -->
    <div class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-500 to-cyan-500"/>
      <div class="absolute inset-0">
        <!-- 装饰光晕 -->
      </div>
      <div class="relative container mx-auto px-4 py-6">
        <!-- 面包屑 -->
        <div class="flex items-center text-sm text-white/80 mb-4">
          <span class="cursor-pointer hover:text-white" @click="router.push('/')">首页</span>
          <Icon name="ep:arrow-right" class="mx-2 text-xs" />
          <span class="text-white">当前页面</span>
        </div>
        <h1 class="text-2xl font-bold text-white">详情标题</h1>
      </div>
    </div>

    <!-- 内容区 -->
    <div class="container mx-auto px-4 py-6 pb-24">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div class="lg:col-span-9 space-y-6">
          <!-- 详情卡片 -->
          <div class="bg-white rounded-2xl shadow-lg shadow-blue-100/50 border border-blue-100 p-6">
            <!-- 内容 -->
          </div>
        </div>
        <div class="lg:col-span-3 space-y-6 hidden lg:block">
          <!-- 侧边栏 -->
        </div>
      </div>
    </div>
  </div>
</template>
```

---

## 检查清单

开发新页面时，请逐项检查：

### 色彩检查
- [ ] 页面背景使用 `bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50`
- [ ] 头部使用 `bg-gradient-to-br from-blue-600 via-indigo-500 to-cyan-500`
- [ ] 卡片使用 `border-blue-100` 和 `shadow-blue-100/50`
- [ ] 主按钮使用蓝青渐变 `from-blue-500 to-cyan-500`

### 布局检查
- [ ] 容器使用 `container mx-auto px-4`
- [ ] PC端双栏布局 `lg:grid-cols-12`，主内容 `lg:col-span-9`，侧边栏 `lg:col-span-3`
- [ ] 侧边栏在移动端隐藏 `hidden lg:block`
- [ ] 底部留足内边距 `pb-24`（如有固定底部栏）

### 头部检查
- [ ] 包含装饰光晕元素（3个圆形模糊元素）
- [ ] 标题使用 `text-white`
- [ ] 副标题/面包屑使用 `text-white/80`

### 卡片检查
- [ ] 圆角 `rounded-2xl`
- [ ] 阴影 `shadow-lg`
- [ ] 边框 `border border-blue-100`
- [ ] 内边距 `p-5` 或 `p-6`

### 图标检查
- [ ] 使用 `@nuxt/icon` 组件 `<Icon name="ep:xxx" />`
- [ ] 标题图标添加颜色类，如 `text-blue-500`

### 响应式检查
- [ ] PC端显示双栏
- [ ] 移动端自动切换单栏
- [ ] 文字大小响应式 `text-3xl md:text-4xl`

---

## 示例页面参考

已实现统一风格的页面：

| 页面 | 路径 | 特点 |
|------|------|------|
| 资讯列表 | `app/pages/article/index.vue` | 双栏布局，筛选卡片 |
| 资讯详情 | `app/pages/article/[id].vue` | 详情+分享+相关推荐 |
| 文档列表 | `app/pages/document/index.vue` | 双栏布局，分类筛选 |
| 文档详情 | `app/pages/document/[id].vue` | 详情+下载+热门排行 |
| 排行榜 | `app/pages/ranking/index.vue` | 双栏布局，榜单切换 |
| 智能组卷 | `app/pages/exam/smart/index.vue` | Element Plus 卡片覆盖样式 |
| APP下载 | `app/pages/app-download.vue` | 落地页，英雄区设计 |

---

## 注意事项

### 必须遵守
1. **CSS 注释**必须使用 `/* */`，禁止使用 `//`
2. **HTTP 请求**使用封装的 `httpGet/httpPost`，禁止直接使用 `$fetch`
3. **消息提示**使用 `useMessage()`，禁止直接使用 `ElMessage`
4. **样式单位**使用 `px`，禁止使用 `rem/em/vw/vh`

### 性能优化
1. 图片使用懒加载
2. 弹窗使用 `destroy-on-close`
3. 大数据列表使用虚拟滚动

### SSR 兼容性
1. 客户端 API（如 `window`）使用 `import.meta.client` 判断
2. 服务端数据获取使用 `useAsyncData` 或 `useFetch`

---

**文档版本**: v1.0
**适用项目**: qBank (Nuxt 4 + Vue 3 + Element Plus + UnoCSS)
**最后更新**: 2026-04-03
