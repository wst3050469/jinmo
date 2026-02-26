# 配置GitHub SSH密钥 - 操作指南

## 📋 您需要做的（只需2分钟）

### 步骤1：登录GitHub

访问：https://github.com/wst3050469/jinmo/settings/keys

或者：
1. 登录GitHub
2. 点击右上角头像
3. 选择"Settings"
4. 左侧菜单选择"SSH and GPG keys"

### 步骤2：添加SSH密钥

1. 点击"New SSH key"按钮
2. 填写信息：
   - **Title**: SCMS Deploy AI
   - **Key**: 复制下面的公钥（包括 ssh-ed25519 开头）

### 步骤3：复制公钥

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEs520yBFfE6EsTVMSO/0SvecaM1b8A2IiXyEaqYu7cK deploy@scms.com
```

**重要提示**：
- 必须复制整行，包括"ssh-ed25519"开头
- 不要添加任何空格或换行
- 公钥也保存在：`workspace/projects/assets/id_ed25519.pub`

### 步骤4：保存

点击"Add SSH key"按钮

### 步骤5：完成

完成后告诉我"密钥已添加"，我会立即推送代码到GitHub。

---

## 🔍 验证是否成功

添加密钥后，我会执行以下命令测试连接：

```bash
ssh -T git@github.com
```

如果成功，会显示：
```
Hi wst3050469! You've successfully authenticated, but GitHub does not provide shell access.
```

---

## ❓ 常见问题

### Q1: 如何确认公钥复制正确？
**A**: 公钥应该以"ssh-ed25519"开头，以"deploy@scms.com"结尾，中间是一长串字符。

### Q2: 可以添加多个SSH密钥吗？
**A**: 可以，您可以为不同的设备或用途添加多个SSH密钥。

### Q3: 添加密钥后可以删除吗？
**A**: 可以，但删除后需要重新添加才能使用。

### Q4: 密钥安全吗？
**A**: 非常安全。公钥是可以公开的，只有私钥是保密的。

---

## 📝 完成后的操作流程

完成SSH密钥配置后，我会执行：

1. 测试SSH连接
2. 推送代码到GitHub
3. 创建版本标签
4. 生成初始化报告
5. 通知您Git仓库已就绪

---

**准备好了吗？添加好密钥后告诉我！** 🚀
