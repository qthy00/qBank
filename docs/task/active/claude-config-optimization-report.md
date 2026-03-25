# .claude 配置优化报告

**生成时间**: 2026-03-25
**项目**: qBank (Nuxt 4 + Vue 3 + TypeScript + Element Plus)
**当前分支**: develop

---

## 执行摘要

经过全面审查，发现以下需要优化的问题：

| 类别 | 问题数量 | 优化类型 |
|------|----------|----------|
| Agents | 2 | 修改/精简 |
| Skills | 3 | 合并/修改 |
| Rules | 1 | 删除 |
| Commands | 0 | 无需变更 |

---

## 详细发现

### 1. Agents 问题

#### 1.1 `frontend-developer` - 不适配 ⚠️

**问题描述**:
- 该 agent 是为"青田好游科技"的 ui-admin/ui-admin-vben 项目定制的
- 描述的是传统 SPA 项目结构（src/views/），而非 qBank 的 Nuxt 4 项目结构
- 包含大量 ui-admin-vben 特定内容（Vben Admin、Monorepo 等）

**当前内容问题**:
```markdown
技术栈表格包含 ui-admin 和 ui-admin-vben 对比 - 与 qBank 无关
项目结构描述的是 src/views/ 而非 app/pages/
常用命令是 pnpm dev:ele 等 qBank 没有的命令
```

**建议操作**:
- 🔴 **删除** 或 🟡 **重写给 qBank 专用版本**
- 如果保留，需要完全重写为 Nuxt 4 + app/ 目录结构

#### 1.2 `security-reviewer` - 包含后端内容 ⚠️

**问题描述**:
- Agent 描述中包含 MyBatis Plus、多租户数据隔离等 Java 后端内容
- qBank 是纯前端项目，不应包含后端安全检查

**当前描述**:
```markdown
description: 安全漏洞检测与修复专家。在编写处理用户输入、身份验证、
API端点、敏感数据或MyBatis Plus查询的代码后主动使用。标记密钥、SSRF、
注入、不安全的加密以及OWASP Top 10漏洞。特别关注多租户数据隔离安全。
```

**问题内容**:
- 第20-43行：MyBatis Plus SQL注入检查（Java后端）
- 第38-42行：Flowable工作流安全（Java后端）

**建议操作**:
- 🟡 **修改** - 移除所有 Java/MyBatis Plus 相关内容
- 保留前端安全相关内容（XSS、CSRF、Token管理等）

---

### 2. Skills 问题

#### 2.1 `code-review` skill vs `code-reviewer` agent - 功能重复 ⚠️

**问题描述**:
- `skills/code-review/SKILL.md` 和 `agents/code-reviewer.md` 功能高度重复
- 两者都提供代码审查功能，但 agent 版本更详细且专门为 qBank 定制

**code-review skill 内容**:
```markdown
审查维度：TypeScript规范、Vue 3组合式API、Nuxt.js规范、HTTP/API规范等
```

**code-reviewer agent 内容**:
```markdown
相同维度 + qBank特定规范（useHttp、UnoCSS、Element Plus等）
```

**建议操作**:
- 🔴 **删除** `skills/code-review/` 目录
- 保留 `agents/code-reviewer.md`（更详细且定制化）

#### 2.2 `coding-standards` skill - 包含不适配内容 ⚠️

**问题描述**:
- 技能包含大量 React/Next.js 特定内容
- qBank 使用 Vue 3 + Nuxt，不是 React

**问题内容**:
- 第155-236行：React Best Practices（与 Vue 3 项目无关）
- 第317-335行：Next.js App Router 项目结构（与 Nuxt 4 无关）
- 第398-424行：React.memo / useMemo 等 React 特定性能优化

**建议操作**:
- 🟡 **修改** - 移除 React/Next.js 内容
- 添加 Vue 3 + Nuxt 4 特定最佳实践
- 或 🔴 **删除**，因为 `rules/typescript/coding-style.md` 已覆盖此内容

