# SCMS项目：部署AI与开发AI沟通协议

## 文档信息
- **版本**: v1.0
- **创建日期**: 2026-02-26
- **适用范围**: SCMS施工综合管理系统项目
- **签署双方**:
  - **开发AI**: 扣子/PMO Agent（字节跳动旗下产品）
  - **部署AI**: Vibe Coding 前端专家/全栈工程师（字节跳动旗下产品）

---

## 1. 协议概述

### 1.1 目标
建立开发AI与部署AI之间高效、可靠的沟通机制，确保SCMS项目代码开发与部署流程无缝衔接，实现自动化、标准化的协同工作。

### 1.2 基本原则
- **透明性**: 所有变更和状态变化必须及时同步
- **可靠性**: 关键操作必须有确认和验证机制
- **自动化**: 减少人工干预，依赖标准化流程
- **可追溯**: 所有操作和沟通记录必须可查询
- **容错性**: 异常情况必须有明确的处理流程

---

## 2. 角色与职责

### 2.1 开发AI（扣子/PMO Agent）
**职责范围:**
- 代码开发与编写（Spring Boot后端、Vue 3前端）
- 数据库设计与DDL脚本生成
- 配置文件准备（生产环境配置模板）
- 部署脚本编写（deploy-backend.sh、deploy-frontend.sh等）
- 验证脚本编写（verify-deployment.sh）
- 交接目录创建与文件组织
- 部署就绪标志触发
- 知识库实时更新

**禁止事项:**
- 直接修改生产服务器配置
- 直接执行生产环境部署命令
- 修改部署AI的监控脚本
- 越过部署AI直接操作生产环境

### 2.2 部署AI（Vibe Coding）
**职责范围:**
- 服务器环境准备与配置
- SSH密钥管理与服务器连接
- 部署标志文件监控
- 部署脚本执行与日志记录
- 服务启动与停止
- 部署验证与测试
- 异常处理与回滚
- 知识库状态更新

**禁止事项:**
- 修改源代码
- 修改业务逻辑
- 修改数据库设计
- 修改前端界面
- 越过开发AI直接提交代码

---

## 3. 数据共享机制

### 3.1 共享数据源

#### 3.1.1 知识库（主要沟通渠道）
- **数据集名称**: `yongyi_system_docs`
- **访问方式**: 双方通过 coze-coding-dev-sdk SDK 访问
- **更新规则**:
  - 开发AI完成代码 → 更新知识库
  - 部署AI完成部署 → 更新知识库
  - 异常发生 → 双方更新知识库

#### 3.1.2 文件系统（部署交接）
- **交接目录**: `handover/`
- **触发标志**: `handover/deploy_ready.flag`
- **状态文件**: `handover/status.json`
- **日志文件**: `handover/deploy_failed.log`

#### 3.1.3 服务器环境
- **服务器**: 120.55.5.220
- **SSH认证**: jinmo.pem（由部署AI管理）
- **访问权限**: 仅部署AI有直接访问权限

### 3.2 数据同步策略

#### 3.2.1 双向同步流程
```
开发AI                     知识库                     部署AI
   |                          |                          |
   |--[1.完成代码开发]------->|                          |
   |                          |                          |
   |--[2.更新知识库]--------->|                          |
   |                          |                          |
   |                          |--[3.检测到更新]--------->|
   |                          |                          |
   |                          |                          |--[4.读取知识库]
   |                          |                          |
   |                          |                          |--[5.创建交接目录]
   |                          |                          |
   |                          |--[6.等待deploy_ready]----|
   |                          |                          |
   |--[7.创建deploy_ready]->|                          |
   |                          |                          |
   |                          |--[8.检测到标志]--------->|
   |                          |                          |
   |                          |                          |--[9.开始部署]
   |                          |                          |
   |                          |<--[10.部署完成/失败]-----|
   |                          |                          |
   |<--[11.更新知识库]-------|                          |
   |                          |                          |
   |--[12.读取结果]----------|                          |
```

#### 3.2.2 同步频率
- **开发AI**: 每次任务完成时立即更新
- **部署AI**: 每次执行任务后立即更新
- **监控频率**: 部署AI每60秒检查一次 `deploy_ready.flag`

### 3.3 消息格式规范

#### 3.3.1 知识库消息格式
开发AI每次更新知识库应包含以下信息：

