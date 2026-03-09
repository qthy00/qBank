# /update-status - 智能更新项目状态

作为项目状态更新助手，智能更新项目管理文档。支持自动创建缺失文档、联动更新三个文档。

---

## 第一步：智能检测文档状态

### 1.1 检查三个核心文档

检查 `docs/` 目录下是否存在以下三个文件：
- `docs/项目状态.md`
- `docs/待办清单.md`
- `docs/需求文档.md`

### 1.2 自动创建缺失文档

**如果 `docs/项目状态.md` 不存在**：
1. 读取模板 `.claude/templates/项目状态模板.md` 
2. 扫描业务模块抹去初始数据（参考 /init-docs 的扫描逻辑）
3. 创建 `docs/项目状态.md`
4. 输出提示：`已自动创建 docs/项目状态.md`

**如果 `docs/待办清单.md` 不存在**：
1. 读取模板 `.claude/templates/待办清单模板.md`
2. 扫描代码中的 TODO/FIXME 作为初始待办
3. 创建 `docs/待办清单.md`
4. 输出提示：`已自动创建 docs/待办清单.md`

**如果 `docs/需求文档.md` 不存在**：
1. 读取模板 `.claude/templates/需求文档模板.md`
2. 从pom.xml中提取技术栈信息
3. 创建 `docs/需求文档.md`
4. 输出提示：`已自动创建 docs/需求文档.md`

---

## 第二步：分析最新状态

### 2.1 读取现有文档
- 读取 `docs/项目状态.md` 的当前内容
- 记录“已完成”、“进行中”、“待办”各区域的任务

### 2.2 分析Git提交（过滤非开发提交）

```bash
# 获取最近 10条提交，包含 author/committer/message 信息
git log -10 --format="%H|%an|%cn|%s" --no-merges
```

**过滤规则** （以下提交不作为“最近在做什么”的判断依据）：

| 过滤条件               | 识别方式                                            | 分类              |
|:-------------------|:------------------------------------------------|:----------------|
| Cherry-pick 提交     | commit message 包含 `cherry picked from`          | 同步提交            |
| 上游同步提交             | commit message 以 `sync:` 或 `upstream:` 开头       | 同步提交            |
| Author ≠ Committer | author 和 committer 名字不同                         | 可能是 cherry-pick |
| 文档/配置提交            | commit message 以 `docs:` `chore:` `style:`   开头 | 非功能提交           |


**输出**：只展示过滤后的真实开发提交
