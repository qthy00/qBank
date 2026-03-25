---
name: prompt-optimizer
description: >-
  分析原始提示词，识别意图和缺陷，匹配 ECC 组件
  （技能/命令/代理/钩子），并输出可直接粘贴使用的优化后
  提示词。仅提供咨询建议 —— 绝不亲自执行任务。
  触发条件：用户说"优化prompt"、"改进我的prompt"、
  "怎么写prompt"、"帮我优化这个指令"。
  不触发条件：用户想直接执行任务，或说
  "直接做"。不触发条件：用户说"优化代码"、
  "优化性能" —— 那些是重构/性能任务，不是提示词优化。
origin: community
metadata:
  author: YannJY02
  version: "1.0.0"
---

# 提示词优化器

分析草稿提示词，对其进行评估，匹配到 ECC 生态系统组件，
并输出一个完整的优化后提示词，用户可以直接粘贴并运行。

## 何时使用

- 用户说"优化这个prompt"、"改进我的prompt"、"重写这个prompt"
- 用户说"帮我写个更好的prompt用于..."
- 用户说"怎么问 Claude Code 才能..."
- 用户说"优化prompt"、"改进prompt"、"怎么写prompt"、"帮我优化这个指令"
- 用户粘贴草稿提示词并征求反馈或改进建议
- 用户说"我不知道怎么写这个prompt"
- 用户说"我应该怎么使用 ECC 来..."
- 用户明确调用`/prompt-optimize`

### 何时不使用

- 用户想要直接完成任务（直接执行它）
- 用户说"优化代码"、"优化性能"、"optimize this code"、"optimize performance" —— 这些是重构任务，不是提示词优化
- 用户询问 ECC 配置（改用`configure-ecc`）
- 用户想要技能清单（改用`skill-stocktake`）
- 用户说"直接做"或"just do it"

## 工作原理

**仅提供咨询建议 —— 不要执行用户的任务。**

不要编写代码、创建文件、运行命令或采取任何实现
操作。您唯一的输出是分析加上优化后的提示词。

如果用户说"直接做"、"just do it"或"不要优化，直接执行"，
不要在这个技能内切换到实现模式。告诉用户这个
技能只产生优化后的提示词，并指示他们提出正常的
任务请求如果他们想要执行而不是提示词优化。

按顺序运行这 6 阶段流程。使用下面的输出格式呈现结果。

### 分析流程

### 阶段 0：项目检测

在分析提示词之前，检测当前项目上下文：

1. 检查工作目录中是否存在`CLAUDE.md` —— 读取它以了解项目约定
2. 从项目文件检测技术栈：
   - `package.json` → Node.js / TypeScript / React / Next.js
   - `go.mod` → Go
   - `pyproject.toml` / `requirements.txt` → Python
   - `Cargo.toml` → Rust
   - `build.gradle` / `pom.xml` → Java / Kotlin / Spring Boot
   - `Package.swift` → Swift
   - `Gemfile` → Ruby
   - `composer.json` → PHP
   - `*.csproj` / `*.sln` → .NET
   - `Makefile` / `CMakeLists.txt` → C / C++
   - `cpanfile` / `Makefile.PL` → Perl
3. 记录检测到的技术栈，用于阶段 3 和阶段 4

如果没有找到项目文件（例如，提示词是抽象的或用于新项目），
跳过检测并在阶段 4 中标记"技术栈未知"。

### 阶段 1：意图检测

将用户的任务分类为一个或多个类别：

| 类别 | 信号词 | 示例 |
|----------|-------------|---------|
| 新功能 | build, create, add, implement, 创建, 实现, 添加 | "Build a login page" |
| Bug 修复 | fix, broken, not working, error, 修复, 报错 | "Fix the auth flow" |
| 重构 | refactor, clean up, restructure, 重构, 整理 | "Refactor the API layer" |
| 研究 | how to, what is, explore, investigate, 怎么, 如何 | "How to add SSO" |
| 测试 | test, coverage, verify, 测试, 覆盖率 | "Add tests for the cart" |
| 审查 | review, audit, check, 审查, 检查 | "Review my PR" |
| 文档 | document, update docs, 文档 | "Update the API docs" |
| 基础设施 | deploy, CI, docker, database, 部署, 数据库 | "Set up CI/CD pipeline" |
| 设计 | design, architecture, plan, 设计, 架构 | "Design the data model" |

