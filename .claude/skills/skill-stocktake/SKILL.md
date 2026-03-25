---
description: "在审计 Claude 技能和命令质量时使用。支持快速扫描（仅更改的技能）和全面盘点模式，使用顺序子代理批量评估"

---

# skill-stocktake

斜杠命令（`/skill-stocktake`），使用质量检查清单 + AI 整体判断审计所有 Claude 技能和命令。支持两种模式：快速扫描用于最近更改的技能，全面盘点用于完整审查。

## 范围

该命令针对**调用目录相对**的以下路径：

| 路径 | 描述 |
|------|------|
| `~/.claude/skills/` | 全局技能（所有项目） |
| `{cwd}/.claude/skills/` | 项目级技能（如果目录存在） |

**在第 1 阶段开始时，命令明确列出找到了哪些路径并扫描。**

### 针对特定项目

要包含项目级技能，从项目根目录运行：

```bash
cd ~/path/to/my-project
/skill-stocktake
```

如果项目没有 `.claude/skills/` 目录，则仅评估全局技能和命令。

## 模式

| 模式 | 触发 | 持续时间 |
|------|------|---------|
| 快速扫描 | `results.json` 存在（默认） | 5–10 分钟 |
| 全面盘点 | `results.json` 不存在，或 `/skill-stocktake full` | 20–30 分钟 |

**结果缓存：** `~/.claude/skills/skill-stocktake/results.json`

## 快速扫描流程

仅重新评估自上次运行以来已更改的技能（5–10 分钟）。

1. 读取 `~/.claude/skills/skill-stocktake/results.json`
2. 运行：`bash ~/.claude/skills/skill-stocktake/scripts/quick-diff.sh \
         ~/.claude/skills/skill-stocktake/results.json`
   （项目目录从 `$PWD/.claude/skills` 自动检测；仅在需要时显式传递）
3. 如果输出是 `[]`：报告"自上次运行以来无变更"并停止
4. 使用相同的第 2 阶段标准仅重新评估那些更改的文件
5. 从先前结果中保留未更改的技能
6. 仅输出差异
7. 运行：`bash ~/.claude/skills/skill-stocktake/scripts/save-results.sh \
         ~/.claude/skills/skill-stocktake/results.json <<< "$EVAL_RESULTS"`

## 全面盘点流程

### 第 1 阶段 — 清单

运行：`bash ~/.claude/skills/skill-stocktake/scripts/scan.sh`

脚本枚举技能文件，提取 frontmatter，并收集 UTC 修改时间。
项目目录从 `$PWD/.claude/skills` 自动检测；仅在需要时显式传递。
呈现脚本输出的扫描摘要和清单表：

```
扫描：
  ✓ ~/.claude/skills/         (17 个文件)
  ✗ {cwd}/.claude/skills/    (未找到 — 仅全局技能)
```

| 技能 | 7 天使用 | 30 天使用 | 描述 |
|------|--------|---------|-------------|

### 第 2 阶段 — 质量评估

启动 Agent 工具子代理（**通用代理**），携带完整清单和检查清单：

```text
Agent(
  subagent_type="general-purpose",
  prompt="
根据检查清单评估以下技能清单。

[清单]

[检查清单]

返回每个技能的 JSON：
{ \"verdict\": \"保留\"|\"改进\"|\"更新\"|\"退役\"|\"合并到 [X]\", \"reason\": \"...\" }
"
)
```

子代理读取每个技能，应用检查清单，并返回每个技能的 JSON：

`{ "verdict": "保留"|"改进"|"更新"|"退役"|"合并到 [X]", "reason": "..." }`

**分块指导：** 每次子代理调用处理约 20 个技能以保持上下文可管理。在每次分块后保存中间结果到 `results.json`（`status: "in_progress"`）。

所有技能评估完成后：设置 `status: "completed"`，进入第 3 阶段。

**恢复检测：** 如果启动时发现 `status: "in_progress"`，从第一个未评估的技能恢复。

每个技能根据以下检查清单进行评估：

