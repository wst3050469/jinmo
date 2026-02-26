# 开发AI Git 快速参考卡片

## 🚀 日常操作速查

### 克隆仓库（首次）
```bash
git clone git@github.com:wst3050469/jinmo.git
cd jinmo
```

### 拉取最新代码
```bash
git pull origin main
```

### 提交代码
```bash
git status              # 查看修改
git add .               # 添加所有修改
git commit -m "feat: 功能描述"  # 提交
git push origin main    # 推送到远程
```

### 创建版本标签
```bash
git tag -a v1.0.1 -m "版本说明"
git push origin v1.0.1
```

---

## 📝 提交信息格式

### 类型
- `feat:` - 新增功能
- `fix:` - 修复bug
- `docs:` - 文档更新
- `style:` - 代码格式
- `refactor:` - 代码重构
- `test:` - 测试相关
- `chore:` - 构建/工具

### 示例
```bash
# ✅ 好的提交信息
git commit -m "feat: 新增用户登录功能"

# ❌ 不好的提交信息
git commit -m "update"
git commit -m "fix bug"
```

---

## 🔄 完整工作流程

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 创建功能分支
git checkout -b feature/new-feature

# 3. 开发代码...

# 4. 提交代码
git add .
git commit -m "feat: 新功能描述"
git push origin feature/new-feature

# 5. 合并到main
git checkout main
git merge feature/new-feature
git push origin main

# 6. 创建版本标签
git tag -a v1.0.1 -m "版本说明"
git push origin v1.0.1

# 7. 通知部署AI（通过知识库）
```

---

## 🔍 常用命令

### 查看状态
```bash
git status              # 查看修改的文件
git log --oneline -5    # 查看最近5次提交
git diff                # 查看具体修改
```

### 分支操作
```bash
git branch              # 查看所有分支
git branch -r           # 查看远程分支
git checkout -b feature/xxx  # 创建并切换分支
git merge feature/xxx   # 合并分支
```

### 版本标签
```bash
git tag -l              # 查看所有标签
git show v1.0.1         # 查看标签详情
```

### 撤销操作
```bash
git restore file.txt    # 撤销工作区修改
git reset --soft HEAD~1  # 撤销提交（保留修改）
git reset --hard HEAD~1  # 撤销提交（删除修改，慎用）
```

---

## ⚠️ 常见问题速解

### 推送失败：权限问题
```bash
# 测试SSH连接
ssh -T git@github.com

# 如果失败，检查SSH密钥配置
```

### 拉取失败：本地冲突
```bash
# 方案1：先提交本地修改
git add .
git commit -m "临时保存"
git pull origin main

# 方案2：暂存本地修改
git stash
git pull origin main
git stash pop
```

### 推送失败：远程有新提交
```bash
# 先拉取远程更新
git pull origin main

# 解决冲突后
git add .
git commit -m "解决冲突"
git push origin main
```

---

## 📦 版本号规范

```
v主版本号.次版本号.修订号

v1.0.0  - 初始版本
v1.0.1  - 修复bug（修订号+1）
v1.1.0  - 新增功能（次版本号+1）
v2.0.0  - 重大更新（主版本号+1）
```

---

## 🎯 提交前检查清单

- [ ] `git status` - 查看修改的文件
- [ ] `git diff` - 查看具体修改
- [ ] 编写清晰的提交信息
- [ ] 确认没有提交敏感文件
- [ ] `git pull origin main` - 拉取远程更新

---

## 📞 联系信息

- **仓库地址**: https://github.com/wst3050469/jinmo
- **SSH地址**: git@github.com:wst3050469/jinmo.git
- **知识库**: `yongyi_system_docs`
- **部署通知**: 知识库标记 `[部署]`

---

## 📚 详细文档

查看完整文档：`开发AI-Git使用指南.md`

---

**版本**: v1.0
**适用对象**: 开发AI（扣子/PMO Agent）
