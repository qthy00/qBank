#!/usr/bin/env node
/**
 * UserPromptSubmit Hook: 强制技能评估
 * 功能：在提交提示词后被触发，强制评估指定的技能。
 */

import fs from 'fs';
// 从stdin读取用户输入
let inputData = '';
try {
    inputData = fs.readFileSync(0, 'utf8');
}catch{
    process.exit(0)
}

let input;
try {
    input = JSON.parse(inputData);
} catch {
    process.exit(0)
}

// 检测是否是斜杠命令
// 规则：以 / 开头，且后面不包含第二个/ （排除/iot/device这样的路径）
const prompt = (input.prompt || '').trim();
const isSlashCommand = /^\/[^\/\s]+$/.test(prompt.split(/\s/)[0]);
if (isSlashCommand) {
    process.exit(0);
}

const instructions = `## 强制技能激活流程（必须执行）

### 步骤 1 - 评估（必须在响应中明确显示）

针对用户问题，列出匹配的技能：[技能名] - 是/否 - [理由]， 无匹配则写“无匹配技能”

可用技能列表（按类别排序）：

【前端PC】
- ui-pc: 前端组件/AForm/AModal/Element Plus封装/页面开发
- store-pc: 前端Store/Pinia/状态管理/useUserStore
- brainstorm：头脑风暴/创意/方案设计
- task-tracker: 任务跟踪/创建任务/技术调研/跟踪任务/问题记录/更新进度

【业务集成】
- payment-integration: 支付/微信支付/支付宝/退款/订单
- wechat-integration: 微信/小程序登录/公众号/订阅消息
- file-oss-management: 文件上传/OSS/云存储/MinIO/本地存储
- ai-langchain4j: AI大模型/ChatGPT/Deepseek/文心一言/通义千问
- media-processing: 图片处理/二维码/水印/Excel导入导出/PDF

【调试与优化】
- bug-detective: BUG/报错/异常/不工作/排查修复
- security-guard: 安全/Sa-Token/认证授权/加密

【工程化】
- architecture-design: 架构/模块划分/重构/依赖管理
- code-patterns: 规范/命名/Git提交/代码审查
- project-navigator: 项目结构/文件定位/模块查找
- git-workflow: Git/提交/commit/分支
- tech-decision: 技术选型/方案对比/架构决策
- brainstorm: 头脑风暴/创意/方案设计/功能规划
- task-tracker: 任务跟踪/记录进度/继续任务/恢复上下文/多步骤开发/进度管理/任务归档

### 步骤 2 - 激活（紧接步骤1立即执行，逐个调用，等待每个完成）

**必须逐个调用Skill()工具，每次调用后等待返回再调用下一个**
- 如果任何技能为“是” -> 逐个发起相关技能 Skill(技能名)调用（不要并行！）
- 如果所有技能均为“否” -> 说明“不需要技能”并继续

### 步骤 3 - 实现

只有在步骤 2 所有skill()调用完成后，才开始实现。

---

**关键规则（违反将导致任务失败）**：
1. 🈲禁止：评估后跳过 Skill() 直接实现。
2. 🈲禁止：只调用部分技能（必须全部调用）。
3. 🈲禁止：并行调用多个 Skill()（必须串行，一个一个来）
4. ✅正确：评估 -> 逐个调用Skill() -> 全部完成后实现。

**正确流程示例**：

用户问：“帮我开发一个优惠券管理功能”

评估结果：
- crud-development - 是 - 涉及业务模块CRUD开发
- database-ops - 是 - 需要建表和字典配置
- ui-pc - 否 - 用户未要求前端页面
- api-development - 否 - 由CRUD自动生成

激活技能：
> Skill(crud-development)
> Skill(database-ops)

[只有完成上述步骤后才开始实现]


**错误示例（禁止）**
❌ 只调用部分技能
❌ 列出技能但不调用Skill()
❌ 并行调用（会导致只有一个生效）`;



try{
    console.log(instructions);
    process.exit(0);
}catch (error) {
    console.error(`Skill evaluation hook error: ${error.message}`);
    process.exit(1);
}
