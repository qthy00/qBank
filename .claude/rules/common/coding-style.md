# 编码风格

## 不可变性（关键）

始终创建新对象，绝不改变现有对象：

```
// 伪代码
WRONG:  modify(original, field, value) → 原地修改 original
CORRECT: update(original, field, value) → 返回包含更改的新副本
```

理由：不可变数据可以防止隐藏的副作用，使调试更容易，并支持安全的并发。

## 文件组织

多个小文件 > 少数大文件：

* 高内聚，低耦合
* 通常 200-400 行，最多 800 行
* 从大型模块中提取实用工具
* 按功能/领域组织，而不是按类型组织

## 错误处理

始终全面处理错误：

* 在每个层级明确处理错误
* 在面向用户的代码中提供用户友好的错误消息
* 在服务器端记录详细的错误上下文
* 绝不默默地忽略错误

## 输入验证

始终在系统边界处进行验证：

* 在处理前验证所有用户输入
* 在可用时使用基于模式的验证
* 快速失败并提供清晰的错误消息
* 绝不信任外部数据（API 响应、用户输入、文件内容）

## 代码质量检查清单

在标记工作完成之前：

* \[ ] 代码可读且命名良好
* \[ ] 函数短小（<50 行）
* \[ ] 文件专注（<800 行）
* \[ ] 没有深度嵌套（>4 层）
* \[ ] 正确的错误处理
* \[ ] 没有硬编码的值（使用常量或配置）
* \[ ] 没有突变（使用不可变模式）
* \[ ] 配置文件语法正确（编辑后必须验证构建）

## CSS/SCSS 注释规范

CSS 和 SCSS 文件必须使用 `/* */` 格式注释，禁止使用 `//`。

```scss
/* ✅ 正确 */
.page-container {
  padding: 16px; /* 使用px单位 */
}

/* ❌ 错误 */
// 这是错误的注释
.page-container {
  padding: 16px; // 错误注释
}
```

> **为什么**：SCSS 编译器可能将 `//` 注释保留在生产代码中，或在某些配置下导致解析错误。`/* */` 是 CSS 标准注释格式，更可靠。

## SSR 安全规范（Nuxt 项目）

在使用 Nuxt SSR 时，遵循以下规则确保服务端和客户端渲染一致性：

### 1. 仅浏览器逻辑隔离

将访问浏览器 API 的代码隔离在以下位置：

```typescript
// ✅ 正确：使用 onMounted
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

// ✅ 正确：使用 import.meta.client
if (import.meta.client) {
  const width = window.innerWidth
}

// ✅ 正确：使用 ClientOnly 组件
<ClientOnly>
  <BrowserOnlyComponent />
</ClientOnly>
```

### 2. 避免水合不匹配

- 不要使用 `Date.now()`、`Math.random()` 驱动 SSR 渲染的模板状态
- 不要使用 `route.fullPath` 驱动 SSR 渲染标记（URL 片段仅客户端可用）
- 将 `ssr: false` 视为仅浏览器区域的逃生舱，而不是水合不匹配的默认修复

### 3. 数据处理

- 首屏关键数据使用 `useAsyncData` / `useFetch` 进行 SSR 获取
- 非关键数据使用 `lazy: true` 或 `server: false` 延迟加载
- 用户相关数据（需登录态）在客户端获取

## 样式单位规范

CSS 样式统一使用 **px** 单位，禁止使用 rem/em/vw/vh 等相对单位。

```scss
/* ✅ 正确 */
.page-container {
  padding: 16px;
  font-size: 14px;
  width: 120px;
}

/* ❌ 错误 */
.page-container {
  padding: 1rem;
  font-size: 0.875em;
  width: 10vw;
}
```

> **为什么**：项目使用 UnoCSS + 设计系统，所有尺寸已基于 px 标准化。混合使用相对单位会导致在不同设备或浏览器设置下出现不可预期的布局问题。

## 配置文件编辑规则

### Nuxt 配置文件

编辑 `nuxt.config.ts` 时必须注意：

1. **保持正确的嵌套层级**
   - `modules` 是字符串数组，不要在其中插入对象配置
   - 模块的专属配置（如 `image`、`icon`）应放在 `modules` 数组**外部**

```typescript
// ❌ 错误：image 配置在 modules 数组内部
modules: [
  '@nuxt/image',
  image: { /* ... */ },  // 错误！这会导致语法错误
  '@other/module',
]

// ✅ 正确：image 配置在 modules 数组外部
modules: [
  '@nuxt/image',
  '@other/module',
],
image: {
  quality: 80,
  format: ['webp', 'jpg', 'png'],
},
```

2. **编辑后必须验证**
   - 修改配置文件后，立即运行 `pnpm build` 或 `npx nuxt typecheck` 验证
   - 配置文件语法错误会导致整个应用无法构建

### 组件引用检查

1. **确保导入的模块存在**
   - 导入 API 模块前，确认文件确实存在
   - 从其他项目复制的代码，需要适配到当前项目的 API 结构

```typescript
// ❌ 错误：引用了不存在的 API
import {ToolsApi} from '~/api/tools'

// ✅ 正确：使用项目现有的 API
import {SearchApi} from '~/api/search'
```

2. **临时修复方案**
   - 如果模块确实不存在，可以临时创建 mock 实现避免构建失败
   - 添加 `TODO` 注释标记需要后续完善的地方
