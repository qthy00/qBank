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

可用技能列表：
- crud-development: CRUD/业务模块/Entity/Service/DAO 开发
- api-development: API设计/RESTful/接口规范
- database-ops: 数据库/SQL/建表/字典/菜单
- backend- annotations：注解/@SerialMap/@RateLimiter
- utils-toolkit: 工具类/StringUtils/MapStructUtils
- ui-pc：前端组件/AForm/AModal/Element Plus封装
- ui-mobile：移动端/wd-/小程序/APP/WD UI
- ui-design-mobile：移动端设计/页面布局/间距/留白/简洁大气
- store-pc：前端Store/Pinia/状态管理/useUserStore
- store-mobile：移动端Store/useAuth/Composable
- uniapp-platform：条件编译/平台判断/ifdef
- payment-integration：支付/微信支付/支付宝/退款
- wechat-integration：微信/小程序登陆/订阅消息
- file-oss-management：文件上传/OSS/云存储/MinIO
- ai-langchain4j: AI/大模型/ChatGPT/Deepseek
- media-processing: 图片处理/二维码/水印/Excel
- bug-detective: BUG/报错/异常/不工作
- error-handler：异常处理/ServiceException
- performance-doctor：性能/慢查询/优化/缓存
- security-guard：安全/权限/加密/Sa-Token
- architecture-design：架构/模块划分/重构
- code-patterns：规范/禁止/命名/Git提交
- project-navigator：项目结构/文件在哪/定位
- git-workflow：Git/分支/提交/commit
- tech-decision：技术选型/方案对比
- brainstorm：头脑风暴/创意/方案设计

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