#### 2.3 `security-guard` skill - ✅ 已适配

**评价**:
- 该技能已专门为 qBank 项目定制
- 使用 Nuxt 4 的 useCookie、defineNuxtRouteMiddleware 等
- 内容准确且实用

**建议操作**:
- ✅ **保留**，无需修改

---

### 3. Rules 问题

#### 3.1 `rules/java/` 目录 - 完全不适配 🔴

**问题描述**:
- qBank 是纯前端项目，使用 TypeScript/JavaScript
- Java 规则对该项目完全无用

**包含文件**:
- `rules/java/coding-style.md`
- `rules/java/testing.md`
- `rules/java/patterns.md`
- `rules/java/hooks.md`
- `rules/java/security.md`

**建议操作**:
- 🔴 **删除整个 `rules/java/` 目录**

---

### 4. Commands 检查

经过检查，`commands/` 目录下的命令配置：
- 大部分是通用命令（plan、code-review、tdd 等）
- 没有发现明显重复或不适配的内容
- ✅ **无需变更**

---

## 优化执行清单

### 高优先级（建议立即执行）

- [ ] 1. 删除 `rules/java/` 整个目录
- [ ] 2. 删除 `skills/code-review/` 目录（与 agent 重复）
- [ ] 3. 修改 `agents/security-reviewer.md` - 移除 Java/MyBatis Plus 内容

### 中优先级（建议近期执行）

- [ ] 4. 修改/删除 `agents/frontend-developer.md` - 重写给 qBank
- [ ] 5. 修改/删除 `skills/coding-standards/` - 移除 React 内容

### 低优先级（可选）

- [ ] 6. 审查其他 skills 是否有重复功能
- [ ] 7. 创建 qBank 专用的前端开发 agent

---

## 优化收益

| 优化项 | 收益 |
|--------|------|
| 删除 Java 规则 | 减少约 30% 不必要的配置 |
| 合并重复的 code-review | 消除维护负担，避免功能分歧 |
| 精简 security-reviewer | 聚焦前端安全，提高审查效率 |
| 重写 frontend-developer | 提供准确的项目指导 |

---

## 附录：详细文件列表

### Agents (10个)
| 文件 | 状态 | 操作 |
|------|------|------|
| typescript-reviewer.md | ✅ 适用 | 保留 |
| code-reviewer.md | ✅ 适用 | 保留 |
| security-reviewer.md | ⚠️ 需修改 | 移除Java内容 |
| docs-lookup.md | ✅ 适用 | 保留 |
| architect.md | ✅ 适用 | 保留 |
| refactor-cleaner.md | ✅ 适用 | 保留 |
| doc-updater.md | ✅ 适用 | 保留 |
| project-manager.md | ✅ 适用 | 保留 |
| tdd-guide.md | ✅ 适用 | 保留 |
| planner.md | ✅ 适用 | 保留 |
| frontend-developer.md | ❌ 不适配 | 重写/删除 |

### Skills (31个)
| 技能 | 状态 | 操作 |
|------|------|------|
| security-guard | ✅ 已适配 | 保留 |
| ui-pc | ✅ 适用 | 保留 |
| store-pc | ✅ 适用 | 保留 |
| api-docs | ✅ 适用 | 保留 |
| mock-data | ✅ 适用 | 保留 |
| nuxt4-patterns | ✅ 适用 | 保留 |
| code-review | ❌ 重复 | 删除 |
| coding-standards | ⚠️ 需修改 | 移除React内容 |
| 其他23个 | ✅ 适用 | 保留 |

### Rules
| 目录 | 状态 | 操作 |
|------|------|------|
| common/ | ✅ 适用 | 保留 |
| typescript/ | ✅ 适用 | 保留 |
| java/ | ❌ 不适用 | 删除 |

---

**报告生成完成** - 建议按优先级顺序执行优化操作