```
- [ ] 检查与其他技能的内容重叠
- [ ] 检查与 MEMORY.md / CLAUDE.md 的重叠
- [ ] 验证技术参考的新鲜度（如果存在工具名称 / CLI 标志 / API，使用 WebSearch）
- [ ] 考虑使用频率
```

裁决标准：

| 裁决 | 含义 |
|------|------|
| 保留 | 有用且当前 |
| 改进 | 值得保留，但需要具体改进 |
| 更新 | 引用的技术已过时（使用 WebSearch 验证） |
| 退役 | 低质量、过时或成本不对称 |
| 合并到 [X] | 与另一个技能实质性重叠；命名合并目标 |

评估是**整体 AI 判断** — 不是数字评分。指导维度：
- **可操作性**：可让你立即行动的代码示例、命令或步骤
- **范围契合**：名称、触发器和内容一致；不太宽泛或太窄
- **独特性**：价值无法被 MEMORY.md / CLAUDE.md / 另一个技能替代
- **时效性**：技术参考在当前环境中有效

**理由质量要求** — `reason` 字段必须是自包含的且能支持决策：
- 不要只写"未变更" — 始终重述核心证据
- 对于**退役**：说明 (1) 发现了什么具体缺陷，(2) 什么替代方案满足相同需求
  - 不好：`"已被取代"`
  - 好：`"已设置 disable-model-invocation: true；已被 continuous-learning-v2 取代，后者涵盖所有相同模式加上置信度评分。没有独特内容保留。"`
- 对于**合并**：命名目标并描述要集成的内容
  - 不好：`"与 X 重叠"`
  - 好：`"42 行薄内容；chatlog-to-article 的第 4 步已涵盖相同工作流。将该技能的'文章角度'提示作为注释集成。"`
- 对于**改进**：描述需要的具体变更（哪个部分、什么操作、目标大小）
  - 不好：`"太长"`
  - 好：`"276 行；'框架比较'部分（L80–140）与 ai-era-architecture-principles 重复；删除以达到约 150 行。"`
- 对于**保留**（快速扫描中仅修改时间变更）：重述原始裁决理由，不要写"未变更"
  - 不好：`"未变更"`
  - 好：`"修改时间已更新但内容未变更。显式导入 rules/python/ 的唯一 Python 参考；未发现重叠。"`

### 第 3 阶段 — 摘要表

| 技能 | 7 天使用 | 裁决 | 理由 |
|------|--------|---------|--------|

### 第 4 阶段 — 整合

1. **退役 / 合并**：在确认用户之前呈现每个文件的详细理由：
   - 发现了什么具体问题（重叠、过时参考、损坏参考等）
   - 什么替代方案涵盖相同功能（退役：哪个现有技能/规则；合并：目标文件和要集成的内容）
   - 移除的影响（任何依赖的技能、MEMORY.md 引用或受影响的工作流）
2. **改进**：呈现具体改进建议及理由：
   - 要变更什么以及为什么（例如，"从 430→200 行，因为 X/Y 部分与 python-patterns 重复"）
   - 用户决定是否行动
3. **更新**：呈现更新的内容及检查的来源
4. 检查 MEMORY.md 行数；如果 >100 行建议压缩

## 结果文件模式

`~/.claude/skills/skill-stocktake/results.json`：

**`evaluated_at`**：必须设置为评估完成的实际 UTC 时间。
通过 Bash 获取：`date -u +%Y-%m-%dT%H:%M:%SZ`。永远不要使用仅日期的近似值如 `T00:00:00Z`。

```json
{
  "evaluated_at": "2026-02-21T10:00:00Z",
  "mode": "full",
  "batch_progress": {
    "total": 80,
    "evaluated": 80,
    "status": "completed"
  },
  "skills": {
    "skill-name": {
      "path": "~/.claude/skills/skill-name/SKILL.md",
      "verdict": "保留",
      "reason": "对 X 工作流的具体、可操作、独特价值",
      "mtime": "2026-01-15T08:30:00Z"
    }
  }
}
```

## 注意

- 评估是盲评：无论来源（ECC、自编、自动提取），相同的检查清单适用于所有技能
- 归档/删除操作始终需要显式用户确认
- 不按技能来源的裁决分支