```markdown
## 更新通知 v{版本号}

**更新时间**: YYYY-MM-DD HH:MM:SS
**更新内容**:
- [ ] 完成xxx模块开发
- [ ] 更新xxx配置文件
- [ ] 创建xxx部署脚本

**交付物**:
- handover/sources/scms-backend-{version}.tar.gz
- handover/sources/scms-frontend-{version}.tar.gz
- handover/configs/application-prod.yml
- handover/scripts/deploy-backend.sh
- handover/scripts/verify-deployment.sh

**部署要求**:
- 执行顺序: backend → frontend → verify
- 环境变量: DB_PASSWORD, OSS_KEY, WECHAT_SECRET
- 回滚方案: 保留上一版本3天

**注意事项**:
- 数据库需要执行迁移脚本
- 前端需要重新构建
```

#### 3.3.2 状态文件格式
`handover/status.json` 记录实时部署状态：

```json
{
  "version": "20260226-1200",
  "status": "deploying",
  "current_step": "backend_deployment",
  "progress": {
    "total": 5,
    "completed": 2,
    "failed": 0
  },
  "steps": [
    {
      "name": "environment_check",
      "status": "completed",
      "timestamp": "2026-02-26T12:00:00Z"
    },
    {
      "name": "backend_deployment",
      "status": "in_progress",
      "timestamp": "2026-02-26T12:05:00Z"
    },
    {
      "name": "frontend_deployment",
      "status": "pending",
      "timestamp": null
    },
    {
      "name": "verification",
      "status": "pending",
      "timestamp": null
    },
    {
      "name": "cleanup",
      "status": "pending",
      "timestamp": null
    }
  ],
  "error": null,
  "start_time": "2026-02-26T12:00:00Z",
  "end_time": null
}
```

---

## 4. 沟通流程

### 4.1 开发AI → 部署AI（部署请求）

**触发条件**: 开发AI完成代码开发并准备部署

**操作步骤**:
1. **更新知识库**（必需）
   ```bash
   npx tsx write-deploy-notification.ts "完成营销模块开发，准备部署"
   ```

2. **创建交接目录**（必需）
   ```bash
   mkdir -p handover/{sources,configs,scripts,docs,artifacts}
   echo "20260226-1200" > handover/version.txt
   ```

3. **打包代码**（必需）
   ```bash
   tar -czf handover/sources/scms-backend-20260226-1200.tar.gz src/scms-backend/
   tar -czf handover/sources/scms-frontend-20260226-1200.tar.gz src/scms-frontend/
   ```

4. **复制配置和脚本**（必需）
   ```bash
   cp configs/application-prod.yml handover/configs/
   cp scripts/deploy-backend.sh handover/scripts/
   cp scripts/verify-deployment.sh handover/scripts/
   ```

5. **创建README**（必需）
   ```bash
   cat > handover/README.md <<EOF
   # 交接清单 v20260226-1200
   ## 本次更新模块
   - 营销推广模块前端集成
   - 营销推广模块后端API

   ## 部署步骤
   1. 执行 scripts/deploy-backend.sh
   2. 执行 scripts/deploy-frontend.sh
   3. 运行 scripts/verify-deployment.sh
   EOF
   ```

6. **创建部署标志**（触发部署）
   ```bash
   touch handover/deploy_ready.flag
   ```

7. **记录到知识库**（必需）
   ```bash
   npx tsx write-deploy-ready.ts "已创建deploy_ready.flag，等待部署"
   ```

### 4.2 部署AI → 开发AI（部署结果）

**触发条件**: 部署完成（成功或失败）

**操作步骤**:

**部署成功时**:
1. 更新 `handover/status.json` 为 `"status": "success"`
2. 执行 `scripts/verify-deployment.sh` 验证
3. 删除 `handover/deploy_ready.flag`
4. 写入知识库
   ```bash
   npx tsx write-deploy-result.ts "部署成功，版本20260226-1200已上线"
   ```

**部署失败时**:
1. 更新 `handover/status.json` 为 `"status": "failed"`
2. 写入错误日志 `handover/deploy_failed.log`
3. 保留 `handover/deploy_ready.flag`
4. 写入知识库
   ```bash
   npx tsx write-deploy-result.ts "部署失败，错误信息见deploy_failed.log"
   ```

### 4.3 紧急沟通（异常情况）

**适用场景**:
- 部署失败需要开发AI介入
- 服务器异常需要紧急处理
- 安全漏洞需要立即修复

**沟通方式**:
1. 在知识库中创建紧急通知文档
   ```bash
   npx tsx write-emergency.ts "紧急：数据库连接失败，需要开发AI检查配置"
   ```

2. 标题格式: `[紧急] {问题描述}`
3. 内容包含: 问题、影响、建议解决方案

---

## 5. 同步检查点

### 5.1 每日同步
**时间**: 每日 09:00（UTC+8）
**内容**:
- 昨日完成的任务
- 今日计划的任务
- 遇到的问题和风险

**执行方式**:
- 开发AI读取知识库，创建"每日同步"文档
- 部署AI读取并更新部署状态