### 阶段 2：范围评估

如果阶段 0 检测到项目，使用代码库大小作为信号。否则，仅从
提示词描述中进行估计，并将估计标记为不确定。

| 范围 | 启发式 | 编排 |
|-------|-----------|---------------|
| 简单 | 单个文件，< 50 行 | 直接执行 |
| 低 | 单个组件或模块 | 单个命令或技能 |
| 中 | 多个组件，同一领域 | 命令链 + /verify |
| 高 | 跨领域，5+ 文件 | 先用 /plan，然后分阶段执行 |
| 史诗 | 多会话，多 PR，架构转变 | 使用蓝图技能进行多会话规划 |

### 阶段 3：ECC 组件匹配

将意图 + 范围 + 技术栈（来自阶段 0）映射到特定的 ECC 组件。

#### 按意图类型

| 意图 | 命令 | 技能 | 代理 |
|--------|----------|--------|--------|
| 新功能 | /plan, /tdd, /code-review, /verify | tdd-workflow, verification-loop | planner, tdd-guide, code-reviewer |
| Bug 修复 | /tdd, /build-fix, /verify | tdd-workflow | tdd-guide, build-error-resolver |
| 重构 | /refactor-clean, /code-review, /verify | verification-loop | refactor-cleaner, code-reviewer |
| 研究 | /plan | search-first, iterative-retrieval | — |
| 测试 | /tdd, /e2e, /test-coverage | tdd-workflow, e2e-testing | tdd-guide, e2e-runner |
| 审查 | /code-review | security-review | code-reviewer, security-reviewer |
| 文档 | /update-docs, /update-codemaps | — | doc-updater |
| 基础设施 | /plan, /verify | docker-patterns, deployment-patterns, database-migrations | architect |
| 设计（中-高） | /plan | — | planner, architect |
| 设计（史诗） | — | blueprint（作为技能调用） | planner, architect |

#### 按技术栈

| 技术栈 | 要添加的技能 | 代理 |
|------------|--------------|-------|
| Python / Django | django-patterns, django-tdd, django-security, django-verification, python-patterns, python-testing | python-reviewer |
| Go | golang-patterns, golang-testing | go-reviewer, go-build-resolver |
| Spring Boot / Java | springboot-patterns, springboot-tdd, springboot-security, springboot-verification, java-coding-standards, jpa-patterns | code-reviewer |
| Kotlin / Android | kotlin-coroutines-flows, compose-multiplatform-patterns, android-clean-architecture | kotlin-reviewer |
| TypeScript / React | frontend-patterns, backend-patterns, coding-standards | code-reviewer |
| Swift / iOS | swiftui-patterns, swift-concurrency-6-2, swift-actor-persistence, swift-protocol-di-testing | code-reviewer |
| PostgreSQL | postgres-patterns, database-migrations | database-reviewer |
| Perl | perl-patterns, perl-testing, perl-security | code-reviewer |
| C++ | cpp-coding-standards, cpp-testing | code-reviewer |
| 其他 / 未列出 | coding-standards（通用） | code-reviewer |

### 阶段 4：缺失上下文检测

扫描提示词中缺失的关键信息。检查每个项目并标记
是阶段 0 自动检测到的还是用户必须提供的：

- [ ] **技术栈** — 在阶段 0 中检测到，还是用户必须指定？
- [ ] **目标范围** — 提到的文件、目录或模块？
- [ ] **验收标准** — 如何知道任务已完成？
- [ ] **错误处理** — 是否解决了边缘情况和故障模式？
- [ ] **安全要求** — 认证、输入验证、密钥？
- [ ] **测试期望** — 单元、集成、E2E？
- [ ] **性能约束** — 负载、延迟、资源限制？
- [ ] **UI/UX 要求** — 设计规范、响应式、无障碍？（如果是前端）
- [ ] **数据库更改** — 模式、迁移、索引？（如果是数据层）
- [ ] **现有模式** — 要遵循的参考文件或约定？
- [ ] **范围边界** — 不做什么？

