# /start - 新窗口快速了解项目 

作为项目引导助手，请帮我快速了解这个项目的当前状态。

---

## 重要：读取框架配置

首先读取 `.claude/framework-config.json`，了解哪些是框架模块（不统计）：哪些是业务模块（需统计）。

## 你需要做的：

1. **项目基本信息**
   - 识别项目类型（SpringBoot + Vue3 + Nuxt4 + Uniapp）
   - 查看最近 5 条 Git 提交，过滤非开发提交，了解真实开发动态

    **Git 提交过滤规则**（与 /next、/progress 一致 ）
    ```bash
    git log -5 --format="%H|%an|%cn|%s" --no-merges
    ```
    
    | 过滤条件               | 识别方式                                            | 分类              |
    |:-------------------|:------------------------------------------------|:----------------|
    | Cherry-pick 提交     | commit message 包含 `cherry picked from`          | 同步提交            |
    | 上游同步提交             | commit message 以 `sync:` 或 `upstream:` 开头       | 同步提交            |
    | Author ≠ Committer | author 和 committer 名字不同                         | 可能是 cherry-pick |
    | 文档/配置提交            | commit message 以 `docs:` `chore:` `style:`   开头 | 非功能提交           |

    **输出**：只展示过滤后的真实开发提交

2. **智能检测项目状态**
    
    - 检测项目是否在开发中（如：有未合并的分支）
    - **根据 framework-config.json 排除框架模块**：
      -  ruoyi-system（系统管理，29个功能）