### 5.2 版本同步
**触发**: 每次部署完成后
**内容**:
- 部署的版本号
- 部署的模块列表
- 部署结果（成功/失败）
- 验证结果

**执行方式**:
- 部署AI更新知识库中的版本记录
- 开发AI读取并确认

### 5.3 问题同步
**触发**: 发现任何异常或问题
**内容**:
- 问题描述
- 问题等级（严重/高/中/低）
- 影响范围
- 当前状态
- 解决进度

**执行方式**:
- 发现方立即写入知识库
- 相关方读取并响应

---

## 6. 响应时间要求

| 场景 | 响应时间 | 处理时间 |
|------|---------|---------|
| 部署请求检测 | < 1分钟 | 检测到标志即开始 |
| 部署完成通知 | < 5分钟 | 部署完成后立即 |
| 紧急问题响应 | < 10分钟 | 接到通知后立即 |
| 日常查询响应 | < 30分钟 | 知识库查询 |
| 非紧急问题处理 | < 4小时 | 正常处理流程 |

---

## 7. 异常处理流程

### 7.1 部署失败
1. **部署AI**:
   - 记录错误到 `handover/deploy_failed.log`
   - 保留 `deploy_ready.flag`
   - 尝试执行 `scripts/rollback.sh` 回滚
   - 更新知识库通知开发AI

2. **开发AI**:
   - 读取错误日志
   - 修复问题
   - 重新创建 `deploy_ready.flag`

### 7.2 服务器异常
1. **部署AI**:
   - 立即写入知识库紧急通知
   - 尝试恢复服务
   - 如无法解决，通知开发AI

2. **开发AI**:
   - 评估影响范围
   - 提供技术支持
   - 决定是否需要回滚

### 7.3 沟通中断
1. **触发条件**: 超过2小时未收到响应
2. **处理方式**:
   - 在知识库中创建 `[超时提醒]` 文档
   - 等待对方响应
   - 如继续无响应，升级处理

---

## 8. 验证机制

### 8.1 开发AI自检（部署前）
- [ ] 代码编译通过
- [ ] 单元测试通过
- [ ] 配置文件语法正确
- [ ] 部署脚本可执行
- [ ] 验证脚本完整
- [ ] 知识库已更新
- [ ] 交接目录已创建

### 8.2 部署AI检查（部署中）
- [ ] 环境变量已配置
- [ ] 服务端口可用
- [ ] 数据库连接正常
- [ ] 磁盘空间充足
- [ ] 依赖服务运行正常
- [ ] 备份已完成

### 8.3 联合验证（部署后）
- [ ] 健康检查API返回200
- [ ] 核心业务功能正常
- [ ] 日志无严重错误
- [ ] 性能指标正常
- [ ] 用户访问正常

---

## 9. 协议生效与修订

### 9.1 生效条件
- 双方均确认理解本协议
- 双方已执行一次完整的部署流程
- 验证沟通机制正常工作

### 9.2 修订流程
- 任何一方提出修订建议
- 双方讨论并达成一致
- 更新协议版本号
- 更新知识库
- 通知对方生效

### 9.3 版本历史
- v1.0 (2026-02-26): 初始版本，建立基础沟通机制

---

## 10. 附录

### 10.1 常用命令清单

**开发AI常用命令**:
```bash
# 更新知识库
npx tsx write-deploy-notification.ts "消息内容"

# 创建交接目录
mkdir -p handover/{sources,configs,scripts,docs,artifacts}
echo "20260226-1200" > handover/version.txt

# 创建部署标志
touch handover/deploy_ready.flag

# 读取部署状态
npx tsx read-knowledge.ts
```

**部署AI常用命令**:
```bash
# 检查部署标志
ls -la handover/deploy_ready.flag

# 监控部署状态
watch -n 60 'cat handover/status.json'

# 查看部署日志
tail -f /var/log/scms-backend/deploy.log

# 更新知识库
npx tsx write-deploy-result.ts "部署结果"
```

### 10.2 联系方式
- **主要沟通渠道**: 知识库 `yongyi_system_docs`
- **紧急沟通**: 知识库标记 `[紧急]`
- **文档查询**: 通过SDK搜索知识库

### 10.3 相关文档
- [SCMS协同开发协议](#7610982661604589594)
- [SCMS部署完整指南](#7610982661604590054)
- [SCMS数据共享与触发部署方案](#7610984250296467482)
- [SCMS部署文件清单](#7610967999155126281)

---

**签署**:
- 开发AI（扣子/PMO Agent）: [需确认]
- 部署AI（Vibe Coding）: [已确认]

**生效日期**: 2026-02-26
