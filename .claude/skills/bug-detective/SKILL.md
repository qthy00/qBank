---
name: bug-detective
description: |
  Bug侦探 - 自动分析项目错误日志并定位问题根源。
  当用户遇到报错、异常、功能不工作、控制台错误、编译失败、运行时错误时，使用此技能分析并提供修复方案。
  支持多种技术栈：Nuxt/Vue、Spring Boot、UniApp 等。
  支持多种错误来源：浏览器控制台、终端日志、日志文件、用户粘贴的错误信息。
  输出简洁直接，聚焦问题定位和修复方案。
---

# Bug侦探

## 何时使用

当用户遇到以下情况时，立即触发此技能：
- 控制台报错/红色错误信息
- 编译失败/构建错误
- 运行时异常
- 功能不工作/页面白屏
- API 调用失败
- 样式错乱/组件渲染异常
- 任何 "报错"、"异常"、"不工作" 相关描述

## 错误来源识别

支持从以下来源获取错误信息：

### 1. 浏览器控制台
- 使用 `chrome-devtools` MCP 获取 console messages
- 关注 `error` 和 `warn` 级别日志
- 捕获网络请求失败 (xhr/fetch 错误)

### 2. 终端/IDE 输出
- 开发服务器错误 (npm run dev)
- 构建错误 (npm run build)
- 测试失败输出

### 3. 日志文件
- 后端服务日志
- 应用运行时日志
- 用户提供的日志片段

### 4. 直接粘贴
- 用户直接复制粘贴的错误堆栈
- 截图中的错误信息

## 技术栈识别

根据项目结构和错误特征自动识别技术栈：

| 技术栈 | 识别特征 | 常见错误类型 |
|--------|----------|--------------|
| **Nuxt 4 + Vue 3** | `nuxt.config.ts`, `app/pages/`, `composables/` | SSR错误、 hydration不匹配、路由错误 |
| **Spring Boot** | `pom.xml`, `application.yml`, `src/main/java/` | Bean注入失败、SQL异常、HTTP 500 |
| **UniApp** | `pages.json`, `manifest.json`, `pages/` | 跨平台兼容、API调用失败、打包错误 |
| **纯前端** | `package.json`, `src/`, `.vue` 文件 | 组件错误、生命周期问题、状态管理 |

## 分析流程

### 步骤 1：收集错误信息
```
1. 询问用户错误来源（控制台/终端/日志文件/直接粘贴）
2. 如可用 chrome-devtools，获取最近的 console messages
3. 如用户有日志文件，读取相关片段
4. 收集完整错误堆栈（stack trace）
```

### 步骤 2：解析错误
```
1. 提取关键信息：
   - 错误类型 (TypeError, NullPointerException 等)
   - 错误消息（人类可读的描述）
   - 文件位置（出错的具体文件和行号）
   - 调用栈（完整的执行路径）

2. 识别技术栈特定模式：
   - Vue: [Vue warn], Cannot read property of undefined
   - Spring: Exception in thread, ERROR o.s.b.
   - UniApp: [system], thirdScriptError
```

### 步骤 3：定位根因
```
1. 找到堆栈中的第一处项目代码（非 node_modules/库代码）
2. 分析错误上下文（变量值、函数调用）
3. 判断错误类型：
   - 空值/未定义访问
   - 类型不匹配
   - 异步处理错误
   - 生命周期问题
   - API 响应异常
   - 配置错误
```

### 步骤 4：提供修复方案
```
1. 给出简洁的修复代码示例
2. 说明修改位置和原因
3. 如有多种方案，给出推荐方案
```

## 输出格式

**必须简洁直接**，按以下结构输出：

```markdown
## 🔍 问题定位

**错误类型**: [具体错误类型]
**出错位置**: `文件路径:行号`
**根因**: [一句话说明原因]

## 🛠️ 修复方案

```[代码语言]
// 修改前（问题代码）
[原始代码片段]