**如果缺失 3+ 关键项目**，在生成优化后的提示词前向用户提出最多 3 个澄清
问题。然后将答案纳入优化后的提示词。

### 阶段 5：工作流程与模型推荐

确定此提示词在开发生命周期中的位置：

```
研究 → 规划 → 实现（TDD）→ 审查 → 验证 → 提交
```

对于中+ 任务，始终从 /plan 开始。对于史诗任务，使用蓝图技能。

**模型推荐**（在输出中包含）：

| 范围 | 推荐模型 | 理由 |
|-------|------------------|-----------|
| 简单-低 | Sonnet 4.6 | 快速、简单任务的成本效益高 |
| 中 | Sonnet 4.6 | 标准工作的最佳编码模型 |
| 高 | Sonnet 4.6（主要）+ Opus 4.6（规划） | Opus 用于架构，Sonnet 用于实现 |
| 史诗 | Opus 4.6（蓝图）+ Sonnet 4.6（执行） | 深度推理用于多会话规划 |

**多提示词拆分**（对于高/史诗范围）：

对于超过单会话的任务，拆分为顺序提示词：
- 提示词 1：研究 + 规划（使用 search-first 技能，然后 /plan）
- 提示词 2-N：每个提示词实现一个阶段（每个以 /verify 结束）
- 最终提示词：集成测试 + 所有阶段的 /code-review
- 使用 /save-session 和 /resume-session 在会话间保留上下文

---

## 输出格式

使用这个确切结构呈现您的分析。用与用户输入相同的语言
回复。

### 第 1 部分：提示词诊断

**优势：** 列出原始提示词做得好的地方。

**问题：**

| 问题 | 影响 | 建议修复 |
|-------|--------|---------------|
| （问题） | （后果） | （如何修复） |

**需要澄清：** 用户应该回答的问题编号列表。
如果阶段 0 自动检测到答案，说明它而不是提问。

### 第 2 部分：推荐的 ECC 组件

| 类型 | 组件 | 用途 |
|------|-----------|---------|
| 命令 | /plan | 编码前规划架构 |
| 技能 | tdd-workflow | TDD 方法论指导 |
| 代理 | code-reviewer | 实现后审查 |
| 模型 | Sonnet 4.6 | 推荐用于此范围 |

### 第 3 部分：优化后的提示词 — 完整版

在单个 fenced 代码块内呈现完整的优化后提示词。
提示词必须是自包含的，可以直接复制粘贴。包括：
- 带有上下文的清晰任务描述
- 技术栈（检测到的或指定的）
- 在工作流程正确阶段的 /command 调用
- 验收标准
- 验证步骤
- 范围边界（不做什么）

对于引用蓝图的项目，写："Use the blueprint skill to..."
（不是`/blueprint`，因为蓝图是技能，不是命令）。

### 第 4 部分：优化后的提示词 — 快速版

供有经验的 ECC 用户使用的紧凑版本。按意图类型变化：

| 意图 | 快速模式 |
|--------|--------------|
| 新功能 | `/plan [feature]. /tdd to implement. /code-review. /verify.` |
| Bug 修复 | `/tdd — write failing test for [bug]. Fix to green. /verify.` |
| 重构 | `/refactor-clean [scope]. /code-review. /verify.` |
| 研究 | `Use search-first skill for [topic]. /plan based on findings.` |
| 测试 | `/tdd [module]. /e2e for critical flows. /test-coverage.` |
| 审查 | `/code-review. Then use security-reviewer agent.` |
| 文档 | `/update-docs. /update-codemaps.` |
| 史诗 | `Use blueprint skill for "[objective]". Execute phases with /verify gates.` |

### 第 5 部分：增强理由

| 增强 | 原因 |
|-------------|--------|
| （添加了什么） | （为什么重要） |

### 页脚

> 不是您需要的？告诉我需要调整什么，或者提出正常的任务请求
> 如果您想要执行而不是提示词优化。

---

## 示例

### 触发示例

- "为 ECC 优化这个提示词"
- "重写这个提示词，让 Claude Code 使用正确的命令"
- "帮我优化这个指令"
- "我应该怎么为 ECC 写这个任务的提示词？"

### 示例 1：模糊的中文提示词（检测到项目）

