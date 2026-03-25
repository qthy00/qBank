---
name: team-builder
description: 交互式代理选择器，用于组合和调度并行代理团队
origin: community
---

# 团队构建器

用于浏览和按需组合代理团队的交互式菜单。支持平面结构或按域分类的代理集合。

## 何时使用

- 你有多个代理配置文件（markdown 文件），想要选择用于特定任务的代理
- 你想从不同域组合临时团队（例如：安全 + SEO + 架构）
- 你想在决定之前浏览可用的代理

## 前置条件

代理文件必须是包含角色提示词（身份、规则、工作流、交付物）的 markdown 文件。第一个 `# 标题` 用作代理名称，第一段作为描述。

支持平面结构和子目录结构两种布局：

**子目录结构** — 域从文件夹名推断：

```
agents/
├── engineering/
│   ├── security-engineer.md
│   └── software-architect.md
├── marketing/
│   └── seo-specialist.md
└── sales/
    └── discovery-coach.md
```

**平面结构** — 域从共享的文件名前缀推断。前缀只有在2个或更多文件共享时才被视为域。具有唯一前缀的文件归入"通用"类别。注意：算法在第一个 `-` 处分割，因此多词域（例如 `product-management`）应该使用子目录布局：

```
agents/
├── engineering-security-engineer.md
├── engineering-software-architect.md
├── marketing-seo-specialist.md
├── marketing-content-strategist.md
├── sales-discovery-coach.md
└── sales-outbound-strategist.md
```

## 配置

代理目录按顺序探测，结果合并：

1. `./agents/**/*.md` + `./agents/*.md` — 项目本地代理（两种深度）
2. `~/.claude/agents/**/*.md` + `~/.claude/agents/*.md` — 全局代理（两种深度）

所有位置的结果合并并按代理名称去重。项目本地代理优先于同名的全局代理。如果用户指定，可以使用自定义路径。

## 工作原理

### 步骤 1：发现可用代理

使用上述探测顺序遍历代理目录。排除 README 文件。对于每个找到的文件：
- **子目录布局：** 从父文件夹名提取域
- **平面布局：** 收集所有文件名前缀（第一个 `-` 之前的文本）。前缀只有在2个或更多文件名中出现时才被视为域（例如，`engineering-security-engineer.md` 和 `engineering-software-architect.md` 都以 `engineering` 开头 → Engineering 域）。具有唯一前缀的文件（例如，`code-reviewer.md`、`tdd-guide.md`）归入"通用"类别
- 从第一个 `# 标题` 提取代理名称。如果没有找到标题，从文件名派生（去掉 `.md`，连字符替换为空格，首字母大写）
- 从标题后的第一段提取单行摘要

如果在探测所有位置后没有找到代理文件，告知用户："未找到代理文件。已检查：[探测的路径列表]。期望：上述目录中的 markdown 文件。"然后停止。

### 步骤 2：展示域菜单

```
可用代理域：
1. Engineering — 软件架构师、安全工程师
2. Marketing — SEO 专家
3. Sales — 发现教练、外联策略师

选择域或指定特定代理（例如："1,3" 或 "security + seo"）：
```

- 跳过代理数为零的域（空目录）
- 显示每个域的代理数量

### 步骤 3：处理选择

接受灵活的输入：
- 数字："1,3" 选择 Engineering 和 Sales 的所有代理
- 名称："security + seo" 对已发现的代理进行模糊匹配
- "all from engineering" 选择该域中的所有代理

如果选择了超过5个代理，按字母顺序列出并要求用户缩小范围："你选择了 N 个代理（最多5个）。选择要保留的，或说 'first 5' 使用字母顺序的前五个。"

确认选择：
```
已选择：安全工程师 + SEO 专家
他们应该处理什么任务？（描述任务）：
```

### 步骤 4：并行生成代理

1. 读取每个选定代理的 markdown 文件
2. 如果尚未提供，提示输入任务描述
3. 使用 Agent 工具并行生成所有代理：
   - `subagent_type: "general-purpose"`
   - `prompt: "{代理文件内容}\n\n任务：{任务描述}"`
   - 每个代理独立运行 — 不需要代理间通信
4. 如果代理失败（错误、超时或空输出），在行内记录失败（例如："安全工程师：失败 — [原因]"）并继续处理成功的代理的结果

### 步骤 5：综合结果

收集所有输出并展示统一报告：
- 按代理分组的结果
- 综合部分突出显示：
  - 代理间的一致性
  - 建议之间的冲突或张力
  - 推荐的后续步骤

如果只选择了1个代理，跳过综合并直接展示输出。

## 规则

- **仅动态发现。** 永远不要硬编码代理列表。目录中的新文件会自动出现在菜单中。
- **每队最多5个代理。** 超过5个会产生收益递减和过度的 token 消耗。在选择时强制执行。
- **并行调度。** 所有代理同时运行 — 使用 Agent 工具的并行调用模式。
- **并行 Agent 调用，不是 TeamCreate。** 此技能使用并行 Agent 工具调用进行独立工作。TeamCreate（用于多代理对话的 Claude Code 工具）仅在代理必须辩论或相互回应时才需要。

## 示例

```
User: team builder

Claude:
可用代理域：
1. Engineering (2) — 软件架构师、安全工程师
2. Marketing (1) — SEO 专家
3. Sales (4) — 发现教练、外联策略师、提案策略师、销售工程师
4. Support (1) — 执行摘要

选择域或指定特定代理：

User: security + seo

Claude:
已选择：安全工程师 + SEO 专家
他们应该处理什么任务？

User: 在上线前审查我的 Next.js 电商网站

[两个代理并行生成，各自应用其专业领域到代码库]

Claude:
## 安全工程师发现
- [发现...]

## SEO 专家发现
- [发现...]

## 综合
两个代理在以下方面达成一致：[...]
张力：安全推荐阻止内联样式的 CSP，SEO 需要内联 schema 标记。解决方案：[...]
后续步骤：[...]
```
