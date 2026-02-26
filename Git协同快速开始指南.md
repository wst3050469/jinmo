# Git协同快速开始指南

## 🎯 5分钟快速上手

### 第一步：创建Git仓库（你需要做的）

**操作步骤**：

1. **注册GitHub账号**（如果没有）
   - 访问：https://github.com
   - 点击右上角"Sign up"
   - 填写信息并完成注册

2. **创建新仓库**
   - 登录GitHub后，点击右上角的"+"号
   - 选择"New repository"
   - 填写信息：
     ```
     Repository name: scms-project
     Description: 施工综合管理系统
     选择: Private（私有，更安全）
     ```
   - 点击"Create repository"
   - **复制仓库地址**，格式类似：
     ```
     https://github.com/你的用户名/scms-project.git
     ```

3. **配置访问权限**
   - 点击仓库的"Settings"选项卡
   - 左侧菜单选择"Collaborators"
   - 点击"Add people"
   - 输入：`scms-deploy-ai`
   - 给予"Write"权限

**完成！现在告诉我仓库地址**

---

### 第二步：初始化代码库（部署AI会做的）

你提供仓库地址后，部署AI会自动执行：

```bash
bash scripts/init-git-repo.sh https://github.com/你的用户名/scms-project.git
```

这个过程会：
1. 初始化Git仓库
2. 上传现有代码
3. 创建初始版本
4. 配置访问权限

---

### 第三步：日常协同（以后每天的操作）

#### 开发AI（扣子）的操作流程

```
1. 开发代码（比如：营销推广模块）
   ↓
2. 提交代码
   git add .
   git commit -m "feat: 完成营销推广模块"
   git push
   ↓
3. 创建版本标签（可选）
   git tag -a v1.0.1 -m "营销推广模块v1.0.1"
   git push origin v1.0.1
   ↓
4. 通知部署AI
   "代码已上传到Git仓库，版本v1.0.1，请部署"
```

**提交信息格式**：
```
feat: 新增功能
fix: 修复bug
docs: 文档更新
style: 代码格式
refactor: 代码重构
test: 测试相关
chore: 构建工具
```

#### 部署AI（Vibe Coding）的操作流程

```
1. 收到通知
   ↓
2. 下载最新代码
   git pull
   ↓
3. 查看变更
   git log -1
   ↓
4. 部署到服务器
   bash scripts/deploy-backend.sh
   bash scripts/deploy-frontend.sh
   ↓
5. 验证结果
   检查服务状态
   测试功能
   ↓
6. 通知开发AI
   "部署成功，版本v1.0.1已上线"
```

---

## 📋 常用命令速查

### 查看状态
```bash
git status              # 查看修改的文件
git log --oneline       # 查看提交历史
git log -5              # 查看最近5次提交
```

### 提交代码
```bash
git add .               # 添加所有文件
git commit -m "说明"    # 提交代码
git push                # 推送到远程仓库
```

### 下载代码
```bash
git pull                # 下载最新代码
git fetch               # 获取远程更新（不合并）
```

### 版本标签
```bash
git tag                 # 查看所有标签
git tag -a v1.0.1 -m "说明"  # 创建标签
git push origin v1.0.1  # 推送标签
```

### 版本对比
```bash
git diff v1.0.0 v1.0.1    # 对比两个版本
bash scripts/git-diff-helper.sh v1.0.0 v1.0.1  # 使用对比工具
```

---

## 🔧 使用辅助脚本

### 开发AI提交助手
```bash
bash scripts/git-commit-helper.sh
```
功能：
1. 自动检查修改的文件
2. 提示输入提交信息
3. 自动提交和推送
4. 生成部署通知

### 部署AI下载助手
```bash
bash scripts/git-pull-helper.sh
```
功能：
1. 自动检查远程更新
2. 下载最新代码
3. 显示变更统计
4. 生成部署信息
5. 可选：立即部署

### 版本对比工具
```bash
bash scripts/git-diff-helper.sh v1.0.0 v1.0.1
```
功能：
1. 对比两个版本
2. 显示变更统计
3. 生成对比报告

### 列出所有版本
```bash
bash scripts/git-diff-helper.sh --list
```

---

## 📊 版本号规范

使用语义化版本号：
```
v主版本号.次版本号.修订号

示例：
v1.0.0    - 初始版本
v1.0.1    - 修复bug（修订号+1）
v1.1.0    - 新增功能（次版本号+1）
v2.0.0    - 重大更新（主版本号+1）
```

---

## ⚠️ 注意事项

### ✅ 应该做的
1. **每次提交都有清晰的说明**
2. **使用语义化版本号**
3. **定期从Git仓库拉取最新代码**
4. **部署前查看变更内容**
5. **记录部署日志**

### ❌ 不应该做的
1. **不要提交敏感信息**（密码、密钥等）
2. **不要提交编译输出**（target/、dist/等）
3. **不要提交临时文件**（*.tmp、*.log等）
4. **不要直接修改已发布的版本标签**
5. **不要在主分支上直接开发**（建议使用功能分支）

---

## 🆘 常见问题

### Q1: 推送失败，提示"Permission denied"
**A**: 检查是否有仓库访问权限，联系仓库管理员添加权限。

### Q2: 拉取失败，提示"Your local changes would be overwritten"
**A**:
```bash
git add .
git commit -m "临时保存"
git pull
```

### Q3: 如何撤销上次提交？
**A**:
```bash
# 撤销提交但保留修改
git reset --soft HEAD~1

# 撤销提交并删除修改（谨慎使用）
git reset --hard HEAD~1
```

### Q4: 如何查看某个版本的代码？
**A**:
```bash
git show v1.0.1 --stat
git checkout v1.0.1  # 切换到该版本
```

### Q5: 如何回滚到之前的版本？
**A**:
```bash
git revert v1.0.1  # 创建新提交回滚
# 或
git reset --hard v1.0.1  # 硬回滚（谨慎使用）
```

---

## 📞 获取帮助

### 查看详细文档
- Git官方文档：https://git-scm.com/doc
- GitHub使用指南：https://docs.github.com/

### 联系方式
- 知识库：`yongyi_system_docs`
- 部署AI通知：`[部署]`
- 开发AI通知：`[更新]`

---

## ✅ 检查清单

### 首次设置
- [ ] 创建GitHub账号
- [ ] 创建Git仓库（scms-project）
- [ ] 复制仓库地址
- [ ] 配置访问权限
- [ ] 通知部署AI仓库地址

### 日常开发
- [ ] 开发完成 → 提交代码
- [ ] 创建版本标签
- [ ] 通知部署AI
- [ ] 部署AI下载代码
- [ ] 部署到服务器
- [ ] 验证部署结果

---

## 🎯 总结

**Git协同就是**：
1. 你创建一个云端仓库（一次操作）
2. 开发AI上传代码到仓库（日常操作）
3. 部署AI从仓库下载代码并部署（日常操作）
4. 所有历史记录都保存在仓库里

**现在你需要做的**：
1. 创建GitHub账号（如果没有）
2. 创建一个仓库：scms-project
3. 把仓库地址告诉我：`https://github.com/你的用户名/scms-project.git`

**之后的所有操作都会自动化！**

---

**版本**: v1.0
**创建日期**: 2026-02-26
**数据集**: yongyi_system_docs
