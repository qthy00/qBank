---
name: security-scan
description: 使用 AgentShield 扫描你的 Claude Code 配置（.claude/ 目录）以查找安全漏洞、配置错误和注入风险。检查 CLAUDE.md、settings.json、MCP 服务器、钩子和代理定义

---

# 安全扫描技能

使用 [AgentShield](https://github.com/affaan-m/agentshield) 审计你的 Claude Code 配置中的安全问题。

## 何时激活

- 设置新的 Claude Code 项目
- 修改 `.claude/settings.json`、`CLAUDE.md` 或 MCP 配置后
- 提交配置更改之前
- 在 onboarding 到有现有 Claude Code 配置的新仓库时
- 定期安全卫生检查

## 扫描内容

| 文件 | 检查项 |
|------|--------|
| `CLAUDE.md` | 硬编码密钥、自动运行指令、提示注入模式 |
| `settings.json` | 过度宽松的允许列表、缺少的拒绝列表、危险的绕过标志 |
| `mcp.json` | 有风险的 MCP 服务器、硬编码环境密钥、npx 供应链风险 |
| `hooks/` | 通过插值的命令注入、数据外泄、静默错误抑制 |
| `agents/*.md` | 无限制的工具访问、提示注入面、缺少的模型规范 |

## 前置条件

必须安装 AgentShield。检查并安装：

```bash
# 检查是否已安装
npx ecc-agentshield --version

# 全局安装（推荐）
npm install -g ecc-agentshield

# 或通过 npx 直接运行（无需安装）
npx ecc-agentshield scan .
```

## 用法

### 基本扫描

针对当前项目的 `.claude/` 目录运行：

```bash
# 扫描当前项目
npx ecc-agentshield scan

# 扫描特定路径
npx ecc-agentshield scan --path /path/to/.claude

# 带最低严重性过滤器的扫描
npx ecc-agentshield scan --min-severity medium
```

### 输出格式

```bash
# 终端输出（默认）— 带等级的彩色报告
npx ecc-agentshield scan

# JSON — 用于 CI/CD 集成
npx ecc-agentshield scan --format json

# Markdown — 用于文档
npx ecc-agentshield scan --format markdown

# HTML — 自包含深色主题报告
npx ecc-agentshield scan --format html > security-report.html
```

### 自动修复

自动应用安全修复（仅标记为可自动修复的）：

```bash
npx ecc-agentshield scan --fix
```

这将：
- 用环境变量引用替换硬编码密钥
- 将通配符权限收紧为限定替代
- 从不修改手动建议

### Opus 4.6 深度分析

运行对抗性三代理管道进行更深入分析：

```bash
# 需要 ANTHROPIC_API_KEY
export ANTHROPIC_API_KEY=your-key
npx ecc-agentshield scan --opus --stream
```

这运行：
1. **攻击者（红队）** — 寻找攻击向量
2. **防御者（蓝队）** — 推荐加固
3. **审计员（最终裁决）** — 综合两种视角

### 初始化安全配置

从零开始创建新的安全 `.claude/` 配置：

```bash
npx ecc-agentshield init
```

创建：
- 带限定权限和拒绝列表的 `settings.json`
- 带安全最佳实践的 `CLAUDE.md`
- `mcp.json` 占位符

### GitHub Action

添加到你的 CI 管道：

```yaml
- uses: affaan-m/agentshield@v1
  with:
    path: '.'
    min-severity: 'medium'
    fail-on-findings: true
```

## 严重等级

| 等级 | 分数 | 含义 |
|------|------|------|
| A | 90-100 | 安全配置 |
| B | 75-89 | 小问题 |
| C | 60-74 | 需要注意 |
| D | 40-59 | 重大风险 |
| F | 0-39 | 关键漏洞 |

## 结果解读

### 关键发现（立即修复）
- 配置文件中的硬编码 API 密钥或令牌
- 允许列表中的 `Bash(*)`（无限制的 shell 访问）
- 钩子中通过 `${file}` 插值的命令注入
- 运行 shell 的 MCP 服务器

### 高优先级发现（生产环境前修复）
- CLAUDE.md 中的自动运行指令（提示注入向量）
- 权限中缺少拒绝列表
- 具有不必要 Bash 访问权限的代理

### 中等优先级发现（推荐）
- 钩子中的静默错误抑制（`2>/dev/null`、`|| true`）
- 缺少 PreToolUse 安全钩子
- MCP 服务器配置中的 `npx -y` 自动安装

### 信息性发现（了解）
- MCP 服务器缺少描述
- 正确标记为良好实践的限制性指令

## 链接

- **GitHub**: [github.com/affaan-m/agentshield](https://github.com/affaan-m/agentshield)
- **npm**: [npmjs.com/package/ecc-agentshield](https://www.npmjs.com/package/ecc-agentshield)