**用户输入：**
```
帮我写一个用户登录页面
```

**阶段 0 检测到：** `package.json` 包含 Next.js 15、TypeScript、Tailwind CSS

**优化后的提示词（完整版）：**
```
使用项目现有技术栈（Next.js 15 + TypeScript + Tailwind CSS）实现用户登录页面。

技术要求：
- 沿用项目现有的组件结构和路由约定
- 表单验证使用项目中已有的验证方案（检查是否已用 Zod/Yup/其他）
- 认证方式：沿用项目现有认证方案（如无，默认 JWT）
- 包含：邮箱/密码登录表单、表单验证、错误提示、加载状态、响应式布局

工作流程：
1. /plan 先规划组件结构和认证流程，参考现有页面的模式
2. /tdd 测试先行：编写登录表单的单元测试和认证流程的集成测试
3. 实现登录页面和认证逻辑
4. /code-review 审查实现
5. /verify 验证所有测试通过且页面正常渲染

安全要求：
- 密码不明文传输
- 防止暴力破解（rate limiting）
- XSS 防护
- CSRF token

验收标准：
- 所有测试通过，覆盖率 80%+
- 页面在移动端和桌面端正常渲染
- 登录成功跳转到 dashboard，失败显示错误信息

不要做：
- 不要实现注册页面
- 不要实现忘记密码功能
- 不要修改现有的路由结构
```

### 示例 2：中等英文提示词

**用户输入：**
```
Add a REST API endpoint for user profile updates with validation
```

**阶段 0 检测到：** `go.mod` 包含 Go 1.22、Chi router

**优化后的提示词（完整版）：**
```
Add a REST API endpoint for user profile updates (PATCH /api/users/:id).

Tech stack: Go 1.22 + Chi router (detected from project)

Requirements:
- PATCH /api/users/:id — partial update of user profile
- Input validation for fields: name, email, avatar_url, bio
- Auth: require valid token, users can only update own profile
- Return 200 with updated user on success
- Return 400 with validation errors on invalid input
- Return 401/403 for auth failures
- Follow existing API patterns in the codebase

Workflow:
1. /plan the endpoint structure, middleware chain, and validation logic
2. /tdd — write table-driven tests for success, validation failure, auth failure, not-found
3. Implement following existing handler patterns
4. /go-review
5. /verify — run full test suite, confirm no regressions

Do not:
- Modify existing endpoints
- Change the database schema (use existing user table)
- Add new dependencies without checking existing ones first (use search-first skill)
```

### 示例 3：史诗级项目

**用户输入：**
```
Migrate our monolith to microservices
```

**优化后的提示词（完整版）：**
```
Use the blueprint skill to plan: "Migrate monolith to microservices architecture"

Before executing, answer these questions in the blueprint:
1. Which domain boundaries exist in the current monolith?
2. Which service should be extracted first (lowest coupling)?
3. Communication pattern: REST APIs, gRPC, or event-driven (Kafka/RabbitMQ)?
4. Database strategy: shared DB initially or database-per-service from start?
5. Deployment target: Kubernetes, Docker Compose, or serverless?

The blueprint should produce phases like:
- Phase 1: Identify service boundaries and create domain map
- Phase 2: Set up infrastructure (API gateway, service mesh, CI/CD per service)
- Phase 3: Extract first service (strangler fig pattern)
- Phase 4: Verify with integration tests, then extract next service
- Phase N: Decommission monolith

Each phase = 1 PR, with /verify gates between phases.
Use /save-session between phases. Use /resume-session to continue.
Use git worktrees for parallel service extraction when dependencies allow.

Recommended: Opus 4.6 for blueprint planning, Sonnet 4.6 for phase execution.
```

---

## 相关组件

| 组件 | 何时引用 |
|-----------|------------------|
| `configure-ecc` | 用户尚未设置 ECC |
| `skill-stocktake` | 审计安装了哪些组件（使用而不是硬编码目录） |
| `search-first` | 优化提示词中的研究阶段 |
| `blueprint` | 史诗级范围的优化提示词（作为技能调用，不是命令） |
| `strategic-compact` | 长会话上下文管理 |
| `cost-aware-llm-pipeline` | Token 优化建议 |