// 修改后（修复后）
[修复后的代码]
```

## 💡 说明

[简要说明修改原因和注意事项]
```

## 技术栈特定处理

### Nuxt 4 + Vue 3

**常见错误模式**：

1. **SSR Hydration Mismatch**
   ```
   [Vue warn]: Hydration completed but contains mismatches.
   ```
   - 修复：使用 `<ClientOnly>` 包裹客户端专用组件
   - 或使用 `v-if="mounted"` 延迟渲染

2. **window/document is not defined**
   ```
   window is not defined
   ```
   - 修复：使用 `if (import.meta.client)` 判断

3. **Cannot read property of undefined**
   ```
   Cannot read properties of undefined (reading 'xxx')
   ```
   - 修复：使用可选链 `?.` 或判空处理

### Spring Boot

**常见错误模式**：

1. **Bean 注入失败**
   ```
   Field xxx required a bean of type 'xxx' that could not be found.
   ```
   - 修复：添加 `@Service`/`@Component` 注解，或检查包扫描路径

2. **SQL 异常**
   ```
   BadSqlGrammarException / MyBatisSystemException
   ```
   - 修复：检查 SQL 语法、表名、字段名、参数绑定

3. **NullPointerException**
   ```
   java.lang.NullPointerException
   ```
   - 修复：添加空值检查，使用 Optional

### UniApp

**常见错误模式**：

1. **平台兼容性问题**
   ```
   thirdScriptError
   xxx is not a function
   ```
   - 修复：使用条件编译 `#ifdef` 或官方封装 API

2. **页面生命周期错误**
   ```
   onLoad is not defined
   ```
   - 修复：正确使用生命周期函数，注意 Vue3 组合式 API

## 示例

### 示例 1：Vue 组件空值错误

**输入**：
```
TypeError: Cannot read properties of undefined (reading 'name')
    at setup (UserProfile.vue:25)
    at _sfc_main.setup (UserProfile.vue:42)
```

**输出**：

## 🔍 问题定位

**错误类型**: TypeError - 空值访问
**出错位置**: `app/components/UserProfile.vue:25`
**根因**: `user` 对象为 undefined，直接访问 `user.name` 导致报错

## 🛠️ 修复方案

```vue
<!-- 修改前 -->
<template>
  <div>{{ user.name }}</div>
</template>

<script setup>
const user = ref()
// user 未初始化，默认为 undefined
</script>

<!-- 修改后 -->
<template>
  <div>{{ user?.name ?? '加载中...' }}</div>
</template>

<script setup>
const user = ref()
// 或者添加默认值
const user = ref({ name: '' })
</script>
```

## 💡 说明

使用可选链 `?.` 避免空值访问报错，提供默认值提升用户体验。

---

### 示例 2：Spring Boot Bean 注入失败

**输入**：
```
Field userService in UserController required a bean of type 'com.example.service.UserService' that could not be found.
```

**输出**：

## 🔍 问题定位

**错误类型**: Bean 注入失败
**出错位置**: `UserController.java`
**根因**: UserService 类缺少 `@Service` 注解，或未被 Spring 扫描到

## 🛠️ 修复方案

```java
// 修复方案：添加 @Service 注解
@Service  // 添加此行
public class UserService {
    // ...
}
```

或者检查包扫描路径：
```java
@SpringBootApplication
@MapperScan("com.example.mapper")
@ComponentScan("com.example")  // 确保包含 service 包
public class Application {
    // ...
}
```

## 💡 说明

Spring 需要显式注解才能识别和注入 Bean。确保：
1. 类上有 `@Service`/`@Component` 注解
2. 包路径在 `@ComponentScan` 范围内

## 注意事项

1. **优先看项目代码**：错误堆栈中从顶部开始找第一个非 node_modules/库代码的位置
2. **上下文很重要**：如无法确定原因，询问用户相关代码片段
3. **简洁为王**：不要长篇大论，直接给出定位和修复方案
4. **预防建议**：如有必要，简要说明如何避免类似错误
